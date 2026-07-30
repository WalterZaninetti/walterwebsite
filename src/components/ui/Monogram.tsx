import { cx } from './cx';

/**
 * The WZ mark. Both the ring and the W take `currentColor`, so the monogram
 * inherits whatever surface it's dropped on; only the second stroke of the Z
 * is coloured, and it follows --monogram-accent (deep teal on light, pale teal
 * on a dark panel) unless the caller overrides it.
 */
export function Monogram({
  size = 42,
  className,
  accentClassName = 'stroke-monogram-accent',
  title = 'Walter Zaninetti',
}: {
  size?: number;
  className?: string;
  accentClassName?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      className={cx('shrink-0', className)}
    >
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="7" />
      <g fill="none" stroke="currentColor" strokeWidth="13.5" transform="translate(51 56)">
        <path d="M2 20 L18 68 L34 34 L50 68 L66 20" />
        <path d="M50 68 L96 68" />
        <path d="M66 20 L96 20" className={accentClassName} />
        <path d="M96 20 L52 68" className={accentClassName} />
      </g>
    </svg>
  );
}
