---
type: concept
title: "Durable Agent Sessions"
address: c-000050
aliases:
  - "persistent agent sessions"
created: 2026-06-24
updated: 2026-06-24
tags:
  - concept
  - agent-infrastructure
  - ai-agents
related:
  - "[[Brain-Hands Agent Architecture]]"
  - "[[Aquifer Agent Platform]]"
  - "[[Under the River — Shopify Agent Platform]]"
---

# Durable Agent Sessions

Treating an agent conversation as a **durable, persistent object** rather than an in-memory loop.

In Shopify's [[Aquifer Agent Platform]]:
- A **Session** is a durable identity backed by Postgres, stored as an append-only event log.
- The runtime (Session Cells — ephemeral Go processes) can exit when idle and restart on a fresh host, reconstructing state from Postgres so the conversation continues seamlessly.

This is what lets a chat agent live in a channel for days/weeks, survive deploys and crashes, and remain a stable participant. [[OpenClaw]] persists transcripts on disk under `~/.openclaw/agents/`; the Gateway is its source of truth for sessions. Complements [[Brain-Hands Agent Architecture]].
