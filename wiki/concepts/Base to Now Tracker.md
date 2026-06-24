---
type: concept
address: c-000007
title: "Base to Now Tracker"
created: 2026-06-15
updated: 2026-06-15
status: developing
tags:
  - epages
  - migration
  - tracking
  - base
  - now
related:
  - "[[ePages]]"
  - "[[ePages Spreedly Migration]]"
  - "[[epages-spreedly-migration-dashboard]]"
  - "[[meeting-2026-06-15-with-Chris]]"
---

# Base to Now Tracker

A planned **migration tracker** for ePages shops moving from **Base** to **Now** (the two ePages product variants). Conceived in the [[meeting-2026-06-15-with-Chris|2026-06-15 meeting]] as another instance of the [[ePages Spreedly Migration]] tracking pattern.

## Data Source

- Driven from a **File** (CSV/export).
- Relevant columns: **Reseller, country, URL, shop type**. _(Meeting notes said "package"; clarified 2026-06-17 that the relevant dimension is **shop type**.)_

## Key Open Question — Shop-Type Mapping

> [!gap] What is the conversion between Base and Now?
> The central unknown: how Base **shop types** map onto Now shop types — specifically **"what is an 'L' shop in Base?"** This mapping is needed before conversion can be measured. Maps to the dashboard's existing Shop Type Mapping feature.

## What to Track

- **Creation date** of each shop, and **when it goes live** on Now.
- **Migration shops that didn't go live** — detection may be possible **without extra data** (inferred from the existing export).
- A **general update timestamp** surfaced in the dashboard, so users know how fresh the data is.

## Relationship to Other Trackers

Same pattern as [[ePages Spreedly Migration]], [[Sage]], [[Stripe]], and [[PayPal]] tracking — a baseline + progress model fed by periodic file imports. Likely plugs into [[epages-spreedly-migration-dashboard]].

## Execution Plan (drafted 2026-06-17)

Unlike PayPal/Spreedly (which track a *state to leave*), Base→Now is a **migration funnel** — shops moving platform and, critically, *going live*:

```
Base shops (in scope)
  └─► Now shop created (migration started)   ← creation date
        ├─► Went live on Now                  ← go-live date
        └─► Created but NOT live  ⚠️           ← the risk group ("didn't go live")
```

**Headline metric:** shops *created but not yet live* (stalled migrations) + *% live of total in scope*.

**Reuse the PayPal tab as a template** — clone its structure and swap domain logic:
- Supabase `csv-imports/baseToNow.csv` + `baseToNow_prev.csv` snapshot for week-over-week ("shops gone live since last upload").
- Admin **shop-type mapping** config (Base shoptype → Now shoptype) — this answers the "what is an L shop" question. Reuses the dashboard's existing Shop Type Mapping infra (`showtypeMapping` / `resolveShoptype`) rather than a new package concept.
- Breakdowns by **Reseller** and **Country** (instead of Partner).
- Funnel KPIs, baseline + progress bar, search, the existing update-timestamp strip.

### Confirmed (2026-06-17)

- **Stable shop key exists** → week-over-week diff ("gone live since last upload") keys on that ID, like PayPal's UUID alias.
- **No deadline** for the Base→Now migration → no countdown / time-progress bar. Progress bar shows **% live of scope** only.

### Confirmed schema (2026-06-24, from Karsten)

Export columns (one row per shop):

```
project  database  shopid  alias  domain  closedbymerchant  migrationstatus  finalmigration  prepshopcreated
```

- **Cadence: monthly.** **`shopid`** is the stable key for month-over-month diff. **Shoptype** lands in the *next* export → wire the Shop Type Mapping path now, light it up when the column appears.
- `prepshopcreated` / `finalmigration` are **dates, nullable**. ⚠️ `prepshopcreated` is **nulled ~1 year after** a done-and-prep-deleted migration → do **not** infer "started" from it. **`migrationstatus` is the source of truth for funnel stage**; `finalmigration` only gives the go-live *date*.

**`migrationstatus` values** (confirmed single-value enum 2026-06-24 — one value per shop, NOT a bitmask; each happens to be a power of 2):

| Value | State | Funnel bucket |
|---|---|---|
| 0 | `NOT_PARTICIPATING` | **out of scope** (excluded from denominator) |
| 1 | `INITIAL_ALLOW` | not started |
| 2 | `INITIAL_IN_PROGRESS` | initial in progress |
| 4 | `INITAL_PREPARED` | prepared (prep shop exists) |
| 8 | `INITAL_FAILED` | ⚠️ failed |
| 16 | `FINAL_ALLOW` | final in progress |
| 32 | `FINAL_IN_PROGRESS` | final in progress |
| 64 | `FINAL_SHOPTYPECHANGE_ALLOW` | final in progress |
| 128 | `FINAL_DONE` | ✅ **live on Now** |
| 256 | `FINAL_FAILED` | ⚠️ failed |
| 512 | `ABORTED` | aborted |
| 1024 | `FINAL_DONE_AND_PREP_DELETED` | ✅ **live on Now** (prep deleted) |

**KPIs (reframed 2026-06-24 — flow/risk tracker, NOT a % completion bar):**

The first instinct (clone PayPal's "% of cohort migrated → 100%" progress bar) is **wrong here**: there's no fixed cohort, no deadline, and the population grows monthly. A % of a drifting denominator measures composition, not progress, and hides the only thing a tracker should show — movement. So the dashboard tracks **stock + flow + risk**:

- **Stock:** Live on Now = status ∈ {128, 1024} and not `closedbymerchant` (a shop the merchant later closed isn't "live on Now").
- **Flow (the centerpiece):** `finalmigration` / `prepshopcreated` are dated → **one export contains the full go-live & start history**. Go-lives-per-month + starts-per-month chart; "Went live (latest month)"; **run-rate** = 3-mo avg go-lives with trend vs prior 3 mo.
- **Risk / action:** **Stalled in Prep** = `INITAL_PREPARED` (4) bucketed by age (snapshot − `prepshopcreated`); 3+ months = actionable backlog. Plus failed (8/256), aborted (512), merchant-closed mid-flight.
- **Composition strip** (no target): where in-scope shops currently sit, as a stacked bar — a snapshot, not a goal.
- **Segmentation:** by `project` (Reseller-equivalent); % live *within* a project is legitimate (comparing projects to each other), unlike a global goal bar. Shoptype dimension dormant until the column arrives.

**May-2026 validation:** 2,060 live · run-rate ~18/mo (rising 9→22 over 6 mo) · **806 of 914 prepared shops stalled ≥3 months**. The reframe surfaced the stall backlog the % bar had hidden.

`NOT_PARTICIPATING` (0) is excluded from "in scope". `ABORTED` + `closedbymerchant` excluded from active-candidate rates.

**Confirmed by Karsten (2026-06-24):** `migrationstatus` is **single-value** (one state per shop, not a bitmask) — the dashboard's `status === X` reading is correct.

Now a ~1-session clone-and-adapt of the PayPal tab.

## Source

- [[meeting-2026-06-15-with-Chris]]
