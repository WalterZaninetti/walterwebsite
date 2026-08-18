/**
 * Structure and data for the Magic Tools page. Copy lives in the locale files;
 * Scryfall operator syntax does not — `c: · id:` is code, not prose, and reads
 * the same in every language.
 */

export const magic = {
  repoHref: 'https://github.com/WalterZaninetti/walterwebsite',
  /** The translate service backing the plain-English search — its own repo,
   * separate from the calculators above. Linked from the footer credit line,
   * which is the page's one mention of where the card data (and the
   * Scryfall-probe argument behind the search) comes from. */
  translateRepoHref: 'https://github.com/WalterZaninetti/natural-language-to-scryfall-filters',
  nav: [
    { key: 'navOdds', href: '#odds' },
    { key: 'navMana', href: '#mana' },
    { key: 'navHands', href: '#hands' },
    { key: 'navFinding', href: '#finding' },
    { key: 'navSearch', href: '#search' },
  ],
  deckPresets: [60, 40, 99, 100],
  drawPresets: [
    { key: 'preset7', value: 7 },
    { key: 'preset8', value: 8 },
    { key: 'preset9', value: 9 },
    { key: 'preset11', value: 11 },
  ],
  /** Paired by index with search.legend[] in the locale files. */
  legendSyntax: [
    'c: · id:',
    't:',
    'mv: pow: tou:',
    'o: · keyword:',
    'f: · banned:',
    'r: · usd<',
    'is:',
    'a: · order:',
    'it · de · fr · es',
  ],
} as const;
