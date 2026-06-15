// Zwangsversteigerungen (forced auctions) from zvg-portal.de.
//
// zvg-portal.de is the official joint portal of the German Länder justice
// administrations. Its data is PUBLIC (court auction announcements), so
// accessing it is legal — unlike the commercial listing portals. There is no
// JSON API; it's a server-rendered ISO-8859-1 PHP app.
//
// Verified live flow (2026-06):
//   1. GET  index.php?button=Termine suchen   (loads the search form)
//   2. POST index.php?button=Suchen           with land_abk + filters, all=1
//   The result page is a flat list of object blocks, each starting with an
//   "Aktenzeichen" row, followed by Amtsgericht / Objekt-Lage / Verkehrswert /
//   Termin. The zvg_id lives in the attachment (showAnhang) link. The site is
//   stateless (no session cookie needed). Markup isn't contractual — parsing is
//   pattern-based and isolated in parseResults(); adjust there if it changes.
//
// Offline dev/testing: set sources.zvg.sample_html to a saved result page.
import { readFileSync, existsSync } from "node:fs";
import { makeListing } from "../model.mjs";
import { euro, guessType, guessPlz, stripTags } from "./parse.mjs";

const BASE = "https://www.zvg-portal.de/index.php";

const LAND_ABK = {
  "baden-württemberg": "bw", bayern: "by", berlin: "be", brandenburg: "br",
  bremen: "hb", hamburg: "hh", hessen: "he", "mecklenburg-vorpommern": "mv",
  niedersachsen: "ni", "nordrhein-westfalen": "nw", "rheinland-pfalz": "rp",
  saarland: "sl", sachsen: "sn", "sachsen-anhalt": "st",
  "schleswig-holstein": "sh", thüringen: "th",
};
const ABK_TO_LAND = Object.fromEntries(Object.entries(LAND_ABK).map(([k, v]) => [v, k]));

const MONTHS = {
  januar: 1, februar: 2, märz: 3, april: 4, mai: 5, juni: 6, juli: 7,
  august: 8, september: 9, oktober: 10, november: 11, dezember: 12,
};
const AKTEN_RE = /(\d{1,4}\s*K\s*\d{1,5}\/\d{2,4})/i;
// "Montag, 15. Juni 2026, 09:30 Uhr"
const TERMIN_RE = /(\d{1,2})\.\s*([A-Za-zÄÖÜäöü]+)\s*(\d{4})/;

export const name = "zvg";

function lands(cfg) {
  const names = (cfg.regions?.bundeslaender || []).map((n) => n.toLowerCase());
  const abks = names.map((n) => LAND_ABK[n]).filter(Boolean);
  return abks.length ? abks : Object.values(LAND_ABK);
}

function germanDateToIso(text) {
  const m = TERMIN_RE.exec(text);
  if (!m) return "";
  const month = MONTHS[m[2].toLowerCase()];
  if (!month) return "";
  return `${m[3]}-${String(month).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}`;
}

// Pull "Objekt/Lage  TYPE : ADDRESS" out of a (tag-stripped) block.
function objektLage(block) {
  const text = stripTags(block).replace(/&nbsp;/g, " ").replace(/&szlig;/g, "ß");
  const m = /Objekt\/Lage\s*([^:]*?)\s*:\s*(.+?)(?:\s*Verkehrswert|\s*Termin|\s*Amtliche|$)/i.exec(text);
  if (!m) return { typeText: "", address: "" };
  return { typeText: m[1].replace(/\s+/g, " ").trim(), address: m[2].replace(/\s+/g, " ").trim() };
}

function parseResults(html, abk) {
  const out = [];
  // Each object block begins at an "Aktenzeichen" marker.
  const blocks = html.split(/Aktenzeichen/i).slice(1);
  for (const rawBlock of blocks) {
    const block = stripTags(rawBlock.slice(0, 2000)).replace(/&nbsp;/g, " ");
    // Skip cancelled/withdrawn appointments.
    if (/aufgehoben|abgesetzt|aufgehobene/i.test(block) &&
        !/Objekt\/Lage/i.test(rawBlock)) continue;

    const akten = AKTEN_RE.exec(block);
    if (!akten) continue;

    const idM = /zvg_id=(\d+)/i.exec(rawBlock);
    const { typeText, address } = objektLage(rawBlock);
    // Verkehrswert is often "s. Beschreibung oben" (only in the PDF); capture
    // it only when an inline number is present.
    // Require German thousands-grouped formatting (e.g. 320.000,00) so we don't
    // mistake a year (2026) or PLZ (23552) for a Verkehrswert.
    const vwM = /Verkehrswert[^\d]{0,30}?(\d{1,3}(?:\.\d{3})+(?:,\d{2})?)/i.exec(block);
    const vw = vwM ? euro(vwM[1] + " €") : null;
    const ptype = guessType(typeText || block);
    const bl = ABK_TO_LAND[abk] || "";
    const az = akten[1].replace(/\s+/g, " ").trim();
    const zvgId = idM ? idM[1] : az.replace(/\W+/g, "");

    const url = idM
      ? `https://www.zvg-portal.de/index.php?button=showZvg&zvg_id=${zvgId}&land_abk=${abk}`
      : "https://www.zvg-portal.de/index.php?button=Termine%20suchen";

    out.push(makeListing({
      source: "zvg",
      source_id: zvgId,
      url,
      title: `${typeText || "Zwangsversteigerung"}${address ? " — " + address : ""}`,
      property_type: ptype,
      price: vw,            // bidding opens around the Verkehrswert
      verkehrswert: vw,
      plz: guessPlz(address),
      bundesland: bl ? bl.replace(/\b\w/g, (c) => c.toUpperCase()) : "",
      auction_date: germanDateToIso(block),
      court: az,
    }));
  }
  return out;
}

export async function fetchListings(cfg, http) {
  const src = cfg.sources?.zvg || {};
  if (src.sample_html && existsSync(src.sample_html)) {
    return parseResults(readFileSync(src.sample_html, "utf-8"), src.sample_land || "by");
  }
  const maxPages = src.max_pages || 3;
  const out = [];
  for (const abk of lands(cfg)) {
    // 1) load the search form (some deployments require this priming GET)
    await http.getText(`${BASE}?button=Termine%20suchen`, { encoding: "latin1" });
    // 2) submit the per-Land search (all=1 returns the full first page)
    let total = 0;
    for (let page = 1; page <= maxPages; page++) {
      const qs = page === 1 ? "?button=Suchen" : `?button=Suchen&seite=${page}&l=1&r=11`;
      const html = await http.postText(`${BASE}${qs}`, {
        land_abk: abk, ger_id: "0", order_by: "2", all: "1",
        ger_name: "", az1: "", az2: "", az3: "", az4: "",
        art: "", obj: "", str: "", hnr: "", plz: "", ort: "", ortsteil: "",
      }, { encoding: "latin1" });
      if (!html) break;
      const found = parseResults(html, abk);
      out.push(...found);
      total += found.length;
      if (!/blaettern\(['"]?\d+/.test(html) || found.length === 0) break; // no more pages
    }
    if (total) console.log(`  zvg: ${abk} -> ${total} objects`);
  }
  return out;
}
