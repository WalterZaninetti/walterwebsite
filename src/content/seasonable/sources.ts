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

/**
 * An EU document: a registration, or a notice of an approved amendment, in the
 * Official Journal. Always dated; the URL is a permanent CELEX reference.
 */
const oj = (id: string, name: string, url: string, year: number): Source => ({
  id,
  name,
  url,
  year,
  accessed: '2026-09-03',
});

/**
 * The ministry's consolidated disciplinare — the text actually in force.
 *
 * These carry **no date anywhere in them**, which is why `Source.year` is
 * optional. They are used where nothing dated states the window: the EU's
 * single document is a summary that usually drops the harvest clause
 * altogether, and an amendment moves one endpoint without restating the other.
 * For most designations the ministry's consolidated text is the only document
 * that states a whole window *and* is current. The reader is shown the date it
 * was consulted in place of a year.
 */
const masaf = (id: string, name: string, url: string): Source => ({
  id,
  name,
  url,
  accessed: '2026-09-03',
});

export const sources: readonly Source[] = [
  // ── Fruit ────────────────────────────────────────────────────────────────
  src('castagna-cuneo', 'Castagna Cuneo IGP — Modifiche disciplinare di produzione 2023', `${D}/castagna-cuneo-igp-modifiche-disciplinare-di-produzione-2023.html`, 2023),
  src('castagna-monte-amiata', 'Castagna del Monte Amiata IGP — Domanda di modifica del disciplinare 2026', `${D}/castagna-del-monte-amiata-igp-domanda-di-modifica-del-disciplinare-2026.html`, 2026),
  src('castagna-vallerano', 'Castagna di Vallerano DOP', `${D}/castagna-di-vallerano-dop-disciplinare-di-produzione.html`, 2020),
  masaf('cedro-santa-maria', 'Disciplinare di produzione della denominazione di origine protetta D.O.P. “Cedro di Santa Maria del Cedro”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F4%252Fb%252FD.f7eaf9cffb8660ca7c32/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  src('ciliegia-bracigliano', 'Ciliegia di Bracigliano IGP — Modifica del disciplinare di produzione', `${D}/ciliegia-di-bracigliano-igp-modifica-del-disciplinare-di-produzione-2025.html`, 2025),
  src('ciliegia-lari', 'Ciliegia di Lari IGP — Approvazione della modifica ordinaria al disciplinare di produzione', `${D}/ciliegia-di-lari-igp-approvazione-della-modifica-ordinaria-al-disciplinare-di-produzione-2025.html`, 2025),
  src('ciliegia-vignola', 'Ciliegia di Vignola IGP — Proposta di modifica del disciplinare di produzione', `${D}/ciliegia-di-vignola-igp-proposta-di-modifica-del-disciplinare-di-produzione-2025.html`, 2025),
  src('fichi-cosenza', 'Fichi di Cosenza DOP', `${D}/fichi-di-cosenza-dop-disciplinare-di-produzione.html`, 2008),
  oj('ficodindia-etna', 'Pubblicazione di una domanda di registrazione — «Ficodindia dell’Etna» DOP, Gazzetta ufficiale dell’Unione europea C 275', 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:52002XC1112(02)', 2002),
  masaf('ficodindia-san-cono', 'Disciplinare della Denominazione d’Origine Protetta “Ficodindia di San Cono”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/f%252F9%252F6%252FD.09f1520ed1792692982a/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  src('fragola-basilicata', 'Fragola della Basilicata IGP — Domanda di registrazione e disciplinare di produzione', `${D}/fragola-della-basilicata-igp-domanda-di-registrazione-e-disciplinare-di-produzione.html`, 2024),
  oj('kiwi-latina', 'Pubblicazione di una domanda di modifica — «Kiwi Latina» IGP, Gazzetta ufficiale dell’Unione europea C 262', 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:52003XC1031(02)', 2003),
  masaf('limone-costa-amalfi', "Disciplinare di produzione dell'indicazione geografica protetta “Limone Costa d'Amalfi”", 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/e%252Fc%252F6%252FD.040c59d2b84cb61db00c/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  src('limone-interdonato', 'Limone Interdonato Messina IGP — modifica disciplinare', `${D}/limone-interdonato-messina-igp-modifica-disciplinare.html`, 2017),
  masaf('marrone-combai', 'Disciplinare di produzione della indicazione geografica protetta Marrone di Combai', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/2%252F5%252F7%252FD.e055e9c4d06d668548f6/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('marrone-serino', 'Disciplinare di Produzione Indicazione geografica Protetta “Marrone di Serino”/“Castagna di Serino”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/5%252Fb%252F0%252FD.96be126509da655c61fc/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  src('marroni-monfenera', 'Marroni del Monfenera IGP', `${D}/marroni-del-monfenera-igp-disciplinare-di-produzione.html`, 2009),
  src('mela-rossa-cuneo', 'Mela Rossa Cuneo IGP — Modifiche disciplinare di produzione 2023', `${D}/mela-rossa-cuneo-igp-modifiche-disciplinare-di-produzione-2023.html`, 2023),
  masaf('mela-val-di-non', 'Disciplinare di Produzione della Denominazione di Origine Protetta “MELA VAL DI NON”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F7%252F9%252FD.7cc9e4bd412b9a66287c/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  src('mela-valtellina', 'Mela di Valtellina IGP — Disciplinare di produzione', `${D}/mela-di-valtellina-igp-disciplinare-di-produzione.html`, 2006),
  masaf('oliva-ascolana', 'Disciplinare di produzione «Oliva Ascolana del Piceno» DOP', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252Fd%252F7%252FD.e59d369ae7d2247560ef/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('pera-emilia-romagna', "Disciplinare di produzione della indicazione geografica protetta \"PERA DELL'EMILIA ROMAGNA\"", 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/8%252Ff%252F5%252FD.7c1dba6ba4d190a8fbf3/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  src('pesca-delia', 'Pesca di Delia IGP', `${D}/pesca-di-delia-igp-disciplinare-di-produzione.html`, 2021),
  src('pesca-leonforte', 'Pesca di Leonforte IGP — Approvazione della modifica ordinaria al disciplinare', `${D}/pesca-di-leonforte-igp-approvazione-della-modifica-ordinaria-al-disciplinare-di-produzione-2024.html`, 2024),
  masaf('pescabivona', 'Indicazione geografica protetta (IGP) “Pescabivona” — Disciplinare di produzione', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/c%252Fb%252F0%252FD.49f8eb793a2b49e750e2/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  src('susina-dro', 'Susina di Dro DOP', `${D}/susina-di-dro-dop-disciplinare-di-produzione.html`, 2009),
  // ── Vegetables ───────────────────────────────────────────────────────────
  masaf('aglio-voghiera', 'Disciplinare di produzione della denominazione di origine protetta “AGLIO DI VOGHIERA”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/3%252F3%252F7%252FD.e771ec79985bf81f1a97/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  src('asparago-badoere', 'Asparago di Badoere IGP — Modifiche ordinarie al disciplinare di produzione', `${D}/asparago-di-badoere-igp-modifiche-ordinarie-al-disciplinare-di-produzione-2023.html`, 2023),
  src('asparago-bassano', 'Disciplinare di produzione Asparago Bianco di Bassano DOP', `${D}/asparago-bianco-di-bassano-dop.html`, 2006),
  src('asparago-canino', 'Asparago verde di Canino IGP', `${D}/asparago-verde-di-canino-igp-disciplinare-di-produzione.html`, 2023),
  src('asparago-cantello', 'Asparago di Cantello IGP', `${D}/asparago-di-cantello-igp-disciplinare-di-produzione-2023.html`, 2023),
  src('asparago-cimadolmo', 'Asparago bianco di Cimadolmo IGP', `${D}/asparago-bianco-di-cimadolmo-igp.html`, 2001),
  masaf('cappero-eolie', 'Disciplinare di produzione della denominazione di origine protetta D.O.P. “Cappero delle Isole Eolie”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/2%252Fd%252Fa%252FD.a13f1ee77219816e9575/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('cappero-pantelleria', 'Disciplinare di produzione della indicazione geografica protetta “Cappero di Pantelleria”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/f%252F2%252F3%252FD.6d29fd47d84b453e2089/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('carciofo-brindisino', 'Disciplinare di produzione della indicazione geografica protetta «Carciofo Brindisino»', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/4%252F2%252F2%252FD.7a1c0ed72668b8dab749/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  src('carciofo-paestum', 'Carciofo di Paestum IGP', `${D}/carciofo-di-paestum-igp-disciplinare-di-produzione.html`, 2004),
  src('carciofo-romanesco', 'Disciplinare di produzione del Carciofo Romanesco del Lazio IGP', `${D}/carciofo-romanesco-del-lazio-igp.html`, 2002),
  masaf('carciofo-sardegna', 'Disciplinare di Produzione della Denominazione di Origine Protetta “Carciofo Spinoso di Sardegna”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/0%252F0%252Fd%252FD.cdad71c75174ff320329/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  src('carota-ispica', 'Carota Novella di Ispica IGP — Modifica del disciplinare 2022', `${D}/carota-novella-di-ispica-igp-modifica-del-disciplinare-2022.html`, 2022),
  masaf('fagioli-rotonda', "Disciplinare di produzione della denominazione d'origine protetta «Fagioli bianchi di rotonda»", 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F1%252F2%252FD.390a94581a72babb4d5a/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('fagiolo-atina', 'Disciplinare di produzione Denominazione di Origine Protetta “Fagiolo Cannellino di Atina”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/b%252F8%252F3%252FD.9c34647f05099874c97d/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  src(
    'finocchio-capo-rizzuto',
    "Comunicazione dell'approvazione di una modifica ordinaria di un disciplinare di produzione — «Finocchio di Isola Capo Rizzuto»",
    'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=OJ:C_202300557',
    2023,
  ),
  src('melanzana-rotonda', 'Melanzana Rossa di Rotonda DOP — Disciplinare di produzione', `${D}/melanzana-rossa-di-rotonda-disciplinare-di-produzione.html`, 2022),
  masaf('fungo-borgotaro', 'Disciplinare di produzione della Indicazione Geografica Protetta “Fungo di Borgotaro”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/c%252Ff%252F5%252FD.3e216adbdd44ae0af289/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('lenticchia-onano', 'Disciplinare di produzione Indicazione Geografica Protetta “Lenticchia di Onano”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252Fc%252F9%252FD.21d5432131a852cb86c2/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('patata-alto-viterbese', 'Disciplinare di produzione “Patata dell’Alto Viterbese”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/8%252Fc%252F7%252FD.59c2b0ed6cf7a3e6a36b/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('patata-colfiorito', 'Disciplinare di produzione della indicazione geografica protetta della “Patata Rossa di Colfiorito”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/9%252Fc%252Ff%252FD.0b1255d221c68a0db419/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  src('patata-fucino', 'Patata del Fucino IGP', `${D}/patata-del-fucino-igp-disciplinare-di-produzione-2020.html`, 2020),
  src('patata-galatina', 'Patata novella di Galatina DOP — Proposta di riconoscimento', `${D}/patata-novella-di-galatina-dop-proposta-di-riconoscimento.html`, 2013),
  src('patata-sila', 'Patata della Sila IGP', `${D}/patata-della-sila-igp-disciplinare-di-produzione-2024.html`, 2024),
  masaf('peperoncino-calabria', 'Disciplinare di produzione indicazione geografica protetta «Peperoncino di Calabria»', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F9%252F7%252FD.3b1bdc676f6ca351379c/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('peperone-pontecorvo', 'Disciplinare di produzione della Denominazione Origine Protetta “PEPERONE DI PONTECORVO”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/2%252F0%252F5%252FD.386ecf72ee406fa56e1b/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  src('piennolo-vesuvio', 'Pomodorino del Piennolo del Vesuvio — Proposta di riconoscimento', `${D}/pomodorino-del-piennolo-del-vesuvio-proposta-di-riconoscimento-2006.html`, 2006),
  masaf('radicchio-chioggia', 'Disciplinare Radicchio di Chioggia IGP', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/5%252F4%252Fe%252FD.4c50e2e0a42910032712/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  src('san-marzano', "Pomodoro San Marzano dell'Agro Sarnese-Nocerino DOP — Modifica disciplinare", `${D}/pomodoro-san-marzano-dellagro-sarnese-nocerino-dop-modifica-disciplinare-di-produzione-2019.html`, 2019),
];
