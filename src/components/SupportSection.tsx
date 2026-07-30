import { coffee } from '../content/site';
import { ProposeToolForm } from './ProposeToolForm';
import { AccentButton, SurfacePill } from './ui/Pill';
import { Eyebrow } from './ui/Eyebrow';

/** The two asks, side by side on desktop: support the work, or suggest work. */
export function SupportSection() {
  return (
    <section
      id="support"
      className="grid gap-3.5 bg-canvas px-5 pt-[26px] lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch lg:gap-[34px] lg:px-13 lg:pt-13 lg:pb-14"
    >
      <CoffeeCard />
      <ProposeToolForm />
    </section>
  );
}

function CoffeeCard() {
  return (
    <div className="flex flex-col rounded-card-sm border border-line-card bg-surface p-[22px] lg:rounded-card lg:p-7">
      <Eyebrow className="mb-2.5 tracking-[0.16em] text-accent lg:mb-3 lg:tracking-[0.18em]">
        {coffee.label}
      </Eyebrow>
      <h2 className="mb-2.5 text-display-sm font-display text-ink-strong lg:mb-3 lg:text-display">
        {coffee.heading}
        <span className="italic text-sage">.</span>
      </h2>
      <p className="mb-[18px] text-note/[1.7] text-ink-soft text-pretty lg:mb-[22px] lg:text-copy">
        <span className="lg:hidden">{coffee.bodyShort}</span>
        <span className="hidden lg:inline">{coffee.body}</span>
      </p>

      <div className="flex flex-col gap-2.5 lg:mt-auto">
        <AccentButton
          href="#coffee"
          className="flex h-12 items-center justify-center gap-2 text-[13.5px]"
        >
          {coffee.primary}
        </AccentButton>
        <div className="grid grid-cols-2 gap-2.5">
          {coffee.tiers.map((tier) => (
            <SurfacePill key={tier.label} href="#coffee" className="h-11">
              <span className="lg:hidden">{tier.labelShort}</span>
              <span className="hidden lg:inline">{tier.label}</span>
            </SurfacePill>
          ))}
        </div>
        <p className="mt-1.5 hidden font-mono text-micro text-ink-faint lg:block">
          {coffee.fineprint}
        </p>
      </div>
    </div>
  );
}
