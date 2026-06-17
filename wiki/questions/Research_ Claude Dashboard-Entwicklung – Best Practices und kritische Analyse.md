---created: 2026-06-16
updated: 2026-06-16

aliases:
  - "Research- Claude Dashboard Best Practices und Kritik"
  - "claude-code-dashboard-best-practices"
---

﻿---
type: synthesis
title: "Research: Claude Dashboard-Entwicklung – Best Practices und kritische Analyse"
aliases:
  - "Research- Claude Dashboard-Entwicklung"
created: 2026-06-09
updated: 2026-06-09
tags:
  - research
  - claude-code
  - dashboard
  - best-practices
  - react
  - supabase
  - epages
status: developing
related:
  - "[[Trial Conversion Dashboard]]"
  - "[[ePages Spreedly Migration]]"
  - "[[Supabase]]"
  - "[[Netlify]]"
  - "[[Survivorship Bias in SaaS Metrics]]"
  - "[[Test Shop Exclusion]]"
sources:
  - "[[wiki/sources/claude-code-dashboard-best-practices]]"
  - "[[wiki/sources/recharts-vs-chartjs-2026]]"
  - "[[wiki/sources/supabase-security-best-practices]]"
---

# Research: Claude Dashboard-Entwicklung – Best Practices und kritische Analyse

## Übersicht

Claude Code ist besonders gut für Dashboards geeignet, weil repetitive UI-Muster (KPI-Cards, Tabellen, Charts) und datengetriebene Logik direkt in seine Stärken spielen. Ein einfaches Dashboard entsteht in 4–8 Stunden, ein vollständiges in 2–4 Tagen. Die bisherigen ePages-Dashboards haben jedoch mehrere strukturelle Schwächen, die in zukünftigen Projekten vermieden werden sollten.

---

## Teil 1: Kritische Analyse der bestehenden ePages-Dashboards

### Was gut funktioniert hat

- **Schnelle Iteration**: Beide Dashboards entstanden in kurzen Sessions — das No-Build-Setup ermöglichte sofortiges Deployment
- **Flexibles Datenmodell**: CSV-Import + Supabase Storage erlaubt einfache Updates ohne Backend-Änderungen
- **Survivorship-Bias-Fix**: Das Problem wurde erkannt und korrekt behoben (deleted shops als "Abgelaufen" beibehalten)
- **Partner-Baseline**: `baselineShops` als Snapshot beim ersten Import — verhindert Denominator-Drift

### Kritische Schwächen

#### 1. No-Build-Step mit Babel Standalone — technische Schulden

**Problem**: Beide Dashboards verwenden `type="text/babel"` mit Babel Standalone — JSX wird live im Browser kompiliert.

- Babel standalone lädt **1.5 MB** unkomprimiert; schlechte Performance auf langsamen Verbindungen
- Babel selbst warnt: "Do not use in production" — der Transpilier-Schritt kostet Render-Zeit
- Keine Tree-Shaking-Möglichkeit: gesamtes Chart.js/Recharts wird geladen, auch ungenutzter Code
- Single-File = keine Modularisierung; Claude verliert bei langen Dateien den Überblick

**Empfehlung für neue Projekte**: Vite + React — sub-1s HMR, optimiertes Production-Bundle, Claude generiert deutlich besseren Code in modularen Dateien.

#### 2. Kein Spec-First Development

**Problem**: Die Dashboards wurden iterativ entwickelt — "fix as we go". Das führte direkt zur Survivorship-Bias-Lücke, die erst nach Wochen entdeckt wurde.

- Der Survivorship-Bias-Bug (`true rate: 48.3% vs. apparent: 75.6%`) wäre bei einem strukturierten KPI-Review **vor** dem Coding nie entstanden
- Die Window-Global-Credential-Pattern (`window.SUPABASE_URL`) verursachte stille Auth-Fehler, die sich als Edge-Cases manifestierten

**Empfehlung**: Claude im Interview-Modus nutzen, bevor eine Zeile Code geschrieben wird (siehe Best Practices unten).

#### 3. Sicherheit: Anon Key im Page-Source

**Problem**: Der Supabase Anon Key ist im Frontend sichtbar — notwendig, aber mit Risiken.

- RLS wurde korrekt implementiert — das ist das Pflichtpflaster
- Aber: Fehlende `service_role`-Trennung bedeutet, dass Schema-Fehler in der Production direkt sichtbar werden
- Keine separaten Supabase-Projekte für Dev/Staging/Production

**Empfehlung**: Separate Supabase-Projekte je Environment; Migrations-Workflow via CI/CD statt manueller Dashboard-Edits.

#### 4. Chart.js im Spreedly-Dashboard — falsche Wahl für React

**Problem**: Das Spreedly-Dashboard verwendet Chart.js, das Trial-Dashboard Recharts.

- Chart.js ist framework-agnostisch — nicht idiomatisch in React
- Recharts (46.6M weekly downloads vs. Chart.js 12.4M) ist die Standard-Wahl für React
- Claude generiert nachweislich besseren Code mit Recharts (deklarative JSX-API statt imperativer Canvas-Manipulation)
- Zwei verschiedene Charting-Libraries in der gleichen Anwendung = doppelte Bundle-Größe, doppelter Lernaufwand

**Empfehlung**: Einheitlich Recharts für alle React-Dashboards.

#### 5. Fehlende Verifikationskriterien

**Problem**: Kein Test-Layer, keine automatische Verifikation.

- Survivorship-Bias-Bug hätte durch einen einfachen Unit-Test (`total = aktiv + trial_ended + deleted`) sofort auffallen können
- `shopKey()` produziert leere Keys für Shops ohne Domain/Alias/Name — bekanntes Limit, aber nicht als Test dokumentiert

**Empfehlung**: Mindestens Smoke-Tests für KPI-Berechnungen; Claude kann diese automatisch schreiben, wenn man es explizit anfordert.

---

## Teil 2: Best Practices für zukünftige Claude Dashboards

### Vor dem Coding: Interview-Modus

Das wichtigste Prinzip: **Claude interviewt dich, bevor es codiert.**

```
Ich möchte ein Dashboard für [Zweck]. 
Interviewiere mich mit dem AskUserQuestion-Tool über:
- Welche KPIs sollen gemessen werden?
- Wie werden Daten importiert?
- Wer nutzt das Dashboard (intern/extern)?
- Welche Filter werden benötigt?
- Was sind Edge-Cases im Datensatz?
Schreibe danach ein vollständiges Spec-Dokument in SPEC.md.
```

Dann: **neue Session** für die Implementierung. Clean context = bessere Ergebnisse.

### Stack-Empfehlung 2026

| Schicht   | Tool                     | Begründung                                                    |
| --------- | ------------------------ | ------------------------------------------------------------- |
| Framework | React 18 + Vite          | HMR <1s, optimiertes Bundle, Claude-freundlich                |
| Charts    | Recharts                 | Deklarativ, React-nativ, Claude generiert flawless configs    |
| Styling   | Tailwind CSS + shadcn/ui | Schnell, konsistent, kein CSS schreiben                       |
| Backend   | Supabase                 | Auth + Postgres + Storage, einfach mit Claude zu koppeln      |
| Hosting   | Netlify                  | Ideal mit Supabase, branch deploys, easy env vars             |
| State     | React Query              | Caching, refetching, loading states — kein manuelles useState |

### Prompt-Patterns für Dashboards

**KPI-Cards zuerst:**
```
Erstelle zuerst die KPI-Card-Komponente. Verwende Recharts und Tailwind.
Die KPIs sind: [Liste]. Teste mit Mock-Daten.
```

**Verifikation einfordern:**
```
Nach jeder Änderung: nimm einen Screenshot und vergleiche mit dem Design.
Schreibe einen Unit-Test für jede KPI-Berechnung.
```

**Kontext begrenzen:**
```
Arbeite nur an /src/components/KPICard.tsx. 
Ignoriere andere Dateien außer du wirst explizit gefragt.
```

### Sicherheits-Checkliste Supabase

- [ ] RLS auf **jeder** Tabelle aktiviert
- [ ] `service_role` Key **niemals** im Frontend
- [ ] Separate Projekte: Dev / Staging / Production
- [ ] Environment-Variablen via `.env` + Netlify UI (nicht im Code)
- [ ] Backup-Restore getestet, bevor Production live geht
- [ ] `EXPLAIN ANALYZE` auf komplexe Queries vor Launch

### CLAUDE.md für Dashboard-Projekte

Sinnvolle Dashboard-spezifische Regeln:

```markdown
# Dashboard Conventions
- Use Recharts for all charts (not Chart.js)
- KPI calculations always have a corresponding unit test
- No raw SQL — use Supabase client SDK
- Filter logic lives in utils/filters.ts, never inline
- Deleted records are NEVER removed from datasets (survivorship bias prevention)
```

### Context-Management bei langen Dashboard-Sessions

- Nach jeder abgeschlossenen Komponente: `/clear`
- Großes Dashboard mit 10+ Seiten: eine Claude-Session pro Tab/Seite
- Verifikation per Subagent: `"Use a subagent to review the filter logic for edge cases"`
- Kontext-Grenze: 60% des 200k-Token-Fensters = maximale Qualität; danach `/clear`

### Chart.js vs. Recharts — Entscheidungsbaum

```
Ist es ein React-Projekt?
  ├── Ja → Recharts (Standard)
  │         Exception: >10.000 Datenpunkte → react-chartjs-2 (Canvas-Performance)
  └── Nein (Vanilla JS/andere Frameworks) → Chart.js
```

---

## Teil 3: Priorisierte Verbesserungen für bestehende ePages-Dashboards

### Priorität 1 — Sofort (nächste Session)

1. **Einheitliche Chart-Library**: Spreedly-Dashboard von Chart.js auf Recharts migrieren
2. **shopKey()-Edge-Case**: Test + Fallback für Shops ohne Domain/Alias/Name

### Priorität 2 — Mittelfristig (nächstes Feature)

3. **Vite-Migration**: Trial Conversion Dashboard auf Vite + modulare Komponenten migrieren
4. **Supabase-Environments**: Separates Staging-Projekt anlegen; Migrations via SQL-Files versionieren

### Priorität 3 — Langfristig

5. **Test-Layer**: KPI-Berechnungen als Unit-Tests; Claude kann diese automatisch schreiben
6. **CLAUDE.md** pro Dashboard-Projekt: Dashboard-Conventions, KPI-Formeln, bekannte Edge-Cases dokumentieren

---

## Widersprüche / Offene Fragen

- **Single-File vs. Build-Step für interne Tools**: Die No-Build-Strategie hat echte Vorteile (sofortiges Deployment, kein Setup-Aufwand). Für rein interne Tools mit wenigen Nutzern ist sie vertretbar. Die Grenze liegt bei Komplexität (>500 Zeilen) und Maintenance-Anforderungen.
- **Sind die bisherigen Dashboards "schlecht"?** Nein — sie funktionieren und liefern Wert. Die kritischen Punkte betreffen Skalierbarkeit und zukünftige Wartung, nicht die aktuelle Funktionalität.
- Offene Frage: Lässt sich der Vite-Migration-Aufwand durch ein Claude-Session-Workflow reduzieren (eine Session pro Komponente)?

---

## Quellen

- [[claude-code-dashboard-best-practices]]: vanbeaumond.nl + code.claude.com/docs, 2026
- [[recharts-vs-chartjs-2026]]: pkgpulse.com + logrocket.com, 2026
- [[supabase-security-best-practices]]: leanware.co, 2026
- Internes Wissen: [[Trial Conversion Dashboard]], [[ePages Spreedly Migration]], [[Survivorship Bias in SaaS Metrics]]
