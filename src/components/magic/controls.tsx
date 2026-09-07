import type { ReactNode } from 'react';
import { cx } from '../ui/cx';

/**
 * The broadsheet's furniture. There are no cards on this page, so none of
 * these draw a container: a section is a column of white space, a field is a
 * label over a control, and a meter is a bar on the sheet.
 */

export function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-magic px-5 md:px-8">
      {children}
    </section>
  );
}

export function SectionHead({
  kicker,
  heading,
  blurb,
}: {
  kicker: string;
  heading: string;
  blurb: string;
}) {
  return (
    <div className="pt-14 pb-7 md:pt-23 md:pb-8.5">
      <p className="m-0 mb-3.5 text-magic-label/none uppercase tracking-magic-kicker text-magic-accent-ink">
        {kicker}
      </p>
      <h2 className="mb-6 text-magic-head font-bold text-balance">
        {heading}
      </h2>
      <p className="m-0 max-w-[92ch] text-magic-blurb text-magic-ink-body text-pretty">
        {blurb}
      </p>
    </div>
  );
}

/** The controls column: a single narrow measure down the left of each tool. */
export function Rail({ children }: { children: ReactNode }) {
  return <div className="flex max-w-[340px] flex-col gap-6.5">{children}</div>;
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cx('text-magic-label uppercase tracking-magic-label text-magic-ink-muted', className)}>
      {children}
    </span>
  );
}

export function Field({
  label,
  value,
  hint,
  children,
}: {
  label: string;
  value?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <Label>{label}</Label>
        {value !== undefined && <span className="text-magic-note font-semibold">{value}</span>}
      </div>
      {children}
      {hint && <p className="m-0 mt-2 text-magic-label italic text-magic-ink-muted">{hint}</p>}
    </div>
  );
}

/**
 * `active` is left undefined by callers that use this as a plain action (the
 * search examples, the legend chips) rather than as a setting — so the button
 * ships no aria-pressed at all, instead of announcing itself as an unpressed
 * toggle.
 */
export function Choice({
  onClick,
  active,
  className,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        'inline-flex cursor-pointer items-center justify-center rounded-magic border px-3.5 py-2',
        'text-magic-label leading-tight font-semibold transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magic-accent-ink',
        active
          ? 'border-magic-accent-fill bg-magic-accent-fill text-magic-accent-fill-fg hover:border-magic-accent-fill-hover hover:bg-magic-accent-fill-hover'
          : 'border-magic-field text-magic-ink hover:bg-magic-ink/8',
        className,
      )}
    >
      {children}
    </button>
  );
}

/** A bordered action rather than a pressable state — submit, copy, open. */
export function Action({
  as = 'button',
  onClick,
  href,
  disabled = false,
  primary = false,
  className,
  children,
}: {
  as?: 'button' | 'a';
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  primary?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const shape = cx(
    'inline-flex items-center justify-center gap-1.5 rounded-magic border px-4 py-2.5',
    'text-magic-body leading-tight font-semibold no-underline transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magic-accent-ink',
    primary
      ? 'border-magic-accent-fill bg-magic-accent-fill text-magic-accent-fill-fg hover:border-magic-accent-fill-hover hover:bg-magic-accent-fill-hover'
      : 'border-magic-field text-magic-ink hover:bg-magic-ink/8',
    className,
  );

  if (as === 'a') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener"
        aria-disabled={disabled}
        onClick={(event) => disabled && event.preventDefault()}
        className={cx(shape, disabled && 'pointer-events-none opacity-45')}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(shape, 'cursor-pointer disabled:cursor-not-allowed disabled:opacity-45')}
    >
      {children}
    </button>
  );
}

/**
 * One row's bar. `marker` is the annotator's rule — the threshold, the naive
 * product — drawn over the bar in cyan and never as part of it, so a reader
 * can always tell the measurement from the note about it.
 */
export function Meter({
  value,
  quiet = false,
  marker,
  height = 'h-3.5',
}: {
  value: number;
  quiet?: boolean;
  marker?: number;
  height?: string;
}) {
  return (
    <span className={cx('relative block bg-magic-track', height)}>
      <span
        className={cx('absolute inset-y-0 left-0', quiet ? 'bg-magic-bar-quiet' : 'bg-magic-bar')}
        style={{ width: `${Math.min(100, value * 100).toFixed(1)}%` }}
      />
      {marker !== undefined && (
        <span
          aria-hidden="true"
          className="absolute -top-1.25 -bottom-1.25 w-px bg-magic-accent"
          style={{ left: `${Math.min(100, marker * 100).toFixed(1)}%` }}
        />
      )}
    </span>
  );
}

/** The answer, set as a headline with the sentence that reads it out. */
export function Verdict({
  figure,
  unit,
  children,
}: {
  figure: string;
  unit?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-9 flex flex-wrap items-baseline gap-x-7.5 gap-y-4">
      <div>
        <p className="m-0 text-magic-figure font-bold">
          {figure}
        </p>
        {unit && (
          <p className="m-0 mt-2 text-magic-label uppercase tracking-magic-kicker text-magic-ink-muted">
            {unit}
          </p>
        )}
      </div>
      <div className="max-w-[36ch]">{children}</div>
    </div>
  );
}

/** The marginal note under a verdict — always the caveat, never the number. */
export function Aside({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 text-magic-body italic text-magic-accent-ink text-pretty">{children}</p>
  );
}

/** The heading over a chart or a table, with the annotator's key on the right. */
export function ChartHead({ label, note }: { label: string; note?: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-4">
      <Label>{label}</Label>
      {note && <span className="text-magic-label italic text-magic-accent-ink">{note}</span>}
    </div>
  );
}

const FIELD = cx(
  'w-full min-w-0 rounded-magic border border-magic-field bg-magic-surface px-2.5 py-1.5',
  'text-magic-ink caret-magic-accent-ink transition-colors',
  'hover:border-magic-ink-muted focus-visible:border-magic-accent-ink',
  'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-magic-accent-ink',
);

export function TextField({
  value,
  onChange,
  label,
  className,
}: {
  value: string;
  onChange: (next: string) => void;
  label: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      aria-label={label}
      onChange={(event) => onChange(event.target.value)}
      className={cx(FIELD, className)}
    />
  );
}

export function NumberField({
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
      onChange={(event) =>
        onChange(Math.max(min, Math.min(max, Math.round(Number(event.target.value)) || 0)))
      }
      className={cx(
        FIELD,
        'px-1 text-center [appearance:textfield]',
        '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
      )}
    />
  );
}

export function TextArea({
  value,
  onChange,
  onSubmit,
  label,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  label: string;
  placeholder: string;
}) {
  return (
    <textarea
      value={value}
      rows={3}
      aria-label={label}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') onSubmit();
      }}
      className={cx(
        FIELD,
        'min-h-24 resize-y px-3.5 py-3 text-magic-ask placeholder:text-magic-ink-muted',
      )}
    />
  );
}

/** The mulligan policy switch — the one control on the page that is a choice
 *  about the model rather than about the deck, so it reads as a sentence. */
export function CheckRow({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 size-4 shrink-0 accent-magic-accent-fill"
      />
      <span>
        <span className="block text-magic-body">{label}</span>
        {hint && (
          <span className="mt-1 block text-magic-label italic text-magic-ink-muted">{hint}</span>
        )}
      </span>
    </label>
  );
}
