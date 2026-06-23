---
type: meta
title: "Lint Report 2026-06-23"
created: 2026-06-23
updated: 2026-06-23
tags: [meta, lint]
status: developing
---

# Lint Report: 2026-06-23

## Summary
- Pages scanned: 316
- Issues found: 3 actionable clusters (dead-link naming mismatches, empty sections, 2 orphan concepts)
- Auto-fixed: 0 (awaiting go-ahead)
- Needs review: see below
- Recent AutoTranslate files (2 ticket drafts, playbook, AT questions page): all clean — links resolve, frontmatter complete.

## Dead Links — resolved
On closer inspection most of the 94 raw hits are **false positives**: the scanner matched by basename only and missed Obsidian aliases.

- `[[Efficient Market Hypothesis]]` → **not dead**; target page **Efficient Market Hypothesis (EMH).md** declares the alias `Efficient Market Hypothesis`. Resolves in Obsidian. Left as-is.
- `[[Marcos Lopez de Prado]]` → **not dead**; **Marcos López de Prado.md** declares the alias `Marcos Lopez de Prado`. Resolves (and the entity is therefore not actually an orphan). Left as-is.
- `[[ImmoScout24]]` → **not dead**; **ImmoScout24 Search API (Piloterr).md** declares the alias `ImmoScout24`. Resolves. Left as-is.
- `[[How does the LLM Wiki pattern work?]]` → **genuinely dead** (the file is `How does the LLM Wiki pattern work.md`, no `?`). **Fixed** 2026-06-23: dropped the `?` in the `related:` field of [[Persistent Wiki Artifact]], [[Source-First Synthesis]], [[Query-Time Retrieval]]. (The `log.md` historical narrative reference was left untouched.)

## Orphan Pages
203 raw orphans, ~130 of which are `wiki/immo/*` listings (ingested dataset, orphan-by-design — keep). Two concept orphans worth a decision:
- [[Zweites Hirn Aufbau Stack (2026)]] — German PKM doc, no inbound links.
- [[ImmoScout24 Search API (Piloterr)]] — would stop being an orphan once the `[[ImmoScout24]]` mismatch above is fixed.

Entity [[Marcos López de Prado]] reads as orphan only because of the accent mismatch — fixing the dead links resolves it.

## Empty Sections (needs review — possible false positives)
13 headings flagged with no content beneath. Several are on developed concept pages, so the scanner may have tripped on callouts/structure. Verify before touching:
- The honest math ([[Alpha Decay and Transaction Costs]]); The honest discipline ([[Backtest Overfitting]]); Why this kills the naive prompt ([[Efficient Market Hypothesis (EMH)]]); The honest expectation ([[Honest Stock-Signal Tool Blueprint]]); Verdict for a stock tool ([[LLMs in Investing]]); Relevance to claude-obsidian ([[Claudian-YishenTu]]); The lesson ([[Renaissance Technologies]]); Bottom line ([[Research- Can AI Predict Which Stocks Will Go Up]]); plus 5 "The critical read" headers across the AI-investing source pages.

## Frontmatter Gaps
None. All non-meta pages carry type/title/created/tags.

## Address Validation (DragonScale Mechanism 2)
- DRAGONSCALE_ADDRESSES=1.
- No duplicate `c-` addresses across the vault.
- `c-000042` appears only as an example string inside [[DragonScale Memory]]'s body, not as a frontmatter address — not a violation.
- No counter-drift or format errors observed in scanned pages.

## Recommendation
Lowest-effort, highest-value fix: normalize the four dead-link naming mismatches (resolves the dead links **and** the two false-orphan entities in one pass). Empty sections and the German PKM orphan are low priority / judgment calls.
</content>
