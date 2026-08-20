/**
 * The catalogue: 45 items, fruit and vegetables only.
 *
 * Forty-five is what `seasonable.s2.body` tells the reader, so the two move
 * together — change this list and change that sentence. It is deliberately
 * most-of-a-normal-week rather than everything that grows: the run chose a
 * catalogue every window of which can cite a source over a longer one where
 * some rows would have to say "widely reported". Medlar, cardoon and
 * puntarelle wait for a pass that can source them.
 *
 * Names live here rather than in the locale files because a bilingual lookup
 * table of 45 nouns is data, not prose — the same reason src/content/site.ts
 * holds record and track names.
 *
 * `alwaysOnShelf` is the one editorial judgement per item and the only gate on
 * the flown bucket. It means "an Italian shop stocks this in every month of the
 * year", not "it is imported": apples and onions carry it too, and never appear
 * as flown because their storage windows cover the year.
 */

import type { Produce } from '../../lib/seasonable';

const fruit = (id: string, en: string, it: string, alwaysOnShelf = false): Produce => ({
  id,
  en,
  it,
  category: 'fruit',
  alwaysOnShelf,
});

const veg = (id: string, en: string, it: string, alwaysOnShelf = false): Produce => ({
  id,
  en,
  it,
  category: 'vegetable',
  alwaysOnShelf,
});

export const produce: readonly Produce[] = [
  fruit('apple', 'apple', 'mela', true),
  fruit('pear', 'pear', 'pera', true),
  fruit('orange', 'orange', 'arancia', true),
  fruit('lemon', 'lemon', 'limone', true),
  fruit('mandarin', 'mandarin', 'mandarino'),
  fruit('peach', 'peach', 'pesca'),
  fruit('apricot', 'apricot', 'albicocca'),
  fruit('cherry', 'cherry', 'ciliegia'),
  fruit('plum', 'plum', 'susina'),
  fruit('strawberry', 'strawberry', 'fragola', true),
  fruit('grape', 'grape', 'uva'),
  fruit('melon', 'melon', 'melone'),
  fruit('watermelon', 'watermelon', 'anguria'),
  fruit('fig', 'fig', 'fico'),
  fruit('persimmon', 'persimmon', 'cachi'),
  fruit('chestnut', 'chestnut', 'castagna'),
  fruit('pomegranate', 'pomegranate', 'melograno'),
  fruit('kiwi', 'kiwi', 'kiwi', true),

  veg('artichoke', 'artichoke', 'carciofo'),
  veg('asparagus', 'asparagus', 'asparago'),
  veg('aubergine', 'aubergine', 'melanzana', true),
  veg('courgette', 'courgette', 'zucchina', true),
  veg('tomato', 'tomato', 'pomodoro', true),
  veg('pepper', 'pepper', 'peperone', true),
  veg('cucumber', 'cucumber', 'cetriolo', true),
  veg('green-bean', 'green bean', 'fagiolino', true),
  veg('broad-bean', 'broad bean', 'fava'),
  veg('pea', 'pea', 'pisello'),
  veg('broccoli', 'broccoli', 'broccolo'),
  veg('cauliflower', 'cauliflower', 'cavolfiore'),
  veg('cabbage', 'cabbage', 'cavolo cappuccio'),
  veg('black-kale', 'black kale', 'cavolo nero'),
  veg('fennel', 'fennel', 'finocchio'),
  veg('radicchio', 'radicchio', 'radicchio'),
  veg('chicory', 'chicory', 'cicoria'),
  veg('spinach', 'spinach', 'spinaci'),
  veg('lettuce', 'lettuce', 'lattuga', true),
  veg('rocket', 'rocket', 'rucola', true),
  veg('leek', 'leek', 'porro'),
  veg('onion', 'onion', 'cipolla', true),
  veg('garlic', 'garlic', 'aglio', true),
  veg('potato', 'potato', 'patata', true),
  veg('carrot', 'carrot', 'carota', true),
  veg('celery', 'celery', 'sedano', true),
  veg('pumpkin', 'pumpkin', 'zucca'),
];
