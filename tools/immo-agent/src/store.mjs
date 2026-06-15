// JSON-file store with dedup + survivorship (zero deps).
//
// Survivorship rule (CLAUDE.md): listings are NEVER deleted. When a listing
// disappears from a source it flips to status:'delisted' but stays on file, so
// historical analysis isn't biased toward only-still-active properties.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { uid, fingerprint } from "./model.mjs";

export class Store {
  constructor(path) {
    this.path = path;
    this.rows = existsSync(path) ? JSON.parse(readFileSync(path, "utf-8")) : {};
  }

  save() {
    mkdirSync(dirname(this.path), { recursive: true });
    writeFileSync(this.path, JSON.stringify(this.rows, null, 2), "utf-8");
  }

  // Returns 'new' | 'changed' | 'unchanged'.
  upsert(l, nowIso) {
    const key = uid(l);
    const prev = this.rows[key];
    l.last_seen = nowIso;
    l.status = "active";
    const fp = fingerprint(l);
    let verdict;
    if (!prev) { l.first_seen = nowIso; verdict = "new"; }
    else {
      l.first_seen = prev.first_seen;
      verdict = fingerprint(prev) === fp ? "unchanged" : "changed";
    }
    this.rows[key] = l;
    return verdict;
  }

  // Flip active rows of `source` not seen this run to 'delisted'. No deletes.
  markDelisted(source, seenUids, nowIso) {
    let n = 0;
    for (const [k, r] of Object.entries(this.rows)) {
      if (r.source === source && r.status === "active" && !seenUids.has(k)) {
        r.status = "delisted"; r.last_seen = nowIso; n++;
      }
    }
    return n;
  }

  active() {
    return Object.values(this.rows)
      .filter((r) => r.status === "active")
      .sort((a, b) => b.score - a.score);
  }
}
