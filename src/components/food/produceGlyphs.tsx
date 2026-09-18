/**
 * One mark per kind of thing the catalogue holds — fifty-one of them.
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
 *
 * Seven were drawn when the regional PAT registers shipped and brought seven
 * kinds the protected designations never had: apricot, cauliflower, onion, pea,
 * broad bean, watermelon and salsify. The sprout carried them for one deploy,
 * which is exactly as long as a fallback should have to stand in for a fruit.
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
  // Five more for the Veneto, Piemonte and Puglia schede. The beetroot keeps
  // its tail and upright stalks where the turnip is a pointed root under two
  // splayed leaves; the cabbage is cupped by an outer leaf where the chicory
  // is split by two arcs; the sweet potato is a spindle, pointed at both ends,
  // where the potato is a round-eyed oval; the jujube hangs in a pair from one
  // stalk, where the olive is single on a twig.
  beetroot: (
    <>
      <circle cx="12" cy="14.6" r="5.4" />
      <path d="M12 20v2" />
      <path d="M10.6 9.4 9.4 3.6" />
      <path d="M13.4 9.4 14.6 3.6" />
      <path d="M14.6 3.6c2.2.8 3.2 2.6 2.8 4.8-2.2-.8-3.2-2.6-2.8-4.8Z" />
    </>
  ),
  cabbage: (
    <>
      <circle cx="12" cy="10.8" r="5.4" />
      <path d="M12 10.8c-1.4 1.2-2 2.8-1.8 5" />
      <path d="M4 10.6c.4 5.8 3.4 9.4 8 9.4s7.6-3.6 8-9.4" />
      <path d="M12 20v-3.6" />
    </>
  ),
  chard: (
    <>
      <path d="M12 3.4c4.2 2.2 6 5.6 5.6 9.8-.4 2.4-2.6 3.8-5.6 4-3-.2-5.2-1.6-5.6-4-.4-4.2 1.4-7.6 5.6-9.8Z" />
      <path d="M11.2 21.6v-4.4" />
      <path d="M12.8 21.6v-4.4" />
      <path d="M12 17.2V5.2" />
      <path d="M12 10.4 9 8.2" />
      <path d="m12 13.2 3-2.2" />
    </>
  ),
  jujube: (
    <>
      <ellipse cx="8.4" cy="16.2" rx="3.2" ry="4.2" />
      <ellipse cx="15.6" cy="15.2" rx="3.2" ry="4.2" />
      <path d="M8.4 12c.6-3.4 1.8-5.6 3.6-7.4" />
      <path d="M15.6 11c-.8-2.8-2-4.8-3.6-6.4" />
    </>
  ),
  'sweet potato': (
    <>
      <path d="M3.4 17.2c.2-4.8 4-9.4 9.6-11 4-1.2 6.8.2 7.6 2.8.8 2.8-1 5.8-5 8-4.6 2.6-10.2 3.6-12.2.2Z" />
      <path d="M20.2 8.2 21.6 6.4" />
      <path d="M3.4 17.2 2.2 19" />
      <path d="M10.6 12.8h.01" />
      <path d="M14.8 11.4h.01" />
    </>
  ),
  // A head of florets on a thick stalk, against the cauliflower's dome and
  // wrapping leaves: broccoli's head is looser and its stalk is the point of it.
  broccoli: (
    <>
      <path d="M12 21v-8.6" />
      <path d="M7.4 12.4c-1.3 0-2.3-1-2.3-2.3 0-1 .6-1.8 1.5-2.1-.1-.3-.2-.6-.2-1 0-1.4 1.1-2.5 2.5-2.5.5 0 1 .2 1.4.4.5-.8 1.5-1.4 2.5-1.4s2 .6 2.5 1.4c.4-.3.9-.4 1.4-.4 1.4 0 2.5 1.1 2.5 2.5 0 .4-.1.7-.2 1 .9.3 1.5 1.1 1.5 2.1 0 1.3-1 2.3-2.3 2.3Z" />
      <path d="M12 16.6 9 14.4" />
      <path d="m12 18.8 3-2.4" />
    </>
  ),
  // Ribbed stalks fanning from a cut base, with the leaf tops kept short: the
  // cardoon's bundle is tied and upright, celery's opens out.
  celery: (
    <>
      <path d="M8.6 20.8c-1.2-4.2-1.2-8.6 0-13.2" />
      <path d="M15.4 20.8c1.2-4.2 1.2-8.6 0-13.2" />
      <path d="M12 20.8V6.6" />
      <path d="M8.6 20.8h6.8" />
      <path d="M8.8 8.2c-.8-1.6-.8-3.2 0-4.8 1 1 1.6 2.2 1.8 3.6" />
      <path d="M15.2 8.2c.8-1.6.8-3.2 0-4.8-1 1-1.6 2.2-1.8 3.6" />
    </>
  ),
  // Toscana's schede brought seven more kinds. Each is drawn against the mark
  // it would otherwise be mistaken for: the melon carries an equator where the
  // pumpkin carries ribs, the shallot is twinned where the onion is single,
  // and the courgette keeps its flower, which is how it is sold.
  cardoon: (
    <>
      <path d="M12 21.4V8.2" />
      <path d="M12 8.2c-1.2-2.4-1.2-4.4 0-6.2 1.2 1.8 1.2 3.8 0 6.2Z" />
      <path d="M8.4 21.4c-1.5-3.6-1.7-7.3-.6-11 1.5 1.7 2.6 3.6 3.4 5.6" />
      <path d="M15.6 21.4c1.5-3.6 1.7-7.3.6-11-1.5 1.7-2.6 3.6-3.4 5.6" />
      <path d="M7.2 19.6h9.6" />
    </>
  ),
  courgette: (
    <>
      <path d="M6.6 19.4c-1.4-1.4-1.3-3.7.3-5.3l6.6-6.6c1.6-1.6 3.9-1.7 5.3-.3 1.4 1.4 1.3 3.7-.3 5.3l-6.6 6.6c-1.6 1.6-3.9 1.7-5.3.3Z" />
      <path d="M18.2 6.8c.5-1.3.2-2.4-.8-3.3-.6 1-1.5 1.6-2.7 1.8.3 1.2 1.1 1.8 2.4 2" />
      <path d="M9.4 15.8h.01" />
    </>
  ),
  grape: (
    <>
      <circle cx="9.2" cy="13" r="2.3" />
      <circle cx="14.8" cy="13" r="2.3" />
      <circle cx="12" cy="17.2" r="2.3" />
      <path d="M12 10.7V6.4" />
      <path d="M12 6.4c1.9-.4 3.3-1.7 3.7-3.5-1.9.4-3.3 1.7-3.7 3.5Z" />
    </>
  ),
  melon: (
    <>
      <circle cx="12" cy="14.4" r="6.6" />
      <path d="M5.4 14.4h13.2" />
      <path d="M12 7.8V5.6" />
    </>
  ),
  pomegranate: (
    <>
      <circle cx="12" cy="14.8" r="6.2" />
      <path d="M10.2 8.8V6.4h3.6v2.4" />
      <path d="M12 6.4V3.6" />
      <path d="M10.4 13.6h.01" />
      <path d="M13.6 13.6h.01" />
      <path d="M12 16.8h.01" />
    </>
  ),
  shallot: (
    <>
      <path d="M9 20.6c-2.3 0-3.9-1.6-3.9-3.8 0-2.4 1.6-4.3 3.9-6.4 2.3 2.1 3.9 4 3.9 6.4 0 2.2-1.6 3.8-3.9 3.8Z" />
      <path d="M15.6 20.6c-1.9 0-3.2-1.4-3.2-3.2 0-2 1.3-3.6 3.2-5.4 1.9 1.8 3.2 3.4 3.2 5.4 0 1.8-1.3 3.2-3.2 3.2Z" />
      <path d="M9 10.4c-.7-1.5-.6-3 .3-4.4" />
      <path d="M15.6 12c.5-1.2.4-2.4-.3-3.6" />
    </>
  ),
  spinach: (
    <>
      <path d="M12 21v-4.2" />
      <path d="M12 16.8c-1-4.4.2-8.2 3.6-11.4 2 4.2 1.2 8-3.6 11.4Z" />
      <path d="M12 16.8c-3.8-1.2-5.8-3.8-6-7.8 3.6.8 5.6 3.4 6 7.8Z" />
      <path d="M12 16.8c3.8-1.2 5.8-3.8 6-7.8-3.6.8-5.6 3.4-6 7.8Z" />
    </>
  ),
  // The apricot is in the peach's family and the mark says so — circle, crease,
  // stone-line — so the difference has to be carried by the top: peach wears a
  // leaf, plum a stub of stalk, and this one the cleft that runs down from the
  // stem into the cheeks. A pit drawn as an inner circle was the first idea and
  // it reads as the kiwi's cross-section at 22px.
  apricot: (
    <>
      <circle cx="12" cy="14.6" r="6.4" />
      <path d="M12 8.2c-1.2 1.8-1.8 3.9-1.8 6.3s.6 4.5 1.8 6.3" />
      <path d="M10.3 8.9c.7.6 1.3 1.3 1.7 2.1.4-.8 1-1.5 1.7-2.1" />
      <path d="M12 8.2V5.4" />
    </>
  ),
  cauliflower: (
    <>
      <path d="M6.6 14c-1.2 0-2.2-1-2.2-2.2 0-1.1.8-2 1.9-2.2.2-1.5 1.5-2.6 3-2.6.3 0 .6 0 .9.1.6-1.1 1.7-1.8 2.9-1.8s2.3.7 2.9 1.8c.3-.1.6-.1.9-.1 1.5 0 2.8 1.1 3 2.6 1.1.2 1.9 1.1 1.9 2.2 0 1.2-1 2.2-2.2 2.2Z" />
      <path d="M12 14v5.8" />
      <path d="M12 19.8c-2.4 0-4.2-1.4-5.4-4 2.8-.6 4.6.8 5.4 4Z" />
      <path d="M12 19.8c2.4 0 4.2-1.4 5.4-4-2.8-.6-4.6.8-5.4 4Z" />
    </>
  ),
  // Wider than the garlic and without its ribs: one shoulder line for the outer
  // skin, and the neck splits into two dry shoots. Garlic is a pointed dome on
  // a single stem, and at this size the neck is what tells them apart.
  onion: (
    <>
      <ellipse cx="12" cy="15" rx="6.4" ry="6" />
      <path d="M12 9V7.2" />
      <path d="M12 7.2c-1.6-1-2.2-2.5-1.7-4.4" />
      <path d="M12 7.2c1.6-.9 2.3-2.3 1.9-4.2" />
    </>
  ),
  // The pod lies on the diagonal with three peas showing through it, against
  // the broad bean's upright pod and two flat seeds. Both are pods, so neither
  // may be the generic one.
  pea: (
    <>
      <path d="M6.2 7.6c-1.1 5.9 3.1 10.8 11.6 11.6" />
      <path d="M6.2 7.6c4.9 1.5 8.8 5.2 11.6 11.6" />
      <path d="M9.2 12.1h.01" />
      <path d="M11.7 14.9h.01" />
      <path d="M14.3 17.2h.01" />
    </>
  ),
  'broad bean': (
    <>
      <path d="M12 3.4c-2.7 2.7-2.7 14.5 0 17.2 2.7-2.7 2.7-14.5 0-17.2Z" />
      <ellipse cx="12" cy="9.4" rx="1.7" ry="2.1" />
      <ellipse cx="12" cy="14.8" rx="1.7" ry="2.1" />
    </>
  ),
  // Ribbed and squat, where the apple is round with a leaf and the orange is
  // cut into segments: the two inner arcs are the ribs, and the stalk is the
  // stub of a cut vine.
  pumpkin: (
    <>
      <ellipse cx="12" cy="14.6" rx="7.6" ry="6.4" />
      <path d="M12 8.2c-1.6 1.8-2.4 3.9-2.4 6.4s.8 4.6 2.4 6.4" />
      <path d="M12 8.2c1.6 1.8 2.4 3.9 2.4 6.4s-.8 4.6-2.4 6.4" />
      <path d="M12 8.2V5.6" />
      <path d="M12 5.6c1.4 0 2.4-.6 3-1.8" />
    </>
  ),
  watermelon: (
    <>
      <path d="M4 8.8h16" />
      <path d="M4 8.8a8 8 0 0 0 16 0" />
      <path d="M6.6 9.8a5.4 5.4 0 0 0 10.8 0" />
      <path d="M9.9 12.6h.01" />
      <path d="M14.1 12.6h.01" />
      <path d="M12 15h.01" />
    </>
  ),
  // Upright, where the carrot lies on the diagonal: a thin root with two
  // whiskers and the grass-like blades salsify is recognised by.
  salsify: (
    <>
      <path d="M12 21.4c-1.7-3.9-2.6-7.5-2.6-10.8h5.2c0 3.3-.9 6.9-2.6 10.8Z" />
      <path d="M9.9 16c-1.6-.5-2.8-1.4-3.6-2.8" />
      <path d="M12 10.6V4.8" />
      <path d="M9.7 10.6 7.6 6.6" />
      <path d="m14.3 10.6 2.1-4" />
    </>
  ),
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
  // One fruit and a leaf, against sweet cherry's pair on a shared stem. The
  // leaf hangs left off the stem rather than continuing it: the first draft
  // had it small and trailing right, which at 24px read as a magnifying
  // glass. The long stem is also what keeps it out of peach and plum, whose
  // fruit is bigger and whose stalk is a stub. They
  // are different species and the generalised tier treats them as such, so the
  // marks must not be read as the same thing at a glance.
  'sour cherry': (
    <>
      <circle cx="11.6" cy="17.2" r="4.4" />
      <path d="M11.6 12.8c.7-4.2 2.3-7.1 4.8-8.8" />
      <path d="M13.6 8.3c-2.5.7-4.4-.1-5.7-2.5 2.5-.7 4.4.1 5.7 2.5Z" />
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
  // Wide shoulders converging to a point, and two leaves spread off the crown.
  // The first draft gave it a near-circular body and a separate taproot stroke,
  // and at 24px it read as a padlock: the body has to do the tapering itself,
  // and the leaves have to be big enough not to merge into one tuft.
  turnip: (
    <>
      <path d="M12 21.4c-2.7-2.1-4.7-4.5-4.7-7 0-2.7 2.1-4.8 4.7-4.8s4.7 2.1 4.7 4.8c0 2.5-2 4.9-4.7 7Z" />
      <path d="M12 9.6C9.5 9.2 8 7.5 7.8 5c2.5.4 4 2.1 4.2 4.6Z" />
      <path d="M12 9.6c.2-2.5 1.7-4.2 4.2-4.6-.2 2.5-1.7 4.2-4.2 4.6Z" />
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
