/**
 * When each thing is picked, kept, or under glass — by climate zone, with
 * region rows overriding the zone where a region genuinely differs.
 *
 * Half-months, 0-23: 0 is 1-15 January, 23 is 16-31 December. A window may
 * wrap the year (start 22, end 7 is mid-December to mid-April), which is the
 * ordinary case for citrus and for anything in long storage.
 *
 * A region row REPLACES the zone row for the same (produce, kind) — it does not
 * add to it. That is the whole mechanism behind "a calendar for Italy is wrong
 * for Sicily and for Piedmont at the same time": each disagreement costs one
 * row, and the rest of the country keeps the zone default.
 *
 * The overrides at the bottom are not a sample of what could be overridden.
 * They are the cases where a region's own production is far enough from its
 * zone that the zone answer would be wrong for the thing that region is
 * actually known for — Sicilian blood oranges, Treviso radicchio, Metaponto
 * strawberries, Trentino apples in controlled-atmosphere storage.
 */

import type { Window } from '../../lib/seasonable';

/** A zone-level window: the climate band's default. */
const z = (
  produce: string,
  zone: string,
  kind: Window['kind'],
  start: number,
  end: number,
  source: string,
): Window => ({ produce, zone, kind, start, end, source });

/** A region-level window: overrides the zone row for this (produce, kind). */
const r = (
  produce: string,
  region: string,
  kind: Window['kind'],
  start: number,
  end: number,
  source: string,
): Window => ({ produce, region, kind, start, end, source });

const ALP = 'zona-alpina';
const PAD = 'zona-padana';
const TIR = 'zona-tirrenica';
const MER = 'zona-meridionale';
const INS = 'zona-insulare';

export const windows: readonly Window[] = [
  // ── Fruit ────────────────────────────────────────────────────────────────
  z('apple', 'alpine', 'open-field', 16, 21, ALP),
  z('apple', 'alpine', 'stored', 21, 11, ALP),
  z('apple', 'padana', 'open-field', 15, 21, PAD),
  z('apple', 'padana', 'stored', 21, 11, PAD),
  z('apple', 'tyrrhenian', 'open-field', 14, 20, TIR),
  z('apple', 'tyrrhenian', 'stored', 20, 9, TIR),
  z('apple', 'southern', 'open-field', 14, 19, MER),
  z('apple', 'southern', 'stored', 19, 7, MER),
  z('apple', 'island', 'open-field', 14, 19, INS),
  z('apple', 'island', 'stored', 19, 7, INS),

  z('pear', 'alpine', 'open-field', 14, 19, ALP),
  z('pear', 'alpine', 'stored', 19, 5, ALP),
  z('pear', 'padana', 'open-field', 12, 19, PAD),
  z('pear', 'padana', 'stored', 19, 5, PAD),
  z('pear', 'tyrrhenian', 'open-field', 11, 18, TIR),
  z('pear', 'tyrrhenian', 'stored', 18, 3, TIR),
  z('pear', 'southern', 'open-field', 10, 17, MER),
  z('pear', 'southern', 'stored', 17, 1, MER),
  z('pear', 'island', 'open-field', 10, 17, INS),
  z('pear', 'island', 'stored', 17, 1, INS),

  z('orange', 'tyrrhenian', 'open-field', 23, 7, TIR),
  z('orange', 'southern', 'open-field', 22, 8, MER),
  z('orange', 'island', 'open-field', 21, 9, INS),

  z('lemon', 'tyrrhenian', 'open-field', 21, 7, TIR),
  z('lemon', 'southern', 'open-field', 20, 9, MER),
  z('lemon', 'island', 'open-field', 18, 13, INS),

  z('mandarin', 'tyrrhenian', 'open-field', 22, 3, TIR),
  z('mandarin', 'southern', 'open-field', 21, 3, MER),
  z('mandarin', 'island', 'open-field', 20, 4, INS),

  z('peach', 'padana', 'open-field', 11, 17, PAD),
  z('peach', 'tyrrhenian', 'open-field', 10, 17, TIR),
  z('peach', 'southern', 'open-field', 9, 16, MER),
  z('peach', 'island', 'open-field', 8, 15, INS),

  z('apricot', 'padana', 'open-field', 10, 14, PAD),
  z('apricot', 'tyrrhenian', 'open-field', 9, 13, TIR),
  z('apricot', 'southern', 'open-field', 8, 13, MER),
  z('apricot', 'island', 'open-field', 7, 12, INS),

  z('cherry', 'alpine', 'open-field', 11, 14, ALP),
  z('cherry', 'padana', 'open-field', 10, 13, PAD),
  z('cherry', 'tyrrhenian', 'open-field', 9, 12, TIR),
  z('cherry', 'southern', 'open-field', 8, 12, MER),
  z('cherry', 'island', 'open-field', 7, 11, INS),

  z('plum', 'padana', 'open-field', 13, 18, PAD),
  z('plum', 'tyrrhenian', 'open-field', 12, 18, TIR),
  z('plum', 'southern', 'open-field', 11, 17, MER),
  z('plum', 'island', 'open-field', 10, 16, INS),

  z('strawberry', 'alpine', 'open-field', 10, 15, ALP),
  z('strawberry', 'padana', 'open-field', 8, 14, PAD),
  z('strawberry', 'padana', 'greenhouse', 6, 12, PAD),
  z('strawberry', 'tyrrhenian', 'open-field', 7, 13, TIR),
  z('strawberry', 'southern', 'open-field', 5, 12, MER),
  z('strawberry', 'southern', 'greenhouse', 2, 10, MER),
  z('strawberry', 'island', 'open-field', 4, 11, INS),
  z('strawberry', 'island', 'greenhouse', 0, 9, INS),

  z('grape', 'alpine', 'open-field', 17, 20, ALP),
  z('grape', 'padana', 'open-field', 16, 20, PAD),
  z('grape', 'tyrrhenian', 'open-field', 16, 20, TIR),
  z('grape', 'southern', 'open-field', 15, 19, MER),
  z('grape', 'island', 'open-field', 14, 19, INS),

  z('melon', 'padana', 'open-field', 12, 17, PAD),
  z('melon', 'tyrrhenian', 'open-field', 11, 17, TIR),
  z('melon', 'southern', 'open-field', 10, 17, MER),
  z('melon', 'island', 'open-field', 9, 16, INS),

  z('watermelon', 'padana', 'open-field', 12, 16, PAD),
  z('watermelon', 'tyrrhenian', 'open-field', 12, 16, TIR),
  z('watermelon', 'southern', 'open-field', 11, 16, MER),
  z('watermelon', 'island', 'open-field', 10, 16, INS),

  z('fig', 'padana', 'open-field', 15, 18, PAD),
  z('fig', 'tyrrhenian', 'open-field', 14, 18, TIR),
  z('fig', 'southern', 'open-field', 13, 18, MER),
  z('fig', 'island', 'open-field', 12, 17, INS),

  z('persimmon', 'padana', 'open-field', 19, 23, PAD),
  z('persimmon', 'tyrrhenian', 'open-field', 19, 23, TIR),
  z('persimmon', 'southern', 'open-field', 18, 22, MER),
  z('persimmon', 'island', 'open-field', 18, 22, INS),

  z('chestnut', 'alpine', 'open-field', 17, 21, ALP),
  z('chestnut', 'padana', 'open-field', 18, 21, PAD),
  z('chestnut', 'tyrrhenian', 'open-field', 18, 21, TIR),
  z('chestnut', 'southern', 'open-field', 17, 21, MER),

  z('pomegranate', 'padana', 'open-field', 18, 22, PAD),
  z('pomegranate', 'tyrrhenian', 'open-field', 18, 22, TIR),
  z('pomegranate', 'southern', 'open-field', 17, 22, MER),
  z('pomegranate', 'island', 'open-field', 17, 21, INS),

  z('kiwi', 'padana', 'open-field', 19, 23, PAD),
  z('kiwi', 'padana', 'stored', 23, 9, PAD),
  z('kiwi', 'tyrrhenian', 'open-field', 19, 23, TIR),
  z('kiwi', 'tyrrhenian', 'stored', 23, 9, TIR),
  z('kiwi', 'southern', 'open-field', 18, 22, MER),
  z('kiwi', 'southern', 'stored', 22, 8, MER),

  // ── Vegetables ───────────────────────────────────────────────────────────
  z('artichoke', 'padana', 'open-field', 4, 9, PAD),
  z('artichoke', 'tyrrhenian', 'open-field', 0, 9, TIR),
  z('artichoke', 'southern', 'open-field', 21, 9, MER),
  z('artichoke', 'island', 'open-field', 20, 9, INS),

  z('asparagus', 'alpine', 'open-field', 6, 10, ALP),
  z('asparagus', 'padana', 'open-field', 5, 9, PAD),
  z('asparagus', 'tyrrhenian', 'open-field', 4, 9, TIR),
  z('asparagus', 'southern', 'open-field', 3, 8, MER),
  z('asparagus', 'island', 'open-field', 2, 7, INS),

  z('aubergine', 'padana', 'open-field', 12, 18, PAD),
  z('aubergine', 'padana', 'greenhouse', 9, 17, PAD),
  z('aubergine', 'tyrrhenian', 'open-field', 11, 18, TIR),
  z('aubergine', 'southern', 'open-field', 10, 19, MER),
  z('aubergine', 'southern', 'greenhouse', 6, 20, MER),
  z('aubergine', 'island', 'open-field', 9, 19, INS),
  z('aubergine', 'island', 'greenhouse', 4, 21, INS),

  z('courgette', 'padana', 'open-field', 9, 18, PAD),
  z('courgette', 'padana', 'greenhouse', 2, 8, PAD),
  z('courgette', 'tyrrhenian', 'open-field', 8, 18, TIR),
  z('courgette', 'southern', 'open-field', 7, 19, MER),
  z('courgette', 'southern', 'greenhouse', 21, 8, MER),
  z('courgette', 'island', 'open-field', 6, 19, INS),
  z('courgette', 'island', 'greenhouse', 20, 9, INS),

  z('tomato', 'padana', 'open-field', 12, 18, PAD),
  z('tomato', 'padana', 'greenhouse', 8, 17, PAD),
  z('tomato', 'tyrrhenian', 'open-field', 11, 18, TIR),
  z('tomato', 'tyrrhenian', 'greenhouse', 6, 19, TIR),
  z('tomato', 'southern', 'open-field', 10, 19, MER),
  z('tomato', 'southern', 'greenhouse', 4, 20, MER),
  z('tomato', 'island', 'open-field', 9, 19, INS),
  z('tomato', 'island', 'greenhouse', 2, 21, INS),

  z('pepper', 'padana', 'open-field', 13, 18, PAD),
  z('pepper', 'padana', 'greenhouse', 10, 17, PAD),
  z('pepper', 'tyrrhenian', 'open-field', 12, 18, TIR),
  z('pepper', 'southern', 'open-field', 11, 19, MER),
  z('pepper', 'southern', 'greenhouse', 8, 20, MER),
  z('pepper', 'island', 'open-field', 10, 19, INS),
  z('pepper', 'island', 'greenhouse', 6, 21, INS),

  z('cucumber', 'padana', 'open-field', 11, 17, PAD),
  z('cucumber', 'padana', 'greenhouse', 4, 9, PAD),
  z('cucumber', 'tyrrhenian', 'open-field', 10, 17, TIR),
  z('cucumber', 'southern', 'open-field', 9, 18, MER),
  z('cucumber', 'southern', 'greenhouse', 0, 9, MER),
  z('cucumber', 'island', 'open-field', 8, 18, INS),
  z('cucumber', 'island', 'greenhouse', 20, 11, INS),

  z('green-bean', 'padana', 'open-field', 10, 18, PAD),
  z('green-bean', 'tyrrhenian', 'open-field', 9, 18, TIR),
  z('green-bean', 'southern', 'open-field', 8, 19, MER),
  z('green-bean', 'southern', 'greenhouse', 2, 8, MER),
  z('green-bean', 'island', 'open-field', 7, 19, INS),
  z('green-bean', 'island', 'greenhouse', 0, 7, INS),

  z('broad-bean', 'padana', 'open-field', 7, 12, PAD),
  z('broad-bean', 'tyrrhenian', 'open-field', 5, 11, TIR),
  z('broad-bean', 'southern', 'open-field', 3, 10, MER),
  z('broad-bean', 'island', 'open-field', 2, 9, INS),

  z('pea', 'padana', 'open-field', 7, 12, PAD),
  z('pea', 'tyrrhenian', 'open-field', 5, 11, TIR),
  z('pea', 'southern', 'open-field', 3, 10, MER),
  z('pea', 'island', 'open-field', 2, 9, INS),

  z('broccoli', 'padana', 'open-field', 18, 5, PAD),
  z('broccoli', 'tyrrhenian', 'open-field', 18, 6, TIR),
  z('broccoli', 'southern', 'open-field', 17, 7, MER),
  z('broccoli', 'island', 'open-field', 17, 8, INS),

  z('cauliflower', 'padana', 'open-field', 18, 5, PAD),
  z('cauliflower', 'tyrrhenian', 'open-field', 18, 6, TIR),
  z('cauliflower', 'southern', 'open-field', 17, 7, MER),
  z('cauliflower', 'island', 'open-field', 17, 8, INS),

  z('cabbage', 'alpine', 'open-field', 17, 3, ALP),
  z('cabbage', 'padana', 'open-field', 17, 4, PAD),
  z('cabbage', 'padana', 'stored', 20, 6, PAD),
  z('cabbage', 'tyrrhenian', 'open-field', 17, 6, TIR),
  z('cabbage', 'southern', 'open-field', 16, 7, MER),
  z('cabbage', 'island', 'open-field', 16, 7, INS),

  z('black-kale', 'padana', 'open-field', 20, 3, PAD),
  z('black-kale', 'tyrrhenian', 'open-field', 19, 4, TIR),
  z('black-kale', 'southern', 'open-field', 19, 5, MER),

  z('fennel', 'padana', 'open-field', 20, 5, PAD),
  z('fennel', 'tyrrhenian', 'open-field', 20, 7, TIR),
  z('fennel', 'southern', 'open-field', 19, 8, MER),
  z('fennel', 'island', 'open-field', 18, 9, INS),

  z('radicchio', 'padana', 'open-field', 18, 5, PAD),
  z('radicchio', 'tyrrhenian', 'open-field', 19, 4, TIR),
  z('radicchio', 'southern', 'open-field', 19, 3, MER),

  z('chicory', 'padana', 'open-field', 19, 6, PAD),
  z('chicory', 'tyrrhenian', 'open-field', 18, 8, TIR),
  z('chicory', 'southern', 'open-field', 18, 9, MER),
  z('chicory', 'island', 'open-field', 18, 9, INS),

  z('spinach', 'padana', 'open-field', 18, 8, PAD),
  z('spinach', 'tyrrhenian', 'open-field', 18, 9, TIR),
  z('spinach', 'southern', 'open-field', 17, 9, MER),
  z('spinach', 'island', 'open-field', 17, 9, INS),

  z('lettuce', 'alpine', 'open-field', 8, 17, ALP),
  z('lettuce', 'padana', 'open-field', 6, 19, PAD),
  z('lettuce', 'padana', 'greenhouse', 19, 7, PAD),
  z('lettuce', 'tyrrhenian', 'open-field', 4, 21, TIR),
  z('lettuce', 'southern', 'open-field', 2, 22, MER),
  z('lettuce', 'island', 'open-field', 0, 23, INS),

  z('rocket', 'padana', 'open-field', 6, 19, PAD),
  z('rocket', 'padana', 'greenhouse', 19, 7, PAD),
  z('rocket', 'tyrrhenian', 'open-field', 4, 21, TIR),
  z('rocket', 'southern', 'open-field', 2, 22, MER),
  z('rocket', 'island', 'open-field', 0, 23, INS),

  z('leek', 'padana', 'open-field', 17, 6, PAD),
  z('leek', 'tyrrhenian', 'open-field', 17, 7, TIR),
  z('leek', 'southern', 'open-field', 16, 8, MER),

  z('onion', 'padana', 'open-field', 10, 17, PAD),
  z('onion', 'padana', 'stored', 17, 9, PAD),
  z('onion', 'tyrrhenian', 'open-field', 9, 16, TIR),
  z('onion', 'tyrrhenian', 'stored', 16, 8, TIR),
  z('onion', 'southern', 'open-field', 7, 15, MER),
  z('onion', 'southern', 'stored', 15, 6, MER),
  z('onion', 'island', 'open-field', 6, 14, INS),
  z('onion', 'island', 'stored', 14, 5, INS),

  z('garlic', 'padana', 'open-field', 11, 14, PAD),
  z('garlic', 'padana', 'stored', 14, 10, PAD),
  z('garlic', 'tyrrhenian', 'open-field', 10, 13, TIR),
  z('garlic', 'tyrrhenian', 'stored', 13, 9, TIR),
  z('garlic', 'southern', 'open-field', 9, 12, MER),
  z('garlic', 'southern', 'stored', 12, 8, MER),
  z('garlic', 'island', 'open-field', 8, 11, INS),
  z('garlic', 'island', 'stored', 11, 7, INS),

  z('potato', 'alpine', 'open-field', 15, 19, ALP),
  z('potato', 'alpine', 'stored', 19, 11, ALP),
  z('potato', 'padana', 'open-field', 12, 19, PAD),
  z('potato', 'padana', 'stored', 19, 11, PAD),
  z('potato', 'tyrrhenian', 'open-field', 11, 18, TIR),
  z('potato', 'tyrrhenian', 'stored', 18, 10, TIR),
  z('potato', 'southern', 'open-field', 8, 17, MER),
  z('potato', 'southern', 'stored', 17, 7, MER),
  z('potato', 'island', 'open-field', 6, 15, INS),
  z('potato', 'island', 'stored', 15, 5, INS),

  z('carrot', 'padana', 'open-field', 10, 19, PAD),
  z('carrot', 'padana', 'stored', 19, 9, PAD),
  z('carrot', 'tyrrhenian', 'open-field', 9, 19, TIR),
  z('carrot', 'tyrrhenian', 'stored', 19, 8, TIR),
  z('carrot', 'southern', 'open-field', 18, 11, MER),
  z('carrot', 'island', 'open-field', 18, 11, INS),

  z('celery', 'padana', 'open-field', 16, 1, PAD),
  z('celery', 'tyrrhenian', 'open-field', 16, 3, TIR),
  z('celery', 'southern', 'open-field', 15, 5, MER),
  z('celery', 'island', 'open-field', 15, 5, INS),

  z('pumpkin', 'padana', 'open-field', 17, 21, PAD),
  z('pumpkin', 'padana', 'stored', 21, 4, PAD),
  z('pumpkin', 'tyrrhenian', 'open-field', 17, 21, TIR),
  z('pumpkin', 'tyrrhenian', 'stored', 21, 4, TIR),
  z('pumpkin', 'southern', 'open-field', 16, 20, MER),
  z('pumpkin', 'southern', 'stored', 20, 3, MER),

  // ── Region overrides ─────────────────────────────────────────────────────
  // Each of these is a case where the zone's answer would be wrong for the
  // thing that region is actually known for.
  r('orange', 'sicilia', 'open-field', 22, 7, 'reg-sicilia'),
  r('broccoli', 'sicilia', 'open-field', 16, 8, 'reg-sicilia'),
  r('artichoke', 'sardegna', 'open-field', 19, 7, 'reg-sardegna'),
  r('artichoke', 'lazio', 'open-field', 3, 9, 'reg-lazio'),
  r('lemon', 'campania', 'open-field', 4, 19, 'reg-campania'),
  r('strawberry', 'basilicata', 'open-field', 3, 9, 'reg-basilicata'),
  r('radicchio', 'veneto', 'open-field', 20, 5, 'reg-veneto'),
  r('asparagus', 'veneto', 'open-field', 5, 9, 'reg-veneto'),
  r('chestnut', 'piemonte', 'open-field', 17, 20, 'reg-piemonte'),
  r('apple', 'trentino-alto-adige', 'open-field', 16, 21, 'reg-trentino'),
  r('apple', 'trentino-alto-adige', 'stored', 21, 13, 'reg-trentino'),
  r('tomato', 'puglia', 'open-field', 9, 19, 'reg-puglia'),
  r('pomegranate', 'puglia', 'open-field', 17, 21, 'reg-puglia'),
  r('fennel', 'puglia', 'open-field', 18, 8, 'reg-puglia'),
  r('black-kale', 'toscana', 'open-field', 19, 5, 'reg-toscana'),
  r('pumpkin', 'lombardia', 'open-field', 17, 21, 'reg-lombardia'),
  r('pumpkin', 'lombardia', 'stored', 21, 5, 'reg-lombardia'),
];
