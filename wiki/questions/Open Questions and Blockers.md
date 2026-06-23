---
type: question
title: "Open Questions and Blockers"
created: 2026-06-23
updated: 2026-06-23
tags:
  - blockers
  - open-questions
  - autotranslate
  - paypal
  - base-to-now
status: developing
related:
  - "[[Questions Auto Translate]]"
  - "[[autotranslate-export-new-ticket]]"
  - "[[UNITY-9917-export-request-draft]]"
  - "[[Base to Now Tracker]]"
  - "[[2026-06-17-paypal-migration-tracking]]"
  - "[[meeting-2026-06-15-with-Chris]]"
---

# Open Questions and Blockers

The single list of everything that needs an answer from someone before the related work can move. Grouped by who can answer it. Update the status box as answers come in.

> [!info] How to use
> Each item says **what to ask**, **who**, and **what it unblocks**. When answered, move the detail back to the thread's own page and check it off here.

---

## For Chris (AutoTranslate call)

The AutoTranslate dashboard now computes budget utilization, but several findings and assumptions need confirming. Full context: [[Questions Auto Translate]].

- [ ] **Is the 25M cap (`AutoTranslationMaxCharacters`) enforced**, or does the scheduler keep translating past it? Two shops (www.tiendadebastones.com, www.glassstudiosupplies.co.uk) are already over 25M *with* the AddOn. → Decides whether "over AddOn cap" is a billing question or a runaway-cost risk.
- [ ] **Is the base package limit enforced?** Non-AddOn shops are sitting at 5.5M / 10M / 20M characters — far past any base package (max 5M) — without ever buying the AddOn. → If the MBO/Stripe prompt doesn't block translation, that's a revenue leak.
- [ ] **Is overage billed at all?** (25M+ for AddOn shops; package+ for non-AddOn shops, at 20 €/1M.) → Quantifies the leak.
- [ ] **Is `AutoTranslationAddOnBought` set consistently, including waiver ("WB") shops?** retterstore.de and www.iberianwinesandfood.com are AddOnBought in Confluence but unflagged in the CSV (both "doesn't need to pay – WB"). → Any CSV-reading tool will misclassify waiver shops.
- [ ] **Confirm the budget is per-shop total, not per-language.** Strongly implied by the tables (Cloud NowM=1M with 1 lang, NowL=1M with 3 langs), but never stated explicitly. → Validates the dashboard's whole budget calculation.
- [ ] **Is the Cloud/Direct-vs-other partner split correct** for choosing the budget table, and are the ShopType budget numbers still current?
- [ ] **Do the specific over-limit shops need manual intervention now?** (tiendadebastones, glassstudiosupplies over cap; king-verschleissteile, kfwg24, mardomdecor over package with no AddOn.)

## For R&D (AutoTranslate export ticket)

Path to an automated feed. Comment posted 2026-06-23; ticket draft ready at [[autotranslate-export-new-ticket]] (relates [UNITY-9917](https://epages.atlassian.net/browse/UNITY-9917)).

- [ ] **Will R&D schedule `usageAutoTranslation.pl -allstores`** (weekly or 4th→4th cycle) and drop the CSV somewhere we can import? → Replaces hand-assembled data; unblocks the whole AT dashboard feed.
- [ ] **Does the export include `shoptype` (and the Now tier)?** → The dashboard already captures a `shoptype` column; once present, every non-AddOn row gets an exact budget %, not just "–".
- [ ] **Run host, output location, and access method?** Filename + column layout stable across runs?

## For Karsten (Base → Now tracker)

Blocked before any build can start. Plan: [[Base to Now Tracker]].

- [ ] **Scope:** all Base shops, only Now-instances, or separate files?
- [ ] **"Went live" signal:** a go-live date or a status field?
- [ ] **Shop-type data + Base→Now shoptype mapping** (reuse existing Shop Type Mapping; "what is an L shop").
- [ ] **In-scope definition** (the denominator for "% live").
- [ ] **One row per shop, or repeats?**
- [ ] **Column names + update cadence.** → Easiest unblock: **get a sample export file.**

## For Chris + Karsten (PayPal migration)

Context: [[2026-06-17-paypal-migration-tracking]].

- [ ] **How many PayPal versions are being shut down — 2 or 3?** Chris said 2, Karsten said 3. Karsten owns the CSV (likely authoritative). Confirm exact version names. Candidates in the data: PayPal (1,082), PayPalPro (17), PayPalIntegralEvolution (7). → Decides which values are classified `shutdown` → the "On Shutdown Versions" KPI + migration target.

---

## Status

| Thread | Blocked on | Status |
|--------|-----------|--------|
| AutoTranslate budget findings | Chris call | questions ready |
| AutoTranslate automated feed | R&D ticket | comment posted, ticket pending |
| Base → Now tracker | Karsten (sample export) | not started |
| PayPal shutdown KPI | Chris + Karsten | gateway config pending answer |
</content>
