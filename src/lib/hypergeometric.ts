/**
 * Draw-odds maths, ported from the design doc's own script.
 *
 * Drawing without replacement: each card drawn shrinks the library, so the
 * odds move with it — that is the hypergeometric distribution rather than a
 * naive (copies/deck)^draws.
 *
 * Everything goes through log-factorials. The binomial coefficients here reach
 * numbers like C(100, 50) ≈ 1e29, which overflow a double long before the
 * final probability does; summing logs and exponentiating once at the end
 * keeps the intermediate values in range.
 */

const MAX_N = 2000;

/** lnFactorial[i] = ln(i!) */
const lnFactorial: number[] = (() => {
  const table = [0];
  for (let i = 1; i <= MAX_N; i += 1) table[i] = table[i - 1] + Math.log(i);
  return table;
})();

/** ln of the binomial coefficient C(n, k); -Infinity where it is zero. */
function lnChoose(n: number, k: number): number {
  if (k < 0 || k > n || n < 0) return -Infinity;
  return lnFactorial[n] - lnFactorial[k] - lnFactorial[n - k];
}

export type DeckInput = {
  /** Cards in the library. */
  deck: number;
  /** Copies of the thing you want to hit (24 lands, 4 of a card, …). */
  copies: number;
  /** Cards seen. */
  draws: number;
  /** Successes you need, at least. */
  atLeast: number;
};

/** Keeps the four inputs mutually consistent — they constrain each other. */
export function clampInput(input: DeckInput): DeckInput {
  const deck = Math.max(1, Math.min(MAX_N, Math.round(input.deck) || 1));
  const copies = Math.max(1, Math.min(deck, Math.round(input.copies)));
  const draws = Math.max(1, Math.min(deck, Math.round(input.draws)));
  const atLeast = Math.max(0, Math.min(Math.min(copies, draws), Math.round(input.atLeast)));
  return { deck, copies, draws, atLeast };
}

/**
 * Probability of drawing exactly i successes, for every i that is possible.
 * Index i of the returned array is P(X = i).
 */
export function pmf({ deck, copies, draws }: DeckInput): number[] {
  const out: number[] = [];
  const top = Math.min(copies, draws);
  const denominator = lnChoose(deck, draws);
  for (let i = 0; i <= top; i += 1) {
    const ln = lnChoose(copies, i) + lnChoose(deck - copies, draws - i) - denominator;
    out.push(ln === -Infinity ? 0 : Math.exp(ln));
  }
  return out;
}

/**
 * Percentage with the precision the number deserves: near-certainties don't
 * want to read "100.0%" when they aren't, and sub-1% values need a decimal to
 * say anything at all.
 *
 * Formatted through Intl so the decimal separator follows the locale — Italian
 * writes 58,8% where English writes 58.8%.
 */
export function formatPercent(p: number, locale = 'en'): string {
  const v = p * 100;
  const digits = v >= 99.95 ? 0 : v >= 10 ? 1 : v < 1 ? 2 : 1;
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(v >= 99.95 ? 1 : p);
}

/** Plain decimal, locale-aware — used for the expected-hits figure. */
export function formatNumber(value: number, locale = 'en', digits = 2): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export type Odds = {
  input: DeckInput;
  distribution: number[];
  /** P(X ≥ atLeast) — the headline number. */
  atLeastP: number;
  /** P(X = atLeast) */
  exactlyP: number;
  /** P(X < atLeast) */
  fewerP: number;
  /** Mean of the distribution, draws × copies / deck. */
  expected: number;
};

export function computeOdds(raw: DeckInput): Odds {
  const input = clampInput(raw);
  const distribution = pmf(input);

  let atLeastP = 0;
  for (let i = input.atLeast; i < distribution.length; i += 1) atLeastP += distribution[i];

  return {
    input,
    distribution,
    atLeastP,
    exactlyP: distribution[input.atLeast] ?? 0,
    fewerP: 1 - atLeastP,
    expected: (input.draws * input.copies) / input.deck,
  };
}

/* ========================================================================== *
 * Mana sources — "how many sources do I need to cast this on curve?"
 * ========================================================================== */

/** P(exactly k successes) for a single point, without building the whole pmf. */
function pExactly(deck: number, successes: number, draws: number, k: number): number {
  const ln = lnChoose(successes, k) + lnChoose(deck - successes, draws - k) - lnChoose(deck, draws);
  return ln === -Infinity ? 0 : Math.exp(ln);
}

/** P(at least `need` successes) drawing `draws` from `deck`. */
function pAtLeastFrom(deck: number, successes: number, draws: number, need: number): number {
  if (need <= 0) return 1;
  if (draws <= 0 || successes < need) return 0;
  let total = 0;
  for (let k = need; k <= Math.min(successes, draws); k += 1) {
    total += pExactly(deck, successes, draws, k);
  }
  return total;
}

export const OPENING_HAND = 7;

/**
 * Mulligans are capped at one. Shipping a second hand purely because it lacks a
 * colour isn't a decision players make, and letting the model do it produces
 * numbers that look authoritative and are not.
 */
export const MAX_MULLIGANS = 1;

export type ManaInput = {
  /** Library size: 60 for constructed, 40 limited, 99 Commander. */
  deck: number;
  /** Lands and other sources producing the colour. */
  sources: number;
  /** Coloured pips of that colour in the cost — CC is 2. Generic doesn't count. */
  pips: number;
  /** Turn you want to cast it on. */
  turn: number;
  onPlay: boolean;
  /** How many mulligans you're willing to take. */
  mulligans: number;
};

/**
 * Probability of having `pips` sources available by `turn`, under the London
 * mulligan.
 *
 * The model, stated plainly because the number is only as good as its
 * assumptions:
 *
 * - **London mulligan.** Every mulligan is a fresh seven off the top of a fully
 *   reshuffled deck, so attempts are independent. At depth `m` you keep 7 − m
 *   and bottom the rest.
 * - **Source-maximising keep.** You bottom non-sources first, so a hand holds
 *   min(sources drawn, 7 − m) of them.
 * - **Mulligan policy: you ship a hand holding *none* of the colour, nothing
 *   else.** This is the one modelling choice that matters, and an earlier
 *   version got it badly wrong by shipping any hand short of `pips` sources.
 *   That produced answers like "six sources casts a one-pip spell on turn one
 *   90% of the time" — true only if you will mulligan to five for a single
 *   coloured pip and count the four lost cards as free. Nobody plays that way.
 *   Shipping only a blank is a policy people actually follow, and it is why
 *   `mulligans` is capped at one: going to five for colour alone isn't a real
 *   decision either.
 * - **Bottomed cards are gone.** They go under the library, so draws come from
 *   the 53 you haven't seen rather than the full deck.
 *
 * Still optimistic in one direction: it counts only colour, so it keeps a
 * seven-lander happily and never asks whether the hand can actually function.
 * Read it as "will my colours show up", not "is this hand keepable".
 */
export function pCastOnCurve(input: ManaInput): number {
  const { deck, sources, pips, turn, onPlay, mulligans } = input;
  if (pips <= 0) return 1;
  if (sources <= 0) return 0;

  const drawsAfterKeep = Math.max(0, turn - 1) + (onPlay ? 0 : 1);
  const attempts = Math.min(Math.max(0, mulligans), MAX_MULLIGANS);
  let reach = 1; // probability of still being here, i.e. every prior hand shipped
  let success = 0;

  for (let m = 0; m <= attempts; m += 1) {
    const handSize = Math.max(0, OPENING_HAND - m);
    const isLast = m === attempts;
    let shipped = 0;

    for (let s = 0; s <= Math.min(OPENING_HAND, sources); s += 1) {
      const ps = pExactly(deck, sources, OPENING_HAND, s);
      if (ps === 0) continue;

      const kept = Math.min(s, handSize);

      // Ship only a hand with none of the colour, and only if a mulligan is left.
      if (kept === 0 && !isLast) {
        shipped += ps;
        continue;
      }

      success +=
        reach *
        ps *
        (kept >= pips
          ? 1
          : pAtLeastFrom(deck - OPENING_HAND, sources - s, drawsAfterKeep, pips - kept));
    }

    reach *= shipped;
    if (reach <= 0) break;
  }

  return success;
}

/**
 * Fewest sources that reach `target` probability. Monotonic in sources, so a
 * plain scan is both correct and fast enough at these deck sizes.
 */
export function sourcesNeeded(
  input: Omit<ManaInput, 'sources'>,
  target = 0.9,
): { sources: number; achieved: number } | null {
  for (let sources = input.pips; sources <= input.deck; sources += 1) {
    const achieved = pCastOnCurve({ ...input, sources });
    if (achieved >= target) return { sources, achieved };
  }
  return null;
}

/**
 * Which noun the plain-language restatement should use. Returned as a key so
 * the sentence can be assembled by the caller in the active language rather
 * than baked in English here.
 */
export function thingKey(copies: number): 'thingLands' | 'thingCopies' | 'thingOfThem' {
  if (copies >= 18) return 'thingLands';
  if (copies <= 4) return 'thingCopies';
  return 'thingOfThem';
}
