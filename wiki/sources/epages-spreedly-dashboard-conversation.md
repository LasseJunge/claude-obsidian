---
type: source
created: 2026-06-16
updated: 2026-06-16
title: "Dashboard für Spreedly zu Stripe Migration — Design Conversation"
date: 2026-05-18
source_file: ".raw/Claude-Dashboard für Spreedly zu Stripe Migration.md"
tags:
  - epages
  - spreedly
  - stripe
  - dashboard
  - requirements
status: processed
related:
  - "[[ePages]]"
  - "[[Spreedly]]"
  - "[[Stripe]]"
  - "[[ePages Spreedly Migration]]"
  - "[[epages-spreedly-migration-dashboard]]"
---

# Dashboard für Spreedly zu Stripe Migration — Design Conversation

Claude conversation log (2026-05-18 → 2026-06-03) documenting the full requirements gathering and iterative build of the ePages Spreedly migration dashboard. This is the design history behind [[epages-spreedly-migration-dashboard]].

## Conversation Arc

The session ran from initial requirements through multiple rebuild cycles, ending with a CSV-import–ready dashboard that accepts real ePages shop data.

### Phase 1 — Requirements (2026-05-18)

Key decisions made:

- **Scale**: ~30,000 shops → no single-table view; search-first + aggregated breakdowns
- **Two-tier access**: read-only for Management/Sales/PM; admin password gates mutations
- **Primary breakdowns**: Partner and Package (country secondary)
- **Package sizes**: S / M / L / XL (partner-specific names mapped in admin)
- **Software split**: ePages Base vs. ePages Now (derived from shoptype field)
- **Sleeper definition**: `lastlogin < 2026` = sleeper; not to be contacted
- **Completion caveat**: 100% migration may not be reached due to sleepers
- **Server-readiness**: all admin mutations designed as `fetch('/api/...')` drop-ins from localStorage

### Phase 2 — Branding & UX (2026-05-18 – 05-19)

- ePages brand colors: **red and white** (primary), not teal/green
- Spreedly shown as lighter orange-red to distinguish from ePages red; Stripe stays blue
- Progress bar: left-to-right (temporal convention); not bottom-to-top
- Abandoned table scroll for 30k shops; implemented search-first with 50-per-page pagination

### Phase 3 — Domain Model Refinement (2026-05-19)

- Goal reframed: not "get shops to Stripe" but **"get shops off Spreedly"**
  - KPI "Migrated to Stripe" removed entirely
  - Progress bar recalculated as Spreedly decline (baseline → 0)
- "Woanders" (elsewhere) status for shops that left Spreedly but did not go to Stripe
- Software breakdown (Base/Now) placed as four KPI cards: Base total → Base migrated → Now total → Now migrated; "elsewhere" shown as slim info row below
- Admin-only tabs hidden from normal users (Churn, Internal, PayPal Migration, Autotranslate, Other Apps)
- Dashboard translated to English

### Phase 4 — Real Data Integration (2026-06-02 – 06-03)

Actual CSV schema revealed:

| CSV Column | Dashboard Field | Notes |
|------------|-----------------|-------|
| `projekt` | partner | Reseller/partner name |
| `database` | database | Invisible but searchable |
| `alias` | shop_id | Variable format; used internally only |
| `domainname` | domain | May be empty — show shop, leave domain blank |
| `shoptype` | software | Mapped to Base/Now via admin rules |
| `lastlogin` | lastlogin | Year integer; <2026 = sleeper |
| `payment` | provider | Subcategories: SpreedlyAuthorize, SpreedlyAuthorizeEvo, SpreedlyMercadoPago, SpreedlyStripe, SpreedlyStripePaymentIntents |

Shoptype mapping rules (default):
- **Base**: startsWith `eCom` | `Enterprise` | `acens10000` | `Pro` | `Premium`
- **Now**: contains `Now` | exact `292` | `293` | `851`

Baseline logic:
- First CSV import auto-sets baseline (total shop count)
- Subsequent imports compare against baseline to derive "left Spreedly" count
- No new shops can join Spreedly, so baseline is monotonically correct
- Baseline management in admin Data Fields tab

Mock data fully removed in final version.

## Key Design Tensions Resolved

| Tension | Resolution |
|---------|------------|
| Table unusable at 30k rows | Search-first; aggregated breakdowns always visible |
| Spreedly red vs. ePages red | ePages = dark red; Spreedly = orange-red |
| "Left Spreedly" vs. "Migrated to Stripe" | Reframed to Spreedly decline; Stripe reference removed |
| Partner-specific package names vs. S/M/L/XL | Admin mapping table; partner names preserved in DB, displayed normalized |
| Sleeper inflating the 100% gap | Explicit KPI card + inline warning on progress bar |
| Baseline drift as shops churn | Baseline locked at first import; never recalculated |

## Pending / Future Work (as of conversation end)

- Country breakdown (field not yet in CSV)
- Package column in search (field not yet in CSV)
- Churn Analysis tab (data not yet available; 1/3/6/12-month rates planned)
- PayPal Migration tab (placeholder)
- Autotranslate tab (placeholder)
- Internal/locked tab (MAC-address device restriction; server-side only)
- Änderungshistorie (change history) — admin-only audit log
- Real server deployment; all localStorage → `fetch()` swap
- Automatic data refresh (every 5 minutes proposal)
