/**
 * The dataset's invariants, and the model's one hard edge.
 *
 * This is what stands in for a runtime validation library. There is no wire
 * here and no untrusted input — the data is authored in-repo and `tsc -b`
 * checks its shape — so what zod would have added is referential integrity,
 * range checks and duplicate detection. Those run better as a test over the
 * whole real dataset than as a schema over one request's worth of it, and they
 * cost no runtime dependency.
 *
 * `npm test` runs inside `npm run deploy`, so a broken dataset cannot ship —
 * the same posture check:csp already has.
 *
 * Four of the tests below exist because the first version of this dataset
 * failed them: sources that were organisation homepages, sources no window
 * cited, years nobody had verified, and no record of when a link was last
 * known to work. They are the provenance gate, and they are the reason the
 * page can say what it says.
 */

import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Dataset } from './seasonable.ts';
import {
  covers,
  currentHalfMonth,
  kindsOf,
  seasonYear,
  sourcesOf,
  windowLength,
} from './seasonable.ts';
import { produce } from '../content/seasonable/produce.ts';
import { provinces, regions, zones } from '../content/seasonable/geography.ts';
import { sources } from '../content/seasonable/sources.ts';
import { windows } from '../content/seasonable/windows.ts';

/**
 * Assembled here rather than imported from content/seasonable/index.ts, and the
 * reason is Node's resolver rather than a preference.
 *
 * The app's imports are extensionless, which Vite resolves and bare Node does
 * not. The four data modules above only ever `import type`, so type-stripping
 * erases their imports entirely and Node loads them as written; index.ts has
 * value imports and would need `.ts` suffixes that nothing else in src/ uses.
 * Rebuilding the one-line object here is cheaper than a convention break, and
 * the object it builds is the same one — if that stops being true, the shape
 * assertions below fail.
 */
const dataset: Dataset = { produce, zones, regions, provinces, sources, windows };

const ids = <T extends { id: string }>(rows: readonly T[]) => new Set(rows.map((r) => r.id));

test('no table has a duplicate id', () => {
  const tables: Record<string, readonly { id: string }[]> = { produce, zones, regions, provinces, sources };
  for (const [name, rows] of Object.entries(tables)) {
    assert.equal(ids(rows).size, rows.length, `${name} has a duplicate id`);
  }
});

test('the geography is whole', () => {
  assert.equal(regions.length, 20);
  assert.equal(provinces.length, 107);
  const zoneIds = ids(zones);
  const regionIds = ids(regions);
  for (const r of regions) assert.ok(zoneIds.has(r.zone), `${r.id} sits in no zone`);
  for (const p of provinces) assert.ok(regionIds.has(p.region), `${p.id} sits in no region`);
});

test('every designation names itself and says what it is', () => {
  for (const p of produce) {
    assert.ok(p.name.length > 0, `${p.id} has no name`);
    assert.ok(p.en.length > 0 && p.it.length > 0, `${p.id} is missing a kind`);
    assert.ok(p.designation === 'DOP' || p.designation === 'IGP', `${p.id}: ${p.designation}`);
    // The designation is the document's, so it must not be pre-suffixed here —
    // produceName() appends it, and "Carciofo di Paestum IGP IGP" is the bug.
    assert.doesNotMatch(p.name, /\b(DOP|IGP)\b/, `${p.id} carries its designation twice`);
  }
});

test('every window resolves, and lands somewhere real', () => {
  const produceIds = ids(produce);
  const sourceIds = ids(sources);
  const provinceIds = ids(provinces);
  for (const w of windows) {
    assert.ok(produceIds.has(w.produce), `window for unknown produce ${w.produce}`);
    assert.ok(sourceIds.has(w.source), `window cites unknown source ${w.source}`);
    assert.ok(w.provinces.length > 0, `${w.produce} answers for no province`);
    for (const p of w.provinces) assert.ok(provinceIds.has(p), `${w.produce} names unknown province ${p}`);
    assert.equal(new Set(w.provinces).size, w.provinces.length, `${w.produce} repeats a province`);
  }
});

test('every window sits inside the year', () => {
  for (const w of windows) {
    assert.ok(Number.isInteger(w.start) && w.start >= 0 && w.start <= 23, `${w.produce} start ${w.start}`);
    assert.ok(Number.isInteger(w.end) && w.end >= 0 && w.end <= 23, `${w.produce} end ${w.end}`);
  }
});

test('no window is duplicated', () => {
  const seen = new Set<string>();
  for (const w of windows) {
    const key = `${w.produce}|${w.kind}|${w.start}|${w.end}|${[...w.provinces].sort().join(',')}`;
    assert.ok(!seen.has(key), `duplicate window ${key}`);
    seen.add(key);
  }
});

test('every designation has at least one window', () => {
  const covered = new Set(windows.map((w) => w.produce));
  for (const p of produce) assert.ok(covered.has(p.id), `${p.id} has no window`);
});

// ── The provenance gate ────────────────────────────────────────────────────

test('every source has a verified publication year', () => {
  const unverified = sources.filter((s) => !s.year);
  assert.equal(unverified.length, 0, `${unverified.length} source(s) still carry an unverified year`);
  for (const s of sources) {
    assert.ok(s.year >= 1990 && s.year <= new Date().getFullYear() + 1, `${s.id}: year ${s.year}`);
  }
});

test('every source records the day it was last read', () => {
  const today = new Date().toISOString().slice(0, 10);
  for (const s of sources) {
    assert.match(s.accessed, /^\d{4}-\d{2}-\d{2}$/, `${s.id}: accessed "${s.accessed}"`);
    assert.ok(s.accessed <= today, `${s.id} was accessed in the future`);
  }
});

test('every source points at a document, not at a homepage', () => {
  for (const s of sources) {
    const url = new URL(s.url);
    assert.equal(url.protocol, 'https:', `${s.id} is not https`);
    // A bare origin means no document was ever found. This is the test the
    // first version of sources.ts failed twenty-two times over.
    assert.ok(url.pathname.length > 1, `${s.id} cites an origin, not a document: ${s.url}`);
    assert.ok(s.name.length > 0, `${s.id} has no document title`);
  }
});

test('no source is declared and left uncited', () => {
  const cited = new Set(windows.map((w) => w.source));
  for (const s of sources) assert.ok(cited.has(s.id), `${s.id} is declared but no window cites it`);
});

// ── The model ──────────────────────────────────────────────────────────────

test('covers() wraps the year end', () => {
  assert.ok(covers(5, 2, 9));
  assert.ok(!covers(1, 2, 9));
  assert.ok(!covers(10, 2, 9));
  // start > end: mid-September to mid-April
  assert.ok(covers(23, 17, 6));
  assert.ok(covers(0, 17, 6));
  assert.ok(covers(17, 17, 6));
  assert.ok(!covers(10, 17, 6));
});

test('windowLength() counts inclusively, wrap included', () => {
  assert.equal(windowLength(2, 9), 8);
  assert.equal(windowLength(4, 4), 1);
  assert.equal(windowLength(22, 1), 4);
});

test('currentHalfMonth() splits the month at the 15th', () => {
  assert.equal(currentHalfMonth(new Date('2026-01-01T12:00:00')), 0);
  assert.equal(currentHalfMonth(new Date('2026-01-15T12:00:00')), 0);
  assert.equal(currentHalfMonth(new Date('2026-01-16T12:00:00')), 1);
  assert.equal(currentHalfMonth(new Date('2026-12-31T12:00:00')), 23);
});

test('an unknown province answers nothing rather than everything', () => {
  assert.deepEqual(seasonYear(dataset, 'nowhere'), []);
});

test('a province answers only for windows that name it', () => {
  // Carciofo di Paestum, 1 February to 20 May, provincia di Salerno.
  const salerno = seasonYear(dataset, 'sa');
  assert.ok(salerno.some((row) => row.produce.id === 'carciofo-paestum'));
  // Milano is named by no disciplinare in the catalogue.
  assert.deepEqual(seasonYear(dataset, 'mi'), []);
});

test('a calendar is open exactly where its window covers', () => {
  const row = seasonYear(dataset, 'sa').find((r) => r.produce.id === 'carciofo-paestum');
  assert.ok(row, 'Salerno should answer for Carciofo di Paestum');
  // 1 February to 20 May is half-months 2 through 9 inclusive.
  assert.equal(row.calendar[4], 'open-field');
  // Mid-September: the window has closed.
  assert.equal(row.calendar[17], null);
  assert.equal(row.calendar.length, 24);
  assert.equal(
    row.calendar.filter((k) => k !== null).length,
    8,
    'the artichoke window is eight half-months long',
  );
});

test('the window kind reaches the calendar', () => {
  // Aglio Bianco Polesano is a storage window only, all year bar early July.
  const row = seasonYear(dataset, 'ro').find((r) => r.produce.id === 'aglio-polesano');
  assert.ok(row, 'Rovigo should answer for Aglio Bianco Polesano');
  assert.equal(row.calendar[0], 'stored');
  assert.ok(row.entries.every((e) => e.kind === 'stored'));
});

test('a wrapping window is open on both sides of the year end', () => {
  // start > end is the bug this whole model is shaped around, and the table
  // now renders it as two runs rather than one, so it is worth asserting on
  // the calendar and not only on covers().
  const wrapping = windows.find((w) => w.start > w.end);
  assert.ok(wrapping, 'the catalogue should contain at least one wrapping window');
  const row = seasonYear(dataset, wrapping.provinces[0]).find(
    (r) => r.produce.id === wrapping.produce,
  );
  assert.ok(row);
  assert.notEqual(row.calendar[wrapping.start], null);
  assert.notEqual(row.calendar[wrapping.end], null);
  assert.notEqual(row.calendar[0], null, 'a wrapping window must be open in early January');
});

test('one designation is one row, however many windows it carries', () => {
  for (const province of provinces) {
    const rows = seasonYear(dataset, province.id);
    const ids = rows.map((r) => r.produce.id);
    assert.equal(new Set(ids).size, ids.length, `${province.id} repeats a designation`);
  }
});

test('two windows out of one document cite it once', () => {
  // Finocchio di Isola Capo Rizzuto has a precoce and a tardiva window, both
  // stated in the same richiesta di riconoscimento. The row printed the
  // citation twice and labelled itself "open field · open field".
  const row = seasonYear(dataset, 'kr').find((r) => r.produce.id === 'finocchio-capo-rizzuto');
  assert.ok(row, 'Crotone should answer for Finocchio di Isola Capo Rizzuto');
  assert.equal(row.entries.length, 2, 'both windows must survive — the calendar draws both');
  assert.equal(sourcesOf(row).length, 1);
  assert.equal(kindsOf(row).length, 1);
  // Both windows still reach the calendar, on their own sides of the year.
  assert.notEqual(row.calendar[0], null, 'the precoce window runs into January');
  assert.notEqual(row.calendar[7], null, 'the tardiva window runs in April');
});

test('no row ever renders one document twice', () => {
  for (const province of provinces) {
    for (const row of seasonYear(dataset, province.id)) {
      const ids = sourcesOf(row).map((s) => s.id);
      assert.equal(new Set(ids).size, ids.length, `${province.id}/${row.produce.id} repeats a source`);
      const kinds = kindsOf(row);
      assert.equal(new Set(kinds).size, kinds.length, `${province.id}/${row.produce.id} repeats a kind`);
    }
  }
});

test('every rendered entry carries a resolvable source', () => {
  for (const p of provinces) {
    for (const row of seasonYear(dataset, p.id)) {
      for (const e of row.entries) {
        assert.ok(e.source.url.startsWith('https://'), `${e.produce.id} has no source url`);
        assert.ok(e.source.year > 0, `${e.produce.id} cites an unverified year`);
      }
    }
  }
});

test('the catalogue answers for a real share of the country', () => {
  const answered = new Set(windows.flatMap((w) => [...w.provinces]));
  // Not a coverage target — a floor, so that silently losing half the dataset
  // fails here rather than rendering an empty page for most of Italy.
  assert.ok(answered.size >= 30, `only ${answered.size} provinces answer anything`);
});
