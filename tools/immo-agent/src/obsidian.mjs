// Write matched listings into the Obsidian vault as structured wiki notes.
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOURCE_LABEL = {
  zvg: "Zwangsversteigerung", bank: "Bank-/Insolvenzauktion",
  kleinanzeigen: "Kleinanzeigen", immoscout: "ImmoScout24",
};

const slug = (s) =>
  (s || "objekt").normalize("NFKD").replace(/[^\w\s-]/g, "").trim().toLowerCase()
    .replace(/[\s_-]+/g, "-").slice(0, 60) || "objekt";

const eur = (v) => (v == null ? "—" : `${Math.round(v).toLocaleString("de-DE")} €`);

function noteBody(l) {
  const fm = [
    "---", "type: immo-listing", `source: ${l.source}`,
    `property_type: "${l.property_type}"`,
    `price: ${l.price ?? ""}`, `verkehrswert: ${l.verkehrswert ?? ""}`,
    `price_per_sqm: ${l.price_per_sqm ?? ""}`,
    `gross_yield_pct: ${l.gross_yield_pct ?? ""}`,
    `auction_discount_pct: ${l.auction_discount_pct ?? ""}`,
    `score: ${l.score}`, `plz: "${l.plz}"`, `bundesland: "${l.bundesland}"`,
    `auction_date: "${l.auction_date}"`, `status: ${l.status}`,
    `first_seen: "${l.first_seen}"`, `last_seen: "${l.last_seen}"`,
    `tags: [immo, real-estate, ${l.source}]`, "---", "",
    `# ${l.title}`, "",
    `**Quelle:** ${SOURCE_LABEL[l.source] || l.source} · [Inserat öffnen](${l.url})`,
    "", "## Eckdaten", "",
    `- **Preis / Mindestgebot:** ${eur(l.price)}`,
  ];
  if (l.verkehrswert) fm.push(`- **Verkehrswert:** ${eur(l.verkehrswert)}`);
  if (l.auction_discount_pct) fm.push(`- **Abschlag z. Verkehrswert:** ${l.auction_discount_pct} %`);
  if (l.living_area) fm.push(`- **Wohnfläche:** ${l.living_area} m²`);
  if (l.price_per_sqm) fm.push(`- **Preis/m²:** ${l.price_per_sqm} €`);
  if (l.rooms) fm.push(`- **Zimmer:** ${l.rooms}`);
  if (l.gross_yield_pct) fm.push(`- **Bruttorendite (geschätzt):** ${l.gross_yield_pct} %`);
  if (l.plz || l.city) fm.push(`- **Lage:** ${`${l.plz} ${l.city}`.trim()} (${l.bundesland})`);
  if (l.auction_date) fm.push(`- **Versteigerungstermin:** ${l.auction_date}`);
  if (l.court) fm.push(`- **Aktenzeichen:** ${l.court}`);
  if (l.flags?.length) fm.push("", "## Warum interessant", "", ...l.flags.map((f) => `- ${f}`));
  fm.push("", "---", "_Automatisch erstellt von immo-agent._");
  return fm.join("\n");
}

export function writeNotes(listings, cfg, maxNotes) {
  const sub = cfg.output?.vault_subdir || "wiki/immo";
  const dir = join(cfg._vaultRoot, sub);
  mkdirSync(dir, { recursive: true });
  let n = 0;
  for (const l of listings.slice(0, maxNotes)) {
    const f = `${l.source}-${slug(l.title)}-${String(l.source_id).slice(0, 8)}.md`;
    writeFileSync(join(dir, f), noteBody(l), "utf-8");
    n++;
  }
  console.log(`  obsidian: wrote ${n} notes to ${dir}`);
  return n;
}
