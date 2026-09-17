/**
 * The Seasonable enrichment sweep: a resumable background loop that works the
 * dataset region by region through new source tiers, spending as little on
 * models as the job allows.
 *
 *   node scripts/seasonable-enrich.mjs            run until the queue is empty or the cap is hit
 *   node scripts/seasonable-enrich.mjs status     print the queue, what it has staged, and what it cost
 *   node scripts/seasonable-enrich.mjs once       run a single step, then stop
 *
 * Run it from the worktree on branch `seasonable/enrich`, never from the main
 * checkout — the music refresh commits to main on its own schedule, and this
 * loop commits after every step:
 *
 *   git worktree add ../walterwebsite-enrich -b seasonable/enrich
 *   cd ../walterwebsite-enrich && npm ci
 *   SEASONABLE_MAX_TOTAL_USD=5 caffeinate -i nohup npm run enrich:seasonable > .pipeline/seasonable/enrich/logs/runner.log 2>&1 &
 *
 * THREE STAGES PER UNIT, AND ONLY TWO COST ANYTHING
 * A unit is region × tier (`pat`; `calendar` is off by default, see TIERS). Each loop step advances one
 * unit by one stage, in scripts/seasonable-enrich/:
 *
 *   discover  one tool-using call finds the region's official document    once per unit
 *   extract   curl + pdftotext + a calendar-term pre-filter               $0
 *   judge     one tool-less call per batch of pages, validated in code    ~$0.01 per scheda
 *
 * The first pilot ran all of this as one Opus agent and paid $2.61 for eight
 * schede — 41 turns re-reading a context that started at 105k tokens. The
 * replay that chose this design judged the same pages with Sonnet at low effort
 * for $0.12, agreeing with the pilot on every product's candidate-or-not.
 *
 * WHAT IT DOES AND DOES NOT DO
 * It stages. Records land in <region>/candidates.jsonl after passing the same
 * checks the validator runs, including a verbatim-quote check against the page
 * text; anything that fails lands in needs-review.jsonl. No stage can write
 * outside the enrich folder — the judge has no tools at all, discovery has
 * search, fetch and `curl` — and after every step this script still reverts
 * anything changed outside it and blocks the unit. Moving a row onto the page
 * is the supervised ship step.
 *
 * A unit whose discovery found nothing ends `needs-human`, not `done`: fill in
 * source-<tier>.json by hand and set the unit back to `pending`.
 *
 * SPEND
 * `SEASONABLE_MAX_TOTAL_USD` (default 5) caps the cumulative cost across every
 * region's costs.jsonl plus the first pilot, checked before each step, so
 * restarting never resets it. `SEASONABLE_JUDGE_MODEL` / `_JUDGE_EFFORT`
 * default to the replay's winner, sonnet / low.
 */

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { provinces, regions } from '../src/content/seasonable/geography.ts';
import { windows } from '../src/content/seasonable/windows.ts';
import { discover } from './seasonable-enrich/discover.mjs';
import { extract } from './seasonable-enrich/extract.mjs';
import { judge } from './seasonable-enrich/judge.mjs';
import { ROOT, UsageLimitError, readJson, readJsonl, regionDir, writeJson } from './seasonable-enrich/lib.mjs';

const QUEUE = join(ROOT, 'queue.json');
const MAX_TOTAL_USD = Number(process.env.SEASONABLE_MAX_TOTAL_USD ?? 5);
const PAUSE_MS = Number(process.env.SEASONABLE_PAUSE_S ?? 60) * 1000;
const JUDGE = { model: process.env.SEASONABLE_JUDGE_MODEL ?? 'sonnet', effort: process.env.SEASONABLE_JUDGE_EFFORT ?? 'low' };
const ESCALATE = process.env.SEASONABLE_ESCALATE_MODEL ?? 'sonnet';
const MAX_ATTEMPTS = 3;
const MAX_CONSECUTIVE_BLOCKED = 3;
// The calendar tier ran on ten regions and found no usable calendar: the two
// documents it did find were catering guidelines, and they were among the most
// expensive units in the queue. PAT schede produced every candidate. It stays
// in the code, off by default: SEASONABLE_TIERS=pat,calendar turns it back on.
const TIERS = (process.env.SEASONABLE_TIERS ?? 'pat').split(',');

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
        id: `${r.id}:${tier}`, region: r.id, tier, silentProvincesAtStart: r.silent,
        status: 'pending', attempts: 0, costUsd: 0, note: null,
      })),
    ),
  };
}

function loadQueue() {
  if (!existsSync(QUEUE)) writeJson(QUEUE, buildQueue());
  return readJson(QUEUE);
}

const saveQueue = (q) => writeJson(QUEUE, q);

/** A unit's cost: its region's costs.jsonl lines for this tier, plus what the first agentic pilot spent. */
function unitCost(unit) {
  const lines = readJsonl(join(regionDir(unit.region), 'costs.jsonl'));
  const own = lines.filter((l) => l.stage.includes(`:${unit.tier}`)).reduce((s, l) => s + l.costUsd, 0);
  return own + (unit.pilotCostUsd ?? 0);
}

const totalCost = (queue) => queue.units.reduce((s, u) => s + unitCost(u), 0);

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
  git('commit', '-q', '-m', message, '-m', 'Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>');
}

// ── One step ───────────────────────────────────────────────────────────────

/** Advance a unit by one stage. */
async function step(unit) {
  const dir = regionDir(unit.region);
  const source = readJson(join(dir, `source-${unit.tier}.json`), null);

  if (!source) {
    const found = await discover(unit.region, unit.tier);
    unit.note = `discovered ${found.documents.length} document(s): ${found.note ?? ''}`.slice(0, 200);
    // Discovery giving up is not the region having nothing: Abruzzo's found a PDF
    // it could not open, Puglia's turned down the atlas the Region links to.
    if (found.documents.length === 0) unit.status = 'needs-human';
    return { paid: true, message: `Discover the ${unit.tier} source for ${unit.region}` };
  }
  if (source.documents.length === 0) {
    unit.status = 'needs-human';
    unit.note = source.note ?? 'no official document found';
    return { paid: false, message: `Hand ${unit.id} to a human: no document found` };
  }
  if (!existsSync(join(dir, `extract-${unit.tier}.json`))) {
    const r = extract(unit.region, unit.tier);
    const pages = r.documents.flatMap((d) => d.pages);
    unit.note = `extracted ${pages.length} pages, ${pages.filter((p) => p.status === 'skipped').length} skipped by the pre-filter`;
    return { paid: false, message: `Extract the ${unit.tier} documents for ${unit.region}` };
  }

  const summary = await judge({
    region: unit.region, tier: unit.tier, model: JUDGE.model, effort: JUDGE.effort, escalate: ESCALATE, maxBatches: 1,
  });
  const status = readJson(join(dir, `status-${unit.tier}.json`), { state: 'more' });
  unit.status = status.state === 'done' ? 'done' : 'pending';
  unit.note = status.note;
  return { paid: true, message: `Judge ${unit.tier} pages for ${unit.region}: ${summary.written} records, ${summary.review} for review` };
}

async function runUnit(queue, unit) {
  log(`→ ${unit.id}`);
  let outcome;
  try {
    outcome = await step(unit);
    unit.attempts = 0;
  } catch (e) {
    // The plan's limit is not the unit's fault: stop the loop, leave the unit as it was.
    if (e instanceof UsageLimitError) throw e;
    unit.attempts++;
    unit.note = String(e.message).slice(0, 300);
    unit.status = unit.attempts >= MAX_ATTEMPTS ? 'blocked' : 'pending';
    outcome = { paid: true, message: `${unit.status === 'blocked' ? 'Block' : 'Retry'} ${unit.id} after an error` };
  }

  const stray = revertStrayChanges();
  if (stray.length) {
    unit.status = 'blocked';
    unit.note = `a stage wrote outside the enrich folder, reverted: ${stray.join(', ')}`;
  }
  const check = spawnSync('node', ['scripts/seasonable-candidates-check.mjs', unit.region, '--tier', unit.tier], { encoding: 'utf8' });
  if (check.status !== 0) {
    unit.status = 'blocked';
    unit.note = `validator failed: ${(check.stderr || check.stdout).split('\n').slice(0, 3).join(' | ')}`;
  }

  unit.costUsd = Math.round(unitCost(unit) * 1000) / 1000;
  saveQueue(queue);
  commit(outcome.message);
  log(`${unit.status === 'blocked' ? '✗' : '✓'} ${unit.id} → ${unit.status} — ${unit.note ?? ''} ($${unit.costUsd})`);
  return { status: unit.status, paid: outcome.paid };
}

// ── Status ─────────────────────────────────────────────────────────────────

function printStatus() {
  const queue = loadQueue();
  const totals = { candidate: 0, silent: 0, rejected: 0, review: 0 };
  console.log(`${'unit'.padEnd(26)} ${'status'.padEnd(11)} cand silnt rejct revw  reached  skipped     cost  $/record`);
  for (const u of queue.units) {
    const dir = regionDir(u.region);
    const records = readJsonl(join(dir, 'candidates.jsonl')).filter((r) => r.tier === u.tier);
    const review = readJsonl(join(dir, 'needs-review.jsonl')).filter((r) => r.tier === u.tier).length;
    const count = (v) => records.filter((r) => r.verdict === v).length;
    const reached = new Set(
      records.filter((r) => r.verdict === 'candidate').flatMap((r) => r.provinces).filter((p) => u.silentProvincesAtStart.includes(p)),
    );
    const pages = readJson(join(dir, `extract-${u.tier}.json`), { documents: [] }).documents.flatMap((d) => d.pages);
    const judgedCost = readJsonl(join(dir, 'costs.jsonl')).filter((l) => l.stage.startsWith(`judge:${u.tier}`)).reduce((s, l) => s + l.costUsd, 0);
    const judged = records.filter((r) => r.page !== undefined).length + review;
    for (const k of ['candidate', 'silent', 'rejected']) totals[k] += count(k);
    totals.review += review;
    console.log([
      u.id.padEnd(26), u.status.padEnd(11),
      String(count('candidate')).padStart(4), String(count('silent')).padStart(5), String(count('rejected')).padStart(5), String(review).padStart(4),
      `${reached.size}/${u.silentProvincesAtStart.length}`.padStart(8),
      (pages.length ? `${pages.filter((p) => p.status === 'skipped').length}/${pages.length}` : '-').padStart(8),
      `$${unitCost(u).toFixed(2)}`.padStart(8),
      (judged ? `$${(judgedCost / judged).toFixed(3)}` : '-').padStart(9),
    ].join(' '));
  }
  const done = queue.units.filter((u) => u.status === 'done').length;
  console.log(
    `\n${done}/${queue.units.length} units done · ${totals.candidate} candidates, ${totals.silent} silent, ` +
      `${totals.rejected} rejected, ${totals.review} for review · $${totalCost(queue).toFixed(2)} of the $${MAX_TOTAL_USD} cap`,
  );
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const mode = process.argv[2] ?? 'run';
  if (mode === 'status') return printStatus();

  assertWorktree();
  const queue = loadQueue();
  let consecutiveBlocked = 0;

  for (;;) {
    const unit = queue.units.find((u) => (u.status === 'pending' || u.status === 'in-progress') && TIERS.includes(u.tier));
    if (!unit) {
      log('Queue empty.');
      break;
    }
    const spent = totalCost(queue);
    if (spent >= MAX_TOTAL_USD) {
      log(`Spent $${spent.toFixed(2)} of the $${MAX_TOTAL_USD} cap — stopping. Raise SEASONABLE_MAX_TOTAL_USD to continue.`);
      break;
    }

    let result;
    try {
      result = await runUnit(queue, unit);
    } catch (e) {
      if (!(e instanceof UsageLimitError)) throw e;
      log(`Usage limit reached — stopping without touching ${unit.id}: ${e.message}`);
      process.exitCode = 3;
      break;
    }
    const { status, paid } = result;
    consecutiveBlocked = status === 'blocked' ? consecutiveBlocked + 1 : 0;
    if (consecutiveBlocked >= MAX_CONSECUTIVE_BLOCKED) {
      log(`${MAX_CONSECUTIVE_BLOCKED} units blocked in a row — stopping for a human.`);
      process.exitCode = 1;
      break;
    }
    if (mode === 'once') break;
    // Short enough that consecutive judge batches reuse the cached rules.
    if (paid) await sleep(PAUSE_MS);
  }
}

await main();
