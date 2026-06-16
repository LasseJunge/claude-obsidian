---
type: concept
title: "Zweites Hirn Aufbau Stack"
aliases:
  - "Zweites Hirn Aufbau Stack"
created: 2026-06-09
updated: 2026-06-09
tags:
  - obsidian
  - second-brain
  - pkm
  - stack
  - llm
status: current
related:
  - "[[LLM Wiki Pattern]]"
  - "[[Compounding Knowledge]]"
  - "[[Hot Cache]]"
  - "[[Notemd]]"
  - "[[Andrej Karpathy]]"
---

# Zweites Hirn Aufbau Stack (2026)

Der empfohlene Stack für ein automatisch lernendes zweites Hirn in Obsidian kombiniert fünf Schichten.

## Stack-Übersicht

```
┌─────────────────────────────────────┐
│  CAPTURE          Obsidian Web Clipper│
│  (Artikel, Videos → raw/)            │
├─────────────────────────────────────┤
│  AGENT            Claude Code +      │
│  (Ingest, Synthese, Index update)    │
│                   claude-obsidian    │
├─────────────────────────────────────┤
│  AUTO-LINKING     Notemd Plugin      │
│  (Wiki-Links & Konzeptseiten)        │
├─────────────────────────────────────┤
│  LOCAL LLM        Local LLM Hub      │
│  (optional, RAG, private, offline)   │
├─────────────────────────────────────┤
│  WARTUNG          AI Librarian Agents│
│  (Audit, Synthese, Evergreen)        │
└─────────────────────────────────────┘
```

## Schicht 1: Capture

**Obsidian Web Clipper** ist 2026 der Standard-Capture-Layer. Ein Klick speichert:
- Artikel (vollständiger Text)
- YouTube-Transkripte
- PDFs

Alles landet in `raw/` — unveränderlich.

## Schicht 2: Agent (Kern des automatischen Lernens)

**Claude Code + claude-obsidian** verarbeitet neue Quellen aus `raw/`:
- Liest Quellen
- Updated verknüpfte Wiki-Seiten
- Erstellt neue Konzept-/Entitätenseiten
- Refreshed `index.md`, `log.md`, `hot.md`

Trigger: manuell (`ingest [dateiname]`) oder per Cron-Job.

## Schicht 3: Auto-Linking

**Notemd Plugin** ergänzt automatisch `[[wiki-links]]` und erstellt Konzeptseiten aus bestehenden Notizen — kein manuelles Verlinken nötig.

## Schicht 4: Local LLM (optional)

**Local LLM Hub + Ollama** für:
- Semantische Suche über den gesamten Vault (RAG)
- Vollständige Privatheit (kein Cloud-API-Call)
- Workflow-Automation in natürlicher Sprache

## Schicht 5: Wartung

**AI Librarian Agents** (Proposal-First):
- `@vault-auditor`: Link-Gesundheit
- `@daily-reviewer`: Journal → Evergreen Notes
- `@vault-synthesizer`: Bridge Notes zwischen Konzepten

## Was "automatisch lernen" bedeutet

Das System lernt nicht autonom — es lernt inkrementell durch Trigger:
- Mensch clipped Quelle → Agent verarbeitet → Wiki wächst
- Je mehr Quellen, desto dichter das Netz → exponentiell steigender Wert

Das entspricht dem **Compounding-Prinzip**: Wissen akkumuliert wie Zinseszins.
