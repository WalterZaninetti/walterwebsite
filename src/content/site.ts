/**
 * Structure and data for the homepage — everything that is *not* prose.
 *
 * All copy lives in src/locales/{en,it}.json and is reached through t().
 * What stays here: ids, hrefs, layout choices, numeric data, and proper nouns
 * (record and track names, artists) which read the same in either language.
 */

export const site = {
  email: 'lordLiniDev@proton.me',
  nav: [
    { key: 'projects', href: '#projects' },
    { key: 'music', href: '#music' },
  ],
  socials: [
    { id: 'github', href: 'https://github.com/WalterZaninetti' },
    { id: 'twitch', href: 'https://www.twitch.tv/lord_lini' },
    { id: 'instagram', href: 'https://www.instagram.com/lord_lini' },
    { id: 'linkedin', href: 'https://it.linkedin.com/in/walter-zaninetti-99808a83' },
  ],
} as const;

export type ProjectId = 'magic' | 'dj' | 'food';

/**
 * The `--project-*` token family a project's world draws from. Split out
 * from `id` on purpose: `id` also keys `home.projects.*` (unchanged,
 * per copy.md) and, for `food`, the new cross-page `projects.seasonable.*`
 * locale namespace does not match it. `world` is what a component reaches
 * for when it needs the token family, so the id/namespace naming question
 * never has to touch it. Today `world` and `id` hold the same three values;
 * that is a coincidence of there being three projects and three worlds, not
 * a guarantee.
 */
export type ProjectWorld = 'magic' | 'dj' | 'food';

export type Project = {
  id: ProjectId;
  href: string;
  /** Which family the title is set in — the point of the poster shelf. */
  titleFace: 'editorial' | 'sans' | 'display';
  world: ProjectWorld;
};

export const projects: readonly Project[] = [
  { id: 'magic', href: '/magic-tools', titleFace: 'editorial', world: 'magic' },
  { id: 'dj', href: '/dj-tools', titleFace: 'sans', world: 'dj' },
  { id: 'food', href: '/seasonable', titleFace: 'display', world: 'food' },
];

/**
 * Record and track names — proper nouns, identical in both languages.
 *
 * The album of the month used to be hardcoded here. It is now snapshotted from Spotify at build
 * time into music.generated.json; the record itself is chosen in album-of-the-month.json.
 */
export const music = {
  links: {
    /** No Spotify link was supplied (brief.md, "Still open" #1) — Bandcamp
     * stands alone rather than shipping a bare `https://spotify.com`. */
    primary: 'https://bandcamp.com/lord_lini',
  },
} as const;

export const proposeTopics = ['Magic', 'Music', 'Food', 'Other'] as const;
export type ProposeTopic = (typeof proposeTopics)[number];

export const footerLegal = [
  { key: 'cookiePolicy', href: '/cookie-policy' },
  { key: 'privacy', href: '/privacy' },
] as const;
