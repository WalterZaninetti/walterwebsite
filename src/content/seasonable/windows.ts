/**
 * When each designation is picked, and where.
 *
 * Half-months, 0-23: 0 is 1-15 January, 23 is 16-31 December. A window may wrap
 * the year (start 16, end 6 is September to mid-April), which is the ordinary
 * case for citrus.
 *
 * Every row below is one sentence from one document, converted. The Italian is
 * quoted in the trailing comment so the conversion can be checked without
 * opening the source. Where a document states a decade rather than a date, the
 * decade is snapped to the half-month containing its midpoint: first decade to
 * the early half, second and third to the late half. That rule is written down
 * once, in `.claude/skills/seasonable-sourcing/SKILL.md`, and applied here.
 *
 * `stored` rows come from a document's own commercialisation window where it
 * states one separately from harvest — Aglio Bianco Polesano is picked in
 * summer and may be sold until the following June, which is a fact about
 * storage that the disciplinare states outright rather than one we inferred.
 */

import type { Window } from '../../lib/seasonable';

const w = (
  produce: string,
  provinces: readonly string[],
  kind: Window['kind'],
  start: number,
  end: number,
  source: string,
): Window => ({ produce, provinces, kind, start, end, source });

export const windows: readonly Window[] = [
  // ── Fruit ────────────────────────────────────────────────────────────────
  // "dal 20 maggio al 20 luglio"
  w('albicocca-vesuviana', ['na'], 'open-field', 9, 13, 'albicocca-vesuviana'),
  // "ha inizio ai primi di settembre per concludersi in novembre"
  w('castagna-cuneo', ['cn'], 'open-field', 16, 21, 'castagna-cuneo'),
  // "deve avvenire tra settembre e novembre di ogni anno"
  w('castagna-monte-amiata', ['gr', 'si'], 'open-field', 16, 21, 'castagna-monte-amiata'),
  // "tra il 20 settembre e il 10 novembre di ogni anno"
  w('castagna-vallerano', ['vt'], 'open-field', 17, 20, 'castagna-vallerano'),
  // "ha inizio nella prima decade di maggio ... e termina entro la terza decade di luglio"
  w('ciliegia-bracigliano', ['sa', 'av'], 'open-field', 8, 13, 'ciliegia-bracigliano'),
  // "compreso tra il mese di maggio e quello di luglio"
  w('ciliegia-lari', ['pi'], 'open-field', 8, 13, 'ciliegia-lari'),
  // "Le varieta' precoci vengono raccolte dal 1° maggio al 30 giugno"
  w('ciliegia-vignola', ['mo', 'bo'], 'open-field', 8, 11, 'ciliegia-vignola'),
  // "nel periodo compreso fra il 10 agosto ed il 10 ottobre"
  w('fichi-cosenza', ['cs'], 'open-field', 14, 18, 'fichi-cosenza'),
  // "compreso tra il mese di novembre e quello di giugno"
  w('fragola-basilicata', ['mt'], 'open-field', 20, 11, 'fragola-basilicata'),
  // "La raccolta avviene dal 1° settembre al 15 aprile"
  w('limone-interdonato', ['me'], 'open-field', 16, 6, 'limone-interdonato'),
  // "nel periodo che va del 1 febbraio al 31 ottobre"
  w('limone-sorrento', ['na'], 'open-field', 2, 19, 'limone-sorrento'),
  // "avviene manualmente dal 15 Settembre al 15 Novembre"
  w('marroni-monfenera', ['tv'], 'open-field', 16, 20, 'marroni-monfenera'),
  // "Gala da inizio agosto a fine maggio" — a commercialisation window, i.e. storage
  w('mela-rossa-cuneo', ['cn', 'to'], 'stored', 14, 9, 'mela-rossa-cuneo'),
  // "Red Delicious: seconda decade di settembre-seconda decade di ottobre;
  //  Golden Delicious: seconda decade di settembre-fine ottobre"
  w('mela-valtellina', ['so'], 'open-field', 17, 19, 'mela-valtellina'),
  // "il periodo di conservazione ... si conclude entro la fine del mese di
  //  agosto dell'anno successivo per le varieta' Red Delicious e Golden Delicious"
  w('mela-valtellina', ['so'], 'stored', 19, 15, 'mela-valtellina'),
  // "epoca di maturazione: va dal 25 maggio ... al 10 ottobre per le varieta' tardive"
  w('pesca-delia', ['cl', 'ag'], 'open-field', 9, 18, 'pesca-delia'),
  // "a partire dalla prima decade di agosto fino alla prima decade di novembre"
  w('pesca-leonforte', ['en'], 'open-field', 14, 20, 'pesca-leonforte'),
  // "viene effettuata esclusivamente a mano nei mesi di luglio, agosto e settembre"
  w('susina-dro', ['tn'], 'open-field', 12, 17, 'susina-dro'),

  // ── Vegetables ───────────────────────────────────────────────────────────
  // "deve essere commercializzato tra il 10 luglio e il 30 giugno dell'anno successivo"
  w('aglio-polesano', ['ro'], 'stored', 12, 11, 'aglio-polesano'),
  // "tra il primo febbraio e il 30 giugno di ogni anno"
  w('asparago-badoere', ['pd', 'tv', 've'], 'open-field', 2, 11, 'asparago-badoere'),
  // "Il periodo di raccolta deve essere compreso tra il 1 marzo ed il 15 giugno"
  w('asparago-bassano', ['vi'], 'open-field', 4, 10, 'asparago-bassano'),
  // "La raccolta avviene nel periodo gennaio/giugno e settembre/ottobre"
  w('asparago-canino', ['vt'], 'open-field', 0, 11, 'asparago-canino'),
  w('asparago-canino', ['vt'], 'open-field', 16, 19, 'asparago-canino'),
  // "La raccolta del prodotto inizia a marzo e si protrae fino a giugno"
  w('asparago-cantello', ['va'], 'open-field', 4, 11, 'asparago-cantello'),
  // "I primi turioni si raccolgono in marzo (il 20 circa)" / "non deve ... protrarsi oltre il 30 maggio"
  w('asparago-cimadolmo', ['tv'], 'open-field', 5, 9, 'asparago-cimadolmo'),
  // "nel periodo compreso dal 1° febbraio al 20 maggio"
  w('carciofo-paestum', ['sa'], 'open-field', 2, 9, 'carciofo-paestum'),
  // "L'epoca di raccolta inizia in gennaio e potra' protrarsi fino a maggio"
  w('carciofo-romanesco', ['vt', 'rm', 'lt'], 'open-field', 0, 9, 'carciofo-romanesco'),
  // "a partire dal 1° febbraio e fino al 15 di giugno"
  w('carota-ispica', ['rg', 'sr', 'ct', 'cl'], 'open-field', 2, 10, 'carota-ispica'),
  // "nel periodo compreso tra la seconda meta' di settembre - prima meta' di maggio"
  w('cicoria-molfettese', ['ba', 'bt'], 'open-field', 17, 8, 'cicoria-molfettese'),
  // "tipologia precoce: epoca di raccolta: dalla seconda decade di ottobre a meta' febbraio"
  w('finocchio-capo-rizzuto', ['kr', 'cz'], 'open-field', 19, 2, 'finocchio-capo-rizzuto'),
  // "tipologia tardiva: epoca di raccolta: da fine marzo a meta' giugno"
  w('finocchio-capo-rizzuto', ['kr', 'cz'], 'open-field', 5, 10, 'finocchio-capo-rizzuto'),
  // "inizia dal 1 luglio di ogni anno e termina entro il 30 di novembre"
  w('melanzana-rotonda', ['pz'], 'open-field', 12, 21, 'melanzana-rotonda'),
  // "avra' inizio dal 20 luglio ... e si protrarra' fino al 15 novembre"
  w('patata-fucino', ['aq'], 'open-field', 13, 20, 'patata-fucino'),
  // "a partire dalla prima decade di marzo e non si potra' prolungare oltre il 30 giugno"
  w('patata-galatina', ['le'], 'open-field', 4, 11, 'patata-galatina'),
  // "dal 20 di agosto fino al 30 di novembre"
  w('patata-sila', ['cs', 'cz'], 'open-field', 15, 21, 'patata-sila'),
  // "nel periodo compreso tra il 20 giugno ed il 31 agosto"
  w('piennolo-vesuvio', ['na'], 'open-field', 11, 15, 'piennolo-vesuvio'),
  // "La raccolta dei frutti e' compresa tra il 15 luglio ed il 15 ottobre"
  w('san-marzano', ['sa', 'na', 'av'], 'open-field', 12, 18, 'san-marzano'),
];
