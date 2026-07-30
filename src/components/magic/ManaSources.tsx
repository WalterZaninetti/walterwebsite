import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { magic } from '../../content/magic';
import {
  formatPercent,
  pCastOnCurve,
  sourcesNeeded,
  type ManaInput,
} from '../../lib/hypergeometric';
import { CheckRow, Field, Label, Preset, SectionHead } from './controls';

const PIP_OPTIONS = [1, 2, 3, 4];
const TURNS = [1, 2, 3, 4, 5, 6];
const TARGETS = [0.85, 0.9, 0.95];

type Settings = Omit<ManaInput, 'sources'> & { target: number };

/**
 * The metric the homepage actually promises — "a geometric calculator for
 * building mana bases that actually hold up". Section 01 answers a generic
 * drawing question; this one answers the colour question: given a cost and the
 * turn you want it on, how many sources does the deck need?
 *
 * Client-side, same hypergeometric core, no backend.
 */
export function ManaSources() {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? 'en';

  const [s, setS] = useState<Settings>({
    deck: 60,
    pips: 2,
    turn: 2,
    onPlay: true,
    mulligans: 0,
    target: 0.9,
  });
  const set = (patch: Partial<Settings>) => setS((prev) => ({ ...prev, ...patch }));

  const { target, ...input } = s;

  const answer = useMemo(() => sourcesNeeded(input, target), [input, target]);

  /** The same question under the other mulligan policy, for the delta line. */
  const counterpart = useMemo(
    () => sourcesNeeded({ ...input, mulligans: input.mulligans === 0 ? 1 : 0 }, target),
    [input, target],
  );

  /** A window around the answer, so the trade-off is visible rather than implied. */
  const curve = useMemo(() => {
    const centre = answer?.sources ?? Math.min(input.deck, 20);
    const from = Math.max(input.pips, centre - 3);
    return Array.from({ length: 7 }, (_, i) => from + i)
      .filter((sources) => sources <= input.deck)
      .map((sources) => ({ sources, p: pCastOnCurve({ ...input, sources }) }));
  }, [answer, input]);

  const pipLabel = 'C'.repeat(s.pips);

  return (
    <section id="mana" className="scroll-mt-[70px] px-5 pt-10 pb-12 md:px-10 md:pt-13 md:pb-15">
      <SectionHead index="02" heading={t('magic.mana.heading')} blurb={t('magic.mana.blurb')} />

      <div className="grid items-start gap-[22px] lg:grid-cols-[340px_1fr]">
        {/* ---------------- controls ---------------- */}
        <div className="flex flex-col gap-[18px] rounded-[14px] border border-magic-rule bg-magic-card p-[22px]">
          <Field label={t('magic.mana.deckLabel')} value={String(s.deck)}>
            <div className="flex gap-[7px]">
              {magic.deckPresets.map((value) => (
                <Preset
                  key={value}
                  active={s.deck === value}
                  onClick={() => set({ deck: value })}
                  className="flex-1"
                >
                  {value}
                </Preset>
              ))}
            </div>
          </Field>

          <Field label={t('magic.mana.pipsLabel')} value={pipLabel}>
            <div className="flex gap-[7px]">
              {PIP_OPTIONS.map((value) => (
                <Preset
                  key={value}
                  active={s.pips === value}
                  onClick={() => set({ pips: value })}
                  className="flex-1"
                >
                  {'C'.repeat(value)}
                </Preset>
              ))}
            </div>
            <p className="m-0 font-mono text-[11.5px]/[1.5] text-magic-ink-faint">
              {t('magic.mana.pipsHint')}
            </p>
          </Field>

          <Field label={t('magic.mana.turnLabel')} value={String(s.turn)}>
            <div className="flex gap-[7px]">
              {TURNS.map((value) => (
                <Preset
                  key={value}
                  active={s.turn === value}
                  onClick={() => set({ turn: value })}
                  className="flex-1 px-0"
                >
                  {value}
                </Preset>
              ))}
            </div>
          </Field>

          <Field label={t('magic.mana.playLabel')}>
            <div className="flex gap-[7px]">
              <Preset active={s.onPlay} onClick={() => set({ onPlay: true })} className="flex-1">
                {t('magic.mana.onPlay')}
              </Preset>
              <Preset active={!s.onPlay} onClick={() => set({ onPlay: false })} className="flex-1">
                {t('magic.mana.onDraw')}
              </Preset>
            </div>
          </Field>

          <Field label={t('magic.mana.targetLabel')} value={formatPercent(target, locale)}>
            <div className="flex gap-[7px]">
              {TARGETS.map((value) => (
                <Preset
                  key={value}
                  active={target === value}
                  onClick={() => set({ target: value })}
                  className="flex-1"
                >
                  {formatPercent(value, locale)}
                </Preset>
              ))}
            </div>
          </Field>

          <div className="border-t border-magic-rule-soft pt-[18px]">
            <CheckRow
              checked={s.mulligans > 0}
              onChange={(next) => set({ mulligans: next ? 1 : 0 })}
              label={t('magic.mana.mulliganLabel')}
              hint={t('magic.mana.mulliganHint')}
            />
          </div>
        </div>

        {/* ---------------- result ---------------- */}
        <div className="flex flex-col gap-[22px]">
          <div className="grid items-center gap-[30px] rounded-[14px] bg-magic-ink p-[26px] text-magic-cream sm:grid-cols-[auto_1fr]">
            <div className="justify-self-center text-center">
              <p className="font-mono text-[64px]/none font-medium tracking-[-0.03em] text-white">
                {answer ? answer.sources : '—'}
              </p>
              <p className="mt-2 font-mono text-[9.5px] font-medium uppercase tracking-[0.16em] text-magic-cream-dimmer">
                {t('magic.mana.sourcesUnit')}
              </p>
            </div>
            <div>
              <p className="mb-3 font-magic-body text-[24px]/[1.4] italic text-pretty">
                {answer
                  ? t('magic.mana.sentence', {
                      sources: answer.sources,
                      cost: pipLabel,
                      turn: s.turn,
                      percent: formatPercent(answer.achieved, locale),
                    })
                  : t('magic.mana.impossible', { cost: pipLabel, turn: s.turn })}
              </p>
              {answer && counterpart && counterpart.sources !== answer.sources && (
                <p className="font-mono text-[11.5px]/[1.6] text-magic-green-light">
                  {t(
                    s.mulligans > 0 ? 'magic.mana.deltaWithout' : 'magic.mana.deltaWith',
                    { sources: counterpart.sources },
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[14px] border border-magic-rule bg-magic-card p-6">
            <Label className="mb-4 block">{t('magic.mana.curveLabel')}</Label>
            <div className="flex flex-col">
              {curve.map(({ sources, p }) => {
                const isAnswer = sources === answer?.sources;
                return (
                  <div
                    key={sources}
                    className="grid grid-cols-[54px_1fr_62px] items-center gap-3.5 border-t border-magic-rule-faint py-[9px] sm:grid-cols-[70px_1fr_62px]"
                  >
                    <span
                      className={`font-mono text-[12px] font-medium ${
                        isAnswer ? 'text-magic-ink' : 'text-magic-ink-muted'
                      }`}
                    >
                      {sources}
                    </span>
                    <span className="relative h-2 overflow-hidden rounded-pill bg-magic-rule-faint">
                      <span
                        className={`absolute inset-y-0 left-0 rounded-pill ${
                          p >= target ? 'bg-magic-green-deep' : 'bg-magic-green-mid'
                        }`}
                        style={{ width: `${Math.round(p * 100)}%` }}
                      />
                    </span>
                    <span
                      className={`text-right font-mono text-[12px] font-medium ${
                        isAnswer ? 'text-magic-ink' : 'text-magic-ink-muted'
                      }`}
                    >
                      {formatPercent(p, locale)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* The number is only as good as the model behind it. */}
          <p className="font-magic-body text-[12.5px]/[1.65] text-magic-ink-faint text-pretty">
            {t('magic.mana.caveat')}
          </p>
        </div>
      </div>
    </section>
  );
}
