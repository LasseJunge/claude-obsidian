---
type: entity
entity-type: product
title: "Supabase"
created: 2026-06-09
updated: 2026-06-09
status: current
tags:
  - supabase
  - backend
  - auth
  - postgres
  - storage
related:
  - "[[Netlify]]"
  - "[[ePages Spreedly Migration]]"
  - "[[epages-spreedly-migration-dashboard]]"
  - "[[supabase-netlify-debug]]"
---

# Supabase

Open-source Firebase alternative providing Postgres, authentication, storage, and realtime over a managed cloud platform. Used as the backend for the ePages Spreedly migration dashboard.

## Role in ePages Dashboard

| Service | Usage |
|---------|-------|
| Auth | Email/password login gating the entire dashboard |
| Postgres | Tables: `config` (dates), `baseline` (shop count), `mappings` (shoptype + package rules) |
| Storage | `csv-imports/latest.csv` — the live shop data file |

## Credential Injection Pattern

The dashboard uses a window-global pattern to pass credentials from HTML to the bundled JS:

```html
<script>
  window.SUPABASE_URL = 'https://xxx.supabase.co';
  window.SUPABASE_KEY = 'eyJ...';
</script>
```

The anon key is publicly visible in page source. Supabase Row Level Security (RLS) policies are the primary defense against misuse of an exposed key.

## Security Considerations

- **anon key** is safe to expose *only* when RLS policies are properly configured
- Admin operations should use the service role key server-side only, never client-side
- RLS policies should restrict reads/writes to authenticated users at minimum

## Sources

- [[epages-spreedly-migration-dashboard]]
- [[supabase-netlify-debug]]
