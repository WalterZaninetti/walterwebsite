import { music } from '../../content/site';
import { Eyebrow } from '../ui/Eyebrow';
import { Frame } from '../ui/Frame';

const np = music.nowPlaying;

/**
 * Live listening card. The waveform and progress are the doc's static values —
 * point them at a real Spotify "currently playing" payload and nothing here has
 * to change shape.
 */
export function NowPlaying() {
  return (
    <article className="flex flex-col rounded-card-sm border border-line-inset bg-panel-inset p-5 lg:rounded-card lg:p-6">
      <div className="mb-4 flex items-center justify-between lg:mb-5">
        <Eyebrow
          as="span"
          className="flex items-center gap-2 tracking-[0.16em] text-live-400 lg:gap-[9px] lg:tracking-[0.18em]"
        >
          <span
            aria-hidden="true"
            className="size-[7px] rounded-full bg-live-500 shadow-[0_0_0_4px_rgb(74_222_138/0.18)]"
          />
          {np.label}
        </Eyebrow>
        <span className="font-mono text-label-wide/none tracking-normal text-on-panel-dim">
          <span className="lg:hidden">{np.sourceShort}</span>
          <span className="hidden lg:inline">{np.source}</span>
        </span>
      </div>

      <div className="mb-4 flex items-center gap-[14px] lg:mb-5 lg:gap-4">
        <Frame
          texture="tight"
          className="size-[76px] shrink-0 rounded-field text-[9px] lg:size-[104px]"
        >
          {np.artCaption}
        </Frame>
        <div className="min-w-0">
          <p className="mb-1 text-[16px]/[1.25] font-medium text-on-panel-strong lg:mb-[5px] lg:text-[19px]/[1.25]">
            {np.track}
          </p>
          <p className="mb-[3px] text-note-sm/[1.4] text-on-panel-muted lg:mb-1 lg:text-note/[1.4]">
            {np.artist}
          </p>
          <p className="font-mono text-micro/none text-on-panel-dim lg:text-[11.5px]">
            {np.release}
          </p>
        </div>
      </div>

      <div aria-hidden="true" className="mb-3 flex h-[26px] items-end gap-[3px] lg:mb-3.5 lg:h-[34px]">
        {np.waveform.map(([height, opacity], index) => (
          <div
            key={index}
            // The doc's mobile column trims the waveform to ten bars.
            className={
              index >= np.waveform.length - 2
                ? 'hidden flex-1 bg-live-500 lg:block'
                : 'flex-1 bg-live-500'
            }
            style={{ height: `${height}%`, opacity }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2.5 font-mono text-label-wide/none tracking-normal text-on-panel-dim lg:mb-[22px]">
        <span>{np.elapsed}</span>
        <span className="relative h-[3px] flex-1 rounded-pill bg-sage-200/16">
          <span
            className="absolute inset-y-0 left-0 rounded-pill bg-live-500"
            style={{ width: `${np.progress}%` }}
          />
        </span>
        <span>{np.duration}</span>
      </div>

      {/* The recently-played list is desktop-only in the doc's mobile column. */}
      <div className="hidden lg:flex lg:flex-col">
        <Eyebrow className="mb-3 text-on-panel-quiet">{np.recentLabel}</Eyebrow>
        <div className="-mt-0.5 flex flex-col">
          {np.recent.map((track) => (
            <div
              key={track.title}
              className="flex items-center gap-3 border-t border-line-inset-soft py-2.5"
            >
              <div aria-hidden="true" className="size-[34px] shrink-0 rounded-frame bg-line-inset-soft" />
              <div className="min-w-0 flex-1">
                <p className="text-note-sm/[1.3] text-on-panel-track">{track.title}</p>
                <p className="font-mono text-[11.5px] text-on-panel-dim">{track.artist}</p>
              </div>
              <span className="font-mono text-label-wide/none tracking-normal text-on-panel-dimmer">
                {track.ago}
              </span>
            </div>
          ))}
        </div>
        <a
          href="#listening"
          className="mt-auto pt-4 font-mono text-meta font-medium text-live-400 no-underline transition-colors duration-150 hover:text-on-panel-strong"
        >
          {np.historyLink}
        </a>
      </div>
    </article>
  );
}
