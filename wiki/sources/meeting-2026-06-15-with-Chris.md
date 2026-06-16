---
type: source
address: c-000004
source-type: meeting-notes
title: "Meeting 2026-06-15 — Tracking & Migrations"
created: 2026-06-15
updated: 2026-06-15
status: current
priority: time-sensitive
tags:
  - meeting
  - epages
  - payments
  - tracking
  - migration
  - sage
  - stripe
  - paypal
  - autotranslate
related:
  - "[[Sage]]"
  - "[[Stripe]]"
  - "[[PayPal]]"
  - "[[Spreedly]]"
  - "[[Base to Now Tracker]]"
  - "[[Questions Auto Translate]]"
  - "[[ePages Spreedly Migration]]"
  - "[[epages-spreedly-migration-dashboard]]"
---

# Meeting 2026-06-15 — Tracking & Migrations

> [!warning] Time sensitive
> Page 2 (Sage/Stripe) is flagged time-sensitive in the original notes; the PayPal deadline is **01.01.27**.

Handwritten meeting notes transcribed from a 2-page scan (`.raw/Notes 15.06.pdf`). Confirmed readings: connector = **HTK**, name = **Kristof**, PayPal note = "effort to move", deadline = **01.01.27**, Auto Translate recipient = **Enzio**.

## Base → Now Tracker

A new **migration tracker** for shops moving from ePages **Base** to **Now**. See [[Base to Now Tracker]].

- Driven from a **File** (CSV/export).
- Columns of interest: **Reseller, country, URL, package**.
- Key question: **what is the conversion between Base and Now** — i.e. *what is an "L" shop in Base?* (mapping package tiers across the two systems).
- **Creation date** → and **when is it going live**.
- Track **migration shops that didn't go live** — detection may be possible **without extra data**.
- Want a **general update timestamp in the dashboard**.

## Auto Translate

- Maybe **Karsten sends raw data to Enzio**.
- Relates to the existing AutoTranslate tracking work — see [[Questions Auto Translate]].

## PayPal

- **Goes live tomorrow** (≈2026-06-16); takes **effort to move**.
- **Deadline: 01.01.27.**
- **Track it the same way as [[Spreedly]]** (same pattern now applied to [[Sage]] and [[Stripe]] too).
- Side notes: **ask Karsten for the data tomorrow** so the tracker has an accurate baseline; **6 versions** exist — **a new version = more money**; **472 deleted**.

## Sage

- **Integration with them** — work with Sage directly on the integration.
- **350 Base shops** affected.
- **HTK is the new Sage Connector.**
- Shops **need to update to remain using Sage** — the old connector path stops working unless updated.
- **Track which features are used** — use **Kristof's sheet**; **ask whether it has been updated.**

## Stripe

- **Track it.**
- **Same approach as [[Spreedly]].**

## Interpretation

The recurring theme is **applying the [[ePages Spreedly Migration]] tracking pattern to several other migrations/providers**:

- **Base → Now** — shop platform migration tracker (conversion mapping, go-live status). New concept: [[Base to Now Tracker]].
- **PayPal** — going live imminently; track like Spreedly; hard deadline 01.01.27.
- **Sage** — connector cutover (HTK; ~350 Base shops must update); track feature usage vs Kristof's sheet.
- **Stripe** — track like Spreedly.
- **Auto Translate** — Karsten hands raw data to Enzio; ties into [[Questions Auto Translate]].

## Open Actions

- [ ] **PayPal goes live tomorrow** — confirm tracking is in place; ask Karsten for the data to set an accurate baseline.
- [ ] Define the **Base→Now package mapping** (what is an "L" shop in Base, vs Now packages).
- [ ] Ask **Kristof** whether his Sage feature-usage sheet is current.
- [ ] Confirm scope of the **~350 Base shops** that must update to the HTK connector.
- [ ] Decide how Base→Now / PayPal / Sage / Stripe tracking plug into [[epages-spreedly-migration-dashboard]].

## Source

- Source-of-record: [[notes-15-06-sage-stripe-2026-06-15]] (full transcription in `.raw/images/`)
- Scans: `_attachments/images/notes-15-06-page1.png`, `_attachments/images/notes-15-06-page2.png`
