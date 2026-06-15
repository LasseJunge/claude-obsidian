// Kleinanzeigen (formerly eBay Kleinanzeigen) real-estate sales.
//
// Public listing pages, server-rendered HTML. IMPORTANT: Kleinanzeigen filters
// by a numeric LOCATION ID, not a city name — a bare "/l-hamburg/" segment is
// ignored and returns nationwide results. We resolve the location id per city
// via the site's own autocomplete endpoint, then build the proper URL
// (/s-<category>/<city>/c<catId>l<locId>). Only listing facts stored — no PII.
//
// Offline dev: sources.kleinanzeigen.sample_html.
import { readFileSync, existsSync } from "node:fs";
import { makeListing } from "../model.mjs";
import { guessPlz, stripTags, numBefore } from "./parse.mjs";

const BASE = "https://www.kleinanzeigen.de";
const LOC_API = `${BASE}/s-ort-empfehlungen.json`;
// property type -> { category slug, category id }
const CATS = {
  haus: { slug: "haus-kaufen", id: "c208" },
  wohnung: { slug: "eigentumswohnung", id: "c196" },
  grundstueck: { slug: "grundstuecke", id: "c209" },
};

export const name = "kleinanzeigen";

const citySlug = (c) =>
  (c || "").toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe")
    .replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-");

// Resolve a city name to Kleinanzeigen's location id (e.g. Hamburg -> 9409).
async function resolveLocationId(city, http) {
  const json = await http.getJson(`${LOC_API}?query=${encodeURIComponent(city)}`);
  if (!json) return null;
  // Keys look like "_9409"; value is the place name. Prefer an exact match.
  const entries = Object.entries(json).filter(([k]) => k !== "_0");
  const exact = entries.find(([, v]) => v.toLowerCase() === city.toLowerCase());
  const pick = exact || entries[0];
  return pick ? pick[0].replace(/^_/, "") : null;
}

function parseCards(html, forcedType) {
  const out = [];
  const re = /<article\b[^>]*class="[^"]*aditem[^"]*"[^>]*>([\s\S]*?)<\/article>/gi;
  let m;
  while ((m = re.exec(html))) {
    const card = m[0];
    const idM = /data-adid="(\d+)"/.exec(card) || /\/(\d{6,})-/.exec(card);
    const hrefM = /href="([^"]+)"/.exec(card);
    if (!hrefM) continue;
    const href = hrefM[1].startsWith("http") ? hrefM[1] : BASE + hrefM[1];
    const text = stripTags(card);
    // A card can show several € figures (price, Kaution, "ab …"). The sale price
    // is the largest, so take the max rather than the first match.
    const prices = [...text.matchAll(/([\d.]+)\s*€/g)]
      .map((p) => Number(p[1].replace(/\./g, "")))
      .filter((n) => Number.isFinite(n) && n > 0);
    const price = prices.length ? Math.max(...prices) : null;
    const titleM = /<h2[^>]*>([\s\S]*?)<\/h2>/i.exec(card);
    out.push(makeListing({
      source: "kleinanzeigen",
      source_id: idM ? idM[1] : href,
      url: href,
      title: stripTags(titleM ? titleM[1] : text).slice(0, 120),
      property_type: forcedType || "",
      price,
      living_area: numBefore(text, "m²"),
      rooms: numBefore(text, "Zimmer"),
      plz: guessPlz(text),
    }));
  }
  return out;
}

export async function fetchListings(cfg, http) {
  const src = cfg.sources?.kleinanzeigen || {};
  if (src.sample_html && existsSync(src.sample_html)) {
    return parseCards(readFileSync(src.sample_html, "utf-8"), "");
  }
  const types = (cfg.property_types || Object.keys(CATS)).filter((t) => CATS[t]);
  const cities = cfg.regions?.cities?.length ? cfg.regions.cities : [];
  if (!cities.length) {
    console.log("  kleinanzeigen: no cities configured (location filter needs one) — skipping");
    return [];
  }
  const out = [];
  for (const city of cities) {
    const locId = await resolveLocationId(city, http);
    if (!locId) { console.log(`  kleinanzeigen: could not resolve location '${city}' — skipping`); continue; }
    for (const t of types.length ? types : Object.keys(CATS)) {
      const { slug, id } = CATS[t];
      const url = `${BASE}/s-${slug}/${citySlug(city)}/${id}l${locId}`;
      const html = await http.getText(url);
      if (html) out.push(...parseCards(html, t));
    }
  }
  console.log(`  kleinanzeigen: ${out.length} listings`);
  return out;
}
