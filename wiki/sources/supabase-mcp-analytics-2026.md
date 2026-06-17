---
type: source
created: 2026-06-16
updated: 2026-06-16
title: "Supabase MCP Server for Claude Code Analytics"
source_type: web research
date_published: 2026-06
url: https://supabase.com/docs/guides/ai-tools/mcp
confidence: high
key_claims:
  - Supabase has an official MCP server connecting Claude directly to Supabase projects
  - Includes get_logs tool (api, postgres, edge functions, auth, storage, realtime)
  - Natural-language SQL queries work against real DB with RLS-respecting security
  - Append ?read_only=true on production databases to prevent write operations
related:
  - "[[Supabase]]"
  - "[[Research- Data Analytics Skills and Plugins]]"
---

# Supabase MCP Server (2026)

Official MCP server from Supabase connecting AI assistants directly to Supabase projects.

## Key capabilities

- `get_logs`: retrieve analytics logs by service type (api, postgres, edge functions, auth, storage, realtime)
- Natural-language SQL: ask "How many shops migrated in the last 7 days?" and Claude runs it against the real DB
- Full schema context: Claude sees table structure, can generate migrations, suggest query optimizations
- Security: `?read_only=true` param locks Claude to a restricted PostgreSQL user with no write access

## Integration with Claude Code

Add to `.claude/settings.json` under `mcpServers`. Once connected, Claude Code can directly query and analyze Supabase data without building any frontend UI first.

## Relevance to ePages work

Direct replacement for manual CSV exports: Claude can query the migration dashboard DB, calculate `(baseline - still_on_spreedly) / baseline` live, and surface survivorship-bias-safe cohort slices directly from Postgres.

Sources: [Supabase MCP Docs](https://supabase.com/docs/guides/ai-tools/mcp) | [Supabase MCP Blog](https://supabase.com/blog/mcp-server)
