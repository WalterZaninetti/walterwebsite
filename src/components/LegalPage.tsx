import { legal } from '../content/legal';
import { navigate } from '../lib/route';
import { Eyebrow } from './ui/Eyebrow';
import { Monogram } from './ui/Monogram';

/**
 * The cookie & privacy notice. Both footer links land here — for a site that
 * sets no cookies and collects nothing, one honest page beats two documents
 * repeating each other.
 */
export function LegalPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px]">
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
          <a
            href="/"
            onClick={navigate}
            className="font-mono text-nav font-medium uppercase text-header-nav no-underline transition-colors duration-150 hover:text-header-ink"
          >
            {legal.backLabel}
          </a>
        </div>
      </header>

      <main className="px-5 pt-10 pb-16 md:px-13 md:pt-14 md:pb-20">
        <div className="max-w-[42em]">
          <Eyebrow className="mb-3 text-accent">{legal.updated}</Eyebrow>
          <h1 className="mb-6 text-hero-sm font-display text-ink-strong md:mb-8 md:text-display">
            {legal.title}
          </h1>
          <p className="mb-10 text-lead text-ink-body text-pretty md:mb-12">{legal.intro}</p>

          {legal.sections.map((section) => (
            <section key={section.heading} className="mb-9 md:mb-10">
              <h2 className="mb-3 text-section-sm font-display text-ink-strong">
                {section.heading}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mb-3 text-body text-ink-body text-pretty last:mb-0">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
