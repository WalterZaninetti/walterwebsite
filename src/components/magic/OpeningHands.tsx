import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { magic } from '../../content/magic';
import {
  formatPercent,
  pAtLeastFrom,
  pJointAtLeast,
  type Category,
} from '../../lib/hypergeometric';
import { Field, Label, Preset, SectionHead } from './controls';

type Row = Category & { label: string };

/**
 * The keep decision, which is a joint question: two lands *and* a two-drop, not
 * each in isolation. Section 01 answers one category at a time and multiplying
 * its answers together would overstate the result, because the categories
 * compete for the same seven slots.
 */
export function OpeningHands() {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? 'en';

  const [deck, setDeck] = useState(60);
  const [draws, setDraws] = useState(7);
  const [rows, setRows] = useState<Row[]>(() => [
    { label: t('magic.hands.defaultLands'), size: 24, atLeast: 2 },
    { label: t('magic.hands.defaultTwoDrops'), size: 8, atLeast: 1 },
    { label: t('magic.hands.defaultRemoval'), size: 6, atLeast: 0 },
  ]);

  const patch = (index: number, next: Partial<Row>) =>
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...next } : row)));

  const active = rows.filter((r) => r.atLeast > 0 && r.size > 0);
  const claimed = active.reduce((sum, r) => sum + r.size, 0);
  const overcommitted = claimed > deck;

  const joint = useMemo(() => pJointAtLeast(deck, draws, rows), [deck, draws, rows]);

  /** Each category on its own, plus what they'd multiply to if independent. */
  const marginals = active.map((row) => ({
    label: row.label,
    atLeast: row.atLeast,
    p: pAtLeastFrom(deck, row.size, draws, row.atLeast),
  }));
  const product = marginals.reduce((acc, m) => acc * m.p, 1);

  return (
    <section id="hands" className="scroll-mt-[70px] px-5 pt-10 pb-12 md:px-10 md:pt-13 md:pb-15">
      <SectionHead index="03" heading={t('magic.hands.heading')} blurb={t('magic.hands.blurb')} />

      <div className="grid items-start gap-[22px] md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr]">
        {/* ---------------- controls ---------------- */}
        <div className="flex flex-col gap-[18px] rounded-[14px] border border-magic-rule bg-magic-card p-[22px]">
          <Field label={t('magic.hands.deckLabel')} value={String(deck)}>
            <div className="flex gap-[7px]">
              {magic.deckPresets.map((value) => (
                <Preset
                  key={value}
                  active={deck === value}
                  onClick={() => setDeck(value)}
                  className="flex-1"
                >
                  {value}
                </Preset>
              ))}
            </div>
          </Field>

          <Field label={t('magic.hands.drawsLabel')} value={String(draws)}>
            <div className="flex flex-wrap gap-[7px]">
              {magic.drawPresets.map((preset) => (
                <Preset
                  key={preset.key}
                  active={draws === preset.value}
                  onClick={() => setDraws(preset.value)}
                >
                  {t(`magic.odds.${preset.key}`)}
                </Preset>
              ))}
            </div>
          </Field>

          <div className="flex flex-col gap-3 border-t border-magic-rule-soft pt-[18px]">
            <Label>{t('magic.hands.categoriesLabel')}</Label>
            <div className="grid grid-cols-[1fr_58px_58px] items-center gap-2">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-magic-ink-faint">
                {t('magic.hands.colKind')}
              </span>
              <span className="text-center font-mono text-[9.5px] uppercase tracking-[0.14em] text-magic-ink-faint">
                {t('magic.hands.colInDeck')}
              </span>
              <span className="text-center font-mono text-[9.5px] uppercase tracking-[0.14em] text-magic-ink-faint">
                {t('magic.hands.colWant')}
              </span>
            </div>
            {rows.map((row, index) => (
              <div key={index} className="grid grid-cols-[1fr_58px_58px] items-center gap-2">
                <input
                  type="text"
                  value={row.label}
                  onChange={(e) => patch(index, { label: e.target.value })}
                  aria-label={t('magic.hands.colKind')}
                  className="h-9 min-w-0 rounded-[8px] border border-magic-field bg-magic-paper px-2.5 font-magic-body text-[13px] text-magic-ink outline-none transition-colors focus:border-magic-green focus:bg-magic-card focus-visible:ring-2 focus-visible:ring-magic-green focus-visible:ring-offset-2 focus-visible:ring-offset-magic-card"
                />
                <NumberCell
                  value={row.size}
                  min={0}
                  max={deck}
                  label={t('magic.hands.colInDeck')}
                  onChange={(size) => patch(index, { size })}
                />
                <NumberCell
                  value={row.atLeast}
                  min={0}
                  max={draws}
                  label={t('magic.hands.colWant')}
                  onChange={(atLeast) => patch(index, { atLeast })}
                />
              </div>
            ))}
            <p className="m-0 font-mono text-[10.5px]/[1.5] text-magic-ink-faint">
              {t('magic.hands.rowsHint')}
            </p>
          </div>
        </div>

        {/* ---------------- result ---------------- */}
        <div className="flex flex-col gap-[22px]">
          <div className="rounded-[14px] bg-magic-slab p-[26px] text-magic-cream">
            {overcommitted ? (
              <p className="font-magic-body text-[20px]/[1.4] italic text-magic-coral text-pretty">
                {t('magic.hands.overcommitted', { claimed, deck })}
              </p>
            ) : active.length === 0 ? (
              <p className="font-magic-body text-[20px]/[1.4] italic text-magic-cream-dimmer text-pretty">
                {t('magic.hands.empty')}
              </p>
            ) : (
              <div className="grid items-center gap-[30px] sm:grid-cols-[auto_1fr]">
                <p className="justify-self-center font-mono text-[56px]/none font-medium tracking-[-0.03em] text-white">
                  {formatPercent(joint, locale)}
                </p>
                <div>
                  <p className="mb-3 font-magic-body text-[22px]/[1.4] italic text-pretty">
                    {t('magic.hands.sentence', {
                      draws,
                      list: marginals
                        .map((m) => t('magic.hands.item', { count: m.atLeast, kind: m.label }))
                        .join(t('magic.hands.and')),
                    })}
                  </p>
                  {marginals.length > 1 && (
                    <p className="font-mono text-[11.5px]/[1.6] text-magic-green-light">
                      {t('magic.hands.correlation', {
                        product: formatPercent(product, locale),
                      })}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {marginals.length > 0 && !overcommitted && (
            <div className="rounded-[14px] border border-magic-rule bg-magic-card p-6">
              <Label className="mb-4 block">{t('magic.hands.marginalsLabel')}</Label>
              <div className="flex flex-col">
                {marginals.map((m) => (
                  <div
                    key={m.label}
                    className="grid grid-cols-[1fr_2fr_62px] items-center gap-3.5 border-t border-magic-rule-faint py-[9px]"
                  >
                    <span className="truncate font-magic-body text-[13px] text-magic-ink-muted">
                      {t('magic.hands.item', { count: m.atLeast, kind: m.label })}
                    </span>
                    <span className="relative h-2 overflow-hidden rounded-pill bg-magic-rule-faint">
                      <span
                        className="absolute inset-y-0 left-0 rounded-pill bg-magic-green-mid"
                        style={{ width: `${Math.round(m.p * 100)}%` }}
                      />
                    </span>
                    <span className="text-right font-mono text-[12px] font-medium text-magic-ink-muted">
                      {formatPercent(m.p, locale)}
                    </span>
                  </div>
                ))}
                <div className="grid grid-cols-[1fr_2fr_62px] items-center gap-3.5 border-t-2 border-magic-rule py-[9px]">
                  <span className="font-magic-body text-[13px] font-medium text-magic-ink">
                    {t('magic.hands.allTogether')}
                  </span>
                  <span className="relative h-2 overflow-hidden rounded-pill bg-magic-rule-faint">
                    <span
                      className="absolute inset-y-0 left-0 rounded-pill bg-magic-green-deep"
                      style={{ width: `${Math.round(joint * 100)}%` }}
                    />
                  </span>
                  <span className="text-right font-mono text-[12px] font-medium text-magic-ink">
                    {formatPercent(joint, locale)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <p className="font-magic-body text-[12.5px]/[1.65] text-magic-ink-faint text-pretty">
            {t('magic.hands.caveat')}
          </p>
        </div>
      </div>
    </section>
  );
}

function NumberCell({
  value,
  min,
  max,
  label,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  label: string;
  onChange: (next: number) => void;
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      value={value}
      aria-label={label}
      onChange={(e) =>
        onChange(Math.max(min, Math.min(max, Math.round(Number(e.target.value)) || 0)))
      }
      className="h-9 w-full rounded-[8px] border border-magic-field bg-magic-paper text-center font-mono text-[13px] font-medium text-magic-ink outline-none transition-colors focus:border-magic-green focus:bg-magic-card focus-visible:ring-2 focus-visible:ring-magic-green focus-visible:ring-offset-2 focus-visible:ring-offset-magic-card [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />
  );
}
