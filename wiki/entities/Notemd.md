---
type: entity
title: "Notemd"
created: 2026-06-09
updated: 2026-06-09
tags:
  - obsidian-plugin
  - llm
  - wiki-links
  - auto-linking
status: current
related:
  - "[[LLM Wiki Pattern]]"
  - "[[Zweites Hirn Aufbau Stack]]"
  - "[[wiki/sources/notemd-plugin]]"
---

# Notemd

Obsidian-Plugin, das per LLM-Integration automatisch `[[wiki-links]]` f�r Schl�sselkonzepte in bestehenden Notizen generiert und die entsprechenden Konzeptseiten anlegt.

## Kernf�higkeiten

- **Auto-Linking**: Liest Notizen, identifiziert Konzepte, f�gt `[[wiki-links]]` ein
- **Batch-Generierung**: Erstellt Konzeptseiten f�r alle verlinkten Titel in einem Durchgang
- **Web Research**: Sucht via Tavily/DuckDuckGo, fasst per LLM zusammen
- **MCP Server**: `notemd-mcp` macht Kernf�higkeiten au�erhalb von Obsidian verf�gbar

## LLM-Support

OpenAI, Anthropic, Ollama, LMStudio, Gemini, Qwen, Groq, Perplexity und viele weitere.

## Relevanz f�r das LLM Wiki Pattern

Notemd erg�nzt den Karpathy-Ansatz auf der Link-Ebene: W�hrend Claude Code die Synthese �bernimmt, automatisiert Notemd das nachtr�gliche Verlinken von Konzepten in bereits bestehenden Notizen.

GitHub: https://github.com/Jacobinwwey/obsidian-NotEMD
