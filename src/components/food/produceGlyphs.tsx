/**
 * One mark per kind of thing the catalogue holds — twenty-nine of them.
 *
 * These are hand-authored rather than pulled from Lucide, which is the site's
 * rule everywhere else (`ui/icons.tsx`). Lucide has an apple, a cherry, a
 * carrot and a bean; it has no caper, no prickly pear, no lentil and no
 * chestnut, and a set that is two thirds one house and one third another reads
 * as neither. So the whole set is drawn here, to the same contract the rest of
 * the site's line icons keep: a 24-unit box, `currentColor`, `aria-hidden`,
 * inline.
 *
 * The one deviation is weight. The site's UI glyphs draw at 2.25, a quarter
 * step over Lucide's 2, which is where a five-stroke arrow stops reading as
 * minimal. These carry interior detail a UI glyph does not — a calyx, a crease,
 * four seeds — inside a 22px disc, and at 2.25 the detail closes up into a
 * blob. 1.75 is where the interior survives.
 *
 * The key is `produce.en`, the catalogue's own word for what a designation is a
 * designation *of*, so a new row inherits a mark by naming its kind and nothing
 * has to be registered twice. Anything unmapped gets the sprout, which is why
 * adding a designation can never render an empty disc.
 */

import type { ReactElement } from 'react';

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const GLYPHS: Record<string, ReactElement> = {
  apple: (
    <>
      <path d="M8.6 8.2C5.6 8.2 4 10.9 4 13.6 4 17.6 7.5 21 9.6 21c1 0 1.6-.6 2.4-.6s1.4.6 2.4.6c2.1 0 5.6-3.4 5.6-7.4 0-2.7-1.6-5.4-4.6-5.4-1.6 0-2.4.7-3.4.7s-1.8-.7-3.4-.7Z" />
      <path d="M12 8.9V5.4" />
      <path d="M12 5.4c1.9 0 3.4-1.2 3.4-2.7-1.9 0-3.4 1.2-3.4 2.7Z" />
    </>
  ),
  pear: (
    <>
      <path d="M12 21c-3 0-5-2.2-5-5 0-2.4 1.6-3.7 2.4-5.2.6-1.1.6-2.3.6-3.3 0-1.4.9-2.5 2-2.5s2 1.1 2 2.5c0 1 0 2.2.6 3.3.8 1.5 2.4 2.8 2.4 5.2 0 2.8-2 5-5 5Z" />
      <path d="M12 5V2.9" />
    </>
  ),
  cherry: (
    <>
      <circle cx="7.5" cy="17.2" r="3.5" />
      <circle cx="16.5" cy="17.2" r="3.5" />
      <path d="M7.5 13.7C8.4 9.4 10 6 13.5 3.6" />
      <path d="M16.5 13.7c-.5-3.4-1.3-6.8-3-10.1" />
    </>
  ),
  plum: (
    <>
      <ellipse cx="12" cy="14.4" rx="6" ry="6.6" />
      <path d="M12 8.1c-1.3 1.8-1.9 3.9-1.9 6.3s.6 4.5 1.9 6.3" />
      <path d="m12 7.9 1.7-3.2" />
    </>
  ),
  peach: (
    <>
      <circle cx="12" cy="14.5" r="6.5" />
      <path d="M12 8.2c-1.3 1.8-1.9 4-1.9 6.3s.6 4.5 1.9 6.3" />
      <path d="M12 8c0-2 1.7-3.4 3.7-3.4 0 2-1.7 3.4-3.7 3.4Z" />
    </>
  ),
  strawberry: (
    <>
      <path d="M12 21c-3.6-1.9-6.4-5-6.4-8.2 0-1.6 1.1-2.6 2.6-2.6 1.6 0 2.8.9 3.8.9s2.2-.9 3.8-.9c1.5 0 2.6 1 2.6 2.6 0 3.2-2.8 6.3-6.4 8.2Z" />
      <path d="M8.7 10.2 12 7.2l3.3 3" />
      <path d="M12 7.2V4.3" />
      <path d="M10.3 14.2h.01" />
      <path d="M13.7 14.2h.01" />
      <path d="M12 17.4h.01" />
    </>
  ),
  fig: (
    <>
      <path d="M12 7.4c2 2.2 6 4.2 6 8.2 0 3-2.7 5.4-6 5.4s-6-2.4-6-5.4c0-4 4-6 6-8.2Z" />
      <path d="M12 7.4V4.3" />
      <path d="M12 5.4c1.6-.6 3.4-.2 4.3 1-1.6.6-3.4.2-4.3-1Z" />
    </>
  ),
  'prickly pear': (
    <>
      <ellipse cx="10.8" cy="14.8" rx="5.6" ry="6.4" />
      <ellipse cx="17.2" cy="6.6" rx="2.2" ry="2.8" transform="rotate(24 17.2 6.6)" />
      <path d="M8.6 12h.01" />
      <path d="M13 13.4h.01" />
      <path d="M10.2 16.8h.01" />
      <path d="M13.6 17.8h.01" />
    </>
  ),
  kiwi: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 6.6h.01" />
      <path d="M12 17.4h.01" />
      <path d="M6.6 12h.01" />
      <path d="M17.4 12h.01" />
    </>
  ),
  lemon: (
    <>
      <ellipse cx="12" cy="13" rx="7.2" ry="5" transform="rotate(-30 12 13)" />
      <path d="m18.2 9.4 1.5-.9" />
      <path d="m5.8 16.6-1.5.9" />
    </>
  ),
  citron: (
    <>
      <ellipse cx="12" cy="13.6" rx="6.2" ry="7.2" />
      <path d="M12 6.4V3.7" />
      <path d="M12 5.1c1.8-.6 3.8-.1 4.8 1.3-1.8.6-3.8.1-4.8-1.3Z" />
      <path d="M9.6 10.4c1.6-1.2 3.2-1.2 4.8 0" />
    </>
  ),
  orange: (
    <>
      <circle cx="12" cy="13.6" r="7.2" />
      <path d="M12 6.4v14.4" />
      <path d="m6.9 8.5 10.2 10.2" />
      <path d="M17.1 8.5 6.9 18.7" />
      <path d="M13.4 6.7c.3-1.7 1.8-2.9 3.5-2.7-.3 1.7-1.8 2.9-3.5 2.7Z" />
    </>
  ),
  olive: (
    <>
      <ellipse cx="10.4" cy="15.4" rx="4.4" ry="5.4" transform="rotate(-22 10.4 15.4)" />
      <path d="m13.6 11.2 5.2-5.2" />
      <path d="M15.8 8.8c-.6-1.9.2-3.9 1.9-4.9.6 1.9-.2 3.9-1.9 4.9Z" />
    </>
  ),
  chestnut: (
    <>
      <path d="M12 6.4c-4.2 0-7.6 4-7.6 8.8h15.2c0-4.8-3.4-8.8-7.6-8.8Z" />
      <rect x="3.6" y="15.2" width="16.8" height="3.6" rx="1.8" />
      <path d="M12 6.4V3.6" />
    </>
  ),
  garlic: (
    <>
      <path d="M12 21c-3.6 0-6.2-2.6-6.2-5.8 0-3.4 2.6-6.1 6.2-9.2 3.6 3.1 6.2 5.8 6.2 9.2 0 3.2-2.6 5.8-6.2 5.8Z" />
      <path d="M9.4 20.3c-1.2-2.6-1.2-5.6 0-8.4" />
      <path d="M14.6 20.3c1.2-2.6 1.2-5.6 0-8.4" />
      <path d="M12 6V3.4" />
    </>
  ),
  asparagus: (
    <>
      <path d="M12 20.6V4.6" />
      <path d="m7.6 20.6 1.8-14" />
      <path d="m16.4 20.6-1.8-14" />
      <path d="M6.9 15.6h10.2" />
    </>
  ),
  caper: (
    <>
      <ellipse cx="12" cy="8.4" rx="3.4" ry="4.2" />
      <path d="M12 12.6V21" />
      <path d="M12 16.6c-2.6 0-4.4-1.6-4.6-3.8 2.6 0 4.4 1.6 4.6 3.8Z" />
      <path d="M12 18.8c2.6 0 4.4-1.6 4.6-3.8-2.6 0-4.4 1.6-4.6 3.8Z" />
    </>
  ),
  artichoke: (
    <>
      <path d="M12 19.2c-3.4 0-6-2.8-6-6.6 0-4 2.8-7.3 6-9.2 3.2 1.9 6 5.2 6 9.2 0 3.8-2.6 6.6-6 6.6Z" />
      <path d="M8.3 9.4c1.2 1.2 2.4 1.8 3.7 1.8s2.5-.6 3.7-1.8" />
      <path d="M7.3 13.6c1.4 1.4 2.8 2.1 4.7 2.1s3.3-.7 4.7-2.1" />
      <path d="M12 19.2v2.1" />
    </>
  ),
  carrot: (
    <>
      <path d="M12.4 6 4 14.4a2.4 2.4 0 0 0 3.4 3.4l8.4-8.4Z" />
      <path d="M15.8 9.4c1.8-.4 3.2-1.8 3.6-3.6-1.8.4-3.2 1.8-3.6 3.6Z" />
      <path d="M12.4 6c.4-1.8 1.8-3.2 3.6-3.6.4 1.8-1 3.2-3.6 3.6Z" />
    </>
  ),
  bean: (
    <>
      <ellipse cx="8.6" cy="9" rx="4.6" ry="3.1" transform="rotate(-28 8.6 9)" />
      <path d="M7.6 10.4h.01" />
      <ellipse cx="15.4" cy="16" rx="4.6" ry="3.1" transform="rotate(-28 15.4 16)" />
      <path d="M14.4 17.4h.01" />
    </>
  ),
  fennel: (
    <>
      <path d="M12 21c-3.8 0-6.4-2-6.4-4.8 0-2.7 2.2-5 6.4-5s6.4 2.3 6.4 5c0 2.8-2.6 4.8-6.4 4.8Z" />
      <path d="M12 11.2V21" />
      <path d="M10.4 11.4 8.5 3.6" />
      <path d="m13.6 11.4 1.9-7.8" />
    </>
  ),
  // Two big opposite leaves and a terminal bud. The first draft had two leaf
  // pairs, which is truer to a basil sprig and unreadable at 24px — the upper
  // pair closed up against the stem into a blot. Symmetry plus the bud is what
  // separates it from the sprout fallback, whose pair is deliberately alternate.
  basil: (
    <>
      <path d="M12 21V9.2" />
      <path d="M12 17.6c-3.5 0-5.6-2.1-5.6-5.3 3.5 0 5.6 2.1 5.6 5.3Z" />
      <path d="M12 17.6c3.5 0 5.6-2.1 5.6-5.3-3.5 0-5.6 2.1-5.6 5.3Z" />
      <path d="M12 9.4c-1.8-1.5-1.8-3.6 0-5.4 1.8 1.8 1.8 3.9 0 5.4Z" />
    </>
  ),
  mushroom: (
    <>
      <path d="M4.4 12.6a7.6 7.6 0 0 1 15.2 0Z" />
      <path d="M9.8 12.6v5.2a2.2 2.2 0 0 0 4.4 0v-5.2" />
    </>
  ),
  lentil: (
    <>
      <ellipse cx="8.6" cy="10.2" rx="4.4" ry="2.6" />
      <ellipse cx="15.4" cy="12.9" rx="4.4" ry="2.6" />
      <ellipse cx="10" cy="16.6" rx="4.4" ry="2.6" />
    </>
  ),
  aubergine: (
    <>
      <path d="M9.4 7.8c3.6-1.2 8.4 1.4 8.4 6 0 4-3.2 7-6.8 7-3 0-5.4-2.2-5.4-5 0-3.6 1.6-6.8 3.8-8Z" />
      <path d="M9.4 7.8c-.6-2 .2-3.8 2-4.6.8 1.4.8 3-.2 4.2" />
      <path d="m11.4 3.4 1.4-1.2" />
    </>
  ),
  potato: (
    <>
      <ellipse cx="12" cy="12.6" rx="8.2" ry="6.2" transform="rotate(-14 12 12.6)" />
      <path d="M9 10.6h.01" />
      <path d="M14.4 14.2h.01" />
      <path d="M15.2 9.6h.01" />
    </>
  ),
  chilli: (
    <>
      <path d="M16 7.4c1.4 3.2.6 6.8-2.2 9.2-2.8 2.4-6.6 2.8-9.4 1.2 3.4-.6 6-2 7.8-4 1.8-2 2.8-4.2 3.8-6.4Z" />
      <path d="m16 7.4 1-3.2" />
      <path d="M14.6 3.6h4" />
    </>
  ),
  pepper: (
    <>
      <path d="M12 8.6c1.8-1.3 3.9-1.3 5.3 0 2 1.9 2 6.3-.4 9.5-1 1.4-2.2 2.1-3.3 1.7-.9-.3-1.2-1.5-1.6-1.5s-.7 1.2-1.6 1.5c-1.1.4-2.3-.3-3.3-1.7-2.4-3.2-2.4-7.6-.4-9.5 1.4-1.3 3.5-1.3 5.3 0Z" />
      <path d="M12 8.6V5.2" />
      <path d="M9.9 5.4c1.5-1.1 2.7-1.1 4.2 0" />
    </>
  ),
  tomato: (
    <>
      <circle cx="12" cy="14.8" r="6.4" />
      <path d="M12 8.4V5.2" />
      <path d="M12 8.4 9.2 6.5" />
      <path d="m12 8.4 2.8-1.9" />
    </>
  ),
  chicory: (
    <>
      <circle cx="12" cy="13.8" r="7" />
      <path d="M12 6.8c-2.6 2-4 4.4-4 7s1.4 5 4 7" />
      <path d="M12 6.8c2.6 2 4 4.4 4 7s-1.4 5-4 7" />
    </>
  ),
};

const SPROUT = (
  <>
    <path d="M12 21v-7.6" />
    <path d="M12 13.4c-3.4 0-5.6-2.2-5.6-5.6 3.4 0 5.6 2.2 5.6 5.6Z" />
    <path d="M12 14c0-3.4 2.2-5.6 5.6-5.6 0 3.4-2.2 5.6-5.6 5.6Z" />
  </>
);

/** `kind` is `produce.en`. Sized by the caller, in `currentColor`. */
export function ProduceGlyph({ kind, size = 22 }: { kind: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...strokeProps}>
      {GLYPHS[kind] ?? SPROUT}
    </svg>
  );
}
