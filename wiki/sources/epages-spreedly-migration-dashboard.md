---
type: source
title: "ePages Spreedly Migration Dashboard"
source_file: ".raw/index_12.html"
created: 2026-06-09
updated: 2026-06-09
status: current
tags:
  - epages
  - spreedly
  - migration
  - dashboard
  - supabase
related:
  - "[[ePages]]"
  - "[[Spreedly]]"
  - "[[Stripe]]"
  - "[[Supabase]]"
  - "[[Netlify]]"
  - "[[ePages Spreedly Migration]]"
  - "[[supabase-netlify-debug]]"
  - "[[epages-spreedly-stripe-dashboard-integration]]"
---

# ePages Spreedly Migration Dashboard

Internal single-page dashboard built for ePages to track the offboarding of shops from the Spreedly payment gateway. Auth-gated (Supabase email/password) with a second admin password layer.

## Purpose

Track which ePages shops are still using Spreedly, which have left, and forecast completion against a hard deadline. The dashboard is the operational tool for the migration team.

## Pages / Tabs

| Tab | Access | Status |
|-----|--------|--------|
| Spreedly Migration | All authenticated users | Live |
| Churn Analysis | Admin only | Live (mock data) |
| PayPal Migration | Admin only | Placeholder |
| Autotranslate | Admin only | Placeholder |
| Other Apps | Admin only | Placeholder |
| Internal | Device-restricted (MAC) | Restricted |
| Data Fields | Admin only | Live |

## Migration Tab — KPIs

- **Still on Spreedly** — shops where `payment` field contains "spreedly"
- **Left Spreedly** — `baseline - still_on_spreedly`; progress toward 100% migration
- **Sleeper shops** — last login before 2026; flagged as unlikely to migrate; excluded from 100% target
- **Total shops** — active shops in current CSV
- **Days remaining** — countdown to Spreedly shutdown deadline

Progress bar shows `(left / baseline) %` alongside a time-elapsed bar (start date → deadline). Deadline pill in header turns amber at <60 days, red at <30.

## Data Model

Shops are loaded from a CSV import. Fields:

| Field | Source column | Notes |
|-------|---------------|-------|
| alias | `alias` / `id` | Primary key; deduplication key |
| partner | `project` / `projekt` / `partner` | Reseller |
| database | `database` | |
| domain | `domainname` / `domain` | |
| shoptype | `shoptype` | Raw value; mapped to software |
| lastlogin | `lastlogin` | Year integer; <2026 = sleeper |
| payment | `payment` | Contains "spreedly" → provider flag |
| software | derived | Base or Now, via shoptype mapping |
| provider | derived | `spreedly` or `other` |

Delimiter auto-detection: tab → semicolon → comma (first-line heuristic).

## Shop Type Mapping

Rule-based pattern matcher classifying `shoptype` → Base or Now. Rules evaluated in order, first match wins. Three match modes: `startsWith`, `contains`, `exact`. Configurable by admin at runtime; stored in Supabase `mappings` table.

Default rules classify eCommerce/Enterprise/Pro/Premium → Base; Now/292/293/851 → Now.

## Package Mapping

Maps partner-specific package names to internal sizes (S / M / L / XL). Configurable per partner in admin modal. Pending field — not yet active in search columns.

## Churn Analysis Tab

Shows monthly churn rate charts. Currently uses mock data (`generateDailyMock` random walk). Filterable by: partner, software (Base/Now), package, and composite dimensions (partner+package, software+partner, software+partner+package). Time range: 30 / 90 / 180 / 365 days.

> [!gap] Mock data not yet replaced
> The churn tab explicitly has `// TODO: Replace generateDailyMock + MOCK_CHURN_DATA with real API call`. Churn figures are not real.

## Tech Stack

- **Frontend**: Vanilla JS, no framework
- **Fonts**: Syne (headings), Inter (body) via Google Fonts
- **Icons**: Tabler Icons (webfont)
- **Charts**: Chart.js 4.4.0
- **Backend**: Supabase (auth, Postgres tables, Storage for CSV)
- **Tables**: `config` (start/end date), `baseline` (shop count + date), `mappings` (package + shoptype rules)
- **Storage bucket**: `csv-imports/latest.csv`

## Auth Model

Two-layer:
1. Supabase email/password — gates the entire dashboard
2. Admin password (client-side check) — gates admin tabs + write operations

> [!contradiction] Security concern
> Admin password verification is client-side JS. Anyone with dashboard access and dev tools can bypass it. This is appropriate for a low-stakes internal tool but not for anything sensitive.

## Data Fields Status

| Field | Status | Enables |
|-------|--------|---------|
| Last Login | Active | Sleeper detection |
| Partner | Active | Partner breakdown |
| Spreedly Status | Active | KPIs, progress bar |
| Shop Type | Active | Software mapping |
| Domain | Active | Domain column in search |
| Country | Pending | Country breakdown |
| Package | Pending | Package column, S/M/L/XL |

## Key Insight

The sleeper note is baked into the dashboard UX: "X sleeper shops will not be contacted and are therefore unlikely to leave Spreedly — 100% may not be reached." This manages stakeholder expectations about the migration ceiling.
