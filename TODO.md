# TODO

## Base → Now Tracker

Design drafted 2026-06-17 (migration-funnel model, clone the PayPal tab). See [[Base to Now Tracker]] for the full plan.

- [ ] **BLOCKED: confirm export schema with Karsten** before building. _Confirmed: stable shop key exists (diff works); no deadline (no countdown)._ Still open: (1) scope — all Base shops vs only Now-instances vs separate files; (2) "went live" signal — go-live date vs status field; (3) shop-type data + Base→Now shoptype mapping ("what is an L shop", reuses existing Shop Type Mapping); (4) in-scope definition (denominator for % live); (5) one row per shop or repeats; (6) column names + update cadence. Easiest: get a sample export file.
- [ ] **Build Base → Now tab** once schema is confirmed — funnel KPIs (created / live / stalled), Reseller + Country breakdowns, shop-type-mapping admin modal (reuse existing Shop Type Mapping), weekly CSV + week-over-week "gone live" diff. ~1-session clone-and-adapt of the PayPal tab.

## Auto Translate

- [x] **Chase Marion for AutoTranslate raw data** — replied 2026-06-23. **Key finding: no automated raw-data feed exists.** Usage is tracked manually (DeepL per-provider keys, 4th→4th cycle; ShopType budget config; AddOn booked → added manually via Ezio). The Wilfried overview was hand-assembled. Full details + Confluence links in [[Questions Auto Translate]].
- [x] **Posted comment** on the AutoTranslate export request (2026-06-23) — advised to comment first, then open a ticket.
- [ ] **Open the R&D ticket** once the comment gets a response — paste-ready draft at [[autotranslate-export-new-ticket]] (relates-to [UNITY-9917](https://epages.atlassian.net/browse/UNITY-9917)). Ask: schedule `usageAutoTranslation.pl -allstores` weekly + drop the CSV somewhere we can import into the existing AT dashboard tab (cheap — no new tooling). Once created, stamp the real ticket key into the draft + here.
- [ ] **Decide AutoTranslate dashboard extension** — now have the **ShopType budget tables** → can add per-shop utilization-vs-budget to the dashboard. Needs a call with Chris.

## PayPal Migration tab

Open items from the 2026-06-17 logic review (see [[2026-06-17-paypal-migration-tracking]]). Completed this session: dedup fix, longest-match gateway classification, shop-based KPIs (worst-version-wins), shutdown-baseline progress bar, week-over-week diff panel, sleeper + time-progress label fixes.

- [ ] **Resolve conflict: how many PayPal versions are being shut down?** — Chris said **2**, Karsten said **3**. This decides which payment values get classified `shutdown` in the PayPal Gateways modal, and therefore the "On Shutdown Versions" KPI + migration target. Karsten owns the data (provides the CSV) so likely authoritative, but confirm the exact version names with both before finalizing gateway config. Candidate shutdown versions in the data: PayPal (1,082), PayPalPro (17), PayPalIntegralEvolution (7).
- [x] **LOW (perf): Per-render recompute** — done 2026-06-23. Memoized `ppGetGatewayInfo` by payment string (`ppGwCache`), cleared at the top of `ppRefresh`. Collapses the repeated O(entries × gateways) substring scans to one lookup per distinct payment string per render.

## Security



## Supabase Infrastructure

- [ ] **Set up separate Supabase Dev/Staging/Production projects** — low priority; benefit is safety (test schema changes before hitting prod) and cleaner dev workflow. Recoverable from CSV if skipped.

## Trial Conversion Dashboard

