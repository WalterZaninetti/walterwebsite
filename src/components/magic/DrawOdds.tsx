import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { magic } from '../../content/magic';
import {
  clampInput,
  computeOdds,
  formatNumber,
  formatPercent,
  thingKey,
  type DeckInput,
} from '../../lib/hypergeometric';
import { cx } from '../ui/cx';
import {
  ChartHead,
  Choice,
  Field,
  Label,
  Meter,
  Rail,
  Section,
  SectionHead,
  Verdict,
} from './controls';

/** Runs entirely in the browser — it's a closed-form calculation, not a lookup. */
export function DrawOdds() {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? 'en';
  const [raw, setRaw] = useState<DeckInput>({ deck: 60, copies: 24, draws: 7, atLeast: 3 });

  const odds = useMemo(() => computeOdds(raw), [raw]);
  const { deck, copies, draws, atLeast } = odds.input;
  const set = (patch: Partial<DeckInput>) => setRaw((prev) => clampInput({ ...prev, ...patch }));

  const peak = Math.max(...odds.distribution, 1e-9);
  const drawMax = Math.min(deck, 40);

  // Cumulative table: P(X >= k), walked down from 1 by subtracting each P(X = k).
  // Rendered as "k+" rather than "≥ k": U+2265 is outside the latin subset every
  // face here ships, so it fell back to a system font in a 54px mono column.
  // "3+" is shorter, in-subset, reads the same in both languages, and the label
  // above the column already says "at least n".
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
    <Section id="odds">
      <SectionHead
        kicker={t('magic.odds.kicker')}
        heading={t('magic.odds.heading')}
        blurb={t('magic.odds.blurb')}
      />

      <div className="grid items-start gap-x-14 gap-y-10 md:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <Rail>
          <Field label={t('magic.odds.deckLabel')} value={String(deck)}>
            <div className="flex gap-1.5">
              {magic.deckPresets.map((value) => (
                <Choice
                  key={value}
                  active={deck === value}
                  onClick={() => set({ deck: value })}
                  className="flex-1 px-0"
                >
                  {value}
                </Choice>
              ))}
            </div>
          </Field>

          <Field
            label={t('magic.odds.copiesLabel')}
            value={String(copies)}
            hint={t('magic.odds.copiesHint')}
          >
            <input
              type="range"
              min={1}
              max={deck}
              value={copies}
              aria-label={t('magic.odds.copiesLabel')}
              onChange={(e) => set({ copies: Number(e.target.value) })}
              className="w-full accent-magic-accent-fill"
            />
          </Field>

          <Field label={t('magic.odds.drawsLabel')} value={String(draws)}>
            <input
              type="range"
              min={1}
              max={drawMax}
              value={draws}
              aria-label={t('magic.odds.drawsLabel')}
              onChange={(e) => set({ draws: Number(e.target.value) })}
              className="w-full accent-magic-accent-fill"
            />
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {magic.drawPresets.map((preset) => (
                <Choice
                  key={preset.key}
                  active={draws === preset.value}
                  onClick={() => set({ draws: preset.value })}
                >
                  {t(`magic.odds.${preset.key}`)}
                </Choice>
              ))}
            </div>
          </Field>

          <div>
            <Label className="mb-3 block">{t('magic.odds.atLeastLabel')}</Label>
            <div className="flex items-center gap-2.5">
              <Stepper
                onClick={() => set({ atLeast: atLeast - 1 })}
                label={t('magic.odds.oneFewer')}
              >
                −
              </Stepper>
              <span className="flex-1 text-center text-magic-count font-bold">{atLeast}</span>
              <Stepper onClick={() => set({ atLeast: atLeast + 1 })} label={t('magic.odds.oneMore')}>
                +
              </Stepper>
            </div>
          </div>
        </Rail>

        <div className="min-w-0">
          <Verdict figure={formatPercent(odds.atLeastP, locale)}>
            <p className="m-0 text-magic-lead text-pretty">
              {t('magic.odds.sentence', {
                draws,
                deck,
                atLeast,
                thing: t(`magic.odds.${thingKey(copies)}`),
              })}
            </p>
          </Verdict>

          <div className="mb-11 grid gap-x-6 gap-y-5 [grid-template-columns:repeat(auto-fit,minmax(130px,1fr))]">
            <Stat
              label={t('magic.odds.exactly', { count: atLeast })}
              value={formatPercent(odds.exactlyP, locale)}
            />
            <Stat
              label={t('magic.odds.fewerThan', { count: atLeast })}
              value={formatPercent(odds.fewerP, locale)}
            />
            <Stat
              label={t('magic.odds.none')}
              value={formatPercent(odds.distribution[0] ?? 0, locale)}
            />
            <Stat
              label={t('magic.odds.expected')}
              value={formatNumber(odds.expected, locale)}
            />
          </div>

          <Distribution
            distribution={odds.distribution}
            peak={peak}
            atLeast={atLeast}
            expected={odds.expected}
            atLeastP={odds.atLeastP}
            locale={locale}
          />

          <div className="pt-13">
            <ChartHead label={t('magic.odds.cumulativeLabel')} />
            {cumulative.map(({ k, p }) => {
              const current = k === atLeast;
              return (
                <div
                  key={k}
                  className="grid grid-cols-[42px_minmax(0,1fr)_66px] items-center gap-3.5 py-1.75"
                >
                  <span
                    className={cx(
                      'text-magic-body',
                      current ? 'font-semibold text-magic-ink' : 'text-magic-ink-muted',
                    )}
                  >
                    {k}+
                  </span>
                  <Meter value={p} quiet={!current} height="h-2.5" />
                  <span
                    className={cx(
                      'text-right text-magic-body',
                      current ? 'font-semibold text-magic-ink' : 'text-magic-ink-muted',
                    )}
                  >
                    {formatPercent(p, locale)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}

/**
 * The distribution, with the two marks the doc draws over it: the mean, and
 * the bracket spanning every column that counts as a hit. Both are cyan and
 * neither is a bar — the annotator never touches the data.
 *
 * The mean sits at (mean + 0.5) columns from the left because the columns are
 * flexed equally and each one's centre is half a column in from its own edge.
 */
function Distribution({
  distribution,
  peak,
  atLeast,
  expected,
  atLeastP,
  locale,
}: {
  distribution: number[];
  peak: number;
  atLeast: number;
  expected: number;
  atLeastP: number;
  locale: string;
}) {
  const { t } = useTranslation();
  const columns = distribution.length;
  const meanLeft = `${(((expected + 0.5) / columns) * 100).toFixed(1)}%`;
  const hits = Math.max(0, columns - atLeast);

  return (
    <div>
      <ChartHead label={t('magic.odds.distributionLabel')} />
      <div className="relative h-53.5 pt-6">
        <div className="absolute inset-x-0 bottom-0 top-6 flex items-end gap-1.25">
          {distribution.map((p, k) => (
            <div key={k} className="flex h-full flex-1 flex-col justify-end">
              <span
                className={cx(
                  'mb-1 text-center text-magic-tick',
                  k >= atLeast ? 'text-magic-ink' : 'text-magic-ink-muted',
                )}
              >
                {p >= 0.001 ? formatPercent(p, locale) : ''}
              </span>
              <span
                className={cx('block', k >= atLeast ? 'bg-magic-bar' : 'bg-magic-bar-quiet')}
                style={{ height: `${Math.max(1, (p / peak) * 76)}%` }}
              />
            </div>
          ))}
        </div>
        {expected <= columns && (
          <>
            <span
              aria-hidden="true"
              className="absolute inset-y-0 w-px bg-magic-accent"
              style={{ left: meanLeft }}
            />
            <span
              aria-hidden="true"
              className="absolute top-0 -translate-x-1/2 text-magic-micro whitespace-nowrap italic text-magic-accent-ink"
              style={{ left: meanLeft }}
            >
              {t('magic.odds.mean', { value: formatNumber(expected, locale) })}
            </span>
          </>
        )}
      </div>
      <div className="flex gap-1.25">
        {distribution.map((_, k) => (
          <span
            key={k}
            className={cx(
              'flex-1 pt-2 text-center text-magic-label',
              k >= atLeast ? 'text-magic-ink' : 'text-magic-ink-muted',
            )}
          >
            {k}
          </span>
        ))}
      </div>
      {hits > 0 && (
        <div aria-hidden="true">
          <div className="mt-2 flex gap-1.25">
            <div style={{ flex: atLeast }} />
            <div className="h-px bg-magic-accent" style={{ flex: hits }} />
          </div>
          <div className="flex gap-1.25">
            <div style={{ flex: atLeast }} />
            <div
              className="pt-1.5 text-center text-magic-label italic text-magic-accent-ink"
              style={{ flex: hits }}
            >
              {t('magic.odds.bracket', {
                count: atLeast,
                percent: formatPercent(atLeastP, locale),
              })}
            </div>
          </div>
        </div>
      )}
    </div>
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
      className="size-9 cursor-pointer rounded-magic border border-magic-field text-magic-lead text-magic-ink transition-colors hover:bg-magic-ink/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magic-accent-ink"
    >
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="m-0 mb-1.5 text-magic-micro uppercase tracking-magic-label text-magic-ink-muted">
        {label}
      </p>
      <p className="m-0 text-magic-stat font-semibold">{value}</p>
    </div>
  );
}
