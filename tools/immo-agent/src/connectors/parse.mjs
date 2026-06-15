// Shared, dependency-free parsing helpers for the HTML connectors.
// We deliberately avoid a DOM library: the portals' markup is not contractually
// stable anyway, so robust pattern extraction beats brittle CSS selectors.

const EURO_RE = /([\d.]{4,})(?:,(\d{2}))?\s*(?:€|EUR)/i;
const PLZ_RE = /\b(\d{5})\b/;
const DATE_RE = /(\d{1,2})\.(\d{1,2})\.(\d{4})/;

const TYPE_HINTS = [
  ["eigentumswohnung", "wohnung"], ["wohnung", "wohnung"], ["etw", "wohnung"],
  ["einfamilienhaus", "haus"], ["doppelhaus", "haus"], ["reihenhaus", "haus"],
  ["mehrfamilienhaus", "haus"], ["haus", "haus"],
  ["grundstück", "grundstueck"], ["grundstueck", "grundstueck"],
  ["gewerbe", "gewerbe"], ["halle", "gewerbe"], ["büro", "gewerbe"],
];

export function euro(text) {
  if (!text) return null;
  const m = EURO_RE.exec(text.replace(/ /g, " "));
  if (!m) return null;
  const whole = m[1].replace(/\./g, "");
  const cents = m[2] || "00";
  const v = Number(`${whole}.${cents}`);
  return Number.isFinite(v) ? v : null;
}

export function guessType(text) {
  const low = (text || "").toLowerCase();
  for (const [hint, t] of TYPE_HINTS) if (low.includes(hint)) return t;
  return "";
}

export function guessPlz(text) {
  const m = PLZ_RE.exec(text || "");
  return m ? m[1] : "";
}

export function isoDate(text) {
  const m = DATE_RE.exec(text || "");
  if (!m) return "";
  const [, d, mth, y] = m;
  return `${y}-${String(mth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const ENTITIES = {
  "&auml;": "ä", "&ouml;": "ö", "&uuml;": "ü", "&Auml;": "Ä", "&Ouml;": "Ö",
  "&Uuml;": "Ü", "&szlig;": "ß", "&amp;": "&", "&nbsp;": " ", "&#128;": "€",
  "&euro;": "€", "&gt;": ">", "&lt;": "<", "&quot;": '"',
};

export const decodeEntities = (s) =>
  (s || "").replace(/&[A-Za-z#0-9]+;/g, (e) => ENTITIES[e] ?? e);

// Strip tags -> plain text (for turning an HTML fragment into searchable text).
export const stripTags = (html) =>
  decodeEntities((html || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

// Pull a number like "120,5 m²" / "3 Zimmer" out of text.
export function numBefore(text, unitRe) {
  const m = new RegExp(`([\\d.,]+)\\s*${unitRe}`, "i").exec(text || "");
  if (!m) return null;
  const v = Number(m[1].replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) ? v : null;
}

// Find anchor tags whose href matches a pattern; return {href, text} pairs by
// slicing the surrounding HTML block so we keep nearby fields together.
export function anchorBlocks(html, hrefRe) {
  const out = [];
  const re = new RegExp(`<a\\b[^>]*href=["']([^"']*${hrefRe}[^"']*)["'][^>]*>([\\s\\S]*?)<\\/a>`, "ig");
  let m;
  while ((m = re.exec(html))) {
    const start = Math.max(0, m.index - 600);
    const end = Math.min(html.length, re.lastIndex + 600);
    out.push({ href: m[1], anchorText: stripTags(m[2]), block: stripTags(html.slice(start, end)) });
  }
  return out;
}
