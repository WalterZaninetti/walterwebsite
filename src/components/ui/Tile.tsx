import type { ComponentType } from 'react';
import { cx } from './cx';

/**
 * The signature — direction.md §3 and gate C: a rounded green tile with a
 * cream line icon, punched half over an edge. Six placements on the whole
 * site, all of them on a project. Only the overlapping variant exists, so
 * there is no `overlap` prop — every caller supplies the position with
 * `className` (an absolute placement plus the -50%-of-size offset for
 * whichever edge it straddles) because the three placements (shelf card,
 * project band seam, magic hero slab) overhang different edges.
 *
 * Sizing is fixed at 48px below `lg`, 56px at `lg` — not a prop, because
 * every placement uses the same two sizes (direction.md §3.1).
 *
 * No shadow (a shadow under a flat sticker is the glassmorphism tell) and
 * the ring is authored in the token itself: real cream in light, transparent
 * in dark (direction.md §1.4), so this component never branches on scheme.
 */
export function Tile({
  icon: Icon,
  className,
  tone = 'bg-tile text-tile-fg ring-2 ring-tile-ring',
}: {
  icon: ComponentType<{ className?: string }>;
  className?: string;
  /**
   * Fill, glyph and ring together, as one replaceable group — Tailwind
   * utilities of equal specificity resolve by stylesheet order, not by
   * className order, so bg/text/ring have to travel together rather than
   * layer on top of a default. `/magic-tools`'s hero tile is the one
   * caller that overrides this: `--magic-tile` on `--magic-tile-fg`, no
   * ring (direction.md §3.2 — that page's slab needs no edge against
   * itself, so §1.4's light/dark ring logic doesn't apply to it).
   */
  tone?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cx('grid size-12 shrink-0 place-items-center rounded-tile lg:size-14', tone, className)}
    >
      <Icon className="size-[26px] lg:size-[30px]" />
    </span>
  );
}
