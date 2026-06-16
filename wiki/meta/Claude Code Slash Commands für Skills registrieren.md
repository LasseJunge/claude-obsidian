---
type: decision
title: "Claude Code Slash Commands für Skills registrieren"
created: 2026-06-09
updated: 2026-06-09
decision_date: 2026-06-09
status: active
tags:
  - claude-obsidian
  - setup
  - skills
  - slash-commands
related:
  - "[[wiki/overview]]"
---

# Claude Code Slash Commands für Skills registrieren

## Entscheidung

Skills im `skills/*/SKILL.md`-Format sind **nicht automatisch** als Claude Code Slash Commands verfügbar. Sie müssen explizit unter `.claude/commands/<name>.md` registriert werden.

## Hintergrund

Das Plugin `claude-obsidian` liefert 15 Skills als `SKILL.md`-Dateien im Format des Claude Code Plugin Marketplace (`plugin.json`). Claude Code selbst lädt Slash Commands jedoch nur aus `.claude/commands/`. Ohne dieses Verzeichnis schlägt jeder `/skill-name`-Aufruf mit „Unknown command" fehl.

## Lösung

Für jeden Skill wird eine Wrapper-Datei unter `.claude/commands/<name>.md` angelegt:

```markdown
---
allowed-tools: Read Write Edit Glob Grep Bash
---

Execute the skill defined in skills/<name>/SKILL.md. Read that file first, then follow its instructions for the user's request: $ARGUMENTS
```

Die `allowed-tools`-Liste richtet sich nach dem, was der jeweilige Skill in seiner SKILL.md deklariert.

## Registrierte Commands (Stand 2026-06-09)

| Slash Command | Skill-Datei | Zweck |
|---|---|---|
| `/wiki` | skills/wiki/SKILL.md | Setup & Scaffold |
| `/wiki-ingest` | skills/wiki-ingest/SKILL.md | Quellen aufnehmen |
| `/wiki-query` | skills/wiki-query/SKILL.md | Wiki befragen |
| `/wiki-lint` | skills/wiki-lint/SKILL.md | Gesundheitscheck |
| `/wiki-cli` | skills/wiki-cli/SKILL.md | Transport-Layer |
| `/wiki-retrieve` | skills/wiki-retrieve/SKILL.md | Hybrides Retrieval |
| `/wiki-mode` | skills/wiki-mode/SKILL.md | Methodologie wählen |
| `/wiki-fold` | skills/wiki-fold/SKILL.md | Log-Rollup |
| `/autoresearch` | skills/autoresearch/SKILL.md | Autonome Recherche |
| `/canvas` | skills/canvas/SKILL.md | Visueller Layer |
| `/save` | skills/save/SKILL.md | Gespräch sichern |
| `/think` | skills/think/SKILL.md | 10-Prinzipien-Denkloop |
| `/defuddle` | skills/defuddle/SKILL.md | Web-Seiten bereinigen |
| `/obsidian-bases` | skills/obsidian-bases/SKILL.md | Datenbank-Views |
| `/obsidian-markdown` | skills/obsidian-markdown/SKILL.md | Syntax-Referenz |

## Wichtig

Nach dem Anlegen der `.claude/commands/`-Dateien muss die **Claude Code Session neu gestartet** werden, damit die neuen Commands geladen werden.
Dies muss über den Task Manager gemacht werden.
