---
type: concept
updated: 2026-06-16
title: "Survivorship Bias in SaaS Metrics"
created: 2026-06-09
tags:
  - saas
  - metrics
  - analytics
  - bias
status: evergreen
related:
  - "[[Trial Cohort Conversion Rate]]"
  - "[[Trial Conversion Dashboard]]"
  - "[[epages-trial-conversion-dashboard-kpi]]"
---

# Survivorship Bias in SaaS Metrics

Dashboards that show only currently active records systematically inflate conversion, retention, and engagement rates by excluding records that ended in failure.

## Pattern

When users/shops/accounts churn, cancel, or are deleted, they disappear from live data. If a dashboard queries only active records, it excludes the very records that represent non-conversion — making the metric appear healthier than it is.

## ePages Case Study

The ePages trial conversion dashboard reported **75.6% conversion** for Stripe trial shops. Upon investigation:

- Non-converting shops were deleted after 30 days
- The deletion removed them from the underlying dataset
- The denominator shrank, inflating the numerator percentage

After retaining deleted shops with an explicit `Not Converted / Deleted` status (labelled "Abgelaufen" in German):

- True conversion rate: **48.3%**
- Apparent rate was **57% higher** than reality

## Fix

Retain records of deleted/churned entities with an explicit terminal status rather than hard-deleting them. Options:

- Soft delete with a `status = 'deleted'` flag
- Snapshot-based approach: store the last known state in a separate table
- CSV import: retain rows for deleted shops, assign "Abgelaufen" status at import time

For CSV-based dashboards, see [[Test Shop Exclusion]] for how to filter internal test records while preserving legitimate non-conversions.

## Generalisation

This pattern applies to any SaaS metric where the population can shrink:

- **Churn rate**: if churned accounts are deleted, churn appears lower
- **Feature adoption**: if non-adopters cancel, adoption appears higher
- **NPS**: if detractors churn, NPS appears better

> [!key-insight] Always ask: "Who is missing from this dataset?"
> The absent records are often the most informative.
