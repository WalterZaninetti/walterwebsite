/**
 * Stage 3 of the enrichment pipeline: the only step that spends money on
 * reading, and it spends it once per batch.
 *
 *   node scripts/seasonable-enrich/judge.mjs <region> <pat|calendar> [options]
 *
 *   --model <m>        judge model (default $SEASONABLE_JUDGE_MODEL, else haiku)
 *   --effort <e>       effort level, for models that take one
 *   --escalate <m>     model for records the judge marks `unsure` (default sonnet,
 *                      at high effort — Opus cost more on six Marche pages than
 *                      Sonnet did judging sixty, and most `unsure` was missing
 *                      context, which no model can supply)
 *   --pages 1,2,3      judge only these pages of document 0, and do not mark them
 *   --out <file>       write records here instead of candidates.jsonl — a replay,
 *                      which changes no state (used to choose the judge model)
 *   --max-batches <n>  stop after n batches
 *
 * HOW A BATCH IS SPENT
 * Pending pages — the ones the pre-filter kept — are packed into batches of up
 * to ~60k characters. Each judged page travels with its neighbours as context:
 * the page before it, because the pre-filter skips pages with no date and a
 * scheda's "Area di produzione" is usually on the page before its harvest
 * sentence (the Marche schede lost two zones to this before it was fixed), and
 * the page after the batch, so a scheda that runs over a break is read whole. One stripped call per batch (see lib.mjs),
 * rules in the system prompt so consecutive batches hit the prompt cache, pages
 * in the user turn. The model returns only what needs judgement; the source,
 * the dates, the ledger prose and the file writes are all code.
 *
 * WHAT HAPPENS TO A BAD RECORD
 * Every record goes through the same checkRecord the validator runs, including
 * the verbatim-quote check. Failures get one retry with their errors and only
 * their pages. `unsure` records get one call on the escalation model. Anything
 * still failing lands in needs-review.jsonl, never in candidates.jsonl, and
 * never silently disappears.
 */

import { appendFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { provinces } from '../../src/content/seasonable/geography.ts';
import { produce } from '../../src/content/seasonable/produce.ts';
import { checkRecord } from '../seasonable-candidates-check.mjs';
import { extract } from './extract.mjs';
import {
  appendJsonl, callModel, normalise, parseJsonLines, readJson, readJsonl, regionDir, today, writeJson,
} from './lib.mjs';

const RULES = readFileSync(fileURLToPath(new URL('./judge-rules.md', import.meta.url)), 'utf8');
const CALENDAR_RULES = `

## Calendar tier

These pages are a regional seasonality calendar, not PAT schede. Output one record per species ("carciofo", "pesca") instead of per product. Accept the calendar only if it is (a) made for this region, not a national calendar republished, (b) about harvest or production in the region in its own words — a table of "disponibilità" or "stagionalità" with no statement about where the produce comes from is rejected, reason "availability, not harvest" — and (c) prints a year. If any test fails, output a single record with product "(calendar)", verdict "rejected" and the failing test as reason. Contiguous marked months are one window; each marked month is both of its half-months.`;

const MAX_BATCH_CHARS = 60_000;

function args() {
  const [region, tier = 'pat', ...rest] = process.argv.slice(2);
  const opt = (name, fallback) => {
    const i = rest.indexOf(`--${name}`);
    return i === -1 ? fallback : rest[i + 1];
  };
  return {
    region,
    tier,
    // The same defaults the runner uses, so a hand run and a swept one agree.
    model: opt('model', process.env.SEASONABLE_JUDGE_MODEL ?? 'sonnet'),
    effort: opt('effort', process.env.SEASONABLE_JUDGE_EFFORT ?? 'low'),
    escalate: opt('escalate', process.env.SEASONABLE_ESCALATE_MODEL ?? 'sonnet'),
    escalateEffort: opt('escalate-effort', process.env.SEASONABLE_ESCALATE_EFFORT ?? 'high'),
    pages: opt('pages', null)?.split(',').map(Number),
    out: opt('out', null),
    maxBatches: Number(opt('max-batches', Infinity)),
  };
}

const productKey = (name) => normalise(name).replace(/\(.*?\)/g, '').replace(/[^a-z]/g, '');

/**
 * Designations the page already ships. ARSIAL's guide lists Lazio's DOP and
 * IGP products beside its PAT, and all four of its first candidates were rows
 * the dataset already has, cited to the disciplinare. Rejected in code, free.
 */
const shipped = new Map(
  produce.filter((p) => p.designation).map((p) => [productKey(p.name), `${p.name} ${p.designation}`]),
);
const alreadyShipped = (name) => shipped.get(productKey(name.replace(/\b(DOP|IGP|D\.O\.P\.|I\.G\.P\.)\b/gi, '')));

function batches(doc, texts, onlyPages) {
  const pending = doc.pages.filter((p) => (onlyPages ? onlyPages.includes(p.n) : p.status === 'pending'));
  const out = [];
  let current = [];
  let size = 0;
  for (const p of pending) {
    if (current.length && size + p.chars > MAX_BATCH_CHARS) {
      out.push(current);
      current = [];
      size = 0;
    }
    current.push(p);
    size += p.chars;
  }
  if (current.length) out.push(current);
  return out.map((pages) => withContext(pages, texts));
}

/**
 * A batch: the judged pages, the page before each one that is not itself being
 * judged, and the page after the last. `before` pages may start a product that
 * continues onto a judged page; the `after` page only finishes one.
 */
function withContext(pages, texts) {
  const judged = new Set(pages.map((p) => p.n));
  const before = [...new Set(pages.map((p) => p.n - 1))].filter((n) => n >= 1 && !judged.has(n));
  const last = pages.at(-1).n;
  const after = texts[last] !== undefined && texts[last].trim() && !judged.has(last + 1) ? last + 1 : null;
  return { pages, before, after };
}

function pagePrompt(texts, batch) {
  const parts = [
    ...batch.pages.map((p) => ({
      n: p.n,
      body: p.ocr
        ? `<page n="${p.n}">\n(image scan with no text layer: open ${p.image} with the Read tool and read it)\n</page>`
        : `<page n="${p.n}">\n${texts[p.n - 1]}\n</page>`,
    })),
    ...batch.before.map((n) => ({ n, body: `<page n="${n}" context="before">\n${texts[n - 1]}\n</page>` })),
    ...(batch.after ? [{ n: batch.after, body: `<page n="${batch.after}" context="after">\n${texts[batch.after - 1]}\n</page>` }] : []),
  ];
  return parts.sort((a, b) => a.n - b.n).map((p) => p.body).join('\n\n');
}

function enrich(raw, { region, tier, source, docIndex, doc }) {
  const docSource = source.documents[docIndex];
  const page = doc.pages.find((p) => p.n === raw.page);
  const flags = new Set((raw.flags ?? []).filter((f) => typeof f === 'string'));
  if (docSource.printedYear == null) flags.add('undated');
  if (page?.ocr) flags.add('ocr');
  if (tier === 'calendar') flags.add('calendar-month-grain');
  return {
    region,
    tier,
    product: raw.product,
    category: raw.category ?? null,
    verdict: raw.verdict,
    reason: raw.reason ?? null,
    source: {
      title: docSource.title,
      url: docSource.url,
      host: new URL(docSource.url).hostname,
      printedYear: docSource.printedYear ?? null,
      accessed: today(),
    },
    quotes: raw.quotes ?? [],
    zoneQuote: raw.zoneQuote ?? null,
    provinces: raw.provinces ?? [],
    windows: raw.verdict === 'candidate' ? raw.windows ?? [] : [],
    flags: [...flags],
    doc: docIndex,
    page: raw.page,
  };
}

function ledgerLines(records, heading) {
  const lines = [`\n## ${today()} — ${heading}\n`];
  for (const r of records) {
    const quote = r.quotes[0] ? ` «${r.quotes.join(' … ')}»` : '';
    const window = r.windows.map((w) => `${w.kind} ${w.start}→${w.end}`).join(', ');
    lines.push(`- **${r.product}** (p.${r.page}) — \`${r.verdict}\`${window ? ` ${window}` : ''}.${r.reason ? ` ${r.reason}.` : ''}${quote}`);
  }
  return lines.join('\n') + '\n';
}

async function judgeBatch(ctx, batch, known, model, effort, extraInstruction = '') {
  const { region, tier, texts } = ctx;
  const regionProvinces = provinces.filter((p) => p.region === region).map((p) => `${p.id} = ${p.name}`).join(', ');
  const prompt = [
    `Region: ${region}. Province ids you may use: ${regionProvinces}.`,
    known.length ? `Already recorded, do not output again: ${known.join('; ')}.` : '',
    extraInstruction,
    pagePrompt(texts, batch),
  ].filter(Boolean).join('\n\n');
  const system = tier === 'calendar' ? RULES + CALENDAR_RULES : RULES;
  const pageList = batch.pages.map((p) => p.n).join(',');
  const { text, cost } = await callModel({
    region, stage: `judge:${tier}:p${pageList}`, model, effort, system, prompt,
    tools: batch.pages.some((p) => p.ocr) ? 'Read' : '',
    budgetUsd: Number(process.env.SEASONABLE_JUDGE_BUDGET_USD ?? 0.5),
  });
  const { records, junk } = parseJsonLines(text);
  return { records, junk, cost };
}

export async function judge(options) {
  const { region, tier, model, effort, escalate, escalateEffort = 'high', pages: onlyPages, out, maxBatches } = options;
  const dir = regionDir(region);
  const source = readJson(join(dir, `source-${tier}.json`), null);
  const extracted = readJson(join(dir, `extract-${tier}.json`), null) ?? extract(region, tier);
  const candidatesFile = out ?? join(dir, 'candidates.jsonl');
  const replay = Boolean(out);

  let spent = 0;
  let batchCount = 0;
  const summary = { written: 0, review: 0, cost: 0 };

  for (const [docIndex, doc] of extracted.documents.entries()) {
    const texts = readFileSync(doc.text, 'utf8').split('\f');
    const ctx = { region, tier, texts, source, docIndex, doc };

    for (const batch of batches(doc, texts, docIndex === 0 ? onlyPages : null)) {
      if (batchCount++ >= maxBatches) break;
      const recorded = replay ? [] : readJsonl(candidatesFile).filter((r) => r.tier === tier && r.source?.url === doc.url);
      const known = recorded.map((r) => r.product);
      const knownKeys = new Set(recorded.map((r) => productKey(r.product)));

      const first = await judgeBatch(ctx, batch, known, model, effort);
      spent += first.cost;
      // An empty parse is a failed call — marking its pages judged would lose
      // them. But a page can carry a date and still hold no product (Friuli's
      // bibliography, Abruzzo's catering specifications), so the model says so
      // explicitly with {"none": …}, and only silence without that marker fails.
      const none = first.records.find((r) => typeof r?.none === 'string' && !r.product);
      first.records = first.records.filter((r) => r?.product);
      if (first.records.length === 0 && !none) {
        throw new Error(`batch p${batch.pages[0].n}–${batch.pages.at(-1).n} parsed to no records ($${first.cost.toFixed(3)}): ${first.junk.join(' ').slice(0, 200)}`);
      }
      if (first.records.length === 0 && none && !replay) {
        for (const p of batch.pages) p.status = 'judged';
        writeJson(join(dir, `extract-${tier}.json`), extracted);
        appendFileSync(join(dir, 'ledger.md'), `\n## ${today()} — ${tier} judge, pages ${batch.pages.map((p) => p.n).join(', ')} (${model}${effort ? `/${effort}` : ''})\n\nNo fruit or vegetable product on these pages: ${none.none}\n`);
        continue;
      }

      const good = [];
      const bad = [];
      const unsure = [];
      const seen = new Set();
      const sort = (raw, attempt) => {
        if (!raw?.product || knownKeys.has(productKey(raw.product))) return;
        // A product that starts on the after-context page belongs to the next batch.
        if (raw.page === batch.after) return;
        // The same product twice in one reply — Marche's Castagne, once per page it spans.
        if (attempt === 1) {
          if (seen.has(productKey(raw.product))) return;
          seen.add(productKey(raw.product));
        }
        const rec = enrich(raw, ctx);
        if (!doc.pages.some((p) => p.n === raw.page)) {
          return bad.push({ rec, errors: [`page ${raw.page} is not a page of this document`], attempt });
        }
        if (raw.verdict === 'unsure') return unsure.push(rec);
        const shippedAs = rec.verdict === 'candidate' && alreadyShipped(rec.product);
        if (shippedAs) {
          rec.verdict = 'rejected';
          rec.reason = `already in the dataset as ${shippedAs}, cited to its disciplinare`;
          rec.windows = [];
        }
        const { errors } = checkRecord(rec, region);
        if (errors.length) bad.push({ rec, errors, attempt });
        else good.push(rec);
      };
      for (const raw of first.records) sort(raw, 1);

      // One retry for mechanical failures, with their errors and only their pages.
      const retry = bad.splice(0).filter((b) => b.attempt === 1);
      if (retry.length) {
        const pagesNeeded = [...new Set(retry.map((b) => b.rec.page))];
        const instruction = 'Your previous output for these products failed mechanical checks. Output corrected lines for ONLY these products:\n' +
          retry.map((b) => `- ${b.rec.product} (p.${b.rec.page}): ${b.errors.join('; ')}`).join('\n');
        const retryBatch = withContext(doc.pages.filter((p) => pagesNeeded.includes(p.n)), texts);
        const second = await judgeBatch(ctx, retryBatch, [], model, effort, instruction);
        spent += second.cost;
        const retried = new Set();
        for (const raw of second.records) {
          if (!retry.some((b) => productKey(b.rec.product) === productKey(raw.product ?? ''))) continue;
          retried.add(productKey(raw.product));
          sort(raw, 2);
        }
        for (const b of retry) if (!retried.has(productKey(b.rec.product))) bad.push({ ...b, attempt: 2 });
      }

      // Escalate what the judge could not decide, one page at a time.
      for (const u of unsure) {
        const esc = await judgeBatch(
          ctx,
          withContext(doc.pages.filter((p) => p.n === u.page), texts),
          [], escalate, escalateEffort,
          `Output a line for ONLY this product: ${u.product}. A cheaper model was unsure: ${u.reason}. Decide; use "unsure" only if the text truly cannot be read.`,
        );
        spent += esc.cost;
        const raw = esc.records.find((r) => productKey(r.product ?? '') === productKey(u.product)) ?? esc.records[0];
        if (!raw || raw.verdict === 'unsure') {
          bad.push({ rec: u, errors: [`unsure after escalation: ${raw?.reason ?? u.reason}`], attempt: 3 });
        } else {
          raw.page = u.page;
          sort(raw, 3);
        }
      }

      appendJsonl(candidatesFile, good);
      summary.written += good.length;
      if (bad.length) {
        appendJsonl(join(dir, replay ? 'replay-needs-review.jsonl' : 'needs-review.jsonl'), bad.map((b) => ({ ...b.rec, errors: b.errors })));
        summary.review += bad.length;
      }
      if (!replay) {
        for (const p of batch.pages) p.status = 'judged';
        writeJson(join(dir, `extract-${tier}.json`), extracted);
        const heading = `${tier} judge, pages ${batch.pages.map((p) => p.n).join(', ')} (${model}${effort ? `/${effort}` : ''}, $${spent.toFixed(3)} so far)`;
        const ledger = ledgerLines([...good, ...bad.map((b) => ({ ...b.rec, verdict: 'needs review', reason: b.errors.join('; ') }))], heading);
        appendFileSync(join(dir, 'ledger.md'), ledger);
      }
      if (first.junk.length) console.warn(`${region}: ${first.junk.length} non-JSON lines ignored`);
    }
  }

  summary.cost = Math.round(spent * 10_000) / 10_000;
  if (!replay) {
    const remaining = extracted.documents.flatMap((d) => d.pages).filter((p) => p.status === 'pending').length;
    writeJson(join(dir, `status-${tier}.json`), {
      state: remaining ? 'more' : 'done',
      note: `${summary.written} records, ${summary.review} for review, ${remaining} pages pending`,
      at: new Date().toISOString(),
    });
  }
  return summary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const options = args();
  if (!options.region) {
    console.error('usage: judge.mjs <region> <pat|calendar> [--model m] [--effort e] [--pages 1,2] [--out file] [--max-batches n]');
    process.exit(2);
  }
  const summary = await judge(options);
  console.log(`${options.region} ${options.tier} (${options.model}${options.effort ? `/${options.effort}` : ''}): ${summary.written} records written, ${summary.review} need review, $${summary.cost}`);
}
