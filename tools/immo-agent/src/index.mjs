#!/usr/bin/env node
// CLI entry point.
//
//   node src/index.mjs run          full pipeline -> notes + dashboard
//   node src/index.mjs run --dry    fetch + score, NO writes (safe test)
//   node src/index.mjs top [N]      print top N stored matches
//   node src/index.mjs dashboard    regenerate dashboard from stored data
import { runAgent, DB_PATH } from "./agent.mjs";
import { loadConfig } from "./config.mjs";
import { Store } from "./store.mjs";
import { generateDashboard } from "./dashboard.mjs";

const argv = process.argv.slice(2);
const cmd = argv[0] || "run";

async function main() {
  if (cmd === "run") {
    const dry = argv.includes("--dry") || argv.includes("--dry-run");
    const summary = await runAgent({ dryRun: dry });
    console.log("\n" + JSON.stringify(summary, null, 2));
    return 0;
  }

  if (cmd === "top") {
    const n = /^\d+$/.test(argv[1] || "") ? Number(argv[1]) : 15;
    const store = new Store(DB_PATH);
    for (const l of store.active().slice(0, n)) {
      const disc = l.auction_discount_pct ? ` | -${l.auction_discount_pct}% VW` : "";
      const yld = l.gross_yield_pct ? ` | ${l.gross_yield_pct}% Rendite` : "";
      const price = (l.price || 0).toLocaleString("de-DE").padStart(11);
      console.log(`[${String(l.score).padStart(6)}] ${l.source.padEnd(13)} ` +
        `${(l.title || "").slice(0, 46).padEnd(46)} ${price}€${disc}${yld}`);
    }
    return 0;
  }

  if (cmd === "dashboard") {
    const cfg = loadConfig();
    const store = new Store(DB_PATH);
    const ts = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";
    generateDashboard(store.active(), cfg, ts);
    return 0;
  }

  console.log(`Unknown command: ${cmd}
Usage:
  node src/index.mjs run [--dry]   run the pipeline
  node src/index.mjs top [N]       list top matches
  node src/index.mjs dashboard     rebuild dashboard`);
  return 1;
}

main().then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(1); });
