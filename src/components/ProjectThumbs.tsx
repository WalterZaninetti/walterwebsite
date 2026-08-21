/**
 * The three shelf thumbnails, drawn rather than photographed.
 *
 * What they replaced, and why each was worth replacing:
 *
 *   magic  a PNG screenshot of the draw-odds panel, shipped twice because the
 *          tool's own words were baked into the pixels. 34kB of raster across
 *          two files to say one thing, and it went stale the moment the panel
 *          moved.
 *   dj     a conic-gradient blob with a pill reading "camelot wheel" — a label
 *          apologising for a shape that wasn't one.
 *   food   a caption reading "produce still life", over a hatch. The photo it
 *          named was never taken, so the card had been shipping the alt text
 *          for an image that did not exist.
 *
 * Each one now draws the figure the tool's own page draws, at thumbnail size:
 * the probability arc from the odds panel, the Camelot ring from
 * `DjToolsPage`'s `CamelotFigure`, the year strip from `SeasonablePage`'s
 * `YearStrip`. A reader who clicks a card meets the same shape made large,
 * which is the shelf's whole premise (`direction.md` §3.2) applied to the one
 * slot that never obeyed it.
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
 * records that being learned the hard way.
 *
 * Geometry is authored in one 360x148 box and `slice`d to fill. The two real
 * thumb aspects are 2.55:1 (mobile, 280x110) and 2.43:1 (lg, 364x150), so the
 * crop is under 5% on one axis and every figure keeps its margin.
 */

const BOX = { viewBox: '0 0 360 148', preserveAspectRatio: 'xMidYMid slice' } as const;
const FILL = 'h-full w-full';

/**
 * Magic Tools — the draw-odds arc, and the three results it splits into.
 *
 * The arc is the tool's actual output: draw seven from sixty and this much of
 * the circle is the chance you hit. Under it, the three stats the panel
 * reports — at least three, exactly three, fewer than three — as three bars,
 * because their relative length is the only part of that reading a thumbnail
 * can carry honestly.
 *
 * `strokeDasharray` on a circle rather than an arc `path`: the sweep is a
 * fraction of a known circumference, so the number in the markup is the
 * percentage rather than a pair of trigonometric endpoints nobody can check.
 */
export function MagicThumb() {
  const r = 34;
  const circumference = 2 * Math.PI * r;
  const hit = 0.588;

  return (
    <svg {...BOX} className={FILL} aria-hidden="true" fill="none">
      <g transform="translate(74 74)">
        <circle
          r={r}
          stroke="var(--project-magic-body)"
          strokeOpacity="0.28"
          strokeWidth="13"
        />
        <circle
          r={r}
          stroke="var(--project-magic-accent)"
          strokeWidth="13"
          strokeLinecap="round"
          strokeDasharray={`${circumference * hit} ${circumference}`}
          transform="rotate(-90)"
        />
      </g>

      {/* The three results. First is the headline figure and takes the accent;
          the other two are the split beneath it and step down to body. */}
      {[
        { y: 50, w: 150, lit: true },
        { y: 74, w: 79, lit: false },
        { y: 98, w: 106, lit: false },
      ].map((bar) => (
        <g key={bar.y}>
          <rect
            x="140"
            y={bar.y}
            width="176"
            height="10"
            rx="5"
            fill="var(--project-magic-body)"
            fillOpacity="0.2"
          />
          <rect
            x="140"
            y={bar.y}
            width={bar.w}
            height="10"
            rx="5"
            fill={bar.lit ? 'var(--project-magic-accent)' : 'var(--project-magic-body)'}
            fillOpacity={bar.lit ? 1 : 0.62}
          />
        </g>
      ))}
    </svg>
  );
}

/**
 * Crate — the Camelot ring, and the tempo pile beside it.
 *
 * Twelve keys around the wheel with `8A` and its two numeric neighbours lit:
 * the adjacency rule `dj.does.harmonic.body` states in words, and the same
 * three the page's own `CamelotFigure` lights. The bars are the BPM
 * distribution from `bpmHistogram` — the shape of a library that piles up
 * around one tempo, which is the observation the whole tool is built on.
 *
 * Two figures rather than one because Crate is two claims — mixes in key,
 * mixes in tempo — and either alone reads as half the tool.
 */
const CAMELOT_LIT = new Set([6, 7, 8]);
const TEMPO = [16, 26, 38, 34, 52, 74, 96, 88, 62, 40, 30, 20, 14];
const TEMPO_LIT = new Set([5, 6, 7]);

export function CrateThumb() {
  const cx = 74;
  const cy = 74;
  const r = 40;
  const stroke = 12;
  // A twelfth of the ring, less a gap, expressed as a dash pattern so the
  // twelve segments are one circle rather than twelve hand-placed arcs.
  const circumference = 2 * Math.PI * r;
  const step = circumference / 12;

  return (
    <svg {...BOX} className={FILL} aria-hidden="true" fill="none">
      {Array.from({ length: 12 }, (_, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          stroke={CAMELOT_LIT.has(i) ? 'var(--project-dj-accent)' : 'var(--project-dj-body)'}
          strokeOpacity={CAMELOT_LIT.has(i) ? 1 : 0.34}
          strokeWidth={stroke}
          strokeDasharray={`${step - 4} ${circumference - step + 4}`}
          strokeDashoffset={-i * step}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      ))}

      {TEMPO.map((h, i) => (
        <rect
          key={i}
          x={160 + i * 15}
          y={118 - h}
          width="10"
          height={h}
          rx="2"
          fill={TEMPO_LIT.has(i) ? 'var(--project-dj-accent)' : 'var(--project-dj-body)'}
          fillOpacity={TEMPO_LIT.has(i) ? 1 : 0.38}
        />
      ))}
      <rect x="160" y="124" width="187" height="2" rx="1" fill="var(--project-dj-body)" fillOpacity="0.3" />
    </svg>
  );
}

/**
 * Seasonable — the year strip, which is the page's signature and now the
 * card's too.
 *
 * Four rows, each the whole year in twenty-four half-month segments, and one
 * vertical line cutting through all of them at the selected fortnight. The
 * page's `YearStrip` reasoning transfers intact, including the part that
 * matters most: the three window kinds are three *geometries*, not three
 * colours — solid full height for open field, a third-height bar for stored,
 * a hairline for the year itself. Print it in greyscale and every row still
 * parses, which is what satisfies SC 1.4.1 rather than a legend claiming to.
 *
 * The third row wraps the year end to start, because a real window does
 * (`aglio-polesano` runs July to the following June) and a thumbnail that
 * only ever showed contiguous blocks would be quietly lying about the shape
 * of the data.
 */
const SEGMENTS = 24;
const STRIP_X = 18;
const STRIP_W = 324;
const SEG = STRIP_W / SEGMENTS;

/** [from, to] inclusive; from > to wraps the year, exactly as `covers()` reads it. */
const ROWS: readonly { span: readonly [number, number]; stored?: boolean }[] = [
  { span: [3, 11] },
  { span: [8, 17] },
  { span: [20, 5] },
  { span: [1, 14], stored: true },
];
const NOW = 9;

/**
 * A window as one rect per contiguous run, never one per half-month.
 *
 * The page's `YearStrip` gets away with twenty-four sibling elements because
 * flexbox lays them out on whole pixels. In SVG each segment lands on a
 * fractional x, and the rasteriser leaves a hairline of ground between every
 * pair — which turned a solid nine-month window into something that read as
 * dashed. A wrapping window is the only case that yields two runs.
 */
function runs([from, to]: readonly [number, number]): [number, number][] {
  return from <= to
    ? [[from, to - from + 1]]
    : [
        [from, SEGMENTS - from],
        [0, to + 1],
      ];
}

export function SeasonableThumb() {
  return (
    <svg {...BOX} className={FILL} aria-hidden="true" fill="none">
      {ROWS.map((row, rowIndex) => {
        const y = 28 + rowIndex * 31;
        return (
          <g key={rowIndex}>
            {/* The track: the whole year is always visible, whether or not
                anything is growing in it. */}
            <rect
              x={STRIP_X}
              y={y + 11}
              width={STRIP_W}
              height="1.5"
              fill="var(--project-food-accent)"
            />
            {runs(row.span).map(([from, count], i) => (
              <rect
                key={i}
                x={STRIP_X + from * SEG}
                y={row.stored ? y + 8 : y}
                width={count * SEG}
                height={row.stored ? 4.5 : 12.5}
                fill={row.stored ? 'var(--project-food-meta)' : 'var(--project-food-fg)'}
              />
            ))}
          </g>
        );
      })}

      {/* Now. An inked core with a well-coloured edge either side, because a
          plain rule disappears exactly where it crosses a filled segment —
          the measurement that produced this construction is recorded at
          SeasonablePage.tsx's YearStrip. */}
      <rect
        x={STRIP_X + (NOW + 0.5) * SEG - 3}
        y="18"
        width="6"
        height="120"
        fill="var(--project-food-thumb)"
      />
      <rect
        x={STRIP_X + (NOW + 0.5) * SEG - 1}
        y="18"
        width="2"
        height="120"
        fill="var(--project-food-fg)"
      />
    </svg>
  );
}
