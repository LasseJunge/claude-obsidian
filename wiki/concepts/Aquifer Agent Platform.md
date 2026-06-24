---
type: concept
title: "Aquifer Agent Platform"
address: c-000052
aliases:
  - "Aquifer"
  - "Shopify River platform"
created: 2026-06-24
updated: 2026-06-24
tags:
  - concept
  - agent-infrastructure
  - shopify
related:
  - "[[Shopify]]"
  - "[[Brain-Hands Agent Architecture]]"
  - "[[Durable Agent Sessions]]"
  - "[[Chat-Native AI Agents]]"
  - "[[Nix]]"
  - "[[Under the River — Shopify Agent Platform]]"
---

# Aquifer Agent Platform

Shopify's internal platform for running AI agents (the substrate beneath the Slack agent **River**). See [[Under the River — Shopify Agent Platform]].

## Components
- **Session** — durable Postgres-backed identity, append-only event log ([[Durable Agent Sessions]]).
- **Harness** — disposable agent loop (brain) ([[Brain-Hands Agent Architecture]]).
- **Sandbox** — ephemeral execution env (hands).
- **Session Cells** — ephemeral Go processes; restart on fresh hosts without losing state.
- **Agent Profiles** — prompt/skill/sandbox-policy bundles. Modes: Interactive, Automation, Job/Batch.

## Enablers
- **World** monorepo — code + skills + runbooks, navigable by agents.
- **[[Nix]]** — reproducible environments across dev/CI/prod.

Design principles: brain/hands split, durable sessions, multiplayer/public by default. The architectural bar a serious company chat-agent (vs. a single-operator [[OpenClaw]]) has to clear.
