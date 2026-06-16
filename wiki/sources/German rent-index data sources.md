---
type: source
source_type: aggregate
title: "German rent-index data sources (Destatis / empirica / mietenwatch)"
author: Destatis, empirica-systeme, mietenwatch
date_published: 2026
url: https://www.destatis.de/EN/Service/OpenData/_node.html
confidence: high
tags:
  - source
  - real-estate
  - germany
  - rent-index
key_claims:
  - "No single nationwide Mietspiegel API exists; the rent index is per-city, ~2-yearly (§558 BGB)"
  - "Destatis open data: quarterly hedonic rent indices + net cold rent by NUTS1 region, free but coarse"
  - "empirica-systeme / VALUE DB and F+B give high-disaggregation indices but are paid"
related:
  - "[[Research- AI Agents for Autonomous Tasks and German Real Estate Rent Comparison]]"
  - "[[ImmoScout24]]"
---

# German rent-index data sources

Sources for the benchmark "regional rent price" to compare scraped listings against.

| Source | Granularity | Cost | Notes |
|--------|-------------|------|-------|
| **Destatis** (Federal Statistical Office) | NUTS1 region, quarterly hedonic indices + net cold rent | Free (open data) | Official, but coarse — not street-level |
| **Mietspiegel** (per-city, §558 BGB) | City / Wohnlage | Free (city portals) | Updated ~every 2 years; no unified API |
| **empirica-systeme / VALUE DB, F+B** | High disaggregation, quarterly since 2004 | Paid | Best granularity for commercial use |
| **mietenwatch Berlin API** (GitHub) | Berlin address-level, 2017/2019 | Free | Prototype only; returns base/min/max comparative rent; unmaintained |

**Comparison pipeline:** scrape listing €/m² → map PLZ to the nearest available index (Destatis region, or city Mietspiegel) → flag over/under the local benchmark.

> [!gap] No confirmed open, nationwide, address-level rent index. Street-level comparison requires paid data (empirica) or per-city Mietspiegel parsing.
