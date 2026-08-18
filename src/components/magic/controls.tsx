import type { ReactNode } from 'react';
import { cx } from '../ui/cx';

/** Small presentational pieces shared by the Magic Tools sections. */

export function SectionHead({
  index,
  heading,
  blurb,
  dark = false,
}: {
  index: string;
  heading: string;
  blurb: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cx(
        'mb-7 flex flex-col items-baseline justify-between gap-4 border-b pb-4 md:flex-row md:gap-[30px]',
        dark ? 'border-magic-cream/25' : 'border-magic-rule',
      )}
    >
      <div className="flex items-baseline gap-3.5">
        <span
          className={cx(
            'font-mono text-[11px] font-medium tracking-[0.18em]',
            dark ? 'text-magic-green-light' : 'text-magic-green',
          )}
        >
          {index}
        </span>
        <h2
          className={cx(
            'font-magic-display text-[26px]/[1.1] font-semibold tracking-[0.01em] md:text-[30px]',
            dark ? 'text-magic-cream' : 'text-magic-ink',
          )}
        >
          {heading}
        </h2>
      </div>
      <p
        className={cx(
          'max-w-[30em] font-magic-body text-[13.5px]/[1.65] text-pretty',
          dark ? 'text-magic-cream-dim' : 'text-magic-ink-muted',
        )}
      >
        {blurb}
      </p>
    </div>
  );
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        'font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-magic-ink-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Field({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[9px]">
      <div className="flex items-baseline justify-between gap-3">
        <Label>{label}</Label>
        {value !== undefined && (
          <span className="font-mono text-[11px] font-medium text-magic-green">{value}</span>
        )}
      </div>
      {children}
    </div>
  );
}

export function Preset({
  onClick,
  active = false,
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
        'h-8 cursor-pointer rounded-pill border px-3 font-mono text-[11px] font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magic-green focus-visible:ring-offset-2 focus-visible:ring-offset-magic-card',
        active
          ? 'border-magic-green bg-magic-green text-magic-paper'
          : 'border-magic-field bg-magic-card text-magic-ink-muted hover:border-magic-green hover:text-magic-green-deep',
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Checkbox styled as a row, for the mulligan policy switch. */
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
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-magic-green"
      />
      <span>
        <span className="block font-magic-body text-[13px]/[1.4] text-magic-ink">{label}</span>
        {hint && (
          <span className="mt-0.5 block font-mono text-[10.5px]/[1.45] text-magic-ink-faint">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}
