/**
 * Structure for the two "not built yet" rundown pages — `/dj-tools` and
 * `/seasonable`. Per architecture.md Decision 2, they are instances of one
 * type: same three-section skeleton by strategic decision (site.md,
 * "symmetry is deliberate"), so one module keyed by project id is the
 * honest model, not two near-identical files.
 *
 * All prose lives in src/locales/{en,it}.json under `projects.<namespace>.*`
 * — see the naming note below for why `namespace` is its own field.
 */

export type ProjectPageId = 'dj' | 'food';

/**
 * copy.md's unresolved #5: `site.ts` keeps the project id `food` (renaming
 * it would cascade into `home.projects.food.*`, which copy.md marks `hold`
 * — out of scope this run), while `architecture.md` names the new locale
 * namespace `projects.seasonable.*`. Rather than rename the id, this map
 * carries the one place the two names meet, named here so it isn't
 * discovered in the diff.
 */
export const projectLocaleNamespace: Record<ProjectPageId, 'dj' | 'seasonable'> = {
  dj: 'dj',
  food: 'seasonable',
};

/** Which CSS figure (direction.md §5.2) stands in for the tool that doesn't exist yet. */
export type ProjectFigure = 'camelot' | 'months';

export type ProjectPageContent = {
  id: ProjectPageId;
  figure: ProjectFigure;
};

export const projectPages: Record<ProjectPageId, ProjectPageContent> = {
  dj: { id: 'dj', figure: 'camelot' },
  food: { id: 'food', figure: 'months' },
};
