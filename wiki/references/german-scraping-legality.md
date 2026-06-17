---
type: reference
address: c-000009
title: "German Web Scraping Legality"
created: 2026-06-15
updated: 2026-06-15
tags:
  - reference
  - legality
  - scraping
  - germany
  - immo-agent
status: current
related:
  - "[[immo — German Real-Estate & Forced-Auction Agent]]"
  - "[[Agentic Web Scraping Pipeline]]"
  - "[[2026-06-15-immo-agent-build-session]]"
---

# German Web Scraping Legality

Research note compiled during the immo-agent build to understand the legal constraints of scraping German real-estate portals.

## Key legal framework

- **§ 4 UWG** (Unfair Competition Act) — scraping that systematically extracts and republishes data for commercial competition can constitute an unfair act. Personal/research use is a much lower risk.
- **§ 87a–87e UrhG** (Database protection) — database producers have a sui generis right. Systematically extracting a substantial part of a database (e.g. all ImmoScout24 listings) can infringe this right regardless of copyright. Scraping small slices for personal use is generally tolerated.
- **CFAA analogy / Hausrecht digital** — German courts have upheld ToS-based access restrictions under general civil law (§ 1004 BGB analogy), though enforcement against private individuals is rare.

## Practical risk assessment (personal use)

| Source | Data owner | Risk level | Notes |
|--------|-----------|------------|-------|
| zvg-portal.de | Justice ministries (public) | **Very low** | Official public data; no ToS restriction on personal use |
| dga-ag.de / argetra | Private | **Low** | Auction catalogues; personal research use generally accepted |
| Kleinanzeigen | eBay/Adevinta | **Low–Medium** | ToS prohibits automated access; enforcement against personal use is uncommon |
| ImmoScout24 | Scout24 AG | **Medium** | ToS prohibits scraping; Scout24 has pursued commercial scrapers legally; personal daily polling is low-profile |

## Mitigations built into immo-agent

1. **Polite crawling** — `delay_seconds: 2.0` between requests; `timeout_seconds: 30`; honest `User-Agent` with contact email
2. **No republication** — data stays local (`immo.json`) and in a private Obsidian vault; dashboard is not publicly hosted
3. **Private backup repo** — `LasseJunge/immo-agend` is private; listings not pushed to public `AgriciDaniel/claude-obsidian`
4. **No commercial use** — purely personal investment research
5. **IS24 on-demand only** — IS24 is not hit by the daily cron job, only manually

## Bottom line

For personal investment research with polite request rates and no republication, the practical legal risk is low. The agent was designed with these mitigations from the start.
