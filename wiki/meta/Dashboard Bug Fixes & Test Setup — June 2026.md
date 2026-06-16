---
type: session
title: "Dashboard Bug Fixes & Test Setup — June 2026"
created: 2026-06-10
updated: 2026-06-10
tags:
  - dashboard
  - bug-fix
  - testing
  - spreedly
  - conversion-dashboard
  - vitest
status: evergreen
related:
  - "[[ePages Spreedly Migration]]"
  - "[[Trial Conversion Dashboard]]"
  - "[[Churn Dashboard]]"
  - "[[Trial Cohort Conversion Rate]]"
  - "[[Survivorship Bias in SaaS Metrics]]"
---

# Dashboard Bug Fixes & Test Setup — June 2026

Full session covering 5 bugs found via autoresearch review across `Spreedly_Conversion.html` and `conversion-dashboard.html`. Automated tests added with Vitest.

---

## Bug 1 — `shopKey()` NULL string treated as valid domain (CRITICAL)

**File:** `Spreedly_Conversion.html`

**Root cause:** The CSV exported by the system stores missing domain values as the literal string `"NULL"` rather than an empty value. `shopKey()` checked `s.domain` for truthiness — `"NULL"` is truthy — so it returned `"NULL"` as the domain key for every domain-less shop. Since many shops share this key, no shop was ever flagged as "Left Spreedly" when their alias was the only real identifier.

**Symptom:** Shop "triller" (alias only, domain=NULL) was visible after the first CSV import but never appeared as "Left Spreedly" after a second import missing that shop.

**Fix:**
```js
function shopKey(s) {
  const nullish = v => { const t = (v || '').trim(); return /^null$/i.test(t) ? '' : t; };
  const d = nullish(s.domain), a = nullish(s.alias), n = nullish(s.name);
  if (d) return d;
  if (a) return a;
  if (n) return n;
  const fallback = [s.partner, s.shoptype, s.provider, s.lastlogin].filter(Boolean).join('|');
  if (fallback) return '__fb:' + fallback;
  return '';
}
```

**Debugging approach:** Added temporary `console.group` logging to `getGoneShops()` and `[CSV import]` logging to the import handler. The alias-only array returned empty, revealing that `s.domain = "NULL"` was being treated as truthy.

---

## Bug 2 — CSV parser splits on delimiters inside quoted fields (MEDIUM)

**File:** `Spreedly_Conversion.html`

**Root cause:** `parseCSV()` used `line.split(';')` — a naive split that breaks quoted fields containing semicolons (e.g. `"Smith; Sons"` becomes two fields). The delimiter detection in `parseCSVAuto()` also used a regex replace across the entire text, inconsistent with the naive split.

**Fix:** Replaced naive split with a proper `splitCSVLine(line, delim)` function that tracks quote state character-by-character and handles escaped quotes (`""`). `parseCSVAuto()` now passes the detected delimiter down to `parseCSV()` instead of normalising to semicolons.

---

## Bug 3 — Conversion rate included shops from before tracking started (HIGH)

**File:** `conversion-dashboard.html`

**Root cause:** The trial cohort (`trialCohort`) and conversion timing chart used `filteredShops` — all shops regardless of when they were created. Shops existing before snapshot tracking began were never seen as TRIAL_STARTED, so their conversion timing was unreliable and their inclusion inflated or distorted the conversion rate.

**Fix:** Added `TRACKING_START = '2026-04'` constant and derived `cohortShops` from `filteredShops` filtering to shops with `createdAt >= '2026-04'`. `trialCohort` and `conversionTimings` now use `cohortShops`. `currentCounts` (total active shops) still uses `filteredShops` so headline numbers remain accurate.

**Indicator:** A "Since April 2026" badge with a ⓘ tooltip appears under the conversion rate, explaining the filter to any viewer.

---

## Bug 4 — Duplicate file detection used filename only (MEDIUM)

**File:** `conversion-dashboard.html`

**Root cause:** `isDuplicateFile` checked only `s.fileName === file.name`. Re-exporting a CSV with the same filename but fresh data (common with dated export patterns) silently skipped the import.

**Fix:**
```js
const isDuplicateFile = existingSnapshots.some(s => s.fileName === file.name && s.count === rows.length);
```
A file is only a duplicate if both filename AND row count match.

---

## Automated Tests (Vitest)

**Setup:** Node.js 24 + Vitest installed in the vault root. Run with `npm test`.

**Files:**
- `tests/spreedly-utils.js` — pure functions extracted from `Spreedly_Conversion.html` (`shopKey`, `getGoneShops`, `splitCSVLine`). Must be kept in sync with the HTML when those functions change.
- `tests/spreedly.test.js` — 20 tests covering all edge cases.

**Key test cases:**
- `shopKey` with domain present, alias-only, NULL string domain, whitespace, composite fallback, empty shop
- `getGoneShops` with no baseline, domain-based gone shops, alias-only gone shops (triller case), shops still present, unidentifiable shops excluded
- `splitCSVLine` with semicolon/comma delimiters, quoted fields containing delimiters, escaped quotes

**To run:** Open a terminal in `C:\Users\ljunge\claude-obsidian` and run `npm test`.

---

## Decisions Made

| Topic | Decision | Rationale |
|-------|----------|-----------|
| Vite migration (Trial Conversion Dashboard) | Skipped | Dashboard mostly finished; overhead not worth it |
| Supabase environments (Dev/Staging/Prod) | Deferred | Internal tool, CSV as fallback; added to TODO.md |
| Supabase Auth to replace JS password | Deferred | Requires significant rework; added to TODO.md as security risk |
| Test layer scope | Spreedly dashboard only | Conversion dashboard mostly stable; Spreedly is actively evolving |

---

## Open TODOs (see TODO.md)

- Add Shop Count trend chart to Churn tab — blocked until Karsten provides real churn data
- Harden Supabase write policies — `write_all` is public; needs Supabase Auth
- Replace hardcoded admin password in Spreedly HTML — fix alongside Supabase Auth
- Set up separate Supabase Dev/Staging/Prod environments — low priority
