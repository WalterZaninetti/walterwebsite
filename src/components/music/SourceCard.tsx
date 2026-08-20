import { useTranslation } from 'react-i18next';
import { musicFeeds, musicProfiles, type MusicSourceId } from '../../content/music';
import { formatRelativeTime } from '../../lib/relativeTime';
import { LazyImage } from '../LazyImage';
import { Eyebrow } from '../ui/Eyebrow';
import { ArrowUpRightIcon, BandcampMark, SpotifyMark } from '../ui/icons';
import { cx } from '../ui/cx';

/**
 * Five rows from one source. Rendered twice — Spotify and Bandcamp — from the build-time
 * snapshot in content/music.generated.json.
 *
 * The two cards look alike but do not mean the same thing, and the copy has to carry that:
 * Spotify reports plays, Bandcamp reports purchases, because a fan collection is the only thing
 * Bandcamp exposes and it has no listening history at all. Hence two captions, and two separate
 * bordered cards rather than one merged list — which is also what Spotify's design guidelines
 * require, since its content may not share a "row or shelf" with a competing service.
 *
 * The shell is `AlbumOfTheMonth`'s, class for class, so the section reads as one family.
 */
export function SourceCard({ source, className }: { source: MusicSourceId; className?: string }) {
  const { t, i18n } = useTranslation();
  const { items } = musicFeeds[source];
  const profile = musicProfiles[source];
  const Mark = source === 'spotify' ? SpotifyMark : BandcampMark;

  return (
    <article
      className={cx(
        /* min-w-0: a grid item defaults to `min-width: auto`, which is the min-content width of
           its contents — and a `truncate`d title is `white-space: nowrap`, so its min-content is
           the whole untruncated string. Without this the longest track name sets the card's
           width and pushes the page into horizontal scroll on mobile. */
        'flex min-w-0 flex-col rounded-card-sm border border-line-inset bg-panel-inset p-5 lg:rounded-card lg:p-6',
        className,
      )}
    >
      <div className="mb-1 flex items-center justify-between gap-3">
        <Eyebrow className="tracking-[0.16em] text-accent-on-panel lg:tracking-[0.18em]">
          {t(`home.music.sources.${source}.label`)}
        </Eyebrow>
        {/* Attribution, not decoration: Spotify requires its mark wherever its metadata shows.
            Monochrome — the green is only licensed on black or white. */}
        <Mark className="size-[18px] shrink-0 text-on-panel-dim" />
      </div>

      <p className="mb-4 text-note-sm text-on-panel-prose text-pretty lg:mb-[18px]">
        {t(`home.music.sources.${source}.caption`)}
      </p>

      {items.length === 0 ? (
        <p className="my-auto py-6 text-center font-mono text-meta text-on-panel-dim text-balance">
          {t(`home.music.sources.${source}.empty`)}
        </p>
      ) : (
        <ol className="mb-[18px] flex min-w-0 flex-col gap-3 lg:gap-[14px]">
          {items.map((item) => (
            <Row key={item.id} item={item} locale={i18n.language} />
          ))}
        </ol>
      )}

      {/* mt-auto, not a fixed margin: the two captions wrap to different line counts, so without
          it the footer rules sit at different heights on cards that are the same height. Pushing
          to the bottom of the flex column lines them up. */}
      {profile && (
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line-on-panel-soft pt-[14px] lg:pt-4">
          <a
            href={profile}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-meta font-medium text-on-panel-body no-underline transition-colors duration-150 hover:text-accent-on-panel"
          >
            {t(`home.music.sources.${source}.link`)}
            <ArrowUpRightIcon className="size-[1em] shrink-0" />
          </a>
        </div>
      )}
    </article>
  );
}

/**
 * One track. The whole row is the link — a 48px cover next to a two-line title/artist stack is
 * a small target otherwise, and there is nothing else in the row to click.
 */
function Row({
  item,
  locale,
}: {
  item: (typeof musicFeeds)[MusicSourceId]['items'][number];
  locale: string;
}) {
  const when = formatRelativeTime(item.at, locale);

  const body = (
    <>
      {/* Cover art is shown unmodified — Spotify's guidelines forbid cropping, overlaying or
          filtering it, and rounding is capped at 8px. `alt` is empty on purpose: the title and
          artist sit right beside it, so announcing them twice is noise. */}
      {item.art ? (
        <LazyImage
          src={item.art}
          alt=""
          width={48}
          height={48}
          className="size-11 shrink-0 rounded-[6px] object-cover lg:size-12"
        />
      ) : (
        <div
          aria-hidden
          className="size-11 shrink-0 rounded-[6px] border border-dashed border-hatch-line lg:size-12"
        />
      )}

      <div className="min-w-0 flex-1">
        {/* truncate, not wrap: a long title must not push the row to two lines and break the
            rhythm of the five. The full text stays in the tooltip and in the linked page. */}
        <p
          className="truncate font-editorial text-[15px] italic text-on-panel-strong"
          title={item.title}
        >
          {item.title}
        </p>
        <p className="truncate font-mono text-[11.5px] text-on-panel-accent" title={item.artist}>
          {item.artist}
        </p>
      </div>

      {when && (
        <time
          dateTime={item.at ?? undefined}
          className="shrink-0 self-center font-mono text-meta whitespace-nowrap text-on-panel-dim"
        >
          {when}
        </time>
      )}
    </>
  );

  return (
    <li className="min-w-0">
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 items-center gap-3 rounded-chip no-underline transition-colors duration-150 hover:text-accent-on-panel"
        >
          {body}
        </a>
      ) : (
        <div className="flex min-w-0 items-center gap-3">{body}</div>
      )}
    </li>
  );
}
