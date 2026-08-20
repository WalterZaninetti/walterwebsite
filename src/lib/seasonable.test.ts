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
 */

import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Dataset } from './seasonable.ts';
import { covers, currentHalfMonth, whatsInSeason, windowLength } from './seasonable.ts';
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
  const tables: Record<string, readonly { id: string }[]> = {
    produce,
    zones,
    regions,
    provinces,
    sources,
  };
  for (const [name, rows] of Object.entries(tables)) {
    assert.equal(ids(rows).size, rows.length, `${name} has a duplicate id`);
  }
});

test('the catalogue is the size the copy claims', () => {
  // seasonable.s2.body tells the reader "forty-five things". The two move
  // together or the page states a number it does not hold.
  assert.equal(produce.length, 45);
  assert.equal(regions.length, 20);
  assert.equal(provinces.length, 107);
});

test('every produce has both names and a category', () => {
  for (const p of produce) {
    assert.ok(p.en.length > 0, `${p.id} has no English name`);
    assert.ok(p.it.length > 0, `${p.id} has no Italian name`);
    assert.ok(p.category === 'fruit' || p.category === 'vegetable', `${p.id} category`);
  }
});

test('every region points at a real zone, every province at a real region', () => {
  const zoneIds = ids(zones);
  const regionIds = ids(regions);
  for (const r of regions) assert.ok(zoneIds.has(r.zone), `${r.id} -> ${r.zone}`);
  for (const p of provinces) assert.ok(regionIds.has(p.region), `${p.id} -> ${p.region}`);
});

test('every region has at least one province to reach it by', () => {
  const reachable = new Set(provinces.map((p) => p.region));
  for (const r of regions) assert.ok(reachable.has(r.id), `${r.id} has no province`);
});

test('every window resolves its produce, its scope key and its source', () => {
  const produceIds = ids(produce);
  const zoneIds = ids(zones);
  const regionIds = ids(regions);
  const sourceIds = ids(sources);

  for (const w of windows) {
    assert.ok(produceIds.has(w.produce), `window produce ${w.produce}`);
    assert.ok(sourceIds.has(w.source), `window source ${w.source}`);

    const scoped = Number(w.region !== undefined) + Number(w.zone !== undefined);
    assert.equal(scoped, 1, `${w.produce}: exactly one of region/zone must be set`);

    if (w.region !== undefined) assert.ok(regionIds.has(w.region), `window region ${w.region}`);
    if (w.zone !== undefined) assert.ok(zoneIds.has(w.zone), `window zone ${w.zone}`);
  }
});

test('every window sits inside the half-month range', () => {
  for (const w of windows) {
    for (const edge of [w.start, w.end]) {
      assert.ok(Number.isInteger(edge) && edge >= 0 && edge <= 23, `${w.produce} edge ${edge}`);
    }
  }
});

test('no two windows share a scope key — the override rule needs it unique', () => {
  // resolve() returns the region row if one matches and the zone row otherwise.
  // Two rows for the same (produce, kind, scope) make that undefined, so this
  // makes it unrepresentable rather than letting the model pick arbitrarily.
  const seen = new Set<string>();
  for (const w of windows) {
    const key = `${w.produce}|${w.kind}|${w.region ?? w.zone}`;
    assert.ok(!seen.has(key), `duplicate window: ${key}`);
    seen.add(key);
  }
});

test('every produce has a window somewhere', () => {
  const covered = new Set(windows.map((w) => w.produce));
  for (const p of produce) assert.ok(covered.has(p.id), `${p.id} has no window at all`);
});

test('every source carries a real url', () => {
  for (const s of sources) {
    assert.ok(s.name.length > 0, `${s.id} has no name`);
    assert.ok(s.url.startsWith('https://'), `${s.id} url`);
    assert.ok(['region', 'zone', 'national'].includes(s.scope), `${s.id} scope`);
  }
});

test('every source has a verified publication year', () => {
  // The honesty gate, and the one test expected to fail on a fresh checkout.
  //
  // sources.ts ships every year as 0 because this build could not verify which
  // document each body publishes or when. The page's whole claim is that every
  // window cites a real, checkable publication, so a plausible-looking year
  // next to a real organisation would be worse than an empty one. Filling these
  // in is what makes the dataset shippable — see the header of sources.ts.
  const unverified = sources.filter((s) => s.year === 0).map((s) => s.id);
  assert.deepEqual(
    unverified,
    [],
    `${unverified.length} source(s) still carry an unverified year: ${unverified.join(', ')}`,
  );
});

test('covers() wraps the year end', () => {
  // A December-to-April window has start > end. The naive comparison returns
  // false for every half-month in it, which would have read as "oranges are
  // never in season" rather than as an error.
  assert.equal(covers(23, 22, 7), true, 'late December, inside a wrapping window');
  assert.equal(covers(0, 22, 7), true, 'early January, inside');
  assert.equal(covers(7, 22, 7), true, 'the closing edge is inclusive');
  assert.equal(covers(22, 22, 7), true, 'the opening edge is inclusive');
  assert.equal(covers(8, 22, 7), false, 'just past the close');
  assert.equal(covers(21, 22, 7), false, 'just before the open');

  assert.equal(covers(10, 8, 14), true, 'non-wrapping, inside');
  assert.equal(covers(8, 8, 14), true, 'non-wrapping, opening edge');
  assert.equal(covers(14, 8, 14), true, 'non-wrapping, closing edge');
  assert.equal(covers(15, 8, 14), false, 'non-wrapping, past the close');
  assert.equal(covers(7, 8, 14), false, 'non-wrapping, before the open');

  assert.equal(covers(5, 5, 5), true, 'a single half-month window');
});

test('windowLength counts inclusively, wrap included', () => {
  assert.equal(windowLength(8, 14), 7);
  assert.equal(windowLength(5, 5), 1);
  assert.equal(windowLength(22, 7), 10);
  assert.equal(windowLength(0, 23), 24);
});

test('currentHalfMonth splits the month at the 15th', () => {
  assert.equal(currentHalfMonth(new Date(2026, 0, 1)), 0);
  assert.equal(currentHalfMonth(new Date(2026, 0, 15)), 0);
  assert.equal(currentHalfMonth(new Date(2026, 0, 16)), 1);
  assert.equal(currentHalfMonth(new Date(2026, 11, 31)), 23);
  assert.equal(currentHalfMonth(new Date(2026, 2, 20)), 5);
});

test('an unknown region answers empty rather than throwing', () => {
  const answer = whatsInSeason(dataset, 'atlantis', 0);
  assert.deepEqual(answer, { picking: [], stored: [], flown: [] });
});

test('a region override beats its zone default', () => {
  // Sicilian blood oranges run later than the island zone's default (21-9):
  // reg-sicilia sets 22-7. Half-month 21 is inside the zone window and outside
  // the region's, so the override is doing the work if nothing is picked.
  const early = whatsInSeason(dataset, 'sicilia', 21);
  assert.ok(
    !early.picking.some((e) => e.produce.id === 'orange'),
    'the zone default leaked past the Sicilian override',
  );

  const inSeason = whatsInSeason(dataset, 'sicilia', 0);
  const orange = inSeason.picking.find((e) => e.produce.id === 'orange');
  assert.ok(orange, 'oranges should be picking in Sicily in early January');
  assert.equal(orange.basis, 'region');
  assert.equal(orange.source.id, 'reg-sicilia');
});

test('a region with no override falls back to its zone', () => {
  const answer = whatsInSeason(dataset, 'calabria', 0);
  const orange = answer.picking.find((e) => e.produce.id === 'orange');
  assert.ok(orange, 'oranges should be picking in Calabria in early January');
  assert.equal(orange.basis, 'zone');
});

test('flown is gated on alwaysOnShelf, and is never a sourced claim', () => {
  // Piedmont in early January: strawberries are on every shelf and nothing in
  // the north is picking them.
  const answer = whatsInSeason(dataset, 'piemonte', 0);
  assert.ok(
    answer.flown.some((p) => p.id === 'strawberry'),
    'strawberries should be flown in Piedmont in January',
  );
  for (const p of answer.flown) {
    assert.equal(p.alwaysOnShelf, true, `${p.id} is flown without being always on the shelf`);
    // The type already prevents it; this states the intent so a later change
    // that turns flown into Entry[] fails here rather than in review.
    assert.equal('source' in p, false, `${p.id} carries a provenance it has not got`);
  }
});

test('every region answers something in every half-month', () => {
  // State 8 in architecture.md — all three buckets empty — is meant to be
  // unreachable with the catalogue as it stands. This is what makes that a
  // measured claim rather than an assumption, and it fails loudly if a future
  // edit thins the dataset somewhere nobody was looking.
  for (const region of regions) {
    for (let half = 0; half < 24; half += 1) {
      const { picking, stored, flown } = whatsInSeason(dataset, region.id, half);
      assert.ok(
        picking.length + stored.length + flown.length > 0,
        `${region.id} has nothing at all in half-month ${half}`,
      );
    }
  }
});

test('every rendered entry carries a resolvable source', () => {
  for (const region of regions) {
    for (let half = 0; half < 24; half += 1) {
      const { picking, stored } = whatsInSeason(dataset, region.id, half);
      for (const entry of [...picking, ...stored]) {
        assert.ok(entry.source.name.length > 0, `${entry.produce.id} in ${region.id}`);
      }
    }
  }
});
