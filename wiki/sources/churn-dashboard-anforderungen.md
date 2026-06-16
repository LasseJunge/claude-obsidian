---
type: source
title: "Churn-Dashboard-Anforderungen und Aufbau"
date: 2026-05-11
source_file: ".raw/Claude-Churn-Dashboard-Anforderungen und Aufbau.md"
tags:
  - epages
  - churn
  - dashboard
  - requirements
  - visualization
status: processed
related:
  - "[[ePages]]"
  - "[[Churn Dashboard]]"
  - "[[epages-spreedly-migration-dashboard]]"
---

# Churn-Dashboard-Anforderungen und Aufbau

Claude conversation from 2026-05-11 documenting the initial requirements gathering and design exploration for an ePages Churn Dashboard — a separate analytics tool from the Spreedly migration dashboard, focused on tracking shop cancellations over time.

## Context

The user (likely a product/analytics role at ePages) used Claude to:
1. Structure raw planning notes into a formal requirements document
2. Generate an HTML design mockup of the dashboard
3. Identify open requirements questions
4. Produce a Word document for management presentation
5. Create a 45-minute meeting agenda for a stakeholder meeting with Wilfried and Chris

## Key Stakeholders

| Person | Role |
|--------|------|
| Wilfried | Primary requirements owner; top priority is defining what's important for him |
| Chris | Stakeholder in meeting |
| Karsten | Data owner / source of underlying shop data |
| John | Stakeholder with access/influence on design |

## Dashboard Purpose

Track **churn rate** for ePages shops across multiple payment providers over configurable time windows (1M, 3M, 6M, 12M). Distinct from the Spreedly migration dashboard — this is about cancellations, not payment gateway offboarding.

## Core Requirements (as gathered)

- Display churn rate for last 1, 3, 6, and 12 months
- Show multiple providers with distinct colors and line patterns
- Separate "status change" events from true churn (shops that changed status ≠ churned)
- Line chart: Y-axis = number of shops, X-axis = months
- Either 4 separate graphs or one graph with time-period filter toggle

## Open Requirements (as of 2026-05-11)

**Data & Tech**
- What format is Karsten's data in? (Excel, CSV, database?)
- How often should data be updated? (daily / weekly / monthly)
- What exactly constitutes "churned"? (cancellation date, last login, payment failure?)
- What are the concrete "status change" types?

**Dashboard & Visualization**
- Absolute (shop count) or relative (churn rate %) display?
- Backfill historical data or start fresh from a given date?
- Per-provider filter option?
- Drill-down to individual churned shops?

**Access & Infrastructure**
- Which platform? (Looker, Metabase, custom web app, Excel?)
- Who hosts and maintains long-term?
- GDPR constraints limiting tool choices?

**Process & Ownership**
- Who is the final decision-maker on design disputes?
- Budget or tool preferences within the company?

## Design Mockup (produced by Claude)

An HTML/Chart.js interactive mockup was generated with:
- Time-period filter buttons (1M / 3M / 6M / 12M)
- 4 KPI cards: churned shops, active shops, status changes (with explicit note that these are NOT churn), average churn rate
- Line chart with per-provider colors + dashed line patterns for accessibility
- Status changes section clearly separated from churn metrics

## Deliverables Created

- `Churn_Dashboard_Projektdokumentation.docx` — management-facing requirements document
- `Churn_Dashboard_Meeting_Agenda.docx` — 45-minute structured agenda for Wilfried/Chris meeting
- HTML dashboard mockup (design-only, fictional data)

## Meeting Agenda Structure (45 min)

| Time | Topic |
|------|-------|
| 0–5 min | Welcome & objectives |
| 5–15 min | Requirements & priorities (Wilfried) |
| 15–25 min | Data availability & access |
| 25–35 min | Dashboard design & tool decision |
| 35–42 min | Timeline & responsibilities |
| 42–45 min | Summary & next steps |

## Sources

- Raw conversation: `.raw/Claude-Churn-Dashboard-Anforderungen und Aufbau.md`
- Related: [[epages-spreedly-migration-dashboard]], [[ePages]]
