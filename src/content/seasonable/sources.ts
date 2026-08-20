/**
 * Where every date on this page comes from.
 *
 * Every source below is one document: a DOP or IGP disciplinare di produzione,
 * with the title it gives itself, the year it was published, and a URL that
 * resolves to its text. Nothing here is an organisation's homepage, and nothing
 * is a body's name standing in for a publication it never wrote.
 *
 * Why disciplinari and not agricultural calendars: they are the only Italian
 * documents that state a harvest window *and* the exact comuni it applies to.
 * Regional disciplinari di produzione integrata were the obvious candidate and
 * turned out to carry no dates at all — they regulate how a crop is grown, not
 * when it is picked. CREA publishes no seasonality calendar. The ministry's own
 * national calendar is a dead link. `.pipeline/seasonable/sources-ledger.md`
 * records all of that, so nobody re-checks it.
 *
 * `name` is the document's own title, verbatim, including the word "proposta"
 * where the document is a proposed modification rather than a settled one. The
 * reader can then see exactly what they are being pointed at.
 */

import type { Source } from '../../lib/seasonable';

const src = (id: string, name: string, url: string, year: number): Source => ({
  id,
  name,
  url,
  year,
  // Every document below was opened and read on this date.
  accessed: '2026-08-20',
});

const D = 'https://www.disciplinare.it';

export const sources: readonly Source[] = [
  // ── Fruit ────────────────────────────────────────────────────────────────
  src('albicocca-vesuviana', 'Albicocca Vesuviana — Domanda di registrazione e pubblicazione del disciplinare di produzione', `${D}/albicocca-vesuviana-dop-domanda-di-registrazione-e-pubblicazione-del-disciplinare-di-produzione.html`, 2026),
  src('castagna-cuneo', 'Castagna Cuneo IGP — Modifiche disciplinare di produzione 2023', `${D}/castagna-cuneo-igp-modifiche-disciplinare-di-produzione-2023.html`, 2023),
  src('castagna-monte-amiata', 'Castagna del Monte Amiata IGP — Domanda di modifica del disciplinare 2026', `${D}/castagna-del-monte-amiata-igp-domanda-di-modifica-del-disciplinare-2026.html`, 2026),
  src('castagna-vallerano', 'Castagna di Vallerano DOP', `${D}/castagna-di-vallerano-dop-disciplinare-di-produzione.html`, 2020),
  src('ciliegia-bracigliano', 'Ciliegia di Bracigliano IGP — Modifica del disciplinare di produzione', `${D}/ciliegia-di-bracigliano-igp-modifica-del-disciplinare-di-produzione-2025.html`, 2025),
  src('ciliegia-lari', 'Ciliegia di Lari IGP — Approvazione della modifica ordinaria al disciplinare di produzione', `${D}/ciliegia-di-lari-igp-approvazione-della-modifica-ordinaria-al-disciplinare-di-produzione-2025.html`, 2025),
  src('ciliegia-vignola', 'Ciliegia di Vignola IGP — Proposta di modifica del disciplinare di produzione', `${D}/ciliegia-di-vignola-igp-proposta-di-modifica-del-disciplinare-di-produzione-2025.html`, 2025),
  src('fichi-cosenza', 'Fichi di Cosenza DOP', `${D}/fichi-di-cosenza-dop-disciplinare-di-produzione.html`, 2008),
  src('fragola-basilicata', 'Fragola della Basilicata IGP — Domanda di registrazione e disciplinare di produzione', `${D}/fragola-della-basilicata-igp-domanda-di-registrazione-e-disciplinare-di-produzione.html`, 2024),
  src('limone-interdonato', 'Limone Interdonato Messina IGP — modifica disciplinare', `${D}/limone-interdonato-messina-igp-modifica-disciplinare.html`, 2017),
  src('limone-sorrento', 'Limone di Sorrento IGP', `${D}/limone-di-sorrento-ipg.html`, 2001),
  src('marroni-monfenera', 'Marroni del Monfenera IGP', `${D}/marroni-del-monfenera-igp-disciplinare-di-produzione.html`, 2009),
  src('mela-rossa-cuneo', 'Mela Rossa Cuneo IGP — Modifiche disciplinare di produzione 2023', `${D}/mela-rossa-cuneo-igp-modifiche-disciplinare-di-produzione-2023.html`, 2023),
  src('mela-valtellina', 'Mela di Valtellina IGP — Disciplinare di produzione', `${D}/mela-di-valtellina-igp-disciplinare-di-produzione.html`, 2006),
  src('pesca-delia', 'Pesca di Delia IGP', `${D}/pesca-di-delia-igp-disciplinare-di-produzione.html`, 2021),
  src('pesca-leonforte', 'Pesca di Leonforte IGP — Approvazione della modifica ordinaria al disciplinare', `${D}/pesca-di-leonforte-igp-approvazione-della-modifica-ordinaria-al-disciplinare-di-produzione-2024.html`, 2024),
  src('susina-dro', 'Susina di Dro DOP', `${D}/susina-di-dro-dop-disciplinare-di-produzione.html`, 2009),

  // ── Vegetables ───────────────────────────────────────────────────────────
  src('aglio-polesano', 'Aglio Bianco Polesano DOP — Proposta modifica disciplinare di produzione', `${D}/aglio-bianco-polesano-dop-proposta-modifica-disciplinare-di-produzione-2013.html`, 2013),
  src('asparago-badoere', 'Asparago di Badoere IGP — Modifiche ordinarie al disciplinare di produzione', `${D}/asparago-di-badoere-igp-modifiche-ordinarie-al-disciplinare-di-produzione-2023.html`, 2023),
  src('asparago-bassano', 'Disciplinare di produzione Asparago Bianco di Bassano DOP', `${D}/asparago-bianco-di-bassano-dop.html`, 2006),
  src('asparago-canino', 'Asparago verde di Canino IGP', `${D}/asparago-verde-di-canino-igp-disciplinare-di-produzione.html`, 2023),
  src('asparago-cantello', 'Asparago di Cantello IGP', `${D}/asparago-di-cantello-igp-disciplinare-di-produzione-2023.html`, 2023),
  src('asparago-cimadolmo', 'Asparago bianco di Cimadolmo IGP', `${D}/asparago-bianco-di-cimadolmo-igp.html`, 2001),
  src('carciofo-paestum', 'Carciofo di Paestum IGP', `${D}/carciofo-di-paestum-igp-disciplinare-di-produzione.html`, 2004),
  src('carciofo-romanesco', 'Disciplinare di produzione del Carciofo Romanesco del Lazio IGP', `${D}/carciofo-romanesco-del-lazio-igp.html`, 2002),
  src('carota-ispica', 'Carota Novella di Ispica IGP — Modifica del disciplinare 2022', `${D}/carota-novella-di-ispica-igp-modifica-del-disciplinare-2022.html`, 2022),
  src('cicoria-molfettese', 'Cicoria puntarelle molfettese — Domanda di registrazione della IGP', `${D}/cicoria-puntarelle-molfettese-domanda-di-registrazione-della-igp.html`, 2025),
  src('finocchio-capo-rizzuto', 'Finocchio di Isola Capo Rizzuto IGP — Richiesta di riconoscimento', `${D}/finocchio-di-isola-capo-rizzuto-igp-richiesta-di-riconoscimento.html`, 2020),
  src('melanzana-rotonda', 'Melanzana Rossa di Rotonda DOP — Disciplinare di produzione', `${D}/melanzana-rossa-di-rotonda-disciplinare-di-produzione.html`, 2022),
  src('patata-fucino', 'Patata del Fucino IGP', `${D}/patata-del-fucino-igp-disciplinare-di-produzione-2020.html`, 2020),
  src('patata-galatina', 'Patata novella di Galatina DOP — Proposta di riconoscimento', `${D}/patata-novella-di-galatina-dop-proposta-di-riconoscimento.html`, 2013),
  src('patata-sila', 'Patata della Sila IGP', `${D}/patata-della-sila-igp-disciplinare-di-produzione-2024.html`, 2024),
  src('piennolo-vesuvio', 'Pomodorino del Piennolo del Vesuvio — Proposta di riconoscimento', `${D}/pomodorino-del-piennolo-del-vesuvio-proposta-di-riconoscimento-2006.html`, 2006),
  src('san-marzano', "Pomodoro San Marzano dell'Agro Sarnese-Nocerino DOP — Modifica disciplinare", `${D}/pomodoro-san-marzano-dellagro-sarnese-nocerino-dop-modifica-disciplinare-di-produzione-2019.html`, 2019),
];
