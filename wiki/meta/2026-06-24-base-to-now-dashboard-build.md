---
type: session
title: "Base → Now Dashboard Build (2026-06-24)"
created: 2026-06-24
updated: 2026-06-24
tags:
  - epages
  - migration
  - base
  - now
  - dashboard
  - kpi-design
status: current
related:
  - "[[Base to Now Tracker]]"
  - "[[2026-06-17-paypal-migration-tracking]]"
  - "[[ePages Spreedly Migration]]"
  - "[[Open Questions and Blockers]]"
  - "[[meeting-2026-06-15-with-Chris]]"
sources:
  - "[[.raw/Spreedly_Conversion.html]]"
---

# Base → Now Dashboard Build (2026-06-24)

Built the **Base → Now migration tab** in `.raw/Spreedly_Conversion.html` from Karsten's first monthly export (`20260526_migration_shops.csv`, 3,306 rows). Also added a cross-tab **per-shop notes** feature and made a key **KPI-design reframe**. Logic validated in Node against the real CSV throughout.

## Per-shop notes feature (all tabs)

A `shopNotes` map keyed by `shopKey` (domain → alias → name), persisted to Supabase `mappings` under id `shop_notes`. Editing is **admin-only** (the pencil button only renders for admins); **note display + the "Has note" filter are visible to all viewers**. Works on the Spreedly, PayPal, and Base→Now shop tables. The "Has note" chip shows whenever a note exists and lists all noted shops with **no search term required** (empty-search bypass). "Has note" is an **AND** filter (narrows the other chips), not OR — fixing the bug where "noted + Spreedly" showed every Spreedly shop.

## CSV schema (Karsten, confirmed)

```
project  database  shopid  alias  domain  closedbymerchant  migrationstatus  finalmigration  prepshopcreated
```

- **Monthly** cadence; **`shopid`** is the stable key for month-over-month diff. **Shoptype** is NOT in this export — arrives next month (notice banner shown until then; mapping path wired).
- `finalmigration` / `prepshopcreated` are dates in **DD/MM/YYYY HH:MM** (European), nullable ("NULL"). Custom parser handles both.
- `project` carries a legacy **`DE_EPAGES_`** prefix (dropped in future exports) — stripped in the parser, so `DE_EPAGES_STRATO` → `STRATO`.

## migrationstatus enum (single-value, NOT a bitmask — confirmed)

Each shop has exactly one value. Powers of 2, but used as a discrete enum (`FINAL_DONE_AND_PREP_DELETED` is its own number, 1024, not `128 | x`).

| Value | State | Funnel bucket |
|---|---|---|
| 0 | NOT_PARTICIPATING | out of scope |
| 1 | INITIAL_ALLOW | not started |
| 2 | INITIAL_IN_PROGRESS | in progress |
| 4 | INITAL_PREPARED | prepared |
| 8 | INITAL_FAILED | failed |
| 16 | FINAL_ALLOW | in progress |
| 32 | FINAL_IN_PROGRESS | in progress |
| 64 | FINAL_SHOPTYPECHANGE_ALLOW | in progress |
| 128 | FINAL_DONE | **live** |
| 256 | FINAL_FAILED | failed |
| 512 | ABORTED | aborted |
| 1024 | FINAL_DONE_AND_PREP_DELETED | **live** |

**Status is the source of truth, not the dates** — one `1024` shop has a NULL `finalmigration`. Live = status ∈ {128, 1024}.

## The KPI reframe (the central insight)

The first build cloned the PayPal progress bar ("% of cohort migrated → 100%"). **That frame is wrong for Base→Now** and the user correctly rejected it:

- **No fixed cohort** — shops enter the pipeline over time; the first CSV isn't "everyone who will ever migrate."
- **No deadline, no 100% target** — nothing to "complete."
- A % of a drifting population measures **composition, not progress**, and hides the only thing a tracker should show: **movement**.

So the dashboard tracks **stock + flow + risk**, not completion. The enabling realization: because `finalmigration` / `prepshopcreated` are dated, **a single monthly export already contains the full go-live and start history** — velocity is derivable from one file, no snapshot diffing needed.

### Final KPI set

- **Stock:** Live on Now (running total).
- **Flow (centerpiece):** Went Live (latest month) · **Run-rate** = 3-month avg go-lives with ▲/▼ trend vs prior 3 months · Started (latest month). Plus a **per-month velocity bar chart** (go-lives + starts, from June 2025, reconstructed from the dates).
- **Risk:** **Stalled in Prep** (status 4) bucketed by age (<1 / 1–3 / 3–6 / 6–12 / 12+ months) with a **median + p90 age** headline. Plus **Needs Attention** = failed + aborted only.
- **Composition strip** (no target) of where in-scope shops sit.
- **Breakdown by `project`:** left card = **% live** (size-fair rate, for comparing projects); right card = **absolute shops-left** (bars sized by backlog, sorted by count — answers "where is the remaining work"). The two were redundant when both showed %; splitting rate vs volume makes them a genuine pair.

## "Closed by merchant" is NOT churn

A closed shop **still pays** and may just be temporarily closed (e.g. owner on summer vacation). So `closedbymerchant` is treated as a pure **informational flag** — it does NOT remove a shop from any headline metric:

- Removed from "Needs Attention" (failed + aborted only).
- Migrated-but-closed shops **count** as Live on Now (2,060 → **2,228**).
- Closed shops stay in the in-scope / project denominators.
- "Closed" and "Aborted" are **separate** filter chips in search (they're different things).

Only `NOT_PARTICIPATING` and `ABORTED` (deliberately stopped) are excluded from active-candidate totals.

## Validated numbers (May-2026 export)

- **2,228 live** on Now · run-rate **~18/month and rising** (Dec 9 → May 22).
- **914 prepared**, of which **747 (82%) have been stuck in prep 12+ months**; **median time in prep = 3.4 years, p90 = 4.7 years**. The prep pool is overwhelmingly long-abandoned, not an active pipeline — the insight the old % bar completely hid.
- Needs Attention = 160 (5 failed + 155 aborted).
- All 12 states reconcile to 3,306 rows.

## Other UI changes this session

- Whole dashboard **widened to 1760px** (Spreedly + PayPal + Base→Now; Churn/AutoTranslate already were).
- **AutoTranslate tab taken out of the admin lock** — now a public tab (import/clear stay admin-gated).
- Velocity chart polished: bars grow to fill columns, y-axis gridlines + baseline, taller, 2px min sliver for small months.

## Still open

- Wire the **shoptype** breakdown when next month's export carries the column.
- Confirm with Karsten whether there's any intended target cohort, or it stays a pure velocity tracker (changes nothing built — only whether a target line is ever added).
- Data reaches the dashboard via Supabase storage, so the CSV in `.raw/` must be **imported via admin** on the tab (first import seeds it; next month auto-diffs).
