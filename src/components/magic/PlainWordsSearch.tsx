import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { magic } from '../../content/magic';
import {
  TRANSLATE_BASE_URL,
  TranslateError,
  toChips,
  translate,
  type TranslateResult,
} from '../../lib/translateApi';
import { cx } from '../ui/cx';
import { ArrowUpRightIcon } from '../ui/icons';
import {
  Action,
  ChartHead,
  Choice,
  Label,
  Section,
  SectionHead,
  TextArea,
} from './controls';

type LegendGroup = { title: string; items: string[] };

/** One exchange: what was asked, and what came back. */
type Turn = { text: string; result: TranslateResult };

const ERROR_KEY: Record<string, string> = {
  offline: 'errorOffline',
  rate_limited: 'errorRateLimited',
  bad_request: 'errorBadRequest',
  unauthorized: 'errorUnauthorized',
  server: 'errorServer',
};

/**
 * The design translated on every keystroke with a local regex parser. This
 * calls the natural-language-to-scryfall-filters service instead — a model
 * call that is validated against Scryfall before it comes back, which is
 * slower, costs money and is rate-limited. So it runs on an explicit submit
 * (button, or ⌘/Ctrl+Enter) rather than as you type.
 *
 * The "dropped words" column the design draws is the service's `unsupported`
 * list, which is the same promise made honestly: the regex parser could only
 * report words it had no rule for, while the service reports parts of the
 * request Scryfall itself cannot express.
 *
 * Refinement gets its own box on purpose. The service will treat a turn as a
 * follow-up whenever it's handed a `previous`, but it can't know which you
 * meant — "red creatures" typed after a search for instants is a new question,
 * not a narrowing. Guessing would silently fold an unrelated search into the
 * old query, so the two actions stay distinct and the chain is shown rather
 * than implied.
 */
export function PlainWordsSearch() {
  const { t } = useTranslation();
  const examples = t('magic.search.examples', { returnObjects: true }) as string[];
  const legend = t('magic.search.legend', { returnObjects: true }) as LegendGroup[];
  const refineExamples = t('magic.search.refineExamples', { returnObjects: true }) as string[];

  const [text, setText] = useState<string>(() => t('magic.search.placeholder'));
  const [refineText, setRefineText] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const inFlight = useRef<AbortController | null>(null);

  useEffect(() => () => inFlight.current?.abort(), []);

  const current = turns.at(-1) ?? null;
  const result = current?.result ?? null;

  async function run(value: string, { refine }: { refine: boolean }) {
    const trimmed = value.trim();
    if (!trimmed || busy) return;
    if (refine && !current) return;

    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;

    setBusy(true);
    setError(null);
    setCopied(false);
    try {
      const next = await translate(trimmed, {
        signal: controller.signal,
        previous:
          refine && current ? { text: current.text, query: current.result.query } : undefined,
      });
      setTurns((prev) =>
        refine ? [...prev, { text: trimmed, result: next }] : [{ text: trimmed, result: next }],
      );
      if (refine) setRefineText('');
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      // A failed refinement leaves the chain intact — you haven't lost the
      // query you already had.
      if (!refine) setTurns([]);
      setError(
        err instanceof TranslateError
          ? t(`magic.search.${ERROR_KEY[err.kind]}`, { url: TRANSLATE_BASE_URL })
          : t('magic.search.errorUnknown'),
      );
    } finally {
      if (inFlight.current === controller) setBusy(false);
    }
  }

  function applyExample(value: string) {
    setText(value);
    setTurns([]);
    setError(null);
    void run(value, { refine: false });
  }

  const chips = result ? toChips(result.query) : [];

  return (
    <Section id="search">
      <SectionHead
        kicker={t('magic.search.kicker')}
        heading={t('magic.search.heading')}
        blurb={t('magic.search.blurb')}
      />

      <div className="grid items-start gap-x-14 gap-y-10 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        <div>
          <Label className="mb-3 block">{t('magic.search.prompt')}</Label>
          <TextArea
            value={text}
            onChange={setText}
            onSubmit={() => void run(text, { refine: false })}
            label={t('magic.search.prompt')}
            placeholder={t('magic.search.placeholder')}
          />

          <div className="mt-4.5 flex flex-wrap items-center gap-2">
            <Action primary onClick={() => void run(text, { refine: false })} disabled={busy || !text.trim()}>
              {busy ? t('magic.search.submitBusy') : t('magic.search.submit')}
            </Action>
            <span className="ml-1 text-magic-label italic text-magic-ink-muted">
              {t('magic.search.tryLabel')}
            </span>
            {examples.map((example) => (
              <Choice
                key={example}
                onClick={() => applyExample(example)}
                className="font-normal text-magic-micro"
              >
                {example.length > 38 ? `${example.slice(0, 36)}…` : example}
              </Choice>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-3 flex items-baseline justify-between gap-3.5">
            <Label>{t('magic.search.queryLabel')}</Label>
            <span className="text-magic-label italic text-magic-ink-muted">
              {result
                ? `${t('magic.search.filterCount', { count: chips.length })} · ${result.detectedLanguage}`
                : t('magic.search.noFilters')}
            </span>
          </div>

          {turns.length > 1 && (
            <Chain turns={turns} onRevert={(i) => setTurns(turns.slice(0, i + 1))} />
          )}

          <p
            aria-live="polite"
            className={cx(
              'm-0 min-h-8 text-magic-query break-words',
              error ? 'text-magic-flag-ink' : 'text-magic-accent-deep',
              busy && 'text-magic-ink-muted',
            )}
          >
            {error ??
              (busy ? t('magic.search.submitBusy') : (result?.query ?? t('magic.search.emptyQuery')))}
          </p>

          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {chips.map((chip, i) => (
                <span
                  key={`${chip.fragment}-${i}`}
                  className="flex items-baseline gap-2 text-magic-label text-magic-ink-body"
                >
                  <span className="font-semibold text-magic-accent-ink">{chip.fragment}</span>
                  <span className="italic text-magic-ink-muted">{chip.label}</span>
                </span>
              ))}
            </div>
          )}

          <div className="mt-5.5 flex flex-wrap items-center gap-2.5">
            <Action as="a" primary href={result?.scryfallUrl ?? '#'} disabled={!result}>
              {t('magic.search.search')}
              <ArrowUpRightIcon className="size-[1em] shrink-0" />
            </Action>
            <Action
              disabled={!result}
              onClick={() => {
                if (!result) return;
                void navigator.clipboard?.writeText(result.query);
                setCopied(true);
              }}
            >
              {copied ? t('magic.search.copied') : t('magic.search.copy')}
            </Action>
          </div>

          {/* The service reports what it had to infer, what it couldn't express,
              and — when repair failed — that the query itself is suspect. */}
          <div className="mt-9">
            <Label className="mb-3 block">{t('magic.search.unsupportedTitle')}</Label>
            {result && result.unsupported.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-1.5">
                  {result.unsupported.map((item) => (
                    <span
                      key={item}
                      className="rounded-magic bg-magic-flag px-2.5 py-1 text-magic-micro text-magic-flag-ink"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <p className="m-0 mt-3.5 max-w-[54ch] text-magic-body text-magic-ink-muted text-pretty">
                  {t('magic.search.unsupportedNote')}
                </p>
              </>
            ) : (
              <p className="m-0 text-magic-row italic text-magic-ink-muted">
                {result ? t('magic.search.allUnderstood') : t('magic.search.idleNote')}
              </p>
            )}
          </div>

          {result && result.warnings.length > 0 && (
            <Advisory flagged title={t('magic.search.warningsTitle')} items={result.warnings} />
          )}
          {result && result.assumptions.length > 0 && (
            <Advisory title={t('magic.search.assumptionsTitle')} items={result.assumptions} />
          )}

          {result && (
            <div className="mt-9 border-t border-magic-rule pt-5">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <Label>{t('magic.search.refineLabel')}</Label>
                {turns.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setTurns(turns.slice(0, 1))}
                    className="cursor-pointer bg-transparent text-magic-label italic text-magic-accent-ink underline-offset-3 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magic-accent-ink"
                  >
                    {t('magic.search.startOver')}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={refineText}
                  aria-label={t('magic.search.refineLabel')}
                  onChange={(e) => setRefineText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void run(refineText, { refine: true });
                  }}
                  placeholder={t('magic.search.refinePlaceholder')}
                  className="min-w-0 flex-1 rounded-magic border border-magic-field bg-magic-surface px-3 py-2 text-magic-body text-magic-ink caret-magic-accent-ink transition-colors placeholder:text-magic-ink-muted hover:border-magic-ink-muted focus-visible:border-magic-accent-ink focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-magic-accent-ink"
                />
                <Action
                  onClick={() => void run(refineText, { refine: true })}
                  disabled={busy || !refineText.trim()}
                >
                  {busy ? t('magic.search.submitBusy') : t('magic.search.refineSubmit')}
                </Action>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {refineExamples.map((example) => (
                  <Choice
                    key={example}
                    onClick={() => {
                      setRefineText(example);
                      void run(example, { refine: true });
                    }}
                    className="font-normal text-magic-micro"
                  >
                    {example}
                  </Choice>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-14">
        <ChartHead label={t('magic.search.legendTitle')} note={t('magic.search.legendNote')} />
        <div className="grid gap-x-7 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {legend.map((group, groupIndex) => (
            <div key={group.title} className="border-t border-magic-rule pt-3.5">
              <div className="mb-2.5 flex items-baseline justify-between gap-2.5">
                <span className="text-magic-row font-semibold">{group.title}</span>
                <span className="text-magic-label text-magic-accent-ink">
                  {magic.legendSyntax[groupIndex]}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <Choice
                    key={item}
                    onClick={() => applyExample(item)}
                    className="font-normal text-magic-micro"
                  >
                    {item}
                  </Choice>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/**
 * The turns so far, shown rather than implied: once a query has been refined it
 * no longer corresponds to anything in the input box, and without a trail the
 * result would drift from the question with nothing on screen to explain it.
 * Each earlier step rolls back to it.
 */
function Chain({ turns, onRevert }: { turns: Turn[]; onRevert: (index: number) => void }) {
  const { t } = useTranslation();

  return (
    <div className="mb-3 flex flex-wrap items-center gap-1.5 text-magic-label">
      {turns.map((turn, index) => {
        const isLast = index === turns.length - 1;
        return (
          <span key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <span aria-hidden="true" className="text-magic-ink-muted">
                ›
              </span>
            )}
            <button
              type="button"
              disabled={isLast}
              onClick={() => onRevert(index)}
              title={isLast ? undefined : t('magic.search.revertTo')}
              className={cx(
                'max-w-[24ch] truncate italic underline-offset-3',
                isLast
                  ? 'cursor-default text-magic-ink'
                  : 'cursor-pointer text-magic-ink-muted hover:text-magic-accent-ink hover:underline',
              )}
            >
              {turn.text}
            </button>
          </span>
        );
      })}
    </div>
  );
}

function Advisory({
  flagged = false,
  title,
  items,
}: {
  flagged?: boolean;
  title: string;
  items: readonly string[];
}) {
  return (
    <div className="mt-6">
      <Label className={cx('mb-2 block', flagged && 'text-magic-flag-ink')}>{title}</Label>
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {items.map((item) => (
          <li
            key={item}
            className={cx(
              'text-magic-body',
              flagged ? 'text-magic-flag-ink' : 'text-magic-ink-body',
            )}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
