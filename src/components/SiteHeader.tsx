import { useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { site } from '../content/site';
import { useTheme } from '../lib/theme-context';
import { LanguageSwitch } from './ui/LanguageSwitch';
import { Monogram } from './ui/Monogram';
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './ui/icons';
import { cx } from './ui/cx';

/**
 * Sticky, blurred header. The doc specifies the desktop nav and the mobile
 * icon pair; the open state of the mobile menu was left for later, so this
 * uses a plain disclosure built from the same tokens rather than leaving the
 * ≡ button inert.
 */
export function SiteHeader() {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <header className="sticky top-0 z-10 border-b border-header-line bg-header-bg backdrop-blur-[8px]">
      <div className="flex items-center justify-between px-5 py-4 md:px-13 md:py-[18px]">
        <a
          href="#top"
          aria-label="Walter"
          className="flex items-center gap-[9px] text-header-ink no-underline md:gap-[11px]"
        >
          <Monogram size={38} className="md:size-[42px]" />
        </a>

        {/* Desktop: inline nav + language + labelled theme switch */}
        <nav className="hidden items-center gap-[26px] font-mono text-nav font-medium uppercase text-header-nav md:flex">
          {site.nav.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="no-underline transition-colors duration-150 hover:text-header-ink"
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
          <LanguageSwitch
            className="font-mono text-nav font-medium"
            activeClassName="text-header-ink"
            idleClassName="text-header-nav hover:text-header-ink"
          />
          <ThemeSwitch onClick={toggle} next={nextTheme} label={t(`common.themeTo${nextTheme === 'dark' ? 'Dark' : 'Light'}`)} />
        </nav>

        {/* Mobile: two 44px targets */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitch
            className="font-mono text-nav font-medium"
            activeClassName="text-header-ink"
            idleClassName="text-header-nav"
          />
          <IconButton
            onClick={toggle}
            label={t(nextTheme === 'dark' ? 'common.switchToDark' : 'common.switchToLight')}
            glyph={theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          />
          <IconButton
            onClick={() => setMenuOpen((open) => !open)}
            label={t(menuOpen ? 'common.closeMenu' : 'common.openMenu')}
            glyph={menuOpen ? <CloseIcon /> : <MenuIcon />}
            expanded={menuOpen}
          />
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col border-t border-header-line px-5 pb-4 md:hidden">
          {site.nav.map((item) => (
            <a
              key={item.key}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-line py-4 font-mono text-nav font-medium uppercase text-header-nav no-underline last:border-b-0"
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

/**
 * Exported so the project pages (`/magic-tools`, `/dj-tools`, `/seasonable`) can
 * reuse it verbatim in its own header rather than growing a second,
 * drift-prone copy of the same pill.
 */
export function ThemeSwitch({
  onClick,
  next,
  label,
}: {
  onClick: () => void;
  next: 'light' | 'dark';
  label: string;
}) {
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
      {next === 'dark' ? <MoonIcon /> : <SunIcon />}
      {label}
    </button>
  );
}

/** Exported for the same reason as `ThemeSwitch` above. */
export function IconButton({
  onClick,
  label,
  glyph,
  expanded,
}: {
  onClick: () => void;
  label: string;
  glyph: ReactNode;
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
