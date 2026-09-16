/**
 * Stage 1 of the enrichment pipeline: find the one official document a region
 * publishes for a tier. The only stage that needs tools, and it runs once per
 * region per tier — about forty calls for the whole of Italy.
 *
 *   node scripts/seasonable-enrich/discover.mjs <region> <pat|calendar> [--model m]
 *
 * The model gets web search, web fetch and `curl` for HEAD checks, nothing that
 * writes. It returns JSON; this script checks every URL answers 200 and has a
 * path, then writes <region>/source-<tier>.json with `confirmed: false`. A
 * human confirms the publisher is official at ship time — twenty-odd URLs, the
 * cheapest review in the whole pipeline and the one that matters most, because
 * every candidate from a region rests on it.
 *
 * A region where nothing official exists gets a source file with no documents
 * and a note, which the runner treats as a finished unit: silence is a result.
 */

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { regions } from '../../src/content/seasonable/geography.ts';
import { callModel, readJson, regionDir, today, writeJson } from './lib.mjs';

const SYSTEM = readFileSync(fileURLToPath(new URL('./discover-prompt.md', import.meta.url)), 'utf8');

function answers(url) {
  const r = spawnSync('curl', ['-sSIL', '--max-time', '30', '-A', 'Mozilla/5.0', '-o', '/dev/null', '-w', '%{http_code}', url], { encoding: 'utf8' });
  return r.stdout.trim();
}

export async function discover(region, tier, model = process.env.SEASONABLE_DISCOVER_MODEL ?? 'sonnet') {
  const file = join(regionDir(region), `source-${tier}.json`);
  const existing = readJson(file, null);
  if (existing) return existing;

  const name = regions.find((r) => r.id === region)?.it ?? region;
  const { text } = await callModel({
    region,
    stage: `discover:${tier}`,
    model,
    effort: 'low',
    system: SYSTEM,
    prompt: `Region: ${name} (${region}). Tier: ${tier}. Today is ${today()}.`,
    tools: 'WebSearch,WebFetch,Bash',
    allow: ['WebSearch', 'WebFetch', 'Bash(curl:*)'],
    budgetUsd: Number(process.env.SEASONABLE_DISCOVER_BUDGET_USD ?? 0.3),
  });

  const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  let found;
  try {
    found = JSON.parse(json);
  } catch {
    throw new Error(`${region}: discovery returned no JSON: ${text.slice(0, 300)}`);
  }

  const documents = [];
  const rejected = [];
  for (const doc of found.documents ?? []) {
    let problem = null;
    try {
      if (new URL(doc.url).pathname.length <= 1) problem = 'bare origin';
    } catch {
      problem = 'does not parse';
    }
    const status = problem ? null : answers(doc.url);
    if (!problem && status !== '200') problem = `HTTP ${status || 'no answer'}`;
    if (problem) rejected.push({ url: doc.url, problem });
    else documents.push({ ...doc, printedYear: Number.isInteger(doc.printedYear) ? doc.printedYear : null });
  }

  const source = {
    region,
    tier,
    foundBy: `${model} discovery, ${today()}`,
    confirmed: false,
    documents,
    triedUrls: found.triedUrls ?? [],
    rejectedUrls: rejected,
    note: found.note ?? null,
  };
  writeJson(file, source);
  return source;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [region, tier = 'pat'] = process.argv.slice(2);
  const i = process.argv.indexOf('--model');
  const s = await discover(region, tier, i === -1 ? undefined : process.argv[i + 1]);
  console.log(`${region} ${tier}: ${s.documents.length} documents${s.rejectedUrls?.length ? `, ${s.rejectedUrls.length} URLs failed the check` : ''} — ${s.note ?? ''}`);
  for (const d of s.documents) console.log(`  ${d.url}  ${d.title}`);
}
