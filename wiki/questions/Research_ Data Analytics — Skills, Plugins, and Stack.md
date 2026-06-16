---
type: synthesis
title: "Research: Data Analytics — Skills, Plugins, and Stack"
created: 2026-06-10
updated: 2026-06-10
tags:
  - research
  - data-analytics
  - plugins
  - dashboard
status: developing
related:
  - "[[Data Analytics Stack 2026]]"
  - "[[Churn Dashboard]]"
  - "[[Trial Conversion Dashboard]]"
  - "[[ePages Spreedly Migration]]"
  - "[[Supabase]]"
  - "[[Research- Claude Dashboard Best Practices und Kritik]]"
sources:
  - "[[supabase-mcp-analytics-2026]]"
  - "[[claude-code-data-analytics-plugins-2026]]"
  - "[[open-source-bi-tools-2026]]"
---

# Research: Data Analytics — Skills, Plugins, and Stack

## Overview

3 research rounds, 7 sources fetched, 4 pages created. Focus: what skills and plugins are most useful for the data analytics work being done in this vault (ePages dashboards, claude-obsidian, migration tracking).

## Key Findings

### 1. The approved stack is exactly right (high confidence)

React 18 + Vite + Recharts + Tailwind + shadcn/ui + Supabase + Netlify is the 2026 standard. Create React App was deprecated February 2025. TanStack Query replaced React Query as the server state standard. No changes needed to the [[Research- Claude Dashboard Best Practices und Kritik]] stack recommendations. (Source: [[claude-code-data-analytics-plugins-2026]])

### 2. Supabase MCP is the missing piece for analytics work (high confidence)

The official `@supabase/mcp` server lets Claude Code query the Supabase Postgres database directly using natural language. Add `?read_only=true` for production safety. This means: instead of rebuilding the ePages migration dashboard UI every time a metric needs changing, Claude can answer "how many shops are still on Spreedly?" live from the DB. (Source: [[supabase-mcp-analytics-2026]])

### 3. This vault already ships 8 data analytics skills (high confidence)

The `data:` skill group is already available: `data:analyze`, `data:build-dashboard`, `data:create-viz`, `data:explore-data`, `data:sql-queries`, `data:statistical-analysis`, `data:validate-data`, `data:write-query`. These cover EDA through full dashboard scaffolding. No external plugin needed for most analytics tasks. (Source: [[claude-code-data-analytics-plugins-2026]])

### 4. Metabase solves the churn dashboard question (high confidence)

The open question "Looker/Power BI TBD" for the churn dashboard has a clear answer: Metabase. It is free for self-hosted, connects to Supabase via standard PostgreSQL connection in minutes, requires no SQL for basic reporting, and respects the data-sovereignty preference (WireGuard + self-hosted). Looker and Power BI are neither open-source nor self-hostable. (Source: [[open-source-bi-tools-2026]])

### 5. Obsidian Dataview is vault-internal analytics only (high confidence)

Dataview is powerful for tracking wiki stats, project dashboards, and task views within the vault. It does NOT replace production BI tooling. Does not render on Obsidian Publish. Obsidian Bases (2025 native feature) adds scatter/line/bar charts from note metadata — complementary.

## Key Entities

- [[Supabase]] — database + auth + MCP server; official MCP is production-ready with read_only mode
- [[Metabase]] — recommended self-hosted BI for churn dashboard; connects to Supabase Postgres directly
- Recharts — chart standard for React; better Claude codegen than Chart.js
- TanStack Query/Table — 2026 standards for server state and data tables in React

## Key Concepts

- [[Data Analytics Stack 2026]] — full reference stack with AI-assisted analytics layer
- [[Survivorship Bias in SaaS Metrics]] — retain deleted records; already implemented in ePages dashboards
- Supabase MCP `?read_only=true` — safety flag for connecting Claude to production databases

## Contradictions

No major contradictions found. One clarification: the wiki previously listed "Looker/Power BI recommended" for churn dashboard. This research contradicts that: neither tool is self-hostable, which conflicts with the data-sovereignty decision in [[Company-Wide Dashboard Hosting]]. Metabase is the correct recommendation.

## Open Questions

- Has the Supabase MCP been added to `.claude/settings.json` for this project? If not, that's an actionable next step.
- Which version of Metabase (OSS vs Cloud) fits Wilfried/Karsten workflow?
- Does Obsidian Bases support querying external Supabase data, or only vault-internal metadata?

## Sources

- [[supabase-mcp-analytics-2026]]: Supabase official docs, June 2026
- [[claude-code-data-analytics-plugins-2026]]: claudecodeplugins.dev, June 2026
- [[open-source-bi-tools-2026]]: valiotti.com + Supabase docs, June 2026
