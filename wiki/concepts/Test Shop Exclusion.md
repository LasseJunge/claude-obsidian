---
type: concept
updated: 2026-06-16
title: "Test Shop Exclusion"
created: 2026-06-09
tags:
  - epages
  - dashboard
  - data-quality
status: current
related:
  - "[[ePages Spreedly Migration]]"
  - "[[Trial Cohort Conversion Rate]]"
  - "[[epages-testshop-filter]]"
---

# Test Shop Exclusion

ePages internal test shops must be excluded from all dashboard metrics to prevent inflated or misleading KPIs.

## Identification

Test shops are identified by their `login_email` field ending in `@epages.com`.

```js
const isTestShop = (shop) => shop.login_email?.endsWith('@epages.com')
```

## When to Filter

**Filter at CSV import time** — before any shop object enters React state (or any downstream processing layer).

This is the correct approach because:
- All downstream metrics (KPIs, conversion rate, sleeper counts, cohort sizes) are automatically clean
- No need to add test-shop guards to individual metric calculations
- Consistent across all tabs and views of the dashboard

**Do not** filter at render time or per-metric — this leads to inconsistent exclusion and bugs when new metrics are added.

## Volume

As of the conversations ingested (May 2026), the exact number of test shops was not disclosed, but the requirement was considered important enough to build into the import pipeline as a first-class step.

## Related

- [[epages-testshop-filter]] — source conversation establishing this requirement
- [[Trial Cohort Conversion Rate]] — cohort sums depend on clean shop counts
- [[Survivorship Bias in SaaS Metrics]] — related data-quality concern (different axis)
