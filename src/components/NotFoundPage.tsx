import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { navigate } from '../lib/route';
import { Eyebrow } from './ui/Eyebrow';
import { LanguageSwitch } from './ui/LanguageSwitch';
import { Monogram } from './ui/Monogram';
import { SkipLink } from './ui/SkipLink';

/**
 * The 404 view.
 *
 * Hosting has already answered 200 with index.html by the time any of this runs — a static site
 * cannot send a 404 status — so the noindex tag below is what keeps wrong URLs out of a search
 * index. It is added from here rather than index.html precisely because it must apply to this
 * route and no other, and removed on unmount so a client-side navigation away doesn't leave the
 * homepage marked noindex.
 */
export function NotFoundPage() {
  const { t } = useTranslation();

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, follow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <SkipLink />
      <header className="border-b border-header-line bg-header-bg">
        <div className="flex items-center justify-between px-5 py-4 md:px-13 md:py-[18px]">
          <a
            href="/"
            onClick={navigate}
            aria-label="Walter"
            className="flex items-center text-header-ink no-underline"
          >
            <Monogram size={38} className="md:size-[42px]" />
          </a>
          <div className="flex items-center gap-5 font-mono text-nav font-medium uppercase">
            <LanguageSwitch
              activeClassName="text-header-ink"
              idleClassName="text-header-nav hover:text-header-ink"
            />
            <a
              href="/"
              onClick={navigate}
              className="text-header-nav no-underline transition-colors duration-150 hover:text-header-ink"
            >
              {t('notFound.backLabel')}
            </a>
          </div>
        </div>
      </header>

      <main id="main" className="px-5 pt-16 pb-20 md:px-13 md:pt-24 md:pb-28">
        <div className="max-w-[38em]">
          <Eyebrow className="mb-3 text-accent">{t('notFound.eyebrow')}</Eyebrow>
          <h1 className="mb-6 text-hero-sm font-display text-ink-strong md:mb-8 md:text-display">
            {t('notFound.title')}
          </h1>
          <p className="mb-10 text-lead text-ink-body text-pretty md:mb-12">{t('notFound.body')}</p>

          <nav aria-label={t('notFound.linksLabel')} className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              { href: '/', key: 'linkHome' },
              { href: '/magic-tools', key: 'linkMagic' },
              { href: '/privacy', key: 'linkLegal' },
            ].map(({ href, key }) => (
              <a
                key={href}
                href={href}
                onClick={navigate}
                className="font-mono text-nav font-medium uppercase text-accent underline-offset-4 transition-colors duration-150 hover:text-ink-strong hover:underline"
              >
                {t(`notFound.${key}`)}
              </a>
            ))}
          </nav>
        </div>
      </main>
    </div>
  );
}
