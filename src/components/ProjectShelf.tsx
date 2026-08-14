import { useTranslation } from 'react-i18next';
import type { Project, ProjectId } from '../content/site';
import { projects } from '../content/site';
import { navigate } from '../lib/route';
import { Eyebrow } from './ui/Eyebrow';
import { cx } from './ui/cx';

/**
 * Each card carries its own colour and type world — that's the whole idea of
 * the poster shelf — so the per-project classes live in one table keyed by
 * project id. Every value resolves to a theme token, which is how the cards
 * restyle themselves in dark mode without a second table.
 */
const cardTheme: Record<
  ProjectId,
  { surface: string; thumb: string; eyebrow: string; body: string; meta: string }
> = {
  magic: {
    surface: 'bg-project-magic text-project-magic-fg hover:shadow-lift-magic',
    thumb: 'bg-project-magic-thumb text-project-magic-accent',
    eyebrow: 'text-project-magic-accent',
    body: 'text-project-magic-body',
    meta: 'text-project-magic-accent',
  },
  dj: {
    surface:
      'bg-project-dj text-project-dj-fg border border-project-dj-border hover:shadow-lift-dj',
    thumb: 'camelot',
    eyebrow: 'text-project-dj-accent',
    body: 'text-project-dj-body',
    meta: 'text-project-dj-accent',
  },
  food: {
    surface:
      'bg-project-food text-project-food-fg border border-project-food-border hover:shadow-lift-food',
    thumb: 'hatch-food text-project-food-thumb-fg',
    eyebrow: 'text-project-food-accent',
    body: 'text-project-food-body',
    meta: 'text-project-food-meta',
  },
};

const titleFace: Record<Project['titleFace'], string> = {
  editorial: 'font-editorial italic text-[28px]/none lg:text-[34px]/none',
  sans: 'font-sans font-semibold text-[25px]/none tracking-[-0.02em] lg:text-[30px]/none lg:tracking-[-0.025em]',
  display: 'font-display text-[30px]/none lg:text-[36px]/none',
};

export function ProjectShelf() {
  const { t } = useTranslation();

  return (
    <section
      id="projects"
      className="bg-canvas-band px-5 pt-[26px] pb-[30px] dark:border-t dark:border-line-soft lg:px-13 lg:pt-13 lg:pb-15"
    >
      <div className="mb-[18px] lg:mb-[26px]">
        <h2 className="text-section-sm font-display text-ink-strong lg:text-section">
          {t('home.projects.heading')}
        </h2>
      </div>

      <div className="grid gap-3.5 lg:grid-cols-3 lg:gap-[22px]">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const { t } = useTranslation();
  const theme = cardTheme[project.id];
  const key = `home.projects.${project.id}` as const;

  return (
    <a
      href={project.href}
      // Magic Tools is a real page now; the other two are still placeholders.
      onClick={project.href.startsWith('/') ? navigate : undefined}
      className={cx(
        'flex flex-col rounded-card-sm p-5 no-underline lg:min-h-[420px] lg:rounded-card lg:p-[26px]',
        'transition-[transform,box-shadow] duration-[180ms] ease-lift lg:hover:-translate-y-1.5',
        theme.surface,
      )}
    >
      <div
        className={cx(
          'mb-4 grid h-[110px] place-items-center rounded-field lg:mb-[22px] lg:h-[150px] lg:rounded-thumb',
          theme.thumb,
        )}
      >
        {project.id === 'dj' ? (
          <span className="rounded-pill bg-project-dj-badge px-2.5 py-[5px] font-mono text-label/none text-project-dj-fg">
            {t(`${key}.thumbCaption`)}
          </span>
        ) : (
          <span className="font-mono text-label/none">
            <span className="md:hidden">{t(`${key}.thumbCaptionShort`)}</span>
            <span className="hidden md:inline">{t(`${key}.thumbCaption`)}</span>
          </span>
        )}
      </div>

      <Eyebrow className={cx('mb-2 tracking-[0.16em] lg:mb-2.5 lg:tracking-[0.18em]', theme.eyebrow)}>
        <span className="md:hidden">{t(`${key}.eyebrowShort`)}</span>
        <span className="hidden md:inline">{t(`${key}.eyebrow`)}</span>
      </Eyebrow>

      <h3 className={cx('mb-2 lg:mb-3', titleFace[project.titleFace])}>{t(`${key}.title`)}</h3>

      <p className={cx('text-note-sm text-pretty lg:mb-5 lg:text-note', theme.body)}>
        <span className="md:hidden">{t(`${key}.descriptionShort`)}</span>
        <span className="hidden md:inline">{t(`${key}.description`)}</span>
      </p>

      <div
        className={cx(
          'mt-auto hidden items-center justify-between font-mono text-micro font-medium lg:flex',
          theme.meta,
        )}
      >
        <span>{t(`${key}.meta`)}</span>
        <span>{t('home.projects.openLabel')}</span>
      </div>
    </a>
  );
}
