// Derive €/m², gross yield, auction discount, and an interest score.

const round = (v, d = 2) => (v == null ? null : Math.round(v * 10 ** d) / 10 ** d);

const AUCTION_SOURCES = new Set(["zvg", "bank"]);

// Auctions can use a wider region (auction_regions) than flat searches, since
// forced auctions are rare in a single city — see config.auction_regions.
function regionFor(l, cfg) {
  if (AUCTION_SOURCES.has(l.source) && cfg.auction_regions) return cfg.auction_regions;
  return cfg.regions || {};
}

function matchesRegion(l, cfg) {
  const r = regionFor(l, cfg);
  const bl = (r.bundeslaender || []).map((x) => x.toLowerCase());
  const plz = r.plz_prefixes || [];
  const cities = (r.cities || []).map((x) => x.toLowerCase());
  if (!bl.length && !plz.length && !cities.length) return true;
  if (bl.length && l.bundesland && bl.includes(l.bundesland.toLowerCase())) return true;
  if (cities.length && l.city && cities.includes(l.city.toLowerCase())) return true;
  if (plz.length && l.plz && plz.some((p) => l.plz.startsWith(p))) return true;
  return false;
}

function matchesType(l, cfg) {
  const want = (cfg.property_types || []).map((x) => x.toLowerCase());
  if (!want.length || !l.property_type) return true;
  return want.includes(l.property_type.toLowerCase());
}

function matchesPrice(l, cfg) {
  const { min = 0, max } = cfg.price || {};
  if (l.price == null) return true;
  if (l.price < min) return false;
  if (max && l.price > max) return false;
  return true;
}

export function enrich(l, cfg) {
  const benchmark = Number(cfg.rent_benchmark_eur_sqm || 0);
  if (l.living_area > 0 && l.price) l.price_per_sqm = round(l.price / l.living_area, 1);

  let annualRent = null;
  if (l.cold_rent) annualRent = l.cold_rent * 12;
  else if (l.living_area && benchmark) annualRent = l.living_area * benchmark * 12;
  if (annualRent && l.price > 0) l.gross_yield_pct = round((100 * annualRent) / l.price);

  if (l.verkehrswert > 0 && l.price)
    l.auction_discount_pct = round((100 * (l.verkehrswert - l.price)) / l.verkehrswert, 1);
  return l;
}

export function scoreAndFlag(l, cfg) {
  const y = cfg.yield || {};
  let score = 0;
  const flags = [];

  if (y.min_gross_yield_pct && l.gross_yield_pct >= y.min_gross_yield_pct) {
    score += l.gross_yield_pct;
    flags.push(`Bruttorendite ${l.gross_yield_pct}% ≥ ${y.min_gross_yield_pct}%`);
  }
  if (y.min_auction_discount_pct && l.auction_discount_pct >= y.min_auction_discount_pct) {
    score += l.auction_discount_pct;
    flags.push(`Zwangsversteigerung: ${l.auction_discount_pct}% unter Verkehrswert`);
  }
  if (y.max_price_per_sqm && l.price_per_sqm && l.price_per_sqm <= y.max_price_per_sqm) {
    score += Math.max(0, (y.max_price_per_sqm - l.price_per_sqm) / 100);
    flags.push(`${l.price_per_sqm} €/m² ≤ ${y.max_price_per_sqm} €/m²`);
  }
  l.score = round(score);
  l.flags = flags;
  return l;
}

// Hard filters (region/type/price). Yield is a soft score, not a filter.
export const passesFilters = (l, cfg) =>
  matchesRegion(l, cfg) && matchesType(l, cfg) && matchesPrice(l, cfg);
