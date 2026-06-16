---
type: source
title: "Dokumentation für Churn Dashboard"
date: 2026-05-11
source_file: ".raw/Claude-Dokumentation für Churn Dashboard.md"
tags:
  - churn
  - dashboard
  - documentation
  - kpi
  - epages
status: processed
related:
  - "[[Churn Dashboard Documentation]]"
  - "[[ePages Spreedly Migration]]"
  - "[[epages-spreedly-migration-dashboard]]"
---

# Dokumentation für Churn Dashboard

A Claude conversation (May 11 2026) covering two topics: (1) what questions matter for churn dashboard documentation, and (2) which tools to use for a company-wide dashboard.

## Conversation Summary

### Part 1 — Key Questions for Churn Dashboard Documentation

Six documentation areas were identified:

| Area | Key Questions |
|------|--------------|
| **Purpose & Audience** | Goal of dashboard, who uses it, which decisions it supports |
| **Definition & Metrics** | How churn is defined (cancellation / inactivity / downgrade), churn window (30/60/90 days), KPIs (Churn Rate, MRR Churn, NRR), segmentation |
| **Data Sources & Freshness** | Origin (CRM, DB, DWH), update frequency, data quality owner |
| **Calculation Logic** | Exact churn rate formula, edge cases (pauses, plan changes, reactivations), handling of missing data |
| **Technical Setup** | Tool used, code / data model location, access management |
| **Maintenance & Ownership** | Dashboard owner, change log process, incident handling |

> **Key principle from conversation:** The churn definition is the most critical thing to nail down — small differences in definition cause large differences in numbers and downstream confusion.

### Part 2 — Company-Wide Dashboard Tools

#### BI / Classic Tools

| Tool | Strengths | Weaknesses |
|------|-----------|------------|
| Tableau | Powerful, great visuals | Expensive, steep learning curve |
| Power BI | Cheap (Microsoft ecosystem), widespread | Less flexible for complex models |
| Looker | Code-based (LookML), scales well | Expensive, needs technical know-how |
| Metabase | Simple, cheap, OSS option | Fewer features for complex analysis |

#### Modern Data Stack

- **Grafana** — strong for operational / technical metrics
- **Redash** — lightweight, SQL-based
- **Apache Superset** — OSS, scales well

#### Simple & Collaborative

- **Google Looker Studio** — free, good for Google ecosystem
- **Notion / Confluence** — embedded reports only, not real dashboards

#### Company-Wide Selection Criteria

- SSO / role-based access control
- Concurrent user performance
- Data warehouse compatibility (BigQuery, Snowflake, Redshift)
- Embed capabilities
- Per-seat cost at scale

#### Recommended by Context

| Context | Tool |
|---------|------|
| Startup / small team | Metabase or Looker Studio |
| Mid-size with data team | Looker or Power BI |
| Enterprise / Microsoft-heavy | Power BI |
| Data-driven culture | Looker or Tableau |

## Relevance to ePages Project

The churn analysis tab in the ePages migration dashboard (`wiki/sources/epages-spreedly-migration-dashboard.md`) currently runs on mock data. The documentation framework from this conversation is directly applicable when the real churn data pipeline is built out.
