---
name: ponytail-review
description: "Review current code diff for over-engineering and unnecessary complexity. Find what can be deleted. Triggers on: ponytail review, simplify review, what can we delete, /ponytail-review."
allowed-tools: Read Bash Glob Grep
---

# ponytail-review: Complexity Review

Hunt for what can be **deleted** in the current diff or specified code. This is not a correctness review — bugs and security belong in standard code review.

## What to flag

- `delete:` — Dead code or unused flexibility
- `stdlib:` — Hand-rolled code that standard libraries already ship
- `native:` — Dependencies doing what the platform already provides
- `yagni:` — Abstractions with only one implementation
- `shrink:` — Same logic, fewer lines possible

## Output format

```
L<line>: <tag> <description>. <replacement>.
```

End with: `net: -<N> lines possible.`

If code is already lean: **"Lean already. Ship."**

## Explicitly skip

Correctness bugs, security vulnerabilities, performance issues — those belong in `/code-review`.
