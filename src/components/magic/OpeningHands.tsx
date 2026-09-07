import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { magic } from '../../content/magic';
import {
  formatPercent,
  pAtLeastFrom,
  pJointAtLeast,
  type Category,
} from '../../lib/hypergeometric';
import {
  Aside,
  ChartHead,
  Choice,
  Field,
  Label,
  Meter,
  NumberField,
  Rail,
  Section,
  SectionHead,
  TextField,
  Verdict,
} from './controls';

type Row = Category & { label: string };

/**
 * The keep decision, which is a joint question: two lands *and* a two-drop,
 * not each in isolation. The draw-odds section answers one category at a time
 * and multiplying its answers together would overstate the result, because the
 * categories compete for the same seven slots.
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
    <Section id="hands">
      <SectionHead
        kicker={t('magic.hands.kicker')}
        heading={t('magic.hands.heading')}
        blurb={t('magic.hands.blurb')}
      />

      <div className="grid items-start gap-x-14 gap-y-10 md:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
        <Rail>
          <Field label={t('magic.hands.deckLabel')} value={String(deck)}>
            <div className="flex gap-1.5">
              {magic.deckPresets.map((value) => (
                <Choice
                  key={value}
                  active={deck === value}
                  onClick={() => setDeck(value)}
                  className="flex-1 px-0"
                >
                  {value}
                </Choice>
              ))}
            </div>
          </Field>

          <Field label={t('magic.hands.drawsLabel')} value={String(draws)}>
            <div className="flex flex-wrap gap-1.5">
              {magic.drawPresets.map((preset) => (
                <Choice
                  key={preset.key}
                  active={draws === preset.value}
                  onClick={() => setDraws(preset.value)}
                >
                  {t(`magic.odds.${preset.key}`)}
                </Choice>
              ))}
            </div>
          </Field>

          <div>
            <Label className="mb-3 block">{t('magic.hands.categoriesLabel')}</Label>
            <div className="mb-2 grid grid-cols-[minmax(0,1fr)_64px_64px] gap-2.5 text-magic-micro uppercase tracking-magic-label text-magic-ink-muted">
              <span>{t('magic.hands.colKind')}</span>
              <span className="text-center">{t('magic.hands.colInDeck')}</span>
              <span className="text-center">{t('magic.hands.colWant')}</span>
            </div>
            {rows.map((row, index) => (
              <div
                key={index}
                className="mb-2 grid grid-cols-[minmax(0,1fr)_64px_64px] items-center gap-2.5"
              >
                <TextField
                  value={row.label}
                  label={t('magic.hands.colKind')}
                  onChange={(label) => patch(index, { label })}
                />
                <NumberField
                  value={row.size}
                  min={0}
                  max={deck}
                  label={t('magic.hands.colInDeck')}
                  onChange={(size) => patch(index, { size })}
                />
                <NumberField
                  value={row.atLeast}
                  min={0}
                  max={draws}
                  label={t('magic.hands.colWant')}
                  onChange={(atLeast) => patch(index, { atLeast })}
                />
              </div>
            ))}
            <p className="m-0 mt-3 text-magic-label italic text-magic-ink-muted text-pretty">
              {t('magic.hands.rowsHint')}
            </p>
          </div>
        </Rail>

        <div className="min-w-0">
          {overcommitted ? (
            <p className="m-0 max-w-[48ch] text-magic-lead italic text-magic-flag-ink text-pretty">
              {t('magic.hands.overcommitted', { claimed, deck })}
            </p>
          ) : marginals.length === 0 ? (
            <p className="m-0 max-w-[48ch] text-magic-lead italic text-magic-ink-muted text-pretty">
              {t('magic.hands.empty')}
            </p>
          ) : (
            <>
              <Verdict figure={formatPercent(joint, locale)}>
                <p className="m-0 mb-3 text-magic-lead text-pretty">
                  {t('magic.hands.sentence', { draws })}
                </p>
                <Aside>
                  {marginals.length > 1
                    ? t('magic.hands.correlation', {
                        product: formatPercent(product, locale),
                        points: ((product - joint) * 100).toFixed(1),
                      })
                    : t('magic.hands.addAnother')}
                </Aside>
              </Verdict>

              <ChartHead
                label={t('magic.hands.marginalsLabel')}
                note={
                  marginals.length > 1
                    ? t('magic.hands.rule', { percent: formatPercent(product, locale) })
                    : undefined
                }
              />
              {marginals.map((m) => (
                <div
                  key={m.label}
                  className="grid grid-cols-[minmax(110px,0.55fr)_minmax(0,1fr)_70px] items-center gap-4 py-2.5"
                >
                  <span className="truncate text-magic-row text-magic-ink-muted">
                    {t('magic.hands.item', { count: m.atLeast, kind: m.label })}
                  </span>
                  <Meter value={m.p} quiet />
                  <span className="text-right text-magic-row text-magic-ink-muted">
                    {formatPercent(m.p, locale)}
                  </span>
                </div>
              ))}
              <div className="grid grid-cols-[minmax(110px,0.55fr)_minmax(0,1fr)_70px] items-center gap-4 py-2.5">
                <span className="text-magic-row font-semibold">{t('magic.hands.allTogether')}</span>
                <Meter value={joint} marker={marginals.length > 1 ? product : undefined} />
                <span className="text-right text-magic-row font-semibold">
                  {formatPercent(joint, locale)}
                </span>
              </div>

              <p className="m-0 mt-6 max-w-[66ch] text-magic-prose text-magic-ink-body text-pretty">
                {t('magic.hands.caveat')}
              </p>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
