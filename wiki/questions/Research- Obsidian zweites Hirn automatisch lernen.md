---
type: synthesis
title: "Research: Obsidian zweites Hirn – automatisch lernen & schlauer werden"
created: 2026-06-09
updated: 2026-06-09
tags:
  - research
  - obsidian
  - second-brain
  - pkm
  - llm
  - zettelkasten
status: developing
related:
  - "[[LLM Wiki Pattern]]"
  - "[[Compounding Knowledge]]"
  - "[[Hot Cache]]"
  - "[[Andrej Karpathy]]"
  - "[[Notemd]]"
  - "[[Zweites Hirn Aufbau Stack]]"
  - "[[Obsidian Web Clipper Workflow]]"
sources:
  - "[[wiki/sources/obsidian-second-brain-ai-stack-2026]]"
  - "[[wiki/sources/karpathy-llm-wiki-step-by-step]]"
  - "[[wiki/sources/local-llm-hub-plugin]]"
  - "[[wiki/sources/johnny-decimal-zettelkasten-ai-librarian]]"
  - "[[wiki/sources/notemd-plugin]]"
---

# Research: Obsidian zweites Hirn – automatisch lernen & schlauer werden

## Übersicht

Ein Obsidian-Vault wird zum automatisch lernenden zweiten Hirn durch die Kombination von drei Schichten: (1) rohe Quellen, (2) ein KI-gepflegtes Wiki, und (3) einen Agenten, der neue Quellen laufend einarbeitet. Das Schlüsselprinzip stammt von Andrej Karpathy: das Wiki **compounds** — jede neue Quelle macht das gesamte Wiki klüger, nicht nur größer.

---

## Schlüssel-Erkenntnisse

- **Separation of Concerns ist das Fundament**: Rohe Quellen (`raw/`) bleiben unveränderlich. Ein KI-Agent pflegt die Syntheseschicht (`wiki/`). Dieser Trennung ermöglicht inkrementelles Lernen ohne Datenverlust. (Source: [[karpathy-llm-wiki-step-by-step]])
- **Compounding-Effekt**: Eine neue Quelle triggert Writes auf 10–15 verknüpften Wiki-Seiten — das Wiki wird systemisch smarter, nicht linear größer. (Source: [[LLM Wiki Pattern]])
- **RAG vs. Wiki**: Ein persistentes Wiki schlägt reines RAG bei <1000 Seiten, weil Kontext bereits synthetisiert vorliegt und kein Embedding-Lookup nötig ist. (Source: [[LLM Wiki Pattern]])
- **Automatisierung braucht einen Agent**: Das Wiki lernt nicht von allein — ein LLM-Agent (Claude Code, Cursor, o.ä.) muss manuell oder per Trigger aufgerufen werden, um neue Quellen einzuarbeiten. Vollautomatismus erfordert Cron/Webhook-Integration. (Source: [[local-llm-hub-plugin]])
- **Notemd automatisiert die Wiki-Link-Ebene**: Das Notemd-Plugin generiert `[[wiki-links]]` und Konzeptseiten automatisch per One-Click aus bestehenden Notizen — kein Agent nötig für diesen Schritt. (Source: [[notemd-plugin]])
- **AI Librarian Agents** (Johnny-Decimal-Projekt): Spezialisierte Subagenten (`@vault-auditor`, `@daily-reviewer`, `@vault-synthesizer`) halten das Vault aktiv gesund — mit **Proposal-First**: sie schlagen vor, der User bestätigt. (Source: [[johnny-decimal-zettelkasten-ai-librarian]])
- **Obsidian Web Clipper** ist der Standard-Capture-Layer 2026: Ein Klick speichert Artikel + YouTube-Transkripte in `raw/` — der Input-Funnel für das automatische Lernsystem. (Source: [[obsidian-second-brain-ai-stack-2026]])

---

## Empfohlener Stack (2026)

| Schicht | Tool | Zweck |
|---------|------|-------|
| Capture | Obsidian Web Clipper | Artikel, Videos → `raw/` |
| Agent | Claude Code + claude-obsidian | Ingest, Synthese, Index |
| Auto-Linking | Notemd Plugin | Wiki-Links & Konzeptseiten automatisch |
| Local LLM (optional) | Local LLM Hub + Ollama | Private RAG, offline Workflows |
| Struktur | Zettelkasten oder LYT | Atomic Notes + Verlinkung |
| Wartung | AI Librarian Agents | Link-Gesundheit, Synthese, Evergreen-Extraktion |

---

## Schlüssel-Entitäten

- [[Andrej Karpathy]]: Begründer des LLM Wiki Patterns — "Die KI pflegt das Wiki, du pflegst die Fragen"
- [[Notemd]]: Obsidian-Plugin, das automatisch `[[wiki-links]]` und Konzeptseiten aus Notizen generiert
- Tiago Forte: Begründer von BASB (Building a Second Brain) und CODE/PARA-Methodik

---

## Schlüssel-Konzepte

- [[LLM Wiki Pattern]]: KI-gepflegtes Wiki; jede Quelle macht das gesamte System smarter
- [[Compounding Knowledge]]: Wissen akkumuliert wie Zinseszins — jede Verknüpfung steigert den Wert aller anderen Seiten
- [[Hot Cache]]: ~500-Wort Kontext-Datei; hält den Agenten über den aktuellen Vault-Stand informiert
- Zettelkasten: Atomare Notizen mit expliziten Links; Fundament für emergente Einsichten
- PARA (Forte): Projects / Areas / Resources / Archives — hierarchische Ablagestruktur

---

## Widersprüche

- **"Automatisch lernen"** ist technisch ungenau: Das System lernt nur, wenn ein Agent aktiv getriggert wird. Es gibt keinen Lernmechanismus, der ohne menschliche Eingabe oder Cron-Trigger auskommt. Plugins wie Notemd und Local LLM Hub reduzieren den manuellen Aufwand erheblich, eliminieren ihn aber nicht.
- **Zettelkasten vs. PARA**: Zettelkasten priorisiert emergente Verknüpfungen über Hierarchie; PARA priorisiert Handlungsorientierung. Beides ist kombinierbar (z.B. PARA für Top-Level, Zettelkasten für Notizebene), aber die Methodiken haben grundlegend verschiedene Logiken.

---

## Offene Fragen

- Wie lässt sich ein vollautomatischer Ingest-Trigger einrichten (z.B. Watcher-Script auf `raw/` + Cron-Job der Claude Code aufruft)?
- Welche Embeddings-Modelle eignen sich am besten für lokale semantische Suche in Obsidian?
- Wie verhindert man Qualitätsverlust bei sehr großen Vaults (1000+ Seiten)?
- Gibt es native Obsidian-Features (Bases, Canvas) die sich mit dem LLM-Layer verzahnen lassen?

---

## Quellen

- [[obsidian-second-brain-ai-stack-2026]]: youngju.dev, 2026-03
- [[karpathy-llm-wiki-step-by-step]]: thetoolnerd.com, 2026
- [[local-llm-hub-plugin]]: github.com/takeshy, 2026
- [[johnny-decimal-zettelkasten-ai-librarian]]: github.com/jabez007, 2026
- [[notemd-plugin]]: github.com/Jacobinwwey, 2026
