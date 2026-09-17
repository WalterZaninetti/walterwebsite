/**
 * Checks the candidate rows the Seasonable enrichment sweep stages under
 * .pipeline/seasonable/enrich/<region>/candidates.jsonl.
 *
 *   node scripts/seasonable-candidates-check.mjs            every staged region
 *   node scripts/seasonable-candidates-check.mjs molise     one region
 *   node scripts/seasonable-candidates-check.mjs molise --tier pat   one region, one tier
 *
 * WHAT IT IS FOR
 * The sweep runs unattended, so the mechanical half of a reviewer's job runs
 * here instead: shape, province membership, half-month arithmetic, bare-origin
 * URLs, and the flags that tell the supervised ship step where to look hardest.
 * It cannot tell whether a quote is the whole sentence or whether the scheda
 * really says it — that is what the ship step re-reads the source for. A clean
 * run means "nothing mechanically wrong", never "true".
 *
 * THE MONTH CHECK
 * Every window's start and end half-month must fall in a month the quotes name.
 * A conversion that lands in a month the document never mentions is either a
 * slip or a modelled number, and invariant 5 forbids the second. Quotes that
 * give dates as numbers carry the `numeric-dates` flag and skip this check.
 *
 * THE VERBATIM CHECK
 * The judge is the cheapest model that matched the pilot, so it is not trusted
 * to quote. Every quote and zone quote must appear, after normalising
 * whitespace, quotes and dashes, in the extracted text of the page the record
 * names, or the page either side of it. A model cannot invent a sentence past this. Image
 * pages carry `ocr` and are exempt — the ship step re-reads those by eye.
 *
 * Exits non-zero on any error, so the runner can mark a batch for retry.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { provinces } from '../src/content/seasonable/geography.ts';
import { normalise } from './seasonable-enrich/lib.mjs';

const ROOT = '.pipeline/seasonable/enrich';

const MONTHS = [
  'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
];
const VERDICTS = ['candidate', 'silent', 'rejected'];
const TIERS = ['pat', 'calendar'];
const KINDS = ['open-field', 'greenhouse', 'stored'];
const FLAGS = [
  'undated', 'ocr', 'variety-union', 'wraps-year', 'wide',
  'comuni-resolved', 'calendar-month-grain', 'numeric-dates',
];

const regionOf = new Map(provinces.map((p) => [p.id, p.region]));

/** 1-based month numbers named anywhere in the text. */
function monthsNamed(text) {
  const lower = text.toLowerCase();
  return new Set(MONTHS.flatMap((m, i) => (lower.includes(m) ? [i + 1] : [])));
}

const monthOfHalf = (h) => Math.floor(h / 2) + 1;
const length = (s, e) => (s <= e ? e - s + 1 : 24 - s + e + 1);

/**
 * Page n and n+1 of the document a record came from, normalised, or null when
 * the record predates page tracking (the first pilot's eight) or has no text.
 */
function pageContext(region, r) {
  if (!Number.isInteger(r.page) || r.flags?.includes('ocr')) return null;
  const extract = join(ROOT, region, `extract-${r.tier}.json`);
  if (!existsSync(extract)) return null;
  const doc = JSON.parse(readFileSync(extract, 'utf8')).documents[r.doc ?? 0];
  if (!doc || !existsSync(doc.text)) return null;
  const pages = readFileSync(doc.text, 'utf8').split('\f');
  // A scheda's area can sit on the page before the one it starts on, and its text can run onto the next.
  return normalise(`${pages[r.page - 2] ?? ''} ${pages[r.page - 1] ?? ''} ${pages[r.page] ?? ''}`);
}

export function checkRecord(r, region) {
  const errors = [];
  const warnings = [];
  const need = (cond, msg) => { if (!cond) errors.push(msg); };

  need(r.region === region, `region is "${r.region}", file is under "${region}"`);
  need(TIERS.includes(r.tier), `tier "${r.tier}"`);
  need(typeof r.product === 'string' && r.product.trim(), 'product missing');
  need(VERDICTS.includes(r.verdict), `verdict "${r.verdict}"`);
  need(Array.isArray(r.flags), 'flags must be an array');
  for (const f of r.flags ?? []) need(FLAGS.includes(f), `unknown flag "${f}"`);
  need(Array.isArray(r.windows), 'windows must be an array');
  need(Array.isArray(r.provinces), 'provinces must be an array');

  const s = r.source ?? {};
  need(typeof s.url === 'string', 'source.url missing');
  if (typeof s.url === 'string') {
    try {
      const u = new URL(s.url);
      need(u.pathname.length > 1, `source.url ${s.url} is a bare origin`);
      need(s.host === u.hostname, `source.host "${s.host}" does not match the URL's host ${u.hostname}`);
    } catch {
      errors.push(`source.url "${s.url}" does not parse`);
    }
  }
  need(/^\d{4}-\d{2}-\d{2}$/.test(s.accessed ?? ''), `source.accessed "${s.accessed}"`);

  const context = pageContext(region, r);
  if (context) {
    for (const q of [...(r.quotes ?? []), ...(r.zoneQuote ? [r.zoneQuote] : [])]) {
      if (!context.includes(normalise(q))) errors.push(`quote is not verbatim on page ${r.page}: "${q.slice(0, 80)}"`);
    }
  }

  if (r.verdict !== 'candidate') {
    need(typeof r.reason === 'string' && r.reason.trim(), `${r.verdict} needs a reason`);
    need((r.windows ?? []).length === 0, `${r.verdict} must carry no windows`);
    return { errors, warnings };
  }

  // ── Candidates only ─────────────────────────────────────────────────────
  need(['fruit', 'vegetable'].includes(r.category), `category "${r.category}"`);
  need(typeof s.title === 'string' && s.title.trim(), 'source.title missing');
  need(s.printedYear === null || Number.isInteger(s.printedYear), 'source.printedYear must be an integer or null');
  if (s.printedYear === null) need(r.flags.includes('undated'), 'no printedYear, so flag "undated"');
  need(Array.isArray(r.quotes) && r.quotes.length > 0, 'a candidate needs at least one quote');
  need(typeof r.zoneQuote === 'string' && r.zoneQuote.trim(), 'zoneQuote missing');
  need(r.provinces.length > 0, 'a candidate needs at least one province');
  need(r.windows.length > 0, 'a candidate needs at least one window');

  for (const p of r.provinces) {
    if (!regionOf.has(p)) errors.push(`province "${p}" does not exist`);
    else if (regionOf.get(p) !== region) errors.push(`province "${p}" is in ${regionOf.get(p)}, not ${region}`);
  }
  if (new Set(r.provinces).size !== r.provinces.length) errors.push('duplicate provinces');

  const quoteText = (r.quotes ?? []).join(' ');
  const named = monthsNamed(quoteText);
  const numeric = r.flags.includes('numeric-dates');
  if (!numeric && named.size === 0) errors.push('the quotes name no month; flag "numeric-dates" if they use numbers');

  if (/precoc|tardiv|tipologi|variet|cultivar/i.test(quoteText) && !r.flags.includes('variety-union')) {
    errors.push('quote mentions varieties: take the union across them and flag "variety-union"');
  }
  // Invariant 8's other form: the sentence went on after the semicolon, and the quote did not.
  for (const q of r.quotes ?? []) {
    if (/;\s*$/.test(q)) errors.push(`quote stops at a semicolon — quote the whole sentence: "${q.slice(-60)}"`);
  }

  for (const [i, w] of (r.windows ?? []).entries()) {
    const at = `windows[${i}]`;
    need(KINDS.includes(w.kind), `${at}.kind "${w.kind}"`);
    const ok = (h) => Number.isInteger(h) && h >= 0 && h <= 23;
    need(ok(w.start), `${at}.start ${w.start} is not a half-month 0–23`);
    need(ok(w.end), `${at}.end ${w.end} is not a half-month 0–23`);
    need(typeof w.conversion === 'string' && w.conversion.trim(), `${at}.conversion missing`);
    if (!ok(w.start) || !ok(w.end)) continue;

    if (!numeric) {
      need(named.has(monthOfHalf(w.start)), `${at}.start ${w.start} is in ${MONTHS[monthOfHalf(w.start) - 1]}, which no quote names`);
      need(named.has(monthOfHalf(w.end)), `${at}.end ${w.end} is in ${MONTHS[monthOfHalf(w.end) - 1]}, which no quote names`);
    }
    if (w.start > w.end) need(r.flags.includes('wraps-year'), `${at} wraps the year: flag "wraps-year"`);
    if (length(w.start, w.end) > 15) need(r.flags.includes('wide'), `${at} spans ${length(w.start, w.end)} half-months: flag "wide"`);
    if (length(w.start, w.end) === 24) warnings.push(`${at} is the whole year — the Mela Alto Adige precedent rejects that unless the document claims it`);
  }
  if (r.tier === 'calendar') need(r.flags.includes('calendar-month-grain'), 'calendar rows flag "calendar-month-grain"');

  return { errors, warnings };
}

function checkRegion(region, tier) {
  const file = join(ROOT, region, 'candidates.jsonl');
  if (!existsSync(file)) return { region, records: 0, errors: 0 };
  const lines = readFileSync(file, 'utf8').split('\n');
  let records = 0;
  let errorCount = 0;
  const seen = new Set();
  for (const [n, line] of lines.entries()) {
    if (!line.trim()) continue;
    records++;
    let r;
    try {
      r = JSON.parse(line);
    } catch (e) {
      console.error(`${file}:${n + 1}  not JSON — ${e.message}`);
      errorCount++;
      continue;
    }
    if (tier && r.tier !== tier) continue;
    const key = `${r.tier}|${r.product}|${r.source?.url}`;
    const { errors, warnings } = checkRecord(r, region);
    if (seen.has(key)) errors.push('duplicate record for this product and document');
    seen.add(key);
    for (const e of errors) console.error(`${file}:${n + 1}  ${r.product ?? '?'} — ${e}`);
    for (const w of warnings) console.warn(`${file}:${n + 1}  ${r.product ?? '?'} — warning: ${w}`);
    errorCount += errors.length;
  }
  return { region, records, errors: errorCount };
}

if (import.meta.url !== `file://${process.argv[1]}`) {
  // Imported by the judge for checkRecord; the CLI below is not for it.
} else {
const only = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : null;
const tierArg = process.argv.indexOf('--tier');
const onlyTier = tierArg === -1 ? null : process.argv[tierArg + 1];
const regions = only
  ? [only]
  : existsSync(ROOT)
    ? readdirSync(ROOT, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name !== 'logs').map((d) => d.name)
    : [];

let failed = 0;
for (const region of regions) {
  const { records, errors } = checkRegion(region, onlyTier);
  console.log(`${region}: ${records} records, ${errors} errors`);
  failed += errors;
}
process.exit(failed ? 1 : 0);
}
