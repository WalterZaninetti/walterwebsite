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
 * Seasonable — the season table, which is the page's signature and now the
 * card's too.
 *
 * It drew the year as four horizontal strips for one iteration, because that
 * is what the page drew. The page stopped: a strip shows the *shape* of a
 * window and carries no axis, so a reader can see that something ends two
 * thirds of the way along and still not know whether that means August or
 * September. The answer there is now a double-entry table — a designation per
 * row, a month per column — and the thumbnail follows it rather than
 * preserving a figure the destination no longer has.
 *
 * Four rows, twelve month columns, each column split into its two fortnights,
 * and one accent rule down the column the reader is standing in. The left
 * block stands in for the designation column: real names would be four
 * unreadable words at this size, and four bars say "this axis is labelled"
 * without pretending to be legible.
 *
 * The three kinds stay three geometries — full-height for open field, a low
 * bar for storage. Row three wraps the year end to start, because a real
 * window does (Aglio Bianco Polesano runs July to the following June) and a
 * thumbnail that only ever showed contiguous blocks would be quietly lying
 * about the shape of the data.
 */
const GRID_X = 116;
const COL_W = 19.2;
const CELL_PAD = 1.4;
const HALF_W = (COL_W - CELL_PAD * 2 - 1) / 2;
const ROW_Y = [50, 74, 98, 122];
const NAME_W = [88, 70, 82, 60];

/** [from, to] inclusive; from > to wraps the year, exactly as `covers()` reads it. */
const ROWS: readonly { span: readonly [number, number]; stored?: boolean }[] = [
  { span: [4, 12] },
  { span: [9, 18] },
  { span: [21, 6] },
  { span: [2, 15], stored: true },
];
const NOW = 9;

export function SeasonableThumb() {
  const covers = ([from, to]: readonly [number, number], h: number) =>
    from <= to ? h >= from && h <= to : h >= from || h <= to;

  const halfX = (h: number) =>
    GRID_X + Math.floor(h / 2) * COL_W + CELL_PAD + (h % 2 === 1 ? HALF_W + 1 : 0);

  return (
    <svg {...BOX} className={FILL} aria-hidden="true" fill="none">
      {/* The month axis, abstracted to twelve ticks. */}
      {Array.from({ length: 12 }, (_, m) => (
        <rect
          key={m}
          x={GRID_X + m * COL_W + CELL_PAD}
          y="28"
          width={COL_W - CELL_PAD * 2}
          height="3"
          rx="1.5"
          fill="var(--project-food-accent)"
        />
      ))}

      {/* The designation column: four bars, not four unreadable words. */}
      {ROW_Y.map((y, i) => (
        <rect
          key={i}
          x="16"
          y={y - 3}
          width={NAME_W[i]}
          height="6"
          rx="3"
          fill="var(--project-food-accent)"
        />
      ))}

      {ROWS.map((row, i) =>
        Array.from({ length: 24 }, (_, h) =>
          covers(row.span, h) ? (
            <rect
              key={`${i}-${h}`}
              x={halfX(h)}
              y={row.stored ? ROW_Y[i] + 2 : ROW_Y[i] - 7}
              width={HALF_W}
              height={row.stored ? 4 : 14}
              rx="1"
              fill={row.stored ? 'var(--project-food-meta)' : 'var(--project-food-fg)'}
            />
          ) : null,
        ),
      )}

      {/* Where you are standing. One rule down every row, at the left edge of
          the selected fortnight — an axis, never a cell that could be mistaken
          for a window. */}
      <rect x={halfX(NOW) - 1} y="22" width="2" height="114" fill="var(--accent)" />
    </svg>
  );
}
