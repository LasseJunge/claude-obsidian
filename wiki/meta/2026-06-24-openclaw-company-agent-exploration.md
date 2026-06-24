---
type: session
title: "OpenClaw Company Agent — Use Cases + Alternatives Exploration"
created: 2026-06-24
updated: 2026-06-24
tags:
  - session
  - ai-agents
  - chat-native-agents
  - mattermost
  - atlassian
  - enterprise-search
status: developing
related:
  - "[[Chat-Native AI Agents]]"
  - "[[Chat-Native Agent Tools — OpenClaw vs Alternatives]]"
  - "[[OpenClaw]]"
  - "[[OpenClaw — Self-Hosted Chat-to-Agent Gateway]]"
  - "[[Mattermost]]"
  - "[[Single-Operator Trust Boundary]]"
  - "[[Aquifer Agent Platform]]"
  - "[[Under the River — Shopify Agent Platform]]"
  - "[[Open Questions and Blockers]]"
  - "[[ePages]]"
sources:
  - "[[.raw/articles/openclaw-2026-06-24.md]]"
  - "[[.raw/articles/under-the-river-2026-06-24.md]]"
---

# OpenClaw Company Agent — Use Cases + Alternatives Exploration

Evaluation of a colleague's idea: integrate [[OpenClaw]] company-wide at [[ePages]], chat to it on [[Mattermost]], give it Rovo + Atlassian access. Output: a use-case map, two hard caveats, and a tool shortlist with a recommendation.

## The idea, assessed
The chat surface is the easy part. The hard part is the *substrate*: permission-aware knowledge access, durable sessions, and safe execution. Two caveats reshape the original plan:

1. **OpenClaw is built single-operator.** Its [[Single-Operator Trust Boundary]] docs state "one trusted operator boundary per gateway" and explicitly disclaim hostile multi-tenant isolation. Multi-agent routing *does* allow several isolated agents + channel accounts on one Gateway (fine for a trusted internal team), but it is not a security boundary between mutually-distrusting users. A company-wide bot is exactly that case.
2. **No native Rovo/Atlassian connector.** Not in core, not on ClawHub (which has Gmail/Slack/Notion/GitHub/Linear/Google Workspace but no Jira/Confluence skill). Plugins *can* register tools and call external services, so it is buildable — but undocumented and on you.

## What's possible — three capability layers
- **Layer 1 — Knowledge answering (easy, high ROI):** cited answers from Confluence/Jira/wiki/code in a Mattermost channel. Onboarding buddy, "where is this documented?", policy lookups. Directly solves the recurring "Claude has no Confluence access" blocker.
- **Layer 2 — Knowledge → action (medium):** thread → well-formed Jira issue; stand-up rollups; release notes from closed tickets; PRD skeletons; weekly digests.
- **Layer 3 — Autonomous coding agents (hard):** read code, run tests, open PRs. Shopify's River does this for ~1 in 8 merged PRs, but only on the [[Aquifer Agent Platform]] substrate (durable sessions, brain/hands sandboxing, navigable monorepo, Nix-reproducible envs). A platform investment, not a plugin.

## Three decisions that dominate feasibility
1. Read-only vs write-enabled (writes need audit trail + guardrails).
2. **Permission propagation** — bot sees everything vs scoped to the asking user. The #1 governance question for Atlassian data; OpenClaw's weakest point.
3. EU data residency — where the model runs and where prompt/transcript data goes (ePages is EU-based).

Tracked in [[Open Questions and Blockers]] (OpenClaw evaluation section).

## Alternatives (full table: [[Chat-Native Agent Tools — OpenClaw vs Alternatives]])
- **Onyx** — OSS (MIT), self-host + air-gapped, local LLM, native Jira + Confluence, **permission inheritance**. Best fit for EU + Atlassian + self-host. (Mattermost extensible, not listed.)
- **Falconer** — native full agent *inside* Mattermost, on-prem/air-gapped, Confluence DC (Jira not listed). Closest Mattermost-native drop-in.
- **Dust** — OSS core, EU data residency, Jira + Confluence, action-oriented agents ($29/user/mo).
- **Atlassian Rovo** — nearly free if already on Atlassian; first-class Jira/Confluence understanding; but Slack-only (no Mattermost) and Cloud-only.
- **Glean** — most mature, proprietary, ~$50+/user/mo + ~$50–60k/yr min. Likely overkill.

## Recommendation
OpenClaw is the wrong default for a company knowledge bot; it shines as a power-user / small-trusted-team automation cockpit. For the stated goal:
- **Primary candidate: Onyx** (OSS, EU self-host, Atlassian, permission-aware).
- **Mattermost-native contender: Falconer.**
- **If action-taking agents matter: Dust.**
- Since ePages pays Atlassian anyway, **Rovo** is the cheapest path to pure Jira/Confluence Q&A — possibly run Rovo inside Atlassian + a self-hosted agent on Mattermost.

Next step offered: a deeper Onyx vs Falconer vs Dust evaluation against ePages' Mattermost + Atlassian (Cloud/DC) + EU constraints, with a recommended pilot scope.
