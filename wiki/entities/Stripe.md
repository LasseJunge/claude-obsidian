---
type: entity
entity-type: product
title: "Stripe"
created: 2026-06-09
updated: 2026-06-15
status: current
tags:
  - stripe
  - payments
  - gateway
related:
  - "[[ePages]]"
  - "[[Spreedly]]"
  - "[[ePages Spreedly Migration]]"
  - "[[epages-spreedly-migration-dashboard]]"
  - "[[Sage]]"
  - "[[PayPal]]"
  - "[[meeting-2026-06-15-with-Chris]]"
---

# Stripe

Payment processing platform. In the ePages context, Stripe is one possible destination for shops migrating off Spreedly — but it is **not** the required destination. The migration goal is to get all shops **off Spreedly**, regardless of which provider they move to.

## Role in ePages Migration

- Shops that move to Stripe are reflected in the `payment` CSV field as `SpreedlyStripe` or `SpreedlyStripePaymentIntents` (transitional subcategories)
- **These values still count as "on Spreedly"**: the CSV only contains shops that have not yet fully completed the migration. `SpreedlyStripe` and `SpreedlyStripePaymentIntents` are technical payment-method variants, not evidence of having left Spreedly.
- The dashboard tracks "left Spreedly" as the success metric, not "arrived at Stripe"
- Some shops move to other providers; some cancel; the dashboard shows all non-Spreedly shops as progress

## Sources

- [[epages-spreedly-dashboard-conversation]] — requirements conversation
- [[epages-spreedly-migration-dashboard]] — dashboard implementation
- [[epages-spreedly-stripe-dashboard-integration]] — iterative build session (CSV fixes, Supabase, Churn tab)
