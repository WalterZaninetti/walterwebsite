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

