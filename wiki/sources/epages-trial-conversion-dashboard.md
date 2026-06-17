---
type: source
created: 2026-06-16
updated: 2026-06-16
title: "Dynamic Chart with Filtering and CSV Import — Trial Conversion Dashboard"
date: 2026-04-28
source_file: ".raw/Claude-Dynamische Grafik mit Filterung und CSV-Import.md"
tags:
  - epages
  - stripe
  - dashboard
  - trial-tracking
  - csv
  - react
  - visualization
status: processed
related:
  - "[[ePages]]"
  - "[[Stripe Subscription Trial Tracking]]"
  - "[[ePages Spreedly Migration]]"
---

# Dynamic Chart with Filtering and CSV Import — Trial Conversion Dashboard

A Claude conversation from 2026-04-28 to 2026-04-29 in which a React dashboard was iteratively designed and deployed for tracking Stripe subscription trial conversions at ePages.

## Starting Request

User wanted a chart with type-based filtering and automatic ingestion of regularly-arriving CSV files.

## Pivotal Discovery

Partway through, the user uploaded a real export file: `shops_export_20260428_150913.csv`. This revealed the actual use case: tracking how many shops transition from `TRIAL_STARTED` to `TRIAL_ENDED` or `ACTIVE` in the `stripe_subscription_status` column.

Snapshot at upload time: 34 TRIAL_STARTED · 37 ACTIVE · 17 TRIAL_ENDED · 3 PAYMENT_FAILED.

## Dashboard Architecture

The final dashboard (`trial-conversion-dashboard.jsx`) is a React component (Vite project) deployed to Vercel or Netlify. Key design decisions:

- **Snapshot model** — each CSV export is one point-in-time snapshot. The dashboard stores multiple snapshots and reconstructs per-shop status history.
- **Shop identity** — `stripe_customer_id` is used as the stable identifier (more reliable than `shop_url`).
- **Snapshot filename parsing** — date/time extracted from filename pattern `shops_export_YYYYMMDD_HHMMSS.csv`; fallback to file `lastModified`.
- **Storage** — `localStorage` (browser-local, not shared). Multi-tenant sharing requires a backend (Supabase suggested).
- **Column mapping** — first upload triggers a one-time column mapping UI; settings are persisted.

## Business Logic Clarified Over the Conversation

1. Trial duration is exactly **14 days** from `created_at`.
2. `created_at` always equals the trial start date for ePages shops.
3. After 14 days: `TRIAL_STARTED` → `ACTIVE` (direct conversion, ~35%) or `TRIAL_ENDED` (~65%).
4. From `TRIAL_ENDED`: shop may later convert to `ACTIVE` via sales rescue (~15%), or be **deleted** from the system after 15–60 days if no action.
5. Deleted shops disappear from subsequent CSV snapshots (no explicit deletion record).

## Trial Cohort Calculation

- **v1** counted only shops ever seen as `TRIAL_STARTED` in any snapshot → 46 of 67 shops (21 pre-dated first snapshot).
- **v2** extended cohort to all shops with a valid `created_at` → all 67 shops included; pre-snapshot shops inferred from creation date.

## Conversion Timing

- Exact day-of-conversion is not known; snapshots are every ~14 days.
- Best estimate: midpoint between last `TRIAL_STARTED` snapshot and first `ACTIVE` snapshot.
- Median conversion in demo data: ~19 days (aligns with 14-day trial + snapshot lag).
- Chart buckets: 0–7 / 8–14 (during trial, green) · 15–21 / 22–28 / 29+ (after trial, orange).

## Month Filter

Buttons for each calendar month of `created_at`. Filter affects: KPI tiles, trial cohort, conversion timing chart, and transition list.

## Deployment Path

- **Option chosen**: React + Vite project, hosted on Vercel (via GitHub) or Netlify Drop.
- Artifact → `localStorage`-backed deployment ZIP provided.
- Noted limitation: localStorage is device-local; team sharing requires a shared backend.

## Demo Data

Six bi-weekly CSV snapshots generated covering 2026-04-28 → 2026-07-07, ~82 shops, each month's cohort uniformly distributed across ~17 different creation dates. Final snapshot: ~23 shops deleted (former TRIAL_ENDED).
