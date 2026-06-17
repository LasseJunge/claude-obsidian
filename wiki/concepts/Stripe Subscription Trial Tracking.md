---
type: concept
updated: 2026-06-16
title: "Stripe Subscription Trial Tracking"
created: 2026-06-09
tags:
  - stripe
  - epages
  - saas
  - trials
status: current
related:
  - "[[Trial Cohort Conversion Rate]]"
  - "[[Trial Conversion Dashboard]]"
  - "[[Stripe]]"
  - "[[epages-trial-conversion-dashboard]]"
---

# Stripe Subscription Trial Tracking

How ePages tracks Stripe trial subscriptions across periodic CSV snapshots.

## Trial Window

- Shops have an exact **14-day trial window** from `created_at`
- After 14 days: status becomes either `ACTIVE` (converted) or `TRIAL_ENDED` (did not convert)
- `TRIAL_ENDED` shops may be deleted; if deleted they disappear from later snapshots

## The Disappearing Shop Problem

CSV snapshots capture the current state of all shops. When a `TRIAL_ENDED` shop is deleted:

- It is absent from all future snapshots
- There is no `TRIAL_ENDED` event record to reconstruct its history
- Cohort analysis that relies on observing state transitions will miss these shops

**Solution**: anchor cohort membership on `created_at`, not on observed state changes. A shop created on day N belongs to that cohort regardless of whether it appears in later snapshots.

## Cohort Analysis Pattern

```
cohort_date = shop.created_at
trial_end_date = created_at + 14 days
status = classify(shop, snapshot_date, trial_end_date)
```

Where `classify()` returns one of:
- `ACTIVE` — converted, paying
- `IN_TRIAL` — within 14-day window
- `TRIAL_ENDED` — window expired, not converted, still exists
- `ABGELAUFEN` — window expired, shop deleted (inferred from absence in later snapshots)

## CSV Import Considerations

- Filter test shops (`@epages.com` email) at import time — see [[Test Shop Exclusion]]
- Retain records across snapshot joins using `created_at` as the stable anchor key
- Never hard-delete rows from the working dataset; mark as `ABGELAUFEN` instead
