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
  /**
   * The designation exactly as its own disciplinare writes it — "Carciofo di
   * Paestum", not "artichoke". This is the unit the sources actually license a
   * claim about: a disciplinare fixes when *this* protected product is picked
   * in *these* comuni, and says nothing about artichokes in general.
   */
  name: string;
  designation: 'DOP' | 'IGP';
  category: 'fruit' | 'vegetable';
  /** What kind of thing it is, for grouping and for the English reader. */
  en: string;
  it: string;
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
  /** The document's own title, verbatim. A proposal says it is a proposal. */
  name: string;
  url: string;
  year: number;
  /**
   * ISO `YYYY-MM-DD`: the day this document was last opened and confirmed to
   * say what the windows citing it claim.
   *
   * Not rendered — the reader sees the name and the publication year. It is
   * here because these URLs rot: the ministry's own national calendar is
   * already a 404, and without an accessed date there is no way to tell a link
   * that broke last week from one that was never checked.
   */
  accessed: string;
};

export type Window = {
  produce: ProduceId;
  /**
   * Every province the disciplinare's zone falls in. One row per document, not
   * one per province: the zone is a single fact about a single publication, and
   * splitting it would invite the rows to drift apart.
   */
  provinces: readonly ProvinceId[];
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
};

/**
 * One designation, and what happens to it in each of the twenty-four
 * half-months of a normal year in one province.
 *
 * This replaced a pair of buckets — "being picked now" and "from storage" —
 * that answered only for the fortnight the reader had selected. Two buckets
 * can say *that* something is in season; they cannot say *when*, and a reader
 * who cannot see the shape of a window has no way to judge how close to its
 * edge the answer sits. `calendar` is the whole year, so the page can draw a
 * month axis and let the reader read the answer off it instead of trusting it.
 *
 * `calendar[h]` is the kind of window covering half-month `h`, or null. The
 * two buckets are still recoverable — `calendar[h] === 'stored'` is the old
 * stored bucket — but they are now a reading of the row rather than a
 * partition performed before the reader sees anything.
 */
export type SeasonRow = {
  produce: Produce;
  /** Every window naming this province, for this produce. Usually one. */
  entries: readonly Entry[];
  /** Length 24, indexed by half-month. */
  calendar: readonly (WindowKind | null)[];
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

/** The designation is a proper noun: the same in both languages, by design. */
export function produceName(produce: Produce): string {
  return `${produce.name} ${produce.designation}`;
}

/** What kind of thing it is — "artichoke" / "carciofo" — for grouping. */
export function produceKind(produce: Produce, locale: 'en' | 'it'): string {
  return locale === 'en' ? produce.en : produce.it;
}

/**
 * Every designation a document names for this province, with its whole year.
 *
 * Rows are grouped by produce rather than by window because a designation can
 * carry two windows — Aglio Bianco Polesano is picked in one range and may be
 * *sold* from storage in another, out of the same document — and those are two
 * facts about one thing, not two things.
 *
 * Where two windows overlap, open field wins the cell. If it is growing
 * outside, that is the truer answer to the question the page asked, and the
 * row's own labels still name both kinds.
 */
export function seasonYear(data: Dataset, province: ProvinceId): readonly SeasonRow[] {
  const here = data.provinces.find((p) => p.id === province);
  if (!here) return [];

  const rows = new Map<ProduceId, { produce: Produce; entries: Entry[]; calendar: (WindowKind | null)[] }>();

  for (const window of data.windows) {
    if (!window.provinces.includes(here.id)) continue;

    const produce = data.produce.find((x) => x.id === window.produce);
    const source = data.sources.find((s) => s.id === window.source);
    // A window whose produce or source id does not resolve is a broken row,
    // not a row to render without provenance. The invariant test makes it
    // unrepresentable; this drops it rather than shipping an uncited claim.
    if (!produce || !source) continue;

    let row = rows.get(produce.id);
    if (!row) {
      row = { produce, entries: [], calendar: Array.from({ length: HALF_MONTHS }, () => null) };
      rows.set(produce.id, row);
    }
    row.entries.push({ produce, kind: window.kind, window, source });

    for (let h = 0; h < HALF_MONTHS; h += 1) {
      if (!covers(h, window.start, window.end)) continue;
      if (row.calendar[h] === 'open-field') continue;
      row.calendar[h] = window.kind;
    }
  }

  return [...rows.values()];
}

/**
 * The distinct documents behind a row, and the distinct kinds of window in it.
 *
 * A designation can carry more than one window out of *one* document, and the
 * common case is a crop with an early and a late type: Finocchio di Isola Capo
 * Rizzuto has a `precoce` picked from October and a `tardiva` picked from
 * March, both stated in the same richiesta di riconoscimento. Two windows, one
 * source, one kind.
 *
 * The row needs both facts kept and both displays collapsed. The windows stay
 * separate because they describe different parts of the year and the calendar
 * has to draw both; the citation and the kind label are one each, because a
 * reader shown the same document twice reasonably concludes there are two.
 * That is a rendering concern, so it is a reading of the row rather than
 * something `seasonYear` flattens before anyone sees it.
 */
export function sourcesOf(row: SeasonRow): readonly Source[] {
  const seen = new Map<SourceId, Source>();
  for (const entry of row.entries) if (!seen.has(entry.source.id)) seen.set(entry.source.id, entry.source);
  return [...seen.values()];
}

export function kindsOf(row: SeasonRow): readonly WindowKind[] {
  return [...new Set(row.entries.map((entry) => entry.kind))];
}

/** Every province any window in the catalogue answers for. */
export function answeredProvinces(data: Dataset): ReadonlySet<ProvinceId> {
  const seen = new Set<ProvinceId>();
  for (const w of data.windows) for (const p of w.provinces) seen.add(p);
  return seen;
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
