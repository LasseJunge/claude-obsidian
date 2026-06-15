// Listing factory + helpers. A listing is a plain object; these keep it consistent.
import { createHash } from "node:crypto";

export function makeListing(p) {
  return {
    source: p.source, source_id: String(p.source_id), url: p.url || "",
    title: (p.title || "").slice(0, 160),
    property_type: p.property_type || "",
    price: p.price ?? null, verkehrswert: p.verkehrswert ?? null,
    cold_rent: p.cold_rent ?? null, living_area: p.living_area ?? null,
    rooms: p.rooms ?? null,
    city: p.city || "", plz: p.plz || "", bundesland: p.bundesland || "",
    lat: p.lat ?? null, lng: p.lng ?? null,
    auction_date: p.auction_date || "", court: p.court || "",
    // derived (filled by normalize):
    price_per_sqm: null, gross_yield_pct: null, auction_discount_pct: null,
    score: 0, flags: [],
    // bookkeeping:
    first_seen: "", last_seen: "", status: "active",
  };
}

export const uid = (l) => `${l.source}:${l.source_id}`;

export const fingerprint = (l) =>
  createHash("sha1")
    .update(`${l.price}|${l.verkehrswert}|${l.auction_date}|${l.title}`)
    .digest("hex")
    .slice(0, 12);
