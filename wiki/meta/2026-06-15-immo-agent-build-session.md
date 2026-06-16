---
type: session
title: "immo-agent Build Session — German Real-Estate + Forced-Auction Monitor"
created: 2026-06-15
updated: 2026-06-15
tags:
  - session
  - immo-agent
  - real-estate
  - scraping
  - automation
  - immoscout
status: developing
related:
  - "[[Agentic Web Scraping Pipeline]]"
  - "[[Research- AI Agents for Autonomous Tasks and German Real Estate Rent Comparison]]"
  - "[[immoscout24-piloterr-api]]"
  - "[[german-scraping-legality]]"
sources:
  - "[[immoscout24-piloterr-api]]"
  - "[[german-scraping-legality]]"
---

# immo-agent Build Session

Built `tools/immo-agent/` — an autonomous German real-estate + forced-auction (Zwangsversteigerung) monitor — from the prior research ([[Research- AI Agents for Autonomous Tasks and German Real Estate Rent Comparison]], [[Agentic Web Scraping Pipeline]]). Operationalizes the scrape → normalize → score → store → report loop on a daily schedule, files matches as Obsidian notes, and renders an HTML dashboard. Invoked via the `/immo` command / `immo` skill.

## Key build decision: Node, not Python

This machine has **no real Python** (only the Windows Store stub) — see [[reference_pdf_rendering_winrt|the PDF-rendering note]] for the same constraint. The agent is therefore **zero-dependency Node.js** (built-in `fetch`, a JSON-file store, regex parsing). Playwright is the one optional dependency, used only for ImmoScout24.

## Architecture

- **Connectors** (each isolates parsing in one function, supports a `sample_html` offline fixture):
  - `zvg` — zvg-portal.de forced auctions. **Verified live flow**: GET `index.php?button=Termine suchen` → POST `button=Suchen` per Bundesland, `all=1`, **ISO-8859-1** encoded. Stateless (no session cookie). Parses Aktenzeichen / Objekt-Lage / Verkehrswert (only when inline; often only in the PDF) / German-format Termin date.
  - `bank` — dga-ag.de / argetra catalogue. Objects embedded as **JSON map markers** (`limit`, `region`, `category`, GPS) — parsing the JSON beats scraping cards.
  - `kleinanzeigen` — buy categories. **Gotcha**: filters by a numeric **location id**, not city name; resolve via `/s-ort-empfehlungen.json?query=<city>` (Hamburg = 9409). A bare `/l-<city>/` returns nationwide results. Take the **largest €** on a card as the sale price (cards also show Kaution/"ab" figures).
  - `immoscout` — see the IS24 saga below.
- **normalize** — €/m², gross yield (real cold rent or estimated from `rent_benchmark_eur_sqm`), discount-to-Verkehrswert, scoring + filters.
- **store** — `immo.json`, deduped by `source:id`, **survivorship-safe** (vanished listings flip to `status:delisted`, never deleted).
- **obsidian** — files matches as `wiki/immo/*.md` (interesting matches + every auction).
- **dashboard** — self-contained `wiki/immo/dashboard.html` (inline-SVG charts, filters, sortable table, an **Art = 🔨 Auktion / Kauf** indicator). **Must be opened in a browser, not Obsidian** (Obsidian won't render raw HTML).

## The ImmoScout24 saga (the hard part)

IS24 is the dominant portal but actively blocks bots. The path that finally worked:

1. **Piloterr API** ([[immoscout24-piloterr-api]]) wired in as a fallback (`method:"piloterr"`, paid) but the user wanted free.
2. **Headless Playwright** → IS24 serves a hard **"Ich bin kein Roboter"** block page (HTTP 401), not a solvable challenge. Stealth tweaks didn't help.
3. **Headful Playwright** → same block; also can't be launched from a non-interactive shell (`spawn UNKNOWN`).
4. **CDP attach to the user's real Chrome** (the winner): a `run-is24.cmd` launcher starts real Chrome with `--remote-debugging-port=9222` + a dedicated profile; the connector `chromium.connectOverCDP()`s to it. A genuine browser fingerprint passes IS24's detection. **Must run from an interactive terminal** (the user double-clicks the launcher).
5. **Parsing**: IS24 embeds results as a `resultListModel` JSON blob in the page HTML (brace-matched out via `extractFromHtml`), **not** in XHR responses. Fields: `resultlist.realEstate` with `price.value`, `livingSpace`, `numberOfRooms`, `address.postcode`. Type label is `search:ApartmentBuy`.
6. **IS24 foreclosures**: a separate category at `/Suche/de/<city>/<city>/zwangsversteigerung` (tagged source `is24-zvg`). Type `search:CompulsoryAuction` carries no `price`; the **Mindestgebot** lives in a `search_result_list` block (`minimum_bid`) — merged in by `expose_id`.

### IS24 gotchas worth remembering
- IS24 addresses carry **no Bundesland**, only city + PLZ — so a Bundesland-only region filter dropped all Hamburg foreclosures. Fix: derive Bundesland from city for the three city-states (Hamburg/Berlin/Bremen) + add city/plz to `auction_regions`.
- IS24 paginates 20/page; read `numberOfPages` from the model and loop (`max_pages` cap).

## Filtering model (final)

- **Region**: flats use `regions` (Hamburg); auctions use a wider `auction_regions` (Hamburg + Schleswig-Holstein + Niedersachsen) because forced auctions are rare in a single city. Hamburg often has **zero** zvg auctions — not a bug.
- **Auctions are exempt** from the property-type filter, the minimum-price floor, and the room-count filter (a cheap forced auction of any type is a bargain). The **price ceiling (€400k) applies to everything**.
- **Flat-quality filters** (flats only): `rooms.min: 2`, `price.min: 150000`, `exclude_new_build: true` (IS24 `exclusioncriteria=projectlisting`). Pushed into the IS24 URL so fewer pages are fetched.

## Delivery / ops

- **`/immo`** command + `immo` skill (conversational), plus `run-is24.cmd` launcher and two Desktop shortcuts ("Immo Dashboard", "Update ImmoScout24").
- **Daily scheduled task** `immo-agent-daily` at 09:00, run-if-missed, battery-allowed, logs to `immo-daily.log`. Runs the **3 free sources headless**; IS24 stays on-demand (headful CDP attach can't be unattended).
- **Config** (`config.json`) is gitignored (personal search prefs); so are `immo.json`, `.is24-profile/`, and `wiki/immo/` (generated output).

## Source control

Work committed on local branch `feat/immo-agent`. The vault's `origin` (AgriciDaniel/claude-obsidian) is **public**, so the tool was split out (`git subtree split --prefix=tools/immo-agent`) and pushed to a **private** repo `github.com/LasseJunge/immo-agend` (`backup` remote, `immo-only:main`). Re-sync after changes: `git subtree split --prefix=tools/immo-agent feat/immo-agent -b immo-only -f && git push backup immo-only:main`.

## Verification status

- 17-check offline smoke test (`node test/smoke.mjs`) covers zvg parsing, normalization, filters, notes, dashboard, and the IS24 embedded-blob parser.
- zvg / bank / kleinanzeigen verified live. IS24 parser verified offline against a real captured page (20/20 flats + 20/20 foreclosures). IS24's true **Verkehrswert** (vs Mindestgebot) lives on each expose page and is not yet scraped.

_Automatically filed via /save._
