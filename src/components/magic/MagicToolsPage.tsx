import { useTranslation } from 'react-i18next';
import { magic } from '../../content/magic';
import { footerLegal } from '../../content/site';
import { navigate } from '../../lib/route';
import { cx } from '../ui/cx';
import { LanguageSwitch } from '../ui/LanguageSwitch';
import { Monogram } from '../ui/Monogram';
import { SkipLink } from '../ui/SkipLink';
import { Tile } from '../ui/Tile';
import { CardsIcon } from '../ui/icons';
import { DrawOdds } from './DrawOdds';
import { ManaPips } from './ManaPips';
import { ManaSources } from './ManaSources';
import { OpeningHands } from './OpeningHands';
import { FindingACard } from './FindingACard';
import { PlainEnglishSearch } from './PlainEnglishSearch';

/**
 * Magic Tools — its own visual world (parchment, Cinzel, and the ember ramp
 * that starts at this project's own red on the homepage shelf) rather than
 * the site's Sage & Loam theme, which is the point the homepage makes about
 * each project keeping its own look. No dark variant: the doc draws
 * one look, so this page opts out of the site's theme switch entirely.
 */
export function MagicToolsPage() {
  return (
    <div className="min-h-screen bg-magic-parchment font-magic-body text-magic-ink">
      <div className="mx-auto max-w-[1240px] bg-magic-paper shadow-[0_0_0_1px_var(--color-magic-rule)]">
        <SkipLink className="bg-magic-slab text-magic-cream" />
        <Header />
        {/* The page had no main landmark at all, so assistive tech had nothing to skip to. */}
        <main id="main">
          <Hero />
          <DrawOdds />
          <ManaSources />
          <OpeningHands />
          <FindingACard />
          <PlainEnglishSearch />
        </main>
        <Footer />
      </div>
    </div>
  );
}

function Header() {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-magic-rule bg-magic-header px-5 py-3.5 backdrop-blur-[8px] md:px-10">
      <a
        href="/"
        onClick={navigate}
        className="flex min-w-0 items-center gap-3.5 text-magic-ink no-underline"
      >
        <Monogram
          size={40}
          className="shrink-0 text-magic-ember-deep"
          accentClassName="stroke-magic-ember"
        />
        <span className="min-w-0 truncate font-mono text-label-wide uppercase tracking-[0.14em] text-magic-ink-muted">
          Walter <span className="text-magic-slash">/</span> {t('magic.crumbPage')}
        </span>
      </a>
      <div className="flex items-center gap-4 font-mono text-[10.5px] font-medium uppercase tracking-[0.13em] text-magic-ink-muted md:gap-[22px]">
        {magic.nav.map((item) => (
          <a
            key={item.key}
            href={item.href}
            className="hidden whitespace-nowrap text-inherit no-underline transition-colors hover:text-magic-ember-deep lg:inline"
          >
            {t(`magic.${item.key}`)}
          </a>
        ))}
        <LanguageSwitch
          activeClassName="text-magic-ember-deep"
          idleClassName="text-magic-ink-muted hover:text-magic-ember-deep"
        />
        <a
          href={magic.repoHref}
          className="shrink-0 rounded-pill border border-magic-field px-3.5 py-2 text-magic-ember-deep no-underline transition-colors hover:border-magic-ember-deep hover:bg-magic-ember-deep hover:text-magic-paper"
        >
          {t('magic.repo')}
        </a>
      </div>
    </div>
  );
}

function Hero() {
  const { t } = useTranslation();
  const jumps = [
    { index: '01', href: '#odds', title: t('magic.hero.jump1Title'), note: t('magic.hero.jump1Note') },
    { index: '02', href: '#mana', title: t('magic.mana.heading'), note: t('magic.hero.jump3Note') },
    { index: '03', href: '#hands', title: t('magic.hands.heading'), note: t('magic.hero.jump4Note') },
    { index: '04', href: '#finding', title: t('magic.finding.heading'), note: t('magic.hero.jump5Note') },
    { index: '05', href: '#search', title: t('magic.hero.jump2Title'), note: t('magic.hero.jump2Note') },
  ];

  return (
    // The tile straddles this box's bottom edge (direction.md §3.2), so the
    // overflow-hidden slab and the tile can't share a box: the slab keeps
    // its own clip for whatever it draws internally, and the tile sits on
    // this outer, unclipped wrapper as a sibling instead.
    <div id="top" className="relative">
      <div className="relative overflow-hidden bg-magic-slab px-5 pt-12 pb-11 text-magic-cream md:px-10 md:pt-16 md:pb-14">
        <div className="mb-6">
          <ManaPips />
        </div>
        <h1 className="mb-[18px] font-magic-display text-[40px]/[1.04] font-semibold tracking-[0.005em] text-balance md:text-[60px]">
          {t('magic.hero.title')}
        </h1>
        <p className="max-w-[32em] font-magic-body text-[17.5px]/[1.7] text-magic-cream-dim text-pretty">
          {t('magic.hero.blurb')}
        </p>

        {/*
          The doc drew two tools in a narrow column beside the headline. At five
          that column was taller than the headline it sat next to, so the index
          runs across underneath instead — one cell per tool, dividers between
          them, collapsing to two columns and then one as the row runs out of
          width.
        */}
        <nav
          aria-label={t('magic.hero.toolsLabel')}
          className="mt-9 grid gap-x-0 gap-y-6 border-t border-magic-cream/25 pt-7 sm:grid-cols-2 md:mt-11 md:grid-cols-3 lg:grid-cols-5"
        >
          {jumps.map((item) => (
            <a
              key={item.index}
              href={item.href}
              // Dividers belong to whichever cells start a column, and that
              // changes with the breakpoint — so they key off nth-child, not the
              // array index. At two columns the odd items start a row; at
              // three (768), every third; at five, only the first.
              className={cx(
                'text-magic-cream no-underline transition-colors hover:text-magic-ember-light',
                'sm:[&:nth-child(even)]:border-l sm:[&:nth-child(even)]:border-magic-cream/20 sm:[&:nth-child(even)]:pl-5',
                'md:[&:not(:nth-child(3n+1))]:border-l md:[&:not(:nth-child(3n+1))]:border-magic-cream/20',
                'md:[&:not(:nth-child(3n+1))]:pl-5',
                'lg:[&:nth-child(n+2)]:border-l lg:[&:nth-child(n+2)]:border-magic-cream/20 lg:[&:nth-child(n+2)]:pl-6',
              )}
            >
              <p className="mb-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-magic-ember-light">
                {item.index}
              </p>
              <p className="font-magic-body text-[20px]/[1.15] italic text-balance">{item.title}</p>
              <p className="mt-1.5 font-magic-body text-[12.5px]/[1.55] text-magic-cream-dimmer text-pretty">
                {item.note}
              </p>
            </a>
          ))}
        </nav>
      </div>
      {/*
        The one addition to this page (direction.md §3.2, §12 assumption 4):
        drawn in --magic-tile on --magic-tile-fg, no ring. The pair exists
        rather than reusing the ramp because the ramp lifts in dark and cream
        on a light salmon is 1.5:1; §1.4's ring logic still doesn't apply,
        since nothing on this page needs an edge against its own slab.
      */}
      <Tile
        icon={CardsIcon}
        tone="bg-magic-tile text-magic-tile-fg"
        className="absolute -bottom-6 left-5 md:left-10 lg:-bottom-7"
      />
    </div>
  );
}

function Footer() {
  const { t } = useTranslation();

  return (
    <div className="border-t border-magic-cream/18 bg-magic-slab px-5 pt-7 pb-8 text-magic-cream-dim md:px-10">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:flex-wrap md:gap-10">
        <div className="flex items-center gap-4">
          <Monogram
            size={34}
            className="text-magic-cream"
            accentClassName="stroke-magic-ember-light"
          />
          <span aria-hidden="true" className="h-[26px] w-px bg-magic-cream/25" />
          <a
            href={magic.translateRepoHref}
            target="_blank"
            rel="noopener"
            className="font-mono text-[12px] text-magic-cream-faint no-underline transition-colors hover:text-magic-cream"
          >
            {t('magic.footer.meta')}
          </a>
        </div>
        <p className="font-magic-display text-[13px]/[1.2] font-medium tracking-[0.02em] text-magic-cream">
          {t('home.footer.credit')}
          <span className="text-magic-ember-light">{t('home.footer.creditAccent')}</span>
        </p>
        <div className="flex items-center gap-5 font-mono text-[11.5px] text-magic-cream-faint">
          {footerLegal.map((item) => (
            <a
              key={item.key}
              href={item.href}
              onClick={navigate}
              className="text-inherit no-underline transition-colors hover:text-magic-cream"
            >
              {t(`home.footer.${item.key}`)}
            </a>
          ))}
          <span>{t('home.footer.copyright')}</span>
        </div>
      </div>
    </div>
  );
}
