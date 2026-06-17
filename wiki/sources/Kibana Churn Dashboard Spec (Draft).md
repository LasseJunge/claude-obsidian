---
type: source
title: "Kibana Churn Dashboard Spec (Draft)"
status: seed
created: 2026-06-15
updated: 2026-06-17
tags: [source, churn, dashboard, kibana, epages]
aliases:
  - Kibana Dashboard Churn & Billable Shops
---

# Kibana Dashboard: Churn & Billable Shops

**Status:** Draft — fill in the `‹FILL›` placeholders, then build in Kibana UI.
**Platform:** Kibana on existing Elasticsearch index (no data view yet → create first).
**Build mode:** Step-by-step UI guide (no API/live access assumed).
**Owner:** ljunge@epages.com
**Created:** 2026-06-15

Related: [[Churn Dashboard]], [[churn-dashboard-anforderungen]], [[churn-dashboard-dokumentation]]

---

## 1. Data source

| Item | Value |
|------|-------|
| Index / index pattern | `‹FILL: e.g. shops-*›` |
| Kibana data view name | `shops` (to be created) |
| Time field | `‹FILL: e.g. @timestamp / createdAt›` |
| One document = | `‹FILL: one shop? one daily snapshot per shop? one lifecycle event?›` |

> ⚠️ The doc grain drives everything. **Snapshot-per-shop-per-day** vs **one-row-per-shop** changes how churn rate and counts are aggregated. Confirm before building.

## 2. Field mapping

| Concept | Field | Notes |
|---------|-------|-------|
| Plan / tier | `‹FILL: e.g. plan / tier›` | Used for billable classification |
| Paid (billable) tier values | `‹FILL: e.g. ["business","pro","enterprise"]›` | Billable = plan ∈ this set |
| Free/trial tier values | `‹FILL: e.g. ["free","trial"]›` | Excluded from billable |
| Shop status / state | `‹FILL: e.g. status›` | active / canceled / closed |
| Churned-state value(s) | `‹FILL: e.g. ["canceled","closed"]›` | Marks a shop as churned |
| Shop ID | `‹FILL: e.g. shopId›` | For unique counts (cardinality) |

## 3. KPIs

### 3.1 Billable shop count
- **Definition:** unique count of shops where `plan ∈ paid tiers` (and status = active, if applicable).
- **Metric:** `Unique count of ‹shopId›` filtered by `plan: (paid tiers)`.

### 3.2 Churn rate %
- **Definition:** `churned shops in period ÷ active billable shops at start of period`.
- **Numerator:** shops that entered a churned state within the selected time range.
- **Denominator:** active billable shops at the start of the period.
- **Kibana approach:** Lens **Formula** metric:
  `count(kql='status: (canceled or closed)') / unique_count(‹shopId›, shift='start of period')`
  (exact formula depends on doc grain — finalize in §1).

## 4. Panels (layout top → bottom)

1. **KPI row** — 3 metric tiles: Billable shops, Churned shops, Churn rate %.
2. **Churn rate % over time** — line chart, monthly buckets.
3. **Billable shops over time** — area/line, monthly.
4. **Breakdown** — bar: billable shops by plan/tier.
5. **(optional) Table** — top churned shops with plan + cancel date.

## 5. Global controls
- Time range picker (default: last 12 months).
- Control: filter by `plan`.
- Control: filter by `status`.

## 6. Open questions
- [ ] Index name + time field (§1)
- [ ] Document grain (§1) — **blocking** for churn formula
- [ ] Exact paid-tier values (§2)
- [ ] Is churn measured on billable shops only, or all shops?
