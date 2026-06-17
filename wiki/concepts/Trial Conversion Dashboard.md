---
aliases:
  - "conversion-dashboard"

type: concept
title: "Trial Conversion Dashboard"
created: 2026-06-09
updated: 2026-06-09
status: current
tags:
  - epages
  - dashboard
  - trial-conversion
  - kpi
  - lovable
  - supabase
related:
  - "[[ePages]]"
  - "[[Survivorship Bias in SaaS Metrics]]"
  - "[[epages-trial-conversion-dashboard-kpi]]"
---

# Trial Conversion Dashboard

ePages internal SPA tracking the trial-to-paid conversion funnel for ePages Beyond shop subscriptions (ePages Direct and S-Payment channels). Built with Lovable, deployed to Netlify, backed by Supabase for shared state.

## Purpose

Monitor how many shops are converting from trial to paid subscriptions, identify at-risk shops (TRIAL_ENDED, FEHLER), and give Sales a prioritized action list.

## Shop Statuses

| Status | Meaning |
|--------|---------|
| IM TRIAL | Currently in trial period |
| AKTIV | Converted to paid subscription |
| TRIAL_ENDED | Trial expired, not yet converted |
| FEHLER / Payment Failed | Payment method failed |
| Not Converted / Deleted | Did not convert within 30-day window; previously deleted, now tracked with this status |

## Core KPIs

| KPI | Notes |
|-----|-------|
| Conversion Rate | `AKTIV / total` — subject to survivorship bias if non-converters are deleted |
| Trial-Kohorte | # converted / # started in cohort |
| Conversion Timing | Median and average days from trial start to conversion |
| Trial Starts per week/month | Volume trend with Ø comparison |
| Shop Owner Login Activity | Active / Inactive / Sleeping (30–90 days no login = churn indicator) |
| Conversion Rate by Produktkategorie | Shop vs. Website; shows segment differences |
| Status-Übergänge | Per-shop status transition log, priority-sorted |
| Country Breakdown | UK, Spain, France, Germany |

## Acquisition Channels

Two primary channels tracked as toggle at top:
- **ePages Direct** — direct sales
- **S-Payment** — partner / S-Payment channel

## Status-Übergänge Priority Sort

Transitions sorted by sales urgency:
1. AKTIV → FEHLER (revenue at immediate risk)
2. AKTIV → BEENDET (churn)
3. FEHLER → BEENDET (already broken, lost)
4. FEHLER → AKTIV (self-resolved — info only)
5. TRIAL → AKTIV (normal conversion — positive)

Within each group: oldest first (most days since transition = highest urgency).

## Technical Stack

- **Frontend**: React 18 + Recharts + PapaParse, single HTML file, Babel standalone transpiles JSX in-browser (no build step)
- **Deployment**: Netlify
- **Storage**: Supabase `snapshots (key text primary key, value text)` table — JSON-serialized snapshot arrays stored per dataset key
- **Previous storage**: `localStorage` — replaced due to 5MB limit and no cross-device sharing
- **Source**: [[conversion-dashboard]] — actual production HTML source ingested 2026-06-09

## Known Data Limitations

- Survivorship bias: shops not converting within 30 days were historically deleted. As of May 2026, these are retained as `Not Converted/Deleted` status, correcting the conversion rate from ~75% (biased) to ~48% (true).
- Conversion Timing median was inflated by demo data 1–3 years old.
- Churn reason unavailable: ePages has no direct contact with end consumers.
- Reaktivierungsquote: intentionally excluded; team determined it adds no value.

## Funnel Snapshot (as of ~2026-05-04)

| Stage | Count | % |
|-------|-------|---|
| Trial gestartet | 87 | 100% |
| Konvertiert (Aktiv) | 42 | 48.3% |
| Not Converted/Deleted | 32 | 36.8% |
| Still open | 13 | 14.9% |

## See Also

- [[epages-trial-conversion-dashboard-kpi]] — full KPI review conversation
- [[Survivorship Bias in SaaS Metrics]] — conceptual framework
- [[ePages]] — company context
