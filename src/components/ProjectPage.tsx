import { useEffect } from 'react';
import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import type { Project } from '../content/site';
import { projects } from '../content/site';
import { projectLocaleNamespace, projectPages } from '../content/projectPages';
import type { ProjectPageId } from '../content/projectPages';
import { navigate } from '../lib/route';
import { useTheme } from '../lib/theme-context';
import { Eyebrow } from './ui/Eyebrow';
import { LanguageSwitch } from './ui/LanguageSwitch';
import { Monogram } from './ui/Monogram';
import { SkipLink } from './ui/SkipLink';
import { Tile } from './ui/Tile';
import { DiscIcon, LeafIcon, MoonIcon, SunIcon } from './ui/icons';
import { IconButton, ThemeSwitch } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { cx } from './ui/cx';

/**
 * The shared shell for `/dj-tools` and `/seasonable` — direction.md §3: "the
 * world is a band, not a ground." The site's own canvas, header, footer and
 * reading column stay put; each project gets exactly one full-bleed block in
 * its own world (the shelf card, grown), a 3px solid rule as the seam
 * between world and site, and then three plain-canvas sections. Below the
 * seam nothing here reads `--project-*` again — the section numerals are
 * `--accent` rust, not the world, which is the single decision that keeps
 * three pages reading as one site (§3.3).
 *
 * `/magic-tools` satisfies this shell's chrome *contract* (breadcrumb header,
 * one full-bleed world block, a footer credit line) without adopting this
 * component — it is a fourth, larger kind of page by gate A's own ruling
 * (§3.6), so it keeps `MagicToolsPage.tsx`.
 */

const SECTION_KEYS = ['s1', 's2', 's3'] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

/** Both pages carry the honest-hard-part caveat in section 2, and only there — copy.md assumption 2. */
const SECTION_HAS_CAVEAT: Record<SectionKey, boolean> = { s1: false, s2: true, s3: false };

/** One step up from the shelf card's own map (`ProjectShelf.tsx`) — same three faces, the site's ceiling of six. */
const titleFaceBand: Record<Project['titleFace'], string> = {
  editorial: 'font-editorial italic',
  sans: 'font-sans font-semibold tracking-[-0.025em]',
  display: 'font-display',
};

/**
 * The six card tokens, scaled to a full-bleed band (direction.md §3.1/§3.4).
 * `shadow-lift-*` is deliberately absent — a shadow on a full-bleed band is
 * a shadow on nothing. `border-t` carries the world's `-border` token: at
 * band scale in dark it is the only thing separating the band from the
 * header bar above it, so it is structural here, not decorative.
 */
const worldTheme: Record<
  ProjectPageId,
  {
    band: string;
    seam: string;
    eyebrow: string;
    title: string;
    deck: string;
    tile: ComponentType<{ className?: string }>;
  }
> = {
  dj: {
    band: 'bg-project-dj text-project-dj-fg border-t border-project-dj-border',
    seam: 'bg-project-dj-seam',
    eyebrow: 'text-project-dj-accent',
    title: 'text-project-dj-fg',
    deck: 'text-project-dj-body',
    tile: DiscIcon,
  },
  food: {
    band: 'bg-project-food text-project-food-fg border-t border-project-food-border',
    seam: 'bg-project-food-seam',
    eyebrow: 'text-project-food-accent',
    title: 'text-project-food-fg',
    deck: 'text-project-food-body',
    tile: LeafIcon,
  },
};

export function ProjectPage({ projectId }: { projectId: ProjectPageId }) {
  const { t } = useTranslation();
  const project = projects.find((candidate) => candidate.id === projectId) as Project;
  const ns = projectLocaleNamespace[projectId];

  useMetaDescription(t(`projects.${ns}.metaDescription`));

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <SkipLink />
      <ProjectHeader title={t(`projects.${ns}.title`)} />
      <main id="main">
        <Band project={project} projectId={projectId} ns={ns} />

        <div className="bg-canvas px-5 py-12 md:px-13 md:py-16">
          <div className="max-w-[62ch]">
            <Sections ns={ns} />
            <BackLink />
          </div>
        </div>

        <SiteFooter />
      </main>
    </div>
  );
}

/**
 * Sets the client-side `<meta name="description">` while this page is
 * mounted and restores whatever `index.html` shipped on unmount. copy.md's
 * "Unresolved #3" flags that this cannot reach social scrapers (no JS) —
 * true, and accepted, per the same note: the strings are written and
 * measured, and Google's renderer (which does run JS) still benefits.
 * Follows `NotFoundPage.tsx`'s precedent of a direct, cleaned-up
 * `document.head` edit rather than inventing a second mechanism.
 */
function useMetaDescription(description: string) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]');
    if (!meta) return;
    const original = meta.getAttribute('content');
    meta.setAttribute('content', description);
    return () => {
      if (original !== null) meta.setAttribute('content', original);
    };
  }, [description]);
}

/**
 * The pattern `/magic-tools` already uses (`MagicToolsPage.tsx`'s `Header`),
 * carried over so all three project pages share one breadcrumb shape — the
 * family resemblance direction.md §3.6 asks for. Reuses `SiteHeader`'s own
 * `ThemeSwitch` / `IconButton` rather than a second copy of the same pill.
 */
function ProjectHeader({ title }: { title: string }) {
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
            Walter <span aria-hidden="true">/</span> {title}
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
 * The one full-bleed world block, and the 3px seam directly under it. At
 * `md`+ the figure sits right of the text (direction.md §3.5's 768
 * treatment); below that it stacks text-then-figure so the H1 stays inside
 * the fold at 320.
 */
function Band({
  project,
  projectId,
  ns,
}: {
  project: Project;
  projectId: ProjectPageId;
  ns: 'dj' | 'seasonable';
}) {
  const { t } = useTranslation();
  const theme = worldTheme[projectId];
  const figure = projectPages[projectId].figure;

  return (
    <>
      <div className={cx('px-5 pt-12 pb-11 md:px-10 md:pt-16 md:pb-14', theme.band)}>
        <div className="md:grid md:grid-cols-[1fr_280px] md:items-center md:gap-10">
          <div>
            <Eyebrow className={cx('mb-3 tracking-[0.16em] md:tracking-[0.18em]', theme.eyebrow)}>
              <span className="md:hidden">{t(`home.projects.${project.id}.eyebrowShort`)}</span>
              <span className="hidden md:inline">{t(`home.projects.${project.id}.eyebrow`)}</span>
            </Eyebrow>
            <h1
              className={cx(
                'mb-[18px] text-title text-balance md:mb-5 md:text-hero-sm',
                titleFaceBand[project.titleFace],
                theme.title,
              )}
            >
              {t(`projects.${ns}.title`)}
            </h1>
            <p className={cx('max-w-[46ch] text-lead text-pretty', theme.deck)}>
              <span className="lg:hidden">{t(`projects.${ns}.deckShort`)}</span>
              <span className="hidden lg:inline">{t(`projects.${ns}.deck`)}</span>
            </p>
          </div>
          <div className="mt-8 md:mt-0">
            {figure === 'camelot' ? <CamelotFigure /> : <MonthStrip />}
          </div>
        </div>
      </div>
      {/*
        The tile straddles the seam, left-aligned with the band's own
        reading column (direction.md §3.2 — gate C leaves this placement
        standing). The seam wrapper is `relative` and unbounded so the
        48/56px tile is never clipped by the 3px rule it centres on.
      */}
      <div className="relative">
        <span aria-hidden="true" className={cx('block h-[3px]', theme.seam)} />
        <Tile
          icon={theme.tile}
          className="absolute top-1/2 left-5 -translate-y-1/2 md:left-10"
        />
      </div>
    </>
  );
}

/**
 * The three plain-canvas sections. Section numerals are `--accent` rust,
 * never the world — direction.md §3.3's load-bearing decision. Section 2
 * carries the honest-hard-part caveat, indented behind a 2px accent rule;
 * section 3 ("Where it actually is") gets no special treatment on purpose
 * (direction.md §7) — a boxed status panel would turn an admission into a
 * badge, which is the thing this run removes from the homepage.
 */
function Sections({ ns }: { ns: 'dj' | 'seasonable' }) {
  const { t } = useTranslation();

  return (
    <>
      {SECTION_KEYS.map((key, index) => (
        <section key={key} className="mb-10 md:mb-12">
          <div className="mb-4 flex items-center gap-3 md:mb-5">
            <span className="font-mono text-label text-accent">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
          </div>
          <h2 className="mb-3 font-display text-section-sm text-ink-strong md:mb-4 md:text-section">
            {t(`projects.${ns}.${key}.heading`)}
          </h2>
          <p className="text-note text-ink-body text-pretty md:text-body">
            <span className="lg:hidden">{t(`projects.${ns}.${key}.bodyShort`)}</span>
            <span className="hidden lg:inline">{t(`projects.${ns}.${key}.body`)}</span>
          </p>
          {SECTION_HAS_CAVEAT[key] && (
            <div className="mt-5 border-l-2 border-accent pl-4 text-note-sm text-ink-muted md:mt-6">
              <span className="lg:hidden">{t(`projects.${ns}.${key}.caveatShort`)}</span>
              <span className="hidden lg:inline">{t(`projects.${ns}.${key}.caveat`)}</span>
            </div>
          )}
        </section>
      ))}
    </>
  );
}

/**
 * Foot of the reading column, above the footer — copy.md's `projects.backLabel`,
 * "not in the header, where it would compete with the content." A plain
 * cross-route anchor, not `navigate`: the target is a fragment on a
 * different route (`/#projects`), and `navigate`'s `window.scrollTo(0, 0)`
 * would fight the browser's own anchor scroll. A full navigation here is
 * the correct, simplest behaviour for a foot-of-page link.
 */
function BackLink() {
  const { t } = useTranslation();
  return (
    <a
      href="/#projects"
      className="inline-block font-mono text-meta text-ink-muted no-underline transition-colors duration-150 hover:text-accent"
    >
      {t('projects.backLabel')}
    </a>
  );
}

/**
 * `/dj-tools`'s figure — direction.md §5.2. The existing `camelot` utility
 * (`theme.css:606`) is the ring's fill; twelve `1A…12A` mono labels sit
 * around it, three lit — `8A` and its two numeric neighbours, the adjacency
 * rule `copy.md` states explicitly ("8A ↔ 7A, 9A, 8B"). The wheel this
 * figure draws carries only the `…A` ring, so `8B` (the relative-mode
 * neighbour) has nowhere to render without a second ring the direction's own
 * 280px/no-new-@utility constraints don't allow for — the fact still reaches
 * the reader because `s2.body` states it in full, and this figure is
 * `aria-hidden`. See build.md for the full reasoning.
 */
const CAMELOT_LABELS = Array.from({ length: 12 }, (_, i) => `${i + 1}A`);
const CAMELOT_LIT = new Set(['7A', '8A', '9A']);

function CamelotFigure() {
  const radius = 88;
  return (
    <div
      aria-hidden="true"
      className="camelot relative mx-auto grid size-[210px] place-items-center rounded-full"
    >
      <div className="size-[112px] rounded-full bg-project-dj" />
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
              lit ? 'font-semibold text-project-dj-fg' : 'text-project-dj-body',
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
 * `/seasonable`'s figure — direction.md §5.2. Twelve mono month initials in
 * a `grid-cols-12`, language-specific (`copy.md` gives both alphabets). The
 * initials sit directly on the band's rust ground using the world's opaque
 * text tokens (safe contrast); the accent/hatch tokens colour a small bar
 * under each initial rather than a fill behind the letter, since
 * `--project-food-accent` at its authored alpha reads as a light wash once
 * composited and would fail as a background for the world's cream text.
 */
const MONTH_INITIALS: Record<'en' | 'it', readonly string[]> = {
  en: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  it: ['G', 'F', 'M', 'A', 'M', 'G', 'L', 'A', 'S', 'O', 'N', 'D'],
};
/** April–June: real Italian strawberry season, the fact `s1.heading` names. */
const LIT_MONTHS = new Set([3, 4, 5]);

function MonthStrip() {
  const { i18n } = useTranslation();
  const locale = i18n.resolvedLanguage === 'it' ? 'it' : 'en';
  const initials = MONTH_INITIALS[locale];

  return (
    <div aria-hidden="true" className="mx-auto max-w-[220px]">
      <div className="grid grid-cols-12 gap-1">
        {initials.map((initial, index) => {
          const lit = LIT_MONTHS.has(index);
          return (
            <div key={index} className="flex flex-col items-center gap-1.5">
              <span
                className={cx(
                  'font-mono text-label',
                  lit ? 'text-project-food-fg' : 'text-project-food-body',
                )}
              >
                {initial}
              </span>
              <span
                className={cx(
                  'h-[3px] w-full rounded-full',
                  lit ? 'bg-project-food-accent' : 'bg-project-food-hatch',
                )}
              />
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center font-mono text-micro text-project-food-meta">
        {locale === 'it' ? 'fragole' : 'strawberries'}
      </p>
    </div>
  );
}
