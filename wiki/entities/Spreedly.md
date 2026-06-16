---
type: entity
entity-type: product
title: "Spreedly"
created: 2026-06-09
updated: 2026-06-09
status: current
tags:
  - spreedly
  - payments
  - gateway
related:
  - "[[ePages]]"
  - "[[ePages Spreedly Migration]]"
  - "[[epages-spreedly-migration-dashboard]]"
  - "[[epages-spreedly-dashboard-conversation]]"
---

# Spreedly

Payment gateway / vault service. ePages used Spreedly as the payment processing layer for its shops. As of 2026, ePages is actively migrating shops off Spreedly ahead of a shutdown deadline.

## Context in ePages

- Shops are classified as `provider: spreedly` if the `payment` CSV field contains "spreedly"
- Shops still on Spreedly = the remaining migration workload
- Sleeper shops (last login before 2026) are on Spreedly but unlikely to migrate — excluded from the 100% completion target

## Sources

- [[epages-spreedly-migration-dashboard]]
