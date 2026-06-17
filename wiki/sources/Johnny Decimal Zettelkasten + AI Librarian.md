---created: 2026-06-16
updated: 2026-06-16

aliases:
  - "johnny-decimal-zettelkasten-ai-librarian"
---

﻿---
type: source
title: "Johnny Decimal Zettelkasten — Compounding Knowledge mit AI Librarian"
aliases:
  - "johnny-decimal-zettelkasten-ai-librarian"
created: 2026-06-09
updated: 2026-06-09
source_type: github
author: jabez007
date_published: 2026
url: https://github.com/jabez007/johnny-decimal-zettelkasten
confidence: high
tags:
  - zettelkasten
  - ai-agents
  - compounding-knowledge
  - obsidian
key_claims:
  - "Kombination aus Johnny Decimal (Struktur) + Zettelkasten (Verbindung) + AI Librarian (Automation)"
  - "Proposal-First Mandat: Agenten schlagen vor, niemals direkte Dateiänderungen"
  - "Crystallization Principle: reife Ideen werden proaktiv in Evergreen Notes extrahiert"
  - "@vault-synthesizer findet Spannungen zwischen Notizen und erstellt Bridge Notes"
  - "Daily-Reviewer wandelt Journaleinträge automatisch in Evergreen Notes um"
related:
  - "[[Compounding Knowledge]]"
  - "[[LLM Wiki Pattern]]"
  - "[[Zweites Hirn Aufbau Stack]]"
---

# Johnny Decimal Zettelkasten + AI Librarian

## Architektur

Drei Komponenten:

1. **Johnny Decimal** (Struktur): Hierarchische Nummerierung (ACID: System.Area.Category.ID) — eliminiert Filing-Paralysis
2. **Zettelkasten** (Verbindung): Atomare, evergreen Notizen mit expliziten Links — emergente Einsichten
3. **AI Librarian** (Automation): Brücke zwischen Organisation und Insight-Discovery

## AI Librarian Subagenten

| Agent | Aufgabe |
|-------|---------|
| `@librarian` | Koordination, ID-Lookups |
| `@vault-auditor` | Link-Gesundheit, Graph-Analyse |
| `@daily-reviewer` | Journaleinträge → Evergreen Notes |
| `@vault-synthesizer` | Spannungen finden, Bridge Notes erstellen |
| `@source-distiller` | Artikel → atomare Notizen |

## Proposal-First Mandat

Agenten analysieren und schlagen Aktionen vor — sie modifizieren nie Dateien ohne Bestätigung. Der Mensch behält Kontrolle; das System bleibt vertrauenswürdig.

## Kristallisationsprinzip

Täglich-Capture → Review → reife Ideen werden zu Evergreen Notes extrahiert → Syntheseagenten finden Verbindungen zwischen alten und neuen Notizen → emergente Themen entstehen ohne explizite Kategorisierung.
