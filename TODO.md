# TODO

## Spreedly Conversion Dashboard

- [ ] **Add Shop Count trend chart to Churn tab** — blocked until real churn data from Karsten is connected

## Base → Now Tracker

Design drafted 2026-06-17 (migration-funnel model, clone the PayPal tab). See [[Base to Now Tracker]] for the full plan.

- [ ] **BLOCKED: confirm export schema with Karsten** before building. _Confirmed: stable shop key exists (diff works); no deadline (no countdown)._ Still open: (1) scope — all Base shops vs only Now-instances vs separate files; (2) "went live" signal — go-live date vs status field; (3) shop-type data + Base→Now shoptype mapping ("what is an L shop", reuses existing Shop Type Mapping); (4) in-scope definition (denominator for % live); (5) one row per shop or repeats; (6) column names + update cadence. Easiest: get a sample export file.
- [ ] **Build Base → Now tab** once schema is confirmed — funnel KPIs (created / live / stalled), Reseller + Country breakdowns, shop-type-mapping admin modal (reuse existing Shop Type Mapping), weekly CSV + week-over-week "gone live" diff. ~1-session clone-and-adapt of the PayPal tab.

## Auto Translate

- [ ] **Chase Marion for AutoTranslate raw data** — Marion (not Karsten) has the data; requested 2026-06-17, no reply yet. Blocks the AutoTranslate tracking work. See [[meeting-2026-06-15-with-Chris]] + [[Questions Auto Translate]].

## PayPal Migration tab

Open items from the 2026-06-17 logic review (see [[2026-06-17-paypal-migration-tracking]]). Completed this session: dedup fix, longest-match gateway classification, shop-based KPIs (worst-version-wins), shutdown-baseline progress bar, week-over-week diff panel, sleeper + time-progress label fixes.

- [ ] **Resolve conflict: how many PayPal versions are being shut down?** — Chris said **2**, Karsten said **3**. This decides which payment values get classified `shutdown` in the PayPal Gateways modal, and therefore the "On Shutdown Versions" KPI + migration target. Karsten owns the data (provides the CSV) so likely authoritative, but confirm the exact version names with both before finalizing gateway config. Candidate shutdown versions in the data: PayPal (1,082), PayPalPro (17), PayPalIntegralEvolution (7).
- [ ] **Re-seed the shutdown baseline (action, do on next upload)** — the stored `paypal_shutdown_baseline` is the old *entry-based* count (1,106). KPIs are now *shop-based*, so Clear PayPal Data once and re-upload to re-seed it as distinct shops; otherwise the progress bar mixes a config-count baseline with a shop-count current.
- [x] **MEDIUM: Frozen baseline hides cohort progress** — FIXED 2026-06-17. Baseline now stores the *alias set* of shops on shutdown at baseline (`ppShutSet` / `ppShutBaseline.aliases`); progress = how many of that original cohort have since moved off, immune to new arrivals. New shutdown shops since baseline are surfaced separately ("N new on shutdown since baseline").
- [x] **MEDIUM: Diff compares filtered-current vs unfiltered-previous** — FIXED 2026-06-17. Extracted `ppInScope` and apply it to both the current set and `ppPrevShops` in `ppRenderChanges`, so the week-over-week diff compares like for like.
- [~] **MEDIUM: Baseline seed timing** — WON'T FIX (documented limitation). Auto-seeds from current data on first admin view; if migration already happened before that, the baseline understates the true start. Not retroactively fixable without a pre-migration snapshot. Mitigated by clearing + re-uploading at the project start.
- [~] **LOW: Unawaited baseline write** — SAFE BY DESIGN. `ppShutBaseline` is assigned synchronously before the fire-and-forget save, so single-threaded JS guarantees the next render sees `.aliases` set and won't re-fire. A guard flag would be redundant.
- [ ] **LOW (optional perf): Per-render recompute** — `ppRefresh` recomputes `ppShopMap` + gateway-type lookups over all entries every render. Fine at 15k rows; if it ever feels slow, cache each entry's gateway-type at parse time.

## Security

- [x] **Harden Supabase write policies on Spreedly tables** — `write_all` is currently set to `public`, meaning anyone with the URL + anon key can wipe baseline/config/mappings. Fix: replace JS password check with Supabase Auth and change `write_all` to `authenticated` only. Low risk while URL stays internal.
- [x] **Admin password hardcoded in Spreedly_Conversion.html** — fixed: replaced with Supabase Auth (`signInWithPassword`); password is read from an input and verified server-side, no longer in the JS.

## Supabase Infrastructure

- [ ] **Set up separate Supabase Dev/Staging/Production projects** — low priority; benefit is safety (test schema changes before hitting prod) and cleaner dev workflow. Recoverable from CSV if skipped.

## Trial Conversion Dashboard

- [x] **Fix total conversion rate** — only show data from April 2026 onwards (currently includes old data)

## Upload HTML to Netlify

- [x]  only the Spreedly Dashboard needs to be updated on the real server. 