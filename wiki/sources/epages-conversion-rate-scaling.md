---
type: source
created: 2026-06-16
updated: 2026-06-16
title: "Conversion Rate bei tausenden Shops skalieren"
date: 2026-06-01
source_file: ".raw/Claude-Conversion Rate bei tausenden Shops skalieren.md"
tags:
  - epages
  - conversion-rate
  - dashboard
  - trial-cohort
  - kpi
status: processed
related:
  - "[[ePages]]"
  - "[[ePages Spreedly Migration]]"
  - "[[epages-spreedly-migration-dashboard]]"
  - "[[Trial Cohort Conversion Rate]]"
---

# Conversion Rate bei tausenden Shops skalieren

Discussion (2026-06-01) about how the KPI Trial Cohort dashboard metric behaves as shop counts scale from ~100 to thousands, and how to display "Deleted" shops to a management audience.

## Context

The dashboard tracks a Trial Kohort KPI with the following shop states:
- **Active** — converted (counted in numerator)
- **Trial** — still in active trial period
- **TRIAL_ENDED** — trial expired, not yet deleted (30-day grace window)
- **Deleted** — not found in the latest CSV after 30 days in TRIAL_ENDED

Conversion Rate formula: `Active / All shops in cohort` (Deleted stays in denominator).

Sample cohort of 106 shops: 32 active (30.2%), 33 deleted (31.1%), 18 TRIAL_ENDED, ~23 still in trial.

## Key Findings

### Scaling behaviour
- The conversion rate itself becomes **statistically more robust** at thousands of shops — individual outliers have less weight.
- The absolute number of shops in "limbo" (TRIAL_ENDED) scales proportionally, but the methodology remains sound.
- Since most shops convert **during** the trial phase (not after), TRIAL_ENDED is effectively a near-certain loss signal.

### Cohort maturity
- The rate is technically a moving figure until all TRIAL_ENDED shops resolve.
- Recommended guard: only publish a cohort's final rate after it is ≥45 days old (14-day trial + 30-day window + buffer).

### Dashboard display decision
- **Deleted should stay visible** for management audiences because hiding it leaves ~31% of the cohort unexplained, eroding trust.
- Recommended label rename: "Not Converted/Deleted" → **"Abgelaufen"** (expired); "TRIAL_ENDED" → **"Ausstehend"** (pending).
- This ensures the four slices sum to 100%, which is the key management requirement.

## Methodology Note

Including Deleted in the denominator is the correct approach — removing them would artificially inflate the conversion rate from ~30% to ~44%.
