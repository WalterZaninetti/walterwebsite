import { useTranslation } from 'react-i18next';
import { music } from '../../content/site';
import { AlbumOfTheMonth } from './AlbumOfTheMonth';
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
        <MusicLinks className="flex flex-col gap-2 lg:hidden" stacked />
      </div>
    </section>
  );
}

/**
 * Bandcamp. Used to be a Bandcamp/Spotify pair; no Spotify link was ever
 * supplied (brief.md, "Still open" #1), and shipping the bare
 * `https://spotify.com` domain was rejected in favour of Bandcamp standing
 * alone. Kept as its own component in case a second link returns.
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
 * The sleeve archive. Mobile drops March and re-counts to +16, per the doc; the
 * desktop rail shows all four plus the +15 tile, three across, so the dashed
 * terminator closes the second row.
 */
function PreviousPicks({ className }: { className?: string }) {
  const { t } = useTranslation();
  const months = t('home.music.previous.months', { returnObjects: true }) as string[];

  return (
    <div id="picks" className={cx('flex flex-col gap-2.5', className)}>
      <Eyebrow className="flex items-center gap-2 tracking-[0.16em] text-on-panel-quiet lg:tracking-[0.18em]">
        <WaveIcon />
        {t('home.music.previous.label')}
      </Eyebrow>
      <div className="grid grid-cols-4 gap-2 lg:grid-cols-3 lg:gap-2.5">
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
          <span className="lg:hidden">{t('home.music.previous.remainingShort')}</span>
          <span className="hidden lg:inline">{t('home.music.previous.remaining')}</span>
        </div>
      </div>
    </div>
  );
}
