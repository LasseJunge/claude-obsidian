---
type: concept
title: "Churn Dashboard"
created: 2026-06-09
updated: 2026-06-09T13:36:00
status: current
tags:
  - epages
  - churn
  - analytics
  - dashboard
related:
  - "[[ePages]]"
  - "[[ePages Spreedly Migration]]"
  - "[[epages-spreedly-migration-dashboard]]"
  - "[[churn-dashboard-anforderungen]]"
  - "[[churn-dashboard-dokumentation]]"
---

# Churn Dashboard

An analytics dashboard being planned at ePages to track shop churn (cancellations) over time across payment providers. **Distinct from the Spreedly migration dashboard** — that tool tracks gateway offboarding; this tool tracks business churn.

## Purpose

Monitor how many ePages shops cancel or reduce activity over configurable time windows (1M / 3M / 6M / 12M), broken down by payment provider.

## Key Design Principles

- **Churn ≠ Status Change**: shops that change status (but don't cancel) must be tracked separately and excluded from the churn rate metric
- **Per-provider visibility**: each provider gets its own color and line pattern for accessibility
- **Configurable time windows**: 1, 3, 6, and 12 month views

## Status (as of 2026-05-11)

Requirements gathering phase. Stakeholder meeting with Wilfried and Chris planned for within 2–3 weeks. Core open questions: data format/source (Karsten), platform choice, churn definition, data update frequency.

## Key Stakeholders

- **Wilfried** — primary requirements owner
- **Chris** — stakeholder
- **Karsten** — data owner/source
- **John** — design/data stakeholder

## Data Source

Karsten holds the underlying shop data. Two options under evaluation:
1. Manual upload (high effort, requires requesting data each time)
2. API integration (preferred but subject to GDPR/data-privacy review)

## Technology

Platform undecided as of requirements phase. Options considered: Looker, Metabase, custom web app, Excel.

## Documentation Framework

When the churn dashboard is built, documentation should cover six areas (from [[churn-dashboard-dokumentation]]):

1. **Purpose & Audience** — goal, users, decisions enabled
2. **Churn Definition** — cancellation / inactivity / downgrade threshold, churn window
3. **Data Sources & Freshness** — origin, update frequency, quality owner
4. **Calculation Logic** — exact formula, edge cases (pauses, plan changes, reactivations)
5. **Technical Setup** — tool, code location, access management
6. **Maintenance & Ownership** — owner, changelog, incident process

> The churn definition is the most critical item — small definitional differences cause large metric differences.

## Tool Options Evaluated

| Tool | Fit |
|------|-----|
| Metabase | Good for small/mid team, low cost, OSS option |
| Looker | Scales well, code-based (LookML), expensive |
| Power BI | Microsoft ecosystem, cost-effective |
| Tableau | Most powerful visuals, most expensive |
| Grafana | Good if metrics are operational/technical |
| Google Looker Studio | Free, good for Google-connected data |

For ePages (mid-size, data team exists) → Looker or Power BI is the likely fit.

## Sources

- [[churn-dashboard-anforderungen]] — initial requirements conversation
- [[churn-dashboard-dokumentation]] — documentation framework + tool comparison
