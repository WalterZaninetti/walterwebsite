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
    { key: 'about', href: '#about' },
    { key: 'twitch', href: '#twitch' },
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
  nowPlaying: {
    track: 'Midnight Frequencies',
    artist: 'Kerri Chandler',
    release: 'Computer Games · 2022',
    elapsed: '2:14',
    duration: '5:48',
    progress: 38,
    /** [height %, opacity] per bar, straight from the doc's waveform. */
    waveform: [
      [40, 0.85],
      [76, 0.85],
      [28, 0.5],
      [92, 0.85],
      [54, 0.7],
      [34, 0.5],
      [68, 0.8],
      [46, 0.6],
      [82, 0.85],
      [30, 0.5],
      [60, 0.75],
      [38, 0.55],
    ] as ReadonlyArray<readonly [number, number]>,
    recent: [
      { title: 'Nocturne', artist: 'DJ Koze', ago: '12m' },
      { title: 'Sunbeam Dub', artist: 'Move D', ago: '31m' },
      { title: 'Tempelhof', artist: 'Barnt', ago: '1h' },
    ],
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
