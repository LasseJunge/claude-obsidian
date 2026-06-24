---
type: concept
title: "Nix"
address: c-000053
aliases:
  - "nix package manager"
created: 2026-06-24
updated: 2026-06-24
url: https://shopify.engineering/what-is-nix
tags:
  - concept
  - developer-tooling
  - reproducibility
related:
  - "[[Aquifer Agent Platform]]"
  - "[[Shopify]]"
  - "[[Under the River — Shopify Agent Platform]]"
---

# Nix

Package manager and build system that makes software dependencies **explicit** — it turns the implicit dependency graph of a machine into an explicit, content-addressed one.

## Building blocks
1. **Nix Store** (`/nix/store`) — immutable, content-addressed artifact graph.
2. **Derivations** — recipes describing how to build store outputs.
3. **Sandboxing** — builds see only explicitly declared dependencies.
4. **Nix language** — lazy, side-effect-free, for writing derivations.

## Why it matters here
Reproducible, deterministic environments across dev / CI/CD / production are a precondition for running fleets of AI agents safely — an agent's "hands" need an environment that behaves identically everywhere. One of the two 2024 bets (with the World monorepo) that made [[Aquifer Agent Platform]] possible.
