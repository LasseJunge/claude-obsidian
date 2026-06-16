---
type: concept
title: "Company-Wide Dashboard Hosting"
created: 2026-06-09
tags:
  - epages
  - infrastructure
  - dashboard
  - hosting
status: current
related:
  - "[[ePages]]"
  - "[[epages-company-dashboard-setup]]"
  - "[[Netlify]]"
  - "[[Supabase]]"
---

# Company-Wide Dashboard Hosting

Architecture pattern for making an internal HTML/JS/CSS dashboard accessible to all employees without exposing it to the public internet.

## ePages Decision

ePages chose a **self-hosted server + WireGuard VPN** architecture for their company-wide dashboard.

**Rejected alternatives:**
- Vercel — managed hosting, data leaves the building
- Railway — similar cloud managed option

**Reason for choice:** data sovereignty. Internal shop and migration data stays on company-controlled infrastructure.

## Architecture

```
Employee device
  └── WireGuard VPN tunnel
        └── Internal server
              └── Dashboard (static HTML/JS/CSS)
                    └── Supabase (auth + data)
```

VPN access is a prerequisite for viewing the dashboard — this acts as the first authentication layer, before Supabase email/password auth.

## Trade-offs

| | Self-hosted + VPN | Managed (Vercel/Railway) |
|---|---|---|
| Data sovereignty | Full control | Data on third-party infra |
| Setup complexity | Higher | Low |
| Maintenance | Team owns infra | Provider handles |
| Cost at scale | Server cost | Usage-based pricing |
| Access control | VPN membership | Auth rules |

## Related

- [[epages-company-dashboard-setup]] — source conversation
- [[Netlify]] — used for earlier, externally-accessible dashboard versions
- [[Supabase]] — backend for auth and data storage
