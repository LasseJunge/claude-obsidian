# TODO

> **Blocked on someone?** See [[Open Questions and Blockers]] — the single list of every open question, grouped by who can answer it (Chris / R&D / Karsten) and what it unblocks.

## Base → Now Tracker

Design drafted 2026-06-17 (migration-funnel model, clone the PayPal tab). See [[Base to Now Tracker]] for the full plan.

- [ ] **BLOCKED: confirm export schema with Karsten** before building. _Confirmed: stable shop key exists (diff works); no deadline (no countdown)._ Still open: (1) scope — all Base shops vs only Now-instances vs separate files; (2) "went live" signal — go-live date vs status field; (3) shop-type data + Base→Now shoptype mapping ("what is an L shop", reuses existing Shop Type Mapping); (4) in-scope definition (denominator for % live); (5) one row per shop or repeats; (6) column names + update cadence. Easiest: get a sample export file.
- [x] **Build Base → Now tab** — done 2026-06-24 (in `.raw/Spreedly_Conversion.html`). Public "Base → Now" tab cloned from PayPal. Schema from Karsten (`project,database,shopid,alias,domain,closedbymerchant,migrationstatus,finalmigration,prepshopcreated`), monthly cadence, keyed on `shopid`. `migrationstatus` enum → funnel buckets (live=128/1024, in-progress=2/4/16/32/64, failed=8/256, aborted=512, not-participating=0). KPIs (live / in-progress / not-started / failed / closed+aborted / in-scope), **% live of active scope** progress bar (no countdown), monthly diff (went-live / started / failed / new / gone), funnel-by-status, by-project breakdowns, search with status + Has-note chips. Admin import/clear, prev-snapshot for month-over-month. Logic validated in Node against the real 3,306-row export (72% live; all states reconcile). Parser handles DD/MM/YYYY dates + NULL. **Pending:** `shoptype` column (next export) — notice banner shown until it arrives; mapping path ready.
- [x] **Base → Now: reframe KPIs as flow/risk tracker** — done 2026-06-24. Dropped the misleading "% live of scope" progress bar (imported the PayPal fixed-cohort+deadline model onto an open-ended, growing migration — wrong frame). New KPIs: **Live on Now** (stock), **Went Live / Run-rate** (3-mo avg, with trend), **Started**, **Stalled in Prep**, **Needs Attention** (failed/aborted/closed). Added: per-month **velocity chart** (go-lives + starts, reconstructed from `finalmigration`/`prepshopcreated` dates — full history from one export), no-target **composition strip**, and **stall-by-age** bands. Validated on May-2026 export: 2,060 live, run-rate 18/mo (rising), **806 of 914 prepared shops stalled ≥3 months** (the insight the % bar hid).
- [ ] **Base → Now: remaining w/ Karsten** — ✅ `migrationstatus` confirmed single-value (not a bitmask). Still open: is there an intended target cohort, or purely a velocity tracker? Wire the **shoptype** breakdown when next month's export carries the column.

## Auto Translate

- [x] **Chase Marion for AutoTranslate raw data** — replied 2026-06-23. **Key finding: no automated raw-data feed exists.** Usage is tracked manually (DeepL per-provider keys, 4th→4th cycle; ShopType budget config; AddOn booked → added manually via Ezio). The Wilfried overview was hand-assembled. Full details + Confluence links in [[Questions Auto Translate]].
- [x] **Posted comment** on the AutoTranslate export request (2026-06-23) — advised to comment first, then open a ticket.
- [ ] **Open the R&D ticket** once the comment gets a response — paste-ready draft at [[autotranslate-export-new-ticket]] (relates-to [UNITY-9917](https://epages.atlassian.net/browse/UNITY-9917)). Ask: schedule `usageAutoTranslation.pl -allstores` weekly + drop the CSV somewhere we can import into the existing AT dashboard tab (cheap — no new tooling). Once created, stamp the real ticket key into the draft + here.
- [~] **AutoTranslate dashboard: per-shop utilization-vs-budget** — built 2026-06-23 (in `.raw/Spreedly_Conversion.html`). Encoded the Confluence ShopType budget tables (`AT_BUDGETS` Cloud/Direct vs other; `AT_ADDON_CAP`=25M), provider-class + Now-tier resolvers, `atEffectiveBudget()`, and a banded **"Budget Use"** column + "N ≥80% of budget" summary. Reliable **today for AddOn shops** (flat 25M cap); base-budget rows light up once the scheduled export carries `shoptype` (parser already captures it). Logic unit-tested in Node (6 cases). **Still needs the call with Chris** to confirm: (1) does the new export actually include shoptype + the Now tier; (2) is the Cloud/Direct-vs-other partner split correct; (3) are these the right budget numbers to track against.

## PayPal Migration tab

Open items from the 2026-06-17 logic review (see [[2026-06-17-paypal-migration-tracking]]). Completed this session: dedup fix, longest-match gateway classification, shop-based KPIs (worst-version-wins), shutdown-baseline progress bar, week-over-week diff panel, sleeper + time-progress label fixes.

- [ ] **Resolve conflict: how many PayPal versions are being shut down?** — Chris said **2**, Karsten said **3**. This decides which payment values get classified `shutdown` in the PayPal Gateways modal, and therefore the "On Shutdown Versions" KPI + migration target. Karsten owns the data (provides the CSV) so likely authoritative, but confirm the exact version names with both before finalizing gateway config. Candidate shutdown versions in the data: PayPal (1,082), PayPalPro (17), PayPalIntegralEvolution (7).
- [x] **LOW (perf): Per-render recompute** — done 2026-06-23. Memoized `ppGetGatewayInfo` by payment string (`ppGwCache`), cleared at the top of `ppRefresh`. Collapses the repeated O(entries × gateways) substring scans to one lookup per distinct payment string per render.

## Dashboard (Spreedly_Conversion.html)

- [x] **Per-shop notes** — done 2026-06-24. Note button on each shop-search row opens a modal; keyed by `shopKey` so it survives CSV re-imports and shows on "Left Spreedly" rows (the "shop closed" case). Persisted to Supabase `mappings` id `shop_notes`. **Editing is admin-only** (note pencil only renders for admins), but **note display + the "Has note" filter are visible to all viewers**. Works on both the main shop search and the **PayPal-page shop table**. The **"Has note" chip** shows whenever any note exists and, when clicked, lists every noted shop **with no search term required** (empty-search bypass on both tables). Confirmed working.

## Security



## Supabase Infrastructure

- [ ] **Set up separate Supabase Dev/Staging/Production projects** — low priority; benefit is safety (test schema changes before hitting prod) and cleaner dev workflow. Recoverable from CSV if skipped.

## Trial Conversion Dashboard

