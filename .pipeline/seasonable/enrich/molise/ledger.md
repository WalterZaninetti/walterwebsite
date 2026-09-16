# Molise — PAT enrichment ledger

The audit trail for the `pat` tier in Molise. Same rules as `.pipeline/seasonable/sources-ledger.md`:
every document goes in here before a candidate line goes in `candidates.jsonl`, and negative
results stay.

---

## 2026-09-16 — finding the schede

### Where I looked

- **`https://www.regione.molise.it/flex/cm/pages/ServeBLOB.php/L/IT/IDPagina/141`** ("Politiche
  Agroalimentari", the Region's agriculture portal) — downloaded; no mention of prodotti
  tradizionali, no PAT list, no schede. Not the document.
- **`https://www.arsarp.it/progetti/atlante-prodotti-tradizionali-scuole-254`** — the old project
  URL of ARSARP (Agenzia Regionale per lo Sviluppo Agricolo, Rurale e della Pesca, the regional
  agency that succeeded ERSAM). It now lands on the agency's new WordPress site with no document
  on the page.
- **`https://www.arsarp.it/wp-json/wp/v2/search?search=tradizionali`** — the site's own search
  API. It returns post 1416, «L'atlante dei prodotti tradizionali del Molise».
- **`https://www.arsarp.it/wp-json/wp/v2/posts/1416`** — the post body links one PDF per
  category of the atlas. The one in scope is
  **`https://www.arsarp.it/wp-content/uploads/2007/06/Prodotti_vegetali.pdf`**; I also took the
  introduction, `…/2007/06/La_realizzazione.pdf`, to learn what the atlas is.
- Wikipedia, disciplinare.it, informacibo, vivigreen, buonosanoitaliano, cibo360 and
  italia-italy.org came up in search and were not opened: aggregators, not publishers.

### The document

**«PRODOTTI VEGETALI ALLO STATO NATURALE O TRASFORMATI»**, the vegetable chapter of the
*Atlante dei Prodotti Tradizionali della Regione Molise*, printed pages 59–70 (PDF pages 1–12;
printed page = PDF page + 58). Each page footer reads «ersa molise». Text layer present — no OCR.

The introduction («LA REALIZZAZIONE DELL'ATLANTE DEI PRODOTTI TRADIZIONALI DELLA REGIONE MOLISE»,
Giuseppe Moffa, ERSAM) says the atlas is ERSAM's work «su incarico della Giunta Regionale» to
identify products «da inserire, ai sensi del D. Lgs. n.173/98, negli elenchi ufficiali», that the
schede follow «le indicazioni del Ministero delle Politiche Agricole e Forestali» (territorio
interessato alla produzione, metodiche di lavorazione, …), and that it holds 179 products,
«compresi quindi quelli riconosciuti in via ufficiosa» — 160 recognised by D.M. up to «D.M. del
25 luglio 2003», plus 19 identified for 2004 that «verranno inviati nel corso dell'anno 2005».

**Printed date: nothing printed** on the vegetable chapter. The introduction dates its contents
only indirectly (latest decree 2003, a submission still to come in 2005); that is not a
publication year and is not recorded as `printedYear`. Metadata, for the record only: `pdfinfo`
CreationDate 2005-06-23 (QuarkXPress 5 / Distiller); the WordPress post is dated 2007-06-01.
Every record from this document carries `undated`.

**Caveats for the ship step.**
1. The atlas mixes officially listed products with ones «riconosciuti in via ufficiosa», and it
   predates the current ministerial revisione. A candidate from it should be checked against the
   latest GU list before it ships.
2. `pdftotext -layout` interleaves the three text columns. I read each scheda by following its
   column, and quote only sentences whose column assignment is unambiguous.
3. Zones are written loosely («Intero territorio regionale», «Alta Valle del Volturno»,
   «Zona del Matese»), rarely as comune lists.

33 products are in the chapter, all indexed in `pat-index.json` in document order. The chapter
also holds preserves, dried products, legume dishes, mushrooms and truffles — each still gets a
record so it is never re-checked.

---

## 2026-09-16 — batch 1 (8 products)

- **Castagne** (p.1 / printed 59) — `rejected`. Area «Alcune aree del territorio regionale.»
  The only harvest sentence: «Si raccolgono in autunno a mano, liberandole dal riccio e
  conservandole in luogo asciutto per il futuro consumo.» Qualitative («in autunno»), and storage
  is stated with no window.
- **Centofoglie (Indivia scarola, Scarola venafrana)** (p.1) — `silent`. Area «Tipico ortaggio
  della zona di Venafro (IS).» The scheda dates only sowing — «Si semina nella tarda primavera
  fino a settembre – ottobre a spaglio in semenzaio.» — and transplanting by plant height. Nothing
  about harvest.
- **Cicerchie** (p.1) — `rejected`. «La cicerchia si raccoglie in luglio e può dare rese sino a 25
  q.li per ettaro.» The crop harvested is the dry seed: the scheda goes on «si procede
  all'essiccazione e quindi alla battitura delle piante per estrarre la granella». A dried pulse,
  not fresh produce. The autumn/spring sowing remarks are sowing, not harvest.
- **Cicorie (Casselle)** (p.1) — `silent`. Wild bitter chicory; the scheda describes washing,
  boiling and dressing. No date of any kind.
- **Cipolla di Isernia (C'polla Ghianga, Cipolla di S. Pietro e Paolo)** (p.2 / printed 60) —
  `rejected`. Area «Isernia.» Dates: «Semina ad agosto in semenzai, trapianto fine ottobre –
  novembre.» (sowing and transplanting) and «Pianta particolarmente rustica adatta a terreni
  marginali, necessita di una zappettatura a primavera e di una concimazione organica con letame;
  la raccolta è intorno al 15 giugno.» The harvest is one approximate day, not a window with two
  ends. The fiera on 29 June is an event, not harvest. The closest thing to a candidate in the
  batch; still a point, and widening it into a window would be modelling.
- **Cipollotto (Lampascion)** (p.2) — `silent`. Wild bulb found «nei prati perenni, sulle
  scarpate, nei campi coltivati e spesso nei vigneti»; eaten fresh or kept sott'olio. No date.
- **Cumposta (A Cumposta)** (p.2–3) — `rejected`. A raw vinegar preserve of fruit and vegetables:
  «Il periodo di produzione è tutto l'anno naturalmente in base alla disponibilità di frutta ed
  ortaggi di stagione.» Processed product, and the only period is year-round production.
- **Fagiolo (Fasciol murrecn, Ghiang murrecn)** (p.3 / printed 61) — `rejected`. Area «Alta Valle
  del Volturno.» «Si semina la prima decade di luglio.» (sowing) and «La raccolta manuale si
  effettua a fine settembre.», followed by sun-drying and threshing with «ru frust». A dry bean,
  not fresh produce; and «a fine settembre» is one moment, with no start.

## 2026-09-16 — pat judge, pages 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 (sonnet/low, $0.299 so far)

- **Fagioli di Riccia (Fasciol)** (p.3) — `rejected`. dried pulse harvested for threshing. «Si raccolgono a fine agosto inizio settembre quando il seme è completamente formato e i legumi ben secchi.»
- **Fagiolo Tabacchino (Fasciol’ a burr’, Fasciol tabbacchin)** (p.4) — `rejected`. dried pulse harvested for threshing. «La raccolta manuale si effettua in ottobre.»
- **Fichi secchi (Ficura secc., Fic. sic)** (p.5) — `rejected`. qualitative time only and dried processed product. «I frutti raccolti a maturazione completa, sani, privi di ammaccature, vengono essiccati, ponendoli su grate ben distanziati tra loro»
- **Fungo d'abete** (p.5) — `rejected`. out of scope: wild mushroom. «È facilmente individuabile nei boschi di abete nel periodo fine estate-autunno e, particolarmente, dopo un periodo piovoso.»
- **Gallinaccio (Lallucce, Galletto)** (p.5) — `rejected`. out of scope: wild mushroom. «Si raccoglie nel periodo di giugno-luglio e settembre-ottobre in condizioni climatiche di caldo umido ed assenza di ventosità.»
- **Lessata** (p.6) — `rejected`. production period of processed dish, not a harvest window. «Il periodo di produzione è la Festa di S. Giuseppe il 19 marzo.»
- **Mela limoncella** (p.6) — `rejected`. qualitative time only, no calendar dates. «La raccolta, piuttosto tardiva, data l’altitudine, è fatta prima delle piogge autunnali.»
- **Origano (P’liere, Recn, Rect, Rinie)** (p.7) — `rejected`. flowering date, not harvest. «Fiorisce da giugno a settembre.»
- **Olive al naturale (Live curuate, Olie all’acqua e sale)** (p.7) — `rejected`. qualitative time only, no calendar dates. «Le olive vengono raccolte all’epoca della invaiatura, dopo la cernita e la calibrazione»
- **Paparolesse (Peperoni sottaceto)** (p.8) — `rejected`. production period of processed product, qualitative. «Il periodo di produzione è l’estate.»
- **Peperone rosso (Ppdini p seccà, Cornetti da essiccare)** (p.10) — `rejected`. qualitative time only, and destined for drying. «La raccolta si esegue scalarmente man mano che le bacche raggiungono la colorazione rossa.»
- **Pere sottaceto** (p.10) — `rejected`. qualitative time only, and production period of processed product. «La produzione si ha particolarmente in autunno e inverno; inoltre vengono utilizzate per preparare particolari antipasti nella festività di S. Giuseppe a Riccia.»
- **Pomodori gialli invernali (Pmdor d’viern da append’)** (p.10) — `rejected`. qualitative time only, no calendar dates. «I pomodori vengono raccolti avendo cura di prelevare l’intero racemo e quando hanno raggiunto una colorazione gialla»
- **Pomodori di Montagano** (p.11) — `rejected`. qualitative time only, no calendar dates. «Nel caso si raccolga poco prima della maturazione completa, è ottimo per la preparazione delle insalate.»
- **Porcino (U’purcin’)** (p.11) — `rejected`. out of scope: wild mushroom. «Si raccoglie nel periodo di giugno-luglio e settembre-ottobre se si verificano condizioni climatiche di caldo umido ed assenza di ventosità»
- **Prataiolo** (p.11) — `rejected`. out of scope: wild mushroom. «Facilmente reperibile nei prati e nelle radure da aprile ad ottobre.»
- **Scorzone** (p.11) — `rejected`. out of scope: wild truffle. «Lo scorzone è uno dei tartufi più comuni che, tranne una breve pausa primaverile, si può trovare tutto l’anno anche in notevole quantità sotto noccioli, pioppi, faggi e querce.»
- **Tartufo bianco** (p.11) — `rejected`. out of scope: wild truffle. «È reperibile solo nella tarda estate, in autunno ed all’inizio della stagione invernale.»
- **Farro Dicocco Molise** (p.4) — `rejected`. dried grain harvested dry for threshing. «Il farro è più tardivo del frumento, la trebbiatura inizia nel mese di luglio.»
- **Lenticchia (Miccula)** (p.6) — `silent`. no harvest date given, only crop duration in days.
- **Mais lesso (Scisciegl)** (p.6) — `silent`. processed dish, no harvest dates mentioned.
- **Mela zitella (Verginella, Mela gentile)** (p.7) — `silent`. no harvest date given, only storage duration mentioned.
- **More (Le murichra, I mricul)** (p.7) — `silent`. no dated harvest information given.
- **Patata lunga di San Biase** (p.8) — `silent`. no dated harvest information given.
- **Pezzènde (Pzzen'It)** (p.10) — `silent`. dried pulses, no harvest date given.
