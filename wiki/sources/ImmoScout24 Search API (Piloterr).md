---
type: source
created: 2026-06-16
updated: 2026-06-16
source_type: documentation
title: "ImmoScout24 Search Scraper API (Piloterr)"
aliases:
  - "ImmoScout24"
  - "immoscout24-piloterr-api"
author: Piloterr
date_published: 2026
url: https://www.piloterr.com/library/immoscout24-search
confidence: medium
tags:
  - source
  - real-estate
  - scraping
  - germany
key_claims:
  - "Returns ImmoScout24 listings as structured JSON: cold/warm rent, rooms, m², address, PLZ, GPS"
  - "Bypasses ImmoScout24's Cloudflare anti-bot transparently"
  - "Paid: free trial 50 credits, plans €45–€919/mo, 1 credit per search"
related:
  - "[[Research- AI Agents for Autonomous Tasks and German Real Estate Rent Comparison]]"
  - "[[ImmoScout24]]"
---

# ImmoScout24 Search API (Piloterr)

Third-party API for querying ImmoScout24 listings programmatically.

- **Fields:** cold rent + warm rent (EUR), room count, living area (m²), address, city, postal code, GPS lat/long, property type, expose ID, publication timestamp, seller type.
- **Anti-bot:** ImmoScout24 uses Cloudflare to block bots; Piloterr handles bypass transparently — single GET returns JSON, no HTML parsing.
- **Suitability:** good for agent use (structured JSON, no fragile selectors).
- **Pricing:** free trial 50 credits; paid €45–€919/mo; 1 credit/search.
- **Caveat:** endpoint was "temporarily suspended for maintenance" at research time (2026-06-11); private endpoint needs a formal access request. Verify availability before building.

> [!gap] Apify offers an alternative ImmobilienScout24 scraper and an MCP server variant — confirm which is most reliable for production.
