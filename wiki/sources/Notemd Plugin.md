---
type: source
title: "Notemd — Obsidian Plugin für automatische Wiki-Links & Konzeptseiten"
aliases:
  - "notemd-plugin"
  - "wiki-links"
created: 2026-06-09
updated: 2026-06-09
source_type: github
author: Jacobinwwey
date_published: 2026
url: https://github.com/Jacobinwwey/obsidian-NotEMD
confidence: high
tags:
  - obsidian-plugin
  - auto-linking
  - llm
  - wiki-links
key_claims:
  - "Generiert automatisch [[wiki-links]] für Schlüsselkonzepte in bestehenden Notizen"
  - "Erstellt automatisch entsprechende Konzeptseiten"
  - "One-Click Workflow: Process → Batch Generate → Mermaid Fix"
  - "Web Research via Tavily oder DuckDuckGo, zusammengefasst per LLM"
  - "Unterstützt OpenAI, Anthropic, Ollama, LMStudio und viele weitere Provider"
related:
  - "[[Notemd]]"
  - "[[LLM Wiki Pattern]]"
---

# Notemd Plugin

## Kernfunktion

Notemd liest bestehende Notizen und fügt automatisch `\[\[wiki-links\]\]` für erkannte Schlüsselkonzepte ein. Gleichzeitig werden die entsprechenden Konzeptseiten im Vault angelegt — ohne manuelle Arbeit.

## One-Click Workflow

1. Notiz öffnen
2. "Process File (Add Links)" klicken
3. Plugin: identifiziert Konzepte → fügt Links ein → erstellt Konzeptseiten

Default-Workflow-Button: `Process File → Batch Generate from Titles → Batch Mermaid Fix`

## Web Research Integration

- Suche via Tavily (API) oder DuckDuckGo (kostenlos)
- Suchergebnisse werden per LLM zusammengefasst und als Kontext eingebettet

## Notemd MCP Server

Ein separates Projekt (`notemd-mcp`) stellt die Kernfunktionen als MCP-Server bereit — damit sind die Fähigkeiten auch außerhalb von Obsidian nutzbar, z.B. in Claude Code Workflows.
