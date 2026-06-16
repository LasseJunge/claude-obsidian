---
name: ponytail-audit
description: "Scan entire repository for over-engineering patterns. One-shot audit, largest cuts first. Triggers on: ponytail audit, /ponytail-audit, audit for over-engineering."
allowed-tools: Read Bash Glob Grep
---

# ponytail-audit: Full Repository Audit

One-shot complexity audit across the entire codebase. Not interactive — generate the report, do not apply fixes.

## What to scan for

- Unused dependencies
- Single-implementation interfaces or abstract classes
- Wrapper-only delegators (files that just re-export)
- Mono-export files
- Dead configuration flags
- Hand-rolled stdlib equivalents

## Tags

- `delete:` — Unused code, no replacement needed
- `stdlib:` — Hand-rolled implementation stdlib already provides
- `native:` — Platform feature duplicating a dependency
- `yagni:` — Single-implementation abstraction or one-caller layer
- `shrink:` — Logic that could use fewer lines

## Output format

Ranked findings, largest cuts first:

```
<tag> <description>. <replacement>. [path:line]
```

End with: `net: -<N> lines, -<M> deps possible.`

## Scope

Complexity only — correctness bugs, security, and performance belong in standard review.
