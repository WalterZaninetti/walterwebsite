import { useState } from 'react';
import { site } from '../content/site';
import { useTheme } from '../lib/theme-context';
import { Monogram } from './ui/Monogram';
import { cx } from './ui/cx';

/**
 * Sticky, blurred header. The doc specifies the desktop nav and the mobile
 * icon pair; the open state of the mobile menu was left for later, so this
 * uses a plain disclosure built from the same tokens rather than leaving the
 * ≡ button inert.
 */
export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <header className="sticky top-0 z-10 border-b border-header-line bg-header-bg backdrop-blur-[8px]">
      <div className="flex items-center justify-between px-5 py-4 md:px-13 md:py-[18px]">
        <a
          href="#top"
          aria-label={site.name}
          className="flex items-center gap-[9px] text-header-ink no-underline md:gap-[11px]"
        >
          <Monogram size={38} className="md:size-[42px]" />
        </a>

        {/* Desktop: inline nav + labelled theme switch */}
        <nav className="hidden items-center gap-[26px] font-mono text-nav font-medium uppercase text-header-nav md:flex">
          {site.nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="no-underline transition-colors duration-150 hover:text-header-ink"
            >
              {item.label}
            </a>
          ))}
          <ThemeSwitch onClick={toggle} next={nextTheme} />
        </nav>

        {/* Mobile: two 44px targets */}
        <div className="flex gap-2 md:hidden">
          <IconButton
            onClick={toggle}
            label={`Switch to ${nextTheme} theme`}
            glyph={theme === 'dark' ? '☀' : '☾'}
          />
          <IconButton
            onClick={() => setMenuOpen((open) => !open)}
            label={menuOpen ? 'Close menu' : 'Open menu'}
            glyph={menuOpen ? '×' : '≡'}
            expanded={menuOpen}
          />
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col border-t border-header-line px-5 pb-4 md:hidden">
          {site.nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-line py-4 font-mono text-nav font-medium uppercase text-header-nav no-underline last:border-b-0"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function ThemeSwitch({ onClick, next }: { onClick: () => void; next: 'light' | 'dark' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'flex items-center gap-[7px] rounded-pill border border-line-strong px-[13px] py-[7px]',
        'font-mono text-nav font-medium uppercase text-header-ink transition-colors duration-150',
        'hover:border-toggle-hover-bg hover:bg-toggle-hover-bg hover:text-toggle-hover-fg',
      )}
    >
      <span aria-hidden="true">{next === 'dark' ? '☾' : '☀'}</span>
      {next === 'dark' ? 'Dark' : 'Light'}
    </button>
  );
}

function IconButton({
  onClick,
  label,
  glyph,
  expanded,
}: {
  onClick: () => void;
  label: string;
  glyph: string;
  expanded?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={expanded}
      className="grid size-11 place-items-center rounded-pill border border-line-strong font-mono text-meta text-header-ink"
    >
      <span aria-hidden="true">{glyph}</span>
    </button>
  );
}
