import { Hero } from './components/Hero';
import { LegalPage } from './components/LegalPage';
import { NowFooter } from './components/NowFooter';
import { ProjectShelf } from './components/ProjectShelf';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { SupportSection } from './components/SupportSection';
import { MusicSection } from './components/music/MusicSection';
import { useIsLegalPath } from './lib/route';
import { ThemeProvider } from './lib/theme';

export default function App() {
  const isLegal = useIsLegalPath();

  if (isLegal) {
    return (
      <ThemeProvider>
        <LegalPage />
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
        <SiteHeader />
        <main>
          <Hero />
          <ProjectShelf />
          <MusicSection />
          <SupportSection />
          <NowFooter />
          <SiteFooter />
        </main>
      </div>
    </ThemeProvider>
  );
}
