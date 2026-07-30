/** Copy for the Magic Tools page, from the design doc. */

export const magic = {
  crumb: { site: 'Walter', page: 'Magic Tools' },
  nav: [
    { label: 'Draw odds', href: '#odds' },
    { label: 'Plain-English search', href: '#search' },
  ],
  repoLabel: 'GitHub ↗',
  repoHref: 'https://github.com',

  hero: {
    title: 'Magic Tools',
    blurb:
      'Two things I kept doing by hand: working out whether my mana base actually delivers, and translating what I mean into Scryfall syntax. Both are here, both are open source.',
    jump: [
      {
        index: '01',
        href: '#odds',
        title: 'Draw odds',
        note: 'Hypergeometric, with the curve drawn out',
      },
      {
        index: '02',
        href: '#search',
        title: 'Plain-English search',
        note: 'Type a sentence, get Scryfall syntax',
      },
    ],
  },

  odds: {
    index: '01',
    heading: 'Draw odds',
    blurb:
      'Hypergeometric: every draw shrinks the library, so the odds move with it. Set your deck up and read the whole distribution, not just one number.',
    deckLabel: 'Cards in deck',
    deckPresets: [60, 40, 99, 100],
    copiesLabel: 'Copies you want to hit',
    copiesHint: 'e.g. 24 lands, or 4 copies of one card',
    drawsLabel: 'Cards drawn',
    drawPresets: [
      { label: 'Opening 7', value: 7 },
      { label: 'Turn 2 · 8', value: 8 },
      { label: 'Turn 3 · 9', value: 9 },
      { label: 'Turn 5 · 11', value: 11 },
    ],
    atLeastLabel: 'Successes needed (at least)',
    distributionLabel: 'Distribution — chance of drawing exactly n',
    legendHit: 'counts as a hit',
    legendShort: 'short',
    cumulativeLabel: 'Cumulative — at least n',
  },

  search: {
    index: '02',
    heading: 'Plain-English search',
    blurb:
      'Say what you’re after in a sentence. It builds the Scryfall query and hands the search straight to Scryfall.',
    prompt: 'What are you looking for?',
    placeholder: 'blue instants under 3 mana that draw a card, legal in modern',
    tryLabel: 'try:',
    queryLabel: 'Scryfall query',
    submitLabel: 'Translate',
    submitBusyLabel: 'Translating…',
    searchLabel: 'Search on Scryfall ↗',
    copyLabel: 'Copy query',
    copiedLabel: 'Copied',
    emptyQuery: '—',
    idleNote: 'Type a sentence and press Translate.',
    legendTitle: 'What it understands',
    legendNote: 'Click any example to drop it in the box.',
  },

  /** The service reads Italian, German, French and Spanish too. */
  examples: [
    'blue instants under 3 mana that draw a card, legal in modern',
    'green creatures with trample power 4 or more',
    'rakdos legendary creature commander',
    'shocklands under $10',
    'creature rosse economiche con rapidità',
  ],

  legend: [
    {
      title: 'Colors & identity',
      syntax: 'c: · id:',
      items: ['blue white creatures', 'azorius instants', 'color identity rakdos', 'colorless artifacts'],
    },
    {
      title: 'Types & subtypes',
      syntax: 't:',
      items: ['legendary goblin', 'enchantment aura', 'planeswalker'],
    },
    {
      title: 'Mana value, power, toughness',
      syntax: 'mv: pow: tou:',
      items: ['creatures 2 mana or less', 'power at least 5', 'toughness under 2'],
    },
    {
      title: 'Rules text & keywords',
      syntax: 'o: · keyword:',
      items: ['creatures with flying and lifelink', 'says "sacrifice a creature"', 'cards that draw a card'],
    },
    {
      title: 'Format legality',
      syntax: 'f: · banned:',
      items: ['legal in pauper', 'banned in modern', 'commander'],
    },
    {
      title: 'Rarity & price',
      syntax: 'r: · usd<',
      items: ['mythic rare under $5', 'commons cheaper than 1 dollar'],
    },
    {
      title: 'Land cycles & shortcuts',
      syntax: 'is:',
      items: ['fetchlands', 'shocklands under $10', 'reserved list', 'double-faced cards'],
    },
    {
      title: 'Artist & sorting',
      syntax: 'a: · order:',
      items: ['lands by Rebecca Guay', 'dragons newest first'],
    },
    {
      title: 'Other languages',
      syntax: 'it · de · fr · es',
      items: ['creature rosse economiche', 'billige rote Kreaturen', 'créatures rouges pas chères'],
    },
  ],

  footer: {
    meta: 'MIT · open source · card data from Scryfall',
    credit: 'Made by Walter and Claudio with ',
    creditAccent: 'love',
    legal: [
      { label: 'Cookie policy', href: '/cookie-policy' },
      { label: 'Privacy', href: '/privacy' },
    ],
    copyright: '© 2026',
  },
} as const;
