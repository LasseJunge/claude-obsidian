---
type: entity
entity-type: org
title: "ePages"
created: 2026-06-09
updated: 2026-06-09
status: current
tags:
  - epages
  - ecommerce
  - saas
related:
  - "[[Spreedly]]"
  - "[[Supabase]]"
  - "[[Netlify]]"
  - "[[ePages Spreedly Migration]]"
  - "[[epages-spreedly-migration-dashboard]]"
  - "[[epages-spreedly-dashboard-conversation]]"
  - "[[Churn Dashboard]]"
  - "[[churn-dashboard-anforderungen]]"
  - "[[Company-Wide Dashboard Hosting]]"
  - "[[epages-company-dashboard-setup]]"
  - "[[Trial Conversion Dashboard]]"
  - "[[epages-trial-conversion-dashboard-kpi]]"
---

# ePages

German e-commerce SaaS platform. Provides white-label shop software sold through reseller partners (e.g. 1&1, Strato, Ionos, Host Europe).

## Software Variants

| Product | Notes |
|---------|-------|
| ePages Base | Legacy platform; shoptype patterns: eCom*, ECommerce*, Enterprise*, Pro, Premium |
| ePages Now | Modern platform; shoptype patterns: *Now*, 292, 293, 851 |

## Partner / Reseller Model

Shops are provisioned through reseller partners. Partners appear in the `project`/`partner` CSV column. Known partners from mock data: 1&1, Strato, Ionos, Host Europe, Default.

## Active Migration

Currently migrating shops off the Spreedly payment gateway before a hard shutdown deadline. See [[ePages Spreedly Migration]] and [[epages-spreedly-migration-dashboard]].

## Churn Dashboard

Separate analytics initiative (2026-05-11+) to track shop cancellations over time across payment providers. See [[Churn Dashboard]] and [[churn-dashboard-anforderungen]]. Stakeholders: Wilfried, Chris, Karsten, John.

## Dashboard Infrastructure

Company evaluated hosting options for a company-wide HTML/JS/CSS dashboard with API data ingestion. Decision: own always-on server + VPN (WireGuard). See [[Company-Wide Dashboard Hosting]] and [[epages-company-dashboard-setup]].

## Trial Conversion Dashboard

Tracks the trial-to-paid conversion funnel for ePages shops across the ePages Direct and S-Payment channels. Built with Lovable, backed by Supabase. Key discovery: survivorship bias inflated conversion rate from ~48% true to ~76% apparent. See [[Trial Conversion Dashboard]] and [[epages-trial-conversion-dashboard-kpi]].

## Sources

- [[epages-spreedly-migration-dashboard]] — internal migration dashboard source
- [[epages-spreedly-dashboard-conversation]] — design & requirements conversation
- [[churn-dashboard-anforderungen]] — churn dashboard requirements conversation
- [[epages-company-dashboard-setup]] — company-wide dashboard hosting decision
- [[epages-trial-conversion-dashboard-kpi]] — trial conversion dashboard KPI review
