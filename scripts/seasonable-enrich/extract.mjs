/**
 * Stage 2 of the enrichment pipeline: download, extract, pre-filter. No model,
 * no cost.
 *
 *   node scripts/seasonable-enrich/extract.mjs <region> <pat|calendar>
 *
 * Reads <region>/source-<tier>.json (written by discovery, or by hand), fetches
 * every document into corpus/, extracts text page by page, and writes
 * <region>/extract-<tier>.json: one entry per page saying whether it carries a
 * calendar term and so whether a model will ever read it.
 *
 * `pdftotext` runs WITHOUT -layout. The regional atlases are set in two or
 * three columns, and -layout interleaves them line by line — the pilot's worker
 * spent turns untangling that. Reading order keeps each scheda contiguous.
 *
 * A page with fewer than 80 characters of text is an image scan: it is rendered
 * to PNG and marked `ocr`, and always goes to the judge, because nothing can be
 * pre-filtered on text that was never extracted.
 *
 * Idempotent: a document already downloaded is not fetched again, and a page
 * already judged keeps its status.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CALENDAR_TERM, corpusDir, readJson, regionDir, writeJson } from './lib.mjs';

const OCR_THRESHOLD = 80;

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed: ${r.stderr}`);
  return r.stdout;
}

function htmlToText(html) {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>|<\/(p|div|li|h\d|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n\n');
}

export function extract(region, tier) {
  const source = readJson(join(regionDir(region), `source-${tier}.json`), null);
  if (!source?.documents?.length) throw new Error(`${region}: no documents in source-${tier}.json`);

  const outFile = join(regionDir(region), `extract-${tier}.json`);
  const previous = readJson(outFile, { documents: [] });
  const corpus = corpusDir(region);
  mkdirSync(corpus, { recursive: true });

  const documents = source.documents.map((doc, d) => {
    const isPdf = doc.kind === 'pdf' || /\.pdf($|\?)/i.test(doc.url);
    const raw = join(corpus, `${tier}-doc${d}.${isPdf ? 'pdf' : 'html'}`);
    const text = join(corpus, `${tier}-doc${d}.txt`);

    if (!existsSync(raw)) run('curl', ['-sSL', '--fail', '-A', 'Mozilla/5.0', '-o', raw, doc.url]);

    let pages;
    if (isPdf) {
      run('pdftotext', ['-enc', 'UTF-8', raw, text]);
      pages = readFileSync(text, 'utf8').split('\f');
      if (pages.at(-1).trim() === '') pages.pop();
    } else {
      pages = [htmlToText(readFileSync(raw, 'utf8'))];
      writeFileSync(text, pages[0]);
    }

    const before = previous.documents[d]?.url === doc.url ? previous.documents[d].pages : [];
    return {
      url: doc.url,
      text,
      pages: pages.map((body, i) => {
        const n = i + 1;
        const ocr = body.replace(/\s/g, '').length < OCR_THRESHOLD;
        if (ocr && isPdf) {
          const png = join(corpus, `${tier}-doc${d}-p${n}`);
          if (!existsSync(`${png}.png`)) run('pdftoppm', ['-r', '110', '-png', '-singlefile', '-f', String(n), '-l', String(n), raw, png]);
        }
        const calendar = ocr || CALENDAR_TERM.test(body);
        const kept = before.find((p) => p.n === n && p.status !== 'pending' && p.status !== 'skipped');
        return {
          n,
          chars: body.length,
          calendar,
          ocr,
          image: ocr && isPdf ? join(corpus, `${tier}-doc${d}-p${n}.png`) : null,
          status: kept?.status ?? (calendar ? 'pending' : 'skipped'),
        };
      }),
    };
  });

  const result = { region, tier, extractedAt: new Date().toISOString(), documents };
  writeJson(outFile, result);
  return result;
}

/** Page texts for one document, 1-indexed, as the judge and the validator read them. */
export function pageTexts(docEntry) {
  const body = readFileSync(docEntry.text, 'utf8');
  return docEntry.url.match(/\.pdf($|\?)/i) || body.includes('\f') ? body.split('\f') : [body];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [region, tier = 'pat'] = process.argv.slice(2);
  if (!region) {
    console.error('usage: extract.mjs <region> <pat|calendar>');
    process.exit(2);
  }
  const r = extract(region, tier);
  for (const [d, doc] of r.documents.entries()) {
    const skipped = doc.pages.filter((p) => p.status === 'skipped').map((p) => p.n);
    const ocr = doc.pages.filter((p) => p.ocr).length;
    const chars = (f) => doc.pages.filter(f).reduce((s, p) => s + p.chars, 0);
    console.log(
      `${region} ${tier} doc${d}: ${doc.pages.length} pages, ${skipped.length} skipped (no calendar term)` +
        `${skipped.length ? ` [${skipped.join(', ')}]` : ''}, ${ocr} need OCR, ` +
        `${chars((p) => p.calendar)} of ${chars(() => true)} chars go to the judge`,
    );
  }
}
