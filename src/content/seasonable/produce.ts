/**
 * The catalogue: 65 protected designations and 51 traditional products whose
 * own document states when they are picked.
 *
 * Why designations and not "apple, pear, orange". A disciplinare fixes the
 * harvest window for *its* product in *its* comuni. It is evidence about the
 * Carciofo di Paestum; it is not evidence about artichokes in Salerno, and
 * treating it as such would be the same borrowed authority this page exists to
 * refuse. So the row names what the document names.
 *
 * The catalogue is therefore short, and it is short in a specific way: a
 * designation is here only if its disciplinare states BOTH ends of a window.
 * A great many state only a start ("a partire dal 10 ottobre" for Radicchio
 * Rosso di Treviso) or only an end, and those are not windows. The ones that
 * were checked and dropped are listed in `.pipeline/seasonable/sources-ledger.md`
 * so the next pass does not re-check them.
 *
 * `en` and `it` are the kind of thing it is, used for grouping and for the
 * English reader. The designation itself is a proper noun and is not translated.
 */

import type { Produce } from '../../lib/seasonable';

const fruit = (id: string, name: string, designation: 'DOP' | 'IGP', en: string, it: string): Produce =>
  ({ id, name, designation, category: 'fruit', en, it });

/**
 * A species rather than a designation: no DOP or IGP, because nobody protects
 * "cherry". These exist only to carry the generalised tier, and `designation:
 * null` is what makes them render without a suffix.
 */
const species = (id: string, name: string, category: Produce['category'], en: string, it: string): Produce =>
  ({ id, name, designation: null, category, en, it });

const veg = (id: string, name: string, designation: 'DOP' | 'IGP', en: string, it: string): Produce =>
  ({ id, name, designation, category: 'vegetable', en, it });

/**
 * A *prodotto agroalimentare tradizionale*: on a Region's own list under
 * D.Lgs. 173/1998, with a scheda identificativa the Region publishes.
 *
 * Weaker than a DOP or an IGP, and the row says `PAT` so the reader can weigh
 * it. It is here because the protected-designation register ran out: it names
 * no product at all in Valle d'Aosta, and these two schede state a harvest
 * window for the whole region. `.pipeline/seasonable/enrich/` holds the sweep
 * that found them.
 */
const pat = (id: string, name: string, category: Produce['category'], en: string, it: string): Produce =>
  ({ id, name, designation: 'PAT', category, en, it });

export const produce: readonly Produce[] = [
  // ── Fruit ────────────────────────────────────────────────────────────────
  fruit('amarene-modena', 'Amarene Brusche di Modena', 'IGP', 'sour cherry', 'amarena'),
  fruit('castagna-cuneo', 'Castagna Cuneo', 'IGP', 'chestnut', 'castagna'),
  fruit('castagna-monte-amiata', 'Castagna del Monte Amiata', 'IGP', 'chestnut', 'castagna'),
  fruit('castagna-vallerano', 'Castagna di Vallerano', 'DOP', 'chestnut', 'castagna'),
  fruit('cedro-santa-maria', 'Cedro di Santa Maria del Cedro', 'DOP', 'citron', 'cedro'),
  fruit('ciliegia-bracigliano', 'Ciliegia di Bracigliano', 'IGP', 'cherry', 'ciliegia'),
  fruit('ciliegia-lari', 'Ciliegia di Lari', 'IGP', 'cherry', 'ciliegia'),
  fruit('ciliegia-vignola', 'Ciliegia di Vignola', 'IGP', 'cherry', 'ciliegia'),
  fruit('farina-lunigiana', 'Farina di Castagne della Lunigiana', 'DOP', 'chestnut', 'castagna'),
  fruit('farina-neccio', 'Farina di Neccio della Garfagnana', 'DOP', 'chestnut', 'castagna'),
  fruit('fichi-cosenza', 'Fichi di Cosenza', 'DOP', 'fig', 'fico'),
  fruit('ficodindia-etna', "Ficodindia dell'Etna", 'DOP', 'prickly pear', 'ficodindia'),
  fruit('ficodindia-san-cono', 'Ficodindia di San Cono', 'DOP', 'prickly pear', 'ficodindia'),
  fruit('fragola-basilicata', 'Fragola della Basilicata', 'IGP', 'strawberry', 'fragola'),
  fruit('kiwi-latina', 'Kiwi Latina', 'IGP', 'kiwi', 'kiwi'),
  fruit('limone-costa-amalfi', "Limone Costa d'Amalfi", 'IGP', 'lemon', 'limone'),
  fruit('limone-interdonato', 'Limone Interdonato Messina', 'IGP', 'lemon', 'limone'),
  fruit('limone-sorrento', 'Limone di Sorrento', 'IGP', 'lemon', 'limone'),
  fruit('marrone-combai', 'Marrone di Combai', 'IGP', 'chestnut', 'castagna'),
  fruit('marrone-serino', 'Marrone di Serino', 'IGP', 'chestnut', 'castagna'),
  fruit('marroni-monfenera', 'Marroni del Monfenera', 'IGP', 'chestnut', 'castagna'),
  fruit('marrone-valle-susa', 'Marrone della Valle di Susa', 'IGP', 'chestnut', 'castagna'),
  fruit('mela-rossa-cuneo', 'Mela Rossa Cuneo', 'IGP', 'apple', 'mela'),
  fruit('mele-trentino', 'Mele del Trentino', 'IGP', 'apple', 'mela'),
  // The only two products of any register in Valle d'Aosta, and both are apples.
  pat('golden-valle-aosta', "Golden delicious della Valle d'Aosta", 'fruit', 'apple', 'mela'),
  pat('renetta-valle-aosta', "Renetta della Valle d'Aosta", 'fruit', 'apple', 'mela'),
  fruit('mela-val-di-non', 'Mela Val di Non', 'DOP', 'apple', 'mela'),
  fruit('oliva-ascolana', 'Oliva Ascolana del Piceno', 'DOP', 'olive', 'oliva'),
  fruit('pera-emilia-romagna', "Pera dell'Emilia Romagna", 'IGP', 'pear', 'pera'),
  fruit('pesca-delia', 'Pesca di Delia', 'IGP', 'peach', 'pesca'),
  fruit('pesca-leonforte', 'Pesca di Leonforte', 'IGP', 'peach', 'pesca'),
  fruit('pescabivona', 'Pescabivona', 'IGP', 'peach', 'pesca'),
  fruit('susina-dro', 'Susina di Dro', 'DOP', 'plum', 'susina'),
  fruit('arancia-gargano', 'Arancia del Gargano', 'IGP', 'orange', 'arancia'),
  fruit('arancia-ribera', 'Arancia di Ribera', 'DOP', 'orange', 'arancia'),
  species('cherry-generic', 'Cherry', 'fruit', 'cherry', 'ciliegia'),
  species('chestnut-generic', 'Chestnut', 'fruit', 'chestnut', 'castagna'),

  // ── PAT: fruit from the regional registers ───────────────────────────────
  // Sicilia's schede, Lazio's ARSIAL guide, Friuli's Cibario, Sardegna's and
  // Marche's lists. A PAT is a lighter instrument than a DOP or an IGP and the
  // suffix says so; what it shares with a disciplinare is a published document
  // naming the territory and the picking.
  pat('albicocco-scillato', 'Albicocco di Scillato', 'fruit', 'apricot', 'albicocca'),
  pat('arancia-scillato', 'Arancia Biondo di Scillato', 'fruit', 'orange', 'arancia'),
  pat('arancio-fondi', 'Arancio Biondo di Fondi', 'fruit', 'orange', 'arancia'),
  pat('castagna-terelle', 'Castagna di Terelle', 'fruit', 'chestnut', 'castagna'),
  pat('ciliegia-barracocca', 'Ciliegia Barracocca di Villacidro', 'fruit', 'cherry', 'ciliegia'),
  pat('ciliegia-mastrantoni', 'Ciliegia Mastrantoni', 'fruit', 'cherry', 'ciliegia'),
  pat('ficodindia-valle-torto', 'Ficodindia della Valle del Torto', 'fruit', 'prickly pear', 'ficodindia'),
  pat('figo-moro', 'Figo moro da Caneva', 'fruit', 'fig', 'fico'),
  pat('fragola-maletto', 'Fragola di Maletto', 'fruit', 'strawberry', 'fragola'),
  pat('fragolina-nemi', 'Fragolina di Nemi', 'fruit', 'strawberry', 'fragola'),
  pat('fragolina-ribera', 'Fragolina di Ribera', 'fruit', 'strawberry', 'fragola'),
  pat('marrone-acquasanta', 'Marrone di Acquasanta Terme', 'fruit', 'chestnut', 'castagna'),
  pat('marrone-antrodocano', 'Marrone Antrodocano', 'fruit', 'chestnut', 'castagna'),
  pat('marrone-cimini', 'Marrone dei Monti Cimini', 'fruit', 'chestnut', 'castagna'),
  pat('marrone-latera', 'Marrone di Latera', 'fruit', 'chestnut', 'castagna'),
  pat('marrone-segnino', 'Marrone Segnino', 'fruit', 'chestnut', 'castagna'),
  pat('mele-cola', 'Mele Cola', 'fruit', 'apple', 'mela'),
  pat('oliva-buccheri', 'Oliva nera di Buccheri', 'fruit', 'olive', 'oliva'),
  pat('oliva-nebba', 'Oliva Nebba', 'fruit', 'olive', 'oliva'),
  pat('ovaletto-calatafimi', 'Ovaletto di Calatafimi', 'fruit', 'orange', 'arancia'),
  pat('pera-butirra', "Pere Butirra d'estate", 'fruit', 'pear', 'pera'),
  pat('pera-per-martin', 'Pera Pêr Martìn', 'fruit', 'pear', 'pera'),
  pat('pera-virgolosa', 'Pere Virgolosa', 'fruit', 'pear', 'pera'),
  pat('prugna-picinisco', 'Prugna Pizzutella di Picinisco', 'fruit', 'plum', 'prugna'),
  pat('visciole-sole', 'Visciole sciolte al sole', 'fruit', 'sour cherry', 'visciola'),

  // ── Vegetables ───────────────────────────────────────────────────────────
  veg('aglio-voghiera', 'Aglio di Voghiera', 'DOP', 'garlic', 'aglio'),
  veg('asparago-badoere', 'Asparago di Badoere', 'IGP', 'asparagus', 'asparago'),
  veg('asparago-bassano', 'Asparago Bianco di Bassano', 'DOP', 'asparagus', 'asparago'),
  veg('asparago-canino', 'Asparago Verde di Canino', 'IGP', 'asparagus', 'asparago'),
  veg('asparago-cantello', 'Asparago di Cantello', 'IGP', 'asparagus', 'asparago'),
  veg('asparago-cimadolmo', 'Asparago Bianco di Cimadolmo', 'IGP', 'asparagus', 'asparago'),
  veg('cappero-eolie', 'Cappero delle Isole Eolie', 'DOP', 'caper', 'cappero'),
  veg('cappero-pantelleria', 'Cappero di Pantelleria', 'IGP', 'caper', 'cappero'),
  veg('basilico-genovese', 'Basilico Genovese', 'DOP', 'basil', 'basilico'),
  veg('brovada', 'Brovada', 'DOP', 'turnip', 'rapa'),
  veg('carciofo-brindisino', 'Carciofo Brindisino', 'IGP', 'artichoke', 'carciofo'),
  veg('carciofo-paestum', 'Carciofo di Paestum', 'IGP', 'artichoke', 'carciofo'),
  veg('carciofo-romanesco', 'Carciofo Romanesco del Lazio', 'IGP', 'artichoke', 'carciofo'),
  veg('carciofo-sardegna', 'Carciofo Spinoso di Sardegna', 'DOP', 'artichoke', 'carciofo'),
  veg('carota-ispica', 'Carota Novella di Ispica', 'IGP', 'carrot', 'carota'),
  veg('fagioli-rotonda', 'Fagioli Bianchi di Rotonda', 'DOP', 'bean', 'fagiolo'),
  veg('fagiolo-atina', 'Fagiolo Cannellino di Atina', 'DOP', 'bean', 'fagiolo'),
  veg('fagiolo-cuneo', 'Fagiolo Cuneo', 'IGP', 'bean', 'fagiolo'),
  veg('finocchio-capo-rizzuto', 'Finocchio di Isola Capo Rizzuto', 'IGP', 'fennel', 'finocchio'),
  veg('fungo-borgotaro', 'Fungo di Borgotaro', 'IGP', 'mushroom', 'fungo'),
  veg('lenticchia-onano', 'Lenticchia di Onano', 'IGP', 'lentil', 'lenticchia'),
  veg('melanzana-rotonda', 'Melanzana Rossa di Rotonda', 'DOP', 'aubergine', 'melanzana'),
  veg('patata-alto-viterbese', "Patata dell'Alto Viterbese", 'IGP', 'potato', 'patata'),
  veg('patata-colfiorito', 'Patata Rossa di Colfiorito', 'IGP', 'potato', 'patata'),
  veg('patata-fucino', 'Patata del Fucino', 'IGP', 'potato', 'patata'),
  veg('patata-galatina', 'Patata Novella di Galatina', 'DOP', 'potato', 'patata'),
  veg('patata-sila', 'Patata della Sila', 'IGP', 'potato', 'patata'),
  veg('peperoncino-calabria', 'Peperoncino di Calabria', 'IGP', 'chilli', 'peperoncino'),
  veg('peperone-pontecorvo', 'Peperone di Pontecorvo', 'DOP', 'pepper', 'peperone'),
  veg('piennolo-vesuvio', 'Pomodorino del Piennolo del Vesuvio', 'DOP', 'tomato', 'pomodoro'),
  veg('radicchio-chioggia', 'Radicchio di Chioggia', 'IGP', 'chicory', 'radicchio'),
  veg('san-marzano', "Pomodoro San Marzano dell'Agro Sarnese-Nocerino", 'DOP', 'tomato', 'pomodoro'),

  // ── PAT: vegetables from the regional registers ──────────────────────────
  pat('aglio-nubia', 'Aglio rosso di Nubia', 'vegetable', 'garlic', 'aglio'),
  pat('aglio-proceno', 'Aglio rosso di Proceno', 'vegetable', 'garlic', 'aglio'),
  pat('asparago-acque-albule', 'Asparago delle Acque Albule', 'vegetable', 'asparagus', 'asparago'),
  pat('broccoletto-sezze', 'Broccoletto Sezzese', 'vegetable', 'chicory', 'broccoletto'),
  pat('cappero-selargius', 'Capperi e capperoni di Selargius', 'vegetable', 'caper', 'cappero'),
  pat('carciofo-monteluponese', 'Carciofo Monteluponese', 'vegetable', 'artichoke', 'carciofo'),
  pat('carciofo-sezze', 'Carciofo di Sezze', 'vegetable', 'artichoke', 'carciofo'),
  pat('cavolfiore-fano', 'Cavolfiore Tardivo di Fano', 'vegetable', 'cauliflower', 'cavolfiore'),
  pat('cavolfiore-jesi', 'Cavolfiore Precoce di Jesi', 'vegetable', 'cauliflower', 'cavolfiore'),
  pat('cipolla-gonnosfanadiga', 'Cipolla di Gonnosfanadiga', 'vegetable', 'onion', 'cipolla'),
  pat('cipolla-nepi', 'Cipolla di Nepi', 'vegetable', 'onion', 'cipolla'),
  pat('cipolla-rossa-sarda', 'Cipolla rossa', 'vegetable', 'onion', 'cipolla'),
  pat('cocomero-pontino', 'Cocomero Pontino', 'vegetable', 'watermelon', 'cocomero'),
  pat('fava-leonforte', 'Fava larga di Leonforte', 'vegetable', 'broad bean', 'fava'),
  pat('finocchio-maremma', 'Finocchio della Maremma Viterbese', 'vegetable', 'fennel', 'finocchio'),
  pat('patata-leonessa', 'Patata di Leonessa', 'vegetable', 'potato', 'patata'),
  pat('pomodoro-fiaschetta', 'Pomodoro Fiaschetta di Fondi', 'vegetable', 'tomato', 'pomodoro'),
  pat('pomodoro-scatolone', 'Pomodoro Scatolone di Bolsena', 'vegetable', 'tomato', 'pomodoro'),
  pat('pomodoro-spagnoletta', 'Pomodoro Spagnoletta del Golfo di Gaeta', 'vegetable', 'tomato', 'pomodoro'),
  pat('radicchio-canarino', 'Radicchio canarino', 'vegetable', 'chicory', 'radicchio'),
  pat('rapa-catalogna-roccasecca', 'Rapa Catalogna di Roccasecca', 'vegetable', 'chicory', 'catalogna'),
  pat('rosa-gorizia', 'Rosa di Gorizia', 'vegetable', 'chicory', 'radicchio'),
  pat('sarzefine-zagarolo', 'Sarzefine di Zagarolo', 'vegetable', 'salsify', 'scorzonera'),
  pat('taccole-marche', 'Taccole', 'vegetable', 'pea', 'taccola'),
];
