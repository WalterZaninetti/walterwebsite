import { heroWave, heroWaveLitFrom } from '../content/djTools';
import { cx } from './ui/cx';

/**
 * The three shelf thumbnails, drawn rather than photographed.
 *
 * Each one draws the figure its own page opens on, at thumbnail size: the
 * odds panel from `DrawOdds`, the Camelot wheel and hero wave from
 * `DjToolsPage`, the year dial and its answers from `SeasonablePage`. A
 * reader who clicks a card meets the same shape made large, which is the
 * shelf's whole premise (`direction.md` §3.2) applied to the one slot that
 * never obeyed it.
 *
 * Each is also drawn the way its page draws it, which is why one of the three
 * is not an SVG. Crate's wheel is a conic gradient — the `camelot` utility —
 * and SVG has no conic gradient, so approximating one in twelve hand-mixed
 * arcs would be a second implementation of a thing the stylesheet already
 * ships. It reuses the utility instead, and its wave reuses the same flex row
 * of bars the hero does. The other two are geometry, and stay geometry.
 *
 * All three are `aria-hidden`. They restate what the card's heading and
 * description already say in words, so an accessible name here would be a
 * duplicate read aloud — the same reasoning `ManaPips` and every figure on
 * `/dj-tools` uses.
 *
 * No numbers are drawn as text. Partly because that is what forced the magic
 * thumb to ship per language (58.8% is 58,8% in Italian), and partly because
 * the site's faces are subset to Latin-1 plus a short extras list, so a glyph
 * chosen for a figure is a glyph that may not be there — `djTools.ts:48`
 * records that being learned the hard way. The pages carry the numbers; a
 * thumbnail carries the shape they make.
 *
 * SVG geometry is authored in one 360x148 box and `slice`d to fill. The two
 * real thumb aspects are 2.55:1 (mobile, 280x110) and 2.43:1 (lg, 364x150),
 * so the crop is under 5% on one axis and every figure keeps its margin.
 */

const BOX = { viewBox: '0 0 360 148', preserveAspectRatio: 'xMidYMid slice' } as const;
const FILL = 'h-full w-full';

/**
 * Magic Tools — the draw-odds panel, which is the page's one result surface.
 *
 * The well is that panel's slab rather than a deeper crimson, so the gauge
 * lands on the ground it lands on over there: gold sweep, cream track, and
 * the three stat tiles the panel reports under a two-line sentence. The
 * middle tile takes coral because the middle stat does — it is the one that
 * counts against you, and the page has always said so in colour.
 *
 * `strokeDasharray` on a circle rather than an arc `path`: the sweep is a
 * fraction of a known circumference, so the number in the markup is the
 * percentage rather than a pair of trigonometric endpoints nobody can check.
 * It is butt-capped, not round — the page draws this as a `conic-gradient`,
 * which has no caps, and a rounded sweep would overstate its own end.
 */
const GAUGE_R = 46;
const GAUGE_C = 2 * Math.PI * GAUGE_R;
const HIT = 0.588;

/** x, and whether this is the stat that gets the coral. Page order. */
const STATS = [
  { x: 140, coral: false },
  { x: 209, coral: true },
  { x: 278, coral: false },
];

export function MagicThumb() {
  return (
    <svg {...BOX} className={FILL} aria-hidden="true" fill="none">
      <g transform="translate(70 74)">
        <circle
          r={GAUGE_R}
          stroke="var(--project-magic-thumb-fg)"
          strokeOpacity="0.14"
          strokeWidth="12"
        />
        <circle
          r={GAUGE_R}
          stroke="var(--project-magic-gauge)"
          strokeWidth="12"
          strokeDasharray={`${GAUGE_C * HIT} ${GAUGE_C}`}
          transform="rotate(-90)"
        />
      </g>

      {/* The sentence over the tiles — two lines, because that is how many it
          wraps to at the width the panel gives it. */}
      <rect x="140" y="33" width="196" height="7" rx="3.5" fill="var(--project-magic-thumb-fg)" fillOpacity="0.9" />
      <rect x="140" y="48" width="132" height="7" rx="3.5" fill="var(--project-magic-thumb-fg)" fillOpacity="0.9" />

      {STATS.map((stat) => (
        <g key={stat.x}>
          <rect
            x={stat.x}
            y="68"
            width="62"
            height="47"
            rx="6"
            fill="var(--project-magic-thumb-fg)"
            fillOpacity="0.07"
          />
          <rect
            x={stat.x + 11}
            y="81"
            width="28"
            height="4"
            rx="2"
            fill="var(--project-magic-thumb-fg)"
            fillOpacity="0.55"
          />
          <rect
            x={stat.x + 11}
            y="92"
            width="40"
            height="11"
            rx="3"
            fill={stat.coral ? 'var(--project-magic-coral)' : 'var(--project-magic-thumb-fg)'}
          />
        </g>
      ))}
    </svg>
  );
}

/**
 * Crate — the Camelot wheel, and the hero wave beside it.
 *
 * Two figures rather than one because Crate is two claims — mixes in key,
 * mixes in tempo — and either alone reads as half the tool.
 *
 * The wheel is the page's own sweep with the page's own hub punched out of
 * it, and the twelve keys sit around it as twelve dots. Three are lit: `8A`
 * and its two numeric neighbours, the adjacency rule `dj.does.harmonic.body`
 * states in words and the same three `CamelotFigure` sets in bold. Dots
 * rather than labels because `1A…12A` is unreadable at 12px and the ring
 * itself carries no lit state to fall back on — the sweep means "these are
 * neighbours", not "this one".
 *
 * The wave is `heroWave` itself, not a copy of its shape. It is already in
 * this bundle: `/dj-tools` is eager for the same reason the shelf is.
 */
const CAMELOT_LIT = new Set([6, 7, 8]);

export function CrateThumb() {
  return (
    <div aria-hidden="true" className="flex h-full w-full items-center gap-4 px-4 lg:gap-6 lg:px-6">
      {/* The dot ring is one set of angles at both sizes: --dot-r carries the
          radius and the transform multiplies it, so the breakpoint moves one
          number rather than twenty-four. Absolutely positioned grid children
          are still centred by the container, which is the trick
          `CamelotFigure` uses to hang its labels off the same centre. */}
      <div className="relative grid size-[88px] shrink-0 place-items-center [--dot-r:39px] lg:size-[122px] lg:[--dot-r:55px]">
        <span className="camelot-thumb grid size-[62px] place-items-center rounded-full lg:size-[88px]">
          <span className="size-[31px] rounded-full bg-project-dj-badge lg:size-[43px]" />
        </span>
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
          const lit = CAMELOT_LIT.has(i);
          return (
            <span
              key={i}
              style={{
                transform: `translate(calc(var(--dot-r) * ${Math.cos(angle).toFixed(4)}), calc(var(--dot-r) * ${Math.sin(angle).toFixed(4)}))`,
              }}
              className={cx(
                'absolute rounded-full',
                lit
                  ? 'size-[4.5px] bg-project-dj-fg lg:size-[6px]'
                  : 'size-[3px] bg-project-dj-body/35 lg:size-[4px]',
              )}
            />
          );
        })}
      </div>

      <div className="flex h-[62px] min-w-0 flex-1 items-end gap-px lg:h-[86px]">
        {heroWave.map((height, index) => (
          <span
            key={index}
            style={{ height: `${height}%` }}
            className={cx(
              'min-h-[2px] flex-1 rounded-t-[1px]',
              height >= heroWaveLitFrom ? 'bg-project-dj-accent' : 'bg-project-dj-wave',
            )}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Seasonable — the year dial, and the answers it points at.
 *
 * This thumb has followed the page twice now. It drew four horizontal strips
 * while the page drew strips, then a double-entry table when the page became
 * one, and the page has since turned the year into a clock: a ring of
 * twenty-four fortnights under a hand, and beside it the designations open in
 * the fortnight the hand is on. That pairing is the whole page, so it is the
 * whole thumbnail — a ring alone would be a year with nothing in it.
 *
 * The ring's four rungs are `--project-food-heat-*` themselves, not a ramp
 * mixed to suit this well. They measure 2.16 to 4.46:1 on it in light and
 * 3.01 to 8.21:1 in dark, against 3.18 to 6.54:1 on the lane they were solved
 * for — a shallower spread in light, and the right one to accept: 1.4.11's 3:1
 * governs a mark that carries meaning, and this one carries none. A ramp that
 * cleared the floor at every step needed its quiet end pushed so dark that the
 * ring stopped being one green getting darker, which is the only thing the
 * figure is for. Zero stays the empty track, so nothing here reads as absence.
 *
 * Three rows, because a province answers a handful and never a list: the
 * densest in the catalogue answers five, Cuneo answers three, and a thumbnail
 * that showed a dozen would promise a directory. Their glyph wells hold a mark
 * rather than a produce
 * glyph — a chestnut and a bean are the same blob at 22px, and shipping
 * `produceGlyphs` to the homepage to draw that blob would be 10kB for a
 * shape nobody can name. The bar widths carry the only thing that reads at
 * this size, which is that the three rows are three different things.
 */
const DIAL_X = 76;
const DIAL_Y = 74;
const DIAL_R = 44;
const DIAL_C = 2 * Math.PI * DIAL_R;
const DIAL_ARC = DIAL_C / 24;

/** The dial's own ramp, saturating at four. Zero is the empty track. */
const HEAT = [
  null,
  'var(--project-food-heat-1)',
  'var(--project-food-heat-2)',
  'var(--project-food-heat-3)',
  'var(--project-food-heat-4)',
] as const;

/** A year that fills toward the harvest and empties over winter. */
const COUNTS = [1, 1, 0, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 3, 3, 4, 4, 3, 2, 2, 1, 1, 1];

/** 1–15 September, the fortnight `/seasonable` opens on today. */
const NOW = 16;

const ROW_Y = [19, 57, 95];
const NAME_W = [80, 72, 64];
const NOTE_W = [58, 66, 50];
/** Two at peak take the filled rust pill, one starting takes the outline. */
const ROW_PEAK = [true, true, false];

/** Where the middle of half-month `h` sits on the ring, in radians from 12. */
const angleOf = (h: number) => ((h + 0.5) / 24) * 2 * Math.PI - Math.PI / 2;

export function SeasonableThumb() {
  const hand = angleOf(NOW);

  return (
    <svg {...BOX} className={FILL} aria-hidden="true" fill="none">
      <circle
        cx={DIAL_X}
        cy={DIAL_Y}
        r={DIAL_R}
        stroke="var(--project-food-thumb-fg)"
        strokeOpacity="0.1"
        strokeWidth="15"
      />
      {COUNTS.map((count, h) => {
        const heat = HEAT[Math.min(4, count)];
        return heat === null ? null : (
          <circle
            key={h}
            cx={DIAL_X}
            cy={DIAL_Y}
            r={DIAL_R}
            stroke={heat}
            strokeWidth="15"
            strokeDasharray={`${DIAL_ARC - 1.4} ${DIAL_C - DIAL_ARC + 1.4}`}
            strokeDashoffset={-h * DIAL_ARC}
            transform={`rotate(-90 ${DIAL_X} ${DIAL_Y})`}
          />
        );
      })}

      {/* The month axis, abstracted to twelve ticks — the ring's own labels
          are twelve three-letter words and none of them survive this size.
          The one the hand is standing in is the one the page sets bold. */}
      {Array.from({ length: 12 }, (_, m) => {
        const a = angleOf(m * 2 + 0.5);
        const here = m === Math.floor(NOW / 2);
        return (
          <line
            key={m}
            x1={DIAL_X + Math.cos(a) * 57}
            y1={DIAL_Y + Math.sin(a) * 57}
            x2={DIAL_X + Math.cos(a) * 61.5}
            y2={DIAL_Y + Math.sin(a) * 61.5}
            stroke="var(--project-food-thumb-fg)"
            strokeOpacity={here ? 0.9 : 0.35}
            strokeWidth={here ? 2.2 : 1.6}
            strokeLinecap="round"
          />
        );
      })}

      {/* Hand first, hub over it: the hub is what turns a radius into a hand,
          exactly as the dial's own `--surface` disc does. Rust over green is
          1.4:1 wherever the hand crosses the ring, on the page as much as
          here, so the reading is the dot — and the dot is given its own lane
          outside the ring, between the arcs and the month ticks. */}
      <line
        x1={DIAL_X}
        y1={DIAL_Y}
        x2={DIAL_X + Math.cos(hand) * 53}
        y2={DIAL_Y + Math.sin(hand) * 53}
        stroke="var(--accent)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle
        cx={DIAL_X + Math.cos(hand) * 53}
        cy={DIAL_Y + Math.sin(hand) * 53}
        r="3.5"
        fill="var(--accent)"
      />
      <circle cx={DIAL_X} cy={DIAL_Y} r="31" fill="var(--project-food-thumb)" />

      {ROW_Y.map((y, i) => (
        <g key={y}>
          <rect
            x="158"
            y={y}
            width="188"
            height="34"
            rx="8"
            stroke="var(--project-food-thumb-fg)"
            strokeOpacity="0.18"
          />
          <circle
            cx="179"
            cy={y + 17}
            r="11"
            fill="var(--project-food-thumb-fg)"
            fillOpacity="0.12"
          />
          <circle
            cx="179"
            cy={y + 17}
            r="4"
            fill="var(--project-food-thumb-fg)"
            fillOpacity="0.55"
          />
          <rect
            x="200"
            y={y + 11}
            width={NAME_W[i]}
            height="6"
            rx="3"
            fill="var(--project-food-thumb-fg)"
          />
          <rect
            x="200"
            y={y + 21}
            width={NOTE_W[i]}
            height="4"
            rx="2"
            fill="var(--project-food-thumb-fg)"
            fillOpacity="0.55"
          />
          <rect
            x="290"
            y={y + 9.5}
            width="42"
            height="15"
            rx="7.5"
            fill={ROW_PEAK[i] ? 'var(--accent)' : 'none'}
            stroke={ROW_PEAK[i] ? 'none' : 'var(--project-food-thumb-fg)'}
            strokeOpacity="0.5"
            strokeWidth="1.2"
          />
        </g>
      ))}
    </svg>
  );
}
