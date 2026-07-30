import { useTranslation } from 'react-i18next';
import { site } from '../content/site';
import { Eyebrow } from './ui/Eyebrow';

/** Closing "Now" note and the email sign-off. */
export function NowFooter() {
  const { t } = useTranslation();

  return (
    <footer
      id="now"
      className="grid bg-canvas px-5 pt-[26px] pb-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-15 lg:border-t lg:border-line lg:px-13 lg:pt-[46px] lg:pb-[54px]"
    >
      <div>
        <Eyebrow className="mb-2 text-accent lg:mb-2.5">{t('home.now.label')}</Eyebrow>
        <p className="mb-[18px] max-w-[34em] text-body-sm/[1.7] text-ink-body text-pretty lg:mb-0 lg:text-body/[1.7]">
          <span className="lg:hidden">{t('home.now.bodyShort')}</span>
          <span className="hidden lg:inline">{t('home.now.body')}</span>
        </p>
      </div>

      <a
        href={`mailto:${site.email}`}
        className="justify-self-start border-b border-accent pb-[3px] font-display text-[24px]/none text-ink-strong no-underline transition-colors duration-150 hover:text-accent lg:pb-1 lg:text-[30px]/none"
      >
        {site.email}
      </a>
    </footer>
  );
}
