/**
 * The Seasonable enrichment sweep: a resumable background loop that works the
 * dataset region by region through new source tiers, one headless Claude Code
 * invocation at a time.
 *
 *   node scripts/seasonable-enrich.mjs            run until the queue is empty
 *   node scripts/seasonable-enrich.mjs status     print the queue and what it has staged
 *   node scripts/seasonable-enrich.mjs once       run a single invocation, then stop
 *
 * Run it from the worktree on branch `seasonable/enrich`, never from the main
 * checkout — the music refresh commits to main on its own schedule, and this
 * loop commits after every batch:
 *
 *   git worktree add ../walterwebsite-enrich -b seasonable/enrich
 *   cd ../walterwebsite-enrich && npm ci
 *   caffeinate -i nohup npm run enrich:seasonable > .pipeline/seasonable/enrich/logs/runner.log 2>&1 &
 *
 * WHAT IT DOES AND DOES NOT DO
 * It stages. Each invocation runs the `seasonable-enrichment` skill, which
 * writes ledger prose and candidate rows under .pipeline/seasonable/enrich/
 * <region>/ and nothing else. Nothing here edits src/: moving a candidate onto
 * the page is a supervised step, because the failure the sourcing skill warns
 * about hardest — a quote that is accurate but not the whole sentence — passes
 * every mechanical check there is.
 *
 * That boundary is enforced three times, not asked for once: the tool allowlist
 * scopes Write and Edit to the enrich folder, a deny rule covers src/, and after
 * every invocation this script checks `git status` and throws away anything the
 * worker left outside the folder, blocking the unit.
 *
 * STATE
 * Everything that makes the loop resumable is a file: queue.json for units,
 * <region>/pat-index.json for products, <region>/status-<tier>.json for how the
 * last invocation left a unit. Kill it at any point and start it again.
 *
 * QUEUE ORDER
 * Computed once, on the first run, from the shipped dataset: regions that
 * answer nothing first, then regions by how many of their provinces are silent,
 * then the rest for density. Within a region, PAT before the calendar.
 */

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { provinces, regions } from '../src/content/seasonable/geography.ts';
import { windows } from '../src/content/seasonable/windows.ts';

const ROOT = '.pipeline/seasonable/enrich';
const QUEUE = join(ROOT, 'queue.json');
const LOGS = join(ROOT, 'logs');

const BUDGET_USD = process.env.SEASONABLE_BUDGET_USD ?? '4';
const TIMEOUT_MS = Number(process.env.SEASONABLE_TIMEOUT_MIN ?? 40) * 60_000;
const PAUSE_MS = Number(process.env.SEASONABLE_PAUSE_S ?? 60) * 1000;
const MAX_ATTEMPTS = 3;
const MAX_CONSECUTIVE_BLOCKED = 3;
const TIERS = ['pat', 'calendar'];

const ALLOWED_TOOLS = [
  'Skill', 'Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch',
  `Write(./${ROOT}/**)`, `Edit(./${ROOT}/**)`,
  'Bash(curl:*)', 'Bash(pdftotext:*)', 'Bash(pdftoppm:*)', 'Bash(pdfinfo:*)',
  'Bash(mkdir:*)', 'Bash(ls:*)', 'Bash(wc:*)', 'Bash(date:*)',
  'Bash(node scripts/seasonable-candidates-check.mjs:*)',
];
const DISALLOWED_TOOLS = ['Write(./src/**)', 'Edit(./src/**)', 'Bash(git:*)', 'Bash(rm:*)', 'Agent'];

const log = (...args) => console.log(new Date().toISOString(), ...args);

// ── Queue ──────────────────────────────────────────────────────────────────

function buildQueue() {
  const answered = new Set(windows.flatMap((w) => w.provinces));
  const ranked = regions.map((r, index) => {
    const own = provinces.filter((p) => p.region === r.id);
    const silent = own.filter((p) => !answered.has(p.id));
    return { id: r.id, index, silent: silent.map((p) => p.id), wholeRegionSilent: silent.length === own.length };
  });
  ranked.sort((a, b) =>
    Number(b.wholeRegionSilent) - Number(a.wholeRegionSilent) ||
    b.silent.length - a.silent.length ||
    a.index - b.index,
  );
  return {
    createdAt: new Date().toISOString(),
    units: ranked.flatMap((r) =>
      TIERS.map((tier) => ({
        id: `${r.id}:${tier}`,
        region: r.id,
        tier,
        silentProvincesAtStart: r.silent,
        status: 'pending',
        attempts: 0,
        invocations: 0,
        costUsd: 0,
        note: null,
      })),
    ),
  };
}

function loadQueue() {
  if (!existsSync(QUEUE)) {
    mkdirSync(ROOT, { recursive: true });
    writeFileSync(QUEUE, JSON.stringify(buildQueue(), null, 2) + '\n');
  }
  return JSON.parse(readFileSync(QUEUE, 'utf8'));
}

const saveQueue = (q) => writeFileSync(QUEUE, JSON.stringify(q, null, 2) + '\n');

// ── Git ────────────────────────────────────────────────────────────────────

const git = (...args) => spawnSync('git', args, { encoding: 'utf8' });

function assertWorktree() {
  const branch = git('rev-parse', '--abbrev-ref', 'HEAD').stdout.trim();
  if (branch === 'main' && !process.env.SEASONABLE_ALLOW_MAIN) {
    console.error('Refusing to run on main. Create the worktree first:\n  git worktree add ../walterwebsite-enrich -b seasonable/enrich');
    process.exit(1);
  }
}

/** Anything changed outside the enrich folder is reverted, and reported. */
function revertStrayChanges() {
  const lines = git('status', '--porcelain', '--untracked-files=all').stdout.split('\n').filter(Boolean);
  const stray = lines.map((l) => l.slice(3)).filter((p) => !p.startsWith(ROOT));
  if (stray.length === 0) return [];
  git('checkout', '--', ...stray.filter((p) => git('ls-files', '--error-unmatch', p).status === 0));
  git('clean', '-f', '--', ...stray);
  return stray;
}

function commit(message) {
  git('add', ROOT);
  if (git('diff', '--cached', '--quiet').status === 0) return;
  git('commit', '-m', message, '-m', 'Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>');
}

// ── One invocation ─────────────────────────────────────────────────────────

function readStatus(unit) {
  const file = join(ROOT, unit.region, `status-${unit.tier}.json`);
  if (!existsSync(file)) return null;
  try {
    return { file, ...JSON.parse(readFileSync(file, 'utf8')) };
  } catch {
    return null;
  }
}

function invoke(unit) {
  mkdirSync(LOGS, { recursive: true });
  mkdirSync(join(ROOT, unit.region, 'corpus'), { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logFile = join(LOGS, `${unit.region}-${unit.tier}-${stamp}.json`);

  const args = [
    '-p', `/seasonable-enrichment ${unit.region} ${unit.tier}`,
    '--output-format', 'json',
    '--permission-mode', 'dontAsk',
    '--max-budget-usd', BUDGET_USD,
    '--allowedTools', ...ALLOWED_TOOLS,
    '--disallowedTools', ...DISALLOWED_TOOLS,
    '--append-system-prompt',
    'You are running unattended inside scripts/seasonable-enrich.mjs. Nobody can answer a question. ' +
      'Follow the seasonable-enrichment skill exactly, and always finish by writing the status file.',
  ];

  return new Promise((resolve) => {
    const child = spawn('claude', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    const timer = setTimeout(() => child.kill('SIGTERM'), TIMEOUT_MS);
    child.on('close', (code) => {
      clearTimeout(timer);
      writeFileSync(logFile, out || JSON.stringify({ stderr: err }));
      let result = null;
      try {
        result = JSON.parse(out);
      } catch {
        // A killed or crashed run leaves no JSON; the status file decides.
      }
      resolve({ code, result, logFile, stderr: err });
    });
  });
}

async function runUnit(queue, unit) {
  const before = readStatus(unit);
  if (before) writeFileSync(before.file, JSON.stringify({ ...before, file: undefined, state: 'running' }) + '\n');

  unit.status = 'in-progress';
  unit.invocations++;
  saveQueue(queue);
  log(`→ ${unit.id} (invocation ${unit.invocations})`);

  const { code, result, logFile } = await invoke(unit);
  unit.costUsd = Math.round((unit.costUsd + (result?.total_cost_usd ?? 0)) * 100) / 100;

  const stray = revertStrayChanges();
  if (stray.length) {
    unit.status = 'blocked';
    unit.note = `worker wrote outside the enrich folder, reverted: ${stray.join(', ')}`;
    saveQueue(queue);
    commit(`Block ${unit.id}: the worker wrote outside its folder`);
    log(`✗ ${unit.id} blocked — ${unit.note}`);
    return 'blocked';
  }

  const check = spawnSync('node', ['scripts/seasonable-candidates-check.mjs', unit.region], { encoding: 'utf8' });
  const status = readStatus(unit);
  const state = status?.state;

  if (check.status !== 0 || !['more', 'done', 'blocked'].includes(state)) {
    unit.attempts++;
    unit.note = check.status !== 0
      ? `validator failed: ${(check.stderr || check.stdout).split('\n').slice(0, 5).join(' | ')}`
      : `no status written (exit ${code}, log ${logFile})`;
    unit.status = unit.attempts >= MAX_ATTEMPTS ? 'blocked' : 'pending';
  } else {
    unit.attempts = 0;
    unit.note = status.note ?? null;
    unit.status = state === 'more' ? 'pending' : state;
  }
  saveQueue(queue);

  const verb = { done: 'Finish', blocked: 'Block', pending: 'Stage' }[unit.status];
  const [region, tier] = [unit.region, unit.tier === 'pat' ? 'PAT' : 'calendar'];
  commit(`${verb} ${tier} candidates for ${region}, invocation ${unit.invocations}`);
  log(`${unit.status === 'blocked' ? '✗' : '✓'} ${unit.id} → ${unit.status}${unit.note ? ` — ${unit.note}` : ''} ($${unit.costUsd})`);
  return unit.status;
}

// ── Status ─────────────────────────────────────────────────────────────────

function printStatus() {
  const queue = loadQueue();
  const totals = { candidate: 0, silent: 0, rejected: 0 };
  let cost = 0;
  const rows = queue.units.map((u) => {
    const file = join(ROOT, u.region, 'candidates.jsonl');
    const counts = { candidate: 0, silent: 0, rejected: 0 };
    const reached = new Set();
    if (existsSync(file)) {
      for (const line of readFileSync(file, 'utf8').split('\n').filter(Boolean)) {
        try {
          const r = JSON.parse(line);
          if (r.tier !== u.tier) continue;
          counts[r.verdict] = (counts[r.verdict] ?? 0) + 1;
          if (r.verdict === 'candidate') for (const p of r.provinces) if (u.silentProvincesAtStart.includes(p)) reached.add(p);
        } catch {
          // The validator reports malformed lines; status only counts.
        }
      }
    }
    for (const k of Object.keys(totals)) totals[k] += counts[k];
    cost += u.costUsd;
    return [
      u.id.padEnd(34), u.status.padEnd(12),
      String(counts.candidate).padStart(4), String(counts.silent).padStart(5), String(counts.rejected).padStart(5),
      `${reached.size}/${u.silentProvincesAtStart.length}`.padStart(8), `$${u.costUsd}`.padStart(8),
      u.note ? `  ${u.note.slice(0, 60)}` : '',
    ].join(' ');
  });
  console.log(`${'unit'.padEnd(34)} ${'status'.padEnd(12)} cand silnt rejct  reached     cost`);
  console.log(rows.join('\n'));
  const done = queue.units.filter((u) => u.status === 'done').length;
  console.log(`\n${done}/${queue.units.length} units done · ${totals.candidate} candidates, ${totals.silent} silent, ${totals.rejected} rejected · $${Math.round(cost * 100) / 100}`);
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const mode = process.argv[2] ?? 'run';
  if (mode === 'status') return printStatus();

  assertWorktree();
  const queue = loadQueue();
  // A unit left in-progress was interrupted; it resumes from its own files.
  for (const u of queue.units) if (u.status === 'in-progress') u.status = 'pending';
  saveQueue(queue);

  let consecutiveBlocked = 0;
  for (;;) {
    const unit = queue.units.find((u) => u.status === 'pending');
    if (!unit) {
      log('Queue empty.');
      break;
    }
    const outcome = await runUnit(queue, unit);
    consecutiveBlocked = outcome === 'blocked' ? consecutiveBlocked + 1 : 0;
    if (consecutiveBlocked >= MAX_CONSECUTIVE_BLOCKED) {
      log(`${MAX_CONSECUTIVE_BLOCKED} units blocked in a row — stopping for a human.`);
      process.exitCode = 1;
      break;
    }
    if (mode === 'once') break;
    await sleep(PAUSE_MS);
  }
}

await main();
