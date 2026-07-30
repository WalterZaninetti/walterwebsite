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

## /magic-tools

A second page in its own visual world — parchment, Cinzel, MTG green — because the homepage
claims each project keeps its own look. It opts out of the site's theme provider entirely: the
design draws one look, with no dark variant, so its palette is a flat block of `magic-*` tokens
rather than a light/dark semantic pair.

Five tools:

- **Draw odds** — hypergeometric, entirely client-side (`src/lib/hypergeometric.ts`). Ported from
  the design doc's own script, including its use of log-factorials: the binomial coefficients here
  reach ~1e29 and overflow a double long before the probability does, so it sums logs and
  exponentiates once at the end.
- **Mana sources** — how many sources of a colour the deck needs to cast a cost on curve. This is
  the metric the homepage actually promises ("a geometric calculator for building mana bases");
  section 01 only answers a generic drawing question. Also client-side.
- **Opening hands** — the joint question, via the multivariate hypergeometric: two lands *and* a
  two-drop in the same seven. Multiplying the separate odds overstates it, because the categories
  compete for the same slots — with 24 lands and 8 two-drops the product says 56.0% and the truth is
  53.7%. The UI shows both, since the gap is the whole point. Categories must be disjoint; overlap
  is caught and reported rather than silently double-booked.
- **Finding a card** — the turn axis rather than the count axis: when does a one-of turn up? A
  singleton in a 99-card deck is in 7.1% of openers and 16.2% by turn 10, which tends to change how
  people think about tutors.
- **Plain-English search** — backed by the
  [`natural-language-to-scryfall-filters`](../natural-language-to-scryfall-filters) service.

### What the mana model assumes

Stated in full in `pCastOnCurve`, and worth knowing before trusting a number:

- London mulligan, so each attempt is an independent fresh seven; at depth *m* you keep 7 − m.
- Source-maximising keeps: non-sources are bottomed first.
- **You ship only a hand holding none of the colour, at most once.** This is the load-bearing
  choice. A first cut shipped any hand short of the required pips, which claimed six sources cast a
  one-pip spell on turn one 90% of the time — true only if you mulligan to five for one pip and
  count the lost cards as free. `MAX_MULLIGANS` is 1 for the same reason.
- Bottomed cards are out of reach, so draws come from the 53 you haven't seen.

It counts colour and nothing else, so it happily keeps a seven-lander. Published tables (Karsten's)
land a little lower because they model hand quality as well. The UI carries this caveat too — a
number like this is only as good as the policy behind it.

### Auth: why no key ships

`/translate` sits behind auth that accepts **either** a valid `x-api-key` **or** an allowed
`Origin`. The browser uses the Origin path and carries no credential, because a public web app
cannot hold a secret — putting the key in the bundle would publish it, and publish a credential
that also authorises non-browser callers until rotated.

Origin is forgeable, so this is a gate against casual misuse, not an authentication boundary. The
per-IP hourly rate limit is what actually protects the Anthropic spend. Real attestation means
Firebase App Check or Turnstile, which load third-party script into the page — a trade this site
refuses on privacy grounds, and one to make deliberately rather than by drift.

### Wiring the translate service

```sh
# in natural-language-to-scryfall-filters
cp .env.example .env     # ANTHROPIC_API_KEY + GCP credentials
npm run dev              # :8080, ALLOWED_ORIGINS already lists :5173
```

Set `VITE_TRANSLATE_API_URL` here to point at a deployed instance (see `.env.example`); it
defaults to `http://localhost:8080`, and add that origin to the service's `ALLOWED_ORIGINS`. No
credential is sent from the browser — see the auth note above.

The design shipped a local regex parser that translated on every keystroke. That's replaced by the
service, which is a model call validated against Scryfall before it returns — slower, metered, and
rate-limited (15/hour per IP by default). So the UI translates on **explicit submit** (button or ⌘/Ctrl+Enter)
rather than as you type. In exchange it reads Italian, German, French and Spanish, and it catches
queries Scryfall would silently ignore while returning thousands of wrong cards.

The service's `assumptions`, `unsupported` and `warnings` are surfaced under the query rather than
dropped — a non-empty `warnings` means repair failed and the query should be treated as suspect.
Chips are derived by splitting the returned query and labelling each fragment against the service's
own operator registry and aliases, so a chip never claims something the backend didn't mean.

**Refinement** uses the service's `previous: {text, query}`: "now only under $5" narrows the last
query instead of starting over. It is stateless server-side, so the chain of turns lives in
component state and is posted back each time.

It gets its own input rather than reusing the main box. The service refines whenever it's handed a
`previous` and cannot tell which you meant — "red creatures" typed after a search for instants is a
new question, not a narrowing — so guessing would silently fold an unrelated search into the old
query. The turns are shown as a breadcrumb because a refined query no longer corresponds to
anything in the input box; each earlier step rolls back to it.

### Keeping up with the design docs

`src/design-system/Walter - Homepage.reference.html` is the last-imported copy of the homepage doc,
kept so a re-import can be diffed against it — that's how the second homepage revision was spotted.
There's no equivalent stored for Magic Tools yet; re-fetch it through the design MCP and diff by
hand, or drop a copy alongside the homepage one to get the same workflow.

## Languages

English and Italian, via `react-i18next`. All copy lives in `src/locales/{en,it}.json`; the modules
under `src/content/` keep only what isn't prose — ids, hrefs, layout choices, numeric data, and
proper nouns (record and track names) that read the same either way.

- **Detection**: stored choice first, then the browser. `load: 'languageOnly'` means an `it-IT`
  visitor gets Italian rather than falling through to English.
- **Persistence**: `localStorage['walter-lang']`. Deliberately *not* a cookie — the notice's
  "no cookies" claim is load-bearing, and i18next would happily have used one by default.
- **`<html lang>`** is updated on every change, and document titles are translated too.
- **Numbers go through `Intl`**, so the draw-odds figures read `58,8%` in Italian and `58.8%` in
  English. `formatPercent`/`formatNumber` take the active locale.
- **The Magic Tools examples are localised, not translated** — the backend accepts Italian, so the
  Italian locale offers Italian sentences to type. Scryfall operator syntax (`c: · id:`) stays in
  `content/magic.ts`: it's code, not prose.

Adding a language means a third JSON file and one entry in `LANGUAGES` in `src/lib/i18n.ts`.

Two known gaps: the `<meta name="description">` in `index.html` is English-only, since a static SPA
has no server to vary it per request; and the language choice isn't reflected in the URL, so a
shared link always opens in the recipient's own language.

## Privacy posture

The site sets **no cookies**, runs no analytics, and makes **no third-party requests** on load —
verified by checking `performance.getEntriesByType('resource')` for off-origin hosts. The only
things written to a visitor's device are `localStorage['walter-theme']` and
`localStorage['walter-lang']`, each only once they use the corresponding control.

That is what makes the notice at `/cookie-policy` accurate and why there is **no consent banner**:
storage set by explicit user action, holding a display preference and not used for tracking, is
outside the consent requirement in Article 5(3) of the ePrivacy Directive.

This is load-bearing. Adding analytics, an embed (YouTube, Maps, comments), a hosted font, a form
that actually POSTs somewhere, or any new stored key all break it, and the `legal` section of
**both** locale files would need updating — possibly along with adding the banner. Adding the
language preference is exactly this case: `walter-lang` meant rewriting that section in en and it.

## Structure

```
src/
  locales/               en.json + it.json — all copy for all three pages
  content/               structure and data only: ids, hrefs, numbers, proper nouns
  design-system/         theme.css, fonts.css + the reference canvas HTML
  lib/
    route.ts             two-and-a-bit pages of hand-rolled routing
    theme.tsx            light/dark provider (homepage + legal only)
    hypergeometric.ts    draw-odds maths
    translateApi.ts      client for the scryfall-filters service
    i18n.ts              i18next setup, detection and persistence
  components/
    ui/                  Eyebrow, Frame, Pill/Chip/AccentButton, Monogram, icons
    music/               MusicSection, AlbumOfTheMonth, NowPlaying
    magic/               MagicToolsPage, DrawOdds, PlainEnglishSearch, ManaPips
    SiteHeader, Hero, ProjectShelf, SupportSection, ProposeToolForm,
    NowFooter (the "Now" note), SiteFooter (the closing bar), LegalPage
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
- **Fonts are self-hosted** — Instrument Serif, Space Grotesk, IBM Plex Mono and Libre Baskerville
  live in `src/assets/fonts` (Latin subset, OFL, see `OFL.txt`) and are declared in
  `src/design-system/fonts.css` with `font-display: swap`. This is a privacy decision before it is
  a performance one: loading them from a font CDN would disclose every visitor's IP to a third
  party, which is what the cookie notice exists to be able to deny. It also drops a DNS + TLS round
  trip. Space Grotesk and Libre Baskerville are variable fonts, so several weights resolve to one
  byte-identical file that Vite deduplicates — 12 `@font-face` rules, 8 files, ~152 kB.
  They are deliberately **not** preloaded from `index.html`: Vite hashes and relocates assets
  referenced from CSS, so a hardcoded path there would 404 in the build. Move the files to
  `public/fonts` first if you want real preload hints.

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

- **Multi-page / routing**: `src/lib/route.ts` is ~30 lines of hand-rolled routing serving the one
  real second page (`/cookie-policy` and `/privacy`, both the same notice) off the SPA rewrite
  `firebase.json` already has. Two pages don't justify a router; swap in `react-router` when
  `#projects`, `#about`, `#twitch` and `#now` become real pages.
- **The propose-a-tool form** has no backend: `handleSubmit` composes the fields into a `mailto:`
  draft to the address the card already offers as a fallback. Point it at an endpoint when there
  is one; the fields don't need to change.
- **React Compiler**: `@vitejs/plugin-react` already supports it via an optional peer
  (`babel-plugin-react-compiler`) — install it and pass `babel: { plugins: [...] }` to `react()`
  in `vite.config.ts` if you want it.
