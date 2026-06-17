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

### BLOCKED — data-schema questions still open with Karsten before building

1. **Scope / one row per…** — is it (a) all Base shops with migration-status columns, (b) only shops that already have a Now instance, or (c) separate Base + Now files matched by the shop key? Determines whether "not started" is showable and what the "% live" denominator is.
2. **"Went live" signal** — a go-live *date* column (empty = not live), or an explicit *status* field?
3. **Shop-type data + mapping** — is the target Now shoptype in the export, or only the Base shoptype? Either way, get the **Base-shoptype → Now-shoptype mapping** ("what is an L shop"). Maps to the existing Shop Type Mapping feature.
4. **In-scope definition** — which Base shops are actually meant to migrate (all / active only / certain packages)? Sets the "% live" denominator.
5. **One row per shop, or can a shop repeat?**
6. Confirm the **creation-date** column, the **Reseller / country / URL / package** column names, and the **update cadence** (weekly?).

Easiest unblock: a **sample export file** answers most of these at a glance. Once answered, the tab is a ~1-session clone-and-adapt of the PayPal tab.

## Source

- [[meeting-2026-06-15-with-Chris]]
