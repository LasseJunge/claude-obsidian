---
type: source
title: "OpenClaw — Self-Hosted Chat-to-Agent Gateway"
address: c-000044
aliases:
  - "OpenClaw docs"
  - "OpenClaw Mattermost"
created: 2026-06-24
updated: 2026-06-24
source_type: docs
author: "Peter Steinberger (@steipete)"
date_published: 2026
url: https://openclaw.ai/
confidence: high
tags:
  - ai-agents
  - chat-native-agents
  - mattermost
  - self-hosted
  - open-source
key_claims:
  - "OpenClaw is a self-hosted Gateway connecting chat apps (incl. Mattermost) to AI coding agents"
  - "Security model is explicitly single-user: one trusted operator boundary per gateway, NOT multi-tenant isolation"
  - "Mattermost channel supports @mention/all/prefix modes, threading, allowlists, slash commands, streaming previews"
  - "Atlassian/Rovo access is NOT a built-in integration — it would require a custom skill/MCP"
related:
  - "[[OpenClaw]]"
  - "[[Peter Steinberger]]"
  - "[[Mattermost]]"
  - "[[Chat-Native AI Agents]]"
  - "[[Single-Operator Trust Boundary]]"
  - "[[Under the River — Shopify Agent Platform]]"
---

# OpenClaw — Self-Hosted Chat-to-Agent Gateway

Synthesizes openclaw.ai, docs.openclaw.ai (home, channels/mattermost, gateway/security, concepts/streaming). Open-source, by [[Peter Steinberger]]. Repo: github.com/openclaw/openclaw.

## What it is
A self-hosted **Gateway** that connects chat apps to AI coding agents. "The AI that actually does things." Node.js (pnpm); runs locally; supports Claude, GPT, and other backends. The Gateway is the single source of truth for sessions, routing, and channel connections, fanning out to agents, CLI, web UI, and mobile nodes.

## Channels
WhatsApp, Telegram, Discord, Slack, **Mattermost**, Matrix, Signal, iMessage, and more. See [[Mattermost]] for the integration specifics (bot token, chat modes, threading, allowlists, `oc_*` slash commands, streaming previews, reaction/button tools).

## Capabilities
Local execution (private by default), persistent memory, browser control, file/shell/script access (sandboxable), community skills via ClawHub, cron/autonomous background tasks.

## Security model
See [[Single-Operator Trust Boundary]]. Gateway auth required by default; Docker sandbox per agent; pairing for DMs. Crucially, it disclaims hostile multi-tenant isolation.

> [!contradiction] OpenClaw's design vs. the "company-wide Mattermost bot with Rovo/Atlassian" idea
> The user's premise (chat to it on Mattermost company-wide, with Rovo + Atlassian access) assumes a **multi-user enterprise** deployment. OpenClaw's documented security model is explicitly **single-user / one trusted operator per gateway** and "explicitly disclaims hostile multi-tenant isolation on shared infrastructure." It also has **no built-in Rovo/Atlassian integration** — that would be a custom skill/MCP. For a real company rollout the patterns in [[Under the River — Shopify Agent Platform]] (durable sessions, sandbox-per-agent, public/multiplayer by design, permission-scoped data access) are the relevant bar. Needs resolution — see [[Open Questions and Blockers]].

## Related links
- Docs: https://docs.openclaw.ai/ · Mattermost: /channels/mattermost · Security: /gateway/security · Streaming: /concepts/streaming
- ClawHub skills marketplace: https://clawhub.ai
