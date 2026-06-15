// Orchestrator: scrape -> normalize -> score -> store -> notes -> dashboard.
import { join } from "node:path";
import { loadConfig, ROOT } from "./config.mjs";
import { Http } from "./http.mjs";
import { Store } from "./store.mjs";
import { enrich, scoreAndFlag, passesFilters } from "./normalize.mjs";
import { writeNotes } from "./obsidian.mjs";
import { generateDashboard } from "./dashboard.mjs";
import { uid } from "./model.mjs";

import * as zvg from "./connectors/zvg.mjs";
import * as bank from "./connectors/bank.mjs";
import * as kleinanzeigen from "./connectors/kleinanzeigen.mjs";
import * as immoscout from "./connectors/immoscout.mjs";

const CONNECTORS = { zvg, bank_auctions: bank, kleinanzeigen, immoscout };
// config source key -> store source label(s)
const SRC_LABEL = { immoscout: "immoscout", bank_auctions: "bank" };
const SRC_LABELS = { immoscout: ["immoscout", "is24-zvg"], bank_auctions: ["bank"] };

export const DB_PATH = join(ROOT, "immo.json");

export async function runAgent({ configPath, dryRun = false, is24 = false } = {}) {
  const cfg = loadConfig(configPath);
  // `--is24`: force an on-demand, headful ImmoScout24 run (headless is blocked by
  // IS24's fingerprint detection). Leaves the daily/headless job untouched.
  if (is24) {
    cfg.sources = cfg.sources || {};
    cfg.sources.immoscout = { ...(cfg.sources.immoscout || {}), enabled: true, method: "browser", debug: true };
  }
  const http = new Http(cfg);
  const store = new Store(DB_PATH);
  const now = new Date().toISOString();
  const summary = { sources: {}, new: 0, changed: 0, delisted: 0, matched: 0, notes: 0 };

  for (const [key, conf] of Object.entries(cfg.sources || {})) {
    if (!conf?.enabled) continue;
    const mod = CONNECTORS[key];
    if (!mod) continue;
    console.log(`=== source: ${key} ===`);
    let listings = [];
    try {
      listings = await mod.fetchListings(cfg, http);
    } catch (e) {
      console.error(`  source ${key} crashed: ${e.message}`);
      summary.sources[key] = { error: e.message };
      continue;
    }
    const seen = new Set();
    let kept = 0;
    for (const l of listings) {
      enrich(l, cfg);
      scoreAndFlag(l, cfg);
      if (!passesFilters(l, cfg)) continue;
      seen.add(uid(l));
      kept++;
      if (!dryRun) {
        const v = store.upsert(l, now);
        if (v === "new") summary.new++;
        else if (v === "changed") summary.changed++;
      }
    }
    if (!dryRun) {
      // A connector may emit more than one store-source (e.g. immoscout also
      // emits is24-zvg for IS24 foreclosures); delist each.
      for (const lbl of SRC_LABELS[key] || [SRC_LABEL[key] || key]) {
        summary.delisted += store.markDelisted(lbl, seen, now);
      }
    }
    summary.sources[key] = { fetched: listings.length, matched: kept };
  }

  if (!dryRun) store.save();
  const active = store.active();
  summary.matched = active.length;

  const out = cfg.output || {};
  const ts = now.replace("T", " ").slice(0, 16) + " UTC";
  if (!dryRun && out.obsidian_notes) {
    // File anything flagged as interesting (yield/discount/price) PLUS every
    // forced/bank auction — the user explicitly wants auctions surfaced even
    // when the list view carries no Verkehrswert to score against.
    const auctions = new Set(["zvg", "bank", "is24-zvg"]);
    const toFile = active.filter((l) => l.flags?.length || auctions.has(l.source));
    summary.notes = writeNotes(toFile, cfg, out.max_notes_per_run || 50);
  }
  if (!dryRun && out.dashboard) {
    summary.dashboard = generateDashboard(active, cfg, ts);
  }
  return summary;
}
