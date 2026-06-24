---
type: concept
title: "Brain-Hands Agent Architecture"
address: c-000049
aliases:
  - "brain hands split"
  - "decoupled agent execution"
created: 2026-06-24
updated: 2026-06-24
tags:
  - concept
  - agent-infrastructure
  - ai-agents
related:
  - "[[Aquifer Agent Platform]]"
  - "[[Durable Agent Sessions]]"
  - "[[Under the River — Shopify Agent Platform]]"
---

# Brain-Hands Agent Architecture

Design principle (from Shopify's [[Aquifer Agent Platform]]) of decoupling an agent's **brain** from its **hands**:

- **Brain** — the decision-making loop: model + harness. Disposable. Reads history, calls the model, emits tool intents.
- **Hands** — the execution environment: an ephemeral sandbox (filesystem, shell, repo) where tool intents actually run.

Why it matters: the brain can be swapped, restarted, or rescheduled without losing work, and the dangerous part (execution) is isolated and disposable. [[OpenClaw]] applies a similar idea with Docker-sandboxed tool execution per agent, though scoped to a single operator. Pairs with [[Durable Agent Sessions]] for continuity.
