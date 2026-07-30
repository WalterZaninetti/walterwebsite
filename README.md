# walter.dev

Personal site — "small tools, made carefully". React 19 + TypeScript + Tailwind CSS 4 on Vite,
built for Firebase Hosting.

The homepage is an implementation of the **Sage & Loam** design (palette 1c) from the Claude
Design doc _Walter - Homepage_ — options 2a (light desktop), 2b (dark desktop) and 2c (mobile).
The original canvas markup is kept at `src/design-system/Walter - Homepage.reference.html` as the
source of truth to diff against.

## Stack

- **React 19** + **TypeScript 7**
- **Tailwind CSS 4** — configured via `@tailwindcss/vite`, no `tailwind.config.js`/PostCSS step.
- **Vite 8**

## Design system

All visual values live in `src/design-system/theme.css`, in three layers:

1. **Raw palette + type scale** (`@theme`) — the literal ramps from the doc: `sage-50…900`,
   `night-700…950`, `loam`, `ocean`, `live`, the four type families, the `text-hero`/`text-section`
   /`text-label` scale, and the doc's deliberately mixed radii (`rounded-frame` 4px through
   `rounded-card` 16px and `rounded-pill`).
2. **Semantic layer** (`:root` and `.dark`) — `--canvas`, `--panel`, `--ink-body`, `--accent`,
   `--on-panel-*`, the hairline family, and per-project card worlds (`--project-magic`, `-dj`,
   `-food`). Dark mode is a wholesale override of this layer, nothing else.
3. **Utility exposure** (`@theme inline`) — re-publishes the semantic layer as Tailwind colours, so
   `bg-canvas` / `text-ink-body` / `shadow-lift-magic` follow the active theme at runtime.

Components reference the semantic tokens only — reach for the raw ramp just for values the doc
keeps identical in both themes. Textures the doc builds from gradients (`hatch`, `hatch-portrait`,
`camelot`, `hero-glow`) are `@utility` definitions in the same file.

Theme selection: `src/lib/theme.tsx` toggles `.dark` on `<html>` and persists to
`localStorage['walter-theme']`; a tiny inline script in `index.html` applies it before first paint
so dark-mode visitors get no flash. With nothing stored, the OS preference wins and keeps winning
until the visitor uses the header switch.

## Structure

```
src/
  content/site.ts        all copy, in one place (incl. the doc's tighter mobile variants)
  design-system/         theme.css + the reference canvas HTML
  lib/theme.tsx          light/dark provider
  components/
    ui/                  Eyebrow, Frame, Pill/Chip/AccentButton, Monogram, icons
    music/               MusicSection, AlbumOfTheMonth, NowPlaying
    SiteHeader, Hero, ProjectShelf, SupportSection, ProposeToolForm,
    NowFooter (the "Now" note), SiteFooter (the closing bar)
```

Sections whose mobile reading order interleaves the desktop columns (the hero, the music grid) are
built as one flat grid with explicit `lg:col-start`/`lg:row-start` placement, so DOM order is the
mobile order and no markup is duplicated per breakpoint.

## What's optimized, and why

- **SVGs as components** (`vite-plugin-svgr`) — `import Logo from './logo.svg?react'` inlines an
  optimized (svgo-passed), tree-shakeable component instead of a network request. Use plain
  `import url from './logo.svg'` when you actually need a URL.
- **Image compression at build time** (`vite-plugin-image-optimizer`) — png/jpg/webp/avif/svg
  assets get re-compressed on `vite build`, so nobody has to remember to run them through
  TinyPNG/svgo by hand before committing.
- **`LazyImage` component** (`src/components/LazyImage.tsx`) — every image gets explicit
  `width`/`height` (no layout shift while it loads), `loading="lazy"` + `decoding="async"` by
  default, and a `priority` prop for the one image that's actually your LCP element (hero image),
  which flips it to eager + `fetchPriority="high"`. Nothing uses it yet: the page ships with the
  doc's hatched `<Frame>` placeholders where the portrait and sleeves will go. Swap a `Frame` for a
  `LazyImage` of the same dimensions as each asset arrives, and mark the portrait `priority`.
- **Manual vendor chunking** (`vite.config.ts`) — `react`/`react-dom` are pinned to their own
  chunk so they stay byte-identical (and cached) across deploys that only touch app code.
- **Bundle analysis on demand** — `npm run analyze` builds with `rollup-plugin-visualizer` and
  opens a treemap (`dist/stats.html`) of what's actually in each chunk, gzip/brotli sizes
  included.
- **Firebase cache headers** (`firebase.json`) — hashed build output under `/assets/**` (JS, CSS,
  images that were `import`ed and got a content hash) is cached for a year as `immutable`.
  Unhashed files served straight from `public/` get a short, revalidated cache instead, since
  their filename never changes when their content does.
- **Fonts** — Instrument Serif, Space Grotesk, IBM Plex Mono and Libre Baskerville come from Google
  Fonts with `display=swap` and preconnect hints, requesting only the weights the page renders.
  Self-hosting them as `woff2` under `src/assets/fonts` would drop the third-party DNS/TLS round
  trip and is the next win if font loading shows up in field data.

## Commands

```bash
npm install
npm run dev       # local dev server
npm run build     # tsc -b + vite build -> dist/
npm run preview   # serve the production build locally
npm run analyze   # build + open a bundle-size treemap
npm run lint
npm run deploy    # build, then firebase deploy --only hosting
```

## Deploying to Firebase

1. `npx firebase-tools login` (once, per machine).
2. Replace the placeholder project id in `.firebaserc`, or run `npx firebase-tools use --add`.
3. `npm run deploy`.

`firebase.json` already points hosting at `dist`, rewrites everything to `index.html` (SPA
routing), and sets the cache headers described above.

## Extending

- **Multi-page / routing**: the header and hero already link to `#projects`, `#about`, `#twitch`
  and `#now`. Add `react-router` and `lazy()` each route when those become real pages.
- **The propose-a-tool form** has no backend: `handleSubmit` composes the fields into a `mailto:`
  draft to the address the card already offers as a fallback. Point it at an endpoint when there
  is one; the fields don't need to change.
- **React Compiler**: `@vitejs/plugin-react` already supports it via an optional peer
  (`babel-plugin-react-compiler`) — install it and pass `babel: { plugins: [...] }` to `react()`
  in `vite.config.ts` if you want it.
