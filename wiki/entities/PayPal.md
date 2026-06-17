---
type: entity
address: c-000006
entity-type: product
title: "PayPal"
created: 2026-06-15
updated: 2026-06-15
status: current
tags:
  - paypal
  - payments
  - gateway
related:
  - "[[ePages]]"
  - "[[Spreedly]]"
  - "[[Sage]]"
  - "[[Stripe]]"
  - "[[meeting-2026-06-15-with-Chris]]"
---

# PayPal

Payment provider in the ePages stack. Per the [[meeting-2026-06-15-with-Chris|2026-06-15 meeting]], a PayPal change is **going live imminently** and must be tracked the same way as the [[Spreedly]] migration.

## Context in ePages

- **Going live** the day after the meeting (≈2026-06-16); described as taking **effort to move**.
- **Hard deadline: 01.01.27.**
- To be **tracked like [[Spreedly]]** — the same offboarding/usage-tracking pattern now applied across [[Sage]] and [[Stripe]].
- **Ask Karsten for the data** to establish an accurate tracking baseline.
- Note from the meeting: **6 versions** exist, a **new version = more money**, and **2 integrations will be shut down** next year (the shutdown versions shops must switch off).
- ⚠️ **Open conflict:** Chris says **2** versions are being shut down; Karsten says **3**. The exact set decides the `shutdown` gateway classification and the "On Shutdown Versions" KPI — confirm before finalizing. Candidates in the data: PayPal (1,082), PayPalPro (17), PayPalIntegralEvolution (7). Tracked in TODO.md.

## Dashboard

The PayPal Migration tab is now built inside [[epages-spreedly-migration-dashboard]]. It uses version-upgrade KPIs (Shutdown / Newest / Legacy / Sleeper / Total / Days remaining) rather than the binary Spreedly model. Gateway names must be configured by the admin once Karsten provides the data. See [[2026-06-16-paypal-dashboard-build]] for the full build notes and the TDZ bug that caused the tab to initially render empty.

## Sources

- [[meeting-2026-06-15-with-Chris]]
- [[2026-06-16-paypal-dashboard-build]]
