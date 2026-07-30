/**
 * Every string on the homepage, lifted verbatim from the design doc.
 *
 * A few entries carry a `short` variant: the mobile column in the doc (option
 * 2c) deliberately rewrites some copy tighter rather than just reflowing it,
 * so both versions live here and the components pick per breakpoint.
 */

export const site = {
  name: 'Walter',
  email: 'say@walter.dev',
  nav: [
    { label: 'Projects', href: '#projects' },
    { label: 'About', href: '#about' },
    { label: 'Twitch', href: '#twitch' },
  ],
} as const;

export const hero = {
  eyebrow: 'Walter · Italy',
  eyebrowSuffix: ' · est. 1996',
  headline: 'Small tools,',
  headlineAccent: 'made carefully.',
  portraitCaption: 'portrait or desk photo — drop one in',
  portraitCaptionShort: 'portrait photo',
  bio: [
    "I'm a software developer. I open-source almost everything I make — not out of ideology, it's just better when people can read the thing and fix it.",
    "Away from the editor I play Magic: the Gathering, and I'm slowly talking myself into streaming it.",
  ],
  bioShort:
    'Software developer, open source by habit. Magic player, occasional streamer. Three tools so far — for Magic players, DJs, and people who want to eat in season.',
  lead:
    "Three of them so far — one for Magic players, one for DJs, and one for anyone who'd rather eat what's actually in season. Each one gets its own look, because each one is for different people.",
  primaryCta: 'See the projects ↓',
  secondaryCta: "or read what I'm doing now",
  stats: ['03 projects', 'all open source'],
  statAccent: 'streaming soon',
  socialsLabel: 'Find me',
  /** `id` keys the glyph used by the footer bar — see components/ui/icons.tsx. */
  socials: [
    { id: 'github', label: 'GitHub', href: 'https://github.com' },
    { id: 'twitch', label: 'Twitch', href: 'https://twitch.tv' },
    { id: 'instagram', label: 'Instagram', href: 'https://instagram.com' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com' },
  ],
} as const;

/** Each card keeps its project's own type and colour world. */
export type ProjectId = 'magic' | 'dj' | 'food';

export type Project = {
  id: ProjectId;
  href: string;
  eyebrow: string;
  eyebrowShort: string;
  title: string;
  /** Which family the title is set in — the whole point of the poster shelf. */
  titleFace: 'editorial' | 'sans' | 'display';
  description: string;
  descriptionShort: string;
  meta: string;
  thumbCaption: string;
  thumbCaptionShort: string;
};

export const projectsSection = {
  heading: 'Things I made',
  note: "Each card keeps its project's own look",
} as const;

export const projects: readonly Project[] = [
  {
    id: 'magic',
    href: '/magic-tools',
    eyebrow: '01 · for magic players',
    eyebrowShort: '01 · magic',
    title: 'Magic Tools',
    titleFace: 'editorial',
    description:
      'A geometric calculator for building mana bases that actually hold up, and a converter that turns plain English into Scryfall filters.',
    descriptionShort: 'Mana-base geometry and plain English → Scryfall filters.',
    meta: 'MIT · web',
    thumbCaption: 'mana pentagon diagram',
    thumbCaptionShort: 'mana pentagon',
  },
  {
    id: 'dj',
    href: '#dj-tool',
    eyebrow: '02 · for djs',
    eyebrowShort: '02 · djs',
    title: 'DJ Tool',
    titleFace: 'sans',
    description:
      'A dashboard sitting on top of your Rekordbox collection — BPM spread, genres, keys, and harmonic mixing on the Camelot wheel.',
    descriptionShort: 'Rekordbox dashboard: BPM, genre, key, Camelot wheel.',
    meta: 'WIP · v0.3',
    thumbCaption: 'camelot wheel',
    thumbCaptionShort: 'camelot wheel',
  },
  {
    id: 'food',
    href: '#seasonable',
    eyebrow: '03 · for everyone',
    eyebrowShort: '03 · everyone',
    title: 'Seasonable',
    titleFace: 'display',
    description:
      'Tell it a season and a place, and it tells you which fruit and vegetables are genuinely in season there.',
    descriptionShort: "Season + place → what's in season there.",
    meta: 'MIT · live',
    thumbCaption: 'produce still life',
    thumbCaptionShort: 'produce photo',
  },
];

export const music = {
  heading: 'Music,',
  headingAccent: 'taken seriously',
  intro:
    'Music is the thing I know most about that isn’t code. I dig, I read liner notes, I care about which pressing it is — and I DJ, which is mostly an excuse to keep digging. Every month I pick one record and write down why it got under my skin.',
  introShort:
    'Music is the thing I know most about that isn’t code. I dig, I read liner notes, I DJ. Every month I pick one record and write down why it got under my skin.',
  album: {
    label: 'Album of the month',
    issue: 'July 2026 · pick no. 19',
    issueShort: 'Jul 2026 · no. 19',
    sleeveCaption: 'album sleeve',
    title: 'Voices From The Lake',
    credit: 'Donato Dozzy & Neel · Prologue, 2012',
    note:
      'Ninety minutes that never raise their voice. It taught me that tension can come entirely from patience — I keep stealing that idea, badly, in my own mixes.',
    noteShort:
      'Ninety minutes that never raise their voice. It taught me that tension can come entirely from patience.',
    tags: ['ambient techno', 'headphones', '124 bpm'],
    readLink: 'Read the full note →',
    readLinkShort: 'Read the note →',
    archiveLink: 'All 19 picks ↗',
  },
  previous: {
    label: 'Previous picks',
    months: ['Jun', 'May', 'Apr', 'Mar'],
    /** Desktop shows four months + 15 more; mobile drops one and says +16. */
    remaining: '+15',
    remainingShort: '+16',
  },
  links: {
    primary: 'Bandcamp collection ↗',
    secondary: 'Spotify ↗',
  },
  nowPlaying: {
    label: 'Listening now',
    source: 'via Spotify',
    sourceShort: 'Spotify',
    artCaption: 'art',
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
    recentLabel: 'Recently played',
    recent: [
      { title: 'Nocturne', artist: 'DJ Koze', ago: '12m' },
      { title: 'Sunbeam Dub', artist: 'Move D', ago: '31m' },
      { title: 'Tempelhof', artist: 'Barnt', ago: '1h' },
    ],
    historyLink: 'Open full listening history ↗',
  },
} as const;

export const coffee = {
  label: 'If something here helped',
  heading: 'Buy me a coffee',
  body:
    'Everything I make is free and open. If a tool saved you an afternoon, a coffee is a lovely way to say so — and it genuinely funds the next one.',
  bodyShort:
    'Everything I make is free and open. If a tool saved you an afternoon, a coffee funds the next one.',
  primary: 'Buy me a coffee — €3',
  tiers: [
    { label: '€10 · a round', labelShort: '€10' },
    { label: 'Sponsor monthly', labelShort: 'Sponsor' },
  ],
  fineprint: 'No account needed · GitHub Sponsors also works',
} as const;

export const propose = {
  label: 'Got an idea?',
  note: 'I read everything · reply within a week',
  heading: 'Propose a tool',
  body:
    "The best three things on this page started as someone else's annoyance. Tell me what you keep doing by hand.",
  bodyShort: 'Tell me what you keep doing by hand. I read everything.',
  fields: {
    name: { label: 'Your name', placeholder: 'Giulia' },
    email: { label: 'Email', placeholder: 'you@somewhere.it' },
    topic: { label: "What's it about" },
    idea: { label: 'The idea', placeholder: 'I keep opening three tabs to figure out…' },
  },
  topics: [
    { label: 'Magic', labelShort: 'Magic' },
    { label: 'Music / DJ', labelShort: 'Music / DJ' },
    { label: 'Food', labelShort: 'Food' },
    { label: 'Something else', labelShort: 'Else' },
  ],
  submit: 'Send the idea',
  aside: 'Or just email say@walter.dev',
} as const;

export const footerBar = {
  credit: 'Made by Walter and Claudio with ',
  creditAccent: 'love',
  /* Both land on the same notice — see content/legal.ts for why. */
  legal: [
    { label: 'Cookie policy', href: '/cookie-policy' },
    { label: 'Privacy', href: '/privacy' },
  ],
  copyright: '© 2026',
} as const;

export const now = {
  label: 'Now',
  body:
    'Rewriting the mana-base geometry engine, and setting up a stream schedule I can actually keep. If you want to build something together, my inbox is open.',
  bodyShort:
    'Rewriting the mana-base geometry engine, and building a stream schedule I can keep.',
} as const;
