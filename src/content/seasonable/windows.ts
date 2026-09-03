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
 *
 * **Where a document gives a calendar per variety, the window is the union of
 * all of them**, and the comment quotes all of them. A designation is one
 * thing to the reader — you buy Ciliegia di Vignola, not the early varieties
 * of it — so a row that carries one variety's dates under the designation's
 * name is not a narrower truth, it is a false one.
 *
 * This rule is written here because leaving it unwritten cost four rows.
 * Vignola quoted only `varieta' precoci` and closed a month early; Mela di
 * Valtellina omitted Gala from both its harvest and its storage window; Mela
 * Rossa Cuneo carried Gala's commercialisation dates while Braeburn and Fuji
 * run two months longer. Every one of them under-reported, and none of them
 * looked wrong — the quoted sentence was accurate, it just was not the whole
 * sentence.
 */

import type { Window } from '../../lib/seasonable';

const w = (
  produce: string,
  provinces: readonly string[],
  kind: Window['kind'],
  start: number,
  end: number,
  source: string,
): Window => ({
  produce,
  provinces,
  kind,
  start,
  end,
  sources: [source],
  basis: 'documented',
});

/**
 * A window nobody wrote down: the union of the documented designations for the
 * same species, offered to provinces in a region where at least one of those
 * designations sits and where no document names the province itself.
 *
 * It answers *when* a species is picked, never *whether* it grows where you are
 * standing — a disciplinare names its comuni, and this does not.
 *
 * Only two species earn it. The rule is measured, not chosen: at least three
 * documented designations, leave-one-out coverage of 100% (the union of any two
 * cherry designations contains the third), and a union no more than one
 * half-month wider than the designations it generalises. Peach fails on both
 * counts — its three designations share one Sicilian climate and still spread
 * across five half-months — and so do potato, artichoke and asparagus.
 * `.pipeline/seasonable/model/README.md` has the numbers.
 */
const g = (
  produce: string,
  provinces: readonly string[],
  start: number,
  end: number,
  sources: readonly string[],
): Window => ({
  produce,
  provinces,
  kind: 'open-field',
  start,
  end,
  sources,
  basis: 'generalised',
});

export const windows: readonly Window[] = [
  // ── Fruit ────────────────────────────────────────────────────────────────
  // "ha inizio ai primi di settembre per concludersi in novembre"
  w('castagna-cuneo', ['cn'], 'open-field', 16, 21, 'castagna-cuneo'),
  // "deve avvenire tra settembre e novembre di ogni anno"
  w('castagna-monte-amiata', ['gr', 'si'], 'open-field', 16, 21, 'castagna-monte-amiata'),
  // "tra il 20 settembre e il 10 novembre di ogni anno"
  w('castagna-vallerano', ['vt'], 'open-field', 17, 20, 'castagna-vallerano'),
  // "a partire dal giorno 15 del mese di ottobre fino al 15 dicembre (raccolta
  //  principale)"
  w('cedro-santa-maria', ['cs'], 'open-field', 18, 22, 'cedro-santa-maria'),
  // "vi è una seconda raccolta che si verifica tra il 15 di febbraio fino al 30
  //  di aprile (tardiva)"
  w('cedro-santa-maria', ['cs'], 'open-field', 2, 7, 'cedro-santa-maria'),
  // "ha inizio nella prima decade di maggio ... e termina entro la terza decade di luglio"
  w('ciliegia-bracigliano', ['sa', 'av'], 'open-field', 8, 13, 'ciliegia-bracigliano'),
  // "compreso tra il mese di maggio e quello di luglio"
  w('ciliegia-lari', ['pi'], 'open-field', 8, 13, 'ciliegia-lari'),
  // "Le varieta' precoci vengono raccolte dal 1° maggio al 30 giugno; le
  //  varieta' medie dal 15 maggio al 15 luglio e le tardive dal 25 maggio al
  //  30 luglio"
  w('ciliegia-vignola', ['mo', 'bo'], 'open-field', 8, 13, 'ciliegia-vignola'),
  // "nel periodo compreso fra il 10 agosto ed il 10 ottobre"
  w('fichi-cosenza', ['cs'], 'open-field', 14, 18, 'fichi-cosenza'),
  // "si svolgono dalla seconda decade di agosto per i frutti di prima fioritura
  //  ("Agostani"), da settembre a dicembre per i frutti di seconda fioritura
  //  ("Scozzolati" o "Bastardoni")"
  w('ficodindia-etna', ['ct'], 'open-field', 15, 23, 'ficodindia-etna'),
  // "si svolgono dal 20 agosto al 30 settembre per i frutti di prima fioritura
  //  (agostani) e dal 10 settembre al 31 dicembre per i frutti di seconda
  //  fioritura (tardivi o scozzolati)"
  w('ficodindia-san-cono', ['ct', 'en', 'cl'], 'open-field', 15, 23, 'ficodindia-san-cono'),
  // "compreso tra il mese di novembre e quello di giugno"
  w('fragola-basilicata', ['mt'], 'open-field', 20, 11, 'fragola-basilicata'),
  // "La raccolta del frutto, senza il peduncolo, avviene tra la fine di ottobre
  //  e l'inizio di novembre"
  w('kiwi-latina', ['lt', 'rm'], 'open-field', 19, 20, 'kiwi-latina'),
  // "La raccolta va effettuata nel periodo che va dal 1 febbraio al 31 ottobre"
  w('limone-costa-amalfi', ['sa'], 'open-field', 2, 19, 'limone-costa-amalfi'),
  // "La raccolta avviene dal 1° settembre al 15 aprile"
  w('limone-interdonato', ['me'], 'open-field', 16, 6, 'limone-interdonato'),
  // "La raccolta si effettua dal 15 settembre al 15 novembre"
  w('marrone-combai', ['tv'], 'open-field', 16, 20, 'marrone-combai'),
  // "la raccolta dei frutti va effettuata a partire dal 25 settembre fino al 5
  //  novembre"
  w('marrone-serino', ['av', 'sa'], 'open-field', 17, 20, 'marrone-serino'),
  // "avviene manualmente dal 15 Settembre al 15 Novembre"
  w('marroni-monfenera', ['tv'], 'open-field', 16, 20, 'marroni-monfenera'),
  // "Gala da inizio agosto a fine maggio; Red Delicious da inizio settembre a
  //  fine giugno; Braeburn da fine settembre a fine luglio; Fuji da inizio
  //  ottobre a fine luglio" — a commercialisation window, i.e. storage
  w('mela-rossa-cuneo', ['cn', 'to'], 'stored', 14, 13, 'mela-rossa-cuneo'),
  // "deve effettuarsi nei mesi di agosto, settembre, ottobre e prima quindicina
  //  di novembre"
  w('mela-val-di-non', ['tn'], 'open-field', 14, 20, 'mela-val-di-non'),
  // "la raccolta va effettuata tra il 1° settembre ed il 20 ottobre di ciascun
  //  anno"
  w('oliva-ascolana', ['ap', 'fm', 'te'], 'open-field', 16, 19, 'oliva-ascolana'),
  // "La commercializzazione deve essere effettuata nel periodo intercorrente
  //  tra il 25 luglio ed il 31 maggio dell'anno successivo"
  w('pera-emilia-romagna', ['bo', 'fe', 'mo', 'ra', 're'], 'stored', 13, 9, 'pera-emilia-romagna'),
  // "epoca di maturazione: va dal 25 maggio ... al 10 ottobre per le varieta' tardive"
  w('pesca-delia', ['cl', 'ag'], 'open-field', 9, 18, 'pesca-delia'),
  // "a partire dalla prima decade di agosto fino alla prima decade di novembre"
  w('pesca-leonforte', ['en'], 'open-field', 14, 20, 'pesca-leonforte'),
  // "Murtiddara o Primizia Bianca dal 15 giugno al 15 luglio; Bianca dal 16
  //  luglio al 15 agosto; Agostina dal 16 agosto al 15 settembre; Settembrina
  //  dal 16 settembre al 20 ottobre"
  w('pescabivona', ['ag'], 'open-field', 10, 19, 'pescabivona'),
  // "viene effettuata esclusivamente a mano nei mesi di luglio, agosto e settembre"
  w('susina-dro', ['tn'], 'open-field', 12, 17, 'susina-dro'),
  // Union of the three cherry designations, all of which state 1 May - 31 July
  // despite sitting 450 km apart in Campania, Toscana and Emilia-Romagna.
  g(
    'cherry-generic',
    ['ar', 'bn', 'ce', 'fc', 'fe', 'fi', 'gr', 'li', 'lu', 'ms', 'na', 'pc', 'po', 'pr', 'pt', 'ra', 're', 'rn', 'si'],
    8,
    13,
    ['ciliegia-bracigliano', 'ciliegia-lari', 'ciliegia-vignola'],
  ),
  // Union of the six chestnut designations, which run from Cuneo to Salerno and
  // vary by a single half-month between them.
  g(
    'chestnut-generic',
    ['al', 'ar', 'at', 'bi', 'bl', 'bn', 'ce', 'fi', 'fr', 'li', 'lt', 'lu', 'ms', 'na', 'no', 'pd', 'pi', 'po', 'pt', 'ri', 'rm', 'ro', 'vb', 'vc', 've', 'vi', 'vr'],
    16,
    21,
    [
      'castagna-cuneo',
      'castagna-monte-amiata',
      'castagna-vallerano',
      'marrone-combai',
      'marrone-serino',
      'marrone-valle-susa',
      'marroni-monfenera',
    ],
  ),

  // "La raccolta per la varieta' Navelina inizia il 1° novembre e termina alla
  //  fine di febbraio; mentre per le varieta' Brasiliano e Washington navel
  //  inizia nella prima decade di dicembre e termina alla fine di maggio"
  w('arancia-ribera', ['ag', 'pa'], 'open-field', 20, 9, 'arancia-ribera'),
  // "La raccolta non puo' essere iniziata prima del 20 luglio e non puo'
  //  terminare dopo il 15 dicembre"
  w('mele-trentino', ['tn'], 'open-field', 13, 22, 'mele-trentino'),
  // "La raccolta va effettuata nel periodo che va dal 1° gennaio al 31 ottobre"
  //  — restored: the 2010 amendment moved the start forward a month, and the
  //  ministry's consolidated text states both ends of the window in force.
  w('limone-sorrento', ['na'], 'open-field', 0, 19, 'limone-sorrento'),
  // "il periodo di raccolta ha inizio al 20 di settembre per concludersi il 10
  //  novembre"
  w('marrone-valle-susa', ['to'], 'open-field', 17, 20, 'marrone-valle-susa'),
  // ── Vegetables ───────────────────────────────────────────────────────────
  // "L'estirpazione dell'Aglio di Voghiera avviene dal 10 giugno sino al 31
  //  luglio"
  w('aglio-voghiera', ['fe'], 'open-field', 10, 13, 'aglio-voghiera'),
  // "tra il primo febbraio e il 30 giugno di ogni anno"
  w('asparago-badoere', ['pd', 'tv', 've'], 'open-field', 2, 11, 'asparago-badoere'),
  // "Il periodo di raccolta deve essere compreso tra il 1 marzo ed il 15 giugno"
  w('asparago-bassano', ['vi'], 'open-field', 4, 10, 'asparago-bassano'),
  // "La raccolta avviene nel periodo gennaio/giugno e settembre/ottobre"
  w('asparago-canino', ['vt'], 'open-field', 0, 11, 'asparago-canino'),
  w('asparago-canino', ['vt'], 'open-field', 16, 19, 'asparago-canino'),
  // "La raccolta del prodotto inizia a marzo e si protrae fino a giugno"
  w('asparago-cantello', ['va'], 'open-field', 4, 11, 'asparago-cantello'),
  // "I primi turioni si raccolgono in marzo" / "Il periodo di raccolta non deve
  //  in ogni caso protrarsi oltre il 30 maggio" — the text in force says only
  //  "in marzo", where the version this row used to cite said "il 20 circa".
  w('asparago-cimadolmo', ['tv'], 'open-field', 4, 9, 'asparago-cimadolmo'),
  // "va effettuata esclusivamente a mano a partire dal mese di Aprile fino alla
  //  fine di Agosto"
  w('cappero-eolie', ['me'], 'open-field', 6, 15, 'cappero-eolie'),
  // "Le operazioni di raccolta vengono svolte a mano e in modo scalare dal 1°
  //  maggio al 31 ottobre di ciascun anno"
  w('cappero-pantelleria', ['tp'], 'open-field', 8, 19, 'cappero-pantelleria'),
  // "Le raccolte dei carciofi iniziano dal 1 novembre e terminano il 30 maggio
  //  dell'anno successivo"
  w('carciofo-brindisino', ['br'], 'open-field', 20, 9, 'carciofo-brindisino'),
  // "nel periodo compreso dal 1° febbraio al 20 maggio"
  w('carciofo-paestum', ['sa'], 'open-field', 2, 9, 'carciofo-paestum'),
  // "L'epoca di raccolta inizia in gennaio e potra' protrarsi fino a maggio"
  w('carciofo-romanesco', ['vt', 'rm', 'lt'], 'open-field', 0, 9, 'carciofo-romanesco'),
  // "deve avvenire prima dell’apertura delle brattee, ossia dal 1° settembre al
  //  31 maggio"
  w('carciofo-sardegna', ['ca', 'nu', 'or', 'ss'], 'open-field', 16, 9, 'carciofo-sardegna'),
  // "a partire dal 1° febbraio e fino al 15 di giugno"
  w('carota-ispica', ['rg', 'sr', 'ct', 'cl'], 'open-field', 2, 10, 'carota-ispica'),
  // "La raccolta della produzione cerosa inizia dal 1° agosto di ogni anno e
  //  termina entro il 30 ottobre"
  w('fagioli-rotonda', ['pz'], 'open-field', 14, 19, 'fagioli-rotonda'),
  // "La raccolta della produzione secca inizia dal 15 settembre e termina entro
  //  il 30 novembre"
  w('fagioli-rotonda', ['pz'], 'open-field', 16, 21, 'fagioli-rotonda'),
  // "nel periodo compreso fra il 10 settembre ed il 30 ottobre di ciascun anno"
  w('fagiolo-atina', ['fr'], 'open-field', 16, 19, 'fagiolo-atina'),
  // "epoca di raccolta parte dalla seconda decade di ottobre e fino a meta' marzo per le
  //  tipologie «precoci»"
  w('finocchio-capo-rizzuto', ['kr', 'cz'], 'open-field', 19, 4, 'finocchio-capo-rizzuto'),
  // "... e da inizio marzo sino alla meta' di giugno per quelle «tardive»"
  w('finocchio-capo-rizzuto', ['kr', 'cz'], 'open-field', 4, 10, 'finocchio-capo-rizzuto'),
  // "L'inizio delle operazioni di raccolta deve essere non antecedente al 1°
  //  aprile e la fine non successivo al 30 novembre"
  w('fungo-borgotaro', ['pr', 'pc', 'ms'], 'open-field', 6, 21, 'fungo-borgotaro'),
  // "nel periodo compreso fra il 15 giugno ed il 30 agosto di ciascun anno"
  w('lenticchia-onano', ['vt'], 'open-field', 10, 15, 'lenticchia-onano'),
  // "inizia dal 1 luglio di ogni anno e termina entro il 30 di novembre"
  w('melanzana-rotonda', ['pz'], 'open-field', 12, 21, 'melanzana-rotonda'),
  // "deve effettuarsi nel periodo compreso tra 15 giugno e 30 settembre di
  //  ciascun anno"
  w('patata-alto-viterbese', ['vt'], 'open-field', 10, 17, 'patata-alto-viterbese'),
  // "la raccolta si effettua dal 1° agosto fino a tutto il mese di novembre"
  w('patata-colfiorito', ['pg', 'mc'], 'open-field', 14, 21, 'patata-colfiorito'),
  // "avra' inizio dal 20 luglio ... e si protrarra' fino al 15 novembre"
  w('patata-fucino', ['aq'], 'open-field', 13, 20, 'patata-fucino'),
  // "a partire dalla prima decade di marzo e non si potra' prolungare oltre il 30 giugno"
  w('patata-galatina', ['le'], 'open-field', 4, 11, 'patata-galatina'),
  // "dal 20 di agosto fino al 30 di novembre"
  w('patata-sila', ['cs', 'cz'], 'open-field', 15, 21, 'patata-sila'),
  // "nel periodo compreso dall'inizio di giugno fino a gennaio per il prodotto
  //  in pieno campo"
  w('peperoncino-calabria', ['cs', 'cz', 'kr', 'rc', 'vv'], 'open-field', 10, 1, 'peperoncino-calabria'),
  // "durante il periodo che va dal 1 luglio al 30 novembre"
  w('peperone-pontecorvo', ['fr'], 'open-field', 12, 21, 'peperone-pontecorvo'),
  // "nel periodo compreso tra il 20 giugno ed il 31 agosto"
  w('piennolo-vesuvio', ['na'], 'open-field', 11, 15, 'piennolo-vesuvio'),
  // "Periodo raccolta 1 Aprile - 15 Luglio"
  w('radicchio-chioggia', ['ve', 'pd', 'ro'], 'open-field', 6, 12, 'radicchio-chioggia'),
  // "Periodo raccolta 1 Settembre - 15 Marzo"
  w('radicchio-chioggia', ['ve', 'pd', 'ro'], 'open-field', 16, 4, 'radicchio-chioggia'),
  // "La raccolta dei frutti e' compresa tra il 15 luglio ed il 15 ottobre"
  w('san-marzano', ['sa', 'na', 'av'], 'open-field', 12, 18, 'san-marzano'),
];
