import { Hero } from './components/Hero';
import { LegalPage } from './components/LegalPage';
import { ProjectShelf } from './components/ProjectShelf';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { SupportSection } from './components/SupportSection';
import { NotFoundPage } from './components/NotFoundPage';
import { SkipLink } from './components/ui/SkipLink';
import { MagicToolsPage } from './components/magic/MagicToolsPage';
import { MusicSection } from './components/music/MusicSection';
import { useRoute } from './lib/route';
import { ThemeProvider } from './lib/theme';

export default function App() {
  const route = useRoute();

  // Magic Tools brings its own palette and has no dark variant, so it sits
  // outside the site's theme provider rather than fighting it.
  if (route === 'magic') return <MagicToolsPage />;

  if (route === 'legal') {
    return (
      <ThemeProvider>
        <LegalPage />
      </ThemeProvider>
    );
  }

  if (route === 'notfound') {
    return (
      <ThemeProvider>
        <NotFoundPage />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      {/*
        The doc is drawn at 1440. Past that the hero's .86fr/1.14fr split kept
        growing the panel and stranding the headline in the middle, so the page
        caps there and centres; wider screens show canvas gutters either side
        and everything inside renders exactly as designed. The sticky header is
        inside the cap so its bar lines up with the page rather than spanning
        the full screen.
      */}
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
    </ThemeProvider>
  );
}
