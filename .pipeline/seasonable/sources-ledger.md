# Seasonable — sources ledger

The audit trail for `src/content/seasonable/sources.ts`. **A document goes in here before it
goes in `sources.ts`.** Protocol in `.claude/skills/seasonable-sourcing/SKILL.md`.

Every row records what the document *actually says*, not what we hoped it would say. Negative
results stay in the ledger — they are the reason a row was deleted, and they stop the next
session re-checking the same dead end.

---

## What shipped

34 DOP/IGP disciplinari, one per designation, all read on **2026-08-20**. Each is listed in
`src/content/seasonable/sources.ts` with its own title, and the Italian sentence each window
was converted from is quoted in the comment above that row in `windows.ts`. Between them they
answer for **37 of 107 provinces**.

The corpus was found by walking `disciplinare.it/allarchive` (3,818 documents, 671 of them
disciplinari), matching slugs against the 45 produce ids of the previous catalogue, and
fetching the 254 candidates that matched. Of those, 89 carried a dated harvest sentence,
covering 57 distinct designations; 34 of those stated **both** ends of a window.

### `crtcu-trentino` — CRTCU, calendario stagionale di frutta e verdura (periodi di raccolta)
- **URL:** https://www.centroconsumatori.tn.it/146d1234.html
- **Accessed:** 2026-08-20 · **Printed date:** "Situazione al 03.2024" → year 2024
- **Scope:** region (Trentino) · ~28 vegetables, ~15 fruit
- **Granularity:** **month only.** No open-field / greenhouse / storage distinction.

### `aulss9-veneto` — AULSS 9 Scaligera, Calendario stagionalità di frutta e verdura
- **URL:** https://sian.aulss9.veneto.it/Calendario-stagionalit-di-frutta-e-verdura
- **Accessed:** 2026-08-20 · **Printed date:** "Ultimo aggiornamento: 12/12/2022" → year 2022
- **Scope:** region (Veneto), but derived from the national MASAF "Sai quel che mangi" campaign
- **Granularity:** **month only**, ~50 products. No kind distinction.

---

## Checked and rejected — do not re-check

### Regional *disciplinari di produzione integrata* — **no absolute harvest dates**
The plan assumed these carry `epoca di raccolta`. **They do not.** Two tested, both negative:

- **NTA Cicorie e Radicchi da taglio 2026** (Emilia-Romagna DPI 2026) — has "Semina, trapianto,
  impianto" and "Raccolta" sections, and **zero month names in the whole document**. It
  regulates *how*, not *when*.
- **NTA Melo 2025** (Emilia-Romagna DPI 2025) — the "Lista varietale raccomandata" gives a
  RACCOLTA column as **"± gg da Golden D."**, a relative offset per variety. The document never
  states when Golden Delicious is picked, so nothing resolves to a date.

These documents are real, dated and permanent — they are simply about agronomic practice and
plant protection, not phenology. Same expected for Piemonte, Veneto, Sicilia, Umbria, Liguria.

### `masaf` — the ministry's national calendar is **dead**
`politicheagricole.it/…/IDPagina/5995` → 301 → `masaf.gov.it/…/5995` → "Pagina non più
disponibile". Surviving copies are **scanned image PDFs** mirrored on comune websites (text not
extractable, no year printed on the page hosting them). Not citable.

### `crea` — CREA publishes **no** seasonality calendar
Checked CREA's "Pubblicazioni Istituzionali e Schede Tecniche" (Orticoltura e Florovivaismo):
three publications, all monographs (Salvia species, VerdeCittà 2021, macchia mediterranea
shrubs). No calendario di stagionalità, no epoca di raccolta. The five `zona-*` CREA sources in
`sources.ts` name documents that **do not exist**.

---

## Checked and dropped — do not re-check

### 23 designations that state only half a window
A disciplinare very often fixes when harvest may begin and never says when it ends, because
the binding thing is precocity, not duration. Half a window is not a window. Dropped:

- **Radicchio Rosso di Treviso IGP** — "si effettuano a partire dal 10 ottobre" (tardivo),
  "a partire dal 1° settembre" (precoce). No end anywhere in the document.
- **Radicchio Variegato di Castelfranco IGP** — "a partire dal 1° ottobre". No end.
- **Uva di Puglia IGP** — "per la varietà Victoria: a partire dall'inizio della seconda decade
  di luglio … Italia, Regina e Red globe: a partire dall'inizio della terza decade di agosto".
  Starts only.
- **Melannurca Campana IGP** — "devono concludersi entro il 15 dicembre". End only.
- **Asparago Verde di Altedo IGP** — "non si deve protrarre oltre il 20 giugno". End only.
- **Marrone di Caprese Michelangelo IGP** — "consentita dal 20 settembre". Start only.
- **Marrone di Roccadaspide IGP** — "non oltre la prima decade di novembre". End only.
- **Kiwi di Latina IGP** — only a remark about being able to postpone harvest.
- **Limone di Rocca Imperiale IGP** — describes how to pick, never when.
- Plus Castagna di Montella, Castagna di Roccamonfina, Marrone di Combai, Marrone di San Zeno,
  Marrone del Mugello, Patata dell'Alto Viterbese, Pomodoro Pelato di Puglia, Anguria Reggiana,
  Melone Mantovano, Limone Femminello del Gargano, Ciliegia dell'Etna, Pomodoro di Pachino,
  Arancia Rossa di Sicilia and Aglio di Voghiera — checked, no usable window.

### Two documents that state a window we chose not to use
- **Pesca di Verona IGP** — "È commercializzata dal 10 giugno al 20 settembre". A
  commercialisation window for a fruit nobody stores for three months. Reading it as `stored`
  would be wrong and reading it as `open-field` would be inventing; the document does not say
  which, so neither did we.
- **Mela Alto Adige IGP** — "da inizio agosto a fine luglio", which is the whole year. True,
  and useless as an answer.

### 13 of the previous catalogue's 45 have no DOP/IGP at all
black kale, broad bean, broccoli, cabbage, courgette, cucumber, green bean, leek, pea,
persimmon, pomegranate, pumpkin, spinach. Nothing to cite, so nothing to ship.

---

## Two claims the sources could not carry, and what happened to them

1. **Half-month resolution.** No general calendar in Italy is finer than a month. The IGP
   disciplinari turned out to be *finer* — they state days and decades — which is why the
   fortnight model survived, rather than being cut back to months.
2. **Open field / greenhouse / storage.** No calendar separates them. Disciplinari do, but only
   incidentally: some state a commercialisation window alongside the harvest one, which is a
   storage fact stated outright. Six rows ship as `stored` on that basis. The `greenhouse` kind
   is now unused — kept in the type, absent from the data, rather than guessed at.


---

## 2026-09-02 — the EU register sweep

The whole corpus was re-derived from **eAmbrosia**, the EU's own Union register of geographical
indications, rather than from `disciplinare.it`. eAmbrosia is a JavaScript application, but it
publishes an OpenAPI spec and a public JSON API:

- `GET  https://ec.europa.eu/geographical-indications-register/eambrosia-public-api/v3/api-docs`
- `POST …/api/gi-applications/filter`  — the whole register, 3 977 rows, in one request
- `GET  …/api/gi-applications/id/{id}` — per-designation dossier
- `GET  …/api/v1/attachments/{id}`     — the filed disciplinare PDFs, EU-hosted

**Italy has 127 registered designations in class 1.6 (fruit, vegetables and cereals).** 52 of
them carry the full Italian disciplinare as an EU-hosted attachment (53 PDFs; one, Castagna del
Monte Amiata, is an image scan with no extractable text). 109 OJ C "single document"
publications were fetched from EUR-Lex in Italian, plus 117 later publications.

### The versioning rule this sweep established

A designation's publication history interleaves **OJ C** (the application or proposed amendment)
with **OJ L** (the regulation that approves it). An OJ C is only authoritative once a later OJ L
exists. **41 of the 127 designations carry a pending OJ C with no approving OJ L** — a proposal,
not a text in force. Reading the newest document is therefore wrong; the rule is *the newest
document that has been approved*.

A third case exists and matters: an Italian **"Approvazione della modifica ordinaria"** is
approved nationally under Reg. 1151/2012 and is in force immediately, so it can legitimately be
newer than anything in EUR-Lex. A **"Proposta di modifica"**, **"Domanda di registrazione"** or
**"Richiesta di riconoscimento"** is not in force at all.

### The existing rows are accurate

Seven rows were checked line-by-line against the EU text and **all seven converted identically**:
Asparago Bianco di Bassano, Asparago bianco di Cimadolmo, Carciofo di Paestum, Carciofo Romanesco
del Lazio, Castagna Cuneo, Castagna di Vallerano, Limone di Sorrento. The `disciplinare.it`
transcriptions were faithful. Re-sourcing is a provenance upgrade, not a data correction.

### Two designations that are not designations

- **Albicocca Vesuviana** — **absent from the EU register entirely.** Not registered, not a
  pending application. The row cites a 2026 *Domanda di registrazione*. The page currently calls
  it a DOP; it is not one.
- **Cicoria puntarelle molfettese** — status **"Published"**, i.e. an application published for
  opposition. Not yet registered. The page calls it an IGP; it is not one yet.

### Corrections the approved texts require

- **Finocchio di Isola Capo Rizzuto** — the 2023 approved amendment changed the *tardiva* window
  from "da fine marzo a metà giugno" to **"da inizio marzo a metà giugno"**. Row should be 4→10,
  not 5→10.
- **Limone di Sorrento** — the 2010 amendment (OJ C 105, 24.04.2010), approved by OJ L 6,
  11.01.2011, moved the start forward a month: "è stata anticipata di un mese la data di inizio
  della raccolta dei limoni fissandola al 1° gennaio". Row should be 0→19, not 2→19.
- **Aglio Bianco Polesano** — the row cites a 2013 *proposal*. The approved 2014 amendment
  (OJ C 347, 03.10.2014) says "commercializzato per un anno a decorrere dal 10 luglio fino al
  9 luglio dell'anno successivo" — a full calendar year. True, and useless as an answer, exactly
  like Mela Alto Adige. **Delete.**
- **Carota Novella di Ispica** — *not* a correction. The 2010 EU text says 20 February, but a
  2017 approved amendment moved it back: "anticipare la data di raccolta indicata nel disciplinare
  dal 20 al 1° febbraio". The existing row (1 Feb) is current; the EU register's older text is not.

### New designations that state both ends

Found in approved texts and not yet in the dataset:

| Designation | Window stated | Note |
|---|---|---|
| Ficodindia dell'Etna PDO | 2ª decade agosto → dicembre | union of prima/seconda fioritura |
| Ficodindia di San Cono PDO | 20 agosto → 31 dicembre | union of agostani/tardivi |
| Fungo di Borgotaro PGI | 1 aprile → 30 novembre | a mushroom — catalogue fit is a judgement |
| Kiwi Latina PGI | fine ottobre → inizio novembre | ledger previously recorded this as start-only; wrong |
| Mela Val di Non PDO | agosto → prima quindicina di novembre | Trentino |
| Limone Costa d'Amalfi PGI | 1 febbraio → 31 ottobre | Salerno |
| Oliva Ascolana del Piceno PDO | 10 settembre → 20 ottobre | **Marche — a region with no coverage today** |
| Pescabivona PGI | prima metà di giugno → fine ottobre | maturation, four ecotypes |
| Pera dell'Emilia Romagna PGI | 25 luglio → 31 maggio | a commercialisation window, so `stored` |
| Radicchio di Chioggia PGI | 1 aprile → 15 luglio **and** settembre → marzo | two rows |
| Uva da tavola di Canicattì PGI | 3ª decade agosto → 2ª decade gennaio | wraps the year |
| Carota dell'Altopiano del Fucino PGI | luglio → settembre/ottobre | Abruzzo |
| Arancia del Gargano PGI | 15 aprile → fine agosto (Biondo comune) | must re-read for the other varieties |
| Asparago Bianco di Bassano PDO | 1 febbraio → 1 marzo, *coltura forzata o protetta* | would be the first `greenhouse` row |

### Checked and still unusable

- **Limone di Siracusa PGI** — three tipologie whose windows tile the entire year (Primofiore
  1 ott–14 apr, Bianchetto 15 apr–30 giu, Verdello 1 lug–30 set). Whole-year, so useless, on the
  Mela Alto Adige precedent.
- **Radicchio di Verona PGI** — two start dates (1 ottobre, 15 dicembre), no end.
- **Marrone di Caprese Michelangelo**, **Marrone di Roccadaspide**, **Marrone del Mugello**,
  **Marrone di Combai**, **Marrone di San Zeno**, **Melannurca Campana**, **Asparago verde di
  Altedo**, **Radicchio Rosso di Treviso**, **Radicchio Variegato di Castelfranco**,
  **Nocciola di Giffoni**, **Scalogno di Romagna** — re-confirmed start-only or end-only in the
  approved EU text. The earlier ledger entries stand.
- **Farina di Neccio della Garfagnana**, **Farina di castagne della Lunigiana** — both state a
  real chestnut harvest window, but the designation is a *flour*, not fresh produce.
- **Pesca di Verona** — re-confirmed: a commercialisation window with no statement of whether it
  is storage or field. Unchanged from the earlier decision.

### The publisher trade-off, and why it is not resolvable by picking harder

Three candidate publishers were tested. Each satisfies a different pair of the three things a
citation here has to be — **current**, **dated**, **permanent** — and none satisfies all three.

| Publisher | Current text? | Printed year? | Permanent URL? |
|---|---|---|---|
| **EUR-Lex / eAmbrosia** | not always — 14 designations have a later national modification | always (the OJ date) | yes |
| **MASAF** `IDPagina/3343` | yes — the ministry's own consolidated disciplinari | **no, for 87 of 117** | yes |
| **Gazzetta Ufficiale** | yes | yes | yes — but **unreachable** |

MASAF publishes the current disciplinare for all 129 products in class 1.6 as PDFs. 117 carry
extractable text; 12 are image scans. **87 of the 117 print no date of any kind** — they are bare
consolidated texts. Only 29 cite a Regulation year, 14 a decree date, 12 a GURI number, and 11
are Gazzetta prints carrying a browser timestamp. Invariant 3 therefore rejects most of them.

Gazzetta Ufficiale would resolve it — the decree is current, dated and officially published — but
`gazzettaufficiale.it` refuses automated requests. `ricercaSemplice` returns **"Request
Rejected"** from a WAF to both a plain HTTP client and a real browser under automation. The
search cannot be driven; individual atto URLs found via a general web search still resolve, so
the site is usable one document at a time, by hand.

**Independently of which publisher wins, the MASAF sweep proved the dataset's numbers are sound.**
Every disputed row was checked against the ministry's current text and confirmed as shipped —
Pesca di Leonforte (prima decade di agosto, not the EU text's settembre), Asparago di Badoere
(30 giugno, not 31 maggio), Pomodoro San Marzano (15 luglio–15 ottobre, not 30 luglio–30
settembre), Carota Novella di Ispica, Castagna Cuneo, Castagna di Vallerano, Ciliegia di Lari,
Ciliegia di Vignola, Ciliegia di Bracigliano, Limone Interdonato, Mela Rossa Cuneo, Melanzana
Rossa di Rotonda, Patata del Fucino, Patata novella di Galatina, Pomodorino del Piennolo,
Fichi di Cosenza, Fragola della Basilicata, Pesca di Delia. In every case where EUR-Lex and MASAF
disagree, MASAF is newer and the shipped row already matched MASAF.

### What the sweep found that is not yet shipped

The current MASAF disciplinari state **both ends** for roughly 25 designations absent from the
dataset. Of note, they reach four places the dataset cannot currently answer for at all:

- **Sardegna** — Carciofo Spinoso di Sardegna DOP, "dal 1° settembre al 31 maggio"
- **Umbria** — Patata Rossa di Colfiorito IGP, "dal 1° agosto fino a tutto il mese di novembre"
- **Marche** — Oliva Ascolana del Piceno DOP, "tra il 1° settembre ed il 20 ottobre"
- **Trapani** — Cappero di Pantelleria IGP, "dal 1° maggio al 31 ottobre di ciascun anno"

The last one matters editorially: `brief.md` states the job as making someone *"standing in a shop
in Trapani in March"* trust this page. The dataset has never had a row for Trapani.

Others with both ends stated: Aglio di Voghiera, Cappero delle Isole Eolie, Carciofo Brindisino,
Cedro di Santa Maria del Cedro (two windows), Fagioli Bianchi di Rotonda (two), Fagiolo Cannellino
di Atina, Ficodindia di San Cono, Lenticchia di Onano, Marrone di Combai (previously logged as
start-only — that was wrong), Marrone di Serino, Patata dell'Alto Viterbese (also previously
logged as unusable — wrong), Peperoncino di Calabria, Peperone di Pontecorvo, Pescabivona,
Radicchio di Chioggia (two), Mela Val di Non, Kiwi Latina, Limone Costa d'Amalfi, Fungo di
Borgotaro, Pera dell'Emilia Romagna, Uva da tavola di Canicattì, Ficodindia dell'Etna.

### Correction to the versioning rule above: *ordinary* modifications never get an OJ L

The rule stated earlier — "an OJ C is authoritative only once a later OJ L exists" — is right for
**Union (standard) amendments** and **wrong for ordinary ones**. Under art. 6 ter of delegated
regulation (UE) 664/2014, an *ordinary* modification is approved by the Member State and the
Commission merely publishes it for information. There is never an approving OJ L, so the
heuristic marks every one of them "pending" when in fact they are in force.

These publications are titled **"Comunicazione dell'approvazione di una modifica ordinaria di un
disciplinare di produzione"**, and they are the tier this dataset was missing: EU-published,
permanently addressable, printed with a date, **and** carrying the consolidated `epoca di
raccolta` rather than only a summary. They are the correct citation for every designation whose
current text comes from a recent Italian ordinary modification.

Worked example, now shipped — **Finocchio di Isola Capo Rizzuto**, OJ C C/2023/557 of 25.10.2023,
`https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=OJ:C_202300557`. It states the change
explicitly — precoce "dalla seconda decade di ottobre a metà febbraio" became "…a metà marzo",
tardiva "da fine marzo a metà giugno" became "da inizio marzo a metà giugno" — and repeats both
in the consolidated description. The national decree that approved it (DECRETO 9 aprile 2025, GU
Serie Generale n.89 del 16-04-2025, `gazzettaufficiale.it/eli/id/2025/04/16/25A02298/SG`) is
dated and fetchable but **does not contain the disciplinare text**, only the approval of it — so
GU alone can never satisfy invariant 4. The OJ C notice can, and does.

Note for anyone re-running the sweep: `gazzettaufficiale.it` refuses automated *search*, but its
**ELI permalinks fetch normally**. Find the atto id by web search, then fetch `/eli/id/...` directly.

### Deleted this pass

- **Albicocca Vesuviana** — not in the EU register at all (decision: delete).
- **Cicoria puntarelle molfettese** — status "Published", not registered (decision: delete).
- **Aglio Bianco Polesano** — the in-force text gives a full calendar year, "commercializzato per
  un anno a decorrere dal 10 luglio fino al 9 luglio dell'anno successivo". Useless as an answer,
  on the Mela Alto Adige precedent.
- **Limone di Sorrento** — **deleted, and this one is recoverable.** The window is certainly
  1 gennaio – 31 ottobre: MASAF's consolidated disciplinare says so outright, and the Union
  amendment approved by Reg. (UE) 14/2011 states "è stata anticipata di un mese la data di inizio
  della raccolta dei limoni fissandola al 1° gennaio". But *no single dated document states both
  ends*: OJ C 105 of 24.04.2010 gives only the start change and never mentions ottobre, and the
  registered 2001 specification still says 1 febbraio. Shipping 1 febbraio would be knowingly
  stale; shipping 1 gennaio would cite a document that does not say it. Deleted rather than
  softened. **Restore it the moment a consolidated dated text is located.**

### Corrected this pass

- **Finocchio di Isola Capo Rizzuto** — precoce 19→2 became 19→4, tardiva 5→10 became 4→10, now
  citing the OJ C ordinary-modification notice above.

### Where this leaves the dataset

30 designations, 33 windows, 30 sources. Rovigo, Bari and Barletta-Andria-Trani no longer answer;
Napoli still does, through Pomodorino del Piennolo and San Marzano.

### The next session's work, in order

1. **Re-source the remaining 29 rows.** For each, prefer in this order: an OJ C *modifica ordinaria
   approvata* notice; the registered specification on EUR-Lex; eAmbrosia's EU-hosted spec
   attachment. Six rows still cite a *proposal* rather than a text in force — castagna-monte-amiata,
   ciliegia-vignola, fragola-basilicata, patata-galatina, piennolo-vesuvio — and all of their
   windows were confirmed correct against MASAF, so only the citation needs moving.
2. **Add the ~25 new designations** listed above. Four of them open regions the tool has never
   answered for: Sardegna, Umbria, Marche, and Trapani.
3. The working corpus is in the session scratchpad: the full eAmbrosia register dump, 127
   per-designation dossiers, 53 EU-hosted specification PDFs, 109 OJ C documents, 117 recent
   publications and all 129 MASAF disciplinari, with extracted text alongside each.

---

## 2026-09-03 (second pass) — 25 designations added, four regions opened

### The rule that changed, and why

`Source.year` is now optional. The reason is a property of the corpus rather than a shortcut:
**for most designations no single dated document states a whole, current window.** The EU's
*documento unico* is a summary that usually drops the harvest clause — Ciliegia di Vignola,
Carciofo Spinoso di Sardegna and Cappero di Pantelleria all publish one that never mentions a
month — and an amendment then moves one endpoint without restating the other. Oliva Ascolana's
2025 ordinary modification says the start went "dal 10 al 1° settembre" and contains the word
*ottobre* zero times.

That leaves the ministry's consolidated disciplinare as the only document that is both whole and
current, and those print no date at all. So a source now either prints a year, or it is a
consolidated text and the reader is shown **the day it was consulted** instead. Two new tests
hold the line: a year that is present must be plausible, and a source may only omit one if its
name says *disciplinare* and its URL is `masaf.gov.it`.

Gazzetta Ufficiale was tried first and cannot work: **the decree approves the disciplinare
without containing it.** DECRETO 9 aprile 2025 for Finocchio di Isola Capo Rizzuto is dated,
official, permanently addressable — and states no harvest date, because the text it approves is
published elsewhere. GU can satisfy invariant 3 or invariant 4, never both at once.

### Added — 25 designations, 28 windows

Sourced from `masaf.gov.it/…/IDPagina/3343`, the ministry's index of disciplinari in force for
class 1.6, except **Ficodindia dell'Etna** and **Kiwi Latina**, which are cited to dated OJ
documents because the ministry's PDF for the first is an image scan and for the second omits the
harvest sentence.

Aglio di Voghiera · Cappero delle Isole Eolie · Cappero di Pantelleria · Carciofo Brindisino ·
Carciofo Spinoso di Sardegna · Cedro di Santa Maria del Cedro (2) · Fagioli Bianchi di Rotonda
(2) · Fagiolo Cannellino di Atina · Ficodindia dell'Etna · Ficodindia di San Cono · Fungo di
Borgotaro · Kiwi Latina · Lenticchia di Onano · Limone Costa d'Amalfi · Marrone di Combai ·
Marrone di Serino · Mela Val di Non · Oliva Ascolana del Piceno · Patata dell'Alto Viterbese ·
Patata Rossa di Colfiorito · Peperoncino di Calabria · Peperone di Pontecorvo · Pera dell'Emilia
Romagna (`stored`) · Pescabivona · Radicchio di Chioggia (2).

Two earlier ledger entries were wrong and are corrected here: **Marrone di Combai** ("dal 15
settembre al 15 novembre") and **Patata dell'Alto Viterbese** ("tra 15 giugno e 30 settembre")
were logged as unusable; the current disciplinari state both ends of each.

### Where it leaves the dataset

61 windows, 55 designations, 55 sources, **55 of 107 provinces**, and **16 of 20 regions**, up
from 13. Sardegna, Umbria and Marche answer for the first time. So does **Trapani**, which the
brief names as the shop the whole tool is aimed at.

Still silent: **Friuli-Venezia Giulia, Liguria, Molise, Valle d'Aosta.** Liguria's nearest miss
is Olive Taggiasche Liguri IGP, which fixes only an end ("entro il 31 marzo"); Friuli's is
Brovada DOP, whose turnip harvest window is stated but whose designation is a fermented product
rather than fresh produce.

### Not done, still queued

Re-sourcing the 29 rows inherited from `disciplinare.it`. Five of them still cite a *proposal*
rather than a text in force — castagna-monte-amiata, ciliegia-vignola, fragola-basilicata,
patata-galatina, piennolo-vesuvio — and every one of their windows was confirmed correct against
MASAF, so only the citation needs moving. Prefer, in order: an OJ C *modifica ordinaria
approvata* notice; the registered specification on EUR-Lex; the ministry's consolidated text.

---

## 2026-09-03 (third pass) — off the aggregator entirely

**No source points at `disciplinare.it` any more.** All 54 now resolve to `eur-lex.europa.eu` or
`www.masaf.gov.it`, and a test rejects any other host, so the page can no longer lose its entire
evidence base to one commercial site going away.

The split, decided per row rather than by preference:

- **9 to EUR-Lex** (`oj`), where a dated EU document states the whole shipped window verbatim:
  Asparago Bianco di Bassano (OJ C 321, 2006), Carciofo di Paestum (C 153, 2003), Carciofo
  Romanesco del Lazio (C 51, 2002), Castagna di Vallerano (C 190, 2008), Limone Interdonato
  Messina (C 74, 2009), Patata della Sila (C 33, 2010), plus Ficodindia dell'Etna, Kiwi Latina and
  Finocchio di Isola Capo Rizzuto from earlier passes.
- **45 to MASAF** (`masaf`), the ministry's consolidated disciplinare, where no dated document
  states a current whole window.

All 54 URLs were fetched and returned 200/202 on 2026-09-03.

### Rows where the dated EU text was rejected in favour of the ministry's

Citing EUR-Lex would have shipped a window we know is superseded:

| Designation | EU text says | In force says |
|---|---|---|
| Asparago di Badoere | tra il primo febbraio e il **31 maggio** (C 22, 2010) | …e il **30 giugno** |
| Carota Novella di Ispica | a partire dal **20 febbraio** (C 122, 2010) | dal **1° febbraio** |
| Pesca di Leonforte | dalla prima decade di **settembre** (C 266, 2009) | prima decade di **agosto** |
| Pomodoro San Marzano | tra il **30 luglio** ed il **30 settembre** (C 73, 2010) | tra il **15 luglio** ed il **15 ottobre** |

### Two rows the text in force no longer supports

Re-reading the current disciplinare — rather than trusting a correctly-converted row — cost two
entries. This is the failure mode the per-designation loop now warns about.

- **Mela di Valtellina — deleted, both rows.** The current disciplinare has no harvest calendar at
  all. §5.6 Raccolta fixes only a ripeness criterion ("L'inizio del periodo di raccolta coincide
  con il momento in cui la mela raggiunge la maturazione ottimale"), and the per-variety table the
  old row quoted is gone. §5.7 Conservazione gives a storage **end** with no start ("si conclude
  entro la fine del mese di luglio dell'anno successivo per la varietà Gala"), which is half a
  window. Sondrio no longer answers. The ministry's PDF is an image scan; this was read by
  rendering the pages.
- **Asparago Bianco di Cimadolmo — window moved, 5→9 became 4→9.** The text in force says only
  "I primi turioni si raccolgono in marzo"; the version the row used to cite said "in marzo (il
  venti circa)". The end, "non deve in ogni caso protrarsi oltre il 30 maggio", is unchanged.

**Castagna del Monte Amiata** was checked the same way and confirmed: "La raccolta dei frutti deve
avvenire tra settembre e novembre di ogni anno", exactly the shipped 16→21.

### Where it leaves the dataset

59 windows, 54 designations, 54 sources, 54 of 107 provinces, 16 of 20 regions. Every citation is
a publisher of record; none is a proposal.

---

## 2026-09-03 (fourth pass) — the modelled tier was built, measured, and not shipped

Full write-up and the runnable model in `.pipeline/seasonable/model/`.

The chill-and-heat model works: Dynamic model chill portions, Growing Degree Hours to bloom, then
degree-days from bloom to maturity, driven by ERA5 1991–2020 at each province capital. Its outputs
are physically sensible — Cuneo latest, Cosenza earliest, Enna at 931 m later than Agrigento at
230 m.

It fails the gate the plan set for it. Leave-one-out against the documented tree-fruit rows, next
to a baseline that ignores climate entirely:

| species | n | model | ignore climate |
|---|---|---|---|
| cherry | 3 | 0.15 half-months | **0.00** |
| chestnut | 5 | 1.24 half-months | **0.59** |
| peach | 3 | 2.80 half-months | 3.00 |

**No species both passes the gate and beats doing nothing.** Cherry passes but the model only adds
error; chestnut and peach fail outright.

The cause is in the documented data rather than in the model. Three cherry designations 450 km
apart — Bracigliano, Lari, Vignola — carry **identical** windows, while three peach designations
inside one Sicilian climate spread across **five half-months**. A designation's window is the union
over the cultivars it admits, and that union is set by the consortium, not the weather. Cultivar
beats geography by roughly five to one, and there is no cultivar map to give the model.

Two consequences worth carrying forward:

1. **The schema changes were reverted.** `Window.basis`, `Source.role` and a nullable
   `Produce.designation` were written and then backed out: a two-valued discriminant with one value
   in use advertises a plan the evidence has retired.
2. **It qualifies the page's own argument.** `brief.md` holds that a calendar "is wrong the moment
   it covers more than one climate at a time". For tree fruit at species level our evidence does not
   support that — a national constant was the best predictor available. What makes this tool
   per-province is that **designations are tied to comuni**, not that harvest responds sharply to
   local climate. Anyone extending the per-province claim to a new tier should measure it first.

The obvious next tier, and the one the evidence *does* support, is a species-level window
generalised from the designations already cited, carrying its cross-validated error — cherry would
ship as 1 May–31 July with a measured leave-one-out error of 0.00 half-months. That is not the
modelled tier and it is close to the "widely reported" tier `brief.md` rejected, so it is a
decision rather than a step.

---

## 2026-09-03 (fifth pass) — the generalised tier: two species, measured

The modelled tier failed because climate does not drive a species' window; the *documents*
turned out to. Three cherry designations 450 km apart state the same six half-months. That is a
fact worth shipping, so it is shipped — as its own tier, marked as such.

### The rule, and it is measured rather than chosen

A species earns a generalised window only if all three hold:

1. **At least three documented designations** for that species.
2. **Leave-one-out coverage of 100%** — the union of any subset contains the held-out designation.
3. **Union no more than one half-month wider than the mean designation it generalises.** A
   generalisation materially wider than its parts has thrown away the answer.

| species | n | union | width | mean part | LOO | verdict |
|---|---|---|---|---|---|---|
| cherry | 3 | 8→13 | 6 | 6.0 | 3/3 | **ships** |
| chestnut | 6 | 16→21 | 6 | 5.0 | 6/6 | **ships** |
| peach | 3 | 9→20 | 12 | 9.0 | 1/3 | fails 2 and 3 |
| potato | 5 | 4→21 | 18 | 7.8 | 4/5 | fails 2 and 3 |
| artichoke | 4 | 16→9 | 18 | 12.5 | 3/4 | fails 2 and 3 |
| asparagus | 5 | 0→19 | 20 | 9.4 | 4/5 | fails 2 and 3 |

Peach is the instructive failure: its three designations share one Sicilian climate and still
spread across five half-months, so the union of any two never contains the third. Potato spans
March to November once Galatina's *novella* meets Sila's mountain crop. Asparagus is broken by
Canino, which is forced under plastic and picked from January.

### Scoped to the region, not the country

A generalised row is offered only to provinces **in a region where at least one of its
designations sits**. Cherry therefore reaches the rest of Campania, Toscana and Emilia-Romagna;
chestnut reaches the rest of Piemonte, Veneto, Toscana, Lazio and Campania. It is not offered to
Sicily or Sardinia, because nothing in the corpus says sweet cherry or chestnut is commercially
grown there, and this tier must not start answering *whether* a thing grows somewhere. It answers
only *when* it is picked. The row says exactly that, in both languages.

### What it cost and what it bought

- `Window.source` became `Window.sources`, an array, because a generalised row genuinely rests on
  every designation it unions and the reader can follow all of them. `Entry.sources` and
  `sourcesOf` follow.
- `Produce.designation` became nullable, for the two species entries.
- `Window.basis` distinguishes `documented` from `generalised`, and three new tests hold the line:
  a species entry may only carry a generalised window and a designation may only carry a
  documented one; a generalised window must be exactly the union of the designations it cites,
  from at least three of them; and no province may ever render a generalised row beside a
  documented one for the same kind of thing.

**73 of 107 provinces now answer, up from 54.** 34 are still silent. Designations remain 54;
the two species entries are not designations and are not counted as such anywhere.

---

## 2026-09-03 (sixth pass) — Sondrio cannot be answered, and here is the proof

**Sondrio stays silent, and the reason is now citable rather than inferred.**

Only one class-1.6 designation covers the province: **Mela di Valtellina PGI-IT-0574**, whose art. 3
lists Sondrio and forty-odd Valtellina comuni and nothing else. Every other corpus was swept for
"Sondrio" — 129 MASAF disciplinari, 53 EU-hosted specifications, 109 OJ C documents, 117 later
publications — and only Valtellina's own papers mention it.

That designation stopped stating a harvest window in 2020. The minor modification published as
**Ares/eAmbrosia attachment 64047 (22 June 2020)**, approved by the Commission, quotes the clause it
deleted:

> «…la raccolta è eseguita mediante un accurato stacco manuale delle mele e secondo il seguente
> calendario: Red Delicious: seconda decade di settembre-seconda decade di ottobre. Golden
> Delicious: seconda decade di settembre-fine ottobre. Gala: seconda decade di agosto-seconda decade
> di settembre.» **È modificato come segue:** «L'inizio del periodo di raccolta coincide con il
> momento in cui la mela raggiunge la maturazione ottimale stabilita con i criteri di cui all'art.2…»

So the calendar was replaced by a ripeness criterion. Art. 2 was checked and defines brix, firmness
and colour — no dates. §5.7 Conservazione gives an end ("fine luglio / fine agosto dell'anno
successivo") with a start of "dalla raccolta", which is half a window. **The row deleted in the
third pass was quoting a text that ceased to be in force in 2020; that deletion is confirmed
correct.**

The generalised tier cannot reach Sondrio either. It needs three documented designations for a
species; apple has **two** open-field windows in the whole register — Mela Val di Non and, as of
this pass, Mele del Trentino — and both are in Trentino, so even a relaxed scope would not reach
Lombardia. Melannurca Campana states only an end, Mela Alto Adige spans the whole year, Mela Rossa
Cuneo is a commercialisation window.

Answering Sondrio would take two rule changes at once: dropping the generalised tier's n≥3 to n=2,
which makes leave-one-out meaningless, **and** scoping a species to regions where it has a
designation *without a window*. Both were declined.

### The sweep had a gap, and it cost two designations

The earlier filter required a range word from a fixed list and missed the construction
**"non può essere iniziata prima del X e non può terminare dopo il Y"**. Re-running it with
`prima`, `dopo`, `terminare`, `non può` added found two designations that state both ends:

- **Mele del Trentino IGP** — "La raccolta non può essere iniziata prima del 20 luglio e non può
  terminare dopo il 15 dicembre" → 13→22, the whole Provincia autonoma di Trento.
- **Arancia di Ribera DOP** — "per la varietà Navelina inizia il 1° novembre e termina alla fine di
  febbraio; per le varietà Brasiliano e Washington navel inizia nella prima decade di dicembre e
  termina alla fine di maggio" → union 20→9, Agrigento and Chiusa Sclafani in **Palermo**, a
  province that answered nothing before.

56 designations, 61 documented windows, **74 of 107 provinces**, 16 of 20 regions.

---

## 2026-09-03 (seventh pass) — the widened sweep, run over everything

Re-run permissively across all 82 designations not yet shipped: any sentence tying a harvest word
to two distinct month names, with no requirement on the connecting phrase. 36 designations produced
a candidate, 21 of them naming two months. Almost all resolved to things already checked. Two did
not, and one of those is a mistake of mine.

### Restored — Limone di Sorrento

**Deleted in the third pass for a reason that stopped being true in the fifth.** It went because no
single *dated* document stated both ends. Once `Source.year` became optional and the ministry's
consolidated text became a citable publisher, the obstacle was gone — and I did not go back for it.
The consolidated disciplinare says plainly:

> «La raccolta va effettuata nel periodo che va dal 1° gennaio al 31 ottobre»

0→19, Napoli. The 2010 Union amendment (OJ C 105, approved by Reg. (UE) 14/2011) is what moved the
start from February to January; the ministry's text is where both ends now sit in one sentence.

**The lesson worth keeping: when a sourcing rule is relaxed, re-run the rejections.** Nothing did
that automatically, and one good row sat deleted for two passes.

### Added — Marrone della Valle di Susa IGP

> «il periodo di raccolta ha inizio al 20 di settembre per concludersi il 10 novembre»

17→20, provincia di Torino. It becomes the **seventh** chestnut designation, and is added to the
generalised chestnut row's parts; its window sits inside the existing union, so 16→21 is unchanged.
Torino now answers from a document, so it drops out of the generalised row's province list.

### Checked and still not usable

- **Castagna di Montella** — the scan is readable after all, and art. 5 says «Il prodotto fresco può
  essere immesso al consumo a partire dal 4 ottobre dell'anno di produzione». A start, no end. The
  existing verdict stands.
- **Castagna di Roccamonfina** — «le castagne vengono raccolte a terra dopo la loro naturale caduta
  dalle piante». No dates at all.
- **Brovada DOP** states both ends twice — rape harvest «dal 1° settembre … entro il 31 dicembre»,
  and consumption «dal 26 di settembre … il 15 maggio». It is the only route into
  **Friuli-Venezia Giulia**, and it is excluded only because the designation is a fermented product
  rather than fresh produce, like Farina di Neccio and Amarene Brusche. That is a judgement, not a
  fact, and it is the one worth revisiting if Friuli matters more than the rule.
- **Nocciola Romana**, **Pistacchio di Raffadali**, **Pistacchio Verde di Bronte** state both ends
  and are nuts; **Farro di Monteleone di Spoleto** is a cereal. All excluded on the same standing
  grounds as Nocciola del Piemonte.

### The image scans

Eleven MASAF PDFs yield no text. They are readable by rendering the pages, which was not tried
before. **None of the seven unshipped ones covers a province that does not already answer**, so
reading them adds products rather than coverage: Arancia Rossa di Sicilia, Uva da tavola di
Canicattì, Fico Bianco del Cilento, Cipollotto Nocerino, Fagiolo di Sarconi, Fagiolo di Sorana,
Fagiolo Cuneo. Montella was read and is negative. The rest are an open, low-priority seam.

58 designations, 63 documented windows, 2 generalised, **74 of 107 provinces**, 16 of 20 regions.

---

## 2026-09-03 (eighth pass) — the four silent regions, closed out

Every remaining region was worked to a verdict rather than left as "no coverage". None can be
answered from the class-1.6 corpus as the rules currently stand, and two are one judgement away.

### Valle d'Aosta — nothing exists

No DOP or IGP in class 1.6 names any Valdostan comune. Not a gap in our reading; there is no
designation to read.

### Molise — nothing exists

Same. The only apparent hit, Fagiolo Cannellino di Atina, mentions Isernia solely as a road name
in its boundary description: «il ponte della Strada Provinciale Roccasecca – Isernia». Its zone is
Frosinone.

### Liguria — two candidates, both blocked

- **Olive Taggiasche Liguri IGP** — «La raccolta … deve essere effettuata **entro il 31 marzo** di
  ogni anno». An end with no start. Unusable, and unchanged from the earlier check.
- **Basilico Genovese DOP** — the interesting one. Its zone is the whole Tyrrhenian slope of the
  region, so it would answer for all four Ligurian provinces at once. But it states no field window
  at all: the only temporal clauses are «in ambiente protetto la coltivazione può essere svolta
  **tutto l'anno**» and a 31 January reporting deadline.

  A whole-year window is what the Mela Alto Adige precedent rejected as true and useless. **This
  one may not be the same case.** Alto Adige's year was a commercialisation artefact for a fruit
  nobody picks in February; Genoese basil under glass genuinely is cut every week of the year, and
  the honest answer to "is this being picked near me now" in Genova is yes, always, under
  protection. Shipping it would also give `greenhouse` — a kind kept in the type and deliberately
  never used — its first and entirely accurate row.

### Friuli-Venezia Giulia — Brovada, and only Brovada

**Brovada DOP** states both ends twice: the turnips «dal 1° settembre … entro il 31 dicembre», and
consumption «dal 26 di settembre … il 15 maggio». It is excluded on one ground only — the
designation protects a fermented product, not fresh produce, the same rule that excluded Farina di
Neccio, Farina di castagne della Lunigiana and Amarene Brusche di Modena.

### The register holds no surprises

The EU register's 127 registered Italian class-1.6 designations were diffed against MASAF's index of
129. The two apparent gaps were both artefacts of name matching — «Pomodoro S. Marzano» against
«Pomodoro San Marzano», and «Peperone di Senise» against «Peperoni di Senise». Senise was read and
gives a ripeness criterion, not dates: «a partire dal momento in cui le bacche raggiungono la
maturazione commerciale … e fino al termine della produzione della pianta».

### What is left

Seven unread image-scan disciplinari: Arancia Rossa di Sicilia, Uva da tavola di Canicattì, Fico
Bianco del Cilento, Cipollotto Nocerino, Fagiolo di Sarconi, Fagiolo di Sorana, Fagiolo Cuneo.
They are readable by rendering the pages. **None covers a province that is currently silent**, so
they add products, not reach. That is the whole of the remaining seam in this corpus.

---

## 2026-09-05 (ninth pass) — the image scans, read at last; `greenhouse` gets its first row

The eighth pass left "seven unread image-scan disciplinari" as the whole remaining seam and
judged them a low priority because **"none covers a province that does not already answer"**.
That judgement was wrong about one of them, and stale about three others.

**Three of the seven are no longer image scans.** MASAF has replaced them with `.docx` files —
Arancia Rossa di Sicilia (listed *31.03.2026*), Fagiolo Cuneo (*12/01/2026*) and Uva da tavola di
Canicattì. Their text extracts cleanly. The remaining four were rendered at 150 dpi and read.

Three more designations were pulled in the same pass because the second-pass sweep had listed them
as stating both ends and they were never worked: Arancia del Gargano, Carota dell'Altopiano del
Fucino, and the *coltura protetta* clause of Asparago Bianco di Bassano.

### Shipped — two designations, three windows

**Arancia del Gargano IGP** — and it opens **Foggia**, a province that answered nothing. So the
eighth pass's "adds products, not reach" was not true of this one. §5.7:

> «L'epoca di raccolta, data la naturale e accentuata scalarità di maturazione dell'Arancia del
> Gargano è così stabilita: - 15 aprile - fine agosto per il Biondo Comune del Gargano; - 1
> dicembre - 30 aprile per la Duretta del Gargano.»

Two cultivars, so invariant 8 applies and the row is the union. Biondo Comune 6→15, Duretta 22→7;
the two overlap at 6–7, so the union is one contiguous wrapping run, **22→15**. Zone is art. 3:
Vico del Gargano, Ischitella and Rodi Garganico — **Foggia**.

**This is the widest row in the dataset — 18 of 24 half-months — and that deserves saying out
loud.** It is not the Mela Alto Adige case: that was a *commercialisation* span for a fruit nobody
picks in February, and this is the document's own «epoca di raccolta» for two cultivars that are
genuinely picked at opposite ends of the year. It is wide because Gargano citrus is wide — the
disciplinare says as much two pages later, boasting that its oranges ripen «non gennaio, febbraio o
marzo, ma addirittura fine aprile-maggio, e anche agosto». A reader who opens the row sees both
cultivar clauses. Still: if a later pass wants a rule against unions spanning more than ~15
half-months, this is the row that would test it.

**Fagiolo Cuneo IGP** — the new `.docx`, art. 5:

> «L'epoca di raccolta va da maggio a novembre.»

**8→21**, provincia di Cuneo. Whole months, no days, so no decade snap. Cuneo already answered;
this adds density.

**Asparago Bianco di Bassano DOP — the first `greenhouse` row in the dataset.** The kind has been
in the type since the beginning and has never had a row. The clause was in the sentence
immediately after the one already shipped, and the second pass took only the first half:

> «Il periodo di raccolta deve essere compreso tra il 1 marzo ed il 15 giugno. Le produzioni in
> **coltura forzata o protetta (tunnel)** possono essere raccolte prima della suddetta data e
> comunque **non prima del 1 febbraio** previa autorizzazione dell'organismo di controllo.»

A second window on the same designation, **2→3** (1–28 February), `kind: 'greenhouse'`, citing the
same source — the Finocchio di Isola Capo Rizzuto precedent, where one document yields two windows
and is cited once. The open-field row 4→10 is unchanged.

The clause was read in the ministry's PDF, but the row is cited to the **dated** EU text already in
`sources.ts` — OJ C 321 of 2006, CELEX 52006XC1229(04) — which was re-opened and carries the
sentence verbatim. So the first greenhouse row in the dataset does not spend the undated-source
licence, and the reader gets a year rather than a consulted date.

This is invariant 8's failure mode in its other form: not a semicolon this time, but a full stop.
The quote was accurate, the conversion was correct, and the row was still incomplete.

### Silent — six, and two of them used to say more than they do now

- **Uva da tavola di Canicattì IGP** — the second-pass sweep recorded «3ª decade agosto → 2ª decade
  gennaio». **That clause is not in the text in force.** The current `.docx` contains no month name
  anywhere; harvest is «al raggiungimento delle caratteristiche qualitative e organolettiche
  previste all'articolo 2». Exactly the Mela di Valtellina pattern — a calendar replaced by a
  ripeness criterion — and the second reason in this ledger to distrust a candidate recorded from
  a document that is not the one in force.
- **Carota dell'Altopiano del Fucino IGP** — same. The sweep recorded «luglio → settembre/ottobre»;
  the ministry's text says «La raccolta è praticata valutando gli stadi di maturazione più idonei».
  Its only months are «durante il periodo estivo (luglio, agosto) la raccolta si effettua nelle
  prime ore del mattino» — an instruction about the time of day, not the time of year.
- **Arancia Rossa di Sicilia IGP** — the 31.03.2026 text contains **no month name at all**. The
  earlier verdict stands, now against a current document.
- **Cipollotto Nocerino DOP** — «I Cipollotti vengono raccolti … quando il diametro della sezione
  normale all'asse del bulbo presenta il calibro tra cm 1-5», and «La semina può essere effettuata
  tutto l'anno». A calibre, not a date. Peperone di Senise's case exactly.
- **Fagiolo di Sarconi IGP** — «Raccolta» gives three maturity stages (verde, cerosa, secco) and no
  dates. Sowing is dated («scalare, dalla terza decade maggio fino a metà luglio») and sowing is
  not harvest; deriving one from the other is invariant 5.
- **Fagiolo di Sorana IGP** — «La raccolta è effettuata a mano dalla pianta, al momento della quasi
  deiscenza delle valve dal baccello». Its two dates, 31 maggio and 31 ottobre, are the deadlines
  for filing a cultivation declaration and a yield declaration. Reporting deadlines, like Basilico
  Genovese's 31 January.

### Excluded — one

- **Fico Bianco del Cilento DOP** — «riservata ai fichi **essiccati**», and art. 5 gives a ripeness
  criterion («quando i fichi sono stramaturi») rather than dates. Excluded twice over: a dried
  product on the Farina di Neccio / Amarene Brusche rule, and silent anyway.

### Where this leaves the dataset

**60 designations, 66 documented windows, 2 generalised, 75 of 107 provinces, 17 of 20 regions.**
Puglia gains its third province. `greenhouse` is no longer a kind with no rows, so the calendar's
three geometries all appear on the page.

The image-scan seam is now **closed**: all four true scans were read and all four are silent.

### What is left, honestly

Nothing cheap. The corpus of 127 class-1.6 designations has been swept four times, and what
remains unshipped is unshipped for a stated reason. The two live judgement calls are unchanged and
both belong to Walter, not to a sweep:

1. **Basilico Genovese DOP** — «in ambiente protetto la coltivazione può essere svolta tutto
   l'anno». Would open Liguria's four provinces at once. Now slightly easier to argue than it was:
   `greenhouse` has a row, so a year-round protected-culture window would no longer be introducing
   a kind and a whole-year span in the same change.
2. **Brovada DOP** — the only route into Friuli-Venezia Giulia, excluded solely for being a
   fermented product.

Beyond those, more coverage means a different tier of source, which is open question 1 in
`brief.md` and was resolved against.
