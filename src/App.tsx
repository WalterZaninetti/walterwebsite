import { Hero } from './components/Hero';
import { NowFooter } from './components/NowFooter';
import { ProjectShelf } from './components/ProjectShelf';
import { SiteHeader } from './components/SiteHeader';
import { SupportSection } from './components/SupportSection';
import { MusicSection } from './components/music/MusicSection';
import { ThemeProvider } from './lib/theme';

export default function App() {
  return (
    <ThemeProvider>
      <SiteHeader />
      <main>
        <Hero />
        <ProjectShelf />
        <MusicSection />
        <SupportSection />
        <NowFooter />
      </main>
    </ThemeProvider>
  );
}
