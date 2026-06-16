---
name: ponytail-debt
description: "Harvest all ponytail: comment markers from the codebase into a debt ledger. Triggers on: ponytail debt, /ponytail-debt, what did ponytail defer."
allowed-tools: Read Bash Glob Grep
---

# ponytail-debt: Technical Debt Ledger

Grep for all `ponytail:` comment markers in the codebase and aggregate into a ledger.

## Marker convention

```
// ponytail: <what was simplified>, <ceiling/trigger to revisit>
```

Example: `// ponytail: no pagination, add when list > 100 items`

## Process

1. `grep -rn "ponytail:" --include="*.js" --include="*.ts" --include="*.py" --include="*.mjs" . --exclude-dir=node_modules --exclude-dir=.git`
2. Group by file
3. For each entry show: file:line, simplified approach, ceiling, upgrade trigger
4. Flag entries marked `no-trigger` — these risk becoming permanent debt

## Output

List all entries. End with count and flag any `no-trigger` items as high risk.

Ask for permission before writing results to `PONYTAIL-DEBT.md`.
