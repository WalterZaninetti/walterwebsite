import { useTranslation } from 'react-i18next';
import { music } from '../../content/site';
import { previousPicks, type MusicPreviousPick } from '../../content/music';
import { formatPickMonth } from '../../lib/relativeTime';
import { AlbumOfTheMonth } from './AlbumOfTheMonth';
import { SourceCard } from './SourceCard';
import { LazyImage } from '../LazyImage';
import { PanelPill } from '../ui/Pill';
import { Eyebrow } from '../ui/Eyebrow';
import { Frame } from '../ui/Frame';
import { WaveIcon } from '../ui/icons';
import { cx } from '../ui/cx';

/**
 * "Music, taken seriously".
 *
 * Desktop and mobile diverge more than a reflow here, and the doc keeps its
 * mobile column as it was: on desktop the Bandcamp/Spotify pair sits up in the
 * section header, while mobile keeps it at the bottom in DOM order. The links
 * are rendered once and moved by breakpoint.
 *
 * The archive used to be nested inside the album card for desktop and rendered
 * a second time, loose, for mobile — no amount of ordering can move an element
 * across that boundary, so both copies existed with one `display:none`. It now
 * has the column the "listening now" panel used to occupy, which is both the
 * billing nineteen months of picks deserve and one fewer copy to keep in step.
 */
export function MusicSection() {
  const { t } = useTranslation();

  return (
    <section
      id="music"
      className="bg-panel-deep px-5 pt-7 pb-8 text-on-panel-strong dark:border-t dark:border-line-soft lg:px-13 lg:pt-14 lg:pb-15"
    >
      <div className="mb-2 lg:mb-[26px] lg:flex lg:items-center lg:justify-between lg:gap-10">
        <h2 className="text-section-sm font-display lg:text-section">
          {t('home.music.heading')}{' '}
          <span className="italic text-on-panel-accent">{t('home.music.headingAccent')}</span>
        </h2>
        <MusicLinks className="hidden lg:flex lg:gap-2.5" />
      </div>

      <p className="mb-4 max-w-[34em] text-copy text-on-panel-body text-pretty lg:mb-7 lg:max-w-[52em] lg:text-body">
        <span className="md:hidden">{t('home.music.introShort')}</span>
        <span className="hidden md:inline">{t('home.music.intro')}</span>
      </p>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr] lg:items-start lg:gap-[22px]">
        <AlbumOfTheMonth />
        <PreviousPicks />
      </div>

      {/* The two feeds. Equal columns, because neither source outranks the other — and two
          separate cards rather than one merged list, which is both the honest reading (Spotify
          reports plays, Bandcamp reports purchases) and the one Spotify's guidelines allow. */}
      <div className="mt-4 grid gap-4 lg:mt-[22px] lg:grid-cols-2 lg:gap-[22px]">
        <SourceCard source="spotify" />
        <SourceCard source="bandcamp" />
      </div>

      <MusicLinks className="mt-4 flex flex-col gap-2 lg:hidden" stacked />
    </section>
  );
}

/**
 * Bandcamp. Used to be a Bandcamp/Spotify pair; no Spotify link was ever
 * supplied (brief.md, "Still open" #1), and shipping the bare
 * `https://spotify.com` domain was rejected in favour of Bandcamp standing
 * alone. Kept as its own component in case a second link returns.
 *
 * It survives the source cards because it points somewhere they don't: the
 * whole collection, not the five most recent additions.
 */
function MusicLinks({ className, stacked = false }: { className?: string; stacked?: boolean }) {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <PanelPill
        href={music.links.primary}
        className={cx(
          'border-transparent bg-sage-solid font-sans text-sage-solid-fg hover:bg-accent hover:text-accent-fg-warm',
          stacked
            ? 'grid h-12 place-items-center text-[13px]'
            : 'px-[18px] py-[11px] text-[12.5px]',
        )}
      >
        {t('home.music.links.primary')}
      </PanelPill>
    </div>
  );
}

/**
 * The sleeve archive: the picks before this month's, newest first.
 *
 * These were four placeholder frames and a dashed "+15" tile standing in for an archive that did
 * not exist. They are real records now, fetched from Spotify by the same build step that fills
 * the monthly card, so the rail cannot claim a back catalogue the site does not have — the count
 * is whatever `album-of-the-month.json` lists under `previous`, and nothing renders if that is
 * empty.
 *
 * Two across in both schemes. The rail owns the narrow column of the section grid, so a tile is
 * roughly half of it: big enough to read a sleeve, which is the whole job.
 */
function PreviousPicks({ className }: { className?: string }) {
  const { t } = useTranslation();

  if (previousPicks.length === 0) return null;

  return (
    <div id="picks" className={cx('flex flex-col gap-2.5', className)}>
      <Eyebrow className="flex items-center gap-2 tracking-[0.16em] text-on-panel-quiet lg:tracking-[0.18em]">
        <WaveIcon />
        {t('home.music.previous.label')}
      </Eyebrow>
      <ol className="grid grid-cols-2 gap-2.5">
        {previousPicks.map((pick) => (
          <PickTile key={pick.id} pick={pick} />
        ))}
      </ol>
    </div>
  );
}

function PickTile({ pick }: { pick: MusicPreviousPick }) {
  const { t, i18n } = useTranslation();
  const month = formatPickMonth(pick.month, i18n.language);

  const sleeve = pick.art ? (
    /* Unmodified cover art, as Spotify's guidelines require — resized, never cropped or
       overlaid. `alt` is empty because the title and artist are right underneath. */
    <LazyImage
      src={pick.art}
      alt=""
      width={420}
      height={420}
      className="aspect-square w-full rounded-chip object-cover lg:rounded-tile"
    />
  ) : (
    <Frame texture="tight" className="aspect-square rounded-chip text-[9px] lg:rounded-tile">
      {t('home.music.album.sleeveCaption')}
    </Frame>
  );

  const body = (
    <>
      {sleeve}
      {month && (
        <p className="mt-2 font-mono text-[10px]/none uppercase tracking-[0.14em] text-on-panel-quiet">
          {month}
        </p>
      )}
      {/* Track and album names are shown as Spotify returns them — never reworded. Truncating is
          the one change its guidelines allow when space runs out; the full name stays in the
          title attribute. */}
      <p
        className="mt-1.5 truncate text-note-sm text-on-panel-body"
        title={`${pick.title} — ${pick.artist}`}
      >
        {pick.title}
      </p>
      <p className="truncate font-mono text-[11px] text-on-panel-dim">{pick.artist}</p>
    </>
  );

  return (
    <li className="min-w-0">
      {pick.url ? (
        <a
          href={pick.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block min-w-0 no-underline transition-opacity duration-150 hover:opacity-80"
        >
          {body}
        </a>
      ) : (
        body
      )}
    </li>
  );
}
