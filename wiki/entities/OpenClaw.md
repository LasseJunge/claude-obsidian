---
type: entity
entity_type: product
title: "OpenClaw"
address: c-000045
aliases:
  - "openclaw"
created: 2026-06-24
updated: 2026-06-24
url: https://openclaw.ai/
repo: https://github.com/openclaw/openclaw
tags:
  - product
  - open-source
  - ai-agents
  - chat-native-agents
related:
  - "[[Peter Steinberger]]"
  - "[[Mattermost]]"
  - "[[OpenClaw — Self-Hosted Chat-to-Agent Gateway]]"
  - "[[Single-Operator Trust Boundary]]"
  - "[[Chat-Native AI Agents]]"
---

# OpenClaw

Open-source, self-hosted Gateway connecting chat apps (WhatsApp, Telegram, Discord, Slack, **Mattermost**, Matrix, Signal, iMessage) to AI coding agents. Created by [[Peter Steinberger]]. Node.js / pnpm; runs locally on Mac/Windows/Linux; backend-agnostic (Claude, GPT, etc.).

- **Architecture**: central Gateway = single source of truth for sessions, routing, channels.
- **Extensible** via ClawHub community skills; supports cron/autonomous tasks, browser control, file/shell access.
- **Trust model**: single operator per gateway — see [[Single-Operator Trust Boundary]]. Not built for hostile multi-tenant use.
- **No native Atlassian/Rovo connector** — would require a custom skill/MCP.

Full notes: [[OpenClaw — Self-Hosted Chat-to-Agent Gateway]]. Compare against Shopify's [[Aquifer Agent Platform]].
