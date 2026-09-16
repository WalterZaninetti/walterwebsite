---
name: seasonable-enrichment
description: The background worker for enriching the /seasonable dataset one region at a time from new source tiers - regional PAT schede (Prodotti Agroalimentari Tradizionali) and regional seasonality calendars. Stages ledger entries and candidate rows under .pipeline/seasonable/enrich/<region>/, never touches src/. Use when invoked as /seasonable-enrichment <region> <pat|calendar>, when piloting a unit by hand, or when reviewing what a staged unit produced.
---

# Seasonable enrichment — one unit of the background sweep

You are one invocation of a long, resumable loop. `scripts/seasonable-enrich.mjs` called you with
two arguments: a **region id** from `src/content/seasonable/geography.ts` and a **tier**, `pat` or
`calendar`. Do one bounded piece of that unit, write down what you found, and exit. The next
invocation carries on from the files you leave behind.

**Nobody is watching.** Do not ask questions and do not wait for approval: decide, record the
decision and the reason, and move on. When you cannot decide, the answer is `rejected` with the
reason, or `blocked` for the unit. A later supervised ship step re-reads every candidate before
anything reaches the page.

## Read first, every time

1. `.claude/skills/seasonable-sourcing/SKILL.md` — the invariants. **They all apply to these
   tiers unchanged.** A document, with a path, that states the window; never a modelled number;
   the whole sentence, and the union across varieties; delete rather than soften.
2. `.pipeline/seasonable/enrich/<region>/ledger.md` and `candidates.jsonl`, if they exist — what
   earlier invocations already checked. Never re-check a product that already has a record.
3. `.pipeline/seasonable/enrich/<region>/pat-index.json`, for the PAT tier, if it exists.

## What you may write

Only under `.pipeline/seasonable/enrich/<region>/`:

| File | Tracked | What |
|---|---|---|
| `ledger.md` | yes | prose audit trail, same voice as `.pipeline/seasonable/sources-ledger.md` |
| `candidates.jsonl` | yes | one JSON object per line, one per product or species × document |
| `pat-index.json` | yes | the region's PAT vegetable products and their per-product status |
| `status-<tier>.json` | yes | how this invocation left the unit — **always write it last** |
| `corpus/` | no | downloaded PDFs, `pdftotext` output, rendered page images |

**Never write under `src/`.** The runner reverts and blocks the unit if you do. The ledger entry
goes in **before** the candidate line, as the sourcing protocol requires.

Tools you have: Read, Grep, Glob, Write/Edit (in the region folder), WebSearch, WebFetch, and Bash
for `curl`, `pdftotext`, `pdftoppm`, `pdfinfo`, `mkdir`, `ls`, `wc`, `date`. Download documents
with `curl -sL -A 'Mozilla/5.0' -o <region>/corpus/<name>.pdf <url>` — WebFetch saves PDFs
outside the working directory and summarises them with a small model, which is not reading.
**Quotes come from the extracted text or from pages you rendered and looked at, never from a
WebFetch summary.**

## Tier `pat` — Prodotti Agroalimentari Tradizionali

Every Region keeps a list of PAT under D.Lgs. 173/1998 and D.M. 350/1999, with one *scheda* per
product. The ministry publishes only the names (the annual *revisione* in Gazzetta Ufficiale); the
**schede with the text live on the Region's own site**. Only category **"Prodotti vegetali allo
stato naturale o trasformati"** is in scope, and within it only fresh fruit and vegetables — not
jams, preserves, flours, dried or pickled products, unless the scheda separately dates the harvest
of the fresh crop (the Brovada precedent in the main ledger).

### First invocation for a region: build the index

1. Find the Region's official PAT publication. Search the regional agriculture portal
   (`regione.<name>.it`, the regional agency such as ARSAC, ERSAF, ARPTRA, Agris, Laore, ASSAM,
   ARSIA), never Wikipedia, Slow Food, tourism portals, or any aggregator. Record every URL you
   tried in the ledger, including the ones that were not the document.
2. Download it to `corpus/`. Run `pdftotext -layout`. If it has no text layer, render with
   `pdftoppm -r 150 -png` and read the pages; flag `ocr` on every record from it.
3. Note what the document prints about its own date: a year in the title, a DGR/DD number with a
   date, a "revisione" number. `pdfinfo` metadata is **not** a printed date — record it in the
   ledger as metadata, never as `printedYear`.
4. Write `pat-index.json`:
   ```json
   { "region": "molise", "document": { "title": "…verbatim…", "url": "…", "printedYear": null,
     "printedDateNote": "…what the document says about its date, or 'nothing printed'" },
     "products": [ { "name": "…as the list writes it…", "page": 12, "status": "pending" } ] }
   ```
   If the Region publishes one PDF per scheda, `products[].url` carries each one.
5. If no official publication with scheda text can be found, write a ledger entry saying where you
   looked, set `status-pat.json` to `done` with `"note": "no official schede found"`, and stop.
   That is a result.

### Every invocation: work the next batch

Take up to **8** products whose status is `pending`, in index order. For each:

1. Read its whole scheda, not only the paragraph with *raccolta* in it. Harvest dates hide in
   "descrizione del prodotto", "metodiche di lavorazione", and "calendario di produzione".
2. Look for a statement that the crop is **harvested** (raccolta, raccolto, si raccoglie, epoca di
   raccolta, maturazione commerciale with dates) with **both ends** stated in calendar terms:
   months, decades, days. "Nei mesi di giugno – luglio", "da ottobre a marzo", "dalla seconda
   decade di agosto a fine settembre" all qualify.
3. **Reject**, with the reason, anything that is:
   - qualitative — "in autunno", "al volgere della stagione autunnale", "a maturazione"
   - half a window — a start with no end, or an end with no start
   - sowing, transplanting, pruning, or processing dates, even when they sit next to harvest
   - a sale, consumption or commercialisation window for a processed product
   - the whole year with no harvest claim (Mela Alto Adige precedent)
   - storage, unless the scheda states the storage window explicitly (then `kind: "stored"`)
4. Read the production zone ("territorio interessato alla produzione") and map it to province ids.
   Quote it in `zoneQuote`. A zone that names only comuni: resolve each comune to its province, and
   say so in the ledger. **Only provinces of this region.** A zone of "tutto il territorio
   regionale" is every province of the region, and must be quoted as such.
5. Convert with the rules in `seasonable-sourcing` (half-months 0–23, decade midpoints). A bare
   month range "da giugno a luglio" is `start = (6-1)*2 = 10`, `end = (7-1)*2+1 = 13`.
6. Map `kind` with the table in `seasonable-sourcing`. Plain *raccolta* with no mention of
   protection is `open-field`. Anything else you would have to guess is `rejected`.
7. Write the ledger paragraph, then the `candidates.jsonl` line, then set the product's status in
   `pat-index.json` to `candidate`, `silent` or `rejected`.

`silent` means the scheda says nothing dated about harvest at all. `rejected` means it says
something and that something fails a rule above — always with `reason`.

## Tier `calendar` — a regional seasonality calendar

One document per region, usually an appendix to the Region's *linee di indirizzo per la
ristorazione scolastica*, or an ASL/SIAN or regional health-agency calendar. The output is
**species** rows ("carciofo", "pesca") for this region's provinces.

Accept a calendar **only if all three hold**, and record in the ledger which failed otherwise:

1. **It is made for this region.** If it matches the national MASAF "Sai quel che mangi" table, or
   cites a national source as its origin, or is word-for-word shared with another region's
   calendar, it is a copy: `rejected`, reason "national calendar republished". Compare against
   any calendar already staged for another region under `.pipeline/seasonable/enrich/*/`.
2. **It is about harvest or production in the region**, in its own words — "periodo di raccolta",
   "produzione regionale", "prodotti del territorio". A calendar of "disponibilità" or "stagionalità"
   with no statement about where the produce comes from cannot be mapped to a `kind`, and the
   sourcing skill forbids guessing one: `rejected`, reason "availability, not harvest".
3. **It prints a year**, or is part of a document that does (a DGR number and date counts).

When it passes, write one record per species with at least one marked month. Contiguous marked
months become one window; a species with two separate runs gets two windows. Full months only: a
marked month is both of its half-months. Flag `calendar-month-grain`. Set `status-calendar.json`
to `done` after the whole calendar, or `more` if you stopped part-way.

If no calendar exists for the region, or none passes, one ledger paragraph and `done`.

## The candidate record

One line of JSON, no pretty-printing:

```json
{"region":"molise","tier":"pat","product":"Fagiolo di Riccia","category":"vegetable","verdict":"candidate","reason":null,
 "source":{"title":"…verbatim…","url":"https://…/path.pdf","host":"www.regione.molise.it","printedYear":null,"accessed":"2026-09-16"},
 "quotes":["La raccolta avviene nei mesi di agosto e settembre."],
 "zoneQuote":"Comuni di Riccia, … in provincia di Campobasso","provinces":["cb"],
 "windows":[{"kind":"open-field","start":14,"end":17,"conversion":"agosto→14 (1–15 ago), settembre→17 (16–30 set)"}],
 "flags":["undated"]}
```

- `verdict: "silent" | "rejected"` → `reason` is required, `windows` is `[]`, `provinces` may be `[]`.
- `quotes` hold **whole sentences**, verbatim, including the parts after any semicolon.
- `flags` — use every one that applies:
  `undated` (no printed year) · `ocr` · `variety-union` (the quote names varieties, tipologie,
  precoci/tardive, or has a semicolon, and the window is their union) · `wraps-year` ·
  `wide` (window longer than 15 half-months) · `comuni-resolved` (provinces derived from a comune
  list) · `calendar-month-grain` · `numeric-dates` (the quote gives dates as numbers, no month names).
- `category` is `fruit` or `vegetable`.

Run `node scripts/seasonable-candidates-check.mjs <region>` before you finish. Fix what it reports;
it checks shape, province membership, half-month arithmetic against the month names in the quote,
URL paths, and the flags above.

## Finish: the status file

Always write `status-<tier>.json` as the very last thing:

```json
{"state":"more","note":"batch of 8 done, 23 pending","at":"2026-09-16T21:04:00Z"}
```

- `more` — there is work left in this unit; the runner will call you again.
- `done` — nothing left in this unit for this region.
- `blocked` — you could not proceed and a retry will not help (site down for good, WAF, every
  download failing). `note` says what a human should look at.

Then stop. Keep the final message to one line: what this batch did.
