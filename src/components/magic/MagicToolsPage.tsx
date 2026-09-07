import { useTranslation } from 'react-i18next';
import { magic } from '../../content/magic';
import { footerLegal } from '../../content/site';
import { navigate } from '../../lib/route';
import { cx } from '../ui/cx';
import { LanguageSwitch } from '../ui/LanguageSwitch';
import { SkipLink } from '../ui/SkipLink';
import { ArrowUpRightIcon } from '../ui/icons';
import { DrawOdds } from './DrawOdds';
import { ManaSources } from './ManaSources';
import { OpeningHands } from './OpeningHands';
import { FindingACard } from './FindingACard';
import { PlainWordsSearch } from './PlainWordsSearch';

/**
 * Magic Tools — its own visual world, which is the point the homepage makes
 * about each project keeping its own look. A broadsheet: one sheet, one
 * serif at every size, no cards and no panels, and cyan kept for the rules
 * an editor would draw over a printed chart.
 *
 * The search comes first now. It is the tool with the lowest cost of entry —
 * a sentence, no numbers to set — and the four calculators behind it are
 * variations on one question, so leading with the odds meant opening on the
 * page's hardest column.
 */
export function MagicToolsPage() {
  return (
    <div className="min-h-screen bg-magic-paper font-magic text-magic-ink antialiased">
      <SkipLink className="bg-magic-accent-fill text-magic-accent-fill-fg" />
      <Header />
      <main id="main">
        <Hero />
        <PlainWordsSearch />
        <DrawOdds />
        <ManaSources />
        <OpeningHands />
        <FindingACard />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-20 bg-magic-paper">
      <div className="mx-auto flex max-w-magic flex-wrap items-baseline gap-x-6.5 gap-y-3 px-5 py-4 md:px-8">
        <a
          href="/"
          onClick={navigate}
          className="text-magic-body font-semibold tracking-wider text-magic-ink no-underline"
        >
          Walter{' '}
          <span className="font-normal italic text-magic-ink-muted">
            · {t('magic.crumbPage')}
          </span>
        </a>
        <nav aria-label={t('magic.hero.toolsLabel')} className="ml-auto flex flex-wrap gap-5">
          {magic.tools.map((tool, index) => (
            <a
              key={tool.key}
              href={tool.href}
              className={cx(
                'hidden text-magic-label no-underline transition-colors hover:text-magic-accent-deep lg:inline',
                index === 0 ? 'text-magic-accent-ink' : 'text-magic-ink-body',
              )}
            >
              {t(`magic.nav.${tool.key}`)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-5 text-magic-label text-magic-ink-body">
          <LanguageSwitch
            activeClassName="text-magic-accent-ink"
            idleClassName="text-magic-ink-muted hover:text-magic-accent-ink"
          />
          <a
            href={magic.repoHref}
            className="inline-flex shrink-0 items-center gap-1.5 text-magic-accent-ink no-underline transition-colors hover:text-magic-accent-deep"
          >
            {t('magic.repo')}
            <ArrowUpRightIcon className="size-[1em] shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const { t } = useTranslation();

  return (
    <div id="top" className="mx-auto max-w-magic px-5 md:px-8">
      <div className="pt-12 pb-5 md:pt-14">
        <p className="m-0 mb-6 text-magic-label/none uppercase tracking-magic-kicker text-magic-accent-ink">
          {t('magic.hero.kicker')}
        </p>
        <h1 className="mb-8 text-magic-hero font-bold">
          {t('magic.hero.title')}
        </h1>
        <p className="m-0 mb-4.5 max-w-[64ch] text-magic-deck text-pretty">
          {t('magic.hero.blurb')}
        </p>
        <p className="m-0 max-w-[64ch] text-magic-note italic text-magic-ink-muted text-pretty">
          {t('magic.hero.note')}
        </p>
      </div>

      {/*
        The index strip. The doc runs all five across one row at any width;
        below the large breakpoint that gives each tool 40-odd pixels, so it
        folds to two and then one column and keeps its column gap.
      */}
      <div className="grid gap-x-7 gap-y-8 pt-9 pb-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:pt-11">
        {magic.tools.map((tool, index) => (
          <a key={tool.key} href={tool.href} className="text-magic-ink no-underline">
            <span className="mb-2.5 block text-magic-label/none tracking-magic-kicker text-magic-accent-ink">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="mb-2 block text-magic-title font-semibold text-balance">
              {t(`magic.nav.${tool.key}`)}
            </span>
            <span className="block text-magic-body text-magic-ink-muted text-pretty">
              {t(`magic.hero.note_${tool.key}`)}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mx-auto max-w-magic px-5 pt-20 pb-16 md:px-8 md:pt-26 md:pb-19">
      <p className="m-0 mb-7 max-w-[20ch] text-magic-sign font-bold text-balance">
        {t('magic.footer.sign')}
      </p>
      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-4">
        <a
          href={magic.repoHref}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 rounded-magic border border-magic-accent-fill bg-magic-accent-fill px-4 py-2.5 text-magic-body leading-tight font-semibold text-magic-accent-fill-fg no-underline transition-colors hover:border-magic-accent-fill-hover hover:bg-magic-accent-fill-hover"
        >
          {t('magic.footer.source')}
          <ArrowUpRightIcon className="size-[1em] shrink-0" />
        </a>
        <a
          href={magic.translateRepoHref}
          target="_blank"
          rel="noopener"
          className="text-magic-body italic text-magic-ink-muted underline-offset-3 transition-colors hover:text-magic-accent-ink"
        >
          {t('magic.footer.meta')}
        </a>
      </div>
      <div className="mt-10 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-magic-rule pt-5 text-magic-label text-magic-ink-muted">
        {footerLegal.map((item) => (
          <a
            key={item.key}
            href={item.href}
            onClick={navigate}
            className="text-inherit no-underline transition-colors hover:text-magic-accent-ink"
          >
            {t(`home.footer.${item.key}`)}
          </a>
        ))}
        <span className="ml-auto">{t('home.footer.copyright')}</span>
      </div>
    </footer>
  );
}
