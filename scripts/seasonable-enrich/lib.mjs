/**
 * Shared plumbing for the Seasonable enrichment pipeline: paths, the calendar
 * term the pre-filter looks for, text normalisation for the verbatim-quote
 * check, and the one way this pipeline calls a model.
 *
 * WHY EVERY CALL IS STRIPPED
 * The first pilot ran the worker as a normal Claude Code agent and paid a
 * ~105k-token fixed prompt per invocation — the default system prompt, tool
 * schemas, the skills list, every MCP server — then re-read its own growing
 * context on each of 41 turns. $2.61 for eight schede. With a custom system
 * prompt, no tools, no MCP, no skills and no settings files, the same call's
 * fixed overhead measured 424 tokens. `callModel` is that stripped call, and
 * nothing in this pipeline calls `claude` any other way.
 */

import { spawn } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

export const ROOT = '.pipeline/seasonable/enrich';
export const regionDir = (region) => join(ROOT, region);
export const corpusDir = (region) => join(ROOT, region, 'corpus');

export const today = () => new Date().toISOString().slice(0, 10);

export const MONTHS = [
  'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
];

/**
 * A calendar term: anything a harvest window could be written in. A page with
 * none of these cannot state a window (invariant 5 — "in autunno" is not one),
 * so it is never sent to a model.
 */
export const CALENDAR_TERM = new RegExp(
  `\\b(${MONTHS.join('|')}|decade|quindicina)\\b|\\b\\d{1,2}\\s*/\\s*\\d{1,2}\\b`,
  'i',
);

/** For comparing a quote against page text: one space, straight quotes, no soft hyphen breaks. */
export function normalise(text) {
  return text
    .replace(/­/g, '')
    .replace(/(\w)-\s*\n\s*(\w)/g, '$1$2')
    .replace(/[’‘]/g, "'")
    .replace(/[“”«»]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function readJson(file, fallback) {
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : fallback;
}

export function writeJson(file, value) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
}

export function readJsonl(file) {
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
}

export function appendJsonl(file, records) {
  if (records.length === 0) return;
  mkdirSync(dirname(file), { recursive: true });
  appendFileSync(file, records.map((r) => JSON.stringify(r)).join('\n') + '\n');
}

/**
 * One stripped, single-shot model call. The prompt goes on stdin because a
 * batch of pages is far past any argv limit.
 *
 * Returns the text, the cost the CLI reports, and the usage block, and appends
 * a line to <region>/costs.jsonl so `enrich:status` can price every stage.
 */
export function callModel({ region, stage, model, effort, system, prompt, tools = '', allow = [], budgetUsd = 0.5, timeoutMs = 15 * 60_000 }) {
  const args = [
    '-p',
    '--model', model,
    '--tools', tools,
    '--strict-mcp-config',
    '--disable-slash-commands',
    '--no-session-persistence',
    '--setting-sources', '',
    '--system-prompt', system,
    '--output-format', 'json',
    '--max-budget-usd', String(budgetUsd),
  ];
  if (effort) args.push('--effort', effort);
  // `tools` names what exists; `allow` scopes it (e.g. Bash(curl:*)). dontAsk refuses the rest.
  if (tools) args.push('--permission-mode', 'dontAsk', '--allowedTools', ...(allow.length ? allow : tools.split(',')));

  return new Promise((resolve, reject) => {
    const child = spawn('claude', args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    const timer = setTimeout(() => child.kill('SIGTERM'), timeoutMs);
    child.on('close', (code) => {
      clearTimeout(timer);
      let r;
      try {
        r = JSON.parse(out);
      } catch {
        return reject(new Error(`claude exited ${code} with no JSON: ${(err || out).slice(0, 500)}`));
      }
      const cost = r.total_cost_usd ?? 0;
      appendJsonl(join(regionDir(region), 'costs.jsonl'), [{
        at: new Date().toISOString(), stage, model, effort: effort ?? null, costUsd: cost,
        input: r.usage?.input_tokens, cacheRead: r.usage?.cache_read_input_tokens,
        cacheWrite: r.usage?.cache_creation_input_tokens, output: r.usage?.output_tokens,
        error: r.is_error ? r.subtype : null,
      }]);
      if (r.is_error) return reject(new Error(`claude reported ${r.subtype}: ${String(r.result).slice(0, 300)}`));
      resolve({ text: r.result ?? '', cost, usage: r.usage });
    });
    child.stdin.end(prompt);
  });
}

/** JSON lines out of a model reply, tolerating code fences and stray prose. */
export function parseJsonLines(text) {
  const records = [];
  const junk = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('```')) continue;
    try {
      records.push(JSON.parse(line));
    } catch {
      junk.push(line);
    }
  }
  return { records, junk };
}
