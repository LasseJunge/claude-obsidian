---
type: source
created: 2026-06-16
updated: 2026-06-16
title: "Unternehmensweites Dashboard-Setup"
date: 2026-06-02
source_file: ".raw/Claude-Unternehmensweites Dashboard-Setup.md"
tags:
  - epages
  - dashboard
  - hosting
  - infrastructure
  - vpn
status: processed
related:
  - "[[wiki/sources/epages-spreedly-migration-dashboard.md]]"
  - "[[wiki/concepts/ePages Spreedly Migration.md]]"
  - "[[wiki/concepts/Company-Wide Dashboard Hosting.md]]"
---

# Unternehmensweites Dashboard-Setup

**Source:** Claude conversation, 2026-06-02  
**Topic:** Selecting a hosting strategy for a company-wide, self-built HTML/JS/CSS dashboard with API data ingestion

## Summary

The conversation explores hosting options for a custom-built HTML/JS/CSS dashboard intended for company-wide use at ePages (or a related context). Key constraints emerged progressively:

- Dashboard is **self-built** (HTML, JavaScript, CSS)
- Data will be pushed via **API** (not static)
- Team works **remotely** but has a **dedicated always-on server**
- Goal: make the dashboard accessible to all employees

## Hosting Options Discussed

### Static Hosting (ruled out for this use case)
- **Vercel**, **Netlify**, **GitHub Pages** — suitable for static sites, but insufficient once API data ingestion is required.

### Full-Stack Hosting
- **Railway / Render** — good for combined frontend + backend; simpler than AWS.
- **AWS (EC2 + RDS/ECS)** — maximum scalability, recommended for high data loads.
- **Supabase** — mentioned as a backend/API option when pairing with static frontend hosting.

### Recommended Solution: Own Server + VPN
Given the existing always-on server and remote workforce, the recommended architecture was:
- **Nginx or Apache** to serve the HTML/JS/CSS frontend
- **Node.js or Python** for the API layer
- **WireGuard** (preferred) or **OpenVPN** for remote employee access
- All data stays on-premises (GDPR/privacy benefit)

## Key Decisions / Constraints
| Factor | Value |
|--------|-------|
| Frontend tech | HTML / JavaScript / CSS |
| Data delivery | API push |
| Workforce | Remote + on-site |
| Infrastructure | Dedicated always-on server |
| Hosting preference | Self-hosted with VPN |

## Connections
- [[wiki/concepts/Company-Wide Dashboard Hosting.md]] — concept page for the hosting pattern
- [[wiki/sources/epages-spreedly-migration-dashboard.md]] — related dashboard project (Spreedly→Stripe migration)
- [[wiki/entities/ePages.md]] — parent company context
