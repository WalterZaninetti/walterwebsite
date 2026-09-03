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
import type { Capability } from '../../content/djTools';
import { useMetaDescription } from '../../lib/meta';
import { navigate } from '../../lib/route';
import { useTheme } from '../../lib/theme-context';
import { AccentButton } from '../ui/Pill';
import { Eyebrow } from '../ui/Eyebrow';
import { LanguageSwitch } from '../ui/LanguageSwitch';
import { Monogram } from '../ui/Monogram';
import { SkipLink } from '../ui/SkipLink';
import { Tile } from '../ui/Tile';
import {
  ArrowLeftIcon,
  DiscIcon,
  DownloadIcon,
  MoonIcon,
  NoteIcon,
  ShelfIcon,
  SunIcon,
  WaveIcon,
} from '../ui/icons';
import { IconButton, ThemeSwitch } from '../SiteHeader';
import { SiteFooter } from '../SiteFooter';
import { cx } from '../ui/cx';

/**
 * Crate — `/dj-tools`. Left `ProjectPage` when the tool stopped being an idea
 * with a name and became a bounded capability set, the way `/magic-tools`
 * left it for being a larger kind of page.
 *
 * It keeps that shell's chrome *contract* rather than its component
 * (direction.md §8): breadcrumb header, exactly one full-bleed world block,
 * the 3px seam with the tile straddling it, section numerals in `--accent`
 * rather than the world, `62ch` prose, the site footer. What it adds is the
 * capability grid — six cells, two to a row from `lg` — because six
 * capabilities in a 62ch column would be six paragraphs stacked in the left
 * third of a desktop page, and one to a row left half the width empty.
 *
 * The world still stops at the seam. `--project-dj-mark` is a new on-canvas
 * token, not the band's accent leaking down onto the cream, which is the
 * failure the shared direction's §3.2 forbids. `--project-dj-wave` is the one
 * exception and it is authored against the band, where it is used.
 *
 * The page asked for nothing for as long as there was nothing to give. It
 * carried a `mailto:`-composing field set for part of an earlier run; that was
 * removed on the reasoning that a page about software which does not exist does
 * not get to ask for an address.
 *
 * That premise is now void: the software exists, so the page has one outward
 * link and it is a download rather than a request. It still asks for no
 * address, which is the same posture arrived at from the other side — there is
 * nothing to sign up for because there is nothing to be notified about.
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
    <div className="mx-auto w-full max-w-[1440px]">
      <SkipLink />
      <PageHeader />
      <main id="main">
        <Band />

        <OpeningCards />
        <Rack />
        <Download />

        <div className="bg-canvas px-5 pb-12 md:px-13 md:pb-16">
          <BackLink />
        </div>

        <SiteFooter />
      </main>
    </div>
  );
}

/**
 * The one thing the page asks the reader to do, and the first time it has ever
 * had one. It sits after the rack because the capabilities are the argument and
 * this is the conclusion; a download button above them would be asking before
 * the case has been made.
 *
 * The caveats are in the body copy rather than in small print under the button,
 * because a reader who finds out afterwards that it cannot see their disk has
 * been sold something. Stating it here costs a few downloads and keeps the
 * page's one real asset, which is that it does not oversell.
 */
function Download() {
  const { t } = useTranslation();

  return (
    <div className="bg-canvas px-5 pb-16 md:px-13 md:pb-20">
      {/* Two columns from `lg`. The prose column is the same 62ch it has always
          been, so at 1440 the card used to be a paragraph in its left half and
          nothing in its right — the spec sheet is what that half is for. Below
          `lg` the sheet stacks under the button, where it reads as the small
          print it partly replaces. */}
      <div className="rounded-card border border-line-card bg-surface px-6 py-8 md:px-10 md:py-10 lg:grid lg:grid-cols-[minmax(0,62ch)_minmax(0,1fr)] lg:gap-x-16 xl:gap-x-24">
        <div>
          <div className="mb-3 flex items-center gap-3 md:mb-4">
            <span className="font-mono text-label text-accent">07</span>
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
          </div>
          <h2 className="mb-3 font-display text-section-sm text-ink-strong text-balance md:mb-4">
            {t('dj.download.heading')}
          </h2>
          <p className="text-note text-ink-body text-pretty">
            <span className="lg:hidden">{t('dj.download.bodyShort')}</span>
            <span className="hidden lg:inline">{t('dj.download.body')}</span>
          </p>
          <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
          {/* `/crate`, not `/crate.html`: hosting has cleanUrls on, so the
              .html path 301s here anyway. The `download` attribute names the
              saved file, so the URL not carrying the extension costs nothing —
              and a plain anchor with no click handler keeps the in-app router
              out of it.

              The page's one CTA, so it is sized like one: a 52px target with
              the site's own button padding, the glyph carrying the verb the
              label already says, and the rust's own cast under it (--shadow-cta)
              lifting a pixel on hover. Full width below `sm`, where a pill
              floating in a wide card reads as an afterthought. */}
            <AccentButton
              href="/crate"
              download="crate.html"
              tone="ocean"
              className="group flex h-13 w-full items-center justify-center gap-2.5 px-7 text-[13.5px] shadow-cta hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto"
            >
              <DownloadIcon className="size-[1.15em] shrink-0 transition-transform duration-150 group-hover:translate-y-0.5" />
              {t('dj.download.cta')}
            </AccentButton>
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
 * `ProjectPage`'s `ProjectHeader` and `MagicToolsPage`'s `Header` in the same
 * shape, so all three project pages share one breadcrumb. Reuses
 * `SiteHeader`'s own `ThemeSwitch` / `IconButton` rather than a third copy of
 * the same pill.
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
            Walter <span aria-hidden="true">/</span> {t('dj.title')}
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
 * The one full-bleed world block and the 3px seam under it — the same six
 * tokens the homepage's shelf card uses, in the same order, so a reader who
 * clicked the card lands on the same object made large.
 *
 * The H1 goes one step past `ProjectPage`'s at `lg` (direction.md §2): "Crate"
 * is five characters, and `--text-hero` had never been used off the homepage
 * because no project had a name short enough to carry it. It is a proper noun,
 * so it is also the one string on the page that does not expand in Italian.
 */
function Band() {
  const { t } = useTranslation();

  return (
    <>
      <div className="border-t border-project-dj-border bg-project-dj px-5 pt-12 pb-8 text-project-dj-fg md:px-10 md:pt-16 md:pb-10">
        <Eyebrow className="mb-3 tracking-[0.16em] text-project-dj-accent md:tracking-[0.18em]">
          <span className="md:hidden">{t('dj.eyebrowShort')}</span>
          <span className="hidden md:inline">{t('dj.eyebrow')}</span>
        </Eyebrow>
        <h1 className="mb-[18px] font-sans text-title font-semibold tracking-[-0.025em] text-balance text-project-dj-fg md:mb-5 md:text-hero-sm lg:text-hero">
          {t('dj.title')}
        </h1>
        <p className="max-w-[52ch] text-lead text-project-dj-body text-pretty">
          <span className="lg:hidden">{t('dj.deckShort')}</span>
          <span className="hidden lg:inline">{t('dj.deck')}</span>
        </p>

        <HeroWave />
      </div>
      <div className="relative">
        <span aria-hidden="true" className="block h-[3px] bg-project-dj-seam" />
        {/* The tile used to keep the site's clover — one green sticker across
            all three shelf cards was what tied the worlds together, and this
            page overriding it would have made it the only one whose stamp
            matched its own band.

            It now takes the world's blue anyway. The argument held right up
            until you looked at this page alone: the green was the one mark on
            it that belonged to no world, and the shelf card is where the
            three-stickers-alike reading happens, not here. Not the band's
            amber either — that is the rung this page lights figures with, and
            a sticker in it would compete with them. */}
        <Tile icon={DiscIcon} tone={djTile} className="absolute top-1/2 left-5 -translate-y-1/2 md:left-10" />
      </div>
    </>
  );
}

/**
 * The hero figure — the BPM distribution mirrored around a centre line and run
 * the full width of the band. It reads as a set rather than as a chart, which
 * is the point: this is the one place on the page where the subject is allowed
 * to look like the thing it is for.
 *
 * It is not an audio waveform and must not become one. The page says two
 * screens down that it doesn't analyse your audio, and the labelled tempi are
 * what keep this legible as a distribution — they are the honest work the
 * shape alone would not do.
 *
 * `aria-hidden`, like every figure here: `dj.does.overview.body` states the
 * pile and the hole in words.
 */
function HeroWave() {
  return (
    <div aria-hidden="true" className="mt-9 md:mt-12">
      <div className="flex h-[84px] items-center gap-[2px] md:h-[124px] md:gap-[3px]">
        {heroWave.map((height, index) => (
          <span
            key={index}
            style={{ height: `${height}%` }}
            className={cx(
              'min-h-[2px] flex-1 rounded-[1px]',
              height >= heroWaveLitFrom ? 'bg-project-dj-accent' : 'bg-project-dj-wave',
            )}
          />
        ))}
      </div>
      <div className="relative mt-2.5 h-3">
        {heroWaveTicks.map((tick) => (
          <span
            key={tick.label}
            style={{ left: `${((tick.at + 0.5) / heroWave.length) * 100}%` }}
            className="absolute -translate-x-1/2 font-mono text-micro/none text-project-dj-body"
          >
            {tick.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * The opening — three cards in a row from `lg`, one per argument: the problem,
 * the mechanism, the honest status. They replace what were three stacked prose
 * sections in a 62ch column, which used a third of the page and made the
 * reader scroll past the whole case to reach the capabilities.
 *
 * The icon treatment is the homepage's: a `Tile` punched over the card's top
 * edge, in the site's clover rather than the world's amber, exactly as the
 * three shelf cards do it.
 */
const cardIcons = { shelf: ShelfIcon, wave: WaveIcon, note: NoteIcon };

/**
 * All four stickers on the page, as one string. `Tile` takes fill, glyph and
 * ring together rather than layering them, so the override is one token group
 * — and the ring still resolves per scheme inside the token (cream in light,
 * transparent in dark), which is what keeps this component from branching.
 */
const djTile = 'bg-project-dj-tile text-project-dj-tile-fg ring-2 ring-project-dj-tile-ring';

function OpeningCards() {
  const { t } = useTranslation();

  return (
    <div className="bg-canvas px-5 pt-16 pb-12 md:px-13 md:pt-20 md:pb-16">
      <ul className="grid list-none gap-y-14 lg:grid-cols-3 lg:gap-x-8">
        {openingCards.map((card, index) => (
          <li
            key={card.id}
            className="relative rounded-card border border-line-card bg-surface px-6 pt-11 pb-7 md:px-7 md:pt-12 md:pb-8"
          >
            <Tile
              icon={cardIcons[card.icon]}
              tone={djTile}
              className="absolute -top-6 left-6 lg:-top-7 md:left-7"
            />
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <span className="font-mono text-label text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
            </div>
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
 * The capability grid, two to a row from `lg`. It carries a heading and a
 * numeral in the opening cards' own idiom, but no lead paragraph — the lead
 * was the redundant part, and the six cells introduce themselves.
 *
 * Capability titles take the DJ world's own face (`titleFace.dj` is `sans`)
 * while the card headings above stay the site's serif. Two voices, and the
 * grid is the page's.
 */
function Rack() {
  const { t } = useTranslation();

  return (
    <div className="bg-canvas px-5 pb-12 md:px-13 md:pb-16">
      <section>
        <div className="mb-4 flex items-center gap-3 md:mb-5">
          <span className="font-mono text-label text-accent">04</span>
          <span aria-hidden="true" className="h-px w-8 bg-accent" />
        </div>
        <h2 className="mb-9 font-display text-section-sm text-ink-strong md:mb-11 md:text-section">
          {t('dj.does.heading')}
        </h2>

        <ul className="list-none lg:grid lg:grid-cols-2 lg:gap-x-14">
          {capabilities.map((capability, index) => (
            <Cell key={capability.id} capability={capability} index={index} />
          ))}
        </ul>
      </section>
    </div>
  );
}

function Cell({ capability, index }: { capability: Capability; index: number }) {
  const { t } = useTranslation();

  return (
    <li
      className={cx(
        'py-7 md:py-8 lg:py-10',
        // One column below `lg`, so every cell but the first takes a rule. Two
        // columns at `lg`, where the first *two* open the grid and the rule has
        // to skip both — otherwise the second cell wears a line with nothing
        // above it.
        index > 0 && 'border-t border-line-card',
        index === 1 && 'lg:border-t-0',
      )}
    >
      <div className="mb-3 flex items-baseline gap-3 md:mb-4">
        <span className="font-mono text-label text-accent">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="font-sans text-lead font-semibold tracking-[-0.02em] text-ink-strong text-balance md:text-title-sm">
          {t(`dj.does.${capability.id}.title`)}
        </h3>
      </div>

      <p className="max-w-[58ch] text-note text-ink-body text-pretty md:text-body-sm">
        {t(`dj.does.${capability.id}.body`)}
      </p>

      {capability.caveat && (
        <div className="mt-5 max-w-[58ch] border-l-2 border-accent pl-4 text-note-sm text-ink-muted md:mt-6">
          {t(`dj.does.${capability.id}.caveat`)}
        </div>
      )}

      {capability.well && (
        <div className="mt-7 max-w-[340px]">
          <Well figure={capability.well} />
          {capability.caption && (
            <p className="mt-3 font-mono text-micro text-ink-muted">
              {t(`dj.figures.${capability.caption}`)}
            </p>
          )}
        </div>
      )}
    </li>
  );
}

/**
 * Every well is a CSS drawing of a sentence the copy already wrote, never a
 * mockup of software that does not exist. All four are `aria-hidden`, the way
 * `ManaPips` handles a decorative diagram — the facts are in the adjacent
 * prose, so a screen-reader user loses nothing and gains no duplicate.
 *
 * Meaning is never carried by colour alone: the histogram reads as bar height,
 * the ladder as row order, the stack as position, the severity bars as length.
 * That is why lit-against-quiet measuring 2.44:1 is not a defect — each mark
 * clears 3:1 against the canvas it sits on, which is what 1.4.11 asks.
 */
function Well({ figure }: { figure: NonNullable<Capability['well']> }) {
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
    <div aria-hidden="true" className="flex flex-col gap-2.5 font-mono text-micro">
      <div className="flex items-center gap-3">
        <span className="rounded-chip border border-project-dj-mark-quiet px-3 py-1.5 text-ink-body">
          collection.xml
        </span>
        <span className="h-px flex-1 bg-project-dj-mark" />
        <Caret dir="right" className="border-l-project-dj-mark" />
        <span className="rounded-chip bg-project-dj-mark px-3 py-1.5 text-canvas">Crate</span>
      </div>
      <div className="flex items-center gap-3 opacity-60">
        <span className="rounded-chip px-3 py-1.5 text-ink-muted">collection.xml</span>
        <span className="relative h-px flex-1 bg-ink-muted">
          <span className="absolute top-1/2 left-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
          <span className="absolute top-1/2 left-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-accent" />
        </span>
        <Caret dir="left" className="border-r-ink-muted" />
        <span className="rounded-chip px-3 py-1.5 text-ink-muted">Crate</span>
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
 * `handoff`'s figure: the pool leaves as a playlist and lands back where the
 * work happens. Same reasoning as `OneWay` — the closing argument is a claim
 * about where the tool stops, so the drawing is that boundary.
 */
function HandBack() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-2 font-mono text-micro">
      {['filter', 'shortlist', 'Rekordbox'].map((step, index) => (
        <div key={step} className="flex items-center gap-3">
          <span
            className={cx(
              'rounded-chip px-3 py-1.5',
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

function FilterStack() {
  return (
    // `w-max` sizes the column to its widest chip, so the six read as a stack of
    // equal-width conditions rather than as six full-width fields — and the rule
    // and result bar below inherit that width instead of spanning the well.
    <div aria-hidden="true" className="flex w-max max-w-full flex-col gap-1.5">
      {filterChips.map((chip, index) => (
        <span
          key={chip}
          className={cx(
            'rounded-chip px-3 py-1.5 font-mono text-micro',
            index === litFilterChip
              ? 'bg-project-dj-mark text-canvas'
              : 'border border-project-dj-mark-quiet text-ink-body',
          )}
        >
          {chip}
        </span>
      ))}
      <span className="mt-1.5 h-px w-full bg-accent" />
      <span className="h-2 w-1/2 rounded-pill bg-project-dj-mark" />
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
    <div aria-hidden="true" className="flex flex-col gap-1.5">
      {severityBars.map((width, index) => (
        <span
          key={index}
          className={cx(
            'h-2 rounded-pill',
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
      <div className="flex h-[104px] items-end gap-[3px]">
        {bpmHistogram.map((bucket) => (
          <span
            key={bucket.bpm}
            className={cx(
              'min-h-[2px] flex-1 rounded-t-[2px]',
              'lit' in bucket && bucket.lit ? 'bg-project-dj-mark' : 'bg-project-dj-mark-quiet',
            )}
            style={{ height: `${bucket.h}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between font-mono text-micro text-project-dj-mark">
        <span>122</span>
        <span>128</span>
      </div>
    </div>
  );
}

/**
 * Foot of the reading column. A plain cross-route anchor, not `navigate`: the
 * target is a fragment on another route and `navigate`'s `scrollTo(0, 0)`
 * would fight the browser's own anchor handling. `projects.backLabel` is the
 * site's string, shared with `/seasonable` rather than duplicated into `dj.*`.
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

/**
 * The Camelot wheel — the existing `camelot` utility as the ring's fill, with
 * twelve `1A…12A` labels around it and three lit: `8A` and its two numeric
 * neighbours, the adjacency rule the copy states.
 *
 * It used to sit in the band. It belongs here, beside the copy that is actually
 * about Camelot, and the band got the wave instead. The pitch ladder runs under
 * it because `dj.does.harmonic.body` makes both claims in one paragraph.
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
    <div className="flex flex-col gap-7">
      <div aria-hidden="true" className="relative grid size-[212px] place-items-center">
        {/* The ring is its own element now, smaller than the box, so the labels
            sit outside it on the canvas. They used to ride the gradient, which
            runs from a deep blue through a pale one into amber — no single
            label colour is legible across all three, and the pale arc was where
            it failed. Outside the ring they are ordinary ink on cream. */}
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
      <PitchLadder />
    </div>
  );
}
