import { music } from '../../content/site';
import { AlbumOfTheMonth } from './AlbumOfTheMonth';
import { NowPlaying } from './NowPlaying';
import { PanelPill } from '../ui/Pill';
import { Eyebrow } from '../ui/Eyebrow';
import { Frame } from '../ui/Frame';

/**
 * "Music, taken seriously".
 *
 * Mobile stacks intro → pick → now-playing → archive → links, while desktop
 * pulls the now-playing card out into a full-height right column. Rather than
 * duplicate markup, the children are laid out flat and placed explicitly on the
 * desktop grid — DOM order is the mobile order.
 */
export function MusicSection() {
  return (
    <section
      id="music"
      className="bg-panel-deep px-5 pt-7 pb-8 text-on-panel-strong dark:border-t dark:border-line-soft lg:px-13 lg:pt-14 lg:pb-15"
    >
      <div className="mb-2 lg:mb-[30px] lg:flex lg:items-baseline lg:justify-between">
        <h2 className="text-section-sm font-display lg:text-section">
          {music.heading}{' '}
          <span className="italic text-on-panel-accent">{music.headingAccent}</span>
        </h2>
        <span className="hidden font-mono text-label-wide font-medium uppercase text-on-panel-quiet lg:inline">
          {music.note}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-[auto_auto_auto_1fr] lg:gap-[34px]">
        <p className="max-w-[34em] text-copy text-on-panel-body text-pretty lg:col-start-1 lg:row-start-1 lg:text-body">
          <span className="lg:hidden">{music.introShort}</span>
          <span className="hidden lg:inline">{music.intro}</span>
        </p>

        <div className="lg:col-start-1 lg:row-start-2">
          <AlbumOfTheMonth />
        </div>

        <div className="lg:col-start-2 lg:row-span-4 lg:row-start-1">
          <NowPlaying />
        </div>

        <PreviousPicks />

        <div className="flex flex-col gap-2 lg:col-start-1 lg:row-start-4 lg:mt-auto lg:flex-row lg:flex-wrap lg:gap-2.5">
          <PanelPill
            href="https://bandcamp.com"
            className="grid h-12 place-items-center border-transparent bg-sage-solid font-sans text-[13px] text-sage-solid-fg hover:bg-accent hover:text-accent-fg-warm lg:h-auto lg:px-5 lg:py-3"
          >
            {music.links.primary}
          </PanelPill>
          <PanelPill
            href="https://spotify.com"
            className="grid h-[46px] place-items-center text-[12.5px] hover:border-sage-solid hover:bg-fill-on-panel hover:text-on-panel-body lg:h-auto lg:px-5 lg:py-3"
          >
            {music.links.secondary}
          </PanelPill>
        </div>
      </div>
    </section>
  );
}

/**
 * The sleeve archive. Desktop shows four months plus a +15 tile in five
 * columns; mobile drops March and re-counts to +16, per the doc.
 */
function PreviousPicks() {
  const { label, months, remaining, remainingShort } = music.previous;

  return (
    <div className="flex flex-col gap-2.5 lg:col-start-1 lg:row-start-3">
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
