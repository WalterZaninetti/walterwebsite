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
import { SectionHead } from './controls';

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
 * Refinement gets its own box on purpose. The service will treat a turn as a
 * follow-up whenever it's handed a `previous`, but it can't know which you
 * meant — "red creatures" typed after a search for instants is a new question,
 * not a narrowing. Guessing would silently fold an unrelated search into the
 * old query, so the two actions stay distinct and the chain is shown rather
 * than implied.
 */
export function PlainEnglishSearch() {
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
    <section
      id="search"
      className="scroll-mt-[70px] bg-magic-cinder px-5 pt-10 pb-12 text-magic-cream md:px-10 md:pt-13 md:pb-15"
    >
      <SectionHead
        index="05"
        heading={t('magic.search.heading')}
        blurb={t('magic.search.blurb')}
        dark
      />

      <div className="grid items-start gap-[22px] lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-4">
          {/* -------- input -------- */}
          <div className="rounded-[14px] border border-magic-cream/22 bg-magic-slab p-[22px]">
            <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-magic-cream-dimmer">
              {t('magic.search.prompt')}
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') void run(text, { refine: false });
              }}
              rows={3}
              placeholder={t('magic.search.placeholder')}
              className="box-border w-full resize-y rounded-[10px] border border-magic-cream/28 bg-magic-cream/6 px-[18px] py-4 font-magic-body text-[17px]/[1.6] text-white outline-none transition-colors focus:border-magic-ember-light focus:bg-magic-cream/10 focus-visible:ring-2 focus-visible:ring-magic-ember-light focus-visible:ring-offset-2 focus-visible:ring-offset-magic-slab"
            />
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px]/[28px] text-magic-cream-faint">
                {t('magic.search.tryLabel')}
              </span>
              {examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => applyExample(example)}
                  className="h-[30px] cursor-pointer rounded-pill border border-magic-cream/28 bg-transparent px-3 font-mono text-[11.5px] text-magic-cream-dim transition-colors hover:border-magic-ember-light hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magic-ember-light focus-visible:ring-offset-2 focus-visible:ring-offset-magic-slab"
                >
                  {example.length > 34 ? `${example.slice(0, 32)}…` : example}
                </button>
              ))}
              <button
                type="button"
                onClick={() => void run(text, { refine: false })}
                disabled={busy || !text.trim()}
                className="ml-auto h-[30px] cursor-pointer rounded-pill bg-magic-ember-light px-4 font-magic-body text-[13px] font-medium text-magic-abyss transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? t('magic.search.submitBusy') : t('magic.search.submit')}
              </button>
            </div>
          </div>

          {/* -------- result -------- */}
          <div className="rounded-[14px] border border-magic-cream/22 bg-magic-slab p-[22px]">
            <div className="mb-3.5 flex items-center justify-between gap-3">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-magic-cream-dimmer">
                {t('magic.search.queryLabel')}
              </p>
              <span className="font-mono text-[10.5px] text-magic-cream-faint">
                {result
                  ? `${t('magic.search.filterCount', { count: chips.length })} · ${result.detectedLanguage}`
                  : ''}
              </span>
            </div>

            {turns.length > 1 && (
              <Chain turns={turns} onRevert={(i) => setTurns(turns.slice(0, i + 1))} />
            )}

            <div
              aria-live="polite"
              className={`min-h-[26px] rounded-[10px] border border-magic-ember-light/30 bg-magic-abyss px-[18px] py-4 font-mono text-[15.5px]/[1.7] break-words ${
                error
                  ? 'text-magic-coral'
                  : busy
                    ? 'text-magic-cream-faint'
                    : 'text-magic-ember-light'
              }`}
            >
              {error ??
                (busy
                  ? t('magic.search.submitBusy')
                  : (result?.query ?? t('magic.search.emptyQuery')))}
            </div>

            {chips.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {chips.map((chip, i) => (
                  <span
                    key={`${chip.fragment}-${i}`}
                    className="flex items-center gap-2 rounded-pill bg-magic-ember-light/16 px-3 py-[7px] font-mono text-[11.5px] font-medium text-magic-ember-light"
                  >
                    {chip.fragment}
                    <span className="font-magic-body text-[11px] opacity-70">{chip.label}</span>
                  </span>
                ))}
              </div>
            )}

            {/* The service reports what it had to infer, what it couldn't express,
                and — when repair failed — that the query itself is suspect. */}
            {result && result.warnings.length > 0 && (
              <Advisory tone="warn" title={t('magic.search.warningsTitle')} items={result.warnings} />
            )}
            {result && result.unsupported.length > 0 && (
              <Advisory
                tone="muted"
                title={t('magic.search.unsupportedTitle')}
                items={result.unsupported}
              />
            )}
            {result && result.assumptions.length > 0 && (
              <Advisory
                tone="muted"
                title={t('magic.search.assumptionsTitle')}
                items={result.assumptions}
              />
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-magic-cream/18 pt-[18px]">
              <a
                href={result?.scryfallUrl ?? '#'}
                target="_blank"
                rel="noopener"
                aria-disabled={!result}
                onClick={(e) => !result && e.preventDefault()}
                className={`rounded-pill bg-magic-ember-light px-6 py-[13px] font-magic-body text-[13.5px] font-medium text-magic-abyss no-underline transition-colors hover:bg-white ${
                  result ? '' : 'pointer-events-none opacity-50'
                }`}
              >
                {t('magic.search.search')}
              </a>
              <button
                type="button"
                disabled={!result}
                onClick={() => {
                  if (!result) return;
                  void navigator.clipboard?.writeText(result.query);
                  setCopied(true);
                }}
                className="cursor-pointer rounded-pill border border-magic-cream/30 bg-transparent px-5 py-3 font-mono text-[12.5px] font-medium text-magic-cream-dim transition-colors hover:border-magic-ember-light hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copied ? t('magic.search.copied') : t('magic.search.copy')}
              </button>
              <span className="ml-auto font-mono text-[11px] text-magic-cream-faint">
                {result ? '' : t('magic.search.idleNote')}
              </span>
            </div>

            {/* -------- refine -------- */}
            {result && (
              <div className="mt-5 border-t border-magic-cream/18 pt-[18px]">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-magic-cream-dimmer">
                    {t('magic.search.refineLabel')}
                  </p>
                  {turns.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setTurns(turns.slice(0, 1))}
                      className="cursor-pointer bg-transparent font-mono text-[10.5px] text-magic-cream-faint underline-offset-2 transition-colors hover:text-magic-cream hover:underline"
                    >
                      {t('magic.search.startOver')}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={refineText}
                    onChange={(e) => setRefineText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') void run(refineText, { refine: true });
                    }}
                    placeholder={t('magic.search.refinePlaceholder')}
                    className="box-border h-[38px] min-w-0 flex-1 rounded-pill border border-magic-cream/28 bg-magic-cream/6 px-4 font-magic-body text-[14px] text-white outline-none transition-colors focus:border-magic-ember-light focus:bg-magic-cream/10 focus-visible:ring-2 focus-visible:ring-magic-ember-light focus-visible:ring-offset-2 focus-visible:ring-offset-magic-slab"
                  />
                  <button
                    type="button"
                    onClick={() => void run(refineText, { refine: true })}
                    disabled={busy || !refineText.trim()}
                    className="h-[38px] cursor-pointer rounded-pill border border-magic-ember-light bg-transparent px-5 font-magic-body text-[13px] font-medium text-magic-ember-light transition-colors hover:bg-magic-ember-light hover:text-magic-abyss disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy ? t('magic.search.submitBusy') : t('magic.search.refineSubmit')}
                  </button>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {refineExamples.map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => {
                        setRefineText(example);
                        void run(example, { refine: true });
                      }}
                      className="h-[26px] cursor-pointer rounded-pill border border-magic-cream/22 bg-transparent px-2.5 font-mono text-[11px] text-magic-cream-faint transition-colors hover:border-magic-ember-light hover:text-magic-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magic-ember-light focus-visible:ring-offset-2 focus-visible:ring-offset-magic-slab"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* -------- legend -------- */}
        <div className="rounded-[14px] border border-magic-cream/22 bg-magic-slab p-[22px]">
          <p className="mb-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-magic-cream-dimmer">
            {t('magic.search.legendTitle')}
          </p>
          <p className="mb-[18px] font-magic-body text-[12.5px]/[1.6] text-magic-sand">
            {t('magic.search.legendNote')}
          </p>
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-x-5">
            {legend.map((group, groupIndex) => (
              <div key={group.title} className="border-t border-magic-cream/16 pt-3.5">
                <div className="mb-[9px] flex items-baseline justify-between gap-2.5">
                  <span className="font-magic-body text-[12.5px] font-medium text-magic-cream">
                    {group.title}
                  </span>
                  <span className="font-mono text-[11px] text-magic-ember-light">
                    {magic.legendSyntax[groupIndex]}
                  </span>
                </div>
                <div className="flex flex-wrap gap-[7px]">
                  {group.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => applyExample(item)}
                      className="cursor-pointer rounded-lg border border-magic-cream/24 bg-transparent px-[11px] py-1.5 text-left font-magic-body text-[11.5px] text-magic-cream-dim transition-colors hover:border-magic-ember-light hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magic-ember-light focus-visible:ring-offset-2 focus-visible:ring-offset-magic-slab"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
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
    <div className="mb-3 flex flex-wrap items-center gap-1.5">
      {turns.map((turn, index) => {
        const isLast = index === turns.length - 1;
        return (
          <span key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <span aria-hidden="true" className="font-mono text-[11px] text-magic-cream-faint">
                ›
              </span>
            )}
            <button
              type="button"
              disabled={isLast}
              onClick={() => onRevert(index)}
              title={isLast ? undefined : t('magic.search.revertTo')}
              className={`max-w-[22ch] truncate rounded-pill border px-2.5 py-1 font-magic-body text-[11.5px] transition-colors ${
                isLast
                  ? 'cursor-default border-magic-ember-light/40 text-magic-cream'
                  : 'cursor-pointer border-magic-cream/20 text-magic-cream-faint hover:border-magic-ember-light hover:text-magic-cream'
              }`}
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
  tone,
  title,
  items,
}: {
  tone: 'warn' | 'muted';
  title: string;
  items: readonly string[];
}) {
  return (
    <div
      className={`mt-3.5 rounded-[10px] px-4 py-3 ${
        tone === 'warn' ? 'bg-magic-coral/12' : 'bg-magic-cream/6'
      }`}
    >
      <p
        className={`mb-1.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] ${
          tone === 'warn' ? 'text-magic-coral' : 'text-magic-cream-dimmer'
        }`}
      >
        {title}
      </p>
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {items.map((item) => (
          <li
            key={item}
            className="font-magic-body text-[12.5px]/[1.55] text-magic-cream-dim text-pretty"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
