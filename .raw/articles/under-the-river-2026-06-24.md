---
source_url: https://shopify.engineering/under-the-river
fetched: 2026-06-24
related_urls:
  - https://shopify.engineering/what-is-nix
  - https://x.com/tobi/status/2053121182044451016
  - https://emergencemagazine.org/conversation/is-a-river-alive/
---

# Under the River (Shopify Engineering, 2026-05-28)

Authors: Javier Moreno, River, Burke Libbey. Tags: Infrastructure, Developer Tooling.

## River (AI agent)
AI coding assistant operating inside Slack channels. Participates in public conversations, reads code, runs tests, opens PRs, queries data warehouses, reviews production traces. "One in eight merged pull requests across Shopify is coauthored by it."

## Aquifer (platform)
Shopify's internal platform for running AI agents. Separates the agent's decision-making "brain" (model/harness) from the execution "hands" (sandbox).

## World (monorepo)
Shopify consolidated into a single repo in Spring 2024 — code plus knowledge artifacts (skills, runbooks, agent guidelines). Foundational for agent navigation.

## Nix
Reproducible environment tool across dev, CI/CD, and production.

## Architecture
Core principles: decouple brain from hands; treat agent sessions as durable persistent objects; design for multiplayer/public by default.
- Session: durable identity backed by Postgres; append-only event log.
- Harness: disposable agent loop; reads history, calls model, emits tool intents.
- Sandbox: ephemeral execution environment (filesystem, shell, repo).
- Session Cells: ephemeral Go-runtime processes; exit when idle, restart on fresh hosts while preserving continuity via Postgres state.
- Agent Profiles: bundles of system prompts/skills/sandbox policies over shared substrate. Modes: Interactive (River), Automation (headless/triggered), Job/Batch (ephemeral CI).

## Metrics (30 days)
59,918 River sessions; 5,170 Slack channels; 7,000+ employees engaged; 3,536 River-coauthored PRs merged.

## Thesis
"Code is going to be increasingly written with AI, and our infrastructure needs to be the substrate for that." Drove the 2024 monorepo + Nix bets.

## Related links
- Shopify Engineering — What is Nix? https://shopify.engineering/what-is-nix
- Tobi Lütke on X — Learning on the Shop floor
- Anthropic essay — Scaling Managed Agents (April 2026)
- Robert Macfarlane, *Is a River Alive?* + Emergence Magazine interview
