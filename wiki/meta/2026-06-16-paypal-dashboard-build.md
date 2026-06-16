---
type: session
title: "PayPal Migration Dashboard Build"
date: 2026-06-16
updated: 2026-06-16
status: current
tags:
  - epages
  - paypal
  - dashboard
  - spreedly
  - session
related:
  - "[[epages-spreedly-migration-dashboard]]"
  - "[[PayPal]]"
  - "[[meeting-2026-06-15-with-Chris]]"
  - "[[Supabase]]"
---

# PayPal Migration Dashboard Build — 2026-06-16

Session building out the PayPal Migration tab in the Spreedly dashboard (`.raw/Spreedly_Conversion.html`). The tab went from a placeholder to a fully working feature.

## What Was Built

A new **PayPal Migration** tab inside the existing `Spreedly_Conversion.html` dashboard with:

- Version-upgrade KPIs (not the binary Spreedly offboarding model)
- Admin-configurable gateway names + type classification
- Independent CSV upload, storage, and clear workflow
- Per-tab upload timestamps across all three data tabs

## KPI Design Decision

The Spreedly KPIs (binary: on/off Spreedly) don't fit PayPal's story. PayPal has **6 gateway versions**, 2 of which are being shut down, and the goal is to push shops onto the **newest version** (highest revenue). The version upgrade story needs different metrics:

| KPI | Color | Meaning |
|-----|-------|---------|
| Shutdown Versions | Red | Shops on the 2 gateways being shut down — urgent |
| Newest Version | Green | Shops already on target gateway |
| Other Legacy | Amber | Shops on old versions but not shutdown-listed |
| Sleeper Shops | Gray | Last login pre-2026; unlikely to self-migrate |
| Total PayPal Base | Blue | All Base shops with a PayPal gateway |
| Days to 01.01.27 | Varies | Countdown to hard deadline |

Progress bar measures "migrated to newest" rather than "left PayPal" — the goal is version upgrade, not offboarding.

## Admin-Configurable Gateways

Gateway names in ePages aren't yet known by the team at time of build. Solution: an admin modal (`pp-gateway-modal`) where the admin enters payment field **substrings** and classifies each as `shutdown` / `newest` / `legacy`. Stored as `paypal_config` in the Supabase `mappings` table. Falls back to detecting any shop whose `payment` field contains `'paypal'` when no gateways are configured.

## Independent PayPal Data Layer

PayPal data is fully independent from Spreedly data:

| Concern | Spreedly | PayPal |
|---------|----------|--------|
| Storage key | `csv-imports/latest.csv` | `csv-imports/paypal.csv` |
| State array | `shops[]` | `ppShops[]` (derived on each render) |
| Baseline | `baseline` mapping | `paypal_baseline` mapping |
| Admin buttons | `btn-upload`, `btn-clear` | `btn-pp-import`, `btn-pp-clear`, `btn-pp-gateways` |

## Per-Tab Upload Timestamps

Three independent timestamps stored in `tsData`:

```js
let tsData = { spreedlyUpload: '', atUpload: '', ppUpload: '', lastModified: '' };
```

`updateUploadStrip(tabName)` is called from `showPage()` and switches the strip label and value based on which tab is active. The "Dashboard last modified" timestamp is admin-only in the admin bar, updated by any write operation (config saves, gateway changes, data clears).

## Bug: PayPal Tab Completely Empty

**Root cause:** JavaScript Temporal Dead Zone (TDZ).

Inside `ppRefresh()`, `const ppShops = ppDetectShops()` was declared partway through the function. In JS, `const`/`let` declarations hoist to create a TDZ for the **entire function scope** — so the `if (!ppShops.length)` guard at the top of the function threw a `ReferenceError` silently, and no rendering happened.

```js
// BROKEN — TDZ kills the early guard
function ppRefresh() {
  if (!ppShops.length) { ... }    // ReferenceError: ppShops not yet declared
  // ...many lines...
  const ppShops = ppDetectShops(); // declaration here creates TDZ above
}

// FIXED — declaration first
function ppRefresh() {
  const ppShops = ppDetectShops(); // declare before any use
  if (!ppShops.length) { ... }     // safe
}
```

This is a silent failure mode: no console error in some environments, just an empty tab.

## Files Changed

- **`.raw/Spreedly_Conversion.html`** — all feature code; ~2600 lines total

## Open Questions

- Gateway names still unknown — admin will need to configure them once Karsten provides the data
- PayPal CSV data not yet available; baseline will be set on first import
