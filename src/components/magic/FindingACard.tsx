import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { magic } from '../../content/magic';
import { cardsSeenByTurn, formatPercent, pAtLeastFrom } from '../../lib/hypergeometric';
import { Field, Label, Preset, SectionHead } from './controls';

const TURNS = Array.from({ length: 12 }, (_, i) => i + 1);
const COPIES = [1, 2, 3, 4];
const MILESTONES = [0.5, 0.75, 0.9];

/**
 * "When will I see it?" — the turn axis rather than the count axis.
 *
 * Section 01 answers how many copies you'll have drawn by a fixed point; this
 * walks the turns and asks when a card first becomes likely. That's the
 * singleton question — a tutor, a combo piece, a Commander one-of — where the
 * count is always one and the only variable worth moving is time.
 */
export function FindingACard() {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? 'en';

  const [deck, setDeck] = useState(99);
  const [copies, setCopies] = useState(1);
  const [onPlay, setOnPlay] = useState(true);

  const rows = useMemo(
    () =>
      TURNS.map((turn) => {
        const seen = Math.min(cardsSeenByTurn(turn, onPlay), deck);
        return { turn, seen, p: pAtLeastFrom(deck, copies, seen, 1) };
      }),
    [deck, copies, onPlay],
  );

  /** First turn each milestone is crossed — the answer people actually want. */
  const crossings = MILESTONES.map((threshold) => ({
    threshold,
    turn: rows.find((r) => r.p >= threshold)?.turn ?? null,
  }));

  const opener = rows[0];

  return (
    <section id="finding" className="scroll-mt-[70px] px-5 pt-10 pb-12 md:px-10 md:pt-13 md:pb-15">
      <SectionHead
        index="04"
        heading={t('magic.finding.heading')}
        blurb={t('magic.finding.blurb')}
      />

      <div className="grid items-start gap-[22px] md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr]">
        {/* ---------------- controls ---------------- */}
        <div className="flex flex-col gap-[18px] rounded-[14px] border border-magic-rule bg-magic-card p-[22px]">
          <Field label={t('magic.finding.deckLabel')} value={String(deck)}>
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

          <Field label={t('magic.finding.copiesLabel')} value={String(copies)}>
            <div className="flex gap-[7px]">
              {COPIES.map((value) => (
                <Preset
                  key={value}
                  active={copies === value}
                  onClick={() => setCopies(value)}
                  className="flex-1"
                >
                  {value}
                </Preset>
              ))}
            </div>
            <p className="m-0 font-mono text-[11.5px]/[1.5] text-magic-ink-faint">
              {t('magic.finding.copiesHint')}
            </p>
          </Field>

          <Field label={t('magic.finding.playLabel')}>
            <div className="flex gap-[7px]">
              <Preset active={onPlay} onClick={() => setOnPlay(true)} className="flex-1">
                {t('magic.mana.onPlay')}
              </Preset>
              <Preset active={!onPlay} onClick={() => setOnPlay(false)} className="flex-1">
                {t('magic.mana.onDraw')}
              </Preset>
            </div>
          </Field>

          <div className="flex flex-col gap-2.5 border-t border-magic-rule-soft pt-[18px]">
            <Label>{t('magic.finding.milestonesLabel')}</Label>
            {crossings.map(({ threshold, turn }) => (
              <div key={threshold} className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[12px] text-magic-ink-muted">
                  {formatPercent(threshold, locale)}
                </span>
                <span className="font-magic-body text-[13px] text-magic-ink">
                  {turn === null
                    ? t('magic.finding.never')
                    : t('magic.finding.byTurn', { turn })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- result ---------------- */}
        <div className="flex flex-col gap-[22px]">
          <div className="grid items-center gap-[30px] rounded-[14px] bg-magic-slab p-[26px] text-magic-cream sm:grid-cols-[auto_1fr]">
            <p className="justify-self-center font-mono text-[56px]/none font-medium tracking-[-0.03em] text-white">
              {formatPercent(opener.p, locale)}
            </p>
            <div>
              <p className="mb-3 font-magic-body text-[22px]/[1.4] italic text-pretty">
                {t('magic.finding.sentence', {
                  percent: formatPercent(opener.p, locale),
                  deck,
                })}
              </p>
              <p className="font-mono text-[11.5px]/[1.6] text-magic-green-light">
                {t('magic.finding.tenTurns', {
                  percent: formatPercent(rows[9].p, locale),
                })}
              </p>
            </div>
          </div>

          <div className="rounded-[14px] border border-magic-rule bg-magic-card p-6">
            <Label className="mb-4 block">{t('magic.finding.tableLabel')}</Label>
            <div className="flex flex-col">
              {rows.map(({ turn, seen, p }) => {
                const crossed = crossings.some((c) => c.turn === turn);
                return (
                  <div
                    key={turn}
                    className="grid grid-cols-[42px_46px_1fr_62px] items-center gap-3 border-t border-magic-rule-faint py-[8px]"
                  >
                    <span
                      className={`font-mono text-[12px] font-medium ${
                        crossed ? 'text-magic-ink' : 'text-magic-ink-muted'
                      }`}
                    >
                      T{turn}
                    </span>
                    <span className="font-mono text-[10.5px] text-magic-ink-fainter">{seen}</span>
                    <span className="relative h-2 overflow-hidden rounded-pill bg-magic-rule-faint">
                      <span
                        className={`absolute inset-y-0 left-0 rounded-pill ${
                          p >= 0.9 ? 'bg-magic-green-deep' : 'bg-magic-green-mid'
                        }`}
                        style={{ width: `${Math.round(p * 100)}%` }}
                      />
                    </span>
                    <span
                      className={`text-right font-mono text-[12px] font-medium ${
                        crossed ? 'text-magic-ink' : 'text-magic-ink-muted'
                      }`}
                    >
                      {formatPercent(p, locale)}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 font-mono text-[10.5px]/[1.5] text-magic-ink-faint">
              {t('magic.finding.columnsHint')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
