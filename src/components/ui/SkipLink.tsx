import { useTranslation } from 'react-i18next';
import { cx } from './cx';

/**
 * The first thing in the tab order: lets a keyboard or screen-reader visitor jump the header and
 * nav instead of tabbing through them on every page.
 *
 * Hidden until focused — `sr-only` keeps it out of the visual layout without hiding it from
 * assistive tech, and `focus:not-sr-only` brings it back the moment it is tabbed to. It has to
 * paint over the sticky header, hence the z-index.
 *
 * `className` exists because Magic Tools runs its own palette; the default is the site theme.
 */
export function SkipLink({
  href = '#main',
  className = 'bg-accent text-accent-fg',
}: {
  href?: string;
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <a
      href={href}
      className={cx(
        'sr-only rounded-pill font-mono text-nav font-medium uppercase no-underline',
        'focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:px-5 focus:py-3',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        className,
      )}
    >
      {t('common.skipToContent')}
    </a>
  );
}
