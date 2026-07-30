import type { ReactNode } from 'react';
import { cx } from './cx';

/**
 * The mono, letter-spaced, uppercase micro-label the design uses to introduce
 * almost every block. Colour is left to the caller because it changes with the
 * surface it sits on.
 */
export function Eyebrow({
  children,
  className,
  as: Tag = 'p',
}: {
  children: ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
}) {
  return (
    <Tag className={cx('font-mono text-label font-medium uppercase', className)}>{children}</Tag>
  );
}
