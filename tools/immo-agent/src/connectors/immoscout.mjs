// ImmoScout24 via the Piloterr Search API (third-party, structured JSON).
//
// ImmoScout24 has no usable public API and blocks bots with Cloudflare. Piloterr
// returns listings as JSON and handles the bypass. ToS-sensitive: we store only
// listing FACTS (price, m², rooms, location); agent/realtor PII (names, phones)
// is deliberately NOT persisted — see wiki/sources/german-scraping-legality.md.
//
// Requires IMMO_PILOTERR_KEY in the environment. Disabled by default in config.
// The Piloterr endpoint was "suspended for maintenance" at research time
// (2026-06-11); if the call fails this connector logs and returns [].
import { makeListing } from "../model.mjs";

const ENDPOINT = "https://piloterr.com/api/v2/immoscout24/search";
const TYPE_MAP = {
  apartmentbuy: "wohnung", apartmentrent: "wohnung",
  housebuy: "haus", houserent: "haus",
  livingbuysite: "grundstueck", livingrentsite: "grundstueck",
};

export const name = "immoscout";

function num(v) {
  if (v == null || v === "") return null;
  const n = Number(String(v).replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function toListing(item) {
  const rt = String(item.realEstateType || item.type || "").toLowerCase();
  return makeListing({
    source: "immoscout",
    source_id: String(item.id ?? item.exposeId ?? item.url),
    url: item.url || "",
    title: item.title || "",
    property_type: TYPE_MAP[rt] || "",
    price: num(item.price ?? item.buyPrice),
    cold_rent: num(item.coldRent ?? item.baseRent),
    living_area: num(item.livingArea ?? item.area),
    rooms: num(item.rooms ?? item.numberOfRooms),
    city: item.city || "",
    plz: String(item.postcode ?? item.zip ?? ""),
    lat: num(item.lat ?? item.latitude),
    lng: num(item.lng ?? item.longitude),
  });
}

export async function fetchListings(cfg, http) {
  const src = cfg.sources?.immoscout || {};
  // Default to the headless-browser route (no paid API). Use Piloterr only when
  // explicitly selected AND a key is present.
  const method = src.method || "browser";
  if (method === "browser") {
    const browser = await import("./immoscout-browser.mjs");
    return browser.fetchListings(cfg, http);
  }
  return fetchViaPiloterr(cfg, http);
}

async function fetchViaPiloterr(cfg, http) {
  const key = cfg.sources?.immoscout?.api_key;
  if (!key) { console.log("  immoscout: IMMO_PILOTERR_KEY not set — skipping"); return []; }
  const cities = cfg.regions?.cities?.length ? cfg.regions.cities : [""];
  const out = [];
  for (const city of cities) {
    const url = `${ENDPOINT}?${new URLSearchParams({ query: city, country: "de" })}`;
    const data = await http.getJson(url, { headers: { "x-api-key": key } });
    if (!data) continue;
    for (const item of data.results || data.listings || []) out.push(toListing(item));
  }
  console.log(`  immoscout: ${out.length} listings`);
  return out;
}
