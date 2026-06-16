---
type: session
title: "Vault Exploration and Ponytail Install"
created: 2026-06-16
updated: 2026-06-16
tags:
  - session
  - vault
  - skills
  - ponytail
  - seo
status: evergreen
related:
  - "[[Claude SEO]]"
  - "[[hot]]"
  - "[[index]]"
---

# Vault Exploration and Ponytail Install

Session: 2026-06-16. Goal was to understand what's in the claude-obsidian vault and get maximum value from it.

## Claude SEO

[[Claude SEO]] (skills/claude-seo, `/seo` command) is a Tier 4 Claude Code skill for website SEO analysis. Repo: AgriciDaniel/claude-seo, v1.9.0.

It is NOT useful for building the app itself — only for the public-facing website or marketing layer around an app. Useful moments:

- Pre-launch: `audit`, `cluster`, `sxo` for content structure and keyword targeting
- Technical: `schema`, `sitemap`, `technical` for crawlability
- Post-launch monitoring: `drift baseline` + `drift compare` for ranking

**Memory saved:** Suggest Claude SEO whenever the user mentions building an app.

## Complete Vault Inventory (high-level)

| Category | Count | Notes |
|----------|-------|-------|
| Skills | 16+5 | wiki, wiki-ingest, wiki-query, wiki-lint, wiki-cli, wiki-fold, wiki-mode, wiki-retrieve, autoresearch, save, canvas, think, defuddle, immo, obsidian-bases, obsidian-markdown + 5 ponytail skills added this session |
| Agents | 3 | verifier (pre-commit), wiki-ingest, wiki-lint |
| Scripts | 12 | 3 shell, 9 Python (retrieval, indexing, locking, mode routing) |
| Setup bins | 5 | setup-vault, setup-mode, setup-retrieve, setup-dragonscale, setup-multi-agent |
| Tests | 9 | `make test` runs all |
| Tools | 1 | immo-agent (German real-estate monitor) |

Key features beyond skills: transport abstraction (CLI/MCP/filesystem fallback), per-file advisory locking (wiki-lock.sh), hybrid retrieval (BM25 + cosine rerank), DragonScale Memory (fold/address/tiling), pre-commit verifier agent.

## Proactive Skill Suggestion Map

Memory saved to suggest relevant skills situationally:

| Situation | Skill |
|-----------|-------|
| Dashboard / CSV / SQL / metrics work | `data:analyze`, `data:sql-queries`, `data:build-dashboard` |
| Writing or reviewing code | `engineering:code-review`, `engineering:debug` |
| Researching a topic | `/autoresearch` |
| End of significant session | `/save` |
| Big architectural decision | `/think` |
| Ingesting a web article | `/defuddle [url]` first |
| Building an app with public website | Claude SEO |
| Querying prior research | `/wiki-query` |
| Writing new code | `/ponytail` (lean mode) |
| After writing code | `/ponytail-review` |
| Repo complexity sweep | `/ponytail-audit` |

## Ponytail: Installed

**Source:** https://github.com/DietrichGebert/ponytail

Ponytail is a "lazy senior dev" Claude Code plugin. Core philosophy: the best code is the code never written. Enforces a decision ladder before generating any code:

1. Does it need to exist? (YAGNI)
2. Does stdlib solve it?
3. Does a native platform feature work?
4. Is there an already-installed dependency?
5. Can it be one line?
6. Only then: minimum working code

**Claims:** 80-94% less code, 3-6x faster, 47-77% cheaper than baseline agent behavior.

**Why relevant:** Dashboard work (single-file HTML apps, no build step) and immo-agent (Node.js, zero deps by design) both benefit from keeping code lean. Ponytail aligns with the existing immo-agent philosophy.

**Installed:**
- `skills/ponytail/SKILL.md` — lazy mode (activate before writing)
- `skills/ponytail-review/SKILL.md` — complexity review of current diff
- `skills/ponytail-audit/SKILL.md` — full repo over-engineering audit
- `skills/ponytail-debt/SKILL.md` — harvest `ponytail:` deferred shortcuts
- `skills/ponytail-help/SKILL.md` — quick reference
- All 5 wired as `.claude/commands/ponytail*.md`

**Key commands:**

| Command | Use |
|---------|-----|
| `/ponytail` | Activate before writing new code |
| `/ponytail lite` / `/ponytail ultra` | Adjust intensity |
| `/ponytail off` | Deactivate |
| `/ponytail-review` | Review diff for complexity after writing |
| `/ponytail-audit` | Full repo sweep |
| `/ponytail-debt` | List all `ponytail:` deferred shortcuts |

Ponytail does NOT replace `/code-review` — it only addresses complexity, not correctness bugs or security.

## Memories Saved This Session

- `feedback_app_building_seo.md` — suggest Claude SEO when user mentions building an app
- `feedback_skill_suggestions.md` — proactive skill suggestion map
- `feedback_ponytail.md` — suggest ponytail when writing or reviewing code
