import { useTranslation } from 'react-i18next';
import { ProposeToolForm } from './ProposeToolForm';
import { AccentButton, SurfacePill } from './ui/Pill';
import { Eyebrow } from './ui/Eyebrow';
import { CupIcon } from './ui/icons';

/**
 * The two asks. They are not equal: proposing a tool is what feeds the work,
 * so it leads and takes the wider column, and the coffee card follows as its
 * companion. They also no longer stretch to match — making a short card the
 * height of a tall one is what put 314px of nothing under the coffee copy.
 */
export function SupportSection() {
  return (
    <section
      id="support"
      className="grid gap-3.5 bg-canvas px-5 pt-[26px] lg:grid-cols-[1.18fr_0.82fr] lg:items-start lg:gap-[34px] lg:px-13 lg:pt-13 lg:pb-14"
    >
      <ProposeToolForm />
      <CoffeeCard />
    </section>
  );
}

function CoffeeCard() {
  const { t } = useTranslation();

  return (
    <div
      id="coffee"
      className="flex flex-col rounded-card-sm border border-line-card bg-surface p-[22px] lg:rounded-card lg:p-7"
    >
      <Eyebrow className="mb-2.5 flex items-center gap-2 tracking-[0.16em] text-accent lg:mb-3 lg:tracking-[0.18em]">
        <CupIcon />
        {t('home.coffee.label')}
      </Eyebrow>
      <h2 className="mb-2.5 text-display-sm font-display text-ink-strong lg:mb-3 lg:text-display">
        {t('home.coffee.heading')}
        <span className="italic text-sage">.</span>
      </h2>
      <p className="mb-[18px] text-note/[1.7] text-ink-soft text-pretty lg:mb-[22px] lg:text-copy">
        <span className="md:hidden">{t('home.coffee.bodyShort')}</span>
        <span className="hidden md:inline">{t('home.coffee.body')}</span>
      </p>

      <div className="flex flex-col gap-2.5">
        <AccentButton
          href="#coffee"
          className="flex h-12 items-center justify-center gap-2 text-[13.5px]"
        >
          {t('home.coffee.primary')}
        </AccentButton>
        <div className="grid grid-cols-2 gap-2.5">
          {(['tier1', 'tier2'] as const).map((tier) => (
            <SurfacePill key={tier} href="#coffee" className="h-11">
              <span className="md:hidden">{t(`home.coffee.${tier}Short`)}</span>
              <span className="hidden md:inline">{t(`home.coffee.${tier}`)}</span>
            </SurfacePill>
          ))}
        </div>
        <p className="mt-1.5 hidden font-mono text-micro text-ink-faint lg:block">
          {t('home.coffee.fineprint')}
        </p>
      </div>
    </div>
  );
}
