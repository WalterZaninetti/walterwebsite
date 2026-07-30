import { useTranslation } from 'react-i18next';
import { LANGUAGES, type Language } from '../../lib/i18n';
import { cx } from './cx';

/**
 * EN / IT toggle. Not in the design docs — the site became bilingual after
 * they were drawn — so it borrows the header's own mono label type rather
 * than inventing a new control style.
 */
export function LanguageSwitch({
  className,
  activeClassName,
  idleClassName,
}: {
  className?: string;
  activeClassName: string;
  idleClassName: string;
}) {
  const { i18n, t } = useTranslation();
  const current = (i18n.resolvedLanguage ?? 'en') as Language;

  return (
    <div
      className={cx('flex items-center gap-1', className)}
      role="group"
      aria-label={t('common.language')}
    >
      {LANGUAGES.map((lng, index) => (
        <span key={lng} className="flex items-center gap-1">
          {index > 0 && (
            <span aria-hidden="true" className={idleClassName}>
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => void i18n.changeLanguage(lng)}
            aria-current={current === lng}
            aria-label={t(lng === 'en' ? 'common.languageEnglish' : 'common.languageItalian')}
            className={cx(
              'cursor-pointer bg-transparent transition-colors duration-150',
              current === lng ? activeClassName : idleClassName,
            )}
          >
            {lng.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
