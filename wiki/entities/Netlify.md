---
type: entity
title: "Netlify"
created: 2026-06-09
tags:
  - hosting
  - infrastructure
  - epages
status: current
related:
  - "[[Supabase]]"
  - "[[ePages]]"
  - "[[epages-spreedly-migration-dashboard]]"
  - "[[supabase-netlify-debug]]"
  - "[[Company-Wide Dashboard Hosting]]"
---

# Netlify

Cloud platform for hosting static sites and serverless functions. Used by ePages as the deployment target for their internal migration and trial conversion dashboards.

## Usage at ePages

- Hosts the Spreedly migration dashboard (HTML/JS/CSS + Supabase backend)
- Hosts the trial conversion dashboard
- Earlier deployment choice before the move to self-hosted + WireGuard VPN for company-wide access

## Supabase Integration Issue

When deploying a Supabase-backed dashboard on Netlify, credentials are injected via window globals in `index.html`:

```html
<script>
  window.SUPABASE_URL = 'YOUR_SUPABASE_URL';
  window.SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
</script>
```

Leaving placeholder strings caused **silent auth failures** — the Supabase client initialised without error but all requests were rejected. See [[supabase-netlify-debug]] for the debugging session.

**Important**: the anon key is publicly visible in the page source on Netlify. Row-Level Security (RLS) policies in Supabase are **required** to prevent unauthorised data access.

## Related

- [[Supabase]] — backend paired with Netlify for ePages dashboards
- [[supabase-netlify-debug]] — debugging session for the credential injection issue
