import { useMemo, useState } from 'react';
import { magic } from '../../content/magic';
import {
  clampInput,
  computeOdds,
  describeOdds,
  formatPercent,
  type DeckInput,
} from '../../lib/hypergeometric';

const copy = magic.odds;

/** Runs entirely in the browser — it's a closed-form calculation, not a lookup. */
export function DrawOdds() {
  const [raw, setRaw] = useState<DeckInput>({ deck: 60, copies: 24, draws: 7, atLeast: 3 });

  const odds = useMemo(() => computeOdds(raw), [raw]);
  const { deck, copies, draws, atLeast } = odds.input;
  const set = (patch: Partial<DeckInput>) => setRaw((prev) => clampInput({ ...prev, ...patch }));

  const peak = Math.max(...odds.distribution, 1e-9);
  const drawMax = Math.min(deck, 40);

  // Cumulative table: P(X ≥ k), walked down from 1 by subtracting each P(X = k).
  const cumulative = useMemo(() => {
    const rows: { k: number; p: number }[] = [];
    let acc = 1;
    for (let k = 0; k < odds.distribution.length && rows.length < 9; k += 1) {
      rows.push({ k, p: acc });
      acc -= odds.distribution[k];
    }
    return rows;
  }, [odds.distribution]);

  return (
    <section id="odds" className="scroll-mt-[70px] px-5 pt-10 pb-12 md:px-10 md:pt-13 md:pb-15">
      <SectionHead index={copy.index} heading={copy.heading} blurb={copy.blurb} />

      <div className="grid items-start gap-[22px] lg:grid-cols-[340px_1fr]">
        {/* ---------------- controls ---------------- */}
        <div className="flex flex-col gap-[18px] rounded-[14px] border border-magic-rule bg-magic-card p-[22px]">
          <Field label={copy.deckLabel} value={String(deck)}>
            <input
              type="number"
              min={1}
              max={1000}
              value={deck}
              onChange={(e) => set({ deck: Number(e.target.value) || 1 })}
              className="box-border h-11 rounded-[9px] border border-magic-field bg-magic-paper px-3.5 font-mono text-[16px] font-medium text-magic-ink outline-none focus:border-magic-green focus:bg-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <div className="flex gap-[7px]">
              {copy.deckPresets.map((value) => (
                <Preset key={value} onClick={() => set({ deck: value })} className="flex-1">
                  {value}
                </Preset>
              ))}
            </div>
          </Field>

          <Field label={copy.copiesLabel} value={String(copies)}>
            <input
              type="range"
              min={1}
              max={deck}
              value={copies}
              onChange={(e) => set({ copies: Number(e.target.value) })}
              className="w-full accent-magic-green"
            />
            <p className="m-0 font-mono text-[11.5px]/[1.5] text-magic-ink-faint">
              {copy.copiesHint}
            </p>
          </Field>

          <Field label={copy.drawsLabel} value={String(draws)}>
            <input
              type="range"
              min={1}
              max={drawMax}
              value={draws}
              onChange={(e) => set({ draws: Number(e.target.value) })}
              className="w-full accent-magic-green"
            />
            <div className="flex flex-wrap gap-[7px]">
              {copy.drawPresets.map((preset) => (
                <Preset key={preset.label} onClick={() => set({ draws: preset.value })}>
                  {preset.label}
                </Preset>
              ))}
            </div>
          </Field>

          <div className="flex flex-col gap-[9px] border-t border-magic-rule-soft pt-[18px]">
            <Label>{copy.atLeastLabel}</Label>
            <div className="flex items-center gap-2.5">
              <Stepper onClick={() => set({ atLeast: atLeast - 1 })} label="One fewer">
                −
              </Stepper>
              <span className="flex-1 text-center font-mono text-[26px]/none font-medium text-magic-ink">
                {atLeast}
              </span>
              <Stepper onClick={() => set({ atLeast: atLeast + 1 })} label="One more">
                +
              </Stepper>
            </div>
          </div>
        </div>

        {/* ---------------- results ---------------- */}
        <div className="flex flex-col gap-[22px]">
          <div className="grid items-center gap-[30px] rounded-[14px] bg-magic-ink p-[26px] text-magic-cream sm:grid-cols-[auto_1fr]">
            <Gauge percent={odds.atLeastP} atLeast={atLeast} />
            <div>
              <p className="mb-[18px] font-magic-body text-[24px]/[1.4] italic text-pretty">
                {describeOdds(odds)}
              </p>
              <div className="grid gap-3.5 sm:grid-cols-3">
                <Stat label={`Exactly ${atLeast}`} value={formatPercent(odds.exactlyP)} />
                <Stat
                  label={`Fewer than ${atLeast}`}
                  value={formatPercent(odds.fewerP)}
                  className="text-magic-coral"
                />
                <Stat label="Expected hits" value={odds.expected.toFixed(2)} />
              </div>
            </div>
          </div>

          <div className="rounded-[14px] border border-magic-rule bg-magic-card p-6">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
              <Label>{copy.distributionLabel}</Label>
              <div className="flex gap-4 font-mono text-[10.5px] text-magic-ink-faint">
                <LegendKey className="bg-magic-green">{copy.legendHit}</LegendKey>
                <LegendKey className="bg-magic-bar-short">{copy.legendShort}</LegendKey>
              </div>
            </div>
            <div className="flex h-[190px] items-end gap-[5px]">
              {odds.distribution.map((p, i) => {
                const hit = i >= atLeast;
                return (
                  <div
                    key={i}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-[7px]"
                  >
                    <span className="font-mono text-[10px] font-medium text-magic-ink-muted">
                      {p >= 0.005 ? `${Math.round(p * 100)}%` : ''}
                    </span>
                    <div
                      className={`min-h-[2px] w-full rounded-t-[4px] transition-[height] duration-[250ms] ${
                        hit
                          ? i === atLeast
                            ? 'bg-magic-green-deep'
                            : 'bg-magic-green'
                          : 'bg-magic-bar-short'
                      }`}
                      style={{ height: `${Math.max(1.5, (p / peak) * 100)}%` }}
                    />
                    <span
                      className={`font-mono text-[11px] font-medium ${
                        hit ? 'text-magic-green-deep' : 'text-magic-ink-fainter'
                      }`}
                    >
                      {i}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[14px] border border-magic-rule bg-magic-card p-6">
            <Label className="mb-4 block">{copy.cumulativeLabel}</Label>
            <div className="flex flex-col">
              {cumulative.map(({ k, p }) => {
                const current = k === atLeast;
                return (
                  <div
                    key={k}
                    className="grid grid-cols-[54px_1fr_62px] items-center gap-3.5 border-t border-magic-rule-faint py-[9px] sm:grid-cols-[70px_1fr_62px]"
                  >
                    <span
                      className={`font-mono text-[12px] font-medium ${
                        current ? 'text-magic-ink' : 'text-magic-ink-muted'
                      }`}
                    >
                      ≥ {k}
                    </span>
                    <span className="relative h-2 overflow-hidden rounded-pill bg-magic-rule-faint">
                      <span
                        className={`absolute inset-y-0 left-0 rounded-pill ${
                          current ? 'bg-magic-green-deep' : 'bg-magic-green-mid'
                        }`}
                        style={{ width: `${Math.round(p * 100)}%` }}
                      />
                    </span>
                    <span
                      className={`text-right font-mono text-[12px] font-medium ${
                        current ? 'text-magic-ink' : 'text-magic-ink-muted'
                      }`}
                    >
                      {formatPercent(p)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- pieces */

export function SectionHead({
  index,
  heading,
  blurb,
  dark = false,
}: {
  index: string;
  heading: string;
  blurb: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`mb-7 flex flex-col items-baseline justify-between gap-4 border-b pb-4 md:flex-row md:gap-[30px] ${
        dark ? 'border-magic-cream/25' : 'border-magic-rule'
      }`}
    >
      <div className="flex items-baseline gap-3.5">
        <span
          className={`font-mono text-[11px] font-medium tracking-[0.18em] ${
            dark ? 'text-magic-green-light' : 'text-magic-green'
          }`}
        >
          {index}
        </span>
        <h2
          className={`font-magic-display text-[26px]/[1.1] font-semibold tracking-[0.01em] md:text-[30px] ${
            dark ? 'text-magic-cream' : 'text-magic-ink'
          }`}
        >
          {heading}
        </h2>
      </div>
      <p
        className={`max-w-[30em] font-magic-body text-[13.5px]/[1.65] text-pretty ${
          dark ? 'text-magic-cream-dim' : 'text-magic-ink-muted'
        }`}
      >
        {blurb}
      </p>
    </div>
  );
}

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-magic-ink-muted ${className}`}
    >
      {children}
    </span>
  );
}

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[9px]">
      <div className="flex items-baseline justify-between">
        <Label>{label}</Label>
        <span className="font-mono text-[11px] font-medium text-magic-green">{value}</span>
      </div>
      {children}
    </div>
  );
}

function Preset({
  onClick,
  className = '',
  children,
}: {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 cursor-pointer rounded-pill border border-magic-field bg-white px-3 font-mono text-[11px] font-medium text-magic-ink-muted transition-colors hover:border-magic-green hover:text-magic-green-deep ${className}`}
    >
      {children}
    </button>
  );
}

function Stepper({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="size-10 cursor-pointer rounded-[9px] border border-magic-field bg-white font-mono text-[17px] font-medium text-magic-green-deep transition-colors hover:border-magic-green"
    >
      {children}
    </button>
  );
}

function Gauge({ percent, atLeast }: { percent: number; atLeast: number }) {
  return (
    <div
      className="grid size-[168px] place-items-center rounded-full justify-self-center"
      style={{
        background: `conic-gradient(var(--color-magic-green-light) ${Math.round(
          percent * 360,
        )}deg, rgb(255 251 213 / 0.14) 0)`,
      }}
    >
      <div className="grid size-[130px] place-items-center rounded-full bg-magic-ink text-center">
        <div>
          <p className="font-mono text-[38px]/none font-medium tracking-[-0.03em] text-white">
            {formatPercent(percent)}
          </p>
          <p className="mt-1.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.16em] text-magic-cream-dimmer">
            at least {atLeast}
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  className = 'text-white',
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="rounded-[10px] bg-magic-cream/7 px-4 py-3.5">
      <p className="mb-1.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] text-magic-cream-dimmer">
        {label}
      </p>
      <p className={`font-mono text-[21px]/none font-medium ${className}`}>{value}</p>
    </div>
  );
}

function LegendKey({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`size-2.5 rounded-[2px] ${className}`} />
      {children}
    </span>
  );
}
