---
type: session
title: "Vault Recovery + Skill Repair Playbook"
created: 2026-06-16
updated: 2026-06-16
tags:
  - session
  - recovery
  - git
  - obsidian
  - skills
  - immo-agent
status: evergreen
related:
  - "[[immo — German Real-Estate & Forced-Auction Agent]]"
  - "[[2026-06-15-immo-agent-build-session]]"
  - "[[Agentic Web Scraping Pipeline]]"
  - "[[immoscout24-piloterr-api]]"
  - "[[german-scraping-legality]]"
---

# Vault Recovery + Skill Repair Playbook

Full recovery session after `.raw/` and several wiki pages were wiped. Documents what happened, how recovery was done, and what safeguards are now in place so future sessions know the playbook.

---

## What Happened

The `.raw/` directory and several wiki pages were deleted. Root cause: `.raw/` files were **never committed to git** (untracked). A `git reset --hard HEAD` (visible 3 times in reflog) followed by `git clean` wiped them. No VSS backups or Recycle Bin copies existed.

---

## What Was Recovered and How

### `.raw/` Dashboards

| File | Recovery source |
|------|----------------|
| `Spreedly_Conversion.html` | VS Code keeps deleted files open in memory. User saved from the open editor tab before closing it. |
| `Conversion_Dashboard.html` | Live Netlify deployment at `monumental-duckanoo-466abe.netlify.app` still served the full JS-rendered HTML. User saved it manually (WebFetch only returns shell HTML for JS-rendered apps). |

### Wiki Pages (174 pages)

Obsidian's **File Recovery plugin** stores snapshots in Chrome-format IndexedDB (LevelDB under `%AppData%\obsidian\IndexedDB\`). A custom Node.js extractor was written to read them:

- Chrome uses a different LevelDB magic: `57fb808b247547db` (not the standard `57fb808b24234422`)
- Block values are Snappy-compressed — requires the `snappyjs` npm package
- Strings are UTF-16LE encoded (Chrome structured clone format)
- The extractor script lives at `C:\Users\ljunge\AppData\Local\Temp\obsidian-recovery\extract7.js`

**46,830 IDB entries scanned → 182 wiki pages recovered.**

Run again anytime with (close Obsidian first — WAL file is locked while it runs):
```
cd C:\Users\ljunge\AppData\Local\Temp\obsidian-recovery
node extract7.js
```

### Missing Wiki Pages (immo-agent references)

Three pages referenced by `[[2026-06-15-immo-agent-build-session]]` were not in the IDB snapshot and were reconstructed from source code + session notes:

- `wiki/references/immoscout24-piloterr-api.md`
- `wiki/references/german-scraping-legality.md`
- `wiki/concepts/Agentic Web Scraping Pipeline.md` (was already recovered by IDB extraction)

### Missing Skill Commands

8 skills existed in `skills/` but had no corresponding `.claude/commands/` entry, so they were invisible as slash commands. Added:

| Command | Skill |
|---------|-------|
| `/autoresearch` | `skills/autoresearch/SKILL.md` |
| `/save` | `skills/save/SKILL.md` |
| `/canvas` | `skills/canvas/SKILL.md` |
| `/think` | `skills/think/SKILL.md` |
| `/immo` | `skills/immo/SKILL.md` |
| `/defuddle` | `skills/defuddle/SKILL.md` |
| `/obsidian-bases` | `skills/obsidian-bases/SKILL.md` |
| `/obsidian-markdown` | `skills/obsidian-markdown/SKILL.md` |

Each `.claude/commands/<name>.md` file just needs:
```markdown
---
allowed-tools: Read Write Edit Glob Grep Bash
---

Execute the skill defined in skills/<name>/SKILL.md. Read that file first, then follow its instructions for the user's request: $ARGUMENTS
```

---

## Safeguards Now in Place

### 1. Auto-commit `.raw/` after every Claude write

`.claude/settings.local.json` now has a `PostToolUse` hook that stages and commits `.raw/` after any `Write` or `Edit` tool use:

```json
"hooks": {
  "PostToolUse": [{
    "matcher": "Write|Edit",
    "hooks": [{ "type": "command", "command": "powershell ... git add -- .raw/ && git commit ..." }]
  }]
}
```

### 2. Git pre-commit hook auto-stages `.raw/`

`.git/hooks/pre-commit` runs `git add -- .raw/` before every manual commit, so nothing in `.raw/` can slip through as untracked even when committing from the terminal.

### 3. Immo dashboard tracked in git

`wiki/immo/dashboard.html` is force-tracked via `.gitignore` exception (`wiki/immo/*` + `!wiki/immo/dashboard.html`). The individual property listing pages remain gitignored (they are regenerated each run from `immo.json`).

---

## Key Lessons

1. **Any file not committed to git can be lost by `git clean` or `git reset --hard`.** The only protection is to commit it. The PostToolUse hook closes this gap for future Claude-written files.
2. **Obsidian File Recovery plugin is a viable last resort** — but requires Obsidian to have opened the file at least once since last saving. Close Obsidian before running the extractor (WAL lock).
3. **VS Code keeps deleted files open in memory** — if a file was open in an editor tab, save it from there immediately before closing the tab.
4. **Live deployments (Netlify, Vercel) can serve as source backups** — fetch the full rendered HTML, not just the repo code.
5. **Skill commands need a matching `.claude/commands/<name>.md` file** — having a `skills/` directory is not enough. Check `.claude/commands/` when a skill seems missing.
