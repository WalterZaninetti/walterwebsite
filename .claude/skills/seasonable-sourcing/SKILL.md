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
3. **No printed year, no citation.** If the document does not state its own year, it is not
   usable. Do not infer the year from a URL, a directory listing, or a copyright footer that
   covers the whole site.
4. **The document must state the window.** Not the crop — the window. A disciplinare that
   lists a crop but is silent on `epoca di raccolta` backs nothing.
5. **Modelled numbers never get a citation.** If a window was interpolated, reasoned out, or
   carried over from a neighbouring region, it does not ship. There is no "widely reported"
   tier and the brief resolved that deliberately.
6. **A window is deleted, not softened.** When nothing supports a row, remove it. Do not
   widen it, do not fall back to a national figure to keep the product on the list.
7. **Record `accessed`.** These URLs rot — MASAF's national calendar is already a 404. Every
   source carries the ISO date it was last opened.

## Where the documents are

| Tier | Document | `scope` |
|---|---|---|
| Zone rows (all 5 zones share one window) | a national seasonality calendar | `national` |
| Region overrides | that region's **disciplinare di produzione integrata** | `region` |
| Named-product overrides | that product's **DOP/IGP disciplinare** | `region` |

**Disciplinari di produzione integrata** are the workhorse. Every region publishes one
annually as a dated, versioned PDF, with `norme tecniche di coltura` per crop containing
`epoca di raccolta`. Best maintained: Emilia-Romagna, Piemonte, Veneto; also Sicilia, Umbria,
Liguria. They are exactly `scope: 'region'`.

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

## The per-region loop

One region is one resumable unit of work. Do not start a second before finishing the first.

1. Find that region's current disciplinare di produzione integrata. Note title, permanent
   URL, printed year, today's date as `accessed`.
2. Write the ledger entry **first**, before touching `sources.ts`.
3. For each of the 45 produce ids, find its `norme tecniche` section. Read `epoca di
   raccolta`. If absent, log "silent" and move on — silence is a result, not a failure.
4. Convert to half-months (below). Write an `r(...)` row only where the region genuinely
   differs from the national baseline; an override that restates the baseline is noise.
5. Log which produce the document was silent on. That list is what the next session picks up.

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
