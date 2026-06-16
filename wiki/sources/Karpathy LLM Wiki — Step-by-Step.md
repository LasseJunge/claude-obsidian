---
type: source
title: "Step-by-Step Guide: Build Your Own AI Second Brain with Obsidian and Karpathy's LLM Wiki Pattern"
aliases:
  - "Karpathy LLM Wiki Pattern"
  - "karpathy-llm-wiki-step-by-step"
created: 2026-06-09
updated: 2026-06-09
source_type: blog
author: The Tool Nerd
date_published: 2026
url: https://www.thetoolnerd.com/p/step-by-step-guide-build-your-own-second-brain-obsidian-kaparthy
confidence: high
tags:
  - karpathy
  - llm-wiki
  - obsidian
  - second-brain
key_claims:
  - "raw/ bleibt unveränderlich; wiki/ ist die KI-gepflegte Syntheseschicht"
  - "Obsidian Web Clipper → raw/ → Agent → wiki/ ist der Standard-Workflow"
  - "Das Wiki ist ein persistentes, compounding Artefakt — Querverweise sind bereits vorhanden"
  - "Jede neue Quelle updated mehrere verknüpfte Seiten gleichzeitig"
related:
  - "[[LLM Wiki Pattern]]"
  - "[[Andrej Karpathy]]"
  - "[[Compounding Knowledge]]"
---

# Karpathy LLM Wiki — Step-by-Step

## Das Muster

Statt das LLM bei jeder Frage rohe Dateien neu durchsuchen zu lassen, lässt man es eine persistente Wiki pflegen, die sich mit jeder neuen Quelle verbessert.

## Schritt-für-Schritt Aufbau

1. **Obsidian Vault anlegen** — klarer Name, z.B. `mein-zweites-hirn`
2. **In Claude Code öffnen** — gibt dem Agenten Dateisystemzugriff
3. **Wiki-Struktur scaffolden** — `raw/`, `wiki/`, `CLAUDE.md`, `index.md`, `log.md`
4. **Obsidian Web Clipper installieren** — Artikel → `raw/articles/`
5. **Ingest-Befehl ausführen** — Agent liest Quelle, updated bestehende Seiten, erstellt neue
6. **Wiki abfragen** — Synthesefragen an organisierten Seiten statt rohen Dateien
7. **Lint ausführen** — regelmäßige Wartung: broken links, Duplikate, veraltete Infos

## Warum es automatisch klüger wird

Separation of Concerns ist der Schlüssel: Rohmaterial bleibt unberührt, das Modell pflegt eine persistente Syntheseschicht. Jede neue Quelle updated mehrere verknüpfte Seiten gleichzeitig statt nur einmal verarbeitet zu werden. Index und Log tracken was existiert und was sich geändert hat — der Agent arbeitet aus organisiertem Kontext statt Beziehungen von Grund auf neu zu berechnen.
