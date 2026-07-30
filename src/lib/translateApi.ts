/**
 * Client for the natural-language-to-scryfall-filters service.
 *
 * That service does the real work: it calls a model, lints the result against
 * a registry of 37 operators, then probes Scryfall and treats a non-empty
 * `warnings` array as failure rather than a hint — because Scryfall answers
 * 200 with thousands of wrong cards for a query it silently ignored.
 *
 * The API key lives on the server, so the browser talks to it directly and
 * never holds a secret. In development that is localhost:8080, whose
 * ALLOWED_ORIGINS already lists the Vite dev origin; in production point
 * VITE_TRANSLATE_API_URL at the deployed instance.
 */

const BASE_URL = (import.meta.env.VITE_TRANSLATE_API_URL ?? 'http://localhost:8080').replace(
  /\/$/,
  '',
);

export type TranslateResult = {
  query: string;
  scryfallUrl: string;
  detectedLanguage: string;
  /** Readings the service had to choose — "cheap" → mv<=3, and so on. */
  assumptions: string[];
  /** Parts of the request Scryfall syntax cannot express. */
  unsupported: string[];
  notes: string[];
  /** Non-empty only when the repair attempt failed: treat the query as suspect. */
  warnings: string[];
};

export type TranslateErrorKind =
  | 'rate_limited'
  | 'offline'
  | 'bad_request'
  | 'unauthorized'
  | 'server';

/**
 * Carries a `kind` rather than a display string: the UI is bilingual, so the
 * wording is chosen at render time from the active locale.
 */
export class TranslateError extends Error {
  // Declared rather than a constructor parameter property: the tsconfig sets
  // erasableSyntaxOnly, which rules out the shorthand.
  readonly kind: TranslateErrorKind;

  constructor(kind: TranslateErrorKind) {
    super(kind);
    this.name = 'TranslateError';
    this.kind = kind;
  }
}

/** Exposed so the offline message can name the URL it failed to reach. */
export const TRANSLATE_BASE_URL = BASE_URL;

export async function translate(
  text: string,
  signal?: AbortSignal,
): Promise<TranslateResult> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/translate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text }),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new TranslateError('offline');
  }

  // The service authorises browsers by Origin, so a 401 here means this origin
  // isn't in its ALLOWED_ORIGINS — a deployment mismatch, not a user error.
  if (response.status === 401) {
    throw new TranslateError('unauthorized');
  }
  if (response.status === 429) {
    throw new TranslateError('rate_limited');
  }
  if (response.status === 400) {
    throw new TranslateError('bad_request');
  }
  if (!response.ok) {
    throw new TranslateError('server');
  }

  return (await response.json()) as TranslateResult;
}

/* ------------------------------------------------------------------------ */

/**
 * Labels for the chip row, keyed by Scryfall operator and mirroring the
 * service's own registry (including its aliases) so a chip never claims
 * something the backend didn't mean.
 */
const OPERATOR_LABELS: Record<string, string> = {
  c: 'color', color: 'color',
  id: 'color identity', identity: 'color identity',
  devotion: 'devotion',
  produces: 'produces',
  t: 'type', type: 'type',
  o: 'oracle text', oracle: 'oracle text',
  fo: 'full oracle', fulloracle: 'full oracle',
  name: 'name',
  kw: 'keyword', keyword: 'keyword',
  m: 'mana cost', mana: 'mana cost',
  mv: 'mana value', cmc: 'mana value', manavalue: 'mana value',
  pow: 'power', power: 'power',
  tou: 'toughness', toughness: 'toughness',
  loy: 'loyalty', loyalty: 'loyalty',
  is: 'shortcut', not: 'excludes', has: 'has', in: 'in',
  r: 'rarity', rarity: 'rarity',
  s: 'set', e: 'set', edition: 'set', set: 'set',
  block: 'block',
  st: 'set type', settype: 'set type',
  f: 'format', format: 'format',
  banned: 'banned', restricted: 'restricted',
  usd: 'price (USD)', eur: 'price (EUR)', tix: 'price (tix)',
  a: 'artist', artist: 'artist',
  ft: 'flavour text', flavor: 'flavour text',
  wm: 'watermark', watermark: 'watermark',
  year: 'year', date: 'date',
  lang: 'language', language: 'language',
  order: 'sort', direction: 'sort order', unique: 'unique',
};

export type QueryChip = { fragment: string; label: string };

/**
 * Split a returned query into display chips.
 *
 * Respects quoted values ("draw a card") and parenthesised groups
 * ((set:chk OR set:bok)), which both contain spaces and must stay whole.
 */
export function toChips(query: string): QueryChip[] {
  const fragments: string[] = [];
  let current = '';
  let depth = 0;
  let quoted = false;

  for (const char of query) {
    if (char === '"') quoted = !quoted;
    if (!quoted) {
      if (char === '(') depth += 1;
      if (char === ')') depth -= 1;
      if (char === ' ' && depth === 0) {
        if (current) fragments.push(current);
        current = '';
        continue;
      }
    }
    current += char;
  }
  if (current) fragments.push(current);

  return fragments
    .filter((fragment) => fragment && fragment.toUpperCase() !== 'OR' && fragment.toUpperCase() !== 'AND')
    .map((fragment) => {
      const bare = fragment.replace(/^[(-]+/, '');
      const key = bare.match(/^([a-z]+)(?::|=|!=|<=|>=|<|>)/i)?.[1]?.toLowerCase();
      const negated = fragment.startsWith('-');
      const label = key ? (OPERATOR_LABELS[key] ?? 'filter') : 'card name';
      return { fragment, label: negated ? `not ${label}` : label };
    });
}
