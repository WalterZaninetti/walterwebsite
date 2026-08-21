import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import type { Project, ProjectId } from '../content/site';
import { projects } from '../content/site';
import { navigate } from '../lib/route';
import { Eyebrow } from './ui/Eyebrow';
import { Tile } from './ui/Tile';
import { CrateThumb, MagicThumb, SeasonableThumb } from './ProjectThumbs';
import { ArrowRightIcon, CardsIcon, DiscIcon, LeafIcon, ShelfIcon } from './ui/icons';
import { cx } from './ui/cx';

/**
 * Each card carries its own colour and type world — that's the whole idea of
 * the poster shelf — so the per-project classes live in one table keyed by
 * project id. Every value resolves to a theme token, which is how the cards
 * restyle themselves in dark mode without a second table.
 */
const cardTheme: Record<
  ProjectId,
  {
    surface: string;
    /** The thumb's own well — one step deeper than the card it is inset into. */
    thumb: string;
    /** The figure drawn in it. Each is its project's own page figure, small. */
    figure: ComponentType;
    eyebrow: string;
    body: string;
    meta: string;
    tile: ComponentType<{ className?: string }>;
  }
> = {
  magic: {
    surface: 'bg-project-magic text-project-magic-fg hover:shadow-lift-magic',
    thumb: 'bg-project-magic-thumb',
    figure: MagicThumb,
    eyebrow: 'text-project-magic-accent',
    body: 'text-project-magic-body',
    meta: 'text-project-magic-accent',
    tile: CardsIcon,
  },
  dj: {
    surface:
      'bg-project-dj text-project-dj-fg border border-project-dj-border hover:shadow-lift-dj',
    thumb: 'bg-project-dj-badge',
    figure: CrateThumb,
    eyebrow: 'text-project-dj-accent',
    body: 'text-project-dj-body',
    meta: 'text-project-dj-accent',
    tile: DiscIcon,
  },
  food: {
    surface:
      'bg-project-food text-project-food-fg border border-project-food-border hover:shadow-lift-food',
    thumb: 'bg-project-food-thumb',
    figure: SeasonableThumb,
    eyebrow: 'text-project-food-accent',
    body: 'text-project-food-body',
    meta: 'text-project-food-meta',
    tile: LeafIcon,
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
      {/*
        The tile sits on each card's outer top edge (gate C) and overhangs
        24px below `lg` / 28px at `lg` — half its own size. This margin
        absorbs the first row's overhang (there is nothing above the grid to
        collide with but this heading), and the grid below carries a
        matching gap-y for every row after it.
      */}
      <div className="mb-[42px] flex items-center gap-2.5 lg:mb-[54px]">
        <ShelfIcon className="text-ink-strong" />
        <h2 className="text-section-sm font-display text-ink-strong lg:text-section">
          {t('home.projects.heading')}
        </h2>
      </div>

      <div className="grid gap-x-3.5 gap-y-8 lg:grid-cols-3 lg:gap-[22px]">
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
  const Figure = theme.figure;
  const key = `home.projects.${project.id}` as const;

  return (
    <a
      href={project.href}
      onClick={project.href.startsWith('/') ? navigate : undefined}
      className={cx(
        'relative flex flex-col rounded-card-sm p-5 no-underline lg:min-h-[420px] lg:rounded-card lg:p-[26px]',
        'transition-[transform,box-shadow] duration-[180ms] ease-lift lg:hover:-translate-y-1.5',
        theme.surface,
      )}
    >
      {/*
        Gate C: the outer top edge, not the thumb's bottom edge. A sibling of
        the card's own box (this `<a>`), not a child of the thumb below —
        the thumb keeps `overflow-hidden` and would cut the tile in half.
        One transform lives on the card (`lg:hover:-translate-y-1.5` above),
        so the tile rides it rather than detaching on hover.
      */}
      <Tile icon={theme.tile} className="absolute -top-6 left-5 lg:-top-7 lg:left-[26px]" />
      {/*
        One branch fewer than this had: the three thumbs used to be an image,
        a captioned gradient and a caption over a hatch, so the card carried a
        three-way conditional and three sets of copy keys. They are all
        figures now, so the card just renders the one the table names.
      */}
      <div
        className={cx(
          'mb-4 h-[110px] overflow-hidden rounded-field lg:mb-[22px] lg:h-[150px] lg:rounded-thumb',
          theme.thumb,
        )}
      >
        <Figure />
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
        <span className="inline-flex items-center gap-1.5">
          {t('home.projects.openLabel')}
          <ArrowRightIcon className="size-[1em] shrink-0" />
        </span>
      </div>
    </a>
  );
}
