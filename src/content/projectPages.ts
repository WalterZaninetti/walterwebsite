/**
 * Structure for the "not built yet" rundown page — `/seasonable`.
 *
 * It had two members. `/dj-tools` left when the tool it describes stopped
 * being an idea with a name and became a bounded capability set: it renders
 * `src/components/dj/DjToolsPage.tsx` now, and its prose moved to the
 * top-level `dj.*` locale namespace. The record shape stays rather than
 * collapsing into two constants — `/seasonable` is unchanged by that move and
 * rewriting it would have been a diff nobody asked for.
 *
 * All prose lives in src/locales/{en,it}.json under `projects.<namespace>.*`
 * — see the naming note below for why `namespace` is its own field.
 */

export type ProjectPageId = 'food';

/**
 * copy.md's unresolved #5: `site.ts` keeps the project id `food` (renaming
 * it would cascade into `home.projects.food.*`, which copy.md marks `hold`
 * — out of scope this run), while `architecture.md` names the new locale
 * namespace `projects.seasonable.*`. Rather than rename the id, this map
 * carries the one place the two names meet, named here so it isn't
 * discovered in the diff.
 */
export const projectLocaleNamespace: Record<ProjectPageId, 'seasonable'> = {
  food: 'seasonable',
};

/** Which CSS figure (direction.md §5.2) stands in for the tool that doesn't exist yet. */
export type ProjectFigure = 'months';

export type ProjectPageContent = {
  id: ProjectPageId;
  figure: ProjectFigure;
};

export const projectPages: Record<ProjectPageId, ProjectPageContent> = {
  food: { id: 'food', figure: 'months' },
};
