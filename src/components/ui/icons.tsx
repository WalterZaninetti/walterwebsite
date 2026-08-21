/**
 * Every icon on the site, inlined from a maintained upstream set rather than
 * hand-drawn. This supersedes `.pipeline/repaint/direction.md` §3.3, which
 * specified nine hand-authored primitives: the geometry read under-detailed
 * and the strokes read thin, so the shapes now come from Lucide and the brand
 * marks from Simple Icons. Everything else §3.3 decided still holds — 24-unit
 * viewBox, `currentColor`, `aria-hidden`, inline rather than `vite-plugin-svgr`
 * (§3.4), and no new runtime dependency.
 *
 * Sources, so the set stays re-fetchable:
 *
 *   Lucide — ISC — https://lucide.dev
 *     raw.githubusercontent.com/lucide-icons/lucide/main/icons/<slug>.svg
 *     gallery-vertical-end · disc-3 · leaf · library-big · audio-lines · coffee
 *     file-text · sun · moon · menu · x · map-pin · thermometer
 *
 *   Simple Icons — CC0 — https://simpleicons.org
 *     raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/<slug>.svg
 *     github · twitch · instagram · spotify · bandcamp
 *
 *   Bootstrap Icons — MIT — https://icons.getbootstrap.com
 *     raw.githubusercontent.com/twbs/icons/main/icons/linkedin.svg
 *     LinkedIn only, and only because both sets above dropped it under
 *     trademark pressure. It is authored on a 16-unit box, hence the ×1.5.
 *
 * The brand marks are filled and their geometry is not ours to restyle. The
 * line icons all draw in `currentColor` at `strokeWidth` 2.25 — a quarter step
 * over Lucide's native 2, which is where the set stops reading as minimal.
 * Checked against every path below: at 2.25 the round caps overhang the extreme
 * coordinates by ~1.1 units and the widest shape (`disc-3`'s r=10 circle)
 * reaches 23.125, so nothing clips the 24 viewBox.
 */

/** The four footer social marks, which size by attribute rather than class. */
function glyph(size = 20) {
  return { viewBox: '0 0 24 24', width: size, height: size, 'aria-hidden': true } as const;
}

export function GitHubIcon() {
  return (
    <svg {...glyph()} fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function TwitchIcon() {
  return (
    <svg {...glyph()} fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg {...glyph()} fill="currentColor">
      <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
    </svg>
  );
}

export function LinkedInIcon() {
  return (
    <svg {...glyph()} fill="currentColor">
      {/* Bootstrap Icons authors this on a 16-unit box; ×1.5 lands it on the
          24-unit grid every other mark here uses. */}
      <g transform="scale(1.5)">
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
      </g>
    </svg>
  );
}

/**
 * The line icons. Six ride the tile (48/56px, via `Tile.tsx`), the rest ride a
 * bare slot in a section's eyebrow row or a header button — hence a `className`
 * prop instead of `glyph`'s fixed size: the tile scales its icon by breakpoint,
 * the eyebrow glyph never does.
 */
interface GlyphProps {
  className?: string;
}

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/**
 * The default size rides `width`/`height` attributes rather than a `size-5`
 * class, because presentational attributes lose to *any* stylesheet rule. So a
 * caller's `size-[30px]` wins outright, and a caller passing only a colour
 * (`<ShelfIcon className="text-ink-strong" />`) still gets 20px.
 *
 * The alternative — `cx('size-5', className)` — emits both utilities and lets
 * stylesheet order pick the winner, which is not the order they were written
 * in and fails silently when it goes the wrong way.
 */
function bareGlyph(className?: string) {
  return {
    viewBox: '0 0 24 24',
    width: 20,
    height: 20,
    'aria-hidden': true,
    className,
  } as const;
}

/**
 * The three arrows that used to live inside translatable strings as ←, → and ↗.
 *
 * They had to come out. Every face this site ships is Google's `latin` subset,
 * and that subset contains U+2191 and U+2193 but not U+2190, U+2192 or U+2197 —
 * so all three fell back to a system face wherever they appeared, which is the
 * failure djTools.ts:48 records for U+2605. Widening the `unicode-range` would
 * have made it worse rather than better: the glyphs are absent from the font
 * files themselves, so declaring the range only swaps a readable fallback for
 * a .notdef box.
 *
 * Sized in `em` at the call site so they track the label they sit beside.
 * An arrow on a link is an icon rather than a word, so it also has no business
 * being in a string translators are asked to carry.
 */

/** Back. Lucide `arrow-left`. */
export function ArrowLeftIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

/** Onward, within the site. Lucide `arrow-right`. */
export function ArrowRightIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/** Leaves the site. Lucide `arrow-up-right`. */
export function ArrowUpRightIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

/** Magic Tools — a deck seen end-on. Lucide `gallery-vertical-end`. */
export function CardsIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <path d="M7 2h10" />
      <path d="M5 6h14" />
      <rect width="18" height="12" x="3" y="10" rx="2" />
    </svg>
  );
}

/** DJ Tool — a record: rim, two groove arcs, centre hole. Lucide `disc-3`. */
export function DiscIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <circle cx="12" cy="12" r="10" />
      <path d="M6 12c0-1.7.7-3.2 1.8-4.2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M18 12c0 1.7-.7 3.2-1.8 4.2" />
    </svg>
  );
}

/** Seasonable — a leaf on its stem. Lucide `leaf`. */
export function LeafIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

/**
 * home.projects.heading — a book with a spine plus one leaning against it.
 * Lucide `library-big`, not plain `library`: that one is four bare strokes,
 * which at 20px beside a 30px display serif reads as tick marks rather than a
 * shelf. This keeps §3.3's rule that this is uprights and never the 2x2 grid
 * an AI reaches for when it means "projects", and gives it enough mass to
 * survive next to the heading.
 */
export function ShelfIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <rect width="8" height="18" x="3" y="3" rx="1" />
      <path d="M7 3v18" />
      <path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z" />
    </svg>
  );
}

/** The music section — a waveform. Lucide `audio-lines`. */
export function WaveIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <path d="M2 10v3" />
      <path d="M6 6v11" />
      <path d="M10 3v18" />
      <path d="M14 8v7" />
      <path d="M18 5v13" />
      <path d="M22 10v3" />
    </svg>
  );
}

/** SupportSection — a cup with a handle and three steam curls. Lucide `coffee`. */
export function CupIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <path d="M10 2v2" />
      <path d="M14 2v2" />
      <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
      <path d="M6 2v2" />
    </svg>
  );
}

/** ProposeToolForm — a sheet with a folded corner and three rules. Lucide `file-text`. */
export function NoteIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

/**
 * Seasonable's first card — a province is a place, and this is the only glyph
 * in the set that says place. Lucide `map-pin`.
 */
export function PinIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/**
 * Seasonable's second card, which is about the weather the documents cannot
 * know: "a cold spring or a hot September moves the real thing by two weeks".
 * Lucide `thermometer`. Not `sun` — that glyph is the theme switch two rows
 * up in the same header, and one shape cannot mean both "make the page light"
 * and "this year was warm".
 */
export function ThermometerIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
  );
}

/** Theme switch, light. Lucide `sun`. Replaces the '☀' text character. */
export function SunIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

/**
 * Theme switch, dark. Lucide `moon`, so it is stroked like `SunIcon` rather
 * than the lone filled crescent it used to be. Replaces the '☾' character.
 */
export function MoonIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
    </svg>
  );
}

/**
 * The mobile menu button's two states. Lucide `menu` / `x`, replacing the '≡'
 * and '×' text characters — both are typographic glyphs that render at a
 * different weight, size and baseline on every platform. The button keeps its
 * `aria-label` (`common.openMenu` / `common.closeMenu`), so no locale key moves.
 */
export function MenuIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
    </svg>
  );
}

export function CloseIcon({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} {...strokeProps}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/**
 * The two music source marks. Unlike the line icons these are brand marks — filled, official
 * geometry from Simple Icons, and not ours to restyle.
 *
 * Spotify's design guidelines require the logo to appear wherever its metadata does, and permit
 * the green mark only on black or white. The source cards sit on `--panel-inset`, which is
 * neither, so this draws in currentColor and the card gives it a monochrome rung of the on-panel
 * ladder. Do not recolour it green here.
 */
export function SpotifyMark({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

/** Bandcamp's mark: a single slanted quadrilateral, filling the full box. */
export function BandcampMark({ className }: GlyphProps = {}) {
  return (
    <svg {...bareGlyph(className)} fill="currentColor">
      <path d="M0 18.75l7.437-13.5H24l-7.438 13.5H0z" />
    </svg>
  );
}
