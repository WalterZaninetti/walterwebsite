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
 */
export function formatPercent(p: number): string {
  const v = p * 100;
  if (v >= 99.95) return '100%';
  if (v >= 10) return `${v.toFixed(1)}%`;
  return `${v.toFixed(v < 1 ? 2 : 1)}%`;
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

/** Plain-language restatement of the headline figure. */
export function describeOdds(odds: Odds): string {
  const { deck, draws, copies, atLeast } = odds.input;
  const thing = copies >= 18 ? 'lands' : copies <= 4 ? 'copies' : 'of them';
  return `Drawing ${draws} cards from ${deck}, you hit at least ${atLeast} ${thing} ${formatPercent(
    odds.atLeastP,
  )} of the time.`;
}
