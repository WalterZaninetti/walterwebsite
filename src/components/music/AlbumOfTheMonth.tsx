import { useTranslation } from 'react-i18next';
import { albumOfTheMonth } from '../../content/music';
import { LazyImage } from '../LazyImage';
import { Chip } from '../ui/Pill';
import { Eyebrow } from '../ui/Eyebrow';
import { Frame } from '../ui/Frame';
import { cx } from '../ui/cx';

/**
 * The monthly pick. Sleeve sits beside the note on desktop, above it on mobile.
 *
 * Everything factual — sleeve, title, artist, label, year, length, genres — is snapshotted from
 * Spotify at build time; change the record by editing content/album-of-the-month.json and
 * rebuilding. The note is not, and cannot be: Spotify exposes no description or editorial text
 * for an album on any endpoint, so the reason a record was picked stays hand-written in the
 * locale files, keyed by pick number so an old note never lands under a new record.
 */
export function AlbumOfTheMonth({ className }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const album = albumOfTheMonth;

  if (!album) return null;

  /* Localised month name from 'YYYY-MM'. The day is forced to the 2nd and read in UTC so a
     negative timezone offset cannot roll the 1st back into the previous month. */
  const month = album.month
    ? new Intl.DateTimeFormat(i18n.language, { month: 'long', year: 'numeric', timeZone: 'UTC' })
        .format(new Date(`${album.month}-02T00:00:00Z`))
    : null;

  /* "Masayoshi Takanaka · Universal Music LLC, 1978" — and correct when either half is missing,
     since `label` is on its way out of the API. */
  const credit = [album.artist, [album.label, album.year].filter(Boolean).join(', ')]
    .filter(Boolean)
    .join(' · ');

  /* The note is keyed by pick number: a new record with no note yet shows nothing rather than
     the previous month's reasoning attached to the wrong album. */
  const noteKey = `home.music.album.notes.${album.pick}`;
  const note = i18n.exists(noteKey) ? t(noteKey) : null;

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
          {note && (
            <p id="album-note" className="mb-4 text-note/[1.7] text-on-panel-prose text-pretty">
              {note}
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

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line-on-panel-soft pt-[14px] lg:gap-4 lg:pt-4">
        {album.url && (
          <a
            href={album.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-meta font-medium text-on-panel-body no-underline transition-colors duration-150 hover:text-accent-on-panel"
          >
            {t('home.music.album.listenLink')}
          </a>
        )}
        <a
          href="#picks"
          className="font-mono text-meta font-medium text-on-panel-quiet no-underline transition-colors duration-150 hover:text-on-panel-body"
        >
          {/* Derived, not typed: the count and the pick number are the same number, and
              keeping them in step by hand is exactly the kind of thing that drifts. */}
          {t('home.music.album.archiveLink', { count: album.pick ?? 0 })}
        </a>
      </div>
    </article>
  );
}
