---
name: immo
description: Autonomous German real-estate + forced-auction monitor. Scrapes Zwangsversteigerungen (zvg-portal.de), bank/insolvency auctions (argetra), and Kleinanzeigen; scores listings by rental yield, auction discount to Verkehrswert, and €/m²; files matches as Obsidian notes and rebuilds an interactive dashboard. Trigger when the user wants to search the German property market, find forced auctions, or run/refresh the immo agent.
---

# immo — German Real-Estate & Forced-Auction Agent

A local Node.js agent (zero dependencies) living in `tools/immo-agent/`. It is both a
**monitor** (run on a schedule, dedup + survivorship-safe) and a **dashboard** generator,
and it files every interesting find as a structured Obsidian note so you never have to
dig through portals manually.

## How to run

```bash
cd tools/immo-agent
node src/index.mjs run          # full pipeline -> notes + dashboard
node src/index.mjs run --dry    # fetch + score, no writes (safe test)
node src/index.mjs top 15       # show stored top matches
node src/index.mjs dashboard    # rebuild dashboard only
```

On Windows PowerShell, same commands (`node src/index.mjs run`). **Do not use Python** —
this machine has no real Python interpreter; the agent is intentionally Node-only.

## What it does (pipeline)

1. **Scrape** each enabled source (see `config.json`):
   - `zvg` — **Zwangsversteigerungen** from zvg-portal.de (the official Länder justice
     portal; public data). Per-Bundesland POST search, parses Aktenzeichen, Objekt/Lage,
     Verkehrswert (when listed inline), Termin, PLZ.
   - `bank_auctions` — Deutsche Grundstücksauktionen AG / argetra catalogue (JSON markers:
     Limit/starting price, category, region, GPS).
   - `kleinanzeigen` — Kleinanzeigen buy categories (Haus / Wohnung / Grundstück).
   - `immoscout` — ImmoScout24 via a real browser (Playwright Chromium, no paid API).
     IS24 has a "Ich bin kein Roboter" wall **and** detects headless mode, so it runs
     **headful and on demand only**: `node src/index.mjs run --is24` from an interactive
     terminal opens a visible window (solve the challenge if shown; the `.is24-profile/`
     session usually skips it on repeat). Kept out of the automated headless job by design.
     `method:"piloterr"` switches to the paid API. ToS-sensitive — only listing facts
     stored, no agent PII. See `tools/immo-agent/README.md` §ImmoScout24.
2. **Normalize & score** — €/m², gross yield (real cold rent or estimated from
   `rent_benchmark_eur_sqm`), and **discount to Verkehrswert** for auctions.
3. **Store** — `tools/immo-agent/immo.json`, deduped by `source:id`. **Survivorship-safe**:
   vanished listings flip to `status:delisted` but are never deleted.
4. **File notes** — interesting matches (yield/discount/price thresholds) **plus every
   forced/bank auction** land in `wiki/immo/` as Obsidian notes.
5. **Dashboard** — `wiki/immo/dashboard.html`: KPI cards, region/type/source filters, a
   yield-vs-price scatter, and a sortable table. Self-contained, opens in any browser.

## Configuring the search

Edit `tools/immo-agent/config.json` (copy from `config.example.json` if missing):
- `regions` — Bundesländer, PLZ prefixes, cities (region filter is OR across these).
- `property_types` — `haus` | `wohnung` | `grundstueck` | `gewerbe`.
- `price` — purchase-price min/max.
- `yield` — `min_gross_yield_pct`, `min_auction_discount_pct`, `max_price_per_sqm`
  (any one clearing flags a listing as interesting).
- `sources.*.enabled` — toggle sources.

When the user asks to change the search ("find auctions in Bayern under 300k"), edit
`config.json`, confirm the change, then run.

## Scheduling (the "monitor" half)

To run daily on Windows, register a Task Scheduler job — see `tools/immo-agent/README.md`
§Scheduling. Each run dedups against `immo.json`, so notes/dashboard only grow with genuinely
new objects.

## Reporting back

After a run, tell the user: per-source fetched/matched counts, the top few matches
(**forced auctions first**, with discount-to-Verkehrswert), and links to
[the dashboard](wiki/immo/dashboard.html) and the `wiki/immo/` notes.

## Legal note (surface once, don't nag)

Forced-auction and bank-catalogue data is public → fine to read. Commercial portals
(ImmoScout24, Kleinanzeigen) prohibit scraping in their ToS and GDPR restricts storing
agent/realtor PII — the agent stores only listing facts, never personal contact data. For
commercial use, recommend German legal counsel. See `wiki/sources/german-scraping-legality.md`.

## How to think (think-skill appendix)

- **OBSERVE** the source first: portals change markup; verify a live fetch parses before
  trusting counts. The connectors isolate parsing in one function each — adjust there.
- **CONNECT** to the wiki: this agent operationalizes `wiki/concepts/Agentic Web Scraping Pipeline.md`
  and `wiki/sources/immoscout24-piloterr-api.md`.
- **ACCEPT** limits: zvg list views often omit Verkehrswert (it's in the PDF), so some
  auctions have no discount score — they're still filed because the user wants them surfaced.
