---
name: seasonable-enrichment
description: How the /seasonable dataset is enriched region by region from new source tiers - regional PAT schede (Prodotti Agroalimentari Tradizionali) and regional seasonality calendars - through a cheap staged pipeline (discover, extract, judge) that writes candidates under .pipeline/seasonable/enrich/<region>/ and never touches src/. Use when starting, checking, piloting, tuning or debugging the background sweep, when reading what a region staged, when a stage is blocked, or before shipping a region's candidates onto the page.
---

# Seasonable enrichment

The DOP/IGP register is exhausted (sources ledger, twelfth pass). The dataset grows from two
new tiers, worked one region at a time by `scripts/seasonable-enrich.mjs`, which runs in the
worktree `../walterwebsite-enrich` on branch `seasonable/enrich`. **It stages; it never ships.**
Every invariant in `seasonable-sourcing/SKILL.md` applies to these tiers unchanged.

## The pipeline, and why it is shaped for cost

The first pilot ran the whole job as one Opus agent: **$2.61 for eight schede**, of which almost
all was 41 turns re-reading a context that began at a 105k-token Claude Code prompt. The
pipeline now spends model tokens only on the one real judgement.

| Stage | File | Model | What it costs |
|---|---|---|---|
| discover | `scripts/seasonable-enrich/discover.mjs` + `discover-prompt.md` | sonnet/low, tools: search, fetch, `curl` | once per region × tier |
| extract | `scripts/seasonable-enrich/extract.mjs` | none | $0 |
| judge | `scripts/seasonable-enrich/judge.mjs` + `judge-rules.md` | sonnet/low, **no tools**, one call per ≤60k-char batch | ~$0.01 per product |
| escalate | inside `judge.mjs` | opus, one page | only for `unsure` records |

Every call goes through `callModel` in `lib.mjs`: custom system prompt, no MCP, no skills, no
settings files, no session. Its fixed overhead measured **424 tokens**. Nothing calls `claude`
any other way; a new stage that does undoes the saving.

**Choosing the judge was measured, not assumed.** Replaying the pilot's pages 1–3 of the Molise
atlas: Sonnet/low $0.117, Haiku $0.144 (it wrote 14k output tokens), both agreeing with Opus on
every product being non-candidate. Re-run that replay before changing the default:

```
node scripts/seasonable-enrich/judge.mjs molise pat --pages 1,2,3 --model <m> --out .pipeline/seasonable/enrich/molise/replay-<m>.jsonl
```

### The cost levers, in order of size

1. **No agent loop for reading.** One call per batch, not one turn per action.
2. **Stripped calls.** 424 tokens of fixed prompt instead of 105k.
3. **Code writes everything a model does not need to decide:** source fields, dates, the ledger,
   the files. The model returns compact JSON lines only.
4. **Pre-filter:** a page with no month name, `decade`, `quindicina` or numeric date is never
   sent — invariant 5 means it cannot hold a window. Dense atlases barely shrink (Molise 1 of 12
   pages); sparse ones halve (Sardegna ~84 of 128 pages).
5. **Prompt cache:** rules in the system prompt, pages in the user turn, and the runner pauses
   60 s between paid steps so consecutive batches read the cached rules.

## Safety that replaces trusting an expensive model

- **Verbatim check** (`seasonable-candidates-check.mjs`): every quote and zone quote must occur
  in the normalised text of the page the record names or the page after. A model cannot invent
  a sentence past it. OCR pages are exempt and flagged `ocr`.
- **One retry** with the errors, **one escalation** for `unsure`, then `needs-review.jsonl` —
  nothing is dropped silently, and nothing unchecked reaches `candidates.jsonl`.
- The judge has no tools; discovery cannot write. The runner still reverts any change outside
  `.pipeline/seasonable/enrich/` and blocks the unit.
- `SEASONABLE_MAX_TOTAL_USD` (default 5) is cumulative across restarts and includes the pilot.

## Running it

```
cd ../walterwebsite-enrich
git merge main                                   # pick up pipeline changes
SEASONABLE_MAX_TOTAL_USD=5 caffeinate -i nohup npm run enrich:seasonable > .pipeline/seasonable/enrich/logs/runner.log 2>&1 &
npm run enrich:status                            # per unit: verdicts, provinces reached, pages skipped, cost, $/record
npm run enrich:check                             # the validator over every region
```

Env: `SEASONABLE_JUDGE_MODEL`, `SEASONABLE_JUDGE_EFFORT`, `SEASONABLE_ESCALATE_MODEL`,
`SEASONABLE_DISCOVER_MODEL`, `SEASONABLE_JUDGE_BUDGET_USD` (per call, 0.5),
`SEASONABLE_DISCOVER_BUDGET_USD` (0.3), `SEASONABLE_PAUSE_S` (60).

## What a region folder holds

| File | What |
|---|---|
| `source-<tier>.json` | the document(s) discovery found; `confirmed: false` until a human checks the publisher |
| `extract-<tier>.json` | pages, which were skipped by the pre-filter, which are judged |
| `candidates.jsonl` | validated records: `candidate`, `silent`, `rejected` |
| `needs-review.jsonl` | records that failed checks after retry or stayed `unsure` after escalation |
| `ledger.md` | generated, one line per record per batch |
| `costs.jsonl` | every model call: stage, model, tokens, cost |
| `corpus/` | downloads and extracted text, gitignored |

A hand-fixed `source-<tier>.json` is respected: discovery never overwrites one, and deleting
`extract-<tier>.json` re-runs extraction for free.

## Before a region ships

Walter's decisions, pending, needed once before the first row from each tier: the regional host
allowlist in `src/lib/seasonable.test.ts`, extending the undated-source licence, `designation:
'PAT'`, `basis: 'calendar'`, and the scope copy. Then per region: confirm `source-*.json` is an
official publisher, re-open each candidate's page and re-read the whole scheda (invariant 8 is
the failure the verbatim check cannot catch), work `needs-review.jsonl` by hand, and only then
move rows into `src/content/seasonable/`.
