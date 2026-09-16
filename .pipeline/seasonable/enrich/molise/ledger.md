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
