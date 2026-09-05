import { useTranslation } from 'react-i18next';
import {
  bpmHistogram,
  capabilities,
  downloadSpec,
  filterChips,
  heroWave,
  heroWaveLitFrom,
  heroWaveTicks,
  litFilterChip,
  openingCards,
  pitchLadder,
  severityBars,
} from '../../content/djTools';
import type { Capability, WellFigure } from '../../content/djTools';
import { useMetaDescription } from '../../lib/meta';
import { navigate } from '../../lib/route';
import { useTheme } from '../../lib/theme-context';
import { AccentButton } from '../ui/Pill';
import { Eyebrow } from '../ui/Eyebrow';
import { LanguageSwitch } from '../ui/LanguageSwitch';
import { Monogram } from '../ui/Monogram';
import { SkipLink } from '../ui/SkipLink';
import { ArrowLeftIcon, DownloadIcon, MoonIcon, SunIcon, WaveIcon } from '../ui/icons';
import { IconButton, ThemeSwitch } from '../SiteHeader';
import { SiteFooter } from '../SiteFooter';
import { cx } from '../ui/cx';

/**
 * Crate — `/dj-tools`.
 *
 * The page leaves the shared project-page chrome it kept when it was still a
 * description of software. There is no full-bleed world band, no 3px seam and
 * no tile straddling it: it opens on the canvas with the name, the deck and
 * the download, and the world appears as *cards* on that ground rather than as
 * a block the reader lands inside. `/magic-tools` and `/seasonable` keep the
 * band contract; this one is now the page that left it.
 *
 * What replaces it, block by block:
 *
 *   - a floating pill header rather than a full-width bar;
 *   - a two-column hero — the name and the ask on the left, the distribution
 *     in a dark card on the right, which is the one figure that used to be the
 *     band and is now a card like everything else;
 *   - three premises staggered down the page rather than three level cards, so
 *     the eye reads them in order instead of scanning them as a row;
 *   - six capabilities alternating prose and figure across the full width,
 *     with the last two paired, because a figure given half a page is a figure
 *     a reader will actually read;
 *   - the download card, and the same spec sheet beside it.
 *
 * THE COLOUR IS THE APP'S, not this page's. `--project-dj-*` was indigo and
 * amber, decided here while Crate was a page about software that did not
 * exist. The software exists, it is written in deep green with a mint rung,
 * and a page whose only ask is "download this file" has to look like the file.
 * The tokens now carry the app's own values verbatim; see theme.css.
 *
 * Two download buttons, and that is deliberate. The older version of this page
 * kept its single CTA below the argument, on the reasoning that asking above
 * it is asking before the case is made. That reasoning holds for a reader who
 * has never heard of this; it does not hold for the one arriving from the
 * shelf card for the second time, who wants the file and not the essay. The
 * hero button is the real download, not a jump link to the one below.
 *
 * The file is served with `Content-Disposition: attachment` (firebase.json), so
 * it is never rendered from this origin. That is not a nicety: the site's CSP
 * allows exactly one inline script by hash, and `crate.html` is one large inline
 * script, so rendering it here would be blocked outright. It is a download, and
 * the header makes the browser treat it as one.
 */
export function DjToolsPage() {
  const { t } = useTranslation();

  useMetaDescription(t('dj.metaDescription'));

  return (
    <div className="mx-auto w-full max-w-[1440px] bg-canvas">
      <SkipLink />
      <PageHeader />
      <main id="main">
        <Hero />
        <Premises />
        <Rack />
        <Download />

        <div className="px-5 pb-14 md:px-13 md:pb-20">
          <BackLink />
        </div>

        {/* The bar keeps the world's ground and gains the card's corners, so
            the page closes on the same rounded shape it has been stacking all
            the way down rather than on a full-bleed slab. */}
        <div className="overflow-hidden rounded-t-card">
          <SiteFooter tone="dj" />
        </div>
      </main>
    </div>
  );
}

/**
 * The breadcrumb, as a pill floating on the canvas rather than as a bar ruled
 * off from it. The strip behind it still carries `--header-bg` and the blur:
 * a genuinely transparent gap would let the page slice through the 12px above
 * the pill on every scroll, which is the one thing a floating header must not
 * do. So the pill floats and the strip stays quiet.
 *
 * Reuses `SiteHeader`'s own `ThemeSwitch` / `IconButton` rather than a third
 * copy of the same control.
 */
function PageHeader() {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <header className="sticky top-0 z-20 bg-header-bg px-5 py-3 backdrop-blur-[10px] md:px-13 md:py-4">
      <div className="flex items-center justify-between gap-4 rounded-pill border border-line-card bg-surface py-2 pr-3 pl-2 shadow-card md:py-2.5 md:pr-4 md:pl-2.5">
        <a
          href="/"
          onClick={navigate}
          className="flex min-w-0 items-center gap-3 text-header-ink no-underline"
        >
          <Monogram size={34} className="shrink-0 md:size-[38px]" />
          <span className="min-w-0 truncate font-mono text-label-wide uppercase tracking-[0.14em] text-header-nav">
            Walter{' '}
            <span aria-hidden="true" className="text-accent">
              /
            </span>{' '}
            {t('dj.title')}
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
 * The name, the deck, the ask, and the distribution beside them.
 *
 * `--text-hero` is 96px and is the site's ceiling; the mockup wanted 128. It
 * does not get a token of its own for one heading on one page — "Crate" is
 * five characters and already the only project name short enough to carry the
 * hero size at all, which was the point of using it.
 */
function Hero() {
  const { t } = useTranslation();

  return (
    <div className="px-5 pt-10 pb-16 md:px-13 md:pt-14 md:pb-24 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 xl:gap-20">
      <div>
        <div className="mb-6 flex items-center gap-3 md:mb-7">
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-sage-solid font-mono text-micro text-sage-solid-fg"
          >
            02
          </span>
          <Eyebrow className="tracking-[0.18em] text-accent">{t('dj.audience')}</Eyebrow>
        </div>

        <h1 className="mb-5 font-sans text-hero-sm font-semibold tracking-[-0.03em] text-ink-strong md:mb-6 lg:text-hero">
          {t('dj.title')}
        </h1>

        <p className="max-w-[46ch] text-lead text-ink-body text-pretty">
          <span className="lg:hidden">{t('dj.deckShort')}</span>
          <span className="hidden lg:inline">{t('dj.deck')}</span>
        </p>

        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 md:mt-10">
          <DownloadButton />
          {/* The two spec rows a reader wants before the click, read off the
              sheet below rather than restated — one string that goes stale is
              one string too many on a page whose argument is that it does not
              oversell. */}
          <p className="font-mono text-micro uppercase tracking-[0.12em] text-ink-muted">
            {t('dj.download.spec.format.value')} <span aria-hidden="true">·</span>{' '}
            {t('dj.download.spec.size.value')}
          </p>
        </div>
      </div>

      <HeroChart />
    </div>
  );
}

/**
 * The page's one ask, rendered twice — in the hero and in the download card.
 * `/crate`, not `/crate.html`: hosting has cleanUrls on, so the .html path
 * 301s here anyway. The `download` attribute names the saved file, and a plain
 * anchor with no click handler keeps the in-app router out of it.
 *
 * A 52px target with the site's own button padding, the glyph carrying the
 * verb the label already says, and the rust's own cast under it lifting a
 * pixel on hover. Full width below `sm`, where a pill floating in a wide
 * column reads as an afterthought.
 *
 * It hovers into the site's deep green again. The ocean hover existed because
 * this page used to be blue and a green fill was the last green on it; the
 * page is green now, so the site's own gesture is the right one.
 */
function DownloadButton() {
  const { t } = useTranslation();

  return (
    <AccentButton
      href="/crate"
      download="crate.html"
      className="group flex h-13 w-full items-center justify-center gap-2.5 px-7 text-[13.5px] shadow-cta hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto"
    >
      <DownloadIcon className="size-[1.15em] shrink-0 transition-transform duration-150 group-hover:translate-y-0.5" />
      {t('dj.download.cta')}
    </AccentButton>
  );
}

/**
 * The distribution, in the world's own card. This is what the full-bleed band
 * used to be: the one place on the page where the subject looks like the thing
 * it is for. As a card it stops being the ground the reader stands on and
 * becomes an exhibit beside the deck, which is the honest weight for a figure
 * that is drawn rather than measured.
 *
 * It is not an audio waveform and must not become one. The page says two
 * screens down that it doesn't analyse your audio; these are track counts per
 * tempo, data Rekordbox already holds, and the four labelled tempi are what
 * keep it legible as a distribution.
 */
function HeroChart() {
  const { t } = useTranslation();

  return (
    <div className="relative mt-12 overflow-hidden rounded-card border border-project-dj-border bg-project-dj px-6 py-7 shadow-lift-dj md:px-8 md:py-9 lg:mt-0">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-project-dj-accent opacity-[0.14]"
      />
      <div className="relative mb-7 flex items-center justify-between gap-4 md:mb-9">
        <Eyebrow className="tracking-[0.16em] text-project-dj-body">
          {t('dj.does.overview.title')}
        </Eyebrow>
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-project-dj-accent text-project-dj"
        >
          <WaveIcon />
        </span>
      </div>

      {/* `aria-hidden`, like every figure here: `dj.does.overview.body` states
          the pile and the hole in words. */}
      <div aria-hidden="true" className="relative">
        <div className="flex h-[150px] items-end gap-[2px] md:h-[190px] md:gap-[3px]">
          {heroWave.map((height, index) => (
            <span
              key={index}
              style={{ height: `${height}%` }}
              className={cx(
                'min-h-[3px] flex-1 rounded-t-[2px]',
                height >= heroWaveLitFrom ? 'bg-project-dj-accent' : 'bg-project-dj-wave',
              )}
            />
          ))}
        </div>
        <div className="relative mt-3 h-3">
          {heroWaveTicks.map((tick) => (
            <span
              key={tick.label}
              style={{ left: `${((tick.at + 0.5) / heroWave.length) * 100}%` }}
              className={cx(
                'absolute -translate-x-1/2 font-mono text-micro/none',
                tick.label === '122' ? 'text-project-dj-accent' : 'text-project-dj-body',
              )}
            >
              {tick.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * The three badge tones, in page order. Clover, ocean, then the page's own
 * cream band — the site's two colours and no colour, which is exactly the
 * weighting the three premises want: the problem, the mechanism, and the
 * admission that gets no colour at all.
 */
const premiseBadges = [
  'bg-sage-solid text-sage-solid-fg',
  'bg-ocean-solid text-ocean-solid-fg',
  'bg-canvas-band text-ink-strong',
] as const;

/**
 * The opening argument: the problem, the mechanism, the honest status.
 *
 * They step down the page instead of sitting level. Three equal cards in a row
 * read as three options to choose between; staggered, they read in the order
 * they were written, which matters because the third one only makes sense
 * after the first two.
 */
function Premises() {
  const { t } = useTranslation();

  return (
    <div className="px-5 pb-16 md:px-13 md:pb-24">
      <ul className="grid list-none gap-6 lg:grid-cols-3 lg:items-start lg:gap-7">
        {openingCards.map((card, index) => (
          <li
            key={card.id}
            className={cx(
              'rounded-card border border-line-card bg-surface px-6 py-7 shadow-card md:px-7 md:py-8',
              index === 1 && 'lg:mt-9',
              index === 2 && 'lg:mt-[72px]',
            )}
          >
            <span
              aria-hidden="true"
              className={cx(
                'mb-6 grid size-11 place-items-center rounded-full font-mono text-meta md:mb-7',
                premiseBadges[index],
              )}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className="mb-3 font-display text-section-sm text-ink-strong text-balance md:mb-4">
              {t(`dj.${card.id}.heading`)}
            </h2>
            <p className="text-note text-ink-body text-pretty">
              <span className="lg:hidden">{t(`dj.${card.id}.bodyShort`)}</span>
              <span className="hidden lg:inline">{t(`dj.${card.id}.body`)}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The six capabilities. Four alternate down the page, prose in one column and
 * the figure in the other; the last two pair up, because `overview` and
 * `handoff` are the two shortest rows and a full alternating width each would
 * stretch the page for no reading gain.
 *
 * Capability titles take the DJ world's own face (`sans`) while the premise
 * headings above stay the site's serif. Two voices, and the grid is the
 * page's.
 */
function Rack() {
  const { t } = useTranslation();

  return (
    <div className="px-5 pb-16 md:px-13 md:pb-24">
      <section>
        <div className="mb-4 flex items-center gap-3 md:mb-5">
          <span className="font-mono text-label text-accent">04</span>
          <span aria-hidden="true" className="h-px w-12 bg-accent" />
        </div>
        <h2 className="mb-12 max-w-[16ch] font-display text-section text-ink-strong text-balance md:mb-16 md:text-display">
          {t('dj.does.heading')}
        </h2>

        <ul className="flex list-none flex-col gap-16 md:gap-24">
          {capabilities.slice(0, 4).map((capability, index) => (
            <Row key={capability.id} capability={capability} index={index} />
          ))}
        </ul>

        <ul className="mt-16 grid list-none gap-14 md:mt-24 lg:grid-cols-2 lg:gap-x-14 xl:gap-x-20">
          {capabilities.slice(4).map((capability, index) => (
            <Coda key={capability.id} capability={capability} index={index + 4} />
          ))}
        </ul>
      </section>
    </div>
  );
}

/** The numeral and the title, shared by the wide rows and the paired coda. */
function CellHead({ capability, index }: { capability: Capability; index: number }) {
  const { t } = useTranslation();

  return (
    <div className="mb-4 flex items-baseline gap-3">
      <span className="font-mono text-label text-accent">
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="font-sans text-title-sm font-semibold tracking-[-0.02em] text-ink-strong text-balance md:text-section-sm">
        {t(`dj.does.${capability.id}.title`)}
      </h3>
    </div>
  );
}

/**
 * One wide capability. Odd rows put the figure first at `lg` — in the DOM the
 * prose always comes first, and only the visual order flips, so the page reads
 * top to bottom in a screen reader and in source however it is laid out.
 */
function Row({ capability, index }: { capability: Capability; index: number }) {
  const { t } = useTranslation();
  const figureFirst = index % 2 === 1;

  return (
    <li className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-14 xl:gap-20">
      <div className={cx(figureFirst && 'lg:order-2')}>
        <CellHead capability={capability} index={index} />

        <p className="max-w-[58ch] text-note text-ink-body text-pretty md:text-body-sm">
          {t(`dj.does.${capability.id}.body`)}
        </p>

        {capability.caveat && (
          <div className="mt-6 max-w-[58ch] rounded-card-sm border-l-[3px] border-accent bg-canvas-band px-5 py-4 text-note-sm text-ink-body text-pretty">
            {t(`dj.does.${capability.id}.caveat`)}
          </div>
        )}

        {/* The ladder sits in the prose column rather than in the panel: it is
            the second half of one paragraph, and the wheel beside it is the
            first. Splitting them across the two columns is what lets both be
            large enough to read. */}
        {capability.id === 'harmonic' && (
          <div className="mt-7 max-w-[26em]">
            <PitchLadder />
          </div>
        )}
      </div>

      <Panel
        capability={capability}
        className={cx('mt-9 lg:mt-0', figureFirst && 'lg:order-1')}
      />
    </li>
  );
}

/** One of the two paired capabilities — prose over its figure, half width. */
function Coda({ capability, index }: { capability: Capability; index: number }) {
  const { t } = useTranslation();

  return (
    <li>
      <CellHead capability={capability} index={index} />
      <p className="text-note text-ink-body text-pretty md:text-body-sm">
        {t(`dj.does.${capability.id}.body`)}
      </p>
      <Panel capability={capability} className="mt-7" />
    </li>
  );
}

/**
 * Which ground each figure sits on. Only `stack` takes the world — six
 * conditions intersecting is the one claim that is about the app's interior
 * rather than about a file or a list, so it is drawn inside the app's colour.
 *
 * `severity` is on the surface rather than on the cream band, and that is a
 * measurement rather than a preference: `--project-dj-mark-quiet` reads 3.12:1
 * on white and 2.78:1 on `--canvas-band`, and the bars are non-text marks with
 * a 3:1 floor (WCAG 1.4.11).
 */
const panelTone: Record<WellFigure, string> = {
  oneway: 'border border-line-card bg-surface',
  stack: 'border border-project-dj-border bg-project-dj shadow-lift-dj',
  wheel: 'border border-line-card bg-surface',
  severity: 'border border-line-card bg-surface',
  histogram: 'border border-line-card bg-surface',
  handback: 'border border-line-card bg-surface',
};

/**
 * A figure and the line that says what it shows. The caption is real text in a
 * `figcaption` — the drawing above it is `aria-hidden`, so this is the only
 * part of the figure a screen reader gets, and every one of them is a sentence
 * the prose beside it has already made.
 */
function Panel({ capability, className }: { capability: Capability; className?: string }) {
  const { t } = useTranslation();
  const onWorld = capability.well === 'stack';

  return (
    <figure
      className={cx(
        'rounded-card px-6 py-7 md:px-8 md:py-9',
        panelTone[capability.well],
        className,
      )}
    >
      <Well figure={capability.well} />
      <figcaption
        className={cx(
          'mt-6 font-mono text-micro uppercase tracking-[0.12em]',
          onWorld ? 'text-project-dj-body' : 'text-ink-muted',
        )}
      >
        {t(`dj.figures.${capability.caption}`)}
      </figcaption>
    </figure>
  );
}

/**
 * Every well is a CSS drawing of a sentence the copy already wrote, never a
 * mockup of software. All six are `aria-hidden`, the way `ManaPips` handles a
 * decorative diagram — the facts are in the adjacent prose and in the caption,
 * so a screen-reader user loses nothing and gains no duplicate.
 *
 * Meaning is never carried by colour alone: the histogram reads as bar height,
 * the ladder as row order, the stack as position, the severity bars as length.
 * That is why lit-against-quiet measuring 2.08:1 is not a defect — each mark
 * clears 3:1 against the ground it sits on, which is what 1.4.11 asks.
 */
function Well({ figure }: { figure: WellFigure }) {
  if (figure === 'oneway') return <OneWay />;
  if (figure === 'stack') return <FilterStack />;
  if (figure === 'wheel') return <CamelotFigure />;
  if (figure === 'severity') return <SeverityBars />;
  if (figure === 'histogram') return <BpmHistogram />;
  return <HandBack />;
}

/**
 * `read`'s figure: the export goes in, nothing comes back. A mechanism drawn
 * rather than data invented — this row makes a claim about behaviour, and the
 * honest way to illustrate a claim about behaviour is to draw the behaviour.
 * The barred return arrow is the whole argument of the page's first capability.
 */
function OneWay() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-4 font-mono text-micro">
      <div className="flex items-center gap-3">
        <span className="rounded-pill border border-project-dj-mark-quiet px-3.5 py-2 text-ink-body">
          collection.xml
        </span>
        <span className="h-px flex-1 bg-project-dj-mark" />
        <Caret dir="right" className="border-l-project-dj-mark" />
        <span className="rounded-pill bg-project-dj-mark px-3.5 py-2 text-canvas">Crate</span>
      </div>
      <div className="flex items-center gap-3 opacity-60">
        <span className="rounded-pill border border-dashed border-ink-muted px-3.5 py-2 text-ink-muted">
          collection.xml
        </span>
        <span className="relative h-px flex-1 bg-ink-muted">
          <span className="absolute top-1/2 left-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
          <span className="absolute top-1/2 left-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-accent" />
        </span>
        <Caret dir="left" className="border-r-ink-muted" />
        <span className="rounded-pill border border-dashed border-ink-muted px-3.5 py-2 text-ink-muted">
          Crate
        </span>
      </div>
    </div>
  );
}

/**
 * Arrowheads as borders rather than as glyphs. ▸ ◂ ▾ live outside the latin
 * subset of the self-hosted IBM Plex Mono, so they would fall back to a system
 * face and render at the wrong weight — the same way ★ did in the filter
 * chips. Colour travels as one class because the visible border is whichever
 * side the caller lights.
 */
function Caret({ dir, className }: { dir: 'right' | 'left' | 'down'; className: string }) {
  const shape = {
    right: 'border-y-[4px] border-l-[6px] border-y-transparent',
    left: 'border-y-[4px] border-r-[6px] border-y-transparent',
    down: 'border-x-[4px] border-t-[6px] border-x-transparent',
  }[dir];
  return <span aria-hidden="true" className={cx('block size-0 shrink-0', shape, className)} />;
}

/**
 * `filters`' figure, and the only one drawn inside the world: six conditions
 * as chips, then the rule and the sliver they intersect down to. The lit chip
 * is the one the copy stops to explain.
 */
function FilterStack() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {filterChips.map((chip, index) => (
          <span
            key={chip}
            className={cx(
              'rounded-pill px-3.5 py-2 font-mono text-micro',
              index === litFilterChip
                ? 'bg-project-dj-accent font-medium text-project-dj'
                : 'border border-line-on-panel text-project-dj-body',
            )}
          >
            {chip}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <span className="h-px w-full bg-line-inset" />
        <span className="h-2.5 w-[22%] rounded-pill bg-project-dj-accent" />
      </div>
    </div>
  );
}

/**
 * `handoff`'s figure: the pool leaves as a playlist and lands back where the
 * work happens. Same reasoning as `OneWay` — the closing argument is a claim
 * about where the tool stops, so the drawing is that boundary. No track count
 * on the shortlist: the page does not know how many, and inventing one to fill
 * a chip is the exact move it spends six paragraphs not making.
 */
function HandBack() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-2.5 font-mono text-micro">
      {['filter', 'shortlist', 'Rekordbox'].map((step, index) => (
        <div key={step} className="flex items-center gap-3">
          <span
            className={cx(
              'rounded-pill px-3.5 py-2',
              index === 2
                ? 'bg-project-dj-mark text-canvas'
                : 'border border-project-dj-mark-quiet text-ink-body',
            )}
          >
            {step}
          </span>
          {index < 2 && <Caret dir="down" className="border-t-project-dj-mark-quiet" />}
        </div>
      ))}
      <p className="mt-1 flex items-center gap-2 pl-1 text-ink-muted">
        <Caret dir="down" className="border-t-ink-muted" />
        you
      </p>
    </div>
  );
}

function PitchLadder() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3">
      {pitchLadder.map((row) => (
        <div key={row.label} className="flex items-center gap-3">
          <span className="w-10 shrink-0 text-right font-mono text-micro text-ink-muted">
            {row.label}
          </span>
          <span className="h-2.5 flex-1 rounded-pill bg-project-dj-mark-quiet/40">
            <span
              className="block h-full rounded-pill bg-project-dj-mark"
              style={{ width: `${row.lit * 100}%` }}
            />
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * `dj.does.health.body` ends on "ordered by how much each one costs you in a
 * booth, not by how many there are", so this draws the ordering rather than
 * the items. The items stay in the prose where they were written — setting
 * them again beside it would be the same approved copy twice.
 */
function SeverityBars() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-2">
      {severityBars.map((width, index) => (
        <span
          key={index}
          className={cx(
            'h-2.5 rounded-pill',
            index < 3 ? 'bg-project-dj-mark' : 'bg-project-dj-mark-quiet',
          )}
          style={{ width: `${width}%` }}
        />
      ))}
    </div>
  );
}

function BpmHistogram() {
  return (
    <div aria-hidden="true">
      <div className="flex h-[128px] items-end gap-[4px]">
        {bpmHistogram.map((bucket) => (
          <span
            key={bucket.bpm}
            className={cx(
              'min-h-[3px] flex-1 rounded-t-[2px]',
              'lit' in bucket && bucket.lit ? 'bg-project-dj-mark' : 'bg-project-dj-mark-quiet',
            )}
            style={{ height: `${bucket.h}%` }}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-micro text-project-dj-mark">
        <span>122</span>
        <span>128</span>
      </div>
    </div>
  );
}

/**
 * The Camelot wheel — the `camelot` utility as the ring's fill, with twelve
 * `1A…12A` labels around it and three lit: `8A` and its two numeric
 * neighbours, the adjacency rule the copy states.
 *
 * The wheel carries only the `…A` ring, so `8B` (the relative-mode neighbour)
 * has nowhere to render; the fact still reaches the reader because the body
 * states it in full, and this figure is `aria-hidden`.
 */
const CAMELOT_LABELS = Array.from({ length: 12 }, (_, i) => `${i + 1}A`);
const CAMELOT_LIT = new Set(['7A', '8A', '9A']);

function CamelotFigure() {
  const radius = 94;
  return (
    <div aria-hidden="true" className="relative mx-auto grid size-[212px] place-items-center">
      {/* The ring is its own element, smaller than the box, so the labels sit
          outside it on the card. They used to ride the gradient, which runs
          from a deep blue through a pale one into the world's mint — no single
          label colour is legible across all three, and the pale arc was where
          it failed. Outside the ring they are ordinary ink. */}
      <span className="camelot grid size-[150px] place-items-center rounded-full">
        <span className="size-[74px] rounded-full bg-project-dj" />
      </span>
      {CAMELOT_LABELS.map((label, index) => {
        const angle = (index / CAMELOT_LABELS.length) * 2 * Math.PI - Math.PI / 2;
        const x = Math.round(Math.cos(angle) * radius);
        const y = Math.round(Math.sin(angle) * radius);
        const lit = CAMELOT_LIT.has(label);
        return (
          <span
            key={label}
            style={{ transform: `translate(${x}px, ${y}px)` }}
            className={cx(
              'absolute font-mono text-label',
              lit ? 'font-semibold text-ink-strong' : 'text-ink-muted',
            )}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}

/**
 * The one thing the page asks the reader to do, restated at the end with the
 * caveats attached. The caveats are in the body copy rather than in small
 * print under the button, because a reader who finds out afterwards that it
 * cannot see their disk has been sold something. Stating it here costs a few
 * downloads and keeps the page's one real asset, which is that it does not
 * oversell.
 */
function Download() {
  const { t } = useTranslation();

  return (
    <div className="px-5 pb-16 md:px-13 md:pb-24">
      <div className="rounded-card bg-surface px-6 py-10 shadow-card md:px-12 md:py-14 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 xl:gap-20">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-label text-accent">07</span>
            <span aria-hidden="true" className="h-px w-12 bg-accent" />
          </div>
          <h2 className="mb-5 font-display text-section text-ink-strong text-balance md:text-display">
            {t('dj.download.heading')}
          </h2>
          <p className="max-w-[52ch] text-note text-ink-body text-pretty md:text-body-sm">
            <span className="lg:hidden">{t('dj.download.bodyShort')}</span>
            <span className="hidden lg:inline">{t('dj.download.body')}</span>
          </p>
          <div className="mt-8 flex md:mt-10">
            <DownloadButton />
          </div>
        </div>

        <SpecSheet />
      </div>
    </div>
  );
}

/**
 * Six facts about the file, on the canvas rather than on the card, so it reads
 * as something cut out of the page rather than a second card floating in the
 * first.
 *
 * A `dl` because that is what it is — six terms and their definitions — and
 * because the labels are then announced with their values rather than as a
 * loose column of nouns. The rules are on the rows, not between them, so the
 * sheet keeps its shape when Italian's longer labels wrap.
 *
 * The values are checkable rather than asserted; `downloadSpec` records how.
 * `updates` is deliberately unflattering: a page that lists five good facts
 * and hides the sixth is doing the thing this page's whole argument is
 * against.
 */
function SpecSheet() {
  const { t } = useTranslation();

  return (
    <div className="mt-10 lg:mt-0">
      <div className="rounded-card border border-line-card bg-canvas px-5 py-5 md:px-6 md:py-6">
        <h3 className="mb-4 font-mono text-label uppercase tracking-[0.14em] text-ink-muted md:mb-5">
          {t('dj.download.spec.heading')}
        </h3>
        <dl className="text-pretty">
          {downloadSpec.map((row, index) => (
            <div
              key={row}
              className={cx(
                // Label over value on a phone: at 390px a 7.5rem label column
                // leaves the value about 20 characters, so "Qualsiasi computer
                // con un browser" broke into three lines beside a one-word
                // term. Side by side from `sm`, where the row fits.
                'flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-5',
                index > 0 && 'border-t border-line-card',
                index === 0 && 'pt-0',
                index === downloadSpec.length - 1 && 'pb-0',
              )}
            >
              <dt className="font-mono text-micro uppercase tracking-[0.12em] text-ink-muted sm:w-[7.5rem] sm:shrink-0">
                {t(`dj.download.spec.${row}.label`)}
              </dt>
              <dd className="min-w-0 font-mono text-meta text-ink-strong">
                {t(`dj.download.spec.${row}.value`)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/**
 * Foot of the page. A plain cross-route anchor, not `navigate`: the target is
 * a fragment on another route and `navigate`'s `scrollTo(0, 0)` would fight
 * the browser's own anchor handling. `projects.backLabel` is the site's
 * string, shared with `/seasonable` rather than duplicated into `dj.*`.
 */
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
