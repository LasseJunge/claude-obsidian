---
type: meta
title: "Lint Report 2026-06-16"
created: 2026-06-16
updated: 2026-06-16
tags: [meta, lint]
status: developing
---

# Lint Report: 2026-06-16

Run immediately after the IDB-restore corruption recovery + restructure (commit `c07c14f`). Context matters: most findings below are **consequences of the recovery**, not normal drift.

## Summary
- Pages scanned: **314**
- Corruption: **0** (verified clean post-recovery)
- Dead-link targets: **118 distinct** → triaged into 3 classes below
- Orphan pages: **29** (excluding immo/recovered/meta/index)
- Frontmatter gaps: **236** (≈230 are immo listings — see note)
- Address validation: **clean** (5 addresses, no duplicates, no drift)
- Semantic tiling: **skipped** (no `python3`/ollama on this machine)

---

## Dead Links — Class A: template/example links (IGNORE, ~45)

Not real errors. These live inside reference/skill docs that contain illustrative wikilinks:
- `references/llm-wiki-schema.md` — `[[Concept Name]]`, `[[Page A]]`, `[[New Page]]`, `[[Annual Goals]]`, etc. (~40)
- `concepts/DragonScale Memory.md` — `[[Foo]]`
- `references/transport-fallback.md`, `references/methodology-modes.md` — `[[wiki-cli]]`, `[[wiki-mode]]`, `[[mcp-setup]]`, `[[methodology-modes-guide]]` (point at skills, not wiki pages)
- `wiki/recovered/file_*.md` — `[[Page]]` fragments
- `wiki/folds/…` — `[[wiki-fold]]`, `[[fold-template]]`

**Action:** none.

---

## Dead Links — Class B: slug→title naming mismatches (FIXABLE, ~30)

The recovery re-saved many pages under their **human title** instead of their slug, so old slug-based links break even though the content exists. Examples (link → existing file):

- `[[Efficient Market Hypothesis]]` → `Efficient Market Hypothesis (EMH).md` (13 refs)
- `[[Zweites Hirn Aufbau Stack]]` → `Zweites Hirn Aufbau Stack (2026).md` (8 refs)
- `[[How does the LLM Wiki pattern work?]]` → `How does the LLM Wiki pattern work.md` (5 refs)
- `[[notemd-plugin]]` → `Notemd Plugin.md` (6 refs)
- `[[best-ai-agents-2026-datacamp]]` → `Best AI Agents in 2026 (DataCamp).md` (8 refs)
- `[[buffett-hedge-fund-bet]]` → `Buffett's $1M Hedge-Fund Bet (2008–2017).md` (8 refs)
- `[[day-trading-profitability-studies]]` → `Day-Trading Profitability Studies (Brazil & Taiwan).md`
- `[[gu-kelly-xiu-empirical-asset-pricing-ml]]` → `Empirical Asset Pricing via Machine Learning (Gu, Kelly, Xiu 2020).md`
- `[[lopez-de-prado-10-reasons-ml-funds-fail]]` → `The 10 Reasons Most Machine Learning Funds Fail (López de Prado 2018).md`
- `[[bailey-lopez-de-prado-backtest-overfitting]]` → `Pseudo-Mathematics and Financial Charlatanism (Bailey et al. 2014).md`
- `[[llms-in-equity-markets-review]]` → `LLMs in Equity Markets — Review (2025).md`
- `[[spiva-us-scorecard]]` → `SPIVA U.S. Scorecard.md`
- `[[recharts-vs-chartjs-2026]]` → `Recharts vs. Chart.js — 2026 Entscheidungsgrundlage.md`
- `[[claude-code-dashboard-best-practices]]` → `Claude Code Best Practices für Dashboards.md`
- `[[claude-code-data-analytics-plugins-2026]]` → `Claude Code Data Analytics Plugins (2026).md`
- `[[open-source-bi-tools-2026]]` → `Open-Source BI Tools 2026.md`
- `[[immoscout24-piloterr-api]]` → `ImmoScout24 Search API (Piloterr).md`
- `[[n8n-ai-agents]]`, `[[local-llm-hub-plugin]]`, `[[johnny-decimal-zettelkasten-ai-librarian]]`, `[[karpathy-llm-wiki-step-by-step]]` → respective Title-Case files
- `[[Research- AI Agents …]]` / `[[Research- Claude Dashboard …]]` / `[[Research- Data Analytics …]]` → the `Research_ …` files I relocated to `questions/`

**Recommended fix:** add an `aliases:` frontmatter entry (the old slug) to each renamed page — Obsidian then resolves the old links with zero edits to referrers. Alternatively, bulk-update the links. ~30 pages.

---

## Dead Links — Class C: TRULY LOST pages (need regeneration, ~12)

No copy exists on disk, in git history, or in the backup tarball — the recovery dropped them and they were never committed. High-reference-count ones are the ePages dashboard knowledge:

| Lost page | refs | Regeneratable from |
|---|---|---|
| `[[Survivorship Bias in SaaS Metrics]]` | 14 | `.raw/Claude-Dashboard-Optimierung und KPI-Empfehlungen.md` |
| `[[Test Shop Exclusion]]` | 7 | `.raw/Claude-Testshops aus Dashboard ausschließen.md` |
| `[[Trial Cohort Conversion Rate]]` | 7 | `.raw/Claude-Conversion Rate bei tausenden Shops skalieren.md` |
| `[[Company-Wide Dashboard Hosting]]` | 10 | `.raw/Claude-Unternehmensweites Dashboard-Setup.md` |
| `[[Stripe Subscription Trial Tracking]]` | 4 | trial-conversion conversations |
| `[[Netlify]]` (entity) | 9 | `.raw/Claude-Supabase-Integration…debuggen.md` |
| `[[conversion-dashboard]]` (source) | 3 | production SPA source |
| `[[epages-spreedly-stripe-dashboard-integration]]` | 5 | `.raw/Claude-Spreedly zu Stripe Dashboard Integration.md` |
| `[[supabase-security-best-practices]]` | 2 | autoresearch source |
| `[[claude-commands-skill-registration]]` | 1 | — |
| `[[claude-obsidian-presentation]]`, `[[AI Marketing Hub Cover Images Canvas]]` | 1 each | canvases |

Plus low-value singletons referenced only from session logs (`[[Claude Canvas]]`, `[[Rankenstein]]`, `[[Three laws of motion]]`, `[[Foo]]`).

**Recommended fix:** the `.raw/` conversation files were referenced here but **do not exist on disk** — they were never exported from Claude. To regenerate these pages, export the relevant conversations from Claude and drop them into `.raw/`, then re-ingest. Alternatively, recreate from memory/context.

---

## Orphan Pages (29)

Almost all are the finance/research **source** pages relocated during cleanup (`Best AI Agents…`, `Buffett's…`, `SPIVA…`, etc.) plus the 3 `Research_…` syntheses. They're orphaned because their parent synthesis/index links use the old slugs (Class B) — **fixing Class B aliases resolves most of these orphans automatically.** `references/llm-wiki-schema.md` is orphan-by-design (reference doc).

---

## Frontmatter Gaps (236)

- ~230 are `wiki/immo/*` listings missing `title`/`created`/`updated`. These are immo-agent output with intentionally minimal frontmatter (they carry `type: immo-listing` + listing fields). **Low priority / by design** — flag only.
- A handful of real pages may need `status`/`tags` backfill (buried in the immo noise); worth a targeted pass after the immo listings are excluded.

---

## Address Validation (DragonScale Mechanism 2)

- Counter: **7** (`allocate-address.sh --peek` unavailable — no `flock` on this machine; validated manually).
- Addresses in use: `c-000001, c-000004, c-000005, c-000006, c-000007` — no duplicates, no drift (all < counter).
- `.raw/.manifest.json` `address_map` matches page frontmatter for all 5. ✅
- `c-000002`/`c-000003` were allocated to pages lost in the recovery (gap is expected, not an error).

---

## Semantic Tiling — skipped

`scripts/tiling-check.py` needs `python3` + ollama; neither is available here. No duplicate-by-similarity scan performed. (Exact-title dedup was already done during recovery; only the legitimate "Hot Cache" trio shares a title.)

---

## Recommended actions (in priority order)

1. **Class B fix (high value, low risk):** add `aliases:` (old slugs) to the ~30 renamed pages → clears most dead links AND most orphans at once.
2. **Class C regeneration (high value):** re-ingest the 5 ePages `.raw/` conversations to rebuild the lost concept/entity pages.
3. **Frontmatter:** leave immo listings; optionally backfill `title` for them from their `# heading`.
4. Nothing to do for Class A or address validation.
