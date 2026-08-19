/**
 * Structure and figure data for `/dj-tools` — Crate. Prose lives in
 * src/locales/{en,it}.json under `dj.*`; everything here is order, ids and
 * numbers, which read the same in both languages.
 *
 * Below the seam the six capabilities sit two to a row from `lg`. Every one
 * carries a figure: the rack version left two of them silent, which worked
 * when each was a full-width row and stopped working once they became cells in
 * a grid, where an empty half reads as missing rather than as restraint. The
 * two that gained one — `read` and `handoff` — get *mechanism* diagrams rather
 * than invented data, which is the honest way to draw a claim about behaviour.
 *
 * Every number below draws a sentence the copy already wrote. Nothing here is
 * a measurement of software that does not exist: the histogram's shape is the
 * pile at 122 and the hole at 128 that `dj.does.overview.body` states in
 * words, and the pitch ladder grows by proportion rather than by a count,
 * because the copy says "it lights more" and never says how many.
 */

/** Order is page order. `well` names the figure, or null for a silent row. */
export type CapabilityId = 'read' | 'filters' | 'harmonic' | 'health' | 'overview' | 'handoff';
export type WellFigure = 'oneway' | 'stack' | 'wheel' | 'severity' | 'histogram' | 'handback';

export type Capability = {
  id: CapabilityId;
  well: WellFigure | null;
  /** Only `read` carries the honest wart, and only in that row. */
  caveat?: boolean;
  /** Which `dj.figures.*` key captions the well, where one was written. */
  caption?: 'stack' | 'bpm' | 'wheel';
};

export const capabilities: readonly Capability[] = [
  { id: 'read', well: 'oneway', caveat: true },
  { id: 'filters', well: 'stack', caption: 'stack' },
  { id: 'harmonic', well: 'wheel', caption: 'wheel' },
  { id: 'health', well: 'severity' },
  { id: 'overview', well: 'histogram', caption: 'bpm' },
  { id: 'handoff', well: 'handback' },
];

/**
 * The six conditions `dj.does.filters.body` lists, in the order it lists them.
 * Operator syntax, not prose — a BPM range and a Camelot code read the same in
 * Italian, the way `magic.legendSyntax` does. The last one is lit because it is
 * the one the copy stops to explain.
 */
export const filterChips = [
  '122–126 BPM',
  '8A',
  // Not "★★★★+": U+2605 is outside the latin subset of the self-hosted IBM Plex
  // Mono, so it falls back to a system face and renders as dots. Every glyph in
  // this list has to live in the subset the site actually ships.
  'rating 4+',
  'house',
  '2026',
  'never played',
] as const;

/** Index into `filterChips` — the condition the copy calls out by name. */
export const litFilterChip = 5;

/**
 * The pitch ladder. Proportions, deliberately, not counts: the copy says the
 * wheel "lights more" at ±3% and again at ±6% without ever saying how many,
 * and a countable tick row would be inventing a number the page refuses to
 * claim. A growing bar says exactly what the sentence says.
 */
export const pitchLadder = [
  { label: '±0', lit: 0.25 },
  { label: '±3%', lit: 0.5 },
  { label: '±6%', lit: 0.75 },
] as const;

/**
 * `dj.does.health.body` ends on "ordered by how much each one costs you in a
 * booth, not by how many there are" — so the well draws the ordering, not the
 * items. Eight unlabelled bars, descending. The items themselves stay in the
 * prose, where they were written; drawing them again would be the same copy
 * twice.
 */
export const severityBars = [100, 82, 71, 58, 47, 36, 26, 15] as const;

/**
 * The BPM histogram, in 2-BPM buckets. `lit` marks the two buckets the copy
 * names: the pile at 122 and the hole at 128. Heights are the shape of that
 * sentence — a collection with a house pile and a gap before the faster end —
 * and are not a reading taken from anyone's library.
 */
export const bpmHistogram = [
  { bpm: 112, h: 4 },
  { bpm: 114, h: 6 },
  { bpm: 116, h: 9 },
  { bpm: 118, h: 14 },
  { bpm: 120, h: 30 },
  { bpm: 122, h: 96, lit: true },
  { bpm: 124, h: 74 },
  { bpm: 126, h: 58 },
  { bpm: 128, h: 9, lit: true },
  { bpm: 130, h: 34 },
  { bpm: 132, h: 40 },
  { bpm: 134, h: 22 },
  { bpm: 136, h: 12 },
  { bpm: 138, h: 7 },
  { bpm: 140, h: 4 },
  { bpm: 142, h: 3 },
] as const;

/**
 * The hero wave — the BPM distribution above, interpolated to 48 columns and
 * mirrored around a centre line so it reads as a set rather than as a chart.
 *
 * It is deliberately **not** an audio waveform, however much it looks like
 * one: the page states flatly that it does not analyse your audio, and a real
 * waveform would contradict its own argument two screens later. These are
 * track counts per tempo — data Rekordbox already holds — with the same pile
 * at 122 and hole at 128 that `dj.does.overview.body` describes in words.
 */
export const heroWave = [
  4, 4, 5, 6, 7, 9, 11, 14, 18, 24, 32,
  42, 54, 68, 82, 92,
  96,
  94, 88, 80, 74,
  70, 62, 48, 30,
  9,
  12, 22,
  34, 40, 39, 35,
  30, 25, 22, 18,
  15, 12, 10, 8, 7,
  6, 5, 5, 4, 4, 3, 3,
] as const;

/** Columns at or above this height are the pile, and take the amber rung. */
export const heroWaveLitFrom = 55;

/** Where the two labelled tempi fall along the 48 columns. */
export const heroWaveTicks = [
  { label: '122', at: 16 },
  { label: '128', at: 25 },
] as const;

/**
 * The page's opening: three cards in a row carrying the whole argument before
 * the capability grid — the problem, the mechanism, and the honest status.
 *
 * `status` moves up here from its old position beside the CTA. It loses
 * nothing by it: the signup's own body ("no list and no launch") is what now
 * carries the honest beat immediately before the ask, and three identical
 * cards give the admission no more weight than the other two, which is the
 * treatment it has always needed.
 */
export const openingCards = [
  { id: 'problem', icon: 'shelf' },
  { id: 'mechanism', icon: 'wave' },
  { id: 'status', icon: 'note' },
] as const;

export type OpeningCardId = (typeof openingCards)[number]['id'];
