---
type: concept
updated: 2026-06-16
title: "Trial Cohort Conversion Rate"
created: 2026-06-09
tags:
  - epages
  - dashboard
  - metrics
  - saas
status: current
related:
  - "[[ePages Spreedly Migration]]"
  - "[[Trial Conversion Dashboard]]"
  - "[[Survivorship Bias in SaaS Metrics]]"
  - "[[epages-conversion-rate-scaling]]"
---

# Trial Cohort Conversion Rate

A conversion metric for ePages Stripe trial shops that tracks what fraction of trial-started shops become paying customers.

## The Four Cohort Slices

All trial shops must be classified into exactly four mutually exclusive buckets so they sum to 100%:

1. **Converted** — trial ended, now paying
2. **Still in Trial** — trial period not yet expired
3. **Trial Ended / Not Converted** — trial expired, did not upgrade
4. **Abgelaufen (Expired/Deleted)** — shop was deleted after non-conversion

The critical requirement: **deleted shops must remain visible** in the dashboard labelled "Abgelaufen". If deleted shops are hidden, they create a gap (~31% of shops unexplained) and inflate the apparent conversion rate.

## Why Deleted Shops Must Stay Visible

When a shop doesn't convert, ePages may delete it after 30 days. If the dashboard excludes deleted shops:

- The denominator shrinks
- The conversion rate appears higher than reality
- Cohort slices no longer sum to 100%, eroding trust in the metric

See [[Survivorship Bias in SaaS Metrics]] for the generalised pattern. The ePages trial dashboard showed **75.6%** conversion until this fix was applied; true rate is **48.3%**.

## Anchoring on `created_at`

Cohort membership is determined by `created_at`, not observed state transitions. This is because:
- TRIAL_ENDED shops disappear from later CSV snapshots when deleted
- Observing `TRIAL_STARTED` events is unreliable across snapshots

See [[Stripe Subscription Trial Tracking]] for the 14-day window mechanics.

## Related Sources

- [[epages-conversion-rate-scaling]] — conversation establishing the "Abgelaufen" requirement
- [[epages-trial-conversion-dashboard-kpi]] — survivorship bias discovery; 75.6% vs 48.3%
