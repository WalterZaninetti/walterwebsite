import { music } from '../../content/site';
import { AlbumOfTheMonth } from './AlbumOfTheMonth';
import { NowPlaying } from './NowPlaying';
import { PanelPill } from '../ui/Pill';
import { Eyebrow } from '../ui/Eyebrow';
import { Frame } from '../ui/Frame';
import { cx } from '../ui/cx';

/**
 * "Music, taken seriously".
 *
 * Desktop and mobile diverge more than a reflow here, and the doc keeps its
 * mobile column as it was: on desktop the Bandcamp/Spotify pair sits up in the
 * section header and the previous-picks archive lives inside the album card,
 * while mobile keeps both at the bottom of the section in DOM order.
 *
 * The links are rendered once and moved by breakpoint; the archive is the one
 * block rendered twice, because desktop nests it inside the album card and no
 * amount of ordering can move an element across that boundary. Both copies are
 * `display:none` at the other breakpoint, so only one is ever in the
 * accessibility tree, and it carries no headings or links.
 */
export function MusicSection() {
  return (
    <section
      id="music"
      className="bg-panel-deep px-5 pt-7 pb-8 text-on-panel-strong dark:border-t dark:border-line-soft lg:px-13 lg:pt-14 lg:pb-15"
    >
      <div className="mb-2 lg:mb-[26px] lg:flex lg:items-center lg:justify-between lg:gap-10">
        <h2 className="text-section-sm font-display lg:text-section">
          {music.heading} <span className="italic text-on-panel-accent">{music.headingAccent}</span>
        </h2>
        <MusicLinks className="hidden lg:flex lg:gap-2.5" />
      </div>

      <p className="mb-4 max-w-[34em] text-copy text-on-panel-body text-pretty lg:mb-7 lg:max-w-[52em] lg:text-body">
        <span className="lg:hidden">{music.introShort}</span>
        <span className="hidden lg:inline">{music.intro}</span>
      </p>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-[22px]">
        <AlbumOfTheMonth
          className="lg:col-start-1 lg:row-start-1"
          footer={<PreviousPicks className="mt-auto hidden pt-[22px] lg:flex" />}
        />

        <div className="lg:col-start-2 lg:row-start-1">
          <NowPlaying />
        </div>

        <PreviousPicks className="lg:hidden" />
        <MusicLinks className="flex flex-col gap-2 lg:hidden" stacked />
      </div>
    </section>
  );
}

/** Bandcamp / Spotify. Inline pills in the desktop header, stacked on mobile. */
function MusicLinks({ className, stacked = false }: { className?: string; stacked?: boolean }) {
  return (
    <div className={className}>
      <PanelPill
        href="https://bandcamp.com"
        className={cx(
          'border-transparent bg-sage-solid font-sans text-sage-solid-fg hover:bg-accent hover:text-accent-fg-warm',
          stacked
            ? 'grid h-12 place-items-center text-[13px]'
            : 'px-[18px] py-[11px] text-[12.5px]',
        )}
      >
        {music.links.primary}
      </PanelPill>
      <PanelPill
        href="https://spotify.com"
        className={cx(
          'hover:border-sage-solid hover:bg-fill-on-panel hover:text-on-panel-body',
          stacked
            ? 'grid h-[46px] place-items-center text-[12.5px]'
            : 'px-[18px] py-[11px] text-meta',
        )}
      >
        {music.links.secondary}
      </PanelPill>
    </div>
  );
}

/**
 * The sleeve archive. Desktop shows four months plus a +15 tile in five
 * columns; mobile drops March and re-counts to +16, per the doc.
 */
function PreviousPicks({ className }: { className?: string }) {
  const { label, months, remaining, remainingShort } = music.previous;

  return (
    <div className={cx('flex flex-col gap-2.5', className)}>
      <Eyebrow className="tracking-[0.16em] text-on-panel-quiet lg:tracking-[0.18em]">
        {label}
      </Eyebrow>
      <div className="grid grid-cols-4 gap-2 lg:grid-cols-5 lg:gap-2.5">
        {months.map((month, index) => (
          <Frame
            key={month}
            texture="tight"
            className={
              index === months.length - 1
                ? 'hidden aspect-square rounded-chip text-[9px] lg:grid lg:rounded-tile'
                : 'aspect-square rounded-chip text-[9px] lg:rounded-tile'
            }
          >
            {month}
          </Frame>
        ))}
        <div className="grid aspect-square place-items-center rounded-chip border border-dashed border-hatch-line font-mono text-[11px] font-medium text-on-panel-accent lg:rounded-tile lg:text-label-wide/none">
          <span className="lg:hidden">{remainingShort}</span>
          <span className="hidden lg:inline">{remaining}</span>
        </div>
      </div>
    </div>
  );
}
