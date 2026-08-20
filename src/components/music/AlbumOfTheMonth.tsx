import { useTranslation } from 'react-i18next';
import { albumOfTheMonth, type MusicTrack } from '../../content/music';
import { formatPickMonth } from '../../lib/relativeTime';
import { LazyImage } from '../LazyImage';
import { Chip } from '../ui/Pill';
import { Eyebrow } from '../ui/Eyebrow';
import { Frame } from '../ui/Frame';
import { cx } from '../ui/cx';
import { ArrowUpRightIcon } from '../ui/icons';

/**
 * The monthly pick. Sleeve sits beside the metadata on desktop, above it on mobile, with the
 * tracklist underneath.
 *
 * Every word of it is fetched: sleeve, title, artist, label, year, length, genres and tracks are
 * snapshotted from Spotify at build time. Change the record by editing
 * content/album-of-the-month.json and rebuilding — there is no prose to write and none to keep
 * in step across two locale files, which is the point. The API has no description field for an
 * album, so rather than hand-write one the card shows the tracklist in that space.
 */
export function AlbumOfTheMonth({ className }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const album = albumOfTheMonth;

  if (!album) return null;

  const month = formatPickMonth(album.month, i18n.language);

  /* "Masayoshi Takanaka · Universal Music LLC, 1978" — and correct when either half is missing,
     since `label` is on its way out of the API. */
  const credit = [album.artist, [album.label, album.year].filter(Boolean).join(', ')]
    .filter(Boolean)
    .join(' · ');

  return (
    <article
      className={cx(
        'flex min-w-0 flex-col rounded-card-sm border border-line-inset bg-panel-inset p-5 lg:rounded-card lg:p-6',
        className,
      )}
    >
      <div className="mb-[14px] flex items-baseline justify-between gap-3 lg:mb-4">
        <Eyebrow className="tracking-[0.16em] text-accent-on-panel lg:tracking-[0.18em]">
          {t('home.music.album.label')}
        </Eyebrow>
        {month && album.pick !== null && (
          <p className="font-mono text-[10px] whitespace-nowrap text-on-panel-dim lg:text-label-wide/none lg:tracking-normal">
            {t('home.music.album.issue', { month, pick: album.pick })}
          </p>
        )}
      </div>

      <div className="mb-[14px] lg:mb-[18px] lg:flex lg:items-start lg:gap-5">
        {/* Unmodified cover art, as Spotify's guidelines require — resized only, never cropped
            or overlaid. `alt` is empty because the title and artist sit right beside it. */}
        {album.art ? (
          <LazyImage
            src={album.art}
            alt=""
            width={640}
            height={640}
            className="mb-4 aspect-square w-full rounded-chip object-cover lg:mb-0 lg:size-[158px] lg:w-auto lg:shrink-0"
          />
        ) : (
          <Frame className="mb-4 aspect-square rounded-chip text-[10px] lg:mb-0 lg:aspect-auto lg:size-[158px] lg:shrink-0 lg:text-[9.5px]">
            {t('home.music.album.sleeveCaption')}
          </Frame>
        )}

        <div className="lg:min-w-0">
          <h3 className="mb-1.5 text-title-sm font-editorial italic text-on-panel-strong lg:text-title">
            {album.title}
          </h3>
          <p className="mb-1 font-mono text-[12.5px] text-on-panel-accent lg:text-[13.5px]">
            {credit}
          </p>
          {album.trackCount !== null && album.runtimeMin !== null && (
            <p className="mb-3 font-mono text-meta text-on-panel-dim lg:mb-[14px]">
              {t('home.music.album.extent', {
                count: album.trackCount,
                minutes: album.runtimeMin,
              })}
            </p>
          )}
          {album.tags.length > 0 && (
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
          )}
        </div>
      </div>

      {album.tracks.length > 0 && (
        /* Two columns on desktop so a tracklist reads as one block rather than a long ladder.
           CSS columns rather than a grid: they balance the halves and fill top-to-bottom then
           across — the order a sleeve prints them in — without needing a row count computed from
           the track total, which changes with every record. */
        <ol className="mb-[11px] border-t border-line-on-panel-soft pt-[14px] lg:columns-2 lg:gap-x-10 lg:pt-4">
          {album.tracks.map((track) => (
            <TrackRow key={`${track.n}-${track.title}`} track={track} />
          ))}
        </ol>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line-on-panel-soft pt-[14px] lg:gap-4 lg:pt-4">
        {album.url && (
          <a
            href={album.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-meta font-medium text-on-panel-body no-underline transition-colors duration-150 hover:text-accent-on-panel"
          >
            {t('home.music.album.listenLink')}
            <ArrowUpRightIcon className="size-[1em] shrink-0" />
          </a>
        )}
        <a
          href="#picks"
          className="inline-flex items-center gap-1.5 font-mono text-meta font-medium text-on-panel-quiet no-underline transition-colors duration-150 hover:text-on-panel-body"
        >
          {/* Derived, not typed: the count and the pick number are the same number, and
              keeping them in step by hand is exactly the kind of thing that drifts. */}
          {t('home.music.album.archiveLink', { count: album.pick ?? 0 })}
          <ArrowUpRightIcon className="size-[1em] shrink-0" />
        </a>
      </div>
    </article>
  );
}

/** `7:53`. Seconds are zero-padded; minutes are not, the way a sleeve prints them. */
function duration(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

function TrackRow({ track }: { track: MusicTrack }) {
  return (
    <li className="flex min-w-0 items-baseline gap-2.5 break-inside-avoid pb-[7px]">
      <span className="w-4 shrink-0 text-right font-mono text-[11px] text-on-panel-dim tabular-nums">
        {track.n}
      </span>
      {/* Track names are shown as Spotify returns them — never reworded. Truncating is the one
          change its guidelines allow when space runs out, and the full name stays in the title. */}
      <span className="min-w-0 flex-1 truncate text-note-sm text-on-panel-body" title={track.title}>
        {track.title}
      </span>
      {track.sec !== null && (
        <span className="shrink-0 font-mono text-[11px] text-on-panel-dim tabular-nums">
          {duration(track.sec)}
        </span>
      )}
    </li>
  );
}
