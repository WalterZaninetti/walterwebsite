import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { magic } from '../../content/magic';
import {
  cardsSeenByTurn,
  formatPercent,
  pCastOnCurve,
  sourcesNeeded,
  type ManaInput,
} from '../../lib/hypergeometric';
import { cx } from '../ui/cx';
import {
  Aside,
  ChartHead,
  CheckRow,
  Choice,
  Field,
  Label,
  Meter,
  Rail,
  Section,
  SectionHead,
  Verdict,
} from './controls';

const PIP_OPTIONS = [1, 2, 3, 4];
const TURNS = [1, 2, 3, 4, 5, 6];
const TARGETS = [0.85, 0.9, 0.95];

type Settings = Omit<ManaInput, 'sources'> & { target: number };

/**
 * The metric the homepage actually promises — "a geometric calculator for
 * building mana bases that actually hold up". The section above answers a
 * generic drawing question; this one answers the colour question: given a
 * cost and the turn you want it on, how many sources does the deck need?
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
  // The threshold is always a round 85/90/95, and formatPercent's one decimal
  // renders it as "90.0%" — a precision the setting does not have.
  const threshold = new Intl.NumberFormat(locale, { style: 'percent' }).format(target);
  const seen = Math.min(cardsSeenByTurn(s.turn, s.onPlay), s.deck);

  return (
    <Section id="sources">
      <SectionHead
        kicker={t('magic.mana.kicker')}
        heading={t('magic.mana.heading')}
        blurb={t('magic.mana.blurb')}
      />

      <div className="grid items-start gap-x-14 gap-y-10 md:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <Rail>
          <Field label={t('magic.mana.deckLabel')} value={String(s.deck)}>
            <div className="flex gap-1.5">
              {magic.deckPresets.map((value) => (
                <Choice
                  key={value}
                  active={s.deck === value}
                  onClick={() => set({ deck: value })}
                  className="flex-1 px-0"
                >
                  {value}
                </Choice>
              ))}
            </div>
          </Field>

          <Field
            label={t('magic.mana.pipsLabel')}
            value={pipLabel}
            hint={t('magic.mana.pipsHint')}
          >
            <div className="flex gap-1.5">
              {PIP_OPTIONS.map((value) => (
                <Choice
                  key={value}
                  active={s.pips === value}
                  onClick={() => set({ pips: value })}
                  className="flex-1 px-0"
                >
                  {'C'.repeat(value)}
                </Choice>
              ))}
            </div>
          </Field>

          <Field label={t('magic.mana.turnLabel')} value={String(s.turn)}>
            <div className="flex gap-1.5">
              {TURNS.map((value) => (
                <Choice
                  key={value}
                  active={s.turn === value}
                  onClick={() => set({ turn: value })}
                  className="flex-1 px-0"
                >
                  {value}
                </Choice>
              ))}
            </div>
          </Field>

          <div>
            <Label className="mb-2.5 block">{t('magic.mana.playLabel')}</Label>
            <div className="flex gap-1.5">
              <Choice active={s.onPlay} onClick={() => set({ onPlay: true })} className="flex-1">
                {t('magic.mana.onPlay')}
              </Choice>
              <Choice active={!s.onPlay} onClick={() => set({ onPlay: false })} className="flex-1">
                {t('magic.mana.onDraw')}
              </Choice>
            </div>
          </div>

          <Field label={t('magic.mana.targetLabel')} value={threshold}>
            <div className="flex gap-1.5">
              {TARGETS.map((value) => (
                <Choice
                  key={value}
                  active={target === value}
                  onClick={() => set({ target: value })}
                  className="flex-1 px-0"
                >
                  {new Intl.NumberFormat(locale, { style: 'percent' }).format(value)}
                </Choice>
              ))}
            </div>
          </Field>

          <CheckRow
            checked={s.mulligans > 0}
            onChange={(next) => set({ mulligans: next ? 1 : 0 })}
            label={t('magic.mana.mulliganLabel')}
            hint={t('magic.mana.mulliganHint')}
          />
        </Rail>

        <div className="min-w-0">
          <Verdict
            figure={answer ? String(answer.sources) : '—'}
            unit={answer ? t('magic.mana.sourcesUnit') : undefined}
          >
            <p className="m-0 mb-3 text-magic-lead text-pretty">
              {answer
                ? t('magic.mana.sentence', {
                    cost: pipLabel,
                    turn: s.turn,
                    percent: threshold,
                  })
                : t('magic.mana.impossible', { cost: pipLabel, turn: s.turn })}
            </p>
            {answer && (
              <Aside>
                {answer.sources > s.pips
                  ? t('magic.mana.shortfall', {
                      sources: answer.sources - 1,
                      percent: formatPercent(
                        pCastOnCurve({ ...input, sources: answer.sources - 1 }),
                        locale,
                      ),
                      seen,
                      turn: s.turn,
                    })
                  : t('magic.mana.anyCount', { seen, turn: s.turn })}
              </Aside>
            )}
          </Verdict>

          <ChartHead
            label={t('magic.mana.curveLabel')}
            note={t('magic.mana.rule', { percent: threshold })}
          />
          {curve.map(({ sources, p }) => {
            const isAnswer = sources === answer?.sources;
            return (
              <div
                key={sources}
                className="grid grid-cols-[40px_minmax(0,1fr)_70px] items-center gap-3.5 py-2"
              >
                <span
                  className={cx(
                    'text-magic-row',
                    isAnswer ? 'font-semibold text-magic-ink' : 'text-magic-ink-muted',
                  )}
                >
                  {sources}
                </span>
                <Meter value={p} quiet={p < target} marker={target} />
                <span
                  className={cx(
                    'text-right text-magic-row',
                    isAnswer ? 'font-semibold text-magic-ink' : 'text-magic-ink-muted',
                  )}
                >
                  {formatPercent(p, locale)}
                </span>
              </div>
            );
          })}

          {answer && counterpart && counterpart.sources !== answer.sources && (
            <p className="m-0 mt-6 text-magic-body italic text-magic-accent-ink">
              {t(s.mulligans > 0 ? 'magic.mana.deltaWithout' : 'magic.mana.deltaWith', {
                sources: counterpart.sources,
              })}
            </p>
          )}

          {/* The number is only as good as the model behind it. */}
          <p className="m-0 mt-6 max-w-[66ch] text-magic-prose text-magic-ink-body text-pretty">
            {t('magic.mana.caveat')}
          </p>
        </div>
      </div>
    </Section>
  );
}
