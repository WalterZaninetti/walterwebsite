/**
 * "2 hours ago" / "2 ore fa", from an ISO timestamp.
 *
 * The music cards are a build-time snapshot, so this deliberately formats at render rather than
 * baking a string into the JSON. A frozen "2 hours ago" would keep claiming that a month after
 * the deploy; computed here it degrades honestly to "last month" instead, and the card stops
 * over-promising freshness it does not have.
 *
 * Intl.RelativeTimeFormat handles the pluralisation and the wording in both languages, so there
 * is nothing to translate — which is why this lives in lib/ and not in the locale files.
 */

/** Largest unit first: the first threshold the elapsed time clears is the one used. */
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60],
  ['month', 30 * 24 * 60 * 60],
  ['week', 7 * 24 * 60 * 60],
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
];

export function formatRelativeTime(iso: string | null, locale: string, now = Date.now()) {
  if (!iso) return null;

  const then = Date.parse(iso);
  if (Number.isNaN(then)) return null;

  /* Negative: these timestamps are always in the past. A clock skew that puts one slightly in
     the future would otherwise read "in 3 seconds", so clamp it to the present. */
  const elapsed = Math.max(0, Math.round((now - then) / 1000));

  const format = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  for (const [unit, seconds] of UNITS) {
    if (elapsed >= seconds) return format.format(-Math.floor(elapsed / seconds), unit);
  }
  return format.format(-elapsed, 'second');
}
