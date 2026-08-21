import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dataset } from '../../content/seasonable/index';
import { site } from '../../content/site';
import type { Entry, HalfMonth, Produce, WindowKind } from '../../lib/seasonable';
import {
  currentHalfMonth,
  covers,
  produceName,
  answeredProvinces,
  produceKind,
  splitHalfMonth,
  whatsInSeason,
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
 *
 * The band used to hold the two pickers. It doesn't: the tool has its own
 * container on canvas now, directly under the seam and directly above the
 * answer it produces. Input and output are one object read top to bottom, and
 * the band is left doing the single job a band is good at — saying what this
 * is to someone who has never seen it. The page still has one CTA, the
 * `mailto:` at the foot.
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

        <Console
          province={province}
          half={half}
          locale={locale}
          onProvince={setProvince}
          onHalf={setHalf}
        />

        <Answer province={province} half={half} locale={locale} />

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
  const raw = Number(new URLSearchParams(window.location.search).get('h'));
  return Number.isInteger(raw) && raw >= 0 && raw <= 23 ? raw : currentHalfMonth();
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

type ConsoleProps = {
  province: string | null;
  half: HalfMonth;
  locale: 'en' | 'it';
  onProvince: (id: string | null) => void;
  onHalf: (half: HalfMonth) => void;
};

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

/**
 * The field sits on `--canvas` inside a `--surface` card rather than on the
 * card itself, and that is a measurement rather than a preference: the border
 * has to clear SC 1.4.11's 3:1, and `--project-food-mark-quiet` reads 2.99:1
 * on the dark surface against 3.31:1 on the dark canvas. One hundredth, and
 * the fix is free — a cream well inset in a white card is what an input is
 * supposed to look like anyway.
 */
const FIELD_CLASS =
  'w-full appearance-none rounded-[3px] border border-project-food-mark-quiet bg-canvas px-3.5 py-3 font-mono text-note-sm text-ink-strong ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

/**
 * The tool, in a container of its own — on canvas, under the seam, directly
 * above the answer it produces.
 *
 * It used to live in the band. Two things were wrong with that. The fields had
 * to fight a coloured ground, re-stating border, focus ring and text colour in
 * world tokens that existed for no other reason; and the band was doing two
 * jobs at once, pitching the page to someone who had never seen it while also
 * being the control surface for someone who had. Here the controls read as one
 * object with the list they fill in, and the band goes back to one job.
 *
 * No submit button. `brief.md` wanted the answer to recompute as the fields
 * change, which is the truest reading of "two fields and a short list back" —
 * and it leaves the page with exactly one call to action, the `mailto:` at the
 * foot.
 *
 * Native `<select>` rather than a custom listbox: 107 provinces is exactly the
 * length where a phone's own wheel picker beats anything reimplemented, and it
 * arrives keyboard-operable, screen-reader-labelled and zoom-safe for free.
 */
function Console({ province, half, locale, onProvince, onHalf }: ConsoleProps) {
  const { t } = useTranslation();

  // Sorted in the reading language, though the names themselves are Italian:
  // an English reader still scans an alphabetical list, and Intl.Collator is
  // what gets Forlì next to Foggia rather than after Frosinone.
  /**
   * Split into "answers something" and "answers nothing", because with this
   * dataset the second group is the larger one and a flat list of 107 invites
   * the reader to pick a province, get an empty page, and conclude the tool is
   * broken. Both groups stay selectable: a shared link has to resolve, and an
   * empty answer is a real answer that the copy explains.
   */
  const [answering, silent] = useMemo(() => {
    const collator = new Intl.Collator(locale);
    const answered = answeredProvinces(dataset);
    const sorted = [...dataset.provinces].sort((a, b) => collator.compare(a.name, b.name));
    return [sorted.filter((p) => answered.has(p.id)), sorted.filter((p) => !answered.has(p.id))];
  }, [locale]);

  const halves = useMemo(() => {
    const month = new Intl.DateTimeFormat(locale, { month: 'long' });
    return Array.from({ length: 24 }, (_, index) => {
      const { month: monthIndex, late } = splitHalfMonth(index);
      const name = month.format(new Date(2026, monthIndex, 1));
      return {
        value: index,
        label: t(late ? 'seasonable.picker.halfLate' : 'seasonable.picker.halfEarly', {
          month: name,
        }),
      };
    });
  }, [locale, t]);

  return (
    // pt-10 clears the tile straddling the seam above, whose lower half
    // overhangs 24px. Anything tighter and the sticker lands on the card.
    <div className="bg-canvas px-5 pt-10 md:px-13 md:pt-12">
      <div className="rounded-card border border-line-card bg-surface px-5 py-6 md:px-7 md:py-7">
        <div className="grid max-w-[42rem] gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="seasonable-place"
              className="mb-2 block font-mono text-label-wide uppercase text-ink-muted"
            >
              {t('seasonable.picker.placeLabel')}
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

          <div>
            <label
              htmlFor="seasonable-when"
              className="mb-2 block font-mono text-label-wide uppercase text-ink-muted"
            >
              {t('seasonable.picker.whenLabel')}
            </label>
            <select
              id="seasonable-when"
              className={FIELD_CLASS}
              value={half}
              onChange={(event) => onHalf(Number(event.target.value))}
            >
              {halves.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

type AnswerProps = { province: string | null; half: HalfMonth; locale: 'en' | 'it' };

/**
 * The payload, on canvas, immediately under the seam.
 *
 * One `role="status"` on the wrapper rather than one per row: the answer has to
 * announce itself once when it changes, and a live region per produce would
 * read the whole list aloud on every keystroke of the picker.
 */
function Answer({ province, half, locale }: AnswerProps) {
  const { t } = useTranslation();

  const here = province ? dataset.provinces.find((p) => p.id === province) : undefined;
  const answer = useMemo(
    () => (province ? whatsInSeason(dataset, province, half) : null),
    [province, half],
  );

  return (
    <div className="bg-canvas px-5 pt-11 pb-4 md:px-13 md:pt-14 md:pb-6">
      <div role="status" aria-live="polite">
        {!answer || !here ? (
          <p className="max-w-[62ch] text-note text-ink-body text-pretty md:text-body">
            {t('seasonable.states.noPlace')}
          </p>
        ) : (
          <Buckets answer={answer} place={here.name} half={half} locale={locale} />
        )}
      </div>
    </div>
  );
}

type BucketsProps = {
  answer: ReturnType<typeof whatsInSeason>;
  place: string;
  half: HalfMonth;
  locale: 'en' | 'it';
};

function Buckets({ answer, place, half, locale }: BucketsProps) {
  const { t } = useTranslation();
  const { picking, stored } = answer;

  // Reachable, and often: most provinces are named by no disciplinare at all,
  // and the ones that are answer for part of the year. An empty answer is a
  // real result here rather than a failure, and it says so.
  if (picking.length === 0 && stored.length === 0) {
    return (
      <p className="max-w-[62ch] text-note text-ink-body text-pretty md:text-body">
        {t('seasonable.states.nothing', { place })}
      </p>
    );
  }

  return (
    <div className="grid gap-10 md:gap-12">
      <Bucket
        title={t('seasonable.buckets.picking.title')}
        note={t('seasonable.buckets.picking.note', { place })}
        empty={t('seasonable.states.noPicking', { place })}
        entries={picking}
        half={half}
        locale={locale}
        place={place}
      />
      <Bucket
        title={t('seasonable.buckets.stored.title')}
        note={t('seasonable.buckets.stored.note')}
        empty={t('seasonable.states.noStored')}
        entries={stored}
        half={half}
        locale={locale}
        place={place}
      />
    </div>
  );
}

type BucketProps = {
  title: string;
  note: string;
  empty: string;
  entries: readonly Entry[];
  half: HalfMonth;
  locale: 'en' | 'it';
  place: string;
};

/**
 * Entries arrive one per (produce, kind), so a tomato under glass and a tomato
 * in the field are two of them. They are grouped back to one row per produce
 * here rather than in the model: the model's job is which windows apply, and
 * showing the same word twice in a list is a rendering decision.
 */
function Bucket({ title, note, empty, entries, half, locale, place }: BucketProps) {
  const rows = useMemo(() => {
    const grouped = new Map<string, { produce: Produce; entries: Entry[] }>();
    for (const entry of entries) {
      const row = grouped.get(entry.produce.id);
      if (row) row.entries.push(entry);
      else grouped.set(entry.produce.id, { produce: entry.produce, entries: [entry] });
    }
    const collator = new Intl.Collator(locale);
    // Sorted by the kind of thing, then by the designation: three chestnuts in
    // a row read as one answer about chestnuts rather than three unrelated
    // names that happen to start with different letters.
    return [...grouped.values()].sort(
      (a, b) =>
        collator.compare(a.produce[locale], b.produce[locale]) ||
        collator.compare(a.produce.name, b.produce.name),
    );
  }, [entries, locale]);

  return (
    <section>
      <h2 className="font-display text-title-sm text-ink-strong">{title}</h2>
      <p className="mt-1.5 max-w-[62ch] font-mono text-meta text-ink-muted">{note}</p>

      {rows.length === 0 ? (
        <p className="mt-5 max-w-[62ch] text-note text-ink-body text-pretty">{empty}</p>
      ) : (
        <ul className="mt-6 grid list-none gap-y-3 p-0 md:gap-y-3">
          {rows.map((row) => (
            <Row
              key={row.produce.id}
              produce={row.produce}
              entries={row.entries}
              half={half}
              locale={locale}
              place={place}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

type RowProps = {
  produce: Produce;
  entries: readonly Entry[];
  half: HalfMonth;
  locale: 'en' | 'it';
  place: string;
};

function Row({ produce, entries, half, locale, place }: RowProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const panelId = `seasonable-src-${produce.id}`;

  return (
    // The disclosure sits in the label column rather than under the strip, and
    // that placement is what makes the now-line read as one line down the
    // answer instead of a column of ticks: anything between two strips opens a
    // gap wider than the 6px the line over-runs by. It also puts the
    // affordance with the thing it describes.
    <li className="grid gap-y-1.5 md:grid-cols-[13rem_1fr] md:items-center md:gap-x-5">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-body-sm text-ink-strong">{produceName(produce)}</span>
        <span className="font-mono text-micro text-ink-muted">{produceKind(produce, locale)}</span>
        {entries.length > 0 && (
          <span className="font-mono text-micro text-ink-muted">
            {entries.map((entry) => t(KIND_KEY[entry.kind])).join(' · ')}
          </span>
        )}
        <button
          type="button"
          onClick={() => setOpen((was) => !was)}
          aria-expanded={open}
          aria-controls={panelId}
          className="basis-full text-left font-mono text-micro text-ink-muted underline-offset-2 hover:text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {open ? t('seasonable.row.hideSource') : t('seasonable.row.showSource')}
        </button>
      </div>

      <div className="min-w-0">
        <YearStrip entries={entries} half={half} />
        {open && (
          <div id={panelId} className="mt-2 grid gap-1">
            {              entries.map((entry) => (
                <p
                  key={`${entry.kind}-${entry.source.id}`}
                  className="max-w-[62ch] font-mono text-micro text-ink-body"
                >
                  <a
                    href={entry.source.url}
                    rel="noreferrer"
                    className="text-accent underline underline-offset-2"
                  >
                    {entry.source.name}
                  </a>
                  {', '}
                  {entry.source.year}.{' '}
                  {t('seasonable.row.basisTail', { place })}
                </p>
              ))}
          </div>
        )}
      </div>
    </li>
  );
}

const KIND_KEY: Record<WindowKind, string> = {
  'open-field': 'seasonable.kind.openField',
  greenhouse: 'seasonable.kind.greenhouse',
  stored: 'seasonable.kind.stored',
};

const SEGMENTS = 24;

/**
 * The signature: the whole year, and a line where you are standing in it.
 *
 * Twenty-four half-month segments butted with no gap, so the row reads as a
 * year rather than as twenty-four boxes — at 320px each one is about 11.6px,
 * which is why they cannot afford a gutter.
 *
 * The three window kinds are four geometries rather than four colours, and that
 * is not a stylistic choice twice over. Once because SC 1.4.1 forbids carrying
 * meaning in hue alone; once because every font on this site is subset to
 * Latin-1 plus a short extras list, so the geometric-shape glyphs that would
 * have been the easy answer (U+25xx) fall back to a system face and render as
 * dots — djTools.ts:48 records that being learned the hard way.
 *
 *   the year   1px baseline rule, -quiet   the track, always visible
 *   open field solid, full height          grown outside
 *   greenhouse 45deg hatch, full height    under glass: a screen, not a fill
 *   stored     solid, one third height     not growing, keeping
 *
 * The now-line is an ink core with a canvas edge either side, and that is a
 * measurement rather than a flourish: --ink-strong reads 15.66:1 on canvas and
 * 2.23:1 on a filled segment, so a plain rule disappears exactly where it
 * crosses the thing it is marking. The canvas edges carry it there (7.03:1),
 * the ink core carries it everywhere else. It over-runs the strip by 6px top
 * and bottom to meet its neighbours across the 12px row gap, which is what
 * makes it one line down the answer rather than a column of ticks.
 */
function YearStrip({ entries, half }: { entries: readonly Entry[]; half: HalfMonth }) {
  const kindAt = useCallback(
    (index: number): WindowKind | null => {
      // Open field beats greenhouse where both cover: if it is growing outside,
      // that is the truer answer to the question the page asked.
      let found: WindowKind | null = null;
      for (const entry of entries) {
        if (!covers(index, entry.window.start, entry.window.end)) continue;
        if (entry.kind === 'open-field') return 'open-field';
        found = entry.kind;
      }
      return found;
    },
    [entries],
  );

  return (
    <div aria-hidden="true" className="relative h-2 w-full md:h-2.5">
      <span className="absolute inset-x-0 bottom-0 block h-px bg-project-food-mark-quiet" />

      <div className="absolute inset-0 flex">
        {Array.from({ length: SEGMENTS }, (_, index) => {
          const kind = kindAt(index);
          if (!kind) return <span key={index} className="flex-1" />;
          return (
            <span
              key={index}
              className={cx(
                'flex-1',
                kind === 'open-field' && 'bg-project-food-mark',
                kind === 'greenhouse' && 'hatch-food-mark',
                kind === 'stored' && 'mt-auto h-1/3 bg-project-food-mark-quiet',
              )}
            />
          );
        })}
      </div>

      <span
        style={{ left: `calc(${((half + 0.5) / SEGMENTS) * 100}% - 1.5px)` }}
        className="absolute inset-y-[-6px] block w-[3px] border-x border-canvas bg-ink-strong"
      />
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

/**
 * The page's one call to action, and the first thing on this site to ask a
 * reader for anything since site.md ruled that a page about software which does
 * not exist does not get to ask for an address. That premise expired when this
 * shipped: a correction from someone who actually farms in Puglia is the
 * highest-value input a hand-curated dataset can get.
 *
 * Still `mailto:`. There is no form backend and none is being added.
 */
function Ask({ province, half, locale }: AnswerProps) {
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
