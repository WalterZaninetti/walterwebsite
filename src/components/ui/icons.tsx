import { cx } from './cx';

/**
 * Line icons for the footer's social row, the icon tile system and the
 * header's theme glyphs. All draw in currentColor on a 24-unit viewBox so a
 * single colour change (hover, dark mode, the tile's fill) restyles every
 * one of them with no second asset.
 *
 * `glyph(size)` replaces the old hardcoded `box` const: the four social
 * icons below call it with no argument and render byte-identical to before
 * (17px).
 */

function glyph(size = 17) {
  return { viewBox: '0 0 24 24', width: size, height: size, 'aria-hidden': true } as const;
}

export function GitHubIcon() {
  return (
    <svg {...glyph()} fill="currentColor">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.55v-1.94c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .96-.31 3.14 1.18a10.9 10.9 0 0 1 5.72 0c2.18-1.49 3.14-1.18 3.14-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.8.55A11.5 11.5 0 0 0 23.5 12A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function TwitchIcon() {
  return (
    <svg {...glyph()} fill="currentColor">
      <path d="M4.3 1 1.6 5.4v13.1h4.6V22h2.9l2.7-3.5h3.6L21.9 12V1H4.3Zm15.4 10.2-3.5 4.6h-3.9l-2.6 3.4v-3.4H6.3V2.9h13.4v8.3Zm-6.8-5.5h1.9v5.5h-1.9V5.7Zm-4.2 0h1.9v5.5H8.7V5.7Z" />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg {...glyph()} fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon() {
  return (
    <svg {...glyph()} fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM2.9 21h4.15V9.5H2.9V21Zm7.05 0h4.15v-6.1c0-1.6.3-3.15 2.3-3.15 1.97 0 2 1.83 2 3.25V21h4.15v-6.85c0-3.6-.78-6.03-4.98-6.03-2.02 0-3.38 1.11-3.93 2.16h-.06V9.5H9.95V21Z" />
    </svg>
  );
}

/**
 * The nine glyphs the repaint adds — direction.md §3.3. Six ride the tile
 * (48/56px, via `Tile.tsx`), three ride a bare 18px slot in a section's
 * eyebrow row — hence a `className` prop instead of `glyph`'s fixed size:
 * the tile scales its icon by breakpoint, the eyebrow glyph never does.
 * Every one is a line icon: stroke only, round caps and joins, 1.9 stroke
 * width, no fill except a single solid dot or crescent where the reference
 * icon calls for one.
 */
interface GlyphProps {
  className?: string;
}

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

function bareGlyph(className?: string) {
  return {
    viewBox: '0 0 24 24',
    'aria-hidden': true,
    className: cx('size-[18px]', className),
  } as const;
}

/** Magic Tools — two rounded cards, the back one rotated -8°. */
export function CardsIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <rect x="7.3" y="4.4" width="11" height="15" rx="2" transform="rotate(-8 12.8 11.9)" />
      <rect x="5.6" y="6.4" width="11" height="15" rx="2" />
    </svg>
  );
}

/** DJ Tool — a record: two stroked rings, one filled centre. */
export function DiscIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <circle cx="12" cy="12" r="9.2" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Seasonable — one leaf, two mirrored arcs meeting at tip and stem, plus a midrib. */
export function LeafIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <path d="M12 20c-6-2.6-7.4-10 0-16 7.4 6 6 13.4 0 16Z" />
      <path d="M12 19V6" />
    </svg>
  );
}

/** home.projects.heading — three uprights of unequal height, not a 2x2 grid. */
export function ShelfIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <rect x="4.6" y="12" width="3.6" height="7" rx="1.3" />
      <rect x="10.2" y="6" width="3.6" height="13" rx="1.3" />
      <rect x="15.8" y="9" width="3.6" height="10" rx="1.3" />
    </svg>
  );
}

/** The music section — five bars of unequal height, centred on the axis. */
export function WaveIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <rect x="3.2" y="9" width="2.4" height="6" rx="1.2" />
      <rect x="7.4" y="5" width="2.4" height="14" rx="1.2" />
      <rect x="11.6" y="2" width="2.4" height="20" rx="1.2" />
      <rect x="15.8" y="6.5" width="2.4" height="11" rx="1.2" />
      <rect x="20" y="8.5" width="2.4" height="7" rx="1.2" />
    </svg>
  );
}

/** SupportSection — a cup, a handle right, one steam curl above. */
export function CupIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <path d="M6 9h10v6a5 5 0 0 1-5 5 5 5 0 0 1-5-5Z" />
      <path d="M16.3 11h1.7a2.6 2.6 0 0 1 0 5.2h-1.7" />
      <path d="M9.2 6.4c0-1 1-1 1-2s-1-1-1-2" />
    </svg>
  );
}

/** ProposeToolForm — a sheet with a folded corner, two rule lines. */
export function NoteIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <path d="M7 4h7l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
      <path d="M14 4v4h4" />
      <path d="M9 13.2h6M9 16.4h6" />
    </svg>
  );
}

/** Theme switch, light. Replaces the '☀' text character. */
export function SunIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <circle cx="12" cy="12" r="4.4" />
      <path d="M12 2.5v2.5M12 19v2.5M21.5 12H19M5 12H2.5M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8M18.4 18.4l-1.8-1.8M7.4 7.4 5.6 5.6" />
    </svg>
  );
}

/** Theme switch, dark. Replaces the '☾' text character. */
export function MoonIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} fill="currentColor" stroke="none">
      <path d="M15.2 3a9 9 0 1 0 5.8 15.9A9.4 9.4 0 0 1 15.2 3Z" />
    </svg>
  );
}
