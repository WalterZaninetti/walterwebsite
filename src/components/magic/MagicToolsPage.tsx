import { useTranslation } from 'react-i18next';
import { magic } from '../../content/magic';
import { footerLegal } from '../../content/site';
import { navigate } from '../../lib/route';
import { cx } from '../ui/cx';
import { LanguageSwitch } from '../ui/LanguageSwitch';
import { Monogram } from '../ui/Monogram';
import { SkipLink } from '../ui/SkipLink';
import { DrawOdds } from './DrawOdds';
import { ManaPips } from './ManaPips';
import { ManaSources } from './ManaSources';
import { OpeningHands } from './OpeningHands';
import { FindingACard } from './FindingACard';
import { PlainEnglishSearch } from './PlainEnglishSearch';

/**
 * Magic Tools — its own visual world (parchment, Cinzel, MTG green) rather
 * than the site's Sage & Loam theme, which is the point the homepage makes
 * about each project keeping its own look. No dark variant: the doc draws
 * one look, so this page opts out of the site's theme switch entirely.
 */
export function MagicToolsPage() {
  return (
    <div className="min-h-screen bg-magic-parchment font-magic-body text-magic-ink">
      <div className="mx-auto max-w-[1240px] bg-magic-paper shadow-[0_0_0_1px_var(--color-magic-rule)]">
        <SkipLink className="bg-magic-ink text-magic-paper" />
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
        className="flex items-center gap-3.5 text-magic-ink no-underline"
      >
        <Monogram
          size={40}
          className="text-magic-green-deep"
          accentClassName="stroke-magic-green"
        />
        <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-magic-ink-muted">
          Walter <span className="text-magic-slash">/</span> {t('magic.crumbPage')}
        </span>
      </a>
      <div className="flex items-center gap-4 font-mono text-[10.5px] font-medium uppercase tracking-[0.13em] text-magic-ink-muted md:gap-[22px]">
        {magic.nav.map((item) => (
          <a
            key={item.key}
            href={item.href}
            className="hidden text-inherit no-underline transition-colors hover:text-magic-green-deep sm:inline"
          >
            {t(`magic.${item.key}`)}
          </a>
        ))}
        <LanguageSwitch
          activeClassName="text-magic-green-deep"
          idleClassName="text-magic-ink-muted hover:text-magic-green-deep"
        />
        <a
          href={magic.repoHref}
          className="rounded-pill border border-[#cfc3a1] px-3.5 py-2 text-magic-green-deep no-underline transition-colors hover:border-magic-green-deep hover:bg-magic-green-deep hover:text-magic-paper"
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
    <div
      id="top"
      className="relative overflow-hidden bg-magic-ink px-5 pt-12 pb-11 text-magic-cream md:px-10 md:pt-16 md:pb-14"
    >
      <div className="relative">
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
          className="mt-9 grid gap-x-0 gap-y-6 border-t border-magic-cream/25 pt-7 sm:grid-cols-2 lg:grid-cols-5 md:mt-11"
        >
          {jumps.map((item) => (
            <a
              key={item.index}
              href={item.href}
              // Dividers belong to whichever cells start a column, and that
              // changes with the breakpoint — so they key off nth-child, not the
              // array index. At two columns the odd items start a row; at five,
              // only the first does.
              className={cx(
                'text-magic-cream no-underline transition-colors hover:text-magic-green-light',
                'sm:[&:nth-child(even)]:border-l sm:[&:nth-child(even)]:border-magic-cream/20 sm:[&:nth-child(even)]:pl-5',
                'lg:[&:nth-child(n+2)]:border-l lg:[&:nth-child(n+2)]:border-magic-cream/20 lg:[&:nth-child(n+2)]:pl-6',
              )}
            >
              <p className="mb-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-magic-green-light">
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
    </div>
  );
}

function Footer() {
  const { t } = useTranslation();

  return (
    <div className="border-t border-magic-cream/18 bg-magic-ink px-5 pt-7 pb-8 text-magic-cream-dim md:px-10">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:flex-wrap md:gap-10">
        <div className="flex items-center gap-4">
          <Monogram
            size={34}
            className="text-magic-cream"
            accentClassName="stroke-magic-green-light"
          />
          <span aria-hidden="true" className="h-[26px] w-px bg-magic-cream/25" />
          <span className="font-mono text-[12px] text-magic-cream-faint">
            {t('magic.footer.meta')}
          </span>
        </div>
        <p className="font-magic-display text-[13px]/[1.2] font-medium tracking-[0.02em] text-magic-cream">
          {t('home.footer.credit')}
          <span className="text-magic-green-light">{t('home.footer.creditAccent')}</span>
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
