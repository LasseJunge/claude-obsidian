---
description: Run the German real-estate + forced-auction (Zwangsversteigerung) agent. Scrapes zvg-portal, bank/insolvency auctions, and Kleinanzeigen, scores by yield/discount, files matches as Obsidian notes, and rebuilds the dashboard.
---

Read the `immo` skill (`skills/immo/SKILL.md`), then run the agent.

Usage:
- `/immo` — run the full pipeline with the saved criteria in `tools/immo-agent/config.json`.
- `/immo top` — just show the current top matches from the last run (no fetch).
- `/immo <region/type/budget>` — adjust the search (e.g. `/immo Berlin Wohnung unter 400k`); update `config.json` accordingly, confirm the change, then run.
- `/immo dashboard` — rebuild the dashboard from stored data without fetching.

The agent runs locally on Node (no Python). After it finishes, report:
1. How many objects each source returned and how many matched.
2. The top 3–5 matches (forced auctions first), with price, location, and — for auctions — the discount to Verkehrswert.
3. Link the dashboard: [wiki/immo/dashboard.html](wiki/immo/dashboard.html) and the notes folder `wiki/immo/`.

If `config.json` doesn't exist yet, copy `config.example.json` to it first and tell the user the default region (northern Germany) — offer to change it.
