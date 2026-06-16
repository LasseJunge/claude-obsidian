---
type: reference
title: "ImmoScout24 via Piloterr API"
created: 2026-06-15
updated: 2026-06-15
tags:
  - reference
  - immoscout24
  - scraping
  - api
  - immo-agent
status: current
related:
  - "[[immo — German Real-Estate & Forced-Auction Agent]]"
  - "[[Agentic Web Scraping Pipeline]]"
  - "[[german-scraping-legality]]"
  - "[[2026-06-15-immo-agent-build-session]]"
---

# ImmoScout24 via Piloterr API

[Piloterr](https://piloterr.com) is a paid scraping-as-a-service proxy that provides a clean JSON API over ImmoScout24 (and other portals). It was wired into `tools/immo-agent/` as a fallback connector (`method: "piloterr"` in `config.json`) before the free CDP-attach approach was validated.

## Why it was considered

ImmoScout24 (IS24) is the dominant German property portal but aggressively blocks automated access:
- Headless Playwright → HTTP 401 "Ich bin kein Roboter" block page
- Headful Playwright → same block; also fails from non-interactive shells (`spawn UNKNOWN`)
- Plain `fetch` → immediately blocked

Piloterr solves this by routing requests through residential proxies and managing fingerprint rotation. It returns IS24 search results as structured JSON, avoiding the need to parse HTML.

## Pricing model

Paid per request. Not suitable for daily unattended polling without a budget cap. The user chose the free CDP-attach approach (see [[2026-06-15-immo-agent-build-session]]) instead.

## What the free solution uses instead

Real Chrome launched with `--remote-debugging-port=9222` via `run-is24.cmd`. The connector calls `chromium.connectOverCDP()` to attach to the live browser. IS24's fingerprint detection passes because it's a genuine browser session. IS24 embeds results as a `resultListModel` JSON blob in the page HTML — parsed via brace-matching (`extractFromHtml`), not XHR interception.

## Config flag

```json
"immoscout": { "enabled": false, "method": "browser" }
```

Set `method: "piloterr"` and add a `piloterr_api_key` env var to switch back to the paid path.
