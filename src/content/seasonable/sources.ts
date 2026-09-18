/**
 * Where every date on this page comes from.
 *
 * Every source below is one document: a DOP or IGP disciplinare di produzione,
 * with the title it gives itself and a URL that resolves to its text. Nothing
 * here is an organisation's homepage, and nothing is a body's name standing in
 * for a publication it never wrote.
 *
 * Why disciplinari and not agricultural calendars: they are the only Italian
 * documents that state a harvest window *and* the exact comuni it applies to.
 * Regional disciplinari di produzione integrata were the obvious candidate and
 * turned out to carry no dates at all — they regulate how a crop is grown, not
 * when it is picked. CREA publishes no seasonality calendar. The ministry's own
 * national calendar is a dead link. `.pipeline/seasonable/sources-ledger.md`
 * records all of that, so nobody re-checks it.
 *
 * **Two publishers, and the choice between them is not a preference.** Where a
 * dated EU document states the whole window that ships, it wins: `oj()`, a
 * permanent CELEX reference with the Official Journal's date on it. Everywhere
 * else the citation is `masaf()`, the ministry's consolidated disciplinare —
 * the text actually in force, and undated, because these PDFs print no year
 * anywhere in them.
 *
 * That split exists because the EU's *documento unico* is a summary that
 * usually drops the harvest clause, and an amendment then moves one endpoint
 * without restating the other. For most designations the ministry's text is the
 * only document that states a whole window and is current at the same time.
 *
 * Nothing is cited to `disciplinare.it` any more. It is a commercial aggregator
 * rather than a publisher, every citation on the page used to depend on that one
 * host, and several of the copies it served were proposals rather than texts in
 * force.
 *
 * `name` is the document's own title, verbatim.
 */

import type { Source } from '../../lib/seasonable';

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
const masaf = (id: string, name: string, url: string, accessed = '2026-09-03'): Source => ({
  id,
  name,
  url,
  accessed,
});

/**
 * A Region's own publication of its prodotti agroalimentari tradizionali —
 * a *scheda identificativa* per product, or a volume collecting them.
 *
 * Dated where the volume prints a year (Marche's «aggiornamento 2017», ERSA's
 * «© ERSA 2017», ARSIAL's «finito di stampare nel mese di aprile 2019»), and
 * undated where it prints none, like the ministry's consolidated disciplinari
 * and for the same reason: the scheda prints the law that requires it and
 * nothing else. The reader is then shown the day it was consulted.
 *
 * A year is read off the document's own page, never off a filename or an
 * upload path — the sweep that found these proposed 2017 for Marche from its
 * URL and 2023 for Sicilia from its folder, and only one of those turned out
 * to be printed inside.
 *
 * Why a third publisher at all: the EU register names nothing in Valle
 * d'Aosta, so without these the region answers nothing. A PAT is a lighter
 * instrument than a disciplinare and the row's `PAT` suffix says so.
 */
const pat = (id: string, name: string, url: string, accessed: string, year?: number): Source => ({
  id,
  name,
  url,
  year,
  accessed,
});

export const sources: readonly Source[] = [
  // ── Fruit ────────────────────────────────────────────────────────────────
  masaf('amarene-modena', 'Disciplinare di produzione della indicazione geografica protetta “Amarene Brusche di Modena”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/5%252F1%252F0%252FD.8533281919a8f9b0524a/P/BLOB%3AID%3D3343/E/pdf?mode=download', '2026-09-05'),
  masaf('castagna-cuneo', 'Disciplinare di produzione della indicazione geografica protetta “Castagna Cuneo”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F3%252Fe%252FD.0743c8a0e0eabbb43b11/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('castagna-monte-amiata', 'Disciplinare di produzione della indicazione geografica protetta “Castagna del Monte Amiata”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F0%252F1%252FD.3aa8ccd180c82d52602a/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  oj('castagna-vallerano', 'Pubblicazione di una domanda di registrazione — «Castagna di Vallerano» DOP, Gazzetta ufficiale dell’Unione europea C 190', 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:52008XC0729(04)', 2008),
  masaf('cedro-santa-maria', 'Disciplinare di produzione della denominazione di origine protetta D.O.P. “Cedro di Santa Maria del Cedro”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F4%252Fb%252FD.f7eaf9cffb8660ca7c32/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('ciliegia-bracigliano', 'Disciplinare di produzione della indicazione geografica protetta “Ciliegia di Bracigliano”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F3%252F5%252FD.2b7b3e606aeccbd310b6/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('ciliegia-lari', 'Disciplinare di produzione della indicazione geografica protetta «Ciliegia di Lari»', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F9%252F8%252FD.b0d6832ccbc5d23891ec/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('ciliegia-vignola', 'Disciplinare di produzione della indicazione geografica protetta «Ciliegia di Vignola»', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252Fb%252F8%252FD.20a6b5f39b771b1b7f85/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('farina-lunigiana', 'Disciplinare di produzione della denominazione di origine protetta "Farina di Castagne della Lunigiana"', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252Fe%252F6%252FD.4ffd213e52f076a2f928/P/BLOB%3AID%3D3343/E/pdf?mode=download', '2026-09-05'),
  masaf('farina-neccio', 'Disciplinare di produzione della denominazione di origine protetta «Farina di Neccio della Garfagnana»', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F2%252Fd%252FD.1803d3ae399cea3dca95/P/BLOB%3AID%3D3343/E/pdf?mode=download', '2026-09-05'),
  masaf('fichi-cosenza', 'Disciplinare di produzione della denominazione di origine protetta “Fichi di Cosenza”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/a%252F5%252Ff%252FD.196c527dae1bee3c8cb1/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  oj('ficodindia-etna', 'Pubblicazione di una domanda di registrazione — «Ficodindia dell’Etna» DOP, Gazzetta ufficiale dell’Unione europea C 275', 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:52002XC1112(02)', 2002),
  masaf('ficodindia-san-cono', 'Disciplinare della Denominazione d’Origine Protetta “Ficodindia di San Cono”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/f%252F9%252F6%252FD.09f1520ed1792692982a/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('fragola-basilicata', 'Disciplinare di produzione della indicazione geografica protetta “Fragola della Basilicata”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252Fe%252Fb%252FD.009aefe88583310ef92b/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  oj('kiwi-latina', 'Pubblicazione di una domanda di modifica — «Kiwi Latina» IGP, Gazzetta ufficiale dell’Unione europea C 262', 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:52003XC1031(02)', 2003),
  masaf('limone-costa-amalfi', "Disciplinare di produzione dell'indicazione geografica protetta “Limone Costa d'Amalfi”", 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/e%252Fc%252F6%252FD.040c59d2b84cb61db00c/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  oj('limone-interdonato', 'Pubblicazione di una domanda di modifica — «Limone Interdonato Messina» IGP, Gazzetta ufficiale dell’Unione europea C 74', 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:52009XC0328(04)', 2009),
  masaf('marrone-combai', 'Disciplinare di produzione della indicazione geografica protetta Marrone di Combai', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/2%252F5%252F7%252FD.e055e9c4d06d668548f6/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('marrone-serino', 'Disciplinare di Produzione Indicazione geografica Protetta “Marrone di Serino”/“Castagna di Serino”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/5%252Fb%252F0%252FD.96be126509da655c61fc/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('marroni-monfenera', 'Disciplinare di produzione della indicazione geografica protetta “Marroni del Monfenera”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/9%252F9%252Fb%252FD.cd5056ba5a14a41e0303/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('mela-rossa-cuneo', 'Disciplinare di produzione della indicazione geografica protetta “Mela Rossa Cuneo”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F3%252F5%252FD.1a2ffc3636ef22504344/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('mela-val-di-non', 'Disciplinare di Produzione della Denominazione di Origine Protetta “MELA VAL DI NON”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F7%252F9%252FD.7cc9e4bd412b9a66287c/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('oliva-ascolana', 'Disciplinare di produzione «Oliva Ascolana del Piceno» DOP', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252Fd%252F7%252FD.e59d369ae7d2247560ef/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('pera-emilia-romagna', "Disciplinare di produzione della indicazione geografica protetta \"PERA DELL'EMILIA ROMAGNA\"", 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/8%252Ff%252F5%252FD.7c1dba6ba4d190a8fbf3/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('pesca-delia', 'Disciplinare di produzione della indicazione geografica protetta “Pesca di Delia”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252Fe%252F0%252FD.1e7425153c9c6fe891c3/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('pesca-leonforte', 'Disciplinare di produzione della indicazione geografica protetta “Pesca di Leonforte”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F4%252F2%252FD.ed7a5518a82b3fae7b80/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('pescabivona', 'Indicazione geografica protetta (IGP) “Pescabivona” — Disciplinare di produzione', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/c%252Fb%252F0%252FD.49f8eb793a2b49e750e2/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('susina-dro', 'Disciplinare di produzione della denominazione di origine protetta “Susina di Dro”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/7%252F3%252F0%252FD.818711ea48fe0982b98e/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('arancia-gargano', 'Disciplinare di produzione dell’indicazione geografica protetta Arancia del Gargano', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/3%252F5%252F1%252FD.3e0f72d265744b669452/P/BLOB%3AID%3D3343/E/pdf?mode=download', '2026-09-05'),
  masaf('arancia-ribera', 'Disciplinare di produzione della denominazione d’origine protetta “ARANCIA DI RIBERA”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/e%252F0%252F1%252FD.52948b4d059678acd4ea/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('mele-trentino', 'Disciplinare di produzione della indicazione geografica protetta Mele del Trentino', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/5%252F7%252Fc%252FD.3e793f8037ce3e4e7ab1/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('limone-sorrento', 'Disciplinare di produzione dell’indicazione geografica protetta “Limone di Sorrento”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/a%252F7%252Fc%252FD.04cac7bb06e6f0e65527/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  // One document per region, cited by every row read from it.
  pat(
    'pat-marche',
    'Regione Marche, Schede prodotti tradizionali — Prodotti vegetali allo stato naturale o trasformati (aggiornamento 2017)',
    'https://static.regione.marche.it/Portals/0/Agricoltura/qualita/Prodotti%20Tradizionali/Schede%20prodotti%20tradizionali%20regione%20Marche%202017.pdf',
    '2026-09-17',
    2017,
  ),
  pat(
    'pat-abruzzo',
    "Regione Abruzzo e ARSSA, Atlante dei prodotti tradizionali d'Abruzzo",
    'https://www2.regione.abruzzo.it/system/files/agricoltura/pord_agroalimentari/Atlante_prodotti_tipici.pdf',
    '2026-09-18',
    2006,
  ),
  // Campania publishes a page per product; each row cites its own.
  pat(
    'cam-aglio-dell-ufita',
    "Scheda «Aglio dell'Ufita» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati",
    'https://agricoltura.regione.campania.it/tipici/tradizionali/aglio-ufita.htm',
    '2026-09-18',
  ),
  pat(
    'cam-broccolo-san-pasquale',
    'Scheda «Broccolo San Pasquale» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/broccolo-san-pasquale.html',
    '2026-09-18',
  ),
  pat(
    'cam-carciofo-capuanella',
    'Scheda «Carciofo capuanella» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/carciofo-capuanella.htm',
    '2026-09-18',
  ),
  pat(
    'cam-carciofo-di-castellammare',
    'Scheda «Carciofo di Castellammare» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/carciofo-castellammare.htm',
    '2026-09-18',
  ),
  pat(
    'cam-carciofo-pignatella-carciofo-ros',
    'Scheda «Carciofo pignatella, carciofo rosso, carciofolla pascaiola» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/carciofo_pignatella.html',
    '2026-09-18',
  ),
  pat(
    'cam-castagna-del-monte-faito',
    'Scheda «Castagna del Monte Faito» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/castagna-faito.html',
    '2026-09-18',
  ),
  pat(
    'cam-castagna-di-acerno',
    'Scheda «Castagna di Acerno» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/castagna-acerno.html',
    '2026-09-18',
  ),
  pat(
    'cam-castagna-di-trevico',
    'Scheda «Castagna di Trevico» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/castagna-trevico.html',
    '2026-09-18',
  ),
  pat(
    'cam-castagna-jonna-di-civitella-lici',
    'Scheda «Castagna jonna di Civitella Licinio» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/castagna-jonna.html',
    '2026-09-18',
  ),
  pat(
    'cam-castagna-o-marrone-del-partenio',
    'Scheda «Castagna o marrone del Partenio» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/castagna-partenio.html',
    '2026-09-18',
  ),
  pat(
    'cam-ciliegia-del-monte-e-ciliegia-de',
    'Scheda «Ciliegia del Monte e ciliegia della Recca» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/ciliegia-monte.html',
    '2026-09-18',
  ),
  pat(
    'cam-ciliegia-di-pimonte',
    'Scheda «Ciliegia di Pimonte» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/ciliegia-pimonte.html',
    '2026-09-18',
  ),
  pat(
    'cam-ciliegia-di-siano',
    'Scheda «Ciliegia di Siano» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/ciliegia-siano.html',
    '2026-09-18',
  ),
  pat(
    'cam-cipolla-alifana',
    'Scheda «Cipolla alifana» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/cipolla-alifana.html',
    '2026-09-18',
  ),
  pat(
    'cam-cipolla-bianca-di-pompei',
    'Scheda «Cipolla bianca di Pompei» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/cipolla-bianca-pompei.html',
    '2026-09-18',
  ),
  pat(
    'cam-cipolla-di-airola',
    'Scheda «Cipolla di Airola» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/cipolla-airola.html',
    '2026-09-18',
  ),
  pat(
    'cam-fagiolo-mustacciello',
    'Scheda «Fagiolo mustacciello» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/fagiolo-mustacciello.html',
    '2026-09-18',
  ),
  pat(
    'cam-finocchio-bianco-palettone',
    'Scheda «Finocchio bianco palettone» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/finocchiopalettone.htm',
    '2026-09-18',
  ),
  pat(
    'cam-finocchio-di-sarno',
    'Scheda «Finocchio di Sarno» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/finocchiosarno.htm',
    '2026-09-18',
  ),
  pat(
    'cam-giallona-di-siano',
    'Scheda «Giallona di Siano» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/giallona.htm',
    '2026-09-18',
  ),
  pat(
    'cam-melone-napoletano',
    'Scheda «Melone napoletano» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/melonenapoli.htm',
    '2026-09-18',
  ),
  pat(
    'cam-oliva-marinese',
    'Scheda «Oliva marinese» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/oliva-marinese.html',
    '2026-09-18',
  ),
  pat(
    'cam-patata-di-monte-s-giacomo',
    'Scheda «Patata di Monte S. Giacomo» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/patata-monte-san-giacomo.html',
    '2026-09-18',
  ),
  pat(
    'cam-patata-di-trevico',
    'Scheda «Patata di Trevico» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/patata-trevico.html',
    '2026-09-18',
  ),
  pat(
    'cam-patata-fresca-campana',
    'Scheda «Patata fresca campana» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/patata-fresca.html',
    '2026-09-18',
  ),
  pat(
    'cam-patata-nera-del-matese',
    'Scheda «Patata nera del Matese» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/patata-nera-matese.html',
    '2026-09-18',
  ),
  pat(
    'cam-patata-rossa-del-vallo-di-diano',
    'Scheda «Patata rossa del Vallo di Diano» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/patata-rossa-vallo-diano.html',
    '2026-09-18',
  ),
  pat(
    'cam-peperoncini-verdi-o-di-fiume',
    'Scheda «Peperoncini verdi o di fiume» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/peperonciniverdi.htm',
    '2026-09-18',
  ),
  pat(
    'cam-peperone-cazzone',
    'Scheda «Peperone cazzone» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/peperone-cazzone.html',
    '2026-09-18',
  ),
  pat(
    'cam-peperone-sassaniello',
    'Scheda «Peperone sassaniello» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/peperone-sassaniello.html',
    '2026-09-18',
  ),
  pat(
    'cam-pera-lardara',
    'Scheda «Pera lardara» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/pere-lardare.html',
    '2026-09-18',
  ),
  pat(
    'cam-pisello-centogiorni',
    'Scheda «Pisello centogiorni» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/pisello-centogiorni.html',
    '2026-09-18',
  ),
  pat(
    'cam-pomodorino-campano',
    'Scheda «Pomodorino campano» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/pomodorino-campano.html',
    '2026-09-18',
  ),
  pat(
    'cam-pomodorino-cannellino-di-pimonte',
    'Scheda «Pomodorino cannellino di Pimonte» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/pomodorino-pimonte.html',
    '2026-09-18',
  ),
  pat(
    'cam-pomodorino-dell-ufita',
    "Scheda «Pomodorino dell'Ufita» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati",
    'https://agricoltura.regione.campania.it/tipici/tradizionali/pomodorino-ufita.html',
    '2026-09-18',
  ),
  pat(
    'cam-pomodoro-cannellino-flegreo',
    'Scheda «Pomodoro cannellino flegreo» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/pomodoro-cannellino-flegreo.html',
    '2026-09-18',
  ),
  pat(
    'cam-pomodoro-fiaschello-di-battipagl',
    'Scheda «Pomodoro fiaschello di Battipaglia» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/pomodoro-fiaschello.html',
    '2026-09-18',
  ),
  pat(
    'cam-rapa-catozza',
    'Scheda «Rapa catozza» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/rapa-catozza.html',
    '2026-09-18',
  ),
  pat(
    'cam-sedano-di-gesualdo',
    'Scheda «Sedano di Gesualdo» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/sedano-gesualdo.html',
    '2026-09-18',
  ),
  pat(
    'cam-zucchino-san-pasquale',
    'Scheda «Zucchino San Pasquale» — Regione Campania, prodotti tradizionali, prodotti vegetali allo stato naturale o trasformati',
    'https://agricoltura.regione.campania.it/tipici/tradizionali/zucchino-san-pasquale.html',
    '2026-09-18',
  ),
  // Toscana publishes a scheda per product, so each row cites its own.
  pat(
    'tos-aglio-massese',
    'Scheda prodotto «Aglio massese» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=41',
    '2026-09-18',
  ),
  pat(
    'tos-aglione-della-valdichiana',
    'Scheda prodotto «Aglione della Valdichiana» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=584',
    '2026-09-18',
  ),
  pat(
    'tos-arancio-massese',
    'Scheda prodotto «Arancio massese» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=113',
    '2026-09-18',
  ),
  pat(
    'tos-barba-massese',
    'Scheda prodotto «Barba massese» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=380',
    '2026-09-18',
  ),
  pat(
    'tos-carciofo-di-chiusure',
    'Scheda prodotto «Carciofo di Chiusure» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=533',
    '2026-09-18',
  ),
  pat(
    'tos-carciofo-di-san-miniato',
    'Scheda prodotto «Carciofo di San Miniato» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=535',
    '2026-09-18',
  ),
  pat(
    'tos-carciofo-empolese',
    'Scheda prodotto «Carciofo empolese» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=46',
    '2026-09-18',
  ),
  pat(
    'tos-cardo-della-val-di-cornia',
    'Scheda prodotto «Cardo della Val di Cornia» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=48',
    '2026-09-18',
  ),
  pat(
    'tos-cardo-massese',
    'Scheda prodotto «Cardo massese» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=47',
    '2026-09-18',
  ),
  pat(
    'tos-castagna-pistolesa',
    'Scheda prodotto «Castagna pistolesa» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=279',
    '2026-09-18',
  ),
  pat(
    'tos-cavolfiore-fiorentino-tardivo',
    'Scheda prodotto «Cavolfiore fiorentino tardivo» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=49',
    '2026-09-18',
  ),
  pat(
    'tos-cavolfiore-precoce-toscano',
    'Scheda prodotto «Cavolfiore precoce toscano» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=50',
    '2026-09-18',
  ),
  pat(
    'tos-cipolla-di-bassone',
    'Scheda prodotto «Cipolla di Bassone» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=55',
    '2026-09-18',
  ),
  pat(
    'tos-cipolla-di-certaldo',
    'Scheda prodotto «Cipolla di Certaldo» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=476',
    '2026-09-18',
  ),
  pat(
    'tos-cipolla-di-ripola',
    'Scheda prodotto «Cipolla di Ripola» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=56',
    '2026-09-18',
  ),
  pat(
    'tos-cipolla-di-terceretoli',
    'Scheda prodotto «Cipolla di Terceretoli» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=57',
    '2026-09-18',
  ),
  pat(
    'tos-cipolla-massese',
    'Scheda prodotto «Cipolla massese» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=59',
    '2026-09-18',
  ),
  pat(
    'tos-cipolla-rossa-della-valtiberina',
    'Scheda prodotto «Cipolla rossa della Valtiberina» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=591',
    '2026-09-18',
  ),
  pat(
    'tos-cipolla-vernina',
    'Scheda prodotto «Cipolla vernina» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=63',
    '2026-09-18',
  ),
  pat(
    'tos-cocomero-gigante',
    'Scheda prodotto «Cocomero gigante» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=499',
    '2026-09-18',
  ),
  pat(
    'tos-fagiolo-marconi-a-seme-nero',
    'Scheda prodotto «Fagiolo Marconi a seme nero» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=79',
    '2026-09-18',
  ),
  pat(
    'tos-fagiolo-borlotto-di-maremma',
    'Scheda prodotto «Fagiolo borlotto di Maremma» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=66',
    '2026-09-18',
  ),
  pat(
    'tos-fagiolo-borlotto-nano-di-sorano',
    'Scheda prodotto «Fagiolo borlotto nano di Sorano» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=69',
    '2026-09-18',
  ),
  pat(
    'tos-fagiolo-cannellino',
    'Scheda prodotto «Fagiolo cannellino» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=77',
    '2026-09-18',
  ),
  pat(
    'tos-fagiolo-dall-occhio-del-valdarno',
    "Scheda prodotto «Fagiolo dall'occhio del Valdarno» — Regione Toscana, I Prodotti Agroalimentari della Toscana",
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=71',
    '2026-09-18',
  ),
  pat(
    'tos-fagiolo-di-zeri',
    'Scheda prodotto «Fagiolo di Zeri» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=379',
    '2026-09-18',
  ),
  pat(
    'tos-fagiolo-fico-di-gallicano',
    'Scheda prodotto «Fagiolo fico di Gallicano» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=503',
    '2026-09-18',
  ),
  pat(
    'tos-fagiolo-malato',
    'Scheda prodotto «Fagiolo malato» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=509',
    '2026-09-18',
  ),
  pat(
    'tos-fagiolo-mascherino',
    'Scheda prodotto «Fagiolo mascherino» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=510',
    '2026-09-18',
  ),
  pat(
    'tos-fagiolo-scritto-della-garfagnana',
    'Scheda prodotto «Fagiolo scritto della Garfagnana» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=511',
    '2026-09-18',
  ),
  pat(
    'tos-fagiolo-serpente-toscano',
    'Scheda prodotto «Fagiolo serpente toscano» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=80',
    '2026-09-18',
  ),
  pat(
    'tos-fagiolo-turco-di-castello',
    'Scheda prodotto «Fagiolo turco di Castello» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=81',
    '2026-09-18',
  ),
  pat(
    'tos-fico-san-piero',
    'Scheda prodotto «Fico San Piero» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=430',
    '2026-09-18',
  ),
  pat(
    'tos-mela-rosa-del-casentino',
    'Scheda prodotto «Mela rosa del Casentino» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=121',
    '2026-09-18',
  ),
  pat(
    'tos-mela-stayman-aretina',
    'Scheda prodotto «Mela stayman aretina» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=464',
    '2026-09-18',
  ),
  pat(
    'tos-melograno-di-firenze',
    'Scheda prodotto «Melograno di Firenze» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=127',
    '2026-09-18',
  ),
  pat(
    'tos-melone-della-val-di-cornia',
    'Scheda prodotto «Melone della Val di Cornia» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=128',
    '2026-09-18',
  ),
  pat(
    'tos-patata-di-santa-maria-a-monte',
    'Scheda prodotto «Patata di Santa Maria a Monte» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=543',
    '2026-09-18',
  ),
  pat(
    'tos-pera-coscia-di-firenze',
    'Scheda prodotto «Pera coscia di Firenze» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=129',
    '2026-09-18',
  ),
  pat(
    'tos-pera-gentile',
    'Scheda prodotto «Pera gentile» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=132',
    '2026-09-18',
  ),
  pat(
    'tos-pesca-michelini',
    'Scheda prodotto «Pesca Michelini» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=141',
    '2026-09-18',
  ),
  pat(
    'tos-pesca-maglia-rosa',
    'Scheda prodotto «Pesca maglia rosa» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=140',
    '2026-09-18',
  ),
  pat(
    'tos-pesca-mora-di-moriano-dolfi',
    'Scheda prodotto «Pesca mora di Moriano Dolfi» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=142',
    '2026-09-18',
  ),
  pat(
    'tos-pesca-regina-di-londa',
    'Scheda prodotto «Pesca regina di Londa» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=136',
    '2026-09-18',
  ),
  pat(
    'tos-peschetti-di-candia',
    'Scheda prodotto «Peschetti di Candia» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=381',
    '2026-09-18',
  ),
  pat(
    'tos-piattella-pisana',
    'Scheda prodotto «Piattella pisana» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=485',
    '2026-09-18',
  ),
  pat(
    'tos-pisello-a-mezza-frasca-aretino',
    'Scheda prodotto «Pisello a mezza frasca aretino» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=91',
    '2026-09-18',
  ),
  pat(
    'tos-pisello-a-tutta-frasca-aretino',
    'Scheda prodotto «Pisello a tutta frasca aretino» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=90',
    '2026-09-18',
  ),
  pat(
    'tos-pisello-mugellano',
    'Scheda prodotto «Pisello mugellano» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=556',
    '2026-09-18',
  ),
  pat(
    'tos-pomodoro-grinzoso-sanminiatese',
    'Scheda prodotto «Pomodoro grinzoso sanminiatese» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=545',
    '2026-09-18',
  ),
  pat(
    'tos-pomodoro-pallino',
    'Scheda prodotto «Pomodoro pallino» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=96',
    '2026-09-18',
  ),
  pat(
    'tos-pomodoro-pendentino',
    'Scheda prodotto «Pomodoro pendentino» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=92',
    '2026-09-18',
  ),
  pat(
    'tos-pomodoro-pisanello',
    'Scheda prodotto «Pomodoro pisanello» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=98',
    '2026-09-18',
  ),
  pat(
    'tos-pomodoro-stella',
    'Scheda prodotto «Pomodoro stella» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=100',
    '2026-09-18',
  ),
  pat(
    'tos-radicchia-di-lucca',
    'Scheda prodotto «Radicchia di Lucca» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=421',
    '2026-09-18',
  ),
  pat(
    'tos-scalogno-nostrale-toscano',
    'Scheda prodotto «Scalogno nostrale toscano» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=103',
    '2026-09-18',
  ),
  pat(
    'tos-spinacio-tipico-della-val-di-corni',
    'Scheda prodotto «Spinacio tipico della Val di Cornia» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=105',
    '2026-09-18',
  ),
  pat(
    'tos-uva-colombana-di-peccioli',
    'Scheda prodotto «Uva colombana di Peccioli» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=146',
    '2026-09-18',
  ),
  pat(
    'tos-zucchina-mora-pisana',
    'Scheda prodotto «Zucchina mora pisana» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=433',
    '2026-09-18',
  ),
  pat(
    'tos-zucchina-sarzanese',
    'Scheda prodotto «Zucchina sarzanese» — Regione Toscana, I Prodotti Agroalimentari della Toscana',
    'https://prodtrad.regione.toscana.it/LIB_ProdTrad/Prodotto.php?ID=434',
    '2026-09-18',
  ),
  pat(
    'pat-lombardia',
    'Regione Lombardia ed ERSAF, Atlante dei prodotti tipici e tradizionali, quinta edizione',
    'https://www.ersaf.lombardia.it/wp-content/uploads/2023/07/Atlanteprodottitipicietradizionali2014_13383_856.pdf',
    '2026-09-18',
    2014,
  ),
  pat(
    'pat-friuli',
    'ERSA Friuli Venezia Giulia, Il Cibario del Friuli Venezia Giulia — Atlante dei Prodotti della Tradizione',
    'https://www.regione.fvg.it/rafvg/export/sites/default/RAFVG/economia-imprese/agricoltura-foreste/allegati/CibarioERSAedizione2017-2.pdf',
    '2026-09-17',
    2017,
  ),
  pat(
    'pat-lazio',
    'ARSIAL, Lazio patrimonio agroalimentare tra biodiversità e tradizione — Prodotti vegetali allo stato naturale o trasformati',
    'https://www.arsial.it/wp-content/uploads/2025/06/Guida_Arsial_completo.pdf',
    '2026-09-17',
    2019,
  ),
  pat(
    'pat-sardegna',
    'Regione Autonoma della Sardegna, Elenco prodotti agroalimentari tradizionali — Prodotti vegetali allo stato naturale o trasformati, schede identificative',
    'https://files.regione.sardegna.it/squidex/api/assets/redazionaleras/b251d860-4788-4ec1-ae2b-e038ef454c58/6.-prodotti-vegetali-allo-stato-naturale-o-trasformati.pdf',
    '2026-09-17',
  ),
  pat(
    'pat-sicilia',
    'Regione Siciliana, Prodotti Agroalimentari Tradizionali — schede identificative, prodotti vegetali allo stato naturale o trasformati',
    'https://www.regione.sicilia.it/system/files/2023-06/Schede%20PAT%20Sicilia%202023.pdf',
    '2026-09-17',
  ),
  pat(
    'golden-valle-aosta',
    "Scheda identificativa — Golden delicious della Valle d'Aosta, elenco regionale dei prodotti agroalimentari tradizionali",
    'https://www.regione.vda.it/allegato.aspx?pk=79510',
    '2026-09-17',
  ),
  pat(
    'renetta-valle-aosta',
    "Scheda identificativa — Renetta della Valle d'Aosta, elenco regionale dei prodotti agroalimentari tradizionali",
    'https://www.regione.vda.it/allegato.aspx?pk=79519',
    '2026-09-17',
  ),
  masaf('marrone-valle-susa', 'Disciplinare di produzione della indicazione geografica protetta “MARRONE della VALLE di SUSA”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252Fd%252Fd%252FD.a221105d95cec8b52239/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  // ── Vegetables ───────────────────────────────────────────────────────────
  masaf('aglio-voghiera', 'Disciplinare di produzione della denominazione di origine protetta “AGLIO DI VOGHIERA”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/3%252F3%252F7%252FD.e771ec79985bf81f1a97/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('asparago-badoere', 'Disciplinare di produzione della indicazione geografica protetta “Asparago di Badoere”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252Fb%252Fd%252FD.e0178d8efd0bbe671ebf/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  oj('asparago-bassano', 'Pubblicazione di una domanda di registrazione — «Asparago Bianco di Bassano» DOP, Gazzetta ufficiale dell’Unione europea C 321', 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:52006XC1229(04)', 2006),
  masaf('asparago-canino', 'Disciplinare di produzione della indicazione geografica protetta “Asparago verde di Canino”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F7%252Fb%252FD.6b66576739b1622f90a1/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('asparago-cantello', 'Disciplinare di produzione della indicazione geografica protetta “Asparago di Cantello”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F9%252Fb%252FD.67f05f8b0cc7eaa10471/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('asparago-cimadolmo', 'Disciplinare di produzione “Asparago Bianco di Cimadolmo”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/4%252Ff%252F3%252FD.96df8b14f92a68aba67d/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('cappero-eolie', 'Disciplinare di produzione della denominazione di origine protetta D.O.P. “Cappero delle Isole Eolie”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/2%252Fd%252Fa%252FD.a13f1ee77219816e9575/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('cappero-pantelleria', 'Disciplinare di produzione della indicazione geografica protetta “Cappero di Pantelleria”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/f%252F2%252F3%252FD.6d29fd47d84b453e2089/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('basilico-genovese', 'Disciplinare di produzione della denominazione di origine protetta “Basilico Genovese”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252Fa%252F1%252FD.c7df33c091f212925a8b/P/BLOB%3AID%3D3343/E/pdf?mode=download', '2026-09-05'),
  masaf('brovada', 'Disciplinare di produzione della denominazione di origine protetta «Brovada»', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/a%252Fb%252F2%252FD.5b9c8bed1a7e74cca71d/P/BLOB%3AID%3D3343/E/pdf?mode=download', '2026-09-05'),
  masaf('carciofo-brindisino', 'Disciplinare di produzione della indicazione geografica protetta «Carciofo Brindisino»', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/4%252F2%252F2%252FD.7a1c0ed72668b8dab749/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  oj('carciofo-paestum', 'Pubblicazione di una domanda di registrazione — «Carciofo di Paestum» IGP, Gazzetta ufficiale dell’Unione europea C 153', 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:52003XC0701(03)', 2003),
  oj('carciofo-romanesco', 'Pubblicazione di una domanda di registrazione — «Carciofo Romanesco del Lazio» IGP, Gazzetta ufficiale dell’Unione europea C 51', 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:52002XC0226(03)', 2002),
  masaf('carciofo-sardegna', 'Disciplinare di Produzione della Denominazione di Origine Protetta “Carciofo Spinoso di Sardegna”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/0%252F0%252Fd%252FD.cdad71c75174ff320329/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('carota-ispica', 'Disciplinare di produzione della indicazione geografica protetta “Carota Novella di Ispica”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252Fc%252F3%252FD.07f4a03557cddf078575/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('fagioli-rotonda', "Disciplinare di produzione della denominazione d'origine protetta «Fagioli bianchi di rotonda»", 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F1%252F2%252FD.390a94581a72babb4d5a/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('fagiolo-atina', 'Disciplinare di produzione Denominazione di Origine Protetta “Fagiolo Cannellino di Atina”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/b%252F8%252F3%252FD.9c34647f05099874c97d/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('fagiolo-cuneo', 'Disciplinare di produzione della indicazione geografica protetta “Fagiolo Cuneo”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F1%252Ff%252FD.9dd31e6dadf07f48ecad/P/BLOB%3AID%3D3343/E/docx?mode=download', '2026-09-05'),
  oj(
    'finocchio-capo-rizzuto',
    "Comunicazione dell'approvazione di una modifica ordinaria di un disciplinare di produzione — «Finocchio di Isola Capo Rizzuto»",
    'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=OJ:C_202300557',
    2023,
  ),
  masaf('melanzana-rotonda', 'Disciplinare di produzione della denominazione di origine protetta “Melanzana Rossa di Rotonda”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/2%252F0%252Ff%252FD.f7ab24e7f62ece21256a/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('fungo-borgotaro', 'Disciplinare di produzione della Indicazione Geografica Protetta “Fungo di Borgotaro”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/c%252Ff%252F5%252FD.3e216adbdd44ae0af289/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('lenticchia-onano', 'Disciplinare di produzione Indicazione Geografica Protetta “Lenticchia di Onano”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252Fc%252F9%252FD.21d5432131a852cb86c2/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('patata-alto-viterbese', 'Disciplinare di produzione “Patata dell’Alto Viterbese”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/8%252Fc%252F7%252FD.59c2b0ed6cf7a3e6a36b/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('patata-colfiorito', 'Disciplinare di produzione della indicazione geografica protetta della “Patata Rossa di Colfiorito”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/9%252Fc%252Ff%252FD.0b1255d221c68a0db419/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('patata-fucino', 'Disciplinare di produzione della indicazione geografica protetta “Patata del Fucino”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/a%252Fe%252F2%252FD.142ad5ec3ad1fe4ad103/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('patata-galatina', 'Disciplinare di produzione della denominazione di origine protetta “Patata novella di Galatina”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/8%252F9%252F6%252FD.072dd4d09d2652ab0979/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  oj('patata-sila', 'Pubblicazione di una domanda di registrazione — «Patata della Sila» IGP, Gazzetta ufficiale dell’Unione europea C 33', 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:52010XC0210(03)', 2010),
  masaf('peperoncino-calabria', 'Disciplinare di produzione indicazione geografica protetta «Peperoncino di Calabria»', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F9%252F7%252FD.3b1bdc676f6ca351379c/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('peperone-pontecorvo', 'Disciplinare di produzione della Denominazione Origine Protetta “PEPERONE DI PONTECORVO”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/2%252F0%252F5%252FD.386ecf72ee406fa56e1b/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('piennolo-vesuvio', 'Disciplinare di produzione della denominazione di origine protetta “Pomodorino del Piennolo del Vesuvio”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/f%252F7%252F8%252FD.4d867b818ff85f870064/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('radicchio-chioggia', 'Disciplinare Radicchio di Chioggia IGP', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/5%252F4%252Fe%252FD.4c50e2e0a42910032712/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
  masaf('san-marzano', 'Disciplinare di produzione della denominazione di origine protetta “Pomodoro S. Marzano dell’Agro Sarnese-Nocerino”', 'https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/c%252F2%252Fb%252FD.f612cb1507f4bc4f8350/P/BLOB%3AID%3D3343/E/pdf?mode=download'),
];
