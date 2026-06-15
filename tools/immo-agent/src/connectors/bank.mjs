// Bank / insolvency / voluntary property auctions.
//
// Deutsche Grundstücksauktionen AG group (argetra) — public auction catalogue.
// The "immobilie-suchen-und-finden" page embeds every object as a JSON map
// marker: { infoWindow (HTML with object link, description, address, limit),
// latt, long, filter:{ region, category, limit, status } }. Parsing the JSON is
// far more robust than scraping the rendered cards, so we do that.
//
// Public catalogue => legal to read. Offline dev: sources.bank_auctions.sample_html.
import { readFileSync, existsSync } from "node:fs";
import { makeListing } from "../model.mjs";
import { guessPlz, decodeEntities } from "./parse.mjs";

const CATALOGUE =
  "https://www.dga-ag.de/immobilie-ersteigern/immobilie-suchen-und-finden.html";

// argetra category codes -> our taxonomy (prefix-based).
function mapCategory(cat) {
  const c = (cat || "").toUpperCase();
  if (c.startsWith("ETW")) return "wohnung";
  if (/^(EFH|MFH|RH|DHH|WGH|ZFH|HAUS)/.test(c)) return "haus";
  if (/^(GST|BAU|GRD|ACK|LAND)/.test(c)) return "grundstueck";
  if (/^(GEW|LAD|BUE|HALL)/.test(c)) return "gewerbe";
  return "";
}

export const name = "bank_auctions";

function parseCatalogue(html) {
  const out = [];
  // Each object is a JSON marker: {"infoWindow":"…","latt":…,…,"filter":{…}}
  const re = /\{"infoWindow":"((?:\\.|[^"\\])*)"[\s\S]*?"filter":\{([^}]*)\}\}/g;
  let m;
  while ((m = re.exec(html))) {
    const info = decodeEntities(m[1].replace(/\\\//g, "/").replace(/\\u00([0-9a-f]{2})/gi,
      (_, hh) => String.fromCharCode(parseInt(hh, 16))).replace(/\\"/g, '"'));
    const filter = m[2];

    const idM = /objekt\/([A-Z0-9-]+)\.html/i.exec(info);
    const limitM = /"limit":(\d+)/.exec(filter);
    const regionM = /"region":"([^"]*)"/.exec(filter);
    const catM = /"category":"([^"]*)"/.exec(filter);
    const lat = /"latt":([\d.-]+)/.exec(m[0]);
    const lng = /"long":([\d.-]+)/.exec(m[0]);

    // infoWindow segments are split by "|". Drop tags + the link/CTA segments.
    const segs = info.replace(/<[^>]+>/g, "|").split("|")
      .map((s) => s.trim()).filter(Boolean)
      .filter((s) => !/^(zum Objekt|Auktionslimit:|mehr|Details)/i.test(s) && !/\d{2}:\d{2}/.test(s));
    const desc = segs[0] || "Auktionsobjekt";
    const addr = segs.slice(1).find((s) => /\d{5}/.test(s)) || segs[1] || "";
    const street = segs[1] && segs[1] !== addr ? segs[1] : "";
    const plz = guessPlz(addr);
    const id = idM ? idM[1] : (regionM ? `${regionM[1]}-${limitM?.[1] || segs.length}` : desc.slice(0, 20));

    out.push(makeListing({
      source: "bank",
      source_id: id,
      url: idM
        ? `https://www.dga-ag.de/immobilie-ersteigern/immobilie-suchen-und-finden/objekt/${idM[1]}.html`
        : CATALOGUE,
      title: `${desc}${addr ? " — " + [street, addr].filter(Boolean).join(", ") : ""}`.slice(0, 160),
      property_type: mapCategory(catM?.[1]),
      price: limitM ? Number(limitM[1]) : null,   // Limit = starting price
      plz,
      city: addr.replace(/^\d{5}\s*/, "").trim(),
      bundesland: regionM ? regionM[1].replace(/\b\w/g, (c) => c.toUpperCase()) : "",
      lat: lat ? Number(lat[1]) : null,
      lng: lng ? Number(lng[1]) : null,
    }));
  }
  return out;
}

export async function fetchListings(cfg, http) {
  const src = cfg.sources?.bank_auctions || {};
  if (src.sample_html && existsSync(src.sample_html)) {
    return parseCatalogue(readFileSync(src.sample_html, "utf-8"));
  }
  const html = await http.getText(src.catalogue_url || CATALOGUE);
  if (!html) { console.log("  bank: no catalogue response"); return []; }
  const found = parseCatalogue(html);
  console.log(`  bank: ${found.length} objects`);
  return found;
}
