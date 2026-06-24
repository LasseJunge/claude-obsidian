---
type: source
title: "Under the River — Shopify's Aquifer AI Agent Platform"
address: c-000043
aliases:
  - "Under the River"
  - "Shopify River agent"
  - "Aquifer"
created: 2026-06-24
updated: 2026-06-24
source_type: blog
author: "Javier Moreno, River, Burke Libbey"
date_published: 2026-05-28
url: https://shopify.engineering/under-the-river
confidence: high
tags:
  - ai-agents
  - chat-native-agents
  - agent-infrastructure
  - shopify
key_claims:
  - "One in eight merged PRs across Shopify is coauthored by River, its Slack-native AI agent"
  - "Aquifer separates the agent 'brain' (model/harness) from the 'hands' (sandbox execution)"
  - "Agent sessions are durable, Postgres-backed, append-only event logs that survive host restarts"
  - "Agents are designed for multiplayer/public chat interaction by default, not 1:1 private use"
related:
  - "[[Shopify]]"
  - "[[Aquifer Agent Platform]]"
  - "[[Brain-Hands Agent Architecture]]"
  - "[[Durable Agent Sessions]]"
  - "[[Chat-Native AI Agents]]"
  - "[[Nix]]"
---

# Under the River — Shopify's Aquifer AI Agent Platform

Shopify Engineering, 2026-05-28. How Shopify runs **River**, a Slack-native AI coding agent, on its internal **Aquifer** platform.

## What River does
River lives in Slack channels and participates in public conversations: reads code, runs tests, opens PRs, queries the data warehouse, reviews production traces. Headline metric: **one in eight merged PRs across Shopify is coauthored by it**.

30-day usage: 59,918 sessions · 5,170 Slack channels · 7,000+ employees · 3,536 merged River-coauthored PRs.

## Architecture (Aquifer)
See [[Brain-Hands Agent Architecture]] and [[Durable Agent Sessions]].
- **Session** — durable identity, Postgres-backed, append-only event log.
- **Harness** — disposable agent loop; reads history, calls model, emits tool intents.
- **Sandbox** — ephemeral execution env (filesystem, shell, repo).
- **Session Cells** — ephemeral Go processes; exit when idle, restart on fresh hosts while preserving continuity via Postgres.
- **Agent Profiles** — bundles of prompts/skills/sandbox policies. Modes: Interactive (River), Automation (headless), Job/Batch (CI).

## Enabling bets (2024)
- **World** — consolidating into a single monorepo (code + skills + runbooks + agent guidelines) so agents can navigate.
- **[[Nix]]** — reproducible environments across dev, CI/CD, production.

Thesis: "Code is going to be increasingly written with AI, and our infrastructure needs to be the substrate for that."

> [!key-insight] The real lesson for ePages
> The hard part of a useful company chat-agent isn't the chat integration — it's the *substrate*: a navigable knowledge monorepo, reproducible execution environments, durable sessions, and public/multiplayer design. Contrast with [[OpenClaw]], which nails the chat surface but is explicitly a **single-operator** tool. See [[Chat-Native AI Agents]].

## Related links
- [[Nix]] — https://shopify.engineering/what-is-nix
- Anthropic — Scaling Managed Agents (April 2026)
- Robert Macfarlane, *Is a River Alive?* (naming origin)
