/**
 * The catalogue: 34 protected designations whose own disciplinare states when
 * they are picked.
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

const veg = (id: string, name: string, designation: 'DOP' | 'IGP', en: string, it: string): Produce =>
  ({ id, name, designation, category: 'vegetable', en, it });

export const produce: readonly Produce[] = [
  // ── Fruit ────────────────────────────────────────────────────────────────
  fruit('castagna-cuneo', 'Castagna Cuneo', 'IGP', 'chestnut', 'castagna'),
  fruit('castagna-monte-amiata', 'Castagna del Monte Amiata', 'IGP', 'chestnut', 'castagna'),
  fruit('castagna-vallerano', 'Castagna di Vallerano', 'DOP', 'chestnut', 'castagna'),
  fruit('cedro-santa-maria', 'Cedro di Santa Maria del Cedro', 'DOP', 'citron', 'cedro'),
  fruit('ciliegia-bracigliano', 'Ciliegia di Bracigliano', 'IGP', 'cherry', 'ciliegia'),
  fruit('ciliegia-lari', 'Ciliegia di Lari', 'IGP', 'cherry', 'ciliegia'),
  fruit('ciliegia-vignola', 'Ciliegia di Vignola', 'IGP', 'cherry', 'ciliegia'),
  fruit('fichi-cosenza', 'Fichi di Cosenza', 'DOP', 'fig', 'fico'),
  fruit('ficodindia-etna', "Ficodindia dell'Etna", 'DOP', 'prickly pear', 'ficodindia'),
  fruit('ficodindia-san-cono', 'Ficodindia di San Cono', 'DOP', 'prickly pear', 'ficodindia'),
  fruit('fragola-basilicata', 'Fragola della Basilicata', 'IGP', 'strawberry', 'fragola'),
  fruit('kiwi-latina', 'Kiwi Latina', 'IGP', 'kiwi', 'kiwi'),
  fruit('limone-costa-amalfi', "Limone Costa d'Amalfi", 'IGP', 'lemon', 'limone'),
  fruit('limone-interdonato', 'Limone Interdonato Messina', 'IGP', 'lemon', 'limone'),
  fruit('marrone-combai', 'Marrone di Combai', 'IGP', 'chestnut', 'castagna'),
  fruit('marrone-serino', 'Marrone di Serino', 'IGP', 'chestnut', 'castagna'),
  fruit('marroni-monfenera', 'Marroni del Monfenera', 'IGP', 'chestnut', 'castagna'),
  fruit('mela-rossa-cuneo', 'Mela Rossa Cuneo', 'IGP', 'apple', 'mela'),
  fruit('mela-val-di-non', 'Mela Val di Non', 'DOP', 'apple', 'mela'),
  fruit('oliva-ascolana', 'Oliva Ascolana del Piceno', 'DOP', 'olive', 'oliva'),
  fruit('pera-emilia-romagna', "Pera dell'Emilia Romagna", 'IGP', 'pear', 'pera'),
  fruit('pesca-delia', 'Pesca di Delia', 'IGP', 'peach', 'pesca'),
  fruit('pesca-leonforte', 'Pesca di Leonforte', 'IGP', 'peach', 'pesca'),
  fruit('pescabivona', 'Pescabivona', 'IGP', 'peach', 'pesca'),
  fruit('susina-dro', 'Susina di Dro', 'DOP', 'plum', 'susina'),
  // ── Vegetables ───────────────────────────────────────────────────────────
  veg('aglio-voghiera', 'Aglio di Voghiera', 'DOP', 'garlic', 'aglio'),
  veg('asparago-badoere', 'Asparago di Badoere', 'IGP', 'asparagus', 'asparago'),
  veg('asparago-bassano', 'Asparago Bianco di Bassano', 'DOP', 'asparagus', 'asparago'),
  veg('asparago-canino', 'Asparago Verde di Canino', 'IGP', 'asparagus', 'asparago'),
  veg('asparago-cantello', 'Asparago di Cantello', 'IGP', 'asparagus', 'asparago'),
  veg('asparago-cimadolmo', 'Asparago Bianco di Cimadolmo', 'IGP', 'asparagus', 'asparago'),
  veg('cappero-eolie', 'Cappero delle Isole Eolie', 'DOP', 'caper', 'cappero'),
  veg('cappero-pantelleria', 'Cappero di Pantelleria', 'IGP', 'caper', 'cappero'),
  veg('carciofo-brindisino', 'Carciofo Brindisino', 'IGP', 'artichoke', 'carciofo'),
  veg('carciofo-paestum', 'Carciofo di Paestum', 'IGP', 'artichoke', 'carciofo'),
  veg('carciofo-romanesco', 'Carciofo Romanesco del Lazio', 'IGP', 'artichoke', 'carciofo'),
  veg('carciofo-sardegna', 'Carciofo Spinoso di Sardegna', 'DOP', 'artichoke', 'carciofo'),
  veg('carota-ispica', 'Carota Novella di Ispica', 'IGP', 'carrot', 'carota'),
  veg('fagioli-rotonda', 'Fagioli Bianchi di Rotonda', 'DOP', 'bean', 'fagiolo'),
  veg('fagiolo-atina', 'Fagiolo Cannellino di Atina', 'DOP', 'bean', 'fagiolo'),
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
];
