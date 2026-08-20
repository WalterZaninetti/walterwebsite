import { useTranslation } from 'react-i18next';
import { site } from '../content/site';
import { AccentButton, PanelPill } from './ui/Pill';
import { Eyebrow } from './ui/Eyebrow';
import { Frame } from './ui/Frame';
import { ArrowUpRightIcon } from './ui/icons';

/**
 * Full-height intro screen.
 *
 * Desktop is the doc's .86fr / 1.14fr split: deep-green panel on the left,
 * headline on the canvas to the right. Mobile collapses to one dark block in a
 * different reading order (eyebrow → headline → deck → CTA → portrait → bio →
 * socials), so the panel is built as two grid cells that sit either side of the
 * headline in DOM order and rejoin into one column on the left at `lg`. That
 * keeps a single <h1> in the markup instead of one per breakpoint.
 *
 * The deck and the primary CTA ship at every width. They used to be desktop-
 * only, which left the phone hero with nothing to click but four links off the
 * site — the DOM order was already right, only the visibility was wrong.
 */
export function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id="top"
      className="grid bg-panel text-on-panel lg:min-h-[780px] lg:grid-cols-[0.86fr_1.14fr] lg:grid-rows-[auto_1fr] lg:bg-canvas"
    >
      <div className="bg-panel px-5 pt-7 pb-5 dark:lg:border-r dark:lg:border-line-soft lg:col-start-1 lg:row-start-1 lg:px-10 lg:pt-11 lg:pb-0">
        <Eyebrow className="text-on-panel-label">
          {t('home.hero.eyebrow')}
          <span className="hidden lg:inline">{t('home.hero.eyebrowSuffix')}</span>
        </Eyebrow>
      </div>

      <div className="hero-glow relative flex flex-col justify-center px-5 pb-[18px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:bg-canvas lg:px-14 lg:pb-0">
        <h1 className="text-hero-sm font-display text-on-panel-strong lg:mb-6 lg:text-hero lg:text-balance lg:text-ink-strong">
          {t('home.hero.headline')}
          <br />
          <span className="italic text-on-panel-label lg:text-sage">
            {t('home.hero.headlineAccent')}
          </span>
        </h1>

        {/* The long deck runs to ~197 characters, so the measure opens to 30em
            (≈60 characters) from md up rather than letting it stack four lines.
            The short variant is 140 and keeps the tighter 24em. */}
        <p className="mt-3 mb-5 max-w-[24em] text-body-sm text-on-panel-body text-pretty md:max-w-[30em] md:text-lead lg:mt-0 lg:mb-[34px] lg:text-ink-body">
          <span className="md:hidden">{t('home.hero.deckShort')}</span>
          <span className="hidden md:inline">{t('home.hero.deck')}</span>
        </p>

        <div className="flex items-center gap-4">
          <AccentButton
            href="#projects"
            fg="paper"
            className="px-6 py-[13px] text-[13.5px] max-md:w-full max-md:text-center"
          >
            {t('home.hero.primaryCta')}
          </AccentButton>
        </div>

        <div className="absolute bottom-10 left-14 hidden items-baseline gap-[14px] font-mono text-micro text-ink-faint lg:flex">
          <span className="flex items-baseline gap-[14px]">
            {t('home.hero.stat1')}
            <span aria-hidden="true">·</span>
          </span>
          <span className="flex items-baseline gap-[14px]">
            {t('home.hero.stat2')}
            <span aria-hidden="true">·</span>
          </span>
          <span className="text-accent">{t('home.hero.statAccent')}</span>
        </div>
      </div>

      <div className="flex flex-col bg-panel px-5 pb-[30px] dark:lg:border-r dark:lg:border-line-soft lg:col-start-1 lg:row-start-2 lg:px-10 lg:pb-11">
        {/* my-auto centres the bio block in the leftover height, which is how
            the doc's space-between panel distributes eyebrow / bio / socials.
            At md the panel is a full-width band with far more room than the
            phone column it was drawn for, so portrait and bio sit side by side
            rather than stacking the frame into a letterbox. */}
        <div className="md:grid md:grid-cols-[240px_1fr] md:items-start md:gap-7 lg:my-auto lg:block">
          <Frame
            texture="portrait"
            align="end"
            className="mb-[22px] h-[170px] rounded-frame p-3 text-label text-on-panel-label md:mb-0 md:h-[240px] lg:mb-[30px] lg:h-[280px] lg:p-3.5"
          >
            <span className="md:hidden">{t('home.hero.portraitCaptionShort')}</span>
            <span className="hidden md:inline">{t('home.hero.portraitCaption')}</span>
          </Frame>

          {/* max-w holds the measure if the panel ever gets wider than the
              doc's 620px — long lines were the other half of the wide-screen
              problem. */}
          <div>
            <p className="mb-6 max-w-[34em] text-body-sm text-on-panel-body text-pretty md:mb-0 lg:hidden">
              {t('home.hero.bioShort')}
            </p>
            <p className="mb-[18px] hidden max-w-[34em] text-body-sm text-on-panel-body text-pretty lg:block">
              {t('home.hero.bio1')}
            </p>
            <p className="hidden max-w-[34em] text-body-sm text-on-panel-soft text-pretty lg:block">
              {t('home.hero.bio2')}
            </p>
          </div>
        </div>

        <div className="max-md:mt-6">
          <Eyebrow className="mb-3 hidden text-on-panel-quiet lg:block">
            {t('home.hero.socialsLabel')}
          </Eyebrow>
          {/* Content-width chips, not full-bleed grid cells: these four all
              leave the site, and as stretched cells they read as calls to
              action competing with the one the hero actually has. min-h-11
              keeps the 44px touch target the grid was giving for free. */}
          <div className="flex flex-wrap gap-2">
            {site.socials.map((social) => (
              <PanelPill
                key={social.id}
                href={social.href}
                className="inline-flex min-h-11 items-center gap-1.5 px-3.5 text-[12.5px] lg:min-h-0 lg:px-[15px] lg:py-[9px] lg:text-meta"
              >
                {t(`socials.${social.id}`)}
                <ArrowUpRightIcon className="size-[1em] shrink-0" />
              </PanelPill>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
