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

**60 designations, 66 documented windows, 2 generalised, 75 of 107 provinces, 16 of 20 regions.**
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

---

## 2026-09-05 (tenth pass) — Basilico Genovese, shipped; Liguria opens

Walter's call, on the judgement the eighth pass left open. Recording what the decision actually
rests on, because **the eighth pass had read the document wrong** and the case is better than the
one it declined.

### The clause the earlier check missed

The eighth pass recorded that Basilico Genovese «states no field window at all: the only temporal
clauses are «in ambiente protetto la coltivazione può essere svolta tutto l'anno» and a 31 January
reporting deadline.» That is not what the disciplinare says. **Art. 3 is titled «Zone ed epoca di
produzione»** and closes:

> «Le produzioni sono realizzabili durante **tutto l'arco dell'anno**.»

So the designation states an *epoca di produzione* of its own, for the designation as such, and it
is the whole year. The whole-year claim is the document's, not an inference from a sentence about
greenhouse ventilation. That distinction is the entire difference between this row and Mela Alto
Adige, whose year was a commercialisation span for a fruit nobody picks in February.

### Why the row is `greenhouse` and not `open-field`

The cultivation article allows both environments — «in ambiente protetto e in pieno campo» — but
gives only one of them a year:

> «In ambiente protetto la coltivazione può essere svolta tutto l'anno purché venga assicurata una
> ventilazione continua 24 ore/giorno…»

Open field gets no window of its own anywhere in the text. Art. 3's «tutto l'arco dell'anno» is
what the two environments *together* make possible, and splitting it into an open-field January
would be a modelled number. So: one row, `kind: 'greenhouse'`, **0→23**, and the reader who opens
it sees both clauses.

This is the second greenhouse row, after Asparago Bianco di Bassano in the ninth pass. The order
mattered: shipping a whole-year span and introducing a kind in the same change would have been two
arguments at once, which is why the eighth pass was right to hold it and why it is easier now.

### Zone

> «delimitata al solo versante tirrenico del territorio amministrativo della Regione Liguria con
> delimitazione individuabile nello spartiacque»

The Tyrrhenian slope, cut at the watershed. All four Ligurian provinces hold territory on it, so
the row answers for **Genova, Imperia, La Spezia and Savona** — every one of which was silent.
**Liguria comes off the list of regions that answer nothing.**

### The date, and why it is still `accessed`

Unusually for a MASAF consolidated text, this PDF is stamped on every page:

> «MASAF - PQA I - Prot. Uscita N.0100000 del 04/03/2025»

That is a protocol registration for the outgoing transmission, not a publication line, and no other
MASAF citation in `sources.ts` carries a year. Recording 2025 would make this one row's provenance
read differently from its fifty-nine neighbours on the strength of a stamp whose meaning is
administrative. **Omitted, consulted date shown instead** — but written down here, because if a
later pass decides those protocol stamps are datable after all, this is the row to start from.

### The one thing that does not fit, said plainly

**Basil is a herb, and the page's copy promises «frutta e verdura» in both languages.** `brief.md`
scoped the catalogue to fruit and vegetables and named the exclusions. Basil is not in that list,
but neither is it obviously in scope.

It ships as `category: 'vegetable'` on the Fungo di Borgotaro precedent — a mushroom, which the
brief *does* exclude by name, and which was shipped anyway when the catalogue moved from everyday
produce to protected designations. The scope line was written for the 45-item everyday plan that
open question 1 resolved and the implementation then abandoned. Two rows now sit outside it. That
is worth either fixing in the copy or fixing in the catalogue, and it should not be settled by a
third row quietly joining them.

### Where this leaves the dataset

**61 designations, 67 documented windows, 2 generalised, 79 of 107 provinces, 17 of 20 regions.**
28 provinces silent, so the copy's «a third» became «a quarter» in both languages.

Three regions still answer nothing. **Valle d'Aosta** and **Molise** were proved empty rather than
unread — no class-1.6 designation names a comune in either — so they are finished, not pending.
**Friuli-Venezia Giulia** is the last one that is one judgement away, on Brovada, excluded solely
for being a fermented product.

---

## 2026-09-05 (eleventh pass) — Brovada, shipped; Friuli opens; the fresh-produce rule is now spent

Walter's call on the second of the two standing judgements. It ships, and **the rule it breaks was
load-bearing for three other designations**, so this entry records the debt rather than leaving it
for someone to trip over.

### What ships

> «La raccolta delle rape deve iniziare a partire dal 1° settembre e quando le foglie basali della
> rapa ingialliscono e appassiscono e deve concludersi entro il 31 dicembre.»

**16→23**, `open-field`. Art. 3 puts the zone in **Gorizia, Pordenone and Udine** — named comuni
below 1 200 m. All three were silent. **Trieste is not in the zone and stays silent.**

**Friuli-Venezia Giulia comes off the list.** 82 of 107 provinces, 18 of 20 regions.

### Which of its three windows, and why

The disciplinare states three date ranges and only one of them is a harvest:

| Clause | What it is | Shipped? |
|---|---|---|
| «La semina avviene in modo scalare esclusivamente dal 15 giugno al 30 di agosto» | sowing | no — invariant 5 |
| «La raccolta delle rape … dal 1° settembre … entro il 31 dicembre» | the turnip harvest | **yes** |
| «L'immissione al consumo … a partire dal 26 di settembre … il 15 maggio» | sale of the fermented product | no |

The row answers "is this being picked near me", so it is the middle one. The third is the
designation's *own* availability and is a better description of when you can buy Brovada — but it
is a commercialisation window for a jar, not a harvest, and the page does not answer that question
for anything else either.

### The honest weakness, stated once

**The row is named for a fermented product and carries a window for its input.** A reader in Udine
sees "Brovada DOP · al picco" in October, and what is actually at its peak is the *rapa da
brovada*, a local white turnip with a purple collar. The expanded row quotes «La raccolta delle
rape…», so nothing is hidden — but the name on the closed row is doing something the other
sixty-one rows do not.

That is the cost of the decision, and it was taken with the cost visible.

### The three designations this reopens

Brovada was excluded on one ground: the designation protects a processed food rather than fresh
produce. That ground also excluded three others, and all three were re-read this pass. **All three
state a fresh-crop harvest window, and all three are now excluded by nothing.**

| Designation | Clause | Half-months | Province |
|---|---|---|---|
| **Amarene Brusche di Modena IGP** | «La raccolta viene effettuata nel periodo compreso dal 20 maggio al 31 luglio» | 9→13 | Modena — already answers |
| **Farina di Castagne della Lunigiana DOP** | «La raccolta delle castagne deve avvenire a partire da settembre … e fino al 15 dicembre» | 16→22 | Massa-Carrara — already answers |
| **Farina di Neccio della Garfagnana DOP** | «La raccolta delle castagne deve avvenire tra il 1° ottobre e il 30 novembre di ogni anno» | 18→21 | Lucca — check art. 3 before shipping |

None of them opens a new province, so they are density rather than reach — and two are chestnut,
where the catalogue already carries seven designations and a generalised row whose union they would
have to be checked against.

**They are not shipped.** Consistency now argues for it and that is exactly why it should be a
decision rather than a consequence: the same argument would have shipped them silently in this
pass, and a rule that dissolves by momentum is worse than one that is repealed on purpose.

Fico Bianco del Cilento does **not** reopen. It was excluded twice over in the ninth pass, and the
second ground stands: art. 5 gives «quando i fichi sono stramaturi», a ripeness criterion, not
dates.

### Where this leaves the dataset

**62 designations, 68 documented windows, 2 generalised, 82 of 107 provinces, 18 of 20 regions.**

Only **Valle d'Aosta** and **Molise** answer nothing, and neither is pending: no class-1.6
designation names a comune in either, which was proved in the eighth pass and re-confirmed against
the register. **There is no third judgement call left.** What remains is the three above, and a
question the copy has been carrying since the ninth pass — that «frutta e verdura» now covers a
mushroom, a herb and a fermented turnip.

---

## 2026-09-05 (twelfth pass) — the three the eleventh pass reopened, shipped

Walter's call. The rule that held them out was spent on Brovada, so all three ship, and the
generalised chestnut row had to be re-measured rather than left alone.

| Designation | Clause | Window | Provinces |
|---|---|---|---|
| **Amarene Brusche di Modena IGP** | «La raccolta viene effettuata nel periodo compreso dal 20 maggio al 31 luglio, tenuto conto dell'epoca di maturazione delle singole varietà presenti nel frutteto» | 9→13 | **Modena and Bologna** — art. 3 names twelve Bolognese comuni as well |
| **Farina di Castagne della Lunigiana DOP** | «La raccolta delle castagne deve avvenire a partire da settembre … e fino al 15 dicembre» | 16→22 | Massa-Carrara |
| **Farina di Neccio della Garfagnana DOP** | «La raccolta delle castagne deve avvenire tra il 1° ottobre e il 30 novembre di ogni anno» | 18→21 | Lucca |

Bologna was not expected — the eleventh pass had guessed Modena alone. It changes nothing about
coverage (both already answered) but it is why art. 3 gets read rather than inferred from a name.

### Amarena is not cherry

`en: 'sour cherry'`, not `'chestnut'`-style reuse of the existing key. *Prunus cerasus* is a
different species from the *Prunus avium* of Vignola, Lari and Bracigliano, and `en` is what drives
the generalised tier: filing amarena under `cherry` would have made it a part of the generalised
cherry row and moved a union that three sweet-cherry designations currently agree on to the
half-month. It gets its own glyph too — one fruit and a leaf, against sweet cherry's pair — because
two rows that the model treats as different species must not read as the same thing.

### The generalised chestnut row, re-measured

Both flours carry chestnut harvest windows, so both are `en: 'chestnut'` and the tier's rule had to
be re-run over nine designations rather than seven.

| set | n | union | width | mean part | LOO |
|---|---|---|---|---|---|
| as shipped before this pass | 7 | 16→21 | 6 | 4.9 | 7/7 |
| + Neccio | 8 | 16→21 | 6 | 4.8 | 8/8 |
| + Lunigiana | 8 | **16→22** | 7 | 5.1 | **7/8** |
| all nine | 9 | **16→22** | 7 | 5.0 | **8/9** |

**Neccio is cited; Lunigiana is not.** At 16→22 Lunigiana is the only chestnut designation reaching
the second half of December, so including it widens the union by a half-month that rests on one
document and drops leave-one-out to 8/9 — the exact failure that keeps peach, potato, artichoke and
asparagus out of this tier.

This is a choice and it should be argued with rather than assumed: the alternative reading is that
a generalised row must union *every* same-species designation, in which case chestnut no longer
earns the tier at all and twenty-five provinces lose their chestnut row. Excluding one outlier from
a *generalisation* costs nobody evidence — Massa-Carrara answers from Lunigiana's own documented
row, which is better than a generalised one — whereas retiring the tier would cost twenty-five
provinces a real answer to save a rule from an edge case. The code comment on the row says so.

**Lucca and Massa-Carrara drop out of the generalised row's province list**, both now answering
from a document. That is the seventh pass's Torino precedent, applied twice.

### A correction to the ninth, tenth and eleventh passes

**Those three entries each overstated the region count by one**, and so did their commit messages:
17, 18 and 19 of 20, where the true figures were 16, 17 and 18. The provinces, designations and
window counts were right; only the region arithmetic was wrong, carried forward unchecked from one
entry to the next. The ledger lines are corrected. The commit messages are pushed and stay wrong.

Twenty regions minus the silent ones is the whole calculation, which is the embarrassing part.

### Where this leaves the dataset

**65 designations, 71 documented windows, 2 generalised, 82 of 107 provinces, 18 of 20 regions.**

Province coverage is unchanged, as predicted: all three land where a document already answered.
What they add is density — Modena and Bologna go to three designations each.

Only **Valle d'Aosta** and **Molise** answer nothing, and neither is pending. **There are no
judgement calls left open in this corpus.** What remains is the copy: «frutta e verdura» now covers
a mushroom, a herb, a fermented turnip, a jam and two flours.

---

## 2026-09-17 (thirteenth pass) — a third register, and Valle d'Aosta answers

The protected-designation corpus was finished in the twelfth pass. What follows comes from a
different register: **prodotti agroalimentari tradizionali**, the lists each Region keeps under
D.Lgs. 173/1998, published as a *scheda identificativa* per product. A background sweep
(`scripts/seasonable-enrich.mjs`, ledgers in `.pipeline/seasonable/enrich/<region>/`) worked
fifteen regions and staged 55 candidates. Nothing ships from it unreviewed: each row below was
re-read in the scheda itself.

### The rules this required, and how narrow each one is

1. **`designation` gains `PAT`.** It is a weaker instrument than a DOP or an IGP — no controls,
   no consortium, no EU registration — so the suffix is on the row rather than hidden. What it
   shares with a disciplinare is what this page needs: a document, published by the body that
   keeps the register, naming the territory and stating when the crop is picked.
2. **The host allowlist gains `www.regione.vda.it`.** One host, added because one document is
   cited. Not a `regione.*` pattern: "some site under regione.something.it" is not a publisher
   of record, and the value of that list is that every entry was looked at.
3. **The undated licence extends to a PAT scheda.** Valle d'Aosta's two print the enabling law
   and no year of their own, exactly like the ministry's consolidated disciplinari. The test now
   admits a source whose name says *scheda identificativa* and whose URL is the Region's, and
   nothing else; the reader is shown the consulted date.

### Shipped — Valle d'Aosta, the region no register named

Both schede state it word for word, under «Descrizione delle metodiche di lavorazione»:

> «La raccolta è manuale e si effettua da inizio settembre a metà novembre secondo la
> maturazione fisiologica dei frutti.»

Zone, from the scheda's own field: «intero territorio della Regione Autonoma Valle d'Aosta» —
so **Aosta**, the province that answered nothing until today.

| Product | Window |
|---|---|
| Golden delicious della Valle d'Aosta PAT | 16→20 |
| Renetta della Valle d'Aosta PAT | 16→20 |

**The sweep had both rows ending at 21, and that was wrong.** «metà novembre» as an end is the
first half of the month, which is 20; 21 would claim the second. The conversion rule was already
written down and the machine checks could not see the error — the quote was verbatim, the months
were named, the arithmetic was internally consistent. This is why a row is re-read by hand
before it ships.

### Where this leaves the dataset

**67 products — 65 protected designations and 2 PAT — 75 windows, 69 sources, 83 of 107
provinces, 19 of 20 regions.** Only **Molise** now answers nothing: its PAT atlas was swept in
full and not one of its 33 vegetable schede states both ends of a harvest window.

The copy changed with it: «sixty-five designations» became «sixty-seven products», and both
locales now say in a sentence that two of them come from a lighter register.

### Staged, not shipped

53 more candidates wait in `.pipeline/seasonable/enrich/`: Lazio 23, Sicilia 15, Marche 6,
Friuli-Venezia Giulia 4, Sardegna 4, Calabria 1. Eleven regions are marked `needs-human`,
because discovery found only name-only lists or could not open what it found — Toscana's portal
of 471 schede and Campania's per-product pages are the two worth doing by hand.

---

## 2026-09-17 (fourteenth pass) — the regional registers, shipped

The background sweep's 53 staged candidates were adjudicated one at a time against the scheda
they came from. **49 ship, 4 do not.** Per-region working notes stay in
`.pipeline/seasonable/enrich/<region>/`.

### The documents, and which of them print a year

| Source | Publisher | Year |
|---|---|---|
| `pat-marche` | Regione Marche, Schede prodotti tradizionali | **2017**, printed as «aggiornamento 2017» on every page |
| `pat-friuli` | ERSA, Il Cibario del Friuli Venezia Giulia | **2017**, printed as «© ERSA 2017» |
| `pat-lazio` | ARSIAL, Lazio patrimonio agroalimentare | **2019**, «finito di stampare nel mese di aprile 2019» |
| `pat-sardegna` | Regione Autonoma della Sardegna, schede identificative | none printed — consulted date shown |
| `pat-sicilia` | Regione Siciliana, schede PAT | none printed — consulted date shown |

Two of those years were proposed by the sweep from a **filename** (`…Marche 2017.pdf`) or an
**upload path** (`/2023-06/`), which invariant 3 forbids. Marche's turned out to be printed
inside as well; **Sicilia's did not**, so it spends the undated licence instead of carrying a
2023 nobody printed. One host per region joins the allowlist, never a `regione.*` pattern.

### Shipped — 49 products, 50 windows

**Lazio, 21** · Aglio rosso di Proceno · Arancio Biondo di Fondi (3→15, the widest of these) ·
Asparago delle Acque Albule · Broccoletto Sezzese · Carciofo di Sezze · Castagna di Terelle ·
Cipolla di Nepi · Cocomero Pontino · Finocchio della Maremma Viterbese (20→8, wrapping) ·
Fragolina di Nemi · Marrone Antrodocano · Marrone dei Monti Cimini · Marrone di Latera ·
Marrone Segnino · Patata di Leonessa · Pomodoro Fiaschetta di Fondi (**two rows**, serra
8→11 and pieno campo 12→13) · Pomodoro Scatolone di Bolsena · Pomodoro Spagnoletta del Golfo di
Gaeta · Prugna Pizzutella di Picinisco · Rapa Catalogna di Roccasecca · Sarzefine di Zagarolo.

**Sicilia, 14** · Aglio rosso di Nubia · Albicocco di Scillato · Arancia Biondo di Scillato ·
Ciliegia Mastrantoni · Fava larga di Leonforte · Ficodindia della Valle del Torto · Fragola di
Maletto · Fragolina di Ribera · Mele Cola · Oliva Nebba · Oliva nera di Buccheri · Ovaletto di
Calatafimi · Pere Butirra d'estate · Pere Virgolosa.

**Marche, 6** · Carciofo Monteluponese · Cavolfiore Precoce di Jesi · Cavolfiore Tardivo di Fano ·
Marrone di Acquasanta Terme · Taccole · Visciole sciolte al sole.

**Friuli, 4** · Radicchio canarino and Rosa di Gorizia, which share one sentence · Pera Pêr
Martìn · Figo moro da Caneva, whose zone names Cordignano, so the row carries **Treviso** as well
as Pordenone.

**Sardegna, 4** · Capperi e capperoni di Selargius · Cipolla di Gonnosfanadiga · Cipolla rossa ·
Ciliegia Barracocca di Villacidro.

### Four rejected, and why

- **Broccolo di rapa della Sila** — Calabria's only candidate, and its whole tier. The scheda (a
  2005 fax scan, read by rendering the page) gives a *cultivation* period, «viene coltivato come
  produzione precoce nei mesi di novembre-dicembre», and states harvest only relative to the
  transplant: «è raccolto dopo circa 60 giorni dal trapianto». A modelled number, invariant 5.
  Its province field says Cosenza while its territory field says the whole region, which would
  have needed resolving even if the dates had held. **Calabria ships nothing.**
- **Pomodoro Faino di Licata** — «avendo praticamente la presenza del frutto quasi tutto l'anno,
  con una maggiore concentrazione delle produzioni nel periodo che va da gennaio a giugno». A peak,
  not a window, and the page answers "is this being picked", not "is this at its peak".
- **Actinidia** (Lazio) — the same crop in the same provinces already answers from **Kiwi Latina
  IGP**, cited to its disciplinare. A PAT row beside it would show one fruit twice with two
  different ends.
- **Asparago verde di Canino e Montalto di Castro** (Lazio) — already shipped as **Asparago Verde
  di Canino IGP**, whose two rows (0→11, 16→19) are better than this guide's single 0→19 union.

### Conversions corrected in the reading

Every candidate was re-read, and three conversions were wrong in a way no machine check could
see — the quotes were verbatim, the months named, the arithmetic self-consistent:

| Row | Sweep | Shipped | Why |
|---|---|---|---|
| Golden delicious / Renetta della Valle d'Aosta | 16→**21** | 16→**20** | «metà novembre» is the first half |
| Ciliegia Barracocca di Villacidro | **8**→10 | **9**→10 | «fine maggio» is the second half |

### Precedents leant on, named so the next pass can argue with them

- **An «epoca di produzione» counts** where the scheda states no separate harvest: Aglio rosso di
  Nubia and Ciliegia Mastrantoni ship on «Periodo di produzione», which is the Basilico Genovese
  precedent from the tenth pass.
- **A maturation window counts**: Cavolfiore Tardivo di Fano, Pere Butirra, Arancia Biondo di
  Scillato — the Pesca di Delia precedent, «epoca di maturazione».
- **A processed designation may carry its input's harvest**: Visciole sciolte al sole, on the
  Brovada precedent from the eleventh pass.
- **Table olives are in scope**: Oliva Nebba and Oliva nera di Buccheri, on the Oliva Ascolana
  del Piceno precedent.

### The generalised chestnut row shrank, on purpose

Terelle (FR), Antrodoco (RI) and Segni (RM) now have chestnut rows of their own, so those three
provinces drop out of `chestnut-generic`'s province list — the Torino precedent from the seventh
pass, applied three times. The row's window and cited designations are unchanged; PAT rows do not
feed the generalised tier, whose n≥3 rule was measured over designations.

### Where this leaves the dataset

**116 products — 65 protected designations and 51 PAT — 125 windows, 72 sources, 86 of 107
provinces, 19 of 20 regions.** The copy moved with it: «sixty-seven products» became «a hundred
and sixteen», and «a quarter of the provinces» became «a fifth».

**Molise is the only region that answers nothing**, and it is finished rather than pending: no
class-1.6 designation names a comune in it, and all 33 vegetable schede of its PAT atlas were
read without finding a single window with both ends.

Seven kinds now render the sprout fallback glyph rather than a mark of their own — apricot,
cauliflower, onion, pea, broad bean, watermelon, salsify. The mark is deliberate as a fallback,
but seven rows is enough to be worth drawing.

### Still open

Eleven regions are `needs-human` in the sweep's queue: Lombardia, Puglia, Abruzzo, Umbria,
Piemonte, Veneto, Emilia-Romagna, Liguria, Toscana, Basilicata and Campania. Discovery found only
name-only lists for most, could not open Abruzzo's PDF, and declined Puglia's atlas because a
university hosts it. **Toscana's portal of 471 schede and Campania's per-product pages are the
two worth doing by hand** — and Lombardia matters most, with eleven silent provinces.

---

## 2026-09-18 (fifteenth pass) — Lombardia, by hand

The sweep's discovery had given up here: Regione Lombardia publishes its PAT elenco as a **list
of names**, the decree link in the portal serves an HTML page rather than the PDF it advertises,
and neither carries a scheda. Searching by hand found the document that does — **ERSAF and
Regione Lombardia's own «Atlante dei prodotti tipici e tradizionali», fifth edition**, whose
colophon prints «© Regione Lombardia. Quinta edizione: giugno 2014». One host joins the
allowlist, `www.ersaf.lombardia.it`, the regional agency that publishes it.

The Atlante is 196 pages of every category. The category pre-filter skipped 158 pages of cheese,
cured meat and bread for nothing, and the calendar-term filter another 25; thirteen pages reached
a model, at $0.24. Its schede put a product's name on one page and its text on the next, which is
exactly the case the page-before context was added for in Marche.

### Shipped — three products, and two provinces that had never answered

| Product | Clause | Window | Province |
|---|---|---|---|
| **Cipolla di Sermide** | «La semina avviene in autunno e la raccolta in luglio» | 12→13 | **Mantova** |
| **Pisello di Miradolo Terme** | «La raccolta inizia a fine aprile-seconda decade di maggio e termina entro la prima decade di giugno ed è scalare» | 7→10 | **Pavia** |
| **Zucca Mantovana** | «Si semina in aprile e la raccolta avviene a fine settembre-ottobre» | 17→19 | **Mantova** |

Pisello di Miradolo states a *range* for its own start — «fine aprile-seconda decade di maggio» —
so the row takes the earliest end of it, 7, on the same reading that makes a per-variety window
the union of its varieties.

**Reading by hand found two of these; the judge found the third.** Sermide and Mantova's pumpkin
came out of a grep for a harvest word beside a month name; Pisello di Miradolo did not, because
its sentence separates the two by twenty words, and the model read the page and caught it.

### Rejected

- **Asparago di Cantello** — the Atlante quotes the same sentence as the IGP disciplinare already
  cited for it. Varese answers from the disciplinare.
- **Fagiolo borlotto di Gambolò** — «la raccolta del seme secco», a dry pulse, on the rule that
  has kept Molise's and Calabria's out.
- **Castagne secche di Valtellina** — dried, and its dates are the drying.
- **Patate di Campodolcino** — qualitative.
- Nine more products state no date at all, among them Asparago di Mezzago, Asparago di Cilavegna,
  Cipolla dorata di Voghera, Patata comasca bianca and Radici di Soncino. Lombardia's schede are
  short, and most of them describe the plant rather than the year.

### Where this leaves the dataset

**119 products — 65 protected designations and 54 PAT — 128 windows, 73 sources, 88 of 107
provinces, 19 of 20 regions.** Lombardia goes from eleven silent provinces to nine: Como,
Sondrio, Milano, Bergamo, Brescia, Cremona, Lecco, Lodi and Monza e Brianza still answer nothing,
and nothing in this Atlante can reach them.

`pumpkin` is the thirty-seventh mark in `produceGlyphs.tsx`, drawn for the Zucca Mantovana.

---

## 2026-09-18 (sixteenth pass) — Toscana, one scheda at a time

Discovery had marked Toscana `needs-human` because its 471 schede are **web pages, not a file**.
The portal, `prodtrad.regione.toscana.it`, is Regione Toscana's own — ARSIA's database of
«I Prodotti Agroalimentari della Toscana» under D.Lgs. 173/98 art. 8 — and it is driven by a
POST form whose session key is issued per visit. The route, written down so nobody re-derives it:

1. `GET /mod_qtp_pat` with a cookie jar, and read `FORM_SAVE_KEY` and `FORMTIME` out of the form.
2. `POST /mod_qtp_pat` with those, `prod_cat=F` (prodotti vegetali allo stato naturale o
   trasformati) and `prod_geo=0`. The reply is the list, 195 products.
3. Each row calls `ProdTrad(<id>)`, which opens
   `LIB_ProdTrad/Prodotto.php?ID=<id>` — the scheda itself, in the ministry's own template.

**Each scheda is its own document, so each row cites its own URL.** Sixty sources, not one.
The schede print no year — the footer's «Copyright 2017 Regione Toscana» is the site's, not the
document's — so they spend the undated licence and show a consulted date, and the test's name
rule now admits «scheda prodotto» beside «scheda identificativa».

195 schede fetched; 165 carry a calendar term and went to the judge, at $2.57; 63 came back as
candidates, and all 63 were re-read here.

### Shipped — 60 products, 61 windows

Every Tuscan province was already answering, so this is density, not reach: Arezzo and Firenze
gain a dozen each, Lucca eight, Massa-Carrara nine. Thirteen are beans, seven onions, five
peaches, five tomatoes. **Cipolla di Ripola carries two windows** — «Raccolta manuale eseguita a
giugno-luglio o a ottobre-novembre» — on the Finocchio di Isola Capo Rizzuto precedent.

Two conversions leant on precedent rather than on the word *raccolta*: Tuscan schede often say
«si produce» or «matura», which the Basilico Genovese and Pesca di Delia passes already settled.

### Corrected in the reading

- **Cocomero gigante di Fontarronco** — «da dopo ferragosto fino alla metà del mese di
  settembre». The sweep ended it at 17; «metà settembre» is the first half, so 16.

### Rejected — three

- **Castagne (fresche) della Toscana** — «La produzione è concentrata prevalentemente nel mese di
  ottobre». A peak, not a window, on the Pomodoro Faino precedent from the fourteenth pass.
- **Pastinocello** — a wild plant «nei prati, lungo gli argini dei fiumi», and the staged window
  was stitched from a sentence about where it is found and another about cutting its leaves.
- **Pomodoro canestrino di Lucca** — «In serra … piantato a gennaio con rese fino a settembre ed
  in campo dal 20 aprile con rese fino alla fine di ottobre». Both ends of both rows rest on a
  *planting* date and a yield, not on a stated harvest. The most tempting rejection of the pass:
  it would have been the second greenhouse-and-field pair in the dataset.

### Provinces the sweep got wrong, and the list that caused it

The portal's result table prints a province column that is not always the scheda's own
territorio: Castagna pistolesa is listed under AR **and its scheda says «Provincia di Arezzo»**,
despite the name; Cipolla massese is listed under LU, MS and PI and its scheda says
«Provincia di Massa-Carrara» alone; Zucchina sarzanese is listed under three and its scheda says
«Versilia, provincia di Lucca». Every row here takes the scheda's field, not the table's column.

### The generalised chestnut row shrank again

Arezzo now has a chestnut of its own (Castagna pistolesa), so it leaves `chestnut-generic`'s
province list — the Torino precedent, for the fourth time.

### Where this leaves the dataset

**179 products — 65 protected designations and 114 PAT — 189 windows, 133 sources, 88 of 107
provinces, 19 of 20 regions.**

Seven more marks were drawn for the kinds Toscana brought: cardoon, courgette, grape, melon,
pomegranate, shallot and spinach. `produceGlyphs.tsx` now holds forty-four.

---

## 2026-09-18 (seventeenth pass) — Campania, page by page

Discovery had found Campania's index — `agricoltura.regione.campania.it/tipici/tradizionali-vegetali.htm`
— read it, correctly reported that an index of names states no harvest, and stopped. It links
**227 product pages**, one per product, and those are the documents. All 227 were fetched; 147
carry a calendar term and went to the judge, at $1.98.

These are not the ministry's template. They are prose, in Italian and then in English, and the
production area is a sentence rather than a field — which is where most of this pass's work was.

### Shipped — 40 products

Seven potatoes, five tomatoes, five chestnuts, three cherries, three onions, three artichokes,
two peppers, two fennels, and one each of garlic, broccoli, bean, peach, melon, olive, chilli,
pear, pea, turnip, celery and courgette. Campania's five provinces all answered already, so this
is density: Napoli, Salerno and Avellino gain a dozen apiece.

### Corrected in the reading

- **Patata rossa del Vallo di Diano** — the sweep read «si pianta ad inizio aprile ed è pronta per
  metà giugno» and gave 11→17. The scheda's own harvest sentence is «La coltivazione inizia nel
  mese di maggio … e si chiude con la raccolta a fine agosto inizio settembre», so the row is
  **15→16**. The mid-June readiness belongs to a different, earlier planting the page does not
  date, and stitching the two would have invented a four-month window.

### Rejected — eight, and three of them are a rule worth stating

- **Three wine grapes** — Uva catalanesca («dal 2006 è stata ufficialmente aggiunta all'elenco
  delle uve da vino»), Uva coda di volpe rossa (its clause is a *vendemmia*) and Uva lengua de
  femmina (described by its sugars and vine habit). **A vendemmia is not what this page answers.**
  It says what is being picked to eat; a wine harvest is a different question, and the catalogue
  has never carried one. A table grape still belongs here — Uva colombana di Peccioli shipped
  from Toscana yesterday.
- **Zafferano** — a spice, and what is picked is the flower. The catalogue already stretched to a
  mushroom and a herb; a stigma is a step past that.
- **Melanzana cima di viola** — «Viene raccolta due volte l'anno, una prima volta verso la fine di
  giugno, inizi di luglio ed una seconda intorno ai primi di settembre». The second harvest has a
  start and no end, and a union would claim continuous picking through August — which the scheda
  denies in the next sentence, where the plant is pruned in early August.
- **Broccolo di Paternopoli**, **Zucca lunga di Napoli**, **Pesca bellella di Melito** — no stated
  production area. «Un'area limitata e determinata» is not a territory, and a product named after
  a comune is a name, not a zone. Their windows are fine; the geography is not, and this page
  answers *where* before it answers *when*.

### Recovered from the review file

**Ciliegia del Monte e ciliegia della Recca** failed the machine check for a missing zone quote,
but the page does state one — «in provincia di Napoli» — and gives both cultivars' maturation, so
the row is their union, 9→11. One of five review records was a real row.

### The generalised rows shrank, twice

Campania's own chestnuts (Partenio, Monte Faito, Acerno, Trevico, Civitella Licinio) retire
`chestnut-generic` in **Benevento, Caserta and Napoli**; its cherries (Pimonte, Siano, del Monte)
retire `cherry-generic` in **Napoli**. The Torino precedent, fifth and sixth applications.

### Where this leaves the dataset

**219 products — 65 protected designations and 154 PAT — 229 windows, 173 sources, 88 of 107
provinces, 19 of 20 regions.** Two more marks, broccoli and celery; forty-six in the file.

### What is left

Eight regions are still `needs-human`: Piemonte, Veneto, Emilia-Romagna, Liguria, Umbria,
Abruzzo, Puglia and Basilicata. Every one of them publishes a list of names; none of them
publishes the schede behind it on a host we have found. Puglia's atlas lives on `patpuglia.it`,
which a university runs for the Region — the nearest thing to a document, and a judgement about
publishers rather than a search problem.

---

## 2026-09-18 (eighteenth pass) — six regions by hand, and the sweep moved out of Documents

Midway through this pass macOS withdrew the Documents folder from the IDE running the sweep, and
both the main checkout and the sweep's worktree became unreadable. A worktree shares its `.git`
with the checkout it came from, so it locked too. The sweep now runs from **a separate clone at
`~/dev/walterwebsite-enrich`**, rebuilt from GitHub; nothing committed was lost. The documents
for the regions in flight were restored from cached copies and one re-download.

Six regions were worked, all of them `needs-human` after discovery: in every case the Region's
own PAT page links a list of names, and the schede live somewhere discovery did not look.

### Where the schede actually were

| Region | Document | Year | Why discovery missed it |
|---|---|---|---|
| Abruzzo | Regione Abruzzo / ARSSA, *Atlante dei prodotti tradizionali d'Abruzzo* | 2006 | the PDF it found was the name-only elenco |
| Umbria | one scheda per product, as PDFs in the Region's asset library | undated | not linked from the PAT page |
| Veneto | Veneto Agricoltura, *Atlante dei prodotti agroalimentari tradizionali del Veneto*, vegetable volumes | undated | the agency's new site serves an HTML shell; the old host still serves the PDFs |
| Piemonte | D.D. 10 ottobre 2013 n. 879, Bollettino Ufficiale — «Schede tecniche» | 2013 | the decree that published the list also published the schede |
| Liguria | *Atlante regionale*, a page per product on agriligurianet.it | undated | the atlas is paginated 10 at a time |
| Puglia | *Atlante dei PAT di Puglia 2022*, Università di Bari for the Region, ISBN 978-88-6629-038-4 | 2022 | declined because a university hosts it |

### The one publisher decision

**Puglia's atlas is published by the Università di Bari, not by the Region.** It was written
«con il contributo della Regione Puglia», carries an ISBN, is dated 2022, and is linked from the
Region's own PAT page. The publisher rule exists to keep aggregators out — the whole page once
rested on disciplinare.it — and a dated, ISBN-registered book the Region commissioned is not an
aggregator. Accepted, and said so in the source's name and in the test's host list, where it is
the one entry that is not the register's keeper. **Reverse it by deleting `pat-puglia` and its
rows if that reading is wrong.**

The undated-source test changed with it: it used to require `regione.` in the URL, which excluded
a Region's agencies. It now requires a host from one vetted list, `REGISTER_HOSTS`, the same list
the publisher test reads.

### Shipped — 109 products, 114 windows

Abruzzo 3 · Umbria 3 · Veneto 40 · Piemonte 28 · Puglia 32 · Liguria 3.

**Four provinces answer for the first time: Chieti** (Carciofo del Vastese, Peperone rosso di
Altino), **Bari** (Carota di Polignano, Cicoria puntarelle molfettese, Cipolla di Acquaviva, Uva
baresana, and the region-wide rows), **Barletta-Andria-Trani** (Carciofo di San Ferdinando, Cima di
rapa di Minervino, Percoca di Loconia) and **Taranto** (Carosello and Pomodorino di Manduria).

Cicoria puntarelle molfettese was deleted in the fourth pass as a *pending IGP application*. It
returns here as a PAT — a different register, in which it is listed — and says so.

### The traps, so they are not walked into twice

- **Puglia's schede print a map legend naming all six provinces** — «FOGGIA BAT BARI TARANTO
  BRINDISI LECCE» — on every page. A reader that takes the page's province names for the zone gets
  the whole region every time. The zone is the «Area di origine del prodotto» field, and every
  Apulian row was re-read against it; one (Percoca di Loconia, Canosa) was narrowed to BAT.
- **Seasons merged into one span.** Carota di Chioggia (April–June and September–November),
  Cicoria pan di zucchero casalese (October–December and May–June) and Fragola di Verona (spring
  and autumn) each came back from the judge as one window claiming the months between. Each is two
  rows now.
- **A secondary harvest read as the main one.** Both Apulian artichokes quoted «dal mese di aprile
  fino a tutto maggio si possono ottenere 3-4 capolini più piccoli». San Ferdinando's own period is
  «Da settembre a maggio» and ships as 16→9; Mola's is only «dall'autunno alla primavera», so it
  does not ship.
- **Word inside a word.** *Melanzana* contains *mela*, and the first draft filed an aubergine as
  an apple.

### Rejected in the reading — fourteen

| Product | Why |
|---|---|
| Patata degli Altipiani d'Abruzzo | the Fucino plateau, already answered by Patata del Fucino IGP |
| Carciofo di Mola | only the secondary heads are dated |
| Carota di Zapponeta | «la maggior parte del prodotto si raccoglie…» — a peak |
| Carciofo violetto di Albenga | its second harvest has a start and no end; the judge stretched it February→December |
| Fragole di San Raffaele Cimena | the start belongs to the tunnel crop and the end to the open-field one |
| Pomodoro del Cavallino | the same: heated greenhouse start, outdoor end |
| Piccoli frutti (Piemonte) | several species under one name |
| Pomodoro costoluto di Cambiano, open field | past tense — «veniva effettuato»; the tunnel crop ships |
| Five Umbrian schede | dried pulses, or a sowing date only; two saffrons out of scope |

### Where this leaves the dataset

**328 products — 65 protected designations and 263 PAT — 343 windows, 184 sources, 92 of 107
provinces, 19 of 20 regions.** A seventh of the provinces are silent now, and the copy says so.
Vicenza leaves the generalised chestnut row (Marroni di Valrovina), the seventh application of the
Torino precedent.

Five more marks: beetroot, cabbage, chard, jujube, sweet potato. Fifty-one in the file.

### What is left

Fifteen provinces answer nothing: Como, Sondrio, Milano, Bergamo, Brescia, Cremona, Lecco, Lodi,
Monza e Brianza, Bolzano, Trieste, Terni, Pescara, Campobasso, Isernia. **Emilia-Romagna** and
**Basilicata** publish names only and would add density, not reach. Molise's atlas was read in full
in the first pass. Lombardia's nine are the largest block, and the Atlante reaches none of them.
