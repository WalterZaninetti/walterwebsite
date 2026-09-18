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
  // "La raccolta viene effettuata nel periodo compreso dal 20 maggio al 31
  //  luglio, tenuto conto dell'epoca di maturazione delle singole varieta'
  //  presenti nel frutteto" — the sour-cherry harvest. The designation
  //  protects the confettura made from it; art. 3 names comuni in Modena
  //  and twelve more in Bologna.
  w('amarene-modena', ['bo', 'mo'], 'open-field', 9, 13, 'amarene-modena'),
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
  // "La raccolta delle castagne deve avvenire a partire da settembre, con il
  //  periodo di inizio della caduta spontanea dei frutti … e fino al 15
  //  dicembre" — provincia di Massa Carrara. The widest chestnut window in
  //  the corpus, and the reason it is not a part of the generalised row.
  w('farina-lunigiana', ['ms'], 'open-field', 16, 22, 'farina-lunigiana'),
  // "La raccolta delle castagne deve avvenire tra il 1 ottobre e il 30
  //  novembre di ogni anno" — provincia di Lucca.
  w('farina-neccio', ['lu'], 'open-field', 18, 21, 'farina-neccio'),
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
  // ── PAT: the regional registers ──────────────────────────────────────────
  // Every row below was read in the scheda itself before it shipped, and two
  // were corrected in the reading: the sweep had Valle d'Aosta ending at 21
  // and Villacidro's cherry starting at 8. Marche's sixth pass lesson applies
  // here too — the quote can be verbatim and the row still wrong.

  // ── Marche, Schede prodotti tradizionali 2017 ────────────────────────────
  // "La raccolta avviene tra aprile e maggio" — "Territorio della provincia di
  //  Macerata, principalmente nel comune di Montelupone"
  w('carciofo-monteluponese', ['mc'], 'open-field', 6, 9, 'pat-marche'),
  // "Il cavolfiore viene trapiantato dalla prima decade di agosto fino alla
  //  prima decade di settembre; si raccoglie in novembre e in dicembre" — the
  //  clause before the semicolon is the transplant, not the harvest.
  w('cavolfiore-jesi', ['ap', 'an'], 'open-field', 20, 23, 'pat-marche'),
  // "il trapianto estivo avviene a fine agosto-primi di settembre e matura da
  //  fine febbraio a metà maggio dell'anno successivo" — a maturation window,
  //  on the Pesca di Delia precedent, and it wraps into the next year.
  w('cavolfiore-fano', ['pu', 'an'], 'open-field', 3, 8, 'pat-marche'),
  // "La raccolta dei marroni avviene in ottobre-novembre"
  w('marrone-acquasanta', ['ap'], 'open-field', 18, 21, 'pat-marche'),
  // "Il periodo di raccolta è compreso tra aprile e giugno" — "Tutto il
  //  territorio regionale, particolarmente nelle zone pianeggianti della
  //  provincia di Ascoli Piceno"
  w('taccole-marche', ['pu', 'an', 'mc', 'ap', 'fm'], 'open-field', 6, 11, 'pat-marche'),
  // "Nei mesi di giugno - luglio, i frutti ben maturi si raccolgono a mano" —
  //  the designation is a sugar preserve and the window is its input's
  //  harvest, which is the Brovada precedent.
  w('visciole-sole', ['mc'], 'open-field', 10, 13, 'pat-marche'),

  // ── Friuli-Venezia Giulia, Il Cibario 2017 ──────────────────────────────
  // "La raccolta avviene con i primi freddi (fine ottobre-novembre)" — one
  //  sentence for both ecotypes, "dai contadini di varie zone del Goriziano"
  w('radicchio-canarino', ['go'], 'open-field', 19, 21, 'pat-friuli'),
  w('rosa-gorizia', ['go'], 'open-field', 19, 21, 'pat-friuli'),
  // "L'epoca di raccolta va da fine ottobre a inizio novembre, a seconda
  //  dell'altitudine" — Carnia, Canale del Ferro, Val Resia, Val Canale (UD)
  //  and "la montagna dell'Alto Pordenonese".
  w('pera-per-martin', ['ud', 'pn'], 'open-field', 19, 20, 'pat-friuli'),
  // "per i fichi nati in giugno (fioroni) ... si arriva alla raccolta verso la
  //  prima metà di luglio, mentre da metà agosto a metà-fine settembre inizia
  //  la seconda raccolta" — two flowerings, so the row is their union. The
  //  zone names Caneva (PN) and Cordignano, which is in Treviso.
  w('figo-moro', ['pn', 'tv'], 'open-field', 12, 17, 'pat-friuli'),

  // ── Umbria, schede descrittive ──────────────────────────────────────────
  // The Region's PAT page lists names; its asset library holds a scheda per
  // product, which is where these three were read.
  // "Raccolta nei mesi di luglio e agosto ed asciugatura nel campo." —
  //  "Comune di Cannara".
  w('umb-cipolla-cannara', ['pg'], 'open-field', 12, 15, 'umb-cipolla-cannara'),
  // "Raccolta manuale o meccanica nei mesi di ottobre e novembre." — "Comuni
  //  di Città di Castello, Monte Santa Maria Tiberina e Umbertide".
  w('umb-marrone', ['pg'], 'open-field', 18, 21, 'umb-marrone'),
  // "Raccolta da metà Ottobre sino a Dicembre inoltrato." — "Comune di
  //  Trevi". «Da metà ottobre» starts in the first half, on the Combai
  //  precedent («dal 15 settembre» → 16).
  w('umb-sedano-nero-trevi', ['pg'], 'open-field', 18, 23, 'umb-sedano-nero-trevi'),

  // ── Abruzzo, Atlante dei prodotti tradizionali d'Abruzzo 2006 ──────────
  // The PDF discovery could not open was the name-only elenco; this atlas,
  // printed in June 2006 by the Region's agency ARSSA, carries the schede.
  // "La raccolta cade tra la fine di giugno e la prima settimana di luglio" —
  //  Sulmona, provincia dell'Aquila.
  w('aglio-sulmona', ['aq'], 'open-field', 11, 12, 'pat-abruzzo'),
  // "si effettua nel periodo che va dall'ultima decade di marzo alla fine di
  //  maggio per le mammole e i secondi, mentre per la raccolta dei carciofini si
  //  arriva fino alla prima decade di giugno" — the union of the three cuts.
  //  Cupello, Furci, Lentella, Monteodorisio, San Salvo, Vasto (CH).
  w('carciofo-vastese', ['ch'], 'open-field', 5, 10, 'pat-abruzzo'),
  // "Raccolta: dalla fine di agosto alla fine di settembre." — Altino,
  //  Roccascalegna, Bomba, Casoli, Archi ed Atessa, in provincia di Chieti.
  w('peperone-altino', ['ch'], 'open-field', 15, 17, 'pat-abruzzo'),

  // ── Campania, prodotti tradizionali ─────────────────────────────────────
  // raccolti manualmente a giugno
  w('cam-aglio-dell-ufita', ['av'], 'open-field', 10, 11, 'cam-aglio-dell-ufita'),
  // la raccolta, eseguita manualmente in più riprese, ricade nel periodo
  //  gennaio-marzo, è effettuata riunendo in mazzetti foglie e steli
  //  teneri.
  w('cam-broccolo-san-pasquale', ['na', 'sa'], 'open-field', 0, 5, 'cam-broccolo-san-pasquale'),
  // che matura tra fine marzo ed inizio aprile
  // ready to harvest between the end of March and the beginning of April
  w('cam-carciofo-capuanella', ['ce', 'na'], 'open-field', 5, 6, 'cam-carciofo-capuanella'),
  // si raccoglie, infatti, nel periodo compreso tra febbraio e metà
  //  maggio, ma già nei mesi di febbraio-marzo si raccolgono le
  //  mammarelle, cioè i capolini centrali
  w('cam-carciofo-di-castellammare', ['na'], 'open-field', 2, 8, 'cam-carciofo-di-castellammare'),
  // La raccolta inizia  da marzo-aprile e prosegue fino alla prima
  //  decade di giugno a seconda dell'andamento  atmosferico
  w('cam-carciofo-pignatella-carciofo-ros', ['na', 'sa'], 'open-field', 4, 10, 'cam-carciofo-pignatella-carciofo-ros'),
  // producendo dei frutti che si raccolgono fra settembre ed ottobre
  w('cam-castagna-del-monte-faito', ['na'], 'open-field', 16, 19, 'cam-castagna-del-monte-faito'),
  // la maturazione delle castagne  va da inizio ottobre fino ai primi
  //  giorni di novembre
  w('cam-castagna-di-acerno', ['sa'], 'open-field', 18, 20, 'cam-castagna-di-acerno'),
  // la raccolta delle castagne da terra viene effettuata manualmente dal
  //  10 di ottobre fino al 10 di novembre.
  w('cam-castagna-di-trevico', ['av'], 'open-field', 18, 20, 'cam-castagna-di-trevico'),
  // La raccolta avviene al suolo in autunno (dall'ultima settimana di
  //  settembre alla prima di  novembre, secondo la posizione del
  //  castagneto)
  w('cam-castagna-jonna-di-civitella-lici', ['bn'], 'open-field', 17, 20, 'cam-castagna-jonna-di-civitella-lici'),
  // fino alla raccolta, generalmente eseguita a mano, alla caduta dei
  //  ricci (dalla prima alla terza decade di ottobre in relazione
  //  all'altitudine e all'esposizione del castagneto)
  w('cam-castagna-o-marrone-del-partenio', ['av', 'bn', 'ce', 'na'], 'open-field', 18, 19, 'cam-castagna-o-marrone-del-partenio'),
  // matura tra la fine di maggio e la seconda decade di giugno.
  // che matura tra la prima e la seconda decade di giugno.
  w('cam-ciliegia-del-monte-e-ciliegia-de', ['na'], 'open-field', 9, 11, 'cam-ciliegia-del-monte-e-ciliegia-de'),
  // maturazione dei frutti fra fine giugno e prima decade di luglio.
  w('cam-ciliegia-di-pimonte', ['na'], 'open-field', 11, 12, 'cam-ciliegia-di-pimonte'),
  // epoca di fioritura intorno a fine marzo – inizio aprile, epoca di
  //  maturazione intorno a fine maggio – inizio giugno
  // epoca di maturazione intorno alla prima decade di giugno
  w('cam-ciliegia-di-siano', ['sa'], 'open-field', 9, 10, 'cam-ciliegia-di-siano'),
  // La maturazione avviene in luglio - agosto
  w('cam-cipolla-alifana', ['ce'], 'open-field', 12, 15, 'cam-cipolla-alifana'),
  // Si raccoglie in primavera, da marzo a giugno
  w('cam-cipolla-bianca-di-pompei', ['na', 'sa'], 'open-field', 4, 11, 'cam-cipolla-bianca-di-pompei'),
  // La raccolta manuale viene fatta tra luglio e agosto.
  w('cam-cipolla-di-airola', ['bn'], 'open-field', 12, 15, 'cam-cipolla-di-airola'),
  // la maturazione avviene alla fine di ottobre (stato ceroso) e fino
  //  alla fine di novembre (prodotto secco).
  w('cam-fagiolo-mustacciello', ['ce', 'bn', 'na', 'av', 'sa'], 'open-field', 19, 21, 'cam-fagiolo-mustacciello'),
  // Il finocchio bianco palettone viene raccolto nell'arco dell'intero
  //  mese di ottobre.
  w('cam-finocchio-bianco-palettone', ['na'], 'open-field', 18, 19, 'cam-finocchio-bianco-palettone'),
  // la semina avviene a cavallo tra il 10 ed il 20 luglio e la raccolta
  //  tra novembre e dicembre.
  w('cam-finocchio-di-sarno', ['sa'], 'open-field', 20, 23, 'cam-finocchio-di-sarno'),
  // la raccolta avviene tra la terza decade di luglio e la prima di
  //  agosto.
  w('cam-giallona-di-siano', ['na'], 'open-field', 13, 14, 'cam-giallona-di-siano'),
  // pur raccogliendosi fra settembre ed ottobre, infatti, si consuma
  //  prevalentemente durante l'inverno ed in particolare nelle feste
  //  natalizie
  w('cam-melone-napoletano', ['na'], 'open-field', 16, 19, 'cam-melone-napoletano'),
  // La raccolta, a mano, viene effettuata nel mese di ottobre e le olive
  //  vengono molite entro 2 giorni dalla raccolta.
  w('cam-oliva-marinese', ['av'], 'open-field', 18, 19, 'cam-oliva-marinese'),
  // La raccolta avviene da metà agosto a metà settembre, quando la parte
  //  aerea della pianta è completamente secca.
  w('cam-patata-di-monte-s-giacomo', ['sa'], 'open-field', 14, 16, 'cam-patata-di-monte-s-giacomo'),
  // La raccolta viene fatta tra il 15 agosto e il 15 settembre, la
  //  raccolta può essere fatta sia meccanicamente che manuale.
  w('cam-patata-di-trevico', ['av'], 'open-field', 14, 16, 'cam-patata-di-trevico'),
  // che sono raccolti fra maggio e giugno, in un periodo di assenza di
  //  altre patate fresche
  w('cam-patata-fresca-campana', ['na', 'ce', 'sa'], 'open-field', 8, 11, 'cam-patata-fresca-campana'),
  // La coltivazione inizia nel mese di maggio (semina dei tuberi
  //  spaccati, in due o quattro parti secondo le dimensioni), e si chiude
  //  con la raccolta ad ottobre, manuale.
  w('cam-patata-nera-del-matese', ['ce'], 'open-field', 18, 19, 'cam-patata-nera-del-matese'),
  // La coltivazione inizia nel mese di maggio (semina dei tuberi),
  //  quando sono definitivamente fugate le possibilità di gelate tardive,
  //  e si chiude con la raccolta a fine agosto inizio settembre.
  w('cam-patata-rossa-del-vallo-di-diano', ['sa'], 'open-field', 15, 16, 'cam-patata-rossa-del-vallo-di-diano'),
  // La coltivazione avviene tradizionalmente in pieno campo, con
  //  raccolta da maggio a settembre; nelle coltivazioni in serra la
  //  raccolta è anticipata.
  w('cam-peperoncini-verdi-o-di-fiume', ['na', 'sa', 'ce'], 'open-field', 8, 17, 'cam-peperoncini-verdi-o-di-fiume'),
  // la raccolta viene effettuata dalla fine di luglio fino a fine
  //  ottobre, è coltivato sia in pieno campo che in tunnel con rete
  //  antiafidica
  w('cam-peperone-cazzone', ['sa', 'na'], 'open-field', 13, 19, 'cam-peperone-cazzone'),
  // L'epoca di coltivazione va da aprile a fine ottobre; la raccolta
  //  viene effettuata dalla fine di luglio fino a fine ottobre, è
  //  coltivato sia in pieno campo che in tunnel con rete antiafidica.
  w('cam-peperone-sassaniello', ['sa'], 'open-field', 13, 19, 'cam-peperone-sassaniello'),
  // Nel periodo autunnale di Settembre-Ottobre, si raccolgono i frutti
  //  di questo ceppo autoctono di pero, a maturazione quasi avvenuta, si
  //  raccolgono manualmente i frutti
  w('cam-pera-lardara', ['sa'], 'open-field', 16, 19, 'cam-pera-lardara'),
  // la raccolta è effettuata ordinariamente da marzo ad aprile
  w('cam-pisello-centogiorni', ['na', 'sa'], 'open-field', 4, 7, 'cam-pisello-centogiorni'),
  // La raccolta dei frutti è scalare e va effettuata nel periodo
  //  compreso tra la fine di luglio e prima decade di ottobre
  // La raccolta dei frutti è scalare e va effettuata nel periodo
  //  compreso tra inizio luglio e fine settembre
  w('cam-pomodorino-campano', ['sa', 'na', 'av'], 'open-field', 12, 18, 'cam-pomodorino-campano'),
  // La raccolta si effettua rigorosamente a mano dalla metà di luglio ad
  //  agosto.
  w('cam-pomodorino-cannellino-di-pimonte', ['na', 'sa'], 'open-field', 13, 15, 'cam-pomodorino-cannellino-di-pimonte'),
  // La raccolta dei frutti è scalare e va effettuata nel periodo
  //  compreso tra la fine di agosto e prima decade di ottobre
  w('cam-pomodorino-dell-ufita', ['av'], 'open-field', 15, 18, 'cam-pomodorino-dell-ufita'),
  // La raccolta si effettua da metà luglio ad agosto.
  w('cam-pomodoro-cannellino-flegreo', ['na'], 'open-field', 13, 15, 'cam-pomodoro-cannellino-flegreo'),
  // La raccolta avviene fra metà luglio e metà settembre, in modo
  //  scalare.
  w('cam-pomodoro-fiaschello-di-battipagl', ['sa'], 'open-field', 12, 16, 'cam-pomodoro-fiaschello-di-battipagl'),
  // la raccolta, effettuata in più riprese riunendo in mazzetti steli e
  //  foglie, è manuale e ricade nel periodo novembre-febbraio.
  w('cam-rapa-catozza', ['ce', 'na', 'sa'], 'open-field', 20, 3, 'cam-rapa-catozza'),
  // La raccolta si effettua a fine giugno, inizio luglio.
  w('cam-sedano-di-gesualdo', ['av'], 'open-field', 11, 12, 'cam-sedano-di-gesualdo'),
  // La raccolta manuale va da maggio fino a fine ottobre.
  w('cam-zucchino-san-pasquale', ['na', 'sa'], 'open-field', 8, 19, 'cam-zucchino-san-pasquale'),

  // ── Toscana, I Prodotti Agroalimentari della Toscana ────────────────────
  //  La raccolta, manuale, avviene tra aprile, maggio e giugno.
  w('tos-aglio-massese', ['ms'], 'open-field', 6, 11, 'tos-aglio-massese'),
  //  La raccolta dell'Aglione avviene tra giugno e luglio, non appena le
  //  foglie cominciano ad ingiallire affinche' il bulbo (capo) non si
  //  rompa o marcisca.
  w('tos-aglione-della-valdichiana', ['si', 'ar'], 'open-field', 10, 13, 'tos-aglione-della-valdichiana'),
  //  Si produce tra novembre, dicembre e gennaio.
  w('tos-arancio-massese', ['ms'], 'open-field', 20, 1, 'tos-arancio-massese'),
  //  La barba massese, prodotta da giugno ad ottobre, viene confezionata
  //  in mazzi.
  w('tos-barba-massese', ['ms'], 'open-field', 10, 19, 'tos-barba-massese'),
  //  ed e' pronto per la raccolta, rigorosamente manuale, nel periodo
  //  compreso tra aprile e maggio.
  w('tos-carciofo-di-chiusure', ['si'], 'open-field', 6, 9, 'tos-carciofo-di-chiusure'),
  //  ad aprile-maggio si effettua la raccolta dei capolini.
  w('tos-carciofo-di-san-miniato', ['pi'], 'open-field', 6, 9, 'tos-carciofo-di-san-miniato'),
  //  Si produce da aprile a giugno.
  //  La raccolta e' manuale, normalmente da fine aprile fino all'inizio
  //  di giugno.
  w('tos-carciofo-empolese', ['fi'], 'open-field', 6, 11, 'tos-carciofo-empolese'),
  //  Raccolta manuale nei mesi di ottobre, novembre e dicembre
  w('tos-cardo-della-val-di-cornia', ['li'], 'open-field', 18, 23, 'tos-cardo-della-val-di-cornia'),
  //  Si produce da novembre a marzo.
  w('tos-cardo-massese', ['ms'], 'open-field', 20, 5, 'tos-cardo-massese'),
  //  Le castagne vengono raccolte nel mese di ottobre e poste a essiccare
  //  per 30 giorni
  w('tos-castagna-pistolesa', ['ar'], 'open-field', 18, 19, 'tos-castagna-pistolesa'),
  //  Si produce a novembre-dicembre.
  w('tos-cavolfiore-fiorentino-tardivo', ['fi', 'ar'], 'open-field', 20, 23, 'tos-cavolfiore-fiorentino-tardivo'),
  //  Produce da ottobre fino a meta' novembre una palla formata da
  //  un'infiorescenza gialla
  w('tos-cavolfiore-precoce-toscano', ['fi', 'ar'], 'open-field', 18, 20, 'tos-cavolfiore-precoce-toscano'),
  //  Viene prodotta nei mesi di novembre e dicembre
  //  Raccolta manuale nei mesi di novembre e dicembre
  w('tos-cipolla-di-bassone', ['ms'], 'open-field', 20, 23, 'tos-cipolla-di-bassone'),
  //  cipollotti raccolti a maggio-giugno
  //  e' pronta per la raccolta ad agosto-settembre
  w('tos-cipolla-di-certaldo', ['fi'], 'open-field', 8, 17, 'tos-cipolla-di-certaldo'),
  //  Raccolta manuale eseguita a giugno-luglio o a ottobre-novembre
  w('tos-cipolla-di-ripola', ['ms'], 'open-field', 10, 13, 'tos-cipolla-di-ripola'),
  w('tos-cipolla-di-ripola', ['ms'], 'open-field', 18, 21, 'tos-cipolla-di-ripola'),
  //  Si raccoglie fra giugno e luglio.
  w('tos-cipolla-di-terceretoli', ['ms'], 'open-field', 10, 13, 'tos-cipolla-di-terceretoli'),
  //  Si produce tra aprile e giugno.
  //  La raccolta, manuale, avviene nei mesi di aprile, maggio e giugno.
  w('tos-cipolla-massese', ['ms'], 'open-field', 6, 11, 'tos-cipolla-massese'),
  //  La raccolta avviene da meta' agosto a tutto settembre.
  w('tos-cipolla-rossa-della-valtiberina', ['ar'], 'open-field', 15, 17, 'tos-cipolla-rossa-della-valtiberina'),
  //  Si raccoglie a luglio.
  w('tos-cipolla-vernina', ['fi'], 'open-field', 12, 13, 'tos-cipolla-vernina'),
  //  La raccolta, essendo una produzione ortiva da frutto (cucurbitacee)
  //  a ciclo tardivo avviene da dopo ferragosto fino alla meta' del mese
  //  di settembre.
  w('tos-cocomero-gigante', ['ar'], 'open-field', 15, 16, 'tos-cocomero-gigante'),
  //  la raccolta avviene a fine giugno-primi di luglio, nel secondo a
  //  settembre.
  w('tos-fagiolo-marconi-a-seme-nero', ['ar', 'fi'], 'open-field', 11, 17, 'tos-fagiolo-marconi-a-seme-nero'),
  //  Si produce da aprile a luglio.
  //  La raccolta, a giugno-luglio, e' manuale.
  w('tos-fagiolo-borlotto-di-maremma', ['gr'], 'open-field', 10, 13, 'tos-fagiolo-borlotto-di-maremma'),
  //  Si produce da aprile a giugno.
  //  La raccolta, manuale, avviene a luglio.
  w('tos-fagiolo-borlotto-nano-di-sorano', ['gr'], 'open-field', 12, 13, 'tos-fagiolo-borlotto-nano-di-sorano'),
  //  La raccolta che si protrae da luglio a settembre a seconda
  //  dell'epoca di semina avviene manualmente, per il prodotto fresco, e
  //  anche meccanicamente per il prodotto secco.
  w('tos-fagiolo-cannellino', ['lu'], 'open-field', 12, 17, 'tos-fagiolo-cannellino'),
  //  La raccolta avviene da fine luglio a scalare e puo' arrivare fino a
  //  ottobre.
  w('tos-fagiolo-dall-occhio-del-valdarno', ['ar', 'fi'], 'open-field', 13, 19, 'tos-fagiolo-dall-occhio-del-valdarno'),
  //  La raccolta avviene da fine luglio a scalare e puo' arrivare fino a
  //  ottobre.
  w('tos-fagiolo-di-zeri', ['ms'], 'open-field', 13, 19, 'tos-fagiolo-di-zeri'),
  //  La raccolta viene effettata a mano dall'inizio di luglio fino a
  //  settembre; il prodotto viene raccolto mano a mano che matura.
  w('tos-fagiolo-fico-di-gallicano', ['lu'], 'open-field', 12, 17, 'tos-fagiolo-fico-di-gallicano'),
  //  La raccolta viene effettuata a mano raccogliendo l'intera pianta e
  //  va dalla fine di luglio (prodotto fresco) fino al settembre
  //  inoltrato per la granella.
  w('tos-fagiolo-malato', ['lu'], 'open-field', 13, 17, 'tos-fagiolo-malato'),
  //  La raccolta viene effettuata a mano dall'inizio di luglio fino a
  //  settembre; il prodotto viene raccolto mano a mano che matura.
  w('tos-fagiolo-mascherino', ['lu'], 'open-field', 12, 17, 'tos-fagiolo-mascherino'),
  //  La raccolta viene effettata a mano fra la fine di luglio e tutto
  //  agosto; il prodotto viene raccolto mano a mano che matura.
  w('tos-fagiolo-scritto-della-garfagnana', ['lu'], 'open-field', 13, 15, 'tos-fagiolo-scritto-della-garfagnana'),
  //  Si produce da fine giugno a fine agosto.
  w('tos-fagiolo-serpente-toscano', ['ar', 'fi'], 'open-field', 11, 15, 'tos-fagiolo-serpente-toscano'),
  //  Se seminato ad aprile la raccolta avviene a luglio e si protrae per
  //  20 giorni dato che il fagiolo ha maturazione scalare; con semina
  //  tardiva (fine giugno) la raccolta viene fatta a settembre.
  w('tos-fagiolo-turco-di-castello', ['ar', 'fi'], 'open-field', 12, 17, 'tos-fagiolo-turco-di-castello'),
  //  L'epoca di raccolta dei frutti e' giugno-luglio.
  w('tos-fico-san-piero', ['fi'], 'open-field', 10, 13, 'tos-fico-san-piero'),
  //  Il frutto matura fra la fine di ottobre e i primi di novembre e si
  //  conserva per tutto l'inverno.
  w('tos-mela-rosa-del-casentino', ['ar'], 'open-field', 19, 20, 'tos-mela-rosa-del-casentino'),
  //  La raccolta, in ottobre, avviene manualmente e la conservazione
  //  avviene in celle ad atomosfera controllata (ultra low oxigen).
  w('tos-mela-stayman-aretina', ['ar'], 'open-field', 18, 19, 'tos-mela-stayman-aretina'),
  //  Il melograno di Firenze si produce a settembre-ottobre
  w('tos-melograno-di-firenze', ['fi'], 'open-field', 16, 19, 'tos-melograno-di-firenze'),
  //  Si produce tra giugno e settembre.
  w('tos-melone-della-val-di-cornia', ['li'], 'open-field', 10, 17, 'tos-melone-della-val-di-cornia'),
  //  Nel caso della coltura primaticcia la raccolta e' prevista a partire
  //  dalla meta' di aprile; in caso di un ciclo normale i tuberi possono
  //  essere raccolti successivamente fino al mese di settembre.
  w('tos-patata-di-santa-maria-a-monte', ['pi'], 'open-field', 6, 17, 'tos-patata-di-santa-maria-a-monte'),
  //  Matura a luglio.
  w('tos-pera-coscia-di-firenze', ['fi'], 'open-field', 12, 13, 'tos-pera-coscia-di-firenze'),
  //  Matura a giugno.
  w('tos-pera-gentile', ['fi'], 'open-field', 10, 11, 'tos-pera-gentile'),
  //  Matura a fine agosto, primi di settembre.
  w('tos-pesca-michelini', ['ar', 'fi'], 'open-field', 15, 16, 'tos-pesca-michelini'),
  //  matura tra l'ultima settimana di luglio e la prima di agosto, poco
  //  prima della pesca trionfo.
  w('tos-pesca-maglia-rosa', ['ar', 'fi'], 'open-field', 13, 14, 'tos-pesca-maglia-rosa'),
  //  Si producono in agosto.
  w('tos-pesca-mora-di-moriano-dolfi', ['lu'], 'open-field', 14, 15, 'tos-pesca-mora-di-moriano-dolfi'),
  //  Si produce a settembre-ottobre.
  w('tos-pesca-regina-di-londa', ['ar', 'fi'], 'open-field', 16, 19, 'tos-pesca-regina-di-londa'),
  //  Il frutto arriva a maturazione nell'ultima decade di agosto e nei
  //  primi di settembre (da cui il nome di peschetti settembrini).
  w('tos-peschetti-di-candia', ['ms'], 'open-field', 15, 16, 'tos-peschetti-di-candia'),
  //  La raccolta scalare e manuale dei legumi freschi inizia secondo
  //  tradizione per San Ranieri (17 Giugno) e si protrae fino a tutto
  //  Luglio.
  w('tos-piattella-pisana', ['pi'], 'open-field', 11, 13, 'tos-piattella-pisana'),
  //  La maturazione e' scalare, da fine marzo a fine aprile.
  w('tos-pisello-a-mezza-frasca-aretino', ['ar'], 'open-field', 5, 7, 'tos-pisello-a-mezza-frasca-aretino'),
  //  maturano da maggio a giugno.
  w('tos-pisello-a-tutta-frasca-aretino', ['ar'], 'open-field', 8, 11, 'tos-pisello-a-tutta-frasca-aretino'),
  //  La raccolta, effettuata a giorni alterni, dura da fine maggio alla
  //  meta' di giugno in funzione della disponibilita' idrica.
  w('tos-pisello-mugellano', ['fi'], 'open-field', 9, 10, 'tos-pisello-mugellano'),
  //  Raccolta: manuale secondo l'andamento stagionale da giugno a tutto
  //  settembre.
  w('tos-pomodoro-grinzoso-sanminiatese', ['pi'], 'open-field', 10, 17, 'tos-pomodoro-grinzoso-sanminiatese'),
  //  Si produce fra agosto e settembre.
  w('tos-pomodoro-pallino', ['li'], 'open-field', 14, 17, 'tos-pomodoro-pallino'),
  //  Molto saporito, si produce da luglio a ottobre.
  //  Raccolta scalare: avviene manualmente da fine luglio asettembre
  w('tos-pomodoro-pendentino', ['lu'], 'open-field', 12, 19, 'tos-pomodoro-pendentino'),
  //  Si produce da giugno a settembre.
  w('tos-pomodoro-pisanello', ['li', 'pi'], 'open-field', 10, 17, 'tos-pomodoro-pisanello'),
  //  La produzione va da giugno a ottobre.
  w('tos-pomodoro-stella', ['pt', 'lu'], 'open-field', 10, 19, 'tos-pomodoro-stella'),
  //  Si raccoglie fino ad aprile.
  //  L'epoca di raccolta va da febbraio ad aprile.
  w('tos-radicchia-di-lucca', ['lu', 'pi', 'fi'], 'open-field', 2, 7, 'tos-radicchia-di-lucca'),
  //  la raccolta avviene a fine luglio primi di agosto e offre pochi
  //  problemi di conservazione
  w('tos-scalogno-nostrale-toscano', ['ar', 'fi'], 'open-field', 13, 14, 'tos-scalogno-nostrale-toscano'),
  //  Si produce da novembre a marzo.
  w('tos-spinacio-tipico-della-val-di-corni', ['li'], 'open-field', 20, 5, 'tos-spinacio-tipico-della-val-di-corni'),
  //  si produce a settembre
  w('tos-uva-colombana-di-peccioli', ['pi'], 'open-field', 16, 17, 'tos-uva-colombana-di-peccioli'),
  //  L'epoca di raccolta va da maggio a ottobre.
  w('tos-zucchina-mora-pisana', ['pi', 'lu'], 'open-field', 8, 19, 'tos-zucchina-mora-pisana'),
  //  L'epoca di raccolta va da maggio a ottobre.
  w('tos-zucchina-sarzanese', ['lu'], 'open-field', 8, 19, 'tos-zucchina-sarzanese'),

  // ── Lombardia, Atlante dei prodotti tipici e tradizionali 2014 ──────────
  // The Region's elenco is a list of names; this is the only publication of
  // its own that carries a scheda, and three of them state both ends.
  // "La semina avviene in autunno e la raccolta in luglio" — "Sermide,
  //  Felonica Po ed Oltrepò mantovano (Mantova)"
  w('cipolla-sermide', ['mn'], 'open-field', 12, 13, 'pat-lombardia'),
  // "La raccolta inizia a fine aprile-seconda decade di maggio e termina entro
  //  la prima decade di giugno ed è scalare" — the start is itself a range, so
  //  the row takes its earliest end of it. "Comune di Miradolo Terme" (PV).
  w('pisello-miradolo', ['pv'], 'open-field', 7, 10, 'pat-lombardia'),
  // "Si semina in aprile e la raccolta avviene a fine settembre-ottobre" —
  //  "Provincia di Mantova"
  w('zucca-mantovana', ['mn'], 'open-field', 17, 19, 'pat-lombardia'),

  // ── Sardegna, schede identificative ─────────────────────────────────────
  // "La raccolta dei capperi avviene in modo scalare, inizia l'ultima settimana
  //  di maggio e si conclude nella prima decade di settembre"
  w('cappero-selargius', ['ca'], 'open-field', 9, 16, 'pat-sardegna'),
  // "Ha un ciclo a giorno lungo con semina fine estate e raccolta a maggio-giugno"
  w('cipolla-gonnosfanadiga', ['su'], 'open-field', 8, 11, 'pat-sardegna'),
  // "La raccolta avviene nel periodo di maggio giugno" — "Tutto il territorio
  //  regionale con particolare riferimento alla zona della Marmilla"
  w('cipolla-rossa-sarda', ['ss', 'nu', 'ca', 'or', 'su'], 'open-field', 8, 11, 'pat-sardegna'),
  // "è una ciliegia tardiva, matura e viene raccolta tra fine maggio e inizi di
  //  giugno" — "fine maggio" is the second half, so 9 and not the 8 the sweep
  //  staged.
  w('ciliegia-barracocca', ['su'], 'open-field', 9, 10, 'pat-sardegna'),

  // ── Sicilia, schede PAT ─────────────────────────────────────────────────
  // "Periodo di produzione: Da maggio a luglio" — an epoca di produzione
  //  rather than a raccolta, which is the Basilico Genovese precedent.
  w('aglio-nubia', ['tp'], 'open-field', 8, 13, 'pat-sicilia'),
  // "la raccolta che si svolge nelle prime due decadi di giugno"
  w('albicocco-scillato', ['pa'], 'open-field', 10, 11, 'pat-sicilia'),
  // "maturazione e raccolta marzo/aprile"
  w('arancia-scillato', ['pa'], 'open-field', 4, 7, 'pat-sicilia'),
  // "Periodo di produzione – giugno e luglio"
  w('ciliegia-mastrantoni', ['ct'], 'open-field', 10, 13, 'pat-sicilia'),
  // "Semina manuale a metà novembre, scerbatura manuale, raccolta tra maggio e
  //  giugno" — the November date is the sowing.
  w('fava-leonforte', ['en'], 'open-field', 8, 11, 'pat-sicilia'),
  // "Le operazioni di raccolta iniziano nel mese di ottobre e si protraggono
  //  sino al mese di dicembre"
  w('ficodindia-valle-torto', ['pa'], 'open-field', 18, 23, 'pat-sicilia'),
  // "il calendario di commercializzazione coincide con quello di maturazione e
  //  raccolta che inizia da maggio e si protrae fino a giugno"
  w('fragola-maletto', ['ct'], 'open-field', 8, 11, 'pat-sicilia'),
  // "La stagione di raccolta è relativamente breve, comincia a maturare nei
  //  primi di aprile fino alla fine di maggio"
  w('fragolina-ribera', ['ag'], 'open-field', 6, 9, 'pat-sicilia'),
  // "Il frutto viene raccolto non completamente maturo a metà – fine ottobre" —
  //  the fruttaio ripening and "si conserva fino ad aprile" are storage the
  //  scheda never gives a start for, so no stored row.
  w('mele-cola', ['ct'], 'open-field', 18, 19, 'pat-sicilia'),
  // "La raccolta delle olive avviene per brucatura nel periodo novembre-dicembre"
  w('oliva-nebba', ['pa'], 'open-field', 20, 23, 'pat-sicilia'),
  // "Le olive nere vengono raccolte nei mesi di novembre e dicembre"
  w('oliva-buccheri', ['sr'], 'open-field', 20, 23, 'pat-sicilia'),
  // "La raccolta ... interessa il periodo che va dal 20 maggio fino ai primi di
  //  luglio"
  w('ovaletto-calatafimi', ['tp'], 'open-field', 9, 12, 'pat-sicilia'),
  // "La maturazione avviene dalla seconda quindicina di luglio a tutto agosto"
  w('pera-butirra', ['ct'], 'open-field', 13, 15, 'pat-sicilia'),
  // "Il frutto viene raccolto non completamente maturo tra settembre ed ottobre"
  w('pera-virgolosa', ['ct'], 'open-field', 16, 19, 'pat-sicilia'),

  // ── Lazio, ARSIAL guide 2019 ────────────────────────────────────────────
  // "La raccolta si esegue manualmente verso la fine di giugno, inizio luglio"
  w('aglio-proceno', ['vt'], 'open-field', 11, 12, 'pat-lazio'),
  // "La raccolta ... inizia da fine febbraio, nel comune di Fondi e si protrae
  //  fino alla fine di luglio-agosto, nelle località di Suio, nel Comune di
  //  Castelforte" — thirteen half-months, and wide because the zone is.
  w('arancio-fondi', ['lt'], 'open-field', 3, 15, 'pat-lazio'),
  // "I turioni si raccolgono a mano dall'ultima decade di marzo fino all'inizio
  //  di maggio"
  w('asparago-acque-albule', ['rm'], 'open-field', 5, 8, 'pat-lazio'),
  // "Si semina in agosto ed è raccolto fra gennaio e febbraio"
  w('broccoletto-sezze', ['lt'], 'open-field', 0, 3, 'pat-lazio'),
  // "Si impiantano i carducci da agosto a fine ottobre e si raccolgono i
  //  carciofi a marzo-aprile"
  w('carciofo-sezze', ['lt'], 'open-field', 4, 7, 'pat-lazio'),
  // "La raccolta delle castagne avviene manualmente, dalla metà di settembre
  //  alla fine di ottobre"
  w('castagna-terelle', ['fr'], 'open-field', 16, 19, 'pat-lazio'),
  // "La raccolta avviene tra la fine di luglio e i primi di agosto, quando le
  //  foglie si ingialliscono"
  w('cipolla-nepi', ['vt'], 'open-field', 13, 14, 'pat-lazio'),
  // "La raccolta, operazione colturale delicatissima, avviene da maggio a
  //  settembre"
  w('cocomero-pontino', ['lt'], 'open-field', 8, 17, 'pat-lazio'),
  // "L'epoca di raccolta inizia il 1 novembre e si protrae fino al 15 maggio"
  w('finocchio-maremma', ['vt'], 'open-field', 20, 8, 'pat-lazio'),
  // "La raccolta si effettua esclusivamente a mano ogni 4-5 giorni, nel periodo
  //  che va dai primi di maggio fino ad ottobre"
  w('fragolina-nemi', ['rm'], 'open-field', 8, 19, 'pat-lazio'),
  // "I frutti, raccolti tra la metà del mese di settembre e la metà di novembre"
  w('marrone-antrodocano', ['ri'], 'open-field', 16, 20, 'pat-lazio'),
  // "La raccolta, eseguita tra il 15 settembre ed il 15 novembre di ogni anno"
  //  — the scheda also says, of its three cultivars, "La raccolta, infatti,
  //  avviene da settembre a novembre".
  w('marrone-cimini', ['vt'], 'open-field', 16, 20, 'pat-lazio'),
  // "La raccolta dei marroni avviene manualmente per tutto il mese di ottobre"
  w('marrone-latera', ['vt'], 'open-field', 18, 19, 'pat-lazio'),
  // "La raccolta dei Marroni viene eseguita manualmente per tutto il mese di
  //  ottobre"
  w('marrone-segnino', ['rm'], 'open-field', 18, 19, 'pat-lazio'),
  // "La raccolta semi-meccanica si effettua a fine settembre inizio ottobre"
  w('patata-leonessa', ['ri'], 'open-field', 17, 18, 'pat-lazio'),
  // "La raccolta in serra avviene a maggio–giugno; in pieno campo, il Pomodoro
  //  fiaschetta raccoglie a luglio" — one scheda, two environments, two rows,
  //  cited once, on the Finocchio di Isola Capo Rizzuto precedent.
  w('pomodoro-fiaschetta', ['lt'], 'greenhouse', 8, 11, 'pat-lazio'),
  w('pomodoro-fiaschetta', ['lt'], 'open-field', 12, 13, 'pat-lazio'),
  // "La raccolta scalare si effettua esclusivamente a mano, dalla seconda metà
  //  di luglio fino al mese di settembre"
  w('pomodoro-scatolone', ['vt'], 'open-field', 13, 17, 'pat-lazio'),
  // "La raccolta si effettua da giugno ad agosto"
  w('pomodoro-spagnoletta', ['lt'], 'open-field', 10, 15, 'pat-lazio'),
  // "L'epoca di raccolta, effettuata a mano ricade nella 1° decade di agosto" /
  //  "La Prugna pizzutella di Picinisco, raccolta nel mese di agosto"
  w('prugna-picinisco', ['fr'], 'open-field', 14, 15, 'pat-lazio'),
  // "le infiorescenze che, appena formate dopo i primi freddi, vengono raccolte
  //  da dicembre fino a marzo"
  w('rapa-catalogna-roccasecca', ['fr'], 'open-field', 22, 5, 'pat-lazio'),
  // "la raccolta avviene, a mano, a partire dal mese di novembre fino a
  //  dicembre–gennaio"
  w('sarzefine-zagarolo', ['rm'], 'open-field', 20, 1, 'pat-lazio'),

  // Union of the three cherry designations, all of which state 1 May - 31 July
  // despite sitting 450 km apart in Campania, Toscana and Emilia-Romagna.
  g(
    'cherry-generic',
    ['ar', 'bn', 'ce', 'fc', 'fe', 'fi', 'gr', 'li', 'lu', 'ms', 'pc', 'po', 'pr', 'pt', 'ra', 're', 'rn', 'si'],
    8,
    13,
    ['ciliegia-bracigliano', 'ciliegia-lari', 'ciliegia-vignola'],
  ),
  // Union of the six chestnut designations, which run from Cuneo to Salerno and
  // vary by a single half-month between them.
  // Nine chestnut designations now state a window; this row cites eight. Farina
  // di Castagne della Lunigiana is left out on purpose: at 16→22 it is the only
  // one reaching the second half of December, so including it would widen the
  // union to 16→22 and drop leave-one-out to 8/9 — the exact failure that keeps
  // peach, potato, artichoke and asparagus out of this tier. Massa-Carrara is
  // not denied anything by that: it answers from Lunigiana's own documented row.
  g(
    'chestnut-generic',
    // Frosinone, Rieti and Roma dropped out when Terelle, Antrodoco and Segni
    // gave them a chestnut row of their own — the Torino precedent, three times.
    ['al', 'at', 'bi', 'bl', 'fi', 'li', 'lt', 'no', 'pd', 'pi', 'po', 'pt', 'ro', 'vb', 'vc', 've', 'vi', 'vr'],
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
      'farina-neccio',
    ],
  ),

  // "La raccolta per la varieta' Navelina inizia il 1° novembre e termina alla
  //  fine di febbraio; mentre per le varieta' Brasiliano e Washington navel
  //  inizia nella prima decade di dicembre e termina alla fine di maggio"
  // "15 aprile - fine agosto per il Biondo Comune del Gargano; 1 dicembre -
  //  30 aprile per la Duretta del Gargano" — the union of the two cultivars,
  //  which overlap in the second half of April, so it is one run and not two.
  //  18 half-months: the widest row here, and wide because Gargano citrus is.
  w('arancia-gargano', ['fg'], 'open-field', 22, 15, 'arancia-gargano'),
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
  // "La raccolta è manuale e si effettua da inizio settembre a metà novembre
  //  secondo la maturazione fisiologica dei frutti" — both schede say it word
  //  for word. "metà novembre" is the first half of the month, so the window
  //  ends at 20 and not at 21; the sweep that staged these rows had 21.
  //  Zone: "intero territorio della Regione Autonoma Valle d'Aosta".
  w('golden-valle-aosta', ['ao'], 'open-field', 16, 20, 'golden-valle-aosta'),
  w('renetta-valle-aosta', ['ao'], 'open-field', 16, 20, 'renetta-valle-aosta'),
  // ── Vegetables ───────────────────────────────────────────────────────────
  // "L'estirpazione dell'Aglio di Voghiera avviene dal 10 giugno sino al 31
  //  luglio"
  w('aglio-voghiera', ['fe'], 'open-field', 10, 13, 'aglio-voghiera'),
  // "tra il primo febbraio e il 30 giugno di ogni anno"
  w('asparago-badoere', ['pd', 'tv', 've'], 'open-field', 2, 11, 'asparago-badoere'),
  // "Il periodo di raccolta deve essere compreso tra il 1 marzo ed il 15 giugno"
  w('asparago-bassano', ['vi'], 'open-field', 4, 10, 'asparago-bassano'),
  // "Le produzioni in coltura forzata o protetta (tunnel) possono essere
  //  raccolte prima della suddetta data e comunque non prima del 1 febbraio" —
  //  the sentence after the one above, and the only greenhouse window in the
  //  corpus. Same document, cited once, on the Finocchio di Isola Capo Rizzuto
  //  precedent: one disciplinare, two windows, two kinds.
  w('asparago-bassano', ['vi'], 'greenhouse', 2, 3, 'asparago-bassano'),
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
  // Art. 3, "Zone ed epoca di produzione": "Le produzioni sono realizzabili
  //  durante tutto l'arco dell'anno" — and, of the two environments the
  //  disciplinare allows, only the protected one is given a year of its own:
  //  "In ambiente protetto la coltivazione puo' essere svolta tutto l'anno".
  //  So the row is greenhouse, and it is the whole year because the document
  //  says so rather than because nothing narrower could be found. Liguria's
  //  four provinces all hold Tyrrhenian-slope territory; the zone is the whole
  //  of that slope, cut at the watershed.
  w('basilico-genovese', ['ge', 'im', 'sp', 'sv'], 'greenhouse', 0, 23, 'basilico-genovese'),
  // "La raccolta delle rape deve iniziare a partire dal 1 settembre e quando le
  //  foglie basali della rapa ingialliscono e appassiscono e deve concludersi
  //  entro il 31 dicembre" — the turnip harvest, which is the only thing here
  //  that is picked. The designation protects the fermented product made from
  //  it, and that product's own dates are a sale window ("l'immissione al
  //  consumo e ammessa a partire dal 26 di settembre e deve concludersi il 15
  //  maggio"), which answers a different question and is not shipped.
  w('brovada', ['go', 'pn', 'ud'], 'open-field', 16, 23, 'brovada'),
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
  // "L'epoca di raccolta va da maggio a novembre"
  w('fagiolo-cuneo', ['cn'], 'open-field', 8, 21, 'fagiolo-cuneo'),
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
