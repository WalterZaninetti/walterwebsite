import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

const base = 'rounded-pill no-underline transition-colors duration-150';

/**
 * Outlined pill link sitting on one of the dark panels — socials, Spotify,
 * the mobile theme buttons. Hover fills with sage, per the doc.
 */
export function PanelPill({
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className={cx(
        base,
        'border border-line-on-panel font-mono text-meta font-medium text-on-panel-body',
        'hover:border-sage-solid hover:bg-sage-solid hover:text-sage-solid-fg',
        className,
      )}
    >
      {children}
    </a>
  );
}

/** Outlined pill link on a light surface — the coffee tiers. */
export function SurfacePill({
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className={cx(
        base,
        'grid place-items-center border border-line-strong font-mono text-meta font-medium text-ink-strong',
        'hover:border-accent hover:text-accent',
        className,
      )}
    >
      {children}
    </a>
  );
}

/**
 * Solid rust call-to-action. `tone` picks which hover the doc gives it (deep
 * green for the hero and coffee buttons, sage for "Send the idea"); `fg` picks
 * which of the doc's two creams sits on the rust.
 */
export function AccentButton({
  className,
  children,
  tone = 'deep',
  fg = 'cream',
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  tone?: 'deep' | 'sage';
  fg?: 'cream' | 'paper';
}) {
  return (
    <a
      {...props}
      className={cx(
        base,
        'bg-accent font-sans font-medium',
        fg === 'cream' ? 'text-accent-fg-warm' : 'text-accent-fg',
        tone === 'deep'
          ? 'hover:bg-accent-hover hover:text-accent-hover-fg'
          : 'hover:bg-accent-hover-alt hover:text-accent-hover-alt-fg',
        className,
      )}
    >
      {children}
    </a>
  );
}

const chipVariants = {
  /** Genre tags: a wash of sage, no outline. */
  fill: 'bg-fill-on-panel text-on-panel-body',
  /** Unselected form topic. */
  outline: 'border border-line-on-panel text-on-panel-body',
  /** Selected form topic. */
  solid: 'bg-sage-solid text-sage-solid-fg',
} as const;

/** Tag pill sitting on a dark panel. */
export function Chip({
  children,
  variant = 'outline',
  className,
  ...props
}: {
  children: ReactNode;
  variant?: keyof typeof chipVariants;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>) {
  const classes = cx('rounded-pill font-mono text-meta font-medium', chipVariants[variant], className);

  // Only the form's topic chips are interactive; the genre tags are labels.
  if (!props.onClick) return <span className={classes}>{children}</span>;

  return (
    <button type="button" {...props} className={cx(classes, 'transition-colors duration-150')}>
      {children}
    </button>
  );
}
