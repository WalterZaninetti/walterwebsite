/**
 * What is genuinely in season, for a region, in a half-month.
 *
 * The model lives here rather than in the component for the reason
 * hypergeometric.ts does: the assumptions are the interesting part, and they
 * belong next to the arithmetic that depends on them.
 *
 * Three assumptions, all of them visible to the reader on the page:
 *
 *  1. The unit of answer is the region, not the town. A window keyed to a
 *     region overrides — never supplements — the one keyed to its climate
 *     zone, which is what makes "wrong for Sicily and for Piedmont at the same
 *     time" fixable one row at a time.
 *  2. The unit of time is the half-month. The copy says a warm year moves
 *     everything by two weeks; a month-resolution grid could not express the
 *     size of its own error.
 *  3. Nothing here knows about *this* year. Windows describe the normal year.
 *
 * The dataset is imported by the caller and passed in, so this file has no
 * imports at all and the tests can run it against a fixture.
 */

/** 0-23. 0 is 1-15 January, 1 is 16-31 January, ... 23 is 16-31 December. */
export type HalfMonth = number;

export const HALF_MONTHS = 24;

export type ProduceId = string;
export type ZoneId = string;
export type RegionId = string;
export type ProvinceId = string;
export type SourceId = string;

export type WindowKind = 'open-field' | 'greenhouse' | 'stored';

export type Produce = {
  id: ProduceId;
  en: string;
  it: string;
  category: 'fruit' | 'vegetable';
  /**
   * "You will see this in an Italian shop all year round."
   *
   * The one editorial judgement per item, and the whole gate on the flown
   * bucket. Without it, flown is pure computed absence and lists cherries in
   * January — true, and useless, because nobody is selling cherries in January
   * either.
   */
  alwaysOnShelf: boolean;
};

export type Zone = {
  id: ZoneId;
  /** Köppen class, for the record. Nothing computes on it — it documents why
   *  these regions were grouped, so a later reader can disagree with evidence. */
  koppen: string;
};

export type Region = {
  id: RegionId;
  zone: ZoneId;
  it: string;
  /** English exonym only where one is in common use. Absent means render `it`. */
  en?: string;
};

export type Province = {
  id: ProvinceId;
  region: RegionId;
  name: string;
};

export type Source = {
  id: SourceId;
  name: string;
  url: string;
  year: number;
  /** How narrow this authority is. Rendered to the reader; not a quality score. */
  scope: 'region' | 'zone' | 'national';
};

export type Window = {
  produce: ProduceId;
  /** Exactly one of `region` / `zone` is set. Enforced by the invariant test,
   *  because the override rule below is only well defined if it holds. */
  region?: RegionId;
  zone?: ZoneId;
  kind: WindowKind;
  /** Both inclusive. May wrap the year: start 22, end 7 is mid-December to
   *  mid-April, which is the common case for citrus. */
  start: HalfMonth;
  end: HalfMonth;
  source: SourceId;
};

export type Dataset = {
  produce: readonly Produce[];
  zones: readonly Zone[];
  regions: readonly Region[];
  provinces: readonly Province[];
  sources: readonly Source[];
  windows: readonly Window[];
};

export type Entry = {
  produce: Produce;
  kind: WindowKind;
  window: Window;
  source: Source;
  /** Which key matched. 'region' means a region-specific row beat the zone default. */
  basis: 'region' | 'zone';
};

/**
 * `flown` is Produce[] and not Entry[] on purpose. The other two buckets are
 * claims, backed by a window and therefore by a source. This one is an
 * absence: nothing is being cited because nothing is being claimed beyond "no
 * window in the catalogue covers this here, now". Giving it an Entry would
 * hand it a provenance it has not got.
 */
export type Answer = {
  picking: readonly Entry[];
  stored: readonly Entry[];
  flown: readonly Produce[];
};

/** The half-month containing `now`. Day 1-15 is the early half, 16-31 the late one. */
export function currentHalfMonth(now: Date = new Date()): HalfMonth {
  return now.getMonth() * 2 + (now.getDate() <= 15 ? 0 : 1);
}

/** 0-based month index for a half-month, and whether it is the late half. */
export function splitHalfMonth(half: HalfMonth): { month: number; late: boolean } {
  return { month: Math.floor(half / 2), late: half % 2 === 1 };
}

/**
 * Inclusive containment, wrapping the year end.
 *
 * The single likeliest bug in this file: a window from December into April has
 * start > end, and the naive `h >= start && h <= end` silently returns false
 * for every half-month in it. Citrus is the common case, so the failure would
 * have been "oranges are never in season".
 */
export function covers(h: HalfMonth, start: HalfMonth, end: HalfMonth): boolean {
  return start <= end ? h >= start && h <= end : h >= start || h <= end;
}

/** How many half-months a window spans, inclusive, wrap included. */
export function windowLength(start: HalfMonth, end: HalfMonth): number {
  return start <= end ? end - start + 1 : HALF_MONTHS - start + end + 1;
}

export function regionOf(data: Dataset, province: ProvinceId): Region | undefined {
  const found = data.provinces.find((p) => p.id === province);
  return found && data.regions.find((r) => r.id === found.region);
}

/** The region's display name in the active language, falling back to Italian. */
export function regionName(region: Region, locale: 'en' | 'it'): string {
  return locale === 'en' ? (region.en ?? region.it) : region.it;
}

export function produceName(produce: Produce, locale: 'en' | 'it'): string {
  return locale === 'en' ? produce.en : produce.it;
}

const KINDS: readonly WindowKind[] = ['open-field', 'greenhouse', 'stored'];

/**
 * Every window that could apply to this region, for one produce and one kind,
 * resolved down to the single row that wins.
 *
 * A region row *overrides* the zone row rather than adding to it. Two rows for
 * the same (produce, kind, region) would make this undefined, which is why the
 * invariant test rejects them rather than this function guessing.
 */
function resolve(
  data: Dataset,
  produce: ProduceId,
  kind: WindowKind,
  region: RegionId,
  zone: ZoneId,
): Window | undefined {
  let zoneRow: Window | undefined;
  for (const w of data.windows) {
    if (w.produce !== produce || w.kind !== kind) continue;
    if (w.region === region) return w;
    if (w.zone === zone) zoneRow = w;
  }
  return zoneRow;
}

export function whatsInSeason(data: Dataset, region: RegionId, half: HalfMonth): Answer {
  const home = data.regions.find((r) => r.id === region);
  if (!home) return { picking: [], stored: [], flown: [] };

  const picking: Entry[] = [];
  const stored: Entry[] = [];
  const flown: Produce[] = [];

  for (const produce of data.produce) {
    let found = false;

    for (const kind of KINDS) {
      const window = resolve(data, produce.id, kind, home.id, home.zone);
      if (!window || !covers(half, window.start, window.end)) continue;

      const source = data.sources.find((s) => s.id === window.source);
      // A window whose source id does not resolve is a broken row, not a row
      // to render without provenance. The invariant test makes it
      // unrepresentable; this drops it rather than shipping an uncited claim.
      if (!source) continue;

      found = true;
      const entry: Entry = {
        produce,
        kind,
        window,
        source,
        basis: window.region ? 'region' : 'zone',
      };
      if (kind === 'stored') stored.push(entry);
      else picking.push(entry);
    }

    if (!found && produce.alwaysOnShelf) flown.push(produce);
  }

  return { picking, stored, flown };
}

/**
 * Locale-aware ordering, kept out of the model above so the answer itself does
 * not depend on which language is on screen. Intl.Collator is built in — it
 * gets Italian accents right, which localeCompare on a bare string does not
 * reliably do across engines.
 */
export function byName<T extends Entry | Produce>(items: readonly T[], locale: 'en' | 'it'): T[] {
  const collator = new Intl.Collator(locale);
  const name = (item: Entry | Produce): string =>
    'produce' in item ? item.produce[locale] : item[locale];
  return [...items].sort((a, b) => collator.compare(name(a), name(b)));
}
