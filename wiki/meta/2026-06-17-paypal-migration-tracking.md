---
type: session
title: "PayPal Dashboard — Migration Tracking & Data-Model Fixes"
created: 2026-06-17
updated: 2026-06-17
tags:
  - epages
  - paypal
  - dashboard
  - spreedly
  - session
status: current
related:
  - "[[2026-06-16-paypal-dashboard-build]]"
  - "[[epages-spreedly-migration-dashboard]]"
  - "[[PayPal]]"
sources:
  - "[[.raw/Spreedly_Conversion.html]]"
---

# PayPal Dashboard — Migration Tracking & Data-Model Fixes — 2026-06-17

Second session on the PayPal Migration tab in `.raw/Spreedly_Conversion.html`. Started from a "13k of 15k shops missing" bug report and ended with full week-over-week version-migration tracking. All changes verified by extracting the real functions and running them in Node against the actual CSV.

## The CSV is one row per (shop, gateway), not per shop

The export `20260616_PayPal.csv` has **15,251 data rows but only 13,537 unique aliases** — 1,714 shops hold more than one PayPal gateway. The payment values sum exactly to the row count, confirming each row is a (shop, gateway) pairing:

| payment | rows |
|---|---|
| PayPalExpress | 8,443 |
| PayPalPPCP | 3,985 |
| PayPalPlus | 1,717 |
| PayPal | 1,082 |
| PayPalPro | 17 |
| PayPalIntegralEvolution | 7 |

The parser deduped by alias (`keep first occurrence`), silently dropping the 1,714 extra rows → only 13k showed. **Fix:** threaded a `dedupe` flag through `parseCSV`/`parseCSVAuto`, defaulting `true` (Spreedly/AutoTranslate keep dedup) and passing `false` on the two PayPal callers. The PayPal tab now shows all 15,251 gateway entries.

## Substring gateway matching collapsed two versions

The Version Distribution KPI showed only 4 of 6 versions because a configured gateway named `"PayPal"` (type shutdown) matched `PayPalPro` and `PayPalIntegralEvolution` via `payment.includes("paypal")` — `1,082 + 17 + 7 = 1,106`, exactly the Shutdown count. They were absorbed under the gateway *name*, not their own version.

**Fixes:**
- `ppGetGatewayInfo` now picks the **longest** matching gateway substring (most specific wins), so `PayPalExpress`/`PayPalPro` aren't swallowed by a generic `PayPal`.
- Version Distribution groups by the **actual payment value** (one row per real version), classified via `ppGetGatewayType`. All 6 versions now render, each badged shutdown/newest/legacy/unclassified.

## Progress bar = shutdown migration vs a persisted baseline

The bar previously measured "migration to newest". Reworked to measure **shops leaving shutdown versions**: `(baseline shutdown count − current shutdown count) / baseline`.

The baseline (`paypal_shutdown_baseline` in Supabase `mappings`) is captured **once** — on first import, or auto-seeded from already-loaded data the next time an admin opens the tab. It persists across the weekly CSV uploads. Negative migration (more shutdown shops than baseline) clamps to 0.

## Shutdown-by-partner reframed

Was a relative-to-leader ranking (biggest partner = full bar). Switched to **% of each partner's own PayPal shops on shutdown versions**, with raw counts (`shutdown / total`) shown — surfaces severity regardless of partner size.

## Week-over-week version-migration tracking

The headline feature. Each import now copies the current `paypal.csv` → `paypal_prev.csv` before overwriting, so consecutive uploads can be diffed. Shop aliases are stable UUIDs, so per-shop version changes are detectable.

`ppRenderChanges()` builds an `alias → Set(payment versions)` map for both weeks and computes `removed = lastWeek − thisWeek`, `added = thisWeek − lastWeek`. A new **"Changes Since Last Upload"** panel shows:
- Summary KPIs (unique shops): moved onto newest, left all shutdown, new shops, shops gone.
- An expandable matrix of version-to-version movements (e.g. `PayPal → PayPalPPCP: 50`). Matrix counts version *movements*, not unique shops — a shop swapping several gateways contributes to multiple pairs (noted in-panel).

## Stale-baseline bug (the "1 shop gone after clear + reupload")

After a Clear + re-upload, the panel falsely showed 172 new / 1 gone. Cause: the snapshot step read the file *in storage* to use as "previous", and Supabase returned a **stale pre-clear export** (delete not yet propagated / cached) instead of nothing. **Fix:** only snapshot a previous when `ppShops.length` is non-zero (i.e. data is actually loaded). After a Clear, `ppShops` is empty, so no stale storage read can resurrect an old baseline; the previous snapshot is explicitly blanked instead.

## PayPal tab no longer admin-gated

Removed the `admin-tab` class + `display:none` from the PayPal Migration nav tab. It's now visible to any logged-in user (read-only); import/gateways/clear stay in the admin bar.

## Search

Added shoptype, software, and database to the PayPal search, plus a Shoptype column in the results table — shops span the full product range (NowM, eCom5000, Enterprise, …), not just Base. Removed the "Base" assumption from labels throughout.

## Verification method

For an HTML-embedded script with no build step, functions were extracted by name from the file and run in Node (`new Function` for syntax, `eval` of `parseCSV`/`ppGetGatewayType`/etc. for logic). A simulated "next week" CSV with known deltas (50 `PayPal→PayPalPPCP`, 20 `PayPalPlus→PayPalPPCP`, 5 new, 1 dropped) reproduced the exact expected panel numbers: changed 70, ontoNewest 70, offShutdown 50, new 5, gone 1.

## Refinements later the same session (logic review follow-ups)

A logic review surfaced a HIGH counting-unit inconsistency and a few smaller items; these were then fixed:

- **Shop-based KPIs (worst-version-wins).** The headline KPIs originally counted gateway *entries* (15,251) while labelled "shops", double-counting multi-gateway shops. Clarified goal: the action is shops **switching off** their old PayPal versions. So KPIs, progress bar, and partner breakdowns now count **distinct shops** (`ppShopMap` aggregates entries by alias; `ppShopStatus` classifies each by worst version — **shutdown > legacy > newest**). "On Shutdown" = distinct shops that must switch before the deadline; "Total PayPal" = ~13,537 distinct shops. Version Distribution and the search table stay entry-based on purpose (they're about gateways/rows). Sub-label wording is "switch", not "deactivate".

- **Cohort baseline (supersedes the count-based baseline above).** `ppShutBaseline` now stores the **alias set** of shops on shutdown at baseline (`{aliases:[...], date}`), not just a count. Progress = how many of *that original cohort* have since moved off shutdown — immune to new shutdown shops arriving later (which previously masked real migrations). New arrivals are surfaced separately ("N new on shutdown since baseline"). `ppShutCount` → `ppShutSet`. Old count-only baselines auto-upgrade on the next admin view.

- **Scope-filtered diff.** Extracted `ppInScope`, applied to both the current set and `ppPrevShops` in `ppRenderChanges`, so the week-over-week diff compares like for like.

- **Label fixes.** Sleeper KPI sub now reads "last login before 2026" (was the inaccurate "6+ months inactive"); the time-progress bar shows "set a start date to track time" instead of a misleading 0% when no start date is set.

- **Churn + Autotranslate tabs moved into admin mode** (`admin-tab` + `display:none`), so the non-admin view shows only Spreedly Migration + PayPal Migration.

Closed-by-design (not changed): baseline-seed *timing* (can't reconstruct a pre-migration snapshot retroactively); the unawaited baseline write (safe — `ppShutBaseline` is assigned synchronously before the fire-and-forget save).

## Meeting reconciliation

Cross-checked against [[meeting-2026-06-15-with-Chris]]: PayPal tracking marked done (Karsten's data received); the "general update timestamp" wish confirmed already built. Corrected a scan transcription error — "**472 deleted**" should read "**2 [integrations] shut down**" (the 2 shutdown versions). **Open conflict:** Chris said **2** versions are being shut down, Karsten said **3** — decides the `shutdown` gateway classification; confirm exact version names before finalizing.

## Process

Used `/ponytail` (lean code mode) during the build and `/ponytail-review` after — the review merged two redundant version-distribution branches and dropped a now-unused `hasGw` param. A later logic-review pass produced the refinements above.

## Open

- Gateway names/types still configured manually by admin; the longest-match fix lets `PayPalPro` / `PayPalIntegralEvolution` be classified independently once added.
- Weekly CSVs must keep a consistent format; the diff keys on the stable UUID alias.
- **Re-seed the shutdown baseline** (clear + reupload) so it becomes shop-based + cohort-format from a clean week-0.
- **Resolve the 2-vs-3 shutdown-versions conflict** (Chris vs Karsten) before locking gateway config.

## Open

- Gateway names/types still configured manually by admin; the longest-match fix lets `PayPalPro` / `PayPalIntegralEvolution` be classified independently once added.
- Weekly CSVs must keep a consistent format; the diff keys on the stable UUID alias.
