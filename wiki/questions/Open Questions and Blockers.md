---
type: question
title: "Open Questions and Blockers"
created: 2026-06-23
updated: 2026-06-24
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

**Schema received 2026-06-24** — columns + `migrationstatus` enum confirmed; full mapping in [[Base to Now Tracker]]. Mostly unblocked — building can start on assumptions.

- [x] **Scope:** all Base shops, one row each (option a).
- [x] **"Went live" signal:** `migrationstatus` ∈ {`FINAL_DONE`=128, `FINAL_DONE_AND_PREP_DELETED`=1024}; `finalmigration` gives the date.
- [x] **Column names + cadence:** confirmed; **monthly**, key = `shopid`.
- [ ] **Shoptype + Base→Now mapping** — *not in this export; arrives next month.* Still need the "what is an L shop" mapping then.
- [ ] **`closedbymerchant` format + exclude from denominator?** (assuming yes — churned.)
- [ ] **`ABORTED` (512)** — own segment but excluded from % live? (assuming yes.)
- [ ] **Confirm `migrationstatus` is single-value, not an OR'd bitmask.**

> [!example]- Paste-ready message for Karsten (DE) — sent 2026-06-24
> Hi Karsten,
>
> für den **Base-→-Now-Tracker** brauche ich noch ein paar Infos zum Export, bevor ich bauen kann.
>
> **Am schnellsten wäre eine Beispiel-Exportdatei** (gern anonymisiert). Eine echte CSV beantwortet die meisten Fragen unten auf einen Blick — Spaltennamen, das Go-live-Signal, ob der Shoptype enthalten ist und wie die Zeilen aufgebaut sind. Falls das schnell geht, brauche ich danach vielleicht nur noch 1–2 Rückfragen.
>
> Falls ein Sample nicht schnell machbar ist, bräuchte ich diese Punkte explizit:
>
> 1. **Umfang / Zeilenstruktur** — welche Variante ist der Export? (a) alle Base-Shops, mit Migrations-Status-Spalten je Zeile, oder (b) nur Shops, die bereits eine Now-Instanz haben, oder (c) getrennte Base- und Now-Dateien, verknüpft über den Shop-Key. → Davon hängt ab, ob wir „noch nicht gestartet" anzeigen können und was der Nenner für „% live" ist.
> 2. **„Live gegangen"-Signal** — gibt es eine **Go-live-Datums**-Spalte (leer = noch nicht live), oder ein explizites **Status-Feld**? Falls Status-Feld: welche Werte sind möglich?
> 3. **Shoptype + Mapping** — enthält der Export den **Now**-Shoptype, nur den **Base**-Shoptype oder beide? In jedem Fall brauche ich das **Mapping Base-Shoptype → Now-Shoptype** — konkret: „Was ist ein ‚L'-Shop in Base, und was wird daraus in Now?"
> 4. **Definition „in scope"** — welche Base-Shops sollen tatsächlich migrieren (alle / nur aktive / bestimmte Pakete)? Das legt den Nenner für „% live" fest.
> 5. **Eine Zeile pro Shop, oder kann ein Shop mehrfach vorkommen?**
> 6. **Spalten-Bestätigung** — bitte die genauen Spaltennamen für: **Erstellungsdatum**, **Reseller**, **Land**, **Shop-URL**, **Shoptype** und den **Shop-Key/ID**, über den Zeilen über mehrere Uploads hinweg verknüpft werden.
> 7. **Aktualisierungs-Rhythmus** — wie oft wird der Export aktualisiert (wöchentlich? zum 4.? ad hoc)? Brauche ich für den Woche-zu-Woche-Diff („seit letztem Upload live gegangen").
>
> Schon geklärt, also **nicht** nötig zu beantworten: ein stabiler Shop-Key existiert, und es gibt **keine** Migrations-Deadline (also kein Countdown — das Dashboard zeigt nur % live vom Scope).
>
> Danke dir!

## For Chris + Karsten (PayPal migration)

Context: [[2026-06-17-paypal-migration-tracking]].

- [x] **How many PayPal versions are being shut down — 2 or 3?** **Resolved 2026-06-30: 3** — all of PayPal (1,082), PayPalPro (17), PayPalIntegralEvolution (7) are being shut down (Karsten, who owns the CSV). → Action: ensure all three are marked `shutdown` in the dashboard's **PayPal Gateways** modal (runtime config); drives the "On Shutdown Versions" KPI + migration baseline.

## For the team (OpenClaw / company Mattermost agent — evaluation)

Idea: integrate [[OpenClaw]] company-wide, chat to it on [[Mattermost]], give it Rovo + Atlassian access. Context: [[Chat-Native AI Agents]]. Open decisions before piloting:

- [ ] **Multi-tenancy fit.** OpenClaw is explicitly **single-operator** ([[Single-Operator Trust Boundary]]) and disclaims hostile multi-tenant isolation. Decide: small trusted group on one gateway, per-team/per-user gateways, or a multiplayer-by-design platform (cf. [[Aquifer Agent Platform]])?
- [ ] **Rovo/Atlassian access** is not built in — who builds the custom skill/MCP, and read-only or write-enabled (with audit trail)?
- [ ] **Permission propagation:** does the bot answer as itself (sees everything) or scoped to the asking user? The #1 governance question for Atlassian data.
- [ ] **EU data residency:** where does the model run and where does prompt/transcript data go? ([[ePages]] is EU-based.)

---

## Status

| Thread | Blocked on | Status |
|--------|-----------|--------|
| AutoTranslate budget findings | Chris call | questions ready — **chased 2026-06-24** (priority) |
| AutoTranslate automated feed | R&D ticket | comment posted, ticket pending — **chased 2026-06-24** |
| Base → Now tracker | shoptype (next export) | **schema received 2026-06-24 — ready to build on assumptions** |
| PayPal shutdown KPI | Chris + Karsten | **resolved 2026-06-30 — 3 versions; set all three `shutdown` in the modal** |

> [!note] Chased 2026-06-24
> No answers received since the questions were raised 2026-06-23. Sent per-person follow-ups to Chris (AutoTranslate call — priority), Karsten (Base→Now sample export + PayPal version count), and R&D (export ticket). Awaiting replies.
</content>
