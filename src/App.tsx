import { Component, Suspense, lazy } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Hero } from './components/Hero';
import { LegalPage } from './components/LegalPage';
import { ProjectPage } from './components/ProjectPage';
import { ProjectShelf } from './components/ProjectShelf';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { SupportSection } from './components/SupportSection';
import { NotFoundPage } from './components/NotFoundPage';
import { AccentButton } from './components/ui/Pill';
import { SkipLink } from './components/ui/SkipLink';
import { MusicSection } from './components/music/MusicSection';
import { useRoute } from './lib/route';
import { ThemeProvider } from './lib/theme';

const MagicToolsPage = lazy(() =>
  import('./components/magic/MagicToolsPage').then((m) => ({ default: m.MagicToolsPage })),
);

export default function App() {
  const route = useRoute();

  return (
    <ThemeProvider>
      {route === 'magic' && (
        <MagicChunkBoundary>
          <Suspense fallback={<MagicLoadingFallback />}>
            <MagicToolsPage />
          </Suspense>
        </MagicChunkBoundary>
      )}

      {route === 'legal' && <LegalPage />}
      {route === 'dj-tools' && <ProjectPage projectId="dj" />}
      {route === 'seasonable' && <ProjectPage projectId="food" />}
      {route === 'notfound' && <NotFoundPage />}

      {route === 'home' && (
        /*
          The doc is drawn at 1440. Past that the hero's .86fr/1.14fr split kept
          growing the panel and stranding the headline in the middle, so the page
          caps there and centres; wider screens show canvas gutters either side
          and everything inside renders exactly as designed. The sticky header is
          inside the cap so its bar lines up with the page rather than spanning
          the full screen.
        */
        <div className="mx-auto w-full max-w-[1440px]">
          <SkipLink />
          <SiteHeader />
          <main id="main">
            <Hero />
            <ProjectShelf />
            <MusicSection />
            <SupportSection />
            <SiteFooter />
          </main>
        </div>
      )}
    </ThemeProvider>
  );
}

/** `Suspense` fallback for the lazy `/magic-tools` chunk. Lives on `--canvas`,
 * not a magic token, because it renders before the magic chunk — and its
 * bundle — exists. `role="status"` sits on the wrapper so the region
 * announces once rather than per-node. */
function MagicLoadingFallback() {
  const { t } = useTranslation();
  return (
    <div role="status" className="grid min-h-[60vh] place-items-center bg-canvas">
      <p className="magic-loading-fade font-mono text-micro uppercase tracking-[0.18em] text-ink-muted">
        {t('common.loadingMagic')}
      </p>
    </div>
  );
}

/**
 * A blank page on a dropped chunk is the worst outcome a lazy route can
 * produce, so this catches it and offers the one real recovery: a reload.
 * Only a dynamic-import failure reaches here — the class boundary is the one
 * way React lets a render error be caught at all.
 */
class MagicChunkBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <MagicChunkError />;
    return this.props.children;
  }
}

function MagicChunkError() {
  const { t } = useTranslation();
  return (
    <div role="alert" className="px-5 py-16 md:px-13 md:py-24">
      <div className="mx-auto max-w-[62ch]">
        <h1 className="mb-5 text-display-sm font-display text-ink-strong md:text-display">
          {t('common.chunkErrorTitle')}
        </h1>
        <p className="mb-8 text-note text-ink-body text-pretty">
          <span className="md:hidden">{t('common.chunkErrorBodyShort')}</span>
          <span className="hidden md:inline">{t('common.chunkErrorBody')}</span>
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <AccentButton
            href="#"
            onClick={(event) => {
              event.preventDefault();
              window.location.reload();
            }}
            className="px-[26px] py-[13px] text-[13.5px]"
          >
            {t('common.chunkErrorAction')}
          </AccentButton>
          <a
            href="/"
            className="font-mono text-meta text-ink-muted underline-offset-2 transition-colors duration-150 hover:text-accent hover:underline"
          >
            {t('legal.backLabel')}
          </a>
        </div>
      </div>
    </div>
  );
}
