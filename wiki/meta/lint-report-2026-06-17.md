---
type: meta
title: "Lint Report 2026-06-17"
created: 2026-06-17
updated: 2026-06-17
tags: [meta, lint]
status: developing
---

# Lint Report: 2026-06-17

## Summary
- Pages scanned: 326
- Orphan pages: 233 (180 immo, 18 recovered junk, 35 real content)
- Dead-link targets: 128
- Frontmatter gaps: 312
- Post-rollout pages missing address: 6
- Legacy pages without address: 308 (informational)
- Address format errors: 0 · Address collisions: 0 · Counter drift: none

## Root Cause (read this first)

**The orphans and the dead links are the same bug.** Content pages were created
with Title Case filenames, but cross-references point at them with kebab-slug
names. Neither side resolves, so the whole finance/research/PKM cluster is
disconnected.

Examples (dead link → the real orphan page it should reach):
- `[[buffett-hedge-fund-bet]]` (9 refs) → [[Buffett's $1M Hedge-Fund Bet (2008–2017)]]
- `[[gu-kelly-xiu-empirical-asset-pricing-ml]]` (8) → [[Empirical Asset Pricing via Machine Learning (Gu, Kelly, Xiu 2020)]]
- `[[Efficient Market Hypothesis]]` (15) → [[Efficient Market Hypothesis (EMH)]]
- `[[lopez-de-prado-10-reasons-ml-funds-fail]]` (11) → [[The 10 Reasons Most Machine Learning Funds Fail (López de Prado 2018)]]
- `[[spiva-us-scorecard]]` (7) → [[SPIVA U.S. Scorecard]]
- `[[n8n-ai-agents]]` (6) → [[n8n AI Agents]]
- `[[notemd-plugin]]` (5) → [[Notemd Plugin]]

Fixing the alias mismatch repairs ~30 of the 35 real orphans **and** the bulk of
the 128 dead links at once.

## Orphan Pages

### Real content, disconnected by the slug mismatch above (~30)
EMH, ImmoScout24 Search API (Piloterr), Zweites Hirn Aufbau Stack (2026),
Marcos López de Prado, the three `Research_ …` pages, llm-wiki-schema, and the
entire `wiki/sources/` finance + PKM set (Buffett bet, Gu-Kelly-Xiu, day-trading
studies, SPIVA, López de Prado x2, Karpathy, Notemd, n8n, BI tools, Recharts vs
Chart.js, Second Brain, etc.).

### Recovered junk (18) — candidates for deletion
`wiki/recovered/file_20, _30, _31, _56–58, _71–73, _82–84, _178, _180`,
plus `Either of these confirms a workspace_`, `For each test you generate`,
`Browser Automation with playwright-cli`, `Playwright Trace CLI`.
These look like recovery artifacts with no inbound links and generic names.

### immo listings (180) — orphan by design
The immo/ scrape pages are leaf data, not meant to be cross-linked. Not a defect.

## Dead Links — other notable targets (not slug-mismatch)
- `[[concepts/_index]]` (7), path-style link — should be `[[_index]]` or a proper alias.
- `[[wiki-links]]` (7), `[[Page]]` (6), `[[Autonomous AI Agent]]` (4) — generic/template placeholders; either create stubs or remove.

## Frontmatter Gaps (312 reported — mostly false positives)
The required-field list (`type/status/created/updated/tags`) does not match the
vault's actual per-collection schemas:
- **180 immo pages** use a deliberate listing schema (`type: immo-listing`,
  `price`, `gross_yield_pct`, `first_seen`, `status: active`). Not gaps. Ignore.
- **Concept/entity/source pages** carry domain metadata (`complexity`, `domain`,
  `aliases`) and merely lack the *generic* `created/updated/status/tags`.

Decision (2026-06-17): NOT bulk-backfilling. Fabricating `created` dates across
~130 pages is low-value churn and post-recovery mtimes are unreliable. Optional
honest pass available: backfill `created`/`updated` from git history only.
Lint skill's required-field list should be made collection-aware (process improvement).

## Address Validation (DragonScale on)
- Format errors: 0 · Collisions: 0 · Counter drift: none. Healthy.
- Post-rollout pages **missing** an address (lint error per Mechanism 2):
  - [[2026-06-16-vault-exploration-and-ponytail-install]] (meta session — likely exempt)
  - [[2026-06-16-vault-recovery-and-skill-repair]] (meta session — likely exempt)
  - [[2026-06-17-paypal-migration-tracking]] (meta session — likely exempt)
  - [[Questions Auto Translate]] (2026-06-10) — real page, should get an address
  - [[german-scraping-legality]] (2026-06-15) — real page, should get an address
  - [[immoscout24-piloterr-api]] (2026-06-15) — real page, should get an address
  > [!gap] The three `2026-06-*` session notes are `type: meta`-ish but live in
  > `wiki/meta/` — confirm whether meta session notes should be address-exempt.
- Legacy pages without address: 308 (informational, expected — pre-rollout backfill pending).

## Actions taken (2026-06-17)
1. ✅ **Alias mismatch repaired** — added slug aliases to 28 target pages. Real
   dead-link occurrences and ~30 content orphans resolved. Remaining 82 unresolved
   targets are template/example placeholders inside skill+schema docs (`[[Page]]`,
   `[[Foo]]`, `[[Concept Name]]`, etc.) — intentionally left alone.
2. ✅ **`wiki/recovered/` triaged** — deleted 14 junk/duplicate files (node_modules
   READMEs, duplicate skill fragments). Refiled the triplicated Kibana churn draft to
   [[Kibana Churn Dashboard Spec (Draft)]]. 5 substantive recovered skill docs
   (playwright x4, immo skill copy) left pending user decision.
3. ✅ **Frontmatter dates** — backfilled `created`/`updated` from **git history**
   (honest, not fabricated) on 44 content pages. Most resolve to 2026-06-16 (the
   vault-recovery commit = earliest real commit); a few are genuinely older
   (2026-04-07, 2026-05-17). `status`/`tags` intentionally not forced — collection
   schemas already carry semantic metadata. Immo listings untouched (own schema).
4. ✅ **Addresses** — allocated c-000008/009/010 to Questions Auto Translate,
   german-scraping-legality, immoscout24-piloterr-api; counter bumped 7→10. The three
   `2026-06-*` meta session notes treated as address-exempt (type meta, in wiki/meta/).
5. ✅ **`wiki/recovered/` removed** — 5 remaining recovered skill docs (playwright x4,
   immo skill copy) were duplicates of real skills; deleted. Folder removed entirely.

## Still open (process fix, not urgent)
- Make lint's required-field list collection-aware so immo + domain schemas stop
  reporting as false-positive frontmatter gaps.
