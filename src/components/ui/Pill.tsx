import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

/**
 * Shadow and transform ride along with the colours so a pill that lifts on
 * hover animates rather than snaps. Both are inert on the pills that change
 * neither, and declaring the list here rather than at a call site keeps a
 * second `transition-*` utility from racing this one on stylesheet order.
 */
const base =
  'rounded-pill no-underline transition-[background-color,border-color,color,box-shadow,transform] duration-150';

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
 * green for the hero, the coffee buttons and Crate's download, sage for "Send
 * the idea"); `fg` picks which of the doc's two creams sits on the rust.
 *
 * The tone lives here rather than in a className on the call site because the
 * hover's fill and its text have to travel together — two `hover:bg-*`
 * utilities of equal specificity resolve by stylesheet order, not by the order
 * they are written.
 *
 * There was a third, added when Crate's page was blue and a button hovering
 * into the site's green was the last green on it. Crate's world took the app's
 * own deep green, so the exception it existed for is gone and the site's two
 * are the doc's two again.
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
        hovers[tone],
        className,
      )}
    >
      {children}
    </a>
  );
}

const hovers = {
  deep: 'hover:bg-accent-hover hover:text-accent-hover-fg',
  sage: 'hover:bg-accent-hover-alt hover:text-accent-hover-alt-fg',
} as const;

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
