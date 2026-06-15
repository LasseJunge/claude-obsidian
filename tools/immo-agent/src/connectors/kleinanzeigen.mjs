// Kleinanzeigen (formerly eBay Kleinanzeigen) real-estate sales.
//
// Public listing pages, server-rendered HTML. We hit the buy categories and
// parse result cards. Only listing facts stored — no seller PII. Defensive
// regex parsing (no DOM lib). Offline dev: sources.kleinanzeigen.sample_html.
import { readFileSync, existsSync } from "node:fs";
import { makeListing } from "../model.mjs";
import { guessPlz, stripTags, numBefore } from "./parse.mjs";

const BASE = "https://www.kleinanzeigen.de";
const CAT_PATHS = {
  haus: "/s-haus-kaufen/c208",
  wohnung: "/s-eigentumswohnung/c196",
  grundstueck: "/s-grundstuecke/c209",
};

export const name = "kleinanzeigen";

function parseCards(html, forcedType) {
  const out = [];
  // Each result is an <article class="aditem" data-adid="…"> … </article>.
  const re = /<article\b[^>]*class="[^"]*aditem[^"]*"[^>]*>([\s\S]*?)<\/article>/gi;
  let m;
  while ((m = re.exec(html))) {
    const card = m[0];
    const idM = /data-adid="(\d+)"/.exec(card) || /\/(\d{6,})-/.exec(card);
    const hrefM = /href="([^"]+)"/.exec(card);
    if (!hrefM) continue;
    const href = hrefM[1].startsWith("http") ? hrefM[1] : BASE + hrefM[1];
    const text = stripTags(card);
    const priceM = /([\d.]+)\s*€/.exec(text);
    const titleM = /<h2[^>]*>([\s\S]*?)<\/h2>/i.exec(card);
    out.push(makeListing({
      source: "kleinanzeigen",
      source_id: idM ? idM[1] : href,
      url: href,
      title: stripTags(titleM ? titleM[1] : text).slice(0, 120),
      property_type: forcedType || "",
      price: priceM ? Number(priceM[1].replace(/\./g, "")) : null,
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
  const types = (cfg.property_types || Object.keys(CAT_PATHS)).filter((t) => CAT_PATHS[t]);
  const cities = cfg.regions?.cities?.length ? cfg.regions.cities : [""];
  const out = [];
  for (const t of types.length ? types : Object.keys(CAT_PATHS)) {
    for (const city of cities) {
      const loc = city ? `/l-${city.toLowerCase()}` : "";
      const html = await http.getText(`${BASE}${loc}${CAT_PATHS[t]}`);
      if (html) out.push(...parseCards(html, t));
    }
  }
  console.log(`  kleinanzeigen: ${out.length} listings`);
  return out;
}
