import { useEffect, useRef, useState } from 'react';
import { magic } from '../../content/magic';
import { TranslateError, toChips, translate, type TranslateResult } from '../../lib/translateApi';
import { SectionHead } from './DrawOdds';

const copy = magic.search;

/**
 * The design translated on every keystroke with a local regex parser. This
 * calls the natural-language-to-scryfall-filters service instead — a model
 * call that is validated against Scryfall before it comes back, which is
 * slower, costs money and is rate-limited. So it runs on an explicit submit
 * (button, or ⌘/Ctrl+Enter) rather than as you type.
 *
 * What that buys: Italian, German, French and Spanish work too, and a query
 * that Scryfall would silently ignore is caught server-side instead of
 * returning thousands of wrong cards.
 */
export function PlainEnglishSearch() {
  const [text, setText] = useState<string>(copy.placeholder);
  const [result, setResult] = useState<TranslateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const inFlight = useRef<AbortController | null>(null);

  useEffect(() => () => inFlight.current?.abort(), []);

  async function submit(value: string = text) {
    const trimmed = value.trim();
    if (!trimmed || busy) return;

    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;

    setBusy(true);
    setError(null);
    setCopied(false);
    try {
      setResult(await translate(trimmed, controller.signal));
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setResult(null);
      setError(err instanceof TranslateError ? err.message : 'Something went wrong.');
    } finally {
      if (inFlight.current === controller) setBusy(false);
    }
  }

  function applyExample(value: string) {
    setText(value);
    setResult(null);
    setError(null);
    void submit(value);
  }

  const chips = result ? toChips(result.query) : [];

  return (
    <section
      id="search"
      className="scroll-mt-[70px] bg-magic-forest px-5 pt-10 pb-12 text-magic-cream md:px-10 md:pt-13 md:pb-15"
    >
      <SectionHead index={copy.index} heading={copy.heading} blurb={copy.blurb} dark />

      <div className="grid items-start gap-[22px] lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-4">
          {/* -------- input -------- */}
          <div className="rounded-[14px] border border-magic-cream/22 bg-magic-ink p-[22px]">
            <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-magic-cream-dimmer">
              {copy.prompt}
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') void submit();
              }}
              rows={3}
              placeholder={copy.placeholder}
              className="box-border w-full resize-y rounded-[10px] border border-magic-cream/28 bg-magic-cream/6 px-[18px] py-4 font-magic-body text-[17px]/[1.6] text-white outline-none focus:border-magic-green-light focus:bg-magic-cream/10"
            />
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px]/[28px] text-magic-cream-faint">
                {copy.tryLabel}
              </span>
              {magic.examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => applyExample(example)}
                  className="h-[30px] cursor-pointer rounded-pill border border-magic-cream/28 bg-transparent px-3 font-mono text-[11.5px] text-magic-cream-dim transition-colors hover:border-magic-green-light hover:text-white"
                >
                  {example.length > 34 ? `${example.slice(0, 32)}…` : example}
                </button>
              ))}
              <button
                type="button"
                onClick={() => void submit()}
                disabled={busy || !text.trim()}
                className="ml-auto h-[30px] cursor-pointer rounded-pill bg-magic-green-light px-4 font-magic-body text-[13px] font-medium text-magic-abyss transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? copy.submitBusyLabel : copy.submitLabel}
              </button>
            </div>
          </div>

          {/* -------- result -------- */}
          <div className="rounded-[14px] border border-magic-cream/22 bg-magic-ink p-[22px]">
            <div className="mb-3.5 flex items-center justify-between gap-3">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-magic-cream-dimmer">
                {copy.queryLabel}
              </p>
              <span className="font-mono text-[10.5px] text-magic-cream-faint">
                {result
                  ? `${chips.length} filter${chips.length === 1 ? '' : 's'} · ${result.detectedLanguage}`
                  : ''}
              </span>
            </div>

            <div
              aria-live="polite"
              className={`min-h-[26px] rounded-[10px] border border-magic-green-light/30 bg-magic-abyss px-[18px] py-4 font-mono text-[15.5px]/[1.7] break-words ${
                error ? 'text-magic-coral' : busy ? 'text-magic-cream-faint' : 'text-magic-green-light'
              }`}
            >
              {error ?? (busy ? copy.submitBusyLabel : (result?.query ?? copy.emptyQuery))}
            </div>

            {chips.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {chips.map((chip, i) => (
                  <span
                    key={`${chip.fragment}-${i}`}
                    className="flex items-center gap-2 rounded-pill bg-magic-green-light/16 px-3 py-[7px] font-mono text-[11.5px] font-medium text-magic-green-light"
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
              <Advisory tone="warn" title="Couldn’t be verified" items={result.warnings} />
            )}
            {result && result.unsupported.length > 0 && (
              <Advisory tone="muted" title="Not expressible in Scryfall" items={result.unsupported} />
            )}
            {result && result.assumptions.length > 0 && (
              <Advisory tone="muted" title="Assumed" items={result.assumptions} />
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-magic-cream/18 pt-[18px]">
              <a
                href={result?.scryfallUrl ?? '#'}
                target="_blank"
                rel="noopener"
                aria-disabled={!result}
                onClick={(e) => !result && e.preventDefault()}
                className={`rounded-pill bg-magic-green-light px-6 py-[13px] font-magic-body text-[13.5px] font-medium text-magic-abyss no-underline transition-colors hover:bg-white ${
                  result ? '' : 'pointer-events-none opacity-50'
                }`}
              >
                {copy.searchLabel}
              </a>
              <button
                type="button"
                disabled={!result}
                onClick={() => {
                  if (!result) return;
                  void navigator.clipboard?.writeText(result.query);
                  setCopied(true);
                }}
                className="cursor-pointer rounded-pill border border-magic-cream/30 bg-transparent px-5 py-3 font-mono text-[12.5px] font-medium text-magic-cream-dim transition-colors hover:border-magic-green-light hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copied ? copy.copiedLabel : copy.copyLabel}
              </button>
              <span className="ml-auto font-mono text-[11px] text-magic-cream-faint">
                {result ? '' : copy.idleNote}
              </span>
            </div>
          </div>
        </div>

        {/* -------- legend -------- */}
        <div className="rounded-[14px] border border-magic-cream/22 bg-magic-ink p-[22px]">
          <p className="mb-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-magic-cream-dimmer">
            {copy.legendTitle}
          </p>
          <p className="mb-[18px] font-magic-body text-[12.5px]/[1.6] text-magic-steel">
            {copy.legendNote}
          </p>
          <div className="flex flex-col gap-4">
            {magic.legend.map((group) => (
              <div key={group.title} className="border-t border-magic-cream/16 pt-3.5">
                <div className="mb-[9px] flex items-baseline justify-between gap-2.5">
                  <span className="font-magic-body text-[12.5px] font-medium text-magic-cream">
                    {group.title}
                  </span>
                  <span className="font-mono text-[11px] text-magic-green-light">
                    {group.syntax}
                  </span>
                </div>
                <div className="flex flex-wrap gap-[7px]">
                  {group.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => applyExample(item)}
                      className="cursor-pointer rounded-lg border border-magic-cream/24 bg-transparent px-[11px] py-1.5 text-left font-magic-body text-[11.5px] text-magic-cream-dim transition-colors hover:border-magic-green-light hover:text-white"
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
