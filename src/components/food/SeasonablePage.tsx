import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dataset } from '../../content/seasonable/index';
import { site } from '../../content/site';
import type { HalfMonth, SeasonRow, WindowKind } from '../../lib/seasonable';
import {
  currentHalfMonth,
  produceName,
  answeredProvinces,
  produceKind,
  seasonYear,
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
 * The payload, on canvas, immediately under the console that fills it.
 *
 * One `role="status"` on the wrapper rather than one per row: the answer has to
 * announce itself once when it changes, and a live region per designation would
 * read the whole table aloud on every keystroke of the picker.
 */
function Answer({ province, half, locale }: AnswerProps) {
  const { t } = useTranslation();

  const here = province ? dataset.provinces.find((p) => p.id === province) : undefined;
  const rows = useMemo(() => (province ? seasonYear(dataset, province) : []), [province]);

  return (
    <div className="bg-canvas px-5 pt-11 pb-4 md:px-13 md:pt-14 md:pb-6">
      <div role="status" aria-live="polite">
        {!here ? (
          <p className="max-w-[62ch] text-note text-ink-body text-pretty md:text-body">
            {t('seasonable.states.noPlace')}
          </p>
        ) : rows.length === 0 ? (
          <p className="max-w-[62ch] text-note text-ink-body text-pretty md:text-body">
            {t('seasonable.states.nothing', { place: here.name })}
          </p>
        ) : (
          <SeasonTable rows={rows} place={here.name} half={half} locale={locale} />
        )}
      </div>
    </div>
  );
}

const KIND_KEY: Record<WindowKind, string> = {
  'open-field': 'seasonable.kind.openField',
  greenhouse: 'seasonable.kind.greenhouse',
  stored: 'seasonable.kind.stored',
};

type TableProps = {
  rows: readonly SeasonRow[];
  place: string;
  half: HalfMonth;
  locale: 'en' | 'it';
};

/**
 * The answer as a double-entry table: a designation per row, a month per
 * column, and the cell says what is happening to that designation in that
 * month.
 *
 * This replaced twelve months of unlabelled bar. Each row used to be a
 * 24-segment strip with a line drawn at the selected fortnight — which showed
 * the *shape* of a window accurately and left the reader with no way to say
 * which months they were looking at. Nothing carried the axis. You could see
 * that a window ended two thirds of the way along and still not know whether
 * that meant August or September, and a page whose whole argument is "every
 * date here is quoted from a document" cannot afford an answer the reader has
 * to take on trust.
 *
 * A real `<table>`, not a grid of divs: with `scope` on both header axes, a
 * screen reader announces a cell as "Carciofo di Paestum IGP, March, open
 * field" without being told to. That is the same double entry the sighted
 * reader gets, which is the whole point of using the element.
 *
 * Half-month precision survives the move to a month axis. Each cell is two
 * sub-blocks, one per fortnight, so a window that starts mid-March still
 * reads as starting mid-March. The dataset's resolution is the half-month and
 * the copy makes a claim about two-week errors; a table that rounded to whole
 * months would be quietly coarser than the thing it documents.
 */
function SeasonTable({ rows, place, half, locale }: TableProps) {
  const { t } = useTranslation();

  const months = useMemo(() => {
    const long = new Intl.DateTimeFormat(locale, { month: 'long' });
    const short = new Intl.DateTimeFormat(locale, { month: 'short' });
    return Array.from({ length: 12 }, (_, m) => ({
      index: m,
      long: long.format(new Date(2026, m, 1)),
      // `short` carries a trailing dot in Italian ("gen."), which reads as
      // noise in a header cell that is already three characters wide.
      short: short.format(new Date(2026, m, 1)).replace(/\.$/, ''),
    }));
  }, [locale]);

  /**
   * In season now first, then by the kind of thing, then by designation.
   *
   * The reader arrived with a fortnight selected and a question about it. The
   * table answers the whole year, so the rows that answer *their* fortnight
   * have to be the ones they land on — otherwise the honest, complete view is
   * also a slower one, and the page has traded its answer for its evidence.
   */
  const ordered = useMemo(() => {
    const collator = new Intl.Collator(locale);
    return [...rows].sort(
      (a, b) =>
        Number(b.calendar[half] !== null) - Number(a.calendar[half] !== null) ||
        collator.compare(a.produce[locale], b.produce[locale]) ||
        collator.compare(a.produce.name, b.produce.name),
    );
  }, [rows, half, locale]);

  const nowMonth = splitHalfMonth(half).month;

  return (
    <figure className="m-0">
      <figcaption className="mb-5 max-w-[62ch] md:mb-6">
        <h2 className="font-display text-title-sm text-ink-strong">
          {t('seasonable.table.heading')}
        </h2>
        <p className="mt-1.5 font-mono text-meta text-ink-muted text-pretty">
          {t('seasonable.table.note', { place })}
        </p>
      </figcaption>

      {/*
        The table is 13 columns and the narrowest phone is 320px, so it scrolls
        inside its own box rather than making the page scroll sideways. The
        designation column is sticky, because a month cell means nothing once
        its row header has been scrolled off the left edge.
      */}
      <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
        <table className="w-full min-w-[42rem] table-fixed border-collapse text-left">
          {/*
            Without this the designation column sizes to its longest name —
            "Pomodoro San Marzano dell'Agro Sarnese-Nocerino DOP" — and squeezes
            twelve months into the last third of the table, which is the one
            thing the column axis exists to prevent.
          */}
          <colgroup>
            <col className="w-[15rem] md:w-[18rem]" />
            {Array.from({ length: 12 }, (_, i) => (
              <col key={i} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 bg-canvas pb-2 pr-3 align-bottom font-mono text-label-wide uppercase text-ink-muted"
              >
                {t('seasonable.table.productHeader')}
              </th>
              {months.map((month) => (
                <th
                  key={month.index}
                  scope="col"
                  className={cx(
                    'pb-2 text-center align-bottom font-mono text-micro font-medium uppercase',
                    month.index === nowMonth ? 'text-accent' : 'text-ink-muted',
                  )}
                >
                  <span aria-hidden="true">{month.short}</span>
                  <span className="sr-only">{month.long}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {ordered.map((row) => (
              <TableRow
                key={row.produce.id}
                row={row}
                half={half}
                locale={locale}
                place={place}
                nowMonth={nowMonth}
              />
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

type TableRowProps = {
  row: SeasonRow;
  half: HalfMonth;
  locale: 'en' | 'it';
  place: string;
  nowMonth: number;
};

function TableRow({ row, half, locale, place, nowMonth }: TableRowProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const panelId = `seasonable-src-${row.produce.id}`;
  const activeNow = row.calendar[half] !== null;

  return (
    <>
      <tr className="border-t border-line-card">
        <th
          scope="row"
          className="sticky left-0 z-10 bg-canvas py-2.5 pr-3 align-middle font-normal"
        >
          <span
            className={cx(
              'block text-body-sm',
              activeNow ? 'text-ink-strong' : 'text-ink-body',
            )}
          >
            {produceName(row.produce)}
          </span>
          <span className="mt-0.5 block font-mono text-micro text-ink-muted">
            {produceKind(row.produce, locale)}
            {' · '}
            {row.entries.map((entry) => t(KIND_KEY[entry.kind])).join(' · ')}
          </span>
          <button
            type="button"
            onClick={() => setOpen((was) => !was)}
            aria-expanded={open}
            aria-controls={panelId}
            className="mt-1 block text-left font-mono text-micro text-ink-muted underline-offset-2 hover:text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {open ? t('seasonable.row.hideSource') : t('seasonable.row.showSource')}
          </button>
        </th>

        {Array.from({ length: 12 }, (_, month) => (
          <Cell
            key={month}
            early={row.calendar[month * 2]}
            late={row.calendar[month * 2 + 1]}
            nowHalf={month === nowMonth ? (half % 2 === 0 ? 'early' : 'late') : null}
          />
        ))}
      </tr>

      {open && (
        <tr id={panelId}>
          {/* 13 columns: the designation plus the twelve months. */}
          <td colSpan={13} className="pb-3 pl-0">
            <div className="grid gap-1">
              {row.entries.map((entry) => (
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
                  {entry.source.year}. {t('seasonable.row.basisTail', { place })}
                </p>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

type CellProps = {
  early: WindowKind | null;
  late: WindowKind | null;
  nowHalf: 'early' | 'late' | null;
};

/**
 * One month, drawn as its two fortnights.
 *
 * The three window kinds stay three geometries rather than three colours —
 * solid full height for open field, a hatch for glass, a low bar for storage.
 * That is not a style choice repeated for its own sake: SC 1.4.1 forbids
 * carrying meaning in hue alone, and every face on this site is subset to
 * Latin-1 plus a short extras list, so the geometric-shape glyphs that would
 * have been the easy answer render as fallback dots. Print this table in
 * greyscale and it still parses.
 *
 * The screen reader gets the same fact in words, from the `sr-only` span, and
 * the table's own `scope` headers supply the designation and the month around
 * it — so the cell announces as a sentence without any of that being written
 * into an aria-label by hand.
 */
function Cell({ early, late, nowHalf }: CellProps) {
  const { t } = useTranslation();
  const kinds = [early, late].filter((k): k is WindowKind => k !== null);
  const spoken =
    kinds.length === 0
      ? null
      : [
          [...new Set(kinds)].map((k) => t(KIND_KEY[k])).join(' · '),
          early && !late ? t('seasonable.table.firstHalf') : null,
          late && !early ? t('seasonable.table.secondHalf') : null,
        ]
          .filter(Boolean)
          .join(', ');

  return (
    // The rule is anchored to the cell rather than to the half inside it, so
    // it spans the row's full height instead of the 32px the marks occupy.
    // Anchored to the half it broke into one tick per row, which read as four
    // marks rather than one axis.
    <td className="relative p-0 align-middle">
      {spoken && <span className="sr-only">{spoken}</span>}
      <div className="flex h-8 items-center gap-px px-px">
        <Half kind={early} />
        <Half kind={late} />
      </div>
      {nowHalf && (
        <span
          aria-hidden="true"
          className={cx(
            'pointer-events-none absolute inset-y-0 w-0.5 bg-accent',
            nowHalf === 'early' ? 'left-0' : 'left-1/2',
          )}
        />
      )}
    </td>
  );
}

/** One fortnight: a mark if something is happening in it, nothing if not. */
function Half({ kind }: { kind: WindowKind | null }) {
  return (
    <span className="flex h-full flex-1 items-center">
      {kind && (
        <span
          aria-hidden="true"
          className={cx(
            'block w-full rounded-[1px]',
            kind === 'open-field' && 'h-4 bg-project-food-mark',
            kind === 'greenhouse' && 'hatch-food-mark h-4',
            kind === 'stored' && 'h-1.5 bg-project-food-mark-quiet',
          )}
        />
      )}
    </span>
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
