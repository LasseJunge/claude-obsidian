---
type: concept
title: "Single-Operator Trust Boundary"
address: c-000054
aliases:
  - "single user agent security"
  - "personal-assistant trust model"
created: 2026-06-24
updated: 2026-06-24
url: https://docs.openclaw.ai/gateway/security
tags:
  - concept
  - security
  - ai-agents
related:
  - "[[OpenClaw]]"
  - "[[Chat-Native AI Agents]]"
  - "[[OpenClaw — Self-Hosted Chat-to-Agent Gateway]]"
---

# Single-Operator Trust Boundary

[[OpenClaw]]'s explicit security posture: **one trusted operator per gateway** (single-user, personal-assistant model). It deliberately does **not** provide hostile multi-tenant isolation on shared infrastructure.

## What it provides
- Gateway auth required by default (token/password).
- DM **pairing** (codes expire 1h) or allowlists before processing.
- Docker sandbox per agent; workspace access none/read-only/read-write; cross-agent access blocked by default.
- Root-bounded file access (`@openclaw/fs-safe`); state dir 700; segregated credentials; default log redaction.

## What it is explicitly NOT a boundary against
- Prompt injection alone (without policy/auth bypass).
- A single shared gateway used by mutually adversarial users — the guidance is to split by OS user / host instead.
- Session keys treated as per-user auth tokens (`sessionKey` selects context, not authorization).
- Node pairing metadata as a hidden approval layer.

> [!gap] Implication for a company-wide Mattermost deployment
> A multi-user company Mattermost bot is exactly the multi-tenant case OpenClaw says it does not isolate. Either (a) restrict to a small trusted group on one gateway, (b) run per-team/per-user gateways, or (c) adopt a platform built for multiplayer like [[Aquifer Agent Platform]]. Tracked in [[Open Questions and Blockers]].
