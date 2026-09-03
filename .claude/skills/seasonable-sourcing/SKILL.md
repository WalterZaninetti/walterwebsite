---
name: seasonable-sourcing
description: The sourcing protocol for the /seasonable dataset - how to find, cite and convert Italian produce harvest windows into src/content/seasonable. Use whenever adding, changing, verifying or deleting a row in windows.ts or sources.ts, filling a source year or URL, or researching when a fruit or vegetable is harvested in an Italian region.
---

# Sourcing the Seasonable dataset

The page's only durable claim is that every window cites a real, checkable publication. That
claim is worth more than coverage. A smaller dataset where every row traces to a document
beats a larger one where some rows are plausible.

Read `.pipeline/seasonable/brief.md` for the editorial standard this serves. The audit trail
lives in `.pipeline/seasonable/sources-ledger.md` — **every document goes in the ledger before
it goes in `sources.ts`**.

## Invariants

These are not preferences. A change that breaks one of them does not ship.

1. **A source is a document, not an organisation.** One `Source` id = one publication.
   `https://www.crea.gov.it` is not a source; a named PDF with a year on it is.
2. **The URL must have a path.** A bare origin means no document was found.
3. **A year, or an explicit consulted date — never a guess.** Where the document prints its own
   year, record it. Do not infer one from a URL, a directory listing, or a site-wide copyright
   footer. The ministry's consolidated disciplinari print no date anywhere, and they are the only
   document stating a current whole window for most designations, so `Source.year` is optional:
   omit it and the reader is shown `accessed` instead. That licence is narrow, and the test
   enforces it — an undated source must be a `masaf.gov.it` disciplinare.
4. **The document must state the window.** Not the crop — the window. A disciplinare that
   lists a crop but is silent on `epoca di raccolta` backs nothing.
5. **Modelled numbers never get a citation.** If a window was interpolated, reasoned out, or
   carried over from a neighbouring region, it does not ship. There is no "widely reported"
   tier and the brief resolved that deliberately.
6. **A window is deleted, not softened.** When nothing supports a row, remove it. Do not
   widen it, do not fall back to a national figure to keep the product on the list.
7. **Record `accessed`.** These URLs rot — MASAF's national calendar is already a 404. Every
   source carries the ISO date it was last opened.
8. **Read the whole sentence, and take the union across varieties.** Where a disciplinare
   gives a calendar per variety or per tipologia, the window spans the earliest start to the
   latest end, and the comment quotes every clause. A designation is one thing to the reader —
   you buy Ciliegia di Vignola, not the early varieties of it — so a row carrying one
   variety's dates under the designation's name is not a narrower truth, it is a false one.
   This is the failure mode that survives every other check on this list: the quote is
   accurate, the conversion is correct, and the row is still wrong, because the sentence
   continued after the semicolon. Four rows shipped that way before anyone re-read the
   sources. When a quote contains `precoci`, `medie`, `tardive`, `tipologia`, a variety name,
   or a semicolon, assume there is more of it.

## Where the documents are

| Preference | Document | Why it wins |
|---|---|---|
| 1 | an OJ C **"Comunicazione dell'approvazione di una modifica ordinaria"** | in force, dated, and carries the consolidated `epoca di raccolta` |
| 2 | the **registered specification** on EUR-Lex, where it states the whole window | dated and permanent |
| 3 | the **ministry's consolidated disciplinare**, `masaf.gov.it/…/IDPagina/3343` | the text in force — but undated |

**Never `disciplinare.it`.** It is a commercial aggregator, not a publisher; the whole page once
depended on that one host, and several copies it served were proposals rather than texts in force.
A test now rejects any source outside `eur-lex.europa.eu` and `www.masaf.gov.it`.

**eAmbrosia has a public JSON API** and it is how you enumerate the corpus:
`…/eambrosia-public-api/v3/api-docs` gives the spec, `POST …/api/gi-applications/filter` with
`{"first":0,"rows":5000,"filters":[]}` returns the whole Union register in one request, and
`…/api/gi-applications/id/{id}` gives one designation's dossier. Italy has **127 registered
designations in class 1.6**.

**Ordinary modifications never get an approving OJ L.** A Union amendment is published in OJ C and
then approved by a regulation in OJ L; an *ordinary* one is approved nationally and the Commission
merely publishes it. So "is there a later OJ L" is the wrong test for whether an OJ C is in force —
read the title instead. A **"domanda"**, **"proposta"** or **"richiesta"** is not in force.

**Gazzetta Ufficiale cannot be the citation.** Its decrees approve a disciplinare without
containing it, so a GU atto can satisfy the year rule or the states-the-window rule, never both.
Its search is WAF-blocked to automation, though `/eli/id/...` permalinks fetch normally.

**EUR-Lex throttles**, returning HTTP 202 with an empty body after heavy use. A real browser still
works when a scripted client does not.

**Regional disciplinari di produzione integrata are a dead end** — checked, twice, and they carry
no absolute dates at all. They regulate how a crop is grown, not when it is picked. The ledger
records which were tested so nobody repeats it.

**DOP/IGP disciplinari** come from the EU **eAmbrosia** register. They are legally binding,
name the exact comuni and province, and often state harvest to the *decade* — Uva di Puglia
IGP fixes Victoria at "dalla seconda decade di luglio". Use these for the narrow, famous
claims: Sicilian blood orange, Radicchio di Treviso, Mela Val di Non.

**MASAF's national calendar is dead.** `politicheagricole.it/…/IDPagina/5995` now redirects to
"Pagina non più disponibile", and the surviving copies are scanned image PDFs mirrored on
comune sites. Do not cite those. Prefer a live CREA / ISMEA / Campagna Amica calendar.

**Never a citation, but use them:**
- **BMTI / Osservaprezzi** weekly wholesale listings — empirical cross-check. If a window says
  picking and no market anywhere quotes the product, look again.
- **Bianco & Pimpini, *Orticoltura* (Pàtron)** — the standard Italian reference. Catches
  botanically implausible windows. It has no URL, and both `Source` and the promise to the
  reader assume a followable link.

## The per-designation loop

One designation is one resumable unit of work. Do not start a second before finishing the first.

1. Pull its dossier from eAmbrosia by `fileName` (`PGI-IT-0858`, `PDO-IT-0687`, …). Read the
   publication list newest-first and decide which documents are **in force**, using the
   ordinary-vs-Union rule above.
2. Find the document that states the window, working down the preference table. Note its title
   verbatim, its permanent URL, its printed year if it has one, and today's date as `accessed`.
3. Write the ledger entry **first**, before touching `sources.ts`.
4. Convert to half-months (below) and write the row, quoting the Italian in the comment.
5. If nothing states both ends, log "silent" and move on — silence is a result, not a failure.

**Check the text in force even when the row already looks right.** Two designations had windows
that no longer exist in their current disciplinare: Mela di Valtellina's per-variety harvest table
is gone (§5.6 now fixes only a ripeness criterion, and §5.7 gives a storage *end* with no start),
and Asparago Bianco di Cimadolmo's start softened from "in marzo (il venti circa)" to "in marzo".
Both rows had been converted correctly from a document that had since been superseded.

## Converting what documents say

**Half-months are 0–23.** `index = (month - 1) * 2 + (0 for days 1–15, 1 for day 16 onward)`.
So 0 is 1–15 January, 23 is 16–31 December. Windows may wrap the year (`start > end`).

**Decades → half-months: snap to the decade's midpoint.** A decade is 1–10, 11–20, 21–end.

| Document says | Midpoint | Half-month |
|---|---|---|
| prima decade | ~day 5 | first half |
| seconda decade | ~day 15.5 | second half |
| terza decade | ~day 25 | second half |

Record the raw Italian phrase in the ledger so the snap is auditable. Where the snap moves a
boundary by more than five days, say so in the ledger.

**Primizie / piena stagione / fine stagione:** the window is the whole availability span,
first to last. The tool answers "is this being picked", not "is this at its peak".

**Mapping to `kind` — never guess:**

| Document language | `kind` |
|---|---|
| pieno campo, in campo, raccolta (in a harvest calendar) | `open-field` |
| serra, coltura protetta, tunnel, apprestamenti | `greenhouse` |
| conservazione, frigoconservazione, atmosfera controllata | `stored` |

A `stored` row requires an explicit statement about storage. Harvest end plus a guess at shelf
life is a modelled number, and invariant 5 applies.

## When the document disagrees with what is already in the repo

The document wins. Move the row, or delete it. Never adjust the document's window to preserve
an existing row, and never keep a row because deleting it would thin out a region.

## Before you finish

`npm test` is the gate — it checks referential integrity, that every source has a real year,
an `accessed` date and a URL with a path, and that no source is left uncited. `npm run deploy`
runs it. If the catalogue shrank, the size assertions in `src/lib/seasonable.test.ts` and the
counts quoted in `src/locales/{en,it}.json` (`seasonable.s2.body`, `home.projects.food.meta`)
change with it.
