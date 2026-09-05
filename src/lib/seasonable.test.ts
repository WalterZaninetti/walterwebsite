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
import type { Dataset, Window } from './seasonable.ts';
import {
  covers,
  currentHalfMonth,
  kindsOf,
  phaseAt,
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
    assert.ok(
      p.designation === 'DOP' || p.designation === 'IGP' || p.designation === null,
      `${p.id}: ${p.designation}`,
    );
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
    assert.ok(w.sources.length > 0, `${w.produce} cites no source at all`);
    for (const id of w.sources) assert.ok(sourceIds.has(id), `window cites unknown source ${id}`);
    assert.ok(w.provinces.length > 0, `${w.produce} answers for no province`);
    for (const p of w.provinces) assert.ok(provinceIds.has(p), `${w.produce} names unknown province ${p}`);
    assert.equal(new Set(w.provinces).size, w.provinces.length, `${w.produce} repeats a province`);
  }
});

test('a species entry exists only to carry a generalised window', () => {
  // `designation: null` is the licence to render a row without a DOP or IGP
  // after it. Nothing else may use it: a species that carried a documented
  // window would be a quoted claim about "cherry", which no disciplinare makes.
  const speciesIds = new Set(produce.filter((p) => p.designation === null).map((p) => p.id));
  for (const w of windows) {
    if (speciesIds.has(w.produce)) {
      assert.equal(w.basis, 'generalised', `${w.produce} is a species but carries a documented window`);
    } else {
      assert.equal(w.basis, 'documented', `${w.produce} is a designation but carries a generalised window`);
    }
  }
});

test('a generalised window is the union of designations it actually cites', () => {
  // The row must be exactly what it claims: the union of the documented windows
  // for the same species, drawn from at least three designations. If someone
  // widens one by hand this fails, which is the point.
  const byId = new Map(produce.map((p) => [p.id, p]));
  for (const w of windows.filter((x) => x.basis === 'generalised')) {
    const kind = byId.get(w.produce)?.en;
    assert.ok(kind, `${w.produce} has no kind`);
    assert.ok(w.sources.length >= 3, `${w.produce} generalises from only ${w.sources.length} designations`);
    const parts = windows.filter(
      (x) => x.basis === 'documented' && w.sources.includes(x.sources[0]) && byId.get(x.produce)?.en === kind,
    );
    assert.equal(parts.length, w.sources.length, `${w.produce} cites a source that is not one of its parts`);
    assert.equal(Math.min(...parts.map((x) => x.start)), w.start, `${w.produce} start is not the union's`);
    assert.equal(Math.max(...parts.map((x) => x.end)), w.end, `${w.produce} end is not the union's`);
  }
});

test('a generalised window never lands where a document already answers', () => {
  const byId = new Map(produce.map((p) => [p.id, p]));
  for (const p of provinces) {
    const rows = seasonYear(dataset, p.id);
    const kinds = rows.flatMap((r) => r.entries.map((e) => [r.produce.en, e.window.basis] as const));
    for (const [kind, basis] of kinds) {
      if (basis !== 'generalised') continue;
      assert.ok(
        !kinds.some(([k, b]) => k === kind && b === 'documented'),
        `${p.id} renders a generalised ${kind} beside a documented one`,
      );
    }
  }
  assert.ok(byId.size > 0);
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

test('a source either prints a plausible year or prints none at all', () => {
  // `year` is optional because the ministry's consolidated disciplinari carry
  // no date anywhere in them, and they are the only document stating the
  // current window for most designations. What must never happen is a year
  // that is present and wrong, or a zero standing in for "unknown" — that is
  // the shape the old dataset had, and it is why this gate exists.
  for (const s of sources) {
    if (s.year === undefined) continue;
    assert.ok(
      Number.isInteger(s.year) && s.year >= 1990 && s.year <= new Date().getFullYear() + 1,
      `${s.id}: year ${s.year}`,
    );
  }
});

test('every source is cited to a publisher, not to an aggregator', () => {
  // Every citation on this page once resolved to disciplinare.it, a commercial
  // aggregator: one host away from the whole page losing its evidence, and
  // several of the copies it served were proposals rather than texts in force.
  // Sources are now the EU's Official Journal or the ministry's own register.
  const allowed = ['eur-lex.europa.eu', 'www.masaf.gov.it'];
  for (const s of sources) {
    const host = new URL(s.url).hostname;
    assert.ok(allowed.includes(host), `${s.id} cites ${host}, which is not a publisher of record`);
  }
});

test('an undated source is a consolidated text, and says so in its name', () => {
  // The only licence to omit a year is being the text in force. If a source
  // drops the year without being a disciplinare consolidato, it is an
  // unverified year wearing a disguise.
  for (const s of sources.filter((x) => x.year === undefined)) {
    assert.match(
      s.name,
      /disciplinare/i,
      `${s.id} omits a year without being a disciplinare`,
    );
    assert.ok(s.url.includes('masaf.gov.it'), `${s.id} omits a year but is not the ministry's text`);
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
  const cited = new Set(windows.flatMap((w) => [...w.sources]));
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
  // Mela Rossa Cuneo is a commercialisation window, i.e. storage, and the only
  // window Cuneo's apple has — so every entry on the row is `stored` and the
  // calendar has to say so rather than falling back to open-field.
  const row = seasonYear(dataset, 'cn').find((r) => r.produce.id === 'mela-rossa-cuneo');
  assert.ok(row, 'Cuneo should answer for Mela Rossa Cuneo');
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
        assert.ok(e.sources.length > 0, `${e.produce.id} renders with no source`);
        for (const s of e.sources) {
          assert.ok(s.url.startsWith('https://'), `${e.produce.id} has no source url`);
          assert.ok(s.year === undefined || s.year > 0, `${e.produce.id} cites an unverified year`);
          assert.ok(s.accessed, `${e.produce.id} cites a source with no accessed date`);
        }
      }
    }
  }
});

test('the catalogue answers for a real share of the country', () => {
  const answered = new Set(windows.flatMap((w) => [...w.provinces]));
  // Not a coverage target — a floor, so that silently losing half the dataset
  // fails here rather than rendering an empty page for most of Italy.
  assert.ok(answered.size >= 50, `only ${answered.size} provinces answer anything`);
});

/** A calendar open across `[start, end]` inclusive, wrap included. */
const lane = (start: number, end: number): (Window['kind'] | null)[] =>
  Array.from({ length: 24 }, (_, h) => (covers(h, start, end) ? 'open-field' : null));

test('phaseAt() names both edges of a long window and the middle between them', () => {
  const summer = lane(10, 17);
  assert.equal(phaseAt(summer, 10).phase, 'starting');
  assert.equal(phaseAt(summer, 11).phase, 'starting');
  assert.equal(phaseAt(summer, 12).phase, 'peak');
  assert.equal(phaseAt(summer, 15).phase, 'peak');
  assert.equal(phaseAt(summer, 16).phase, 'ending');
  assert.equal(phaseAt(summer, 17).phase, 'ending');
  assert.equal(phaseAt(summer, 10).ends, 17);
});

test('phaseAt() gives a short window no edges to stand on', () => {
  const brief = lane(8, 11);
  for (const h of [8, 9, 10, 11]) assert.equal(phaseAt(brief, h).phase, 'peak');
});

test('phaseAt() reads a wrapping window as one season', () => {
  const citrus = lane(22, 7);
  assert.equal(phaseAt(citrus, 23).phase, 'starting');
  assert.equal(phaseAt(citrus, 2).phase, 'peak');
  assert.equal(phaseAt(citrus, 7).phase, 'ending');
  assert.equal(phaseAt(citrus, 0).ends, 7);
});

test('phaseAt() joins two abutting windows rather than reporting two seasons', () => {
  const both = lane(4, 7).map((cell, h) => cell ?? (covers(h, 8, 13) ? 'stored' : null));
  assert.equal(phaseAt(both, 8).phase, 'peak');
  assert.equal(phaseAt(both, 4).ends, 13);
});

test('phaseAt() counts the fortnights to a window it has not reached', () => {
  const autumn = lane(18, 21);
  assert.deepEqual(phaseAt(autumn, 16), { phase: 'coming', starts: 18, away: 2 });
  assert.equal(phaseAt(autumn, 15).phase, 'out');
  assert.equal(phaseAt(autumn, 15).starts, 18);
});

test('phaseAt() finds the next window across the year end', () => {
  const winter = lane(1, 3);
  assert.deepEqual(phaseAt(winter, 23), { phase: 'coming', starts: 1, away: 2 });
});

test('phaseAt() terminates on a calendar with no edge at all', () => {
  assert.deepEqual(phaseAt(lane(0, 23), 6), { phase: 'peak' });
  assert.deepEqual(phaseAt(Array.from({ length: 24 }, () => null), 6), { phase: 'out' });
});
