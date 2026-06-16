---
type: source
title: "ePages Trial Conversion Dashboard — KPI Optimization"
date: 2026-05-04
source_file: ".raw/Claude-Dashboard-Optimierung und KPI-Empfehlungen.md"
tags:
  - epages
  - dashboard
  - kpi
  - trial-conversion
  - supabase
  - lovable
status: processed
related:
  - "[[ePages]]"
  - "[[Trial Conversion Dashboard]]"
  - "[[Survivorship Bias in SaaS Metrics]]"
---

# ePages Trial Conversion Dashboard — KPI Optimization

Conversation log (2026-05-04 to 2026-05-05) covering iterative review of ePages's Trial Conversion Dashboard: initial KPI gap analysis, incremental improvements through multiple screenshot reviews, discovery of survivorship bias in conversion data, and a Supabase migration to enable cross-device data sharing.

## Initial Dashboard State (2026-05-04)

Starting dashboard metrics at snapshot date 2026-04-28:
- **Im Trial**: 34 shops
- **Aktiv**: 7 shops
- **Trial Beendet**: 17 shops
- **Payment Failed**: 1 shop
- **Conversion Rate**: 11.9% (7 of 59)
- **Conversion Timing**: Median 24 days, average 29.9 days
- **Login Activity**: 56 active, 2 inactive, 1 sleeping

## KPI Recommendations

### Marketing KPIs (proposed)
| KPI | Rationale |
|-----|-----------|
| Lead source / acquisition channel | Identify which channel (Paid/Organic/Partner) drives trials |
| Trial starts per week/month | Volume trend for campaign control |
| Time-to-first-login | Proxy for onboarding quality |
| Churn reason | Why do 88% not convert? (constrained: no direct shop contact) |

### Sales KPIs (proposed)
| KPI | Rationale |
|-----|-----------|
| Avg days to conversion after contact | Measures sales efficiency |
| Contacted vs. not-contacted (TRIAL_ENDED) | Which shops were followed up? |
| Conversion rate by segment (shop vs. website, country) | Focus signal |
| MRR/ARR from conversions | Revenue relevance, not just count |
| Days since TRIAL_ENDED per shop | Prioritization for sales rescue |

**Constraints noted by team:**
- No direct contact with end consumers
- Cannot survey shops for churn reasons
- Reaktivierungsquote (reactivation rate) rejected as unhelpful for their use case
- Acquisition channel already captured via ePages Direct / S-Payment toggle at top of dashboard

## Dashboard Evolution (iterative improvements)

### v2 improvements (same session)
- "Status über Zeit" trend chart added (addresses Trendvergleich gap)
- Trial-Starts with Pro Monat/Pro Woche toggle + Ø comparisons
- Conversion Rate nach Produktkategorie: Shop 72.2% vs. Website 81.8%
- Status-Übergänge block showing individual shop transitions

### Status-Übergänge Sorting Recommendation
Priority-sorted by sales action urgency:
1. **AKTIV → FEHLER** — payment lost, highest urgency (red)
2. **AKTIV → BEENDET** — paying customer churned (yellow)
3. **FEHLER → BEENDET** — already broken, now gone (orange)
4. **FEHLER → AKTIV** — self-resolved, info only (green)
5. **TRIAL → AKTIV** — normal conversion, positive (green)

Within each group: sort by **days since status change, oldest first** (highest urgency).

## Survivorship Bias Discovery

The team revealed a critical data architecture constraint: shops that do not convert within 30 days are **deleted from the database**. This creates survivorship bias:

> The dataset only contains (a) converted shops, (b) shops still within the 30-day window. Non-converters older than 30 days are invisible.

**Impact on metrics:**
- Conversion Rate appeared artificially high (was showing 75.6%)
- Conversion Timing showed inflated values (demo data was 1-3 years old)
- Empty bars in 0–7 day and 8–14 day timing buckets explained by missing early non-converters

**Resolution:** Team implemented a `DELETED` / `Not Converted` status instead of physically removing shops. After this:
- Conversion Rate dropped from 75.6% → 48.3% (realistic)
- "Status über Zeit" chart filled with 14 snapshots
- New funnel: 87 total → 42 Aktiv (48.3%) + 32 Not Converted/Deleted (36.8%) + 13 still open (14.9%)

**Recommended UX addition:** Tooltip on conversion rate: *"Shops ohne Conversion werden nach 30 Tagen gelöscht. Die tatsächliche Conversion Rate liegt voraussichtlich niedriger."*

## Final Dashboard State (2026-05-04 ~15:20)

- Monthly filter (April–August visible)
- Status Transitions with priority sorting
- Conversion Timing with real data: Median 18 days, all buckets filled
- Trial Starts with trend comparison (▼ 35.3% vs. previous month)
- Country breakdown: UK, Spain, France, Germany
- Shop Owner Login Activity: 30.9% inactive (17/55 shops, 30–90 days no login)

## Supabase Migration (2026-05-05)

**Problem:** Dashboard used `localStorage` for CSV snapshot storage. `localStorage` is:
- Browser/device-specific (no cross-device sharing)
- Limited to ~5MB (quota exceeded with 14 snapshots × ~90 shops)

**Requirement:** All users of the shared Netlify URL should see the same data.

**Solution implemented:** Replace `localStorage` wrapper (`Kh` storage object) with Supabase client.

### Supabase table schema
```sql
CREATE TABLE snapshots (
  key text PRIMARY KEY,
  value text
);
ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON snapshots FOR ALL USING (true) WITH CHECK (true);
```

### Storage wrapper replacement
```javascript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const storage = {
  async get(key) { /* .from('snapshots').select().eq('key', key).single() */ },
  async set(key, value) { /* .from('snapshots').upsert({ key, value }) */ },
  async delete(key) { /* .from('snapshots').delete().eq('key', key) */ },
};
```

**Deployment note:** The app was built with Lovable. Lovable failed to rebuild after code changes (JS bundle hash unchanged across exports). Workaround: patch the minified bundle directly by injecting Supabase via CDN script tag in `index.html` and overwriting the minified `Kh` storage object.

## Key Insight

The survivorship bias caused by silently deleting non-converting shops made the dashboard's headline conversion rate (75.6%) nearly double the true rate (48.3%). Introducing a `DELETED` status rather than physical deletion is essential for any SaaS trial funnel dashboard to show realistic metrics.
