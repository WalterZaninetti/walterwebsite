import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { magic } from '../../content/magic';
import { cardsSeenByTurn, formatPercent, pAtLeastFrom } from '../../lib/hypergeometric';
import { cx } from '../ui/cx';
import {
  Aside,
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

const TURNS = Array.from({ length: 12 }, (_, i) => i + 1);
const COPIES = [1, 2, 3, 4];
const MILESTONES = [0.5, 0.75, 0.9];

/**
 * "When will I see it?" — the turn axis rather than the count axis.
 *
 * The draw-odds section answers how many copies you'll have drawn by a fixed
 * point; this walks the turns and asks when a card first becomes likely.
 * That's the singleton question — a tutor, a combo piece, a Commander one-of —
 * where the count is always one and the only variable worth moving is time.
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

  /**
   * The rule drawn over the table is the strongest milestone the deck actually
   * reaches inside twelve turns. A four-of hits every one of them by turn two,
   * so the coin flip would be a line at the far left annotating nothing; a
   * one-of in a 100-card deck reaches none, and the rule falls back to the
   * ceiling it does reach.
   */
  const reach = rows[rows.length - 1].p;
  const threshold = MILESTONES.find((q) => reach >= q) ?? null;

  const opener = rows[0];
  // The milestones are round halves and quarters; formatPercent's decimal
  // would render 50% as "50.0%", a precision the threshold does not have.
  const whole = new Intl.NumberFormat(locale, { style: 'percent' });

  return (
    <Section id="find">
      <SectionHead
        kicker={t('magic.finding.kicker')}
        heading={t('magic.finding.heading')}
        blurb={t('magic.finding.blurb')}
      />

      <div className="grid items-start gap-x-14 gap-y-10 md:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <Rail>
          <Field label={t('magic.finding.deckLabel')} value={String(deck)}>
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

          <Field
            label={t('magic.finding.copiesLabel')}
            value={String(copies)}
            hint={t('magic.finding.copiesHint')}
          >
            <div className="flex gap-1.5">
              {COPIES.map((value) => (
                <Choice
                  key={value}
                  active={copies === value}
                  onClick={() => setCopies(value)}
                  className="flex-1 px-0"
                >
                  {value}
                </Choice>
              ))}
            </div>
          </Field>

          <div>
            <Label className="mb-2.5 block">{t('magic.finding.playLabel')}</Label>
            <div className="flex gap-1.5">
              <Choice active={onPlay} onClick={() => setOnPlay(true)} className="flex-1">
                {t('magic.mana.onPlay')}
              </Choice>
              <Choice active={!onPlay} onClick={() => setOnPlay(false)} className="flex-1">
                {t('magic.mana.onDraw')}
              </Choice>
            </div>
          </div>

          <div>
            <Label className="mb-1 block">{t('magic.finding.milestonesLabel')}</Label>
            {crossings.map(({ threshold: q, turn }) => (
              <div key={q} className="flex items-baseline justify-between gap-3 py-2 text-magic-body">
                <span className="text-magic-ink-muted">
                  {t('magic.finding.milestone', { percent: whole.format(q) })}
                </span>
                <span
                  className={cx(
                    'font-semibold',
                    turn === null ? 'text-magic-ink-muted' : 'text-magic-accent-ink',
                  )}
                >
                  {turn === null
                    ? t('magic.finding.never')
                    : t('magic.finding.byTurn', { turn })}
                </span>
              </div>
            ))}
          </div>
        </Rail>

        <div className="min-w-0">
          <Verdict figure={formatPercent(opener.p, locale)}>
            <p className="m-0 mb-3 text-magic-lead text-pretty">
              {t('magic.finding.sentence', { deck })}
            </p>
            <Aside>
              {t('magic.finding.tenTurns', {
                percent: formatPercent(rows[9].p, locale),
                points: ((copies / deck) * 100).toFixed(1),
              })}
            </Aside>
          </Verdict>

          <ChartHead
            label={t('magic.finding.tableLabel')}
            note={
              threshold === null
                ? t('magic.finding.ruleCeiling', { percent: formatPercent(reach, locale) })
                : t('magic.finding.rule', { percent: whole.format(threshold) })
            }
          />
          {rows.map(({ turn, seen, p }) => {
            const crossed = threshold !== null && p >= threshold;
            return (
              <div
                key={turn}
                className="grid grid-cols-[46px_44px_minmax(0,1fr)_64px] items-center gap-3 py-1.5"
              >
                <span
                  className={cx(
                    'text-magic-body',
                    crossed ? 'font-semibold text-magic-ink' : 'text-magic-ink-muted',
                  )}
                >
                  T{turn}
                </span>
                <span className="text-magic-label text-magic-ink-muted">{seen}</span>
                <Meter
                  value={p}
                  quiet={!crossed}
                  marker={threshold ?? undefined}
                  height="h-3"
                />
                <span
                  className={cx(
                    'text-right text-magic-body',
                    crossed ? 'font-semibold text-magic-ink' : 'text-magic-ink-muted',
                  )}
                >
                  {formatPercent(p, locale)}
                </span>
              </div>
            );
          })}
          {/* The column heads sit under the table, the way a broadsheet foots a
              stock listing: the reader meets the bars first and the key after. */}
          <div className="grid grid-cols-[46px_44px_minmax(0,1fr)_64px] gap-3 pt-2.5 text-magic-micro uppercase tracking-magic-label text-magic-ink-muted">
            <span>{t('magic.finding.colTurn')}</span>
            <span>{t('magic.finding.colSeen')}</span>
            <span />
            <span className="text-right">{t('magic.finding.colProb')}</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
