import { useEffect, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { dataset } from '../../content/seasonable/index';
import { site } from '../../content/site';
import type { HalfMonth, Phase, SeasonPhase, SeasonRow, WindowKind } from '../../lib/seasonable';
import {
  HALF_MONTHS,
  currentHalfMonth,
  produceName,
  answeredProvinces,
  kindsOf,
  phaseAt,
  phaseRank,
  produceKind,
  regionName,
  seasonYear,
  sourcesOf,
  splitHalfMonth,
} from '../../lib/seasonable';
import { useMetaDescription } from '../../lib/meta';
import { navigate } from '../../lib/route';
import { useTheme } from '../../lib/theme-context';
import { Eyebrow } from '../ui/Eyebrow';
import { LanguageSwitch } from '../ui/LanguageSwitch';
import { Monogram } from '../ui/Monogram';
import { SkipLink } from '../ui/SkipLink';
import { Tile } from '../ui/Tile';
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  LeafIcon,
  MoonIcon,
  NoteIcon,
  PinIcon,
  SunIcon,
  ThermometerIcon,
} from '../ui/icons';
import { IconButton, ThemeSwitch } from '../SiteHeader';
import { SiteFooter } from '../SiteFooter';
import { cx } from '../ui/cx';
import { ProduceGlyph } from './produceGlyphs';

/**
 * Seasonable — `/seasonable`. Left `ProjectPage` the way `/dj-tools` did, and
 * for the same reason: the thing it described stopped being an idea with a
 * name. `ProjectPage` had one member left after this and is gone.
 *
 * It keeps that shell's chrome *contract* rather than its component
 * (direction.md §8): breadcrumb header, exactly one full-bleed world block, the
 * 3px seam with the tile straddling it, section numerals in `--accent` rather
 * than the world, 62ch prose, the site footer. The world stops at the seam.
 *
 * What it adds below the seam is the answer, and that is the one place this
 * page reaches for `--project-food-*` on canvas. §3.3 forbids the *chrome*
 * wearing the world down there; Crate already carved out the other case for
 * data marks (theme.css:334), and this follows it rather than inventing a
 * second mechanism.
 */
export function SeasonablePage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage === 'it' ? 'it' : 'en';

  useMetaDescription(t('seasonable.metaDescription'));

  const [province, setProvince] = useState<string | null>(() => readProvince());
  const [half, setHalf] = useState<HalfMonth>(() => readHalf());

  // The picked pair lives in the URL so an answer can be sent to someone.
  // `replaceState` rather than `pushState`: changing a picker is not a
  // navigation, and filling the back button with fortnights would make the
  // browser's own back gesture useless on the one page most likely to be read
  // with a thumb.
  useEffect(() => {
    const params = new URLSearchParams();
    if (province) params.set('p', province);
    params.set('h', String(half));
    const next = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', next);
  }, [province, half]);

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <SkipLink />
      <PageHeader />
      <main id="main">
        <Band />

        <Clock
          province={province}
          half={half}
          locale={locale}
          onProvince={setProvince}
          onHalf={setHalf}
        />

        <Sections />

        <div className="bg-canvas px-5 pb-12 md:px-13 md:pb-16">
          <div className="max-w-[62ch]">
            <Ask province={province} half={half} locale={locale} />
            <BackLink />
          </div>
        </div>

        <SiteFooter />
      </main>
    </div>
  );
}

/* ── URL state ─────────────────────────────────────────────────────────────
   A shared link whose province code no longer resolves must land on the
   resting state, not on an error. Both readers fall back rather than throw,
   which is why neither validates beyond "does this id exist". */

function readProvince(): string | null {
  const raw = new URLSearchParams(window.location.search).get('p');
  return raw && dataset.provinces.some((p) => p.id === raw) ? raw : null;
}

function readHalf(): HalfMonth {
  // `Number(null)` is 0, so a missing `h` used to resolve to 1-15 January
  // rather than to today — on the one page whose copy promises the opposite.
  const raw = new URLSearchParams(window.location.search).get('h');
  const half = Number(raw);
  return raw && Number.isInteger(half) && half >= 0 && half <= 23 ? half : currentHalfMonth();
}

/**
 * `ProjectPage`'s `ProjectHeader` and `DjToolsPage`'s in the same shape, so all
 * three project pages share one breadcrumb. Reuses `SiteHeader`'s own
 * `ThemeSwitch` / `IconButton` rather than a fourth copy of the same pill.
 */
function PageHeader() {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <header className="sticky top-0 z-10 border-b border-header-line bg-header-bg backdrop-blur-[8px]">
      <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-13 md:py-[18px]">
        <a
          href="/"
          onClick={navigate}
          className="flex min-w-0 items-center gap-3.5 text-header-ink no-underline"
        >
          <Monogram size={38} className="shrink-0 md:size-[42px]" />
          <span className="min-w-0 truncate font-mono text-label-wide uppercase tracking-[0.14em] text-header-nav">
            Walter <span aria-hidden="true">/</span> {t('seasonable.title')}
          </span>
        </a>

        <div className="hidden shrink-0 items-center gap-[22px] md:flex">
          <LanguageSwitch
            className="font-mono text-nav font-medium"
            activeClassName="text-header-ink"
            idleClassName="text-header-nav hover:text-header-ink"
          />
          <ThemeSwitch
            onClick={toggle}
            next={nextTheme}
            label={t(`common.themeTo${nextTheme === 'dark' ? 'Dark' : 'Light'}`)}
          />
        </div>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <LanguageSwitch
            className="font-mono text-nav font-medium"
            activeClassName="text-header-ink"
            idleClassName="text-header-nav"
          />
          <IconButton
            onClick={toggle}
            label={t(nextTheme === 'dark' ? 'common.switchToDark' : 'common.switchToLight')}
            glyph={theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          />
        </div>
      </div>
    </header>
  );
}

/**
 * The one full-bleed world block, and nothing else in it.
 *
 * It carries the eyebrow, the name and the deck — the argument, for a reader
 * who has never seen this page. The tool used to be in here too, which made
 * the band do two jobs and made the fields inherit a ground they had to fight:
 * a `<select>` on a coloured slab has to re-state its own border, its own
 * focus ring and its own text colour, and every one of those was a token that
 * existed only because the field was in the wrong place.
 */
function Band() {
  const { t } = useTranslation();

  return (
    <>
      <div className="border-t border-project-food-border bg-project-food px-5 pt-12 pb-12 text-project-food-fg md:px-10 md:pt-16 md:pb-14">
        <Eyebrow className="mb-3 tracking-[0.16em] text-project-food-accent md:tracking-[0.18em]">
          {t('seasonable.eyebrow')}
        </Eyebrow>
        <h1 className="mb-[18px] font-display text-hero-sm text-balance text-project-food-fg md:mb-5 md:text-hero">
          {t('seasonable.title')}
        </h1>
        <p className="max-w-[52ch] text-lead text-project-food-body text-pretty">
          <span className="lg:hidden">{t('seasonable.deckShort')}</span>
          <span className="hidden lg:inline">{t('seasonable.deck')}</span>
        </p>
      </div>
      <div className="relative">
        <span aria-hidden="true" className="block h-[3px] bg-project-food-seam" />
        {/* The site's clover stamp, not the world's green — the same sticker
            sits on all three shelf cards over three different grounds, and
            that is what ties the worlds together. It stays the site's clover
            now that the world is green too, which is the one case where
            holding the rule costs something: stamp and ground are neighbours
            in hue rather than opposites. The tile's own ring is what keeps
            them apart. */}
        <Tile icon={LeafIcon} className="absolute top-1/2 left-5 -translate-y-1/2 md:left-10" />
      </div>
    </>
  );
}

type Category = 'all' | 'fruit' | 'vegetable';

type ClockProps = {
  province: string | null;
  half: HalfMonth;
  locale: 'en' | 'it';
  onProvince: (id: string | null) => void;
  onHalf: (half: HalfMonth) => void;
};

type Listed = { row: SeasonRow; phase: Phase };

/**
 * The tool: a year drawn as a clock, and the list it fills in.
 *
 * This replaced a twelve-column table of every designation's whole year. The
 * table was honest and it was slow to read, because it answered a question the
 * reader had not asked yet — the shape of fifty-eight windows — before it
 * answered the one they arrived with, which is what to buy this week. The ring
 * inverts that. Its twenty-four arcs are the fortnights of the year tinted by
 * how much is in season in each, so the answer to "when should I come back" is
 * a shape rather than a sentence, and the hand says where in it you are
 * standing. The list beside it is the fortnight the hand points at.
 *
 * The table's own argument survives, one row at a time: opening a row draws
 * *its* window on the ring, prints its year as a strip with the months under
 * it, and cites the document every date came from. Nothing on this page states
 * a date it cannot source; that constraint moved, it did not lift.
 */
function Clock({ province, half, locale, onProvince, onHalf }: ClockProps) {
  const { t } = useTranslation();
  const [category, setCategory] = useState<Category>('all');
  const [open, setOpen] = useState<string | null>(null);

  const here = province ? dataset.provinces.find((p) => p.id === province) : undefined;
  const rows = useMemo(() => (province ? seasonYear(dataset, province) : []), [province]);

  const months = useMemo(() => {
    const long = new Intl.DateTimeFormat(locale, { month: 'long' });
    const short = new Intl.DateTimeFormat(locale, { month: 'short' });
    return Array.from({ length: 12 }, (_, m) => ({
      long: long.format(new Date(2026, m, 1)),
      // `short` carries a trailing dot in Italian ("gen."), which reads as
      // noise on a dial where the label has no room for it.
      short: short.format(new Date(2026, m, 1)).replace(/\.$/, ''),
    }));
  }, [locale]);

  const shown = useMemo(
    () => rows.filter((row) => category === 'all' || row.produce.category === category),
    [rows, category],
  );

  /** How many of the listed designations each fortnight of the year answers. */
  const counts = useMemo(
    () =>
      Array.from({ length: HALF_MONTHS }, (_, h) =>
        shown.reduce((n, row) => n + (row.calendar[h] === null ? 0 : 1), 0),
      ),
    [shown],
  );

  const listed = useMemo<Listed[]>(() => {
    const collator = new Intl.Collator(locale);
    return shown
      .map((row) => ({ row, phase: phaseAt(row.calendar, half) }))
      .sort(
        (a, b) =>
          phaseRank(a.phase.phase) - phaseRank(b.phase.phase) ||
          collator.compare(a.row.produce[locale], b.row.produce[locale]) ||
          collator.compare(a.row.produce.name, b.row.produce.name),
      );
  }, [shown, half, locale]);

  const inSeason = listed.filter((item) => phaseRank(item.phase.phase) <= 2).length;
  const openRow = listed.find((item) => item.row.produce.id === open);

  return (
    // pt-10 clears the tile straddling the seam above, whose lower half
    // overhangs 24px. Anything tighter and the sticker lands on the card.
    <div className="bg-canvas px-5 pt-10 pb-4 md:px-13 md:pt-12 md:pb-6">
      <section className="rounded-card border border-line-card bg-surface px-4 py-5 md:px-7 md:py-7">
        <h2 className="sr-only">{t('seasonable.dial.heading')}</h2>

        <PlacePicker province={province} locale={locale} onProvince={onProvince} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr] lg:items-start lg:gap-8">
          <Dial
            counts={counts}
            half={half}
            months={months}
            onHalf={onHalf}
            openCalendar={openRow?.row.calendar}
            hasPlace={Boolean(here)}
            inSeason={inSeason}
            subtitle={
              openRow
                ? produceKind(openRow.row.produce, locale)
                : here
                  ? t('seasonable.dial.inSeasonHere')
                  : t('seasonable.dial.pickPlace')
            }
          />

          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {(['all', 'fruit', 'vegetable'] as const).map((value) => (
                <FilterChip
                  key={value}
                  tone="food"
                  active={category === value}
                  onClick={() => setCategory(value)}
                >
                  {t(`seasonable.filter.${value}`)}
                </FilterChip>
              ))}
              <span className="flex-1" />
              <button
                type="button"
                onClick={() => {
                  onHalf(currentHalfMonth());
                  setOpen(null);
                }}
                className="rounded-pill px-2 py-1 font-mono text-micro text-accent underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t('seasonable.dial.today')}
              </button>
            </div>

            <div role="status" aria-live="polite" className="min-w-0">
              {!here ? (
                <p className="max-w-[62ch] py-6 text-note text-ink-body text-pretty">
                  {t('seasonable.states.noPlace')}
                </p>
              ) : listed.length === 0 ? (
                <p className="max-w-[62ch] py-6 text-note text-ink-body text-pretty">
                  {rows.length === 0
                    ? t('seasonable.states.nothing', { place: here.name })
                    : t('seasonable.states.nothingOfKind')}
                </p>
              ) : (
                <ul className="flex list-none flex-col gap-1.5 lg:max-h-[32rem] lg:overflow-y-auto lg:pr-1">
                  {listed.map((item) => (
                    <Row
                      key={item.row.produce.id}
                      item={item}
                      half={half}
                      locale={locale}
                      months={months}
                      place={here.name}
                      open={open === item.row.produce.id}
                      onToggle={() =>
                        setOpen((was) => (was === item.row.produce.id ? null : item.row.produce.id))
                      }
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <HeatLegend place={here?.name} />
      </section>
    </div>
  );
}

/**
 * Zone, then region, then province — the reader's own way down to the answer,
 * which the flat list of 107 was not.
 *
 * The zone chips and the region field only ever *move* the province: they pick
 * the first one under them that a document actually names. A picker that left
 * the answer empty until all three had been set would make the two coarse
 * controls a toll rather than a shortcut, and the coarse controls are the ones
 * a reader who does not know their own province code can use.
 */
function PlacePicker({
  province,
  locale,
  onProvince,
}: {
  province: string | null;
  locale: 'en' | 'it';
  onProvince: (id: string | null) => void;
}) {
  const { t } = useTranslation();

  const answered = useMemo(() => answeredProvinces(dataset), []);
  const here = province ? dataset.provinces.find((p) => p.id === province) : undefined;
  const region = here ? dataset.regions.find((r) => r.id === here.region) : undefined;

  const collator = useMemo(() => new Intl.Collator(locale), [locale]);

  /** The one a document names, falling back to the first of them. */
  const firstIn = (test: (regionId: string) => boolean): string | undefined => {
    const within = dataset.provinces.filter((p) => test(p.region));
    return (within.find((p) => answered.has(p.id)) ?? within[0])?.id;
  };

  const zoneRegions = useMemo(
    () =>
      dataset.zones.map((zone) => ({
        zone,
        regions: dataset.regions
          .filter((r) => r.zone === zone.id)
          .sort((a, b) => collator.compare(regionName(a, locale), regionName(b, locale))),
      })),
    [collator, locale],
  );

  const [answering, silent] = useMemo(() => {
    const within = dataset.provinces
      .filter((p) => !region || p.region === region.id)
      .sort((a, b) => collator.compare(a.name, b.name));
    return [within.filter((p) => answered.has(p.id)), within.filter((p) => !answered.has(p.id))];
  }, [answered, collator, region]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-label-wide uppercase text-ink-muted">
          {t('seasonable.picker.placeLabel')}
        </span>
        {dataset.zones.map((zone) => (
          <FilterChip
            key={zone.id}
            active={region?.zone === zone.id}
            onClick={() => onProvince(firstIn((id) => zoneOf(id) === zone.id) ?? null)}
          >
            {t(`seasonable.zone.${zone.id}`)}
          </FilterChip>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:max-w-[38rem]">
        <div>
          <label htmlFor="seasonable-region" className="sr-only">
            {t('seasonable.picker.regionLabel')}
          </label>
          <select
            id="seasonable-region"
            className={FIELD_CLASS}
            value={region?.id ?? ''}
            onChange={(event) =>
              onProvince(event.target.value ? (firstIn((id) => id === event.target.value) ?? null) : null)
            }
          >
            <option value="">{t('seasonable.picker.regionPlaceholder')}</option>
            {zoneRegions.map(({ zone, regions }) => (
              <optgroup key={zone.id} label={t(`seasonable.zone.${zone.id}`)}>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {regionName(r, locale)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="seasonable-place" className="sr-only">
            {t('seasonable.picker.provinceLabel')}
          </label>
          <select
            id="seasonable-place"
            className={FIELD_CLASS}
            value={province ?? ''}
            onChange={(event) => onProvince(event.target.value || null)}
          >
            <option value="">{t('seasonable.picker.placePlaceholder')}</option>
            <optgroup label={t('seasonable.picker.groupAnswering')}>
              {answering.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </optgroup>
            <optgroup label={t('seasonable.picker.groupSilent')}>
              {silent.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>
    </div>
  );
}

function zoneOf(regionId: string): string | undefined {
  return dataset.regions.find((r) => r.id === regionId)?.zone;
}

/**
 * The field sits on `--canvas` inside a `--surface` card rather than on the
 * card itself, and that is a measurement rather than a preference: the border
 * has to clear SC 1.4.11's 3:1, and `--project-food-mark-quiet` reads 2.99:1
 * on the dark surface against 3.31:1 on the dark canvas. One hundredth, and
 * the fix is free — a cream well inset in a white card is what an input is
 * supposed to look like anyway.
 */
const FIELD_CLASS =
  'w-full appearance-none rounded-field border border-project-food-mark-quiet bg-canvas px-3.5 py-2.5 font-mono text-note-sm text-ink-strong ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

function FilterChip({
  active,
  tone = 'accent',
  children,
  onClick,
}: {
  active: boolean;
  tone?: 'accent' | 'food';
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        'rounded-pill border px-3.5 py-1.5 font-mono text-micro font-medium transition-colors duration-150',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        active && tone === 'accent' && 'border-accent bg-accent text-accent-fg',
        active && tone === 'food' && 'border-project-food-seam bg-project-food-seam text-canvas',
        !active && 'border-line-card text-ink-muted hover:border-accent hover:text-accent',
      )}
    >
      {children}
    </button>
  );
}

/* ── The dial ──────────────────────────────────────────────────────────────
   Drawn at a 300-unit viewBox and scaled by the box it lands in, so the ring
   is one set of numbers at every width. Centre (150,150), ring radius 104,
   stroke 26 — the arcs are the ring, not shapes inside it, which is what lets
   one `stroke-dasharray` per fortnight replace twenty-four wedge paths. */

const RING_RADIUS = 104;
const RING_STROKE = 26;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const ARC = CIRCUMFERENCE / HALF_MONTHS;

/** Zero is the empty track itself, so nothing here reads as absence. */
const HEAT = [
  'var(--canvas-band)',
  'var(--project-food-heat-1)',
  'var(--project-food-heat-2)',
  'var(--project-food-heat-3)',
  'var(--project-food-heat-4)',
] as const;

/**
 * One rung per designation, saturating at four — an absolute scale, not the
 * fortnight's share of the busiest one.
 *
 * Normalising was the obvious thing and it is wrong here twice over. The
 * densest province in the catalogue answers five designations, so four rungs
 * spread over that range spend three of them on the difference between one and
 * three; and a ring whose darkest step means "five" in Salerno and "two" in
 * Trento cannot be compared with the next province the reader tries, which is
 * the comparison the whole page is for.
 */
function heatOf(count: number): string {
  return HEAT[Math.min(4, count)];
}

/** Where the middle of half-month `h` sits on the ring, in radians from 12. */
function angleOf(h: number): number {
  return ((h + 0.5) / HALF_MONTHS) * 2 * Math.PI - Math.PI / 2;
}

type DialProps = {
  counts: readonly number[];
  half: HalfMonth;
  months: readonly { long: string; short: string }[];
  onHalf: (half: HalfMonth) => void;
  openCalendar?: readonly (WindowKind | null)[];
  hasPlace: boolean;
  inSeason: number;
  subtitle: string;
};

function Dial({
  counts,
  half,
  months,
  onHalf,
  openCalendar,
  hasPlace,
  inSeason,
  subtitle,
}: DialProps) {
  const { t } = useTranslation();
  const { month: nowMonth } = splitHalfMonth(half);
  const hand = angleOf(half);

  // Arrow keys step the fortnight and wrap, which is the one behaviour a
  // `role="slider"` does not get for free and the one the ring implies: there
  // is no first or last fortnight on a circle.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[event.key];
    if (step !== undefined) {
      event.preventDefault();
      onHalf((half + step + HALF_MONTHS) % HALF_MONTHS);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      onHalf(currentHalfMonth());
    }
  };

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={t('seasonable.dial.label')}
      aria-valuemin={0}
      aria-valuemax={HALF_MONTHS - 1}
      aria-valuenow={half}
      aria-valuetext={halfLabel(t, half, months)}
      onKeyDown={onKeyDown}
      className="relative mx-auto grid w-full max-w-[340px] place-items-center rounded-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <svg viewBox="0 0 300 300" className="w-full" aria-hidden="true">
        <circle
          cx={150}
          cy={150}
          r={RING_RADIUS}
          fill="none"
          stroke="var(--canvas-band)"
          strokeWidth={RING_STROKE}
        />
        {counts.map((count, h) => (
          <circle
            key={h}
            cx={150}
            cy={150}
            r={RING_RADIUS}
            fill="none"
            stroke={
              openCalendar
                ? openCalendar[h] === null
                  ? 'var(--canvas-band)'
                  : 'var(--project-food-mark)'
                : hasPlace
                  ? heatOf(count)
                  : 'var(--canvas-band)'
            }
            strokeWidth={RING_STROKE}
            strokeDasharray={`${ARC - 1.6} ${CIRCUMFERENCE - ARC + 1.6}`}
            strokeDashoffset={-h * ARC}
            transform="rotate(-90 150 150)"
            className="cursor-pointer"
            onClick={() => onHalf(h)}
          />
        ))}

        {months.map((month, m) => {
          const a = angleOf(m * 2 + 0.5);
          return (
            <text
              key={month.short}
              x={150 + Math.cos(a) * 133}
              y={150 + Math.sin(a) * 133 + 4}
              textAnchor="middle"
              fontSize={12}
              fill={m === nowMonth ? 'var(--ink-strong)' : 'var(--ink-muted)'}
              fontWeight={m === nowMonth ? 700 : 500}
              className="font-mono"
            >
              {month.short}
            </text>
          );
        })}

        <line
          x1={150}
          y1={150}
          x2={150 + Math.cos(hand) * 122}
          y2={150 + Math.sin(hand) * 122}
          stroke="var(--accent)"
          strokeWidth={2.75}
          strokeLinecap="round"
        />
        <circle
          cx={150 + Math.cos(hand) * 122}
          cy={150 + Math.sin(hand) * 122}
          r={6.5}
          fill="var(--accent)"
        />
        <circle cx={150} cy={150} r={74} fill="var(--surface)" />
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 px-14 text-center">
        <span className="font-mono text-micro uppercase tracking-[0.1em] text-ink-muted">
          {halfLabel(t, half, months)}
        </span>
        <span className="font-display text-title text-ink-strong leading-none">
          {hasPlace ? inSeason : '—'}
        </span>
        <span className="text-micro text-ink-body text-pretty">{subtitle}</span>
      </div>
    </div>
  );
}

/** "1–15 September". The picker's own two keys, so the axis and the hub agree. */
function halfLabel(
  t: (key: string, opts?: Record<string, unknown>) => string,
  half: HalfMonth,
  months: readonly { long: string }[],
): string {
  const { month, late } = splitHalfMonth(half);
  return t(late ? 'seasonable.picker.halfLate' : 'seasonable.picker.halfEarly', {
    month: months[month].long,
  });
}

/**
 * "mid-March", "late May" — one endpoint of a window, named the way a person
 * says it. A start lands on the beginning or the middle of its month, an end
 * on the middle or the end of it, because the half-month either opens or
 * closes depending on which side of the window it is.
 */
function edgeLabel(
  t: (key: string, opts?: Record<string, unknown>) => string,
  half: HalfMonth,
  edge: 'start' | 'end',
  months: readonly { long: string }[],
): string {
  const { month, late } = splitHalfMonth(half);
  const key = late
    ? `seasonable.when.${edge}Late`
    : `seasonable.when.${edge}Early`;
  return t(key, { month: months[month].long });
}

const KIND_KEY: Record<WindowKind, string> = {
  'open-field': 'seasonable.kind.openField',
  greenhouse: 'seasonable.kind.greenhouse',
  stored: 'seasonable.kind.stored',
};

/**
 * Three weights across five phases, and the split is the reader's decision
 * rather than the model's five-way distinction: solid rust is buy it now,
 * outlined is nearly or not quite any more, quiet is no. Which of the five it
 * is, the word says.
 */
const PHASE_CLASS: Record<SeasonPhase, string> = {
  peak: 'border-accent bg-accent text-accent-fg',
  starting: 'border-project-food-seam text-project-food-seam',
  ending: 'border-accent text-accent',
  coming: 'border-line-strong text-ink-muted',
  out: 'border-transparent bg-canvas-band text-ink-muted',
};

type RowProps = {
  item: Listed;
  half: HalfMonth;
  locale: 'en' | 'it';
  months: readonly { long: string; short: string }[];
  place: string;
  open: boolean;
  onToggle: () => void;
};

function Row({ item, half, locale, months, place, open, onToggle }: RowProps) {
  const { t } = useTranslation();
  const { row, phase } = item;
  const panelId = `seasonable-row-${row.produce.id}`;
  const quiet = phaseRank(phase.phase) > 3;
  // A row is generalised when nothing in it was quoted from a document naming
  // this province. The two bases never mix on one row — seasonYear drops the
  // generalised window wherever a documented one exists — so `every` is exact.
  const generalised = row.entries.every((e) => e.window.basis === 'generalised');

  const note =
    phase.phase === 'coming'
      ? t('seasonable.phase.comingNote', { weeks: (phase.away ?? 0) * 2 })
      : phase.phase === 'out'
        ? phase.starts === undefined
          ? ''
          : t('seasonable.phase.outNote', { from: edgeLabel(t, phase.starts, 'start', months) })
        : phase.ends === undefined
          ? t('seasonable.phase.allYear')
          : t(`seasonable.phase.${phase.phase}Note`, {
              until: edgeLabel(t, phase.ends, 'end', months),
            });

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={cx(
          'flex w-full flex-wrap items-center gap-x-3 gap-y-2 rounded-field border px-3 py-2.5 text-left transition-colors duration-150',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          open ? 'border-accent bg-canvas-band' : 'border-line-card bg-canvas hover:bg-canvas-band',
        )}
      >
        <span
          className={cx(
            'grid size-10 shrink-0 place-items-center rounded-pill bg-surface',
            quiet ? 'text-ink-muted' : 'text-project-food-mark',
          )}
        >
          <ProduceGlyph kind={row.produce.en} size={24} />
        </span>

        <span className="flex min-w-0 flex-[1_1_12rem] flex-col gap-0.5">
          <span
            className={cx('text-body-sm leading-snug text-pretty', quiet ? 'text-ink-body' : 'text-ink-strong')}
          >
            {produceName(row.produce)}
          </span>
          <span className="font-mono text-micro leading-tight text-ink-muted">{note}</span>
        </span>

        {/* Pill and chevron travel as one, so that on a phone — where the
            designation's own name needs the whole line — the pair wraps
            together and stays right-aligned instead of the chevron being
            orphaned on a line of its own. */}
        <span className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
          <span
            className={cx(
              'rounded-pill border px-2.5 py-1 font-mono text-micro font-medium',
              PHASE_CLASS[phase.phase],
            )}
          >
            {t(`seasonable.phase.${phase.phase}`)}
          </span>
          <ChevronDownIcon
            className={cx(
              'size-4 shrink-0 text-ink-muted transition-transform duration-150',
              open && 'rotate-180',
            )}
          />
        </span>
      </button>

      {open && (
        <div id={panelId} className="px-3 pt-3 pb-4">
          <p className="mb-2 font-mono text-micro text-ink-muted">
            {produceKind(row.produce, locale)}
            {' · '}
            {kindsOf(row)
              .map((kind) => t(KIND_KEY[kind]))
              .join(' · ')}
            {generalised && (
              <>
                {' · '}
                <span className="italic">{t('seasonable.row.generalised')}</span>
              </>
            )}
          </p>

          <YearStrip calendar={row.calendar} half={half} months={months} />

          <div className="mt-3 grid gap-1">
            {generalised && (
              <p className="max-w-[62ch] font-mono text-micro text-ink-body">
                {t('seasonable.row.generalisedLead', { place, count: sourcesOf(row).length })}
              </p>
            )}
            {sourcesOf(row).map((source) => (
              <p key={source.id} className="max-w-[62ch] font-mono text-micro text-ink-body">
                <a href={source.url} rel="noreferrer" className="text-accent underline underline-offset-2">
                  {source.name}
                </a>
                {', '}
                {source.year === undefined
                  ? t('seasonable.row.consulted', { date: source.accessed })
                  : `${source.year}.`}
                {!generalised && <> {t('seasonable.row.basisTail', { place })}</>}
              </p>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}

/**
 * One row's whole year, under a month axis — the table's lane, kept for the
 * row the reader opened.
 *
 * The ring says the same thing and says it faster, and it says it without an
 * axis: an arc two thirds of the way round is August or September and the
 * reader cannot tell which. That was the complaint the table was built to
 * answer and it has not stopped being true, so the strip is where a date gets
 * checked rather than glanced at.
 *
 * The three window kinds stay three geometries rather than three colours. SC
 * 1.4.1 forbids carrying meaning in hue alone, and every face on this site is
 * subset to Latin-1 plus a short extras list, so the geometric-shape glyphs
 * that would have been the easy answer render as fallback dots. Print this in
 * greyscale and it still parses.
 */
function YearStrip({
  calendar,
  half,
  months,
}: {
  calendar: readonly (WindowKind | null)[];
  half: HalfMonth;
  months: readonly { long: string; short: string }[];
}) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="relative flex h-5 overflow-hidden rounded-[3px] bg-canvas-band">
        {calendar.map((kind, h) => (
          <Half
            key={h}
            kind={kind}
            prev={h === 0 ? null : calendar[h - 1]}
            next={h === HALF_MONTHS - 1 ? null : calendar[h + 1]}
          />
        ))}
        {/* Scored in the page's own ground rather than a hairline: a month
            boundary has to survive being crossed by a bar darker than any rule
            would be, and a notch of canvas reads through where grey would
            disappear under it. */}
        {months.map((month, m) =>
          m === 0 ? null : (
            <span
              key={month.short}
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-px bg-canvas"
              style={{ left: `${(m / 12) * 100}%` }}
            />
          ),
        )}
        {/* The rust cursor is a knockout, not a shadow. It crosses the bar it
            is measuring, and rust on the mark green is 1.4:1 — over a long
            window it simply disappears, which is where a reader is most likely
            to be tracing it. */}
        {[half, half + 1].map((edge, i) => (
          <span
            key={edge}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-0.5 bg-accent shadow-[0_0_0_1px_var(--canvas)]"
            style={{
              left: `${(edge / HALF_MONTHS) * 100}%`,
              transform: i === 1 ? 'translateX(-100%)' : undefined,
            }}
          />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="mt-1 grid grid-cols-12 text-center font-mono text-micro text-ink-muted"
      >
        {months.map((month, m) => (
          <span key={month.short} className={m === splitHalfMonth(half).month ? 'text-accent' : ''}>
            {month.short}
          </span>
        ))}
      </div>
      <p className="sr-only">{t('seasonable.strip.legendNow')}</p>
    </div>
  );
}

/**
 * One fortnight of the lane: a mark if something is happening in it, the empty
 * track if not.
 *
 * `prev` and `next` are the fortnights either side. The corner rounds only
 * where the kind changes, so a six-month window is one capsule with two ends
 * rather than twelve ticks with twenty-four.
 */
function Half({
  kind,
  prev,
  next,
}: {
  kind: WindowKind | null;
  prev: WindowKind | null;
  next: WindowKind | null;
}) {
  return (
    <span className="relative flex h-full flex-1 items-center">
      {kind && (
        <span
          aria-hidden="true"
          className={cx(
            'block w-full',
            prev !== kind && 'rounded-l-[3px]',
            next !== kind && 'rounded-r-[3px]',
            kind === 'open-field' && 'h-full bg-project-food-mark',
            kind === 'greenhouse' && 'hatch-food-mark h-full',
            kind === 'stored' && 'h-2 bg-project-food-mark-quiet',
          )}
        />
      )}
    </span>
  );
}

/**
 * What the ring's colour means, drawn in the ring's own steps, plus the caveat
 * every date on the page is subject to.
 */
function HeatLegend({ place }: { place?: string }) {
  const { t } = useTranslation();

  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-line-card pt-4 md:flex-row md:items-center md:justify-between md:gap-8">
      <p className="flex items-center gap-2 font-mono text-micro text-ink-muted">
        <span>{t('seasonable.dial.heatLow')}</span>
        <span aria-hidden="true" className="flex items-center gap-1">
          <span className="h-2.5 w-5 rounded-pill bg-canvas-band" />
          <span className="h-2.5 w-5 rounded-pill bg-project-food-heat-1" />
          <span className="h-2.5 w-5 rounded-pill bg-project-food-heat-2" />
          <span className="h-2.5 w-5 rounded-pill bg-project-food-heat-3" />
          <span className="h-2.5 w-5 rounded-pill bg-project-food-heat-4" />
        </span>
        <span>{t('seasonable.dial.heatHigh')}</span>
      </p>
      {place && (
        <p className="max-w-[52ch] font-mono text-micro text-ink-muted text-pretty md:text-right">
          {t('seasonable.dial.caveat', { place })}
        </p>
      )}
    </div>
  );
}

/**
 * Three arguments, one card each — Crate's opening cards in the same shape,
 * down to the punched `Tile` and the `--accent` numeral over a hairline
 * (`DjToolsPage.tsx:231`). They were three stacked paragraphs in a 62ch
 * column, which on a desktop page put the entire case for the tool in the
 * left third and made the reader scroll past all of it.
 *
 * The tiles keep the site's clover rather than taking the world's green, the
 * same way Crate's do over navy. That rule is cheapest to follow where the
 * card is neutral, which is here: these sit on `--surface`, not on the band.
 *
 * The three glyphs are the three arguments and not decoration — a pin for the
 * province the answer is scoped to, a thermometer for the weather no
 * document knows about, a sheet for the disciplinare every date is quoted
 * from. Still below the answer rather than above it: this is a tool page with
 * prose, not a prose page with a tool in it.
 */
const SECTION_CARDS = [
  { key: 's1', icon: PinIcon },
  { key: 's2', icon: ThermometerIcon },
  { key: 's3', icon: NoteIcon },
] as const;

function Sections() {
  const { t } = useTranslation();

  return (
    <div className="bg-canvas px-5 pt-14 pb-12 md:px-13 md:pt-16 md:pb-16">
      <ul className="grid list-none gap-y-14 lg:grid-cols-3 lg:gap-x-8">
        {SECTION_CARDS.map((card, index) => (
          <li
            key={card.key}
            className="relative rounded-card border border-line-card bg-surface px-6 pt-11 pb-7 md:px-7 md:pt-12 md:pb-8"
          >
            <Tile icon={card.icon} className="absolute -top-6 left-6 md:left-7 lg:-top-7" />
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <span className="font-mono text-label text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
            </div>
            <h2 className="mb-3 font-display text-section-sm text-ink-strong text-balance md:mb-4">
              {t(`seasonable.${card.key}.heading`)}
            </h2>
            <p className="text-note text-ink-body text-pretty">
              {t(`seasonable.${card.key}.body`)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

type AskProps = { province: string | null; half: HalfMonth; locale: 'en' | 'it' };

/**
 * The page's one call to action, and the first thing on this site to ask a
 * reader for anything since site.md ruled that a page about software which does
 * not exist does not get to ask for an address. That premise expired when this
 * shipped: a correction from someone who actually farms in Puglia is the
 * highest-value input a hand-curated dataset can get.
 *
 * Still `mailto:`. There is no form backend and none is being added.
 */
function Ask({ province, half, locale }: AskProps) {
  const { t } = useTranslation();

  const here = province ? dataset.provinces.find((p) => p.id === province) : undefined;
  const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(
    new Date(2026, splitHalfMonth(half).month, 1),
  );
  const when = t(
    splitHalfMonth(half).late ? 'seasonable.picker.halfLate' : 'seasonable.picker.halfEarly',
    { month },
  );
  const subject = t('seasonable.s3.askSubject', {
    place: here ? here.name : '',
    half: when,
  });

  return (
    <div className="mb-10 md:mb-12">
      <p className="mb-5 text-note text-ink-body text-pretty md:text-body">
        {t('seasonable.s3.ask')}
      </p>
      <a
        href={`mailto:${site.email}?subject=${encodeURIComponent(subject)}`}
        className="inline-block rounded-[3px] bg-accent px-[22px] py-3 font-mono text-meta text-accent-fg no-underline transition-colors duration-150 hover:bg-accent-hover hover:text-accent-hover-fg"
      >
        {t('seasonable.s3.askLink')}
      </a>
    </div>
  );
}

function BackLink() {
  const { t } = useTranslation();
  return (
    <a
      href="/#projects"
      className="inline-flex items-center gap-1.5 font-mono text-meta text-ink-muted no-underline transition-colors duration-150 hover:text-accent"
    >
      <ArrowLeftIcon className="size-[1em] shrink-0" />
      {t('projects.backLabel')}
    </a>
  );
}
