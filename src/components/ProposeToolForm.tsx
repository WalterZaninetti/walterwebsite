import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { site } from '../content/site';
import { Eyebrow } from './ui/Eyebrow';
import { NoteIcon } from './ui/icons';
import { cx } from './ui/cx';
import { ArrowRightIcon } from './ui/icons';

// These are the only controls on the page that drop the browser's own outline,
// so they have to put back something at least as loud: the border swap alone
// was a 1px hairline, and the ring is what a keyboard visitor actually catches.
const fieldClasses = cx(
  'w-full rounded-field border border-line-on-panel-strong bg-fill-field px-3.5 text-note text-on-panel',
  'outline-none transition-colors duration-150',
  'focus:border-sage-solid focus:bg-fill-field-focus',
  'focus-visible:ring-2 focus-visible:ring-sage-solid focus-visible:ring-offset-2 focus-visible:ring-offset-panel-alt',
);

/**
 * There's no backend behind the site yet, so submitting composes the message
 * into a mail draft to the address the card already offers as the fallback.
 * Swap `handleSubmit` for a fetch when an endpoint exists — the fields don't
 * need to change.
 */
export function ProposeToolForm() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [idea, setIdea] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const topicLabel = topic.trim() || t('home.propose.topicFallback');
    const body = [
      `${t('home.propose.mailFrom')}: ${name || '—'} <${email || '—'}>`,
      `${t('home.propose.mailAbout')}: ${topicLabel}`,
      '',
      idea,
    ].join('\n');
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      `${t('home.propose.mailSubject')}: ${topicLabel}`,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form
      id="propose"
      onSubmit={handleSubmit}
      className="rounded-card-sm bg-panel-alt p-[22px] text-on-panel dark:border dark:border-line-inset lg:rounded-card lg:px-8 lg:py-[30px]"
    >
      <div className="mb-2.5 flex items-baseline justify-between lg:mb-1.5">
        <Eyebrow className="flex items-center gap-2 tracking-[0.16em] text-on-panel-accent lg:tracking-[0.18em]">
          <NoteIcon />
          {t('home.propose.label')}
        </Eyebrow>
        <p className="hidden font-mono text-micro/none text-on-panel-quiet lg:block">
          {t('home.propose.note')}
        </p>
      </div>

      <h2 className="mb-2.5 text-display-sm font-display lg:mb-2 lg:text-display">
        {t('home.propose.heading')}
        <ArrowRightIcon className="ml-2 inline size-[0.8em] shrink-0 align-baseline text-on-panel-accent" />
      </h2>
      <p className="mb-5 max-w-[34em] text-note/[1.7] text-on-panel-muted text-pretty lg:mb-6 lg:text-copy">
        <span className="md:hidden">{t('home.propose.bodyShort')}</span>
        <span className="hidden md:inline">{t('home.propose.body')}</span>
      </p>

      <div className="flex flex-col gap-[14px] lg:mb-[14px] lg:grid lg:grid-cols-2">
        <Field label={t('home.propose.nameLabel')}>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t('home.propose.namePlaceholder')}
            className={cx(fieldClasses, 'h-12 lg:h-[46px]')}
          />
        </Field>
        <Field label={t('home.propose.emailLabel')}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t('home.propose.emailPlaceholder')}
            className={cx(fieldClasses, 'h-12 lg:h-[46px]')}
          />
        </Field>
      </div>

      {/* Was four preset chips. A free-text field asks the same question without
          making the answer pick a side — and the mail body reads the same either
          way, since it only ever interpolated the chosen label. */}
      <div className="mt-[14px] lg:mt-0 lg:mb-[14px]">
        <Field label={t('home.propose.topicLabel')}>
          <input
            type="text"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder={t('home.propose.topicPlaceholder')}
            className={cx(fieldClasses, 'h-12 lg:h-[46px]')}
          />
        </Field>
      </div>

      <div className="mt-[14px] lg:mt-0 lg:mb-4">
        <Field label={t('home.propose.ideaLabel')}>
          <textarea
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            placeholder={t('home.propose.ideaPlaceholder')}
            rows={3}
            // Mobile gets the doc's taller four-row box without a second element.
            className={cx(fieldClasses, 'min-h-[7.5rem] resize-none py-3 leading-[1.6] lg:min-h-0')}
          />
        </Field>
      </div>

      <div className="mt-[14px] flex items-center justify-between gap-5 lg:mt-0">
        <button
          type="submit"
          className={cx(
            'grid h-12 w-full place-items-center rounded-pill bg-accent font-sans text-[13.5px] font-medium',
            'text-accent-fg-warm transition-colors duration-150',
            'hover:bg-accent-hover-alt hover:text-accent-hover-alt-fg',
            'lg:h-auto lg:w-auto lg:px-[26px] lg:py-[13px]',
          )}
        >
          {t('home.propose.submit')}
        </button>
        <span className="hidden font-mono text-[11.5px]/[1.5] text-on-panel-quiet lg:inline">
          {t('home.propose.aside')}
        </span>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-[7px]">
      <span className="font-mono text-label font-medium uppercase tracking-[0.16em] text-on-panel-accent">
        {label}
      </span>
      {children}
    </label>
  );
}
