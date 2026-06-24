---
type: concept
title: "Chat-Native AI Agents"
address: c-000051
aliases:
  - "chat native agents"
  - "channel based agents"
created: 2026-06-24
updated: 2026-06-24
tags:
  - concept
  - ai-agents
  - chat-native-agents
related:
  - "[[Under the River — Shopify Agent Platform]]"
  - "[[OpenClaw — Self-Hosted Chat-to-Agent Gateway]]"
  - "[[Aquifer Agent Platform]]"
  - "[[Single-Operator Trust Boundary]]"
---

# Chat-Native AI Agents

AI agents that live inside a team chat surface (Slack, Mattermost, Discord) as first-class participants, rather than behind a separate web UI. The chat channel becomes the interface, the audit log, and the collaboration space.

## Two reference points
- **[[Aquifer Agent Platform]] / River (Shopify)** — enterprise-scale, multiplayer/public-by-default, durable sessions, sandbox-per-task. Designed for thousands of users across thousands of channels.
- **[[OpenClaw]]** — lightweight, self-hosted, single-operator. Easy to stand up against Mattermost; powerful per-user automation; not a multi-tenant security boundary ([[Single-Operator Trust Boundary]]).

## Use-case space (ePages / company context)
Drawn from the user's brainstorm — a Mattermost agent with knowledge + ticketing access:
- **Engineering**: Jira triage from threads, stand-up rollups, sprint/retro data pulls, "where is this documented?", incident companion + post-mortem drafts.
- **Support**: tier-1 deflection from the wiki, escalation-to-bug drafting, knowledge-gap detection.
- **Product**: feedback clustering, PRD skeletons, release notes from closed tickets.
- **Ops/People**: onboarding buddy, policy lookups, meeting prep.
- **Cross-cutting**: scheduled digests, permission-aware answering, action-taking (transition tickets, edit pages) not just answering.

## Design decisions that dominate feasibility
1. Read-only vs. write-enabled (guardrails + audit trail for writes).
2. **Permission propagation** — bot-identity (sees all) vs. scoped-to-asker. The #1 governance question for Atlassian data.
3. Data residency / privacy — ePages is EU-based; where does the model run and prompt data go?

See [[Open Questions and Blockers]] for the OpenClaw-fit caveats.
