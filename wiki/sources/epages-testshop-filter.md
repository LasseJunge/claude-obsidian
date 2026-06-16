---
type: source
title: "Testshops aus Dashboard ausschließen"
date: 2026-05-05
source_file: ".raw/Claude-Testshops aus Dashboard ausschließen.md"
tags:
  - epages
  - dashboard
  - supabase
  - netlify
  - filtering
status: processed
related:
  - "[[ePages]]"
  - "[[ePages Spreedly Migration]]"
  - "[[epages-spreedly-migration-dashboard]]"
  - "[[Test Shop Exclusion]]"
---

# Testshops aus Dashboard ausschließen

Session from 2026-05-05. The ePages migration dashboard was incorrectly including internal ePages test shops in all KPIs, charts, and conversion metrics. This session implements a filter to exclude them.

## Problem

All shops with a `login_email` ending in `@epages.com` are internal test accounts. These were being included in migration metrics, inflating the denominator and distorting conversion rates.

The `login_email` field existed in the source CSV but was not being parsed or stored by the dashboard — the CSV parser (`eoe()` function in `Dashboard.jsx`) silently ignored it.

## Solution

Three changes to `Dashboard.jsx` (Vite/React source):

1. **Parse `login_email`** from each CSV row during import.
2. **Skip the row** if `login_email.toLowerCase().endsWith("@epages.com")` — test shops never enter application state.
3. **Store `loginEmail`** on the shop object for transparency/debugging.

Skipped rows are counted under `skippedRows` in the import diagnostics.

### Why filter at import time

Filtering in `eoe()` (CSV import) was chosen over filtering in `useMemo` (shop-map build) or in the filtered view layer, because it keeps test shops out of all downstream state — KPIs, charts, conversion, and sleeper counts are all automatically clean without further changes.

## Supabase / Netlify Deployment

In the same session, the storage layer was migrated from `localStorage` to Supabase so that data is shared across devices and all users see the same state:

- `storage` object replaced with a Supabase adapter using a `snapshots` table (`key` TEXT PK, `value` TEXT).
- Supabase credentials injected via `window.SUPABASE_URL` / `window.SUPABASE_KEY` in `index.html`.
- `netlify.toml` added for SPA routing redirect rules.
- A ready-to-deploy ZIP was produced containing the patched compiled build.

## Artifacts Produced

| File | Description |
|------|-------------|
| `Dashboard.jsx` | Source with `login_email` filter + Supabase storage |
| `index.html` | Entry point with Supabase CDN + credential placeholders |
| `netlify.toml` | SPA redirect rules for Netlify |
| `supabase_setup.sql` | Schema for `snapshots` table with RLS |
| `netlify-deploy.zip` | Complete deployable build (262 KB) |
