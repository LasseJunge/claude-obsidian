---
name: ponytail-help
description: "Show ponytail commands, intensity levels, and usage. Triggers on: ponytail help, /ponytail-help."
allowed-tools: Read
---

# ponytail-help

Show available ponytail commands and how to use them.

## Commands

| Command | What it does |
|---------|-------------|
| `/ponytail` | Activate lazy senior dev mode (full intensity by default) |
| `/ponytail lite` | Show what's asked + name a simpler path |
| `/ponytail ultra` | YAGNI extremist — challenge requirements first |
| `/ponytail off` | Deactivate |
| `/ponytail-review` | Review current diff for complexity |
| `/ponytail-audit` | Full repo audit for over-engineering |
| `/ponytail-debt` | List all `ponytail:` deferred shortcuts |
| `/ponytail-help` | This help |

## Configuration

Set default intensity via `PONYTAIL_DEFAULT_MODE=lite|full|ultra` or `~/.config/ponytail/config.json`.

## Philosophy

The decision ladder: skip → stdlib → native → installed dep → one-liner → minimum working code.
