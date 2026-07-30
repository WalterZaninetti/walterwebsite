import type { ReactNode } from 'react';
import { cx } from './cx';

type Texture = 'loose' | 'tight' | 'portrait';

const textures: Record<Texture, string> = {
  loose: 'hatch',
  tight: 'hatch-tight',
  portrait: 'hatch-portrait',
};

/**
 * Hatched stand-in for imagery that hasn't been shot yet — the doc leans on
 * these for the portrait, sleeves and album art. Swap one out for a real
 * <LazyImage> as the assets arrive; the sizing lives on the caller so the
 * layout doesn't shift when you do.
 */
export function Frame({
  children,
  texture = 'loose',
  className,
  align = 'center',
}: {
  children?: ReactNode;
  texture?: Texture;
  className?: string;
  align?: 'center' | 'end';
}) {
  return (
    <div
      className={cx(
        textures[texture],
        'font-mono text-on-panel-quiet',
        align === 'center' ? 'grid place-items-center' : 'flex items-end',
        className,
      )}
    >
      {children}
    </div>
  );
}
