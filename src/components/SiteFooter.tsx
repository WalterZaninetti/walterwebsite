import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { footerLegal, site } from '../content/site';
import { navigate } from '../lib/route';
import { Monogram } from './ui/Monogram';
import { GitHubIcon, InstagramIcon, LinkedInIcon, TwitchIcon } from './ui/icons';
import { cx } from './ui/cx';

const socialIcons: Record<string, ComponentType> = {
  github: GitHubIcon,
  twitch: TwitchIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
};

/**
 * The closing bar: the email, then monogram, social glyphs, credit line and
 * legal links. Desktop spreads the three groups across the row; mobile stacks
 * and centres them with 44px touch targets.
 *
 * The email used to headline its own section at 30px on the canvas. It is a
 * secondary ask, so it sits here now — still the largest thing on the bar, but
 * on the bar. Rust on this surface is `accent-on-panel`, never `accent`.
 *
 * `tone` is the one thing about this bar a page gets to choose, and only
 * `/dj-tools` chooses it. That page is blue, and the site's green bar under it
 * was the last green on the page once its tiles and its button turned. It
 * takes the world's own navy — `--project-dj`, the same value as the band the
 * page opens with, so the page opens and closes on one ground rather than
 * gaining a seventh colour.
 *
 * Every ink on the bar was measured against that navy rather than assumed:
 * 13.94 (ink), 8.54 (meta), 16.6 (email), 8.64 (rust), 8.07 (monogram) in
 * light; 10.21 / 5.26 / 17.57 / 6.88 / 8.54 in dark. Only the social pills'
 * hover had to move, because it was a green fill.
 */
const footerTones = {
  site: {
    bar: 'bg-footer-bar',
    pill: 'hover:border-sage-solid hover:bg-sage-solid hover:text-sage-solid-fg',
  },
  dj: {
    bar: 'bg-project-dj',
    pill: 'hover:border-ocean-solid hover:bg-ocean-solid hover:text-ocean-solid-fg',
  },
} as const;

export function SiteFooter({ tone = 'site' }: { tone?: keyof typeof footerTones } = {}) {
  const { t } = useTranslation();
  const world = footerTones[tone];

  return (
    <div className={cx(world.bar, 'px-5 pt-[26px] pb-[30px] text-footer-ink dark:border-t dark:border-line-on-panel-soft lg:px-13 lg:pt-8 lg:pb-[34px]')}>
      <div className="mb-[26px] flex justify-center border-b border-footer-divider pb-[22px] lg:mb-7 lg:justify-start lg:pb-6">
        <a
          href={`mailto:${site.email}`}
          className="border-b border-accent-on-panel pb-[3px] font-display text-[22px]/none text-on-panel-strong no-underline transition-colors duration-150 hover:text-accent-on-panel lg:text-[26px]/none"
        >
          {site.email}
        </a>
      </div>

      <div className="flex flex-col items-center gap-[18px] lg:flex-row lg:flex-wrap lg:justify-between lg:gap-10">
        <div className="flex flex-col items-center gap-[18px] lg:flex-row lg:gap-4">
          {/* On this deep-green bar the accent is always the pale ocean blue,
              in both themes — hence the override rather than the token. */}
          <Monogram size={36} accentClassName="stroke-monogram-accent-on-panel" className="lg:size-[34px]" />
          <span aria-hidden="true" className="hidden h-[26px] w-px bg-footer-divider lg:block" />
          <div className="flex gap-2.5">
            {site.socials.map((social) => {
              const Icon = socialIcons[social.id];
              return (
                <a
                  key={social.id}
                  href={social.href}
                  aria-label={t(`socials.${social.id}`)}
                  className={cx(
                    'grid size-11 place-items-center rounded-full border border-line-on-panel no-underline transition-colors duration-150 lg:size-10',
                    world.pill,
                  )}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>

        <p className="text-center font-display text-[15px]/none text-on-panel-strong">
          {t('home.footer.credit')}
          <span className="text-accent-on-panel">{t('home.footer.creditAccent')}</span>
        </p>

        <div className="flex items-center gap-[18px] font-mono text-[11.5px] text-footer-meta lg:gap-5">
          {footerLegal.map((item) => (
            <a
              key={item.key}
              href={item.href}
              onClick={navigate}
              className="no-underline transition-colors duration-150 hover:text-on-panel-body"
            >
              {t(`home.footer.${item.key}`)}
            </a>
          ))}
          <span>{t('home.footer.copyright')}</span>
        </div>
      </div>
    </div>
  );
}
