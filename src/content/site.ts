/**
 * Structure and data for the homepage — everything that is *not* prose.
 *
 * All copy lives in src/locales/{en,it}.json and is reached through t().
 * What stays here: ids, hrefs, layout choices, numeric data, and proper nouns
 * (record and track names, artists) which read the same in either language.
 */

export const site = {
  email: 'say@walter.dev',
  nav: [
    { key: 'projects', href: '#projects' },
    { key: 'music', href: '#music' },
    { key: 'now', href: '#now' },
  ],
  socials: [
    { id: 'github', href: 'https://github.com' },
    { id: 'twitch', href: 'https://twitch.tv' },
    { id: 'instagram', href: 'https://instagram.com' },
    { id: 'linkedin', href: 'https://linkedin.com' },
  ],
} as const;

export type ProjectId = 'magic' | 'dj' | 'food';

export type Project = {
  id: ProjectId;
  href: string;
  /** Which family the title is set in — the point of the poster shelf. */
  titleFace: 'editorial' | 'sans' | 'display';
};

export const projects: readonly Project[] = [
  { id: 'magic', href: '/magic-tools', titleFace: 'editorial' },
  { id: 'dj', href: '#dj-tool', titleFace: 'sans' },
  { id: 'food', href: '#seasonable', titleFace: 'display' },
];

/** Record and track names — proper nouns, identical in both languages. */
export const music = {
  album: {
    title: 'Voices From The Lake',
    credit: 'Donato Dozzy & Neel · Prologue, 2012',
  },
  links: {
    primary: 'https://bandcamp.com',
    secondary: 'https://spotify.com',
  },
} as const;

export const proposeTopics = ['Magic', 'Music', 'Food', 'Other'] as const;
export type ProposeTopic = (typeof proposeTopics)[number];

export const footerLegal = [
  { key: 'cookiePolicy', href: '/cookie-policy' },
  { key: 'privacy', href: '/privacy' },
] as const;
