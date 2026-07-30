import type { ReactNode } from 'react';
import { music } from '../../content/site';
import { Chip } from '../ui/Pill';
import { Eyebrow } from '../ui/Eyebrow';
import { Frame } from '../ui/Frame';
import { cx } from '../ui/cx';

const album = music.album;

/**
 * The monthly pick. Sleeve sits beside the note on desktop, above it on mobile.
 *
 * `footer` is the slot the desktop layout drops the previous-picks archive
 * into — the doc moved it inside this card, where it pushes to the bottom so
 * the card fills its grid row.
 */
export function AlbumOfTheMonth({
  className,
  footer,
}: {
  className?: string;
  footer?: ReactNode;
}) {
  return (
    <article
      className={cx(
        'flex flex-col rounded-card-sm border border-line-inset bg-panel-inset p-5 lg:rounded-card lg:p-6',
        className,
      )}
    >
      <div className="mb-[14px] flex items-baseline justify-between lg:mb-4">
        <Eyebrow className="tracking-[0.16em] text-accent lg:tracking-[0.18em]">
          {album.label}
        </Eyebrow>
        <p className="font-mono text-[10px] text-on-panel-dim lg:text-label-wide/none lg:tracking-normal">
          <span className="lg:hidden">{album.issueShort}</span>
          <span className="hidden lg:inline">{album.issue}</span>
        </p>
      </div>

      <div className="lg:flex lg:items-start lg:gap-5">
        <Frame
          className="mb-4 aspect-square rounded-chip text-[10px] lg:mb-0 lg:aspect-auto lg:size-[158px] lg:shrink-0 lg:text-[9.5px]"
        >
          {album.sleeveCaption}
        </Frame>

        <div className="lg:min-w-0">
          <h3 className="mb-1.5 text-title-sm font-editorial italic text-on-panel-strong lg:text-title">
            {album.title}
          </h3>
          <p className="mb-3 font-mono text-[12.5px] text-on-panel-accent lg:mb-[14px] lg:text-[13.5px]">
            {album.credit}
          </p>
          <p className="mb-4 text-note/[1.7] text-on-panel-prose text-pretty">
            <span className="lg:hidden">{album.noteShort}</span>
            <span className="hidden lg:inline">{album.note}</span>
          </p>
          <div className="flex flex-wrap gap-[7px]">
            {album.tags.map((tag) => (
              <Chip
                key={tag}
                variant="fill"
                className="px-3 py-[7px] text-label-wide/none tracking-normal lg:py-1.5"
              >
                {tag}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-[14px] flex items-center justify-between gap-3 border-t border-line-on-panel-soft pt-[14px] lg:mt-[18px] lg:gap-4 lg:pt-4">
        <a
          href="#album-note"
          className="font-mono text-meta font-medium text-on-panel-body no-underline transition-colors duration-150 hover:text-accent"
        >
          <span className="lg:hidden">{album.readLinkShort}</span>
          <span className="hidden lg:inline">{album.readLink}</span>
        </a>
        <a
          href="#picks"
          className="font-mono text-meta font-medium text-on-panel-quiet no-underline transition-colors duration-150 hover:text-on-panel-body"
        >
          {album.archiveLink}
        </a>
      </div>

      {footer}
    </article>
  );
}
