---
type: source
title: "Claude Code Dashboard Best Practices 2026"
created: 2026-06-09
updated: 2026-06-09
source_type: documentation
author: Anthropic + vanbeaumond.nl
date_published: 2026
url: https://code.claude.com/docs/en/best-practices
confidence: high
tags:
  - claude-code
  - best-practices
  - dashboard
  - context-management
key_claims:
  - "Context-Grenze: Qualität degradiert ab 20-40% des 200k-Fensters; max 60% nutzen"
  - "Spec-First: Interview-Modus vor Coding, dann neue Clean-Context-Session"
  - "Verifikation einfordern: Tests, Screenshots, Build-Exit-Code"
  - "Recharts wird von Claude flawless generiert; Chart.js schlechter"
  - "Dashboard-Komplexität: einfach 4-8h, komplex 2-4 Tage"
  - "Nach 2 fehlgeschlagenen Korrekturen: /clear + besserer Prompt"
related:
  - "[[Research- Claude Dashboard Best Practices und Kritik]]"
---

# Claude Code Best Practices für Dashboards

## Context-Management (kritischste Variable)

Context-Fenster füllt sich schnell. Qualität degradiert ab 20–40% Auslastung. Praktische Grenze: **60% = maximale Qualität**.

- `/clear` zwischen unrelated Tasks
- Subagents für Investigations (lesen viele Dateien ohne Main-Context zu füllen)
- Nach 2 Korrekturen des gleichen Fehlers: `/clear` + besserer Prompt

## Spec-First Workflow

1. **Interview-Modus**: "Interviewiere mich mit AskUserQuestion. Schreibe danach SPEC.md."
2. **Neue Session** für Implementierung (clean context)
3. **Verifikation** einfordern: Tests, Screenshots, Diffs

## Verifikation ist Pflicht

Ohne Verifikationskriterien stoppt Claude, wenn es "fertig aussieht" — nicht wenn es fertig ist. Mindest-Verifikation:
- Unit-Test für KPI-Berechnungen
- Screenshot-Vergleich bei UI-Änderungen
- Build-Exit-Code bei Produktionscode

## Dashboard-Empfehlungen

- **Recharts > Chart.js** für React: deklarative JSX-API, Claude generiert flawless configs
- **KPI-Cards zuerst**: Datenmodell etablieren, dann Filter, dann Charts
- **Filter-Logik früh planen**: beeinflusst Datenbankqueries

## Kosten/Zeit-Schätzung

| Komplexität | Dauer | Claude-Kosten |
|------------|-------|--------------|
| Einfach (KPIs + Charts) | 4–8h | €5–12 |
| Mittel (Filter + Views) | 1–3 Tage | €8–20 |
| Komplex (mehrere Tabs, Datenmgmt) | 2–4 Tage | €12–28 |
