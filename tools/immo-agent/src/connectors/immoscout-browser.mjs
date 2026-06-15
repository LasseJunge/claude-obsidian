// ImmoScout24 via a real headless browser (Playwright) — no paid API.
//
// Why a browser: IS24 fronts everything with Cloudflare bot detection, so a
// plain fetch() gets a challenge page. A real Chromium executes the JS challenge
// and presents a genuine fingerprint, so it passes naturally. We then capture
// IS24's OWN search-result JSON (the page fetches it from its geo-search API) via
// Playwright network interception — far more robust than scraping DOM cards,
// which IS24 reshuffles often. A DOM fallback covers the case where the API
// shape changes.
//
// ToS note: IS24 forbids automated access; this is personal-use, your machine,
// your IP, no third-party scraping service. Only listing FACTS are stored — no
// agent/realtor PII. See wiki/sources/german-scraping-legality.md.
//
// Playwright is an OPTIONAL dependency (keeps the rest of the tool zero-dep):
//   npm install playwright && npx playwright install chromium
import { makeListing } from "../model.mjs";
import { euro } from "./parse.mjs";

export const name = "immoscout";

const TYPE_PATH = { wohnung: "wohnung-kaufen", haus: "haus-kaufen", grundstueck: "grundstueck-kaufen" };
const TYPE_MAP = {
  apartmentbuy: "wohnung", apartment: "wohnung",
  housebuy: "haus", house: "haus",
  livingbuysite: "grundstueck", site: "grundstueck",
};

function num(v) {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

// Build an IS24 search URL for a city + path segment (+ price ceiling + page).
function searchUrl(city, path, maxPrice, page = 1) {
  const slug = (city || "").toLowerCase().replace(/\s+/g, "-");
  const params = [];
  if (maxPrice) params.push(`price=-${maxPrice}`);
  if (page > 1) params.push(`pagenumber=${page}`);
  const q = params.length ? `?${params.join("&")}` : "";
  return `https://www.immobilienscout24.de/Suche/de/${slug}/${slug}/${path}${q}`;
}

// Map IS24's type label (e.g. "search:ApartmentBuy", "apartmentBuy") to ours.
function mapType(re) {
  const rt = String(re["@xsi.type"] || re.realEstateType || "").toLowerCase();
  if (rt.includes("apartment")) return "wohnung";
  if (rt.includes("house") || rt.includes("haus")) return "haus";
  if (rt.includes("site") || rt.includes("grund")) return "grundstueck";
  if (rt.includes("commercial") || rt.includes("office") || rt.includes("store")) return "gewerbe";
  return "";
}

// Normalize one IS24 result entry (the realEstate object) into a Listing.
// IS24 addresses carry no Bundesland. For the three city-states the city name
// IS the Bundesland, so derive it — keeps region matching robust even if a
// config only lists Bundesländer.
const CITY_STATES = new Set(["hamburg", "berlin", "bremen"]);

function entryToListing(re, source = "immoscout") {
  const addr = re.address || {};
  const city = addr.city || "";
  return makeListing({
    source,
    source_id: String(re["@id"] || re.id || re.exposeId || ""),
    url: re["@id"] ? `https://www.immobilienscout24.de/expose/${re["@id"]}` : (re.url || ""),
    title: re.title || "",
    property_type: mapType(re),
    price: num(re.price?.value ?? re.price) || null,   // 0 == "Preis auf Anfrage"
    living_area: num(re.livingSpace ?? re.area),
    rooms: num(re.numberOfRooms ?? re.rooms),
    city,
    plz: String(addr.postcode || ""),
    bundesland: CITY_STATES.has(city.toLowerCase()) ? city : "",
    lat: num(addr.wgs84Coordinate?.latitude),
    lng: num(addr.wgs84Coordinate?.longitude),
  });
}

// IS24 embeds the results as a JSON blob in the page HTML (assigned to
// `resultListModel: {...}` inside IS24.resultList), NOT in an XHR — so we
// brace-match that object out of the HTML and feed it to extractEntries().
export function extractFromHtml(html) {
  const marker = html.indexOf("resultListModel:");
  if (marker === -1) return [];
  const start = html.indexOf("{", marker);
  if (start === -1) return [];
  let depth = 0, inStr = false, esc = false, end = -1;
  for (let j = start; j < html.length; j++) {
    const c = html[j];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}" && --depth === 0) { end = j + 1; break; }
  }
  if (end === -1) return [];
  try {
    const model = JSON.parse(html.slice(start, end));
    return extractEntries(model.searchResponseModel || model);
  } catch { return []; }
}

// Total result pages reported by the embedded model (for pagination).
function pageCount(html) {
  const m = /"numberOfPages":\s*"?(\d+)/.exec(html);
  return m ? Number(m[1]) : 1;
}

// Foreclosures expose the starting bid in a separate `search_result_list`
// block (the realEstate object has no price). Map expose_id -> Mindestgebot €.
function parseBidMap(html) {
  const map = new Map();
  const re = /"expose_id":"(\d+)"[\s\S]*?"minimum_bid":"([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    const v = euro(m[2]);
    if (v != null) map.set(m[1], v);
  }
  return map;
}

// Pull result entries out of whatever JSON IS24's search API returned.
function extractEntries(json) {
  // Known shape: searchResponseModel["resultlist.resultlist"].resultlistEntries[].resultlistEntry[]
  const root = json?.["searchResponseModel"]?.["resultlist.resultlist"]
    ?? json?.["resultlist.resultlist"] ?? json;
  const groups = root?.resultlistEntries || root?.resultListEntries || [];
  const entries = [];
  for (const g of [].concat(groups)) {
    for (const e of [].concat(g?.resultlistEntry || g?.resultListEntry || [])) {
      const re = e?.["resultlist.realEstate"] || e?.realEstate || e;
      if (re && (re.price || re.livingSpace || re["@id"])) entries.push(re);
    }
  }
  return entries;
}

// IS24's bot wall ("Ich bin kein Roboter" / Cloudflare). Strong enough that
// plain headless Chromium is always blocked. The working pattern:
//   1. First run with sources.immoscout.debug=true -> a HEADFUL window opens;
//      solve the "Ich bin kein Roboter" challenge once by hand.
//   2. The session persists in tools/immo-agent/.is24-profile, so later runs
//      (even headless in the nightly cron) reuse the cleared cookies until they
//      expire — then just re-run with debug=true once more.
function isBotWall(title, status) {
  return status === 401 || /just a moment|attention required|cloudflare|kein roboter|robot/i.test(title || "");
}

// Light stealth: hide the most obvious automation tells.
const STEALTH = () => {
  Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  Object.defineProperty(navigator, "languages", { get: () => ["de-DE", "de"] });
  Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
  window.chrome = { runtime: {} };
};

export async function fetchListings(cfg, _http) {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.log("  immoscout(browser): playwright not installed — run "
      + "`npm install playwright && npx playwright install chromium` in tools/immo-agent. Skipping.");
    return [];
  }

  const src = cfg.sources?.immoscout || {};
  const debug = !!src.debug;
  const cities = cfg.regions?.cities?.length ? cfg.regions.cities : [""];
  const types = (cfg.property_types || ["wohnung"]).filter((t) => TYPE_PATH[t]);
  const maxPrice = cfg.price?.max || "";
  const maxPages = src.max_pages || 50;   // page through all results (cap as a backstop)
  const ua = cfg.http?.user_agent
    || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

  // Preferred: ATTACH to a real Chrome the user launched themselves (genuine
  // fingerprint — IS24 can't tell it's automated). The launcher script opens
  // Chrome with --remote-debugging-port; we connect over CDP. If that fails,
  // fall back to launching our own Chromium (usually hard-blocked by IS24).
  const cdpUrl = src.cdp_url || process.env.IMMO_CDP_URL || "http://127.0.0.1:9222";
  const { fileURLToPath } = await import("node:url");
  const { dirname, join } = await import("node:path");

  let browser, ctx, attached = false;
  try {
    browser = await chromium.connectOverCDP(cdpUrl);
    ctx = browser.contexts()[0] || (await browser.newContext());
    attached = true;
    console.log(`  immoscout(browser): attached to your Chrome at ${cdpUrl}`);
  } catch {
    const profileDir = src.profile_dir
      || join(dirname(fileURLToPath(import.meta.url)), "..", "..", ".is24-profile");
    console.log(`  immoscout(browser): no Chrome on ${cdpUrl} — launching own browser `
      + `(IS24 usually blocks this; use the run-is24 launcher to attach instead).`);
    ctx = await chromium.launchPersistentContext(profileDir, {
      headless: !debug, locale: "de-DE", userAgent: ua,
      viewport: { width: 1366, height: 900 },
      args: ["--disable-blink-features=AutomationControlled"],
    });
    await ctx.addInitScript(STEALTH);
    browser = ctx.browser();
  }
  // Reuse an already-open tab when attached (the launcher opened the search), else new.
  const page = (attached && ctx.pages()[0]) || (await ctx.newPage());

  // Each city is searched once per "spec": the configured property types, plus
  // IS24's own Zwangsversteigerung (foreclosure) category — which lists Hamburg
  // auctions the official zvg-portal often doesn't carry.
  const specs = (types.length ? types : ["wohnung"]).map((t) => ({
    label: t, path: TYPE_PATH[t] || "wohnung-kaufen", source: "immoscout", forcedType: t,
  }));
  if (src.foreclosures !== false) {
    specs.push({ label: "zwangsversteigerung", path: "zwangsversteigerung", source: "is24-zvg", forcedType: "" });
  }

  const out = [];
  const seenIds = new Set();
  try {
    const timeout = (cfg.http?.timeout_seconds || 30) * 1000;
    // Load a URL while capturing the page's JSON responses (for diagnostics).
    const load = async (targetUrl) => {
      const captured = [];
      const onResp = async (resp) => {
        if (!(resp.headers()["content-type"] || "").includes("json")) return;
        try { captured.push({ url: resp.url(), json: await resp.json() }); } catch { /* not json */ }
      };
      page.on("response", onResp);
      try { await page.goto(targetUrl, { waitUntil: "networkidle", timeout }); }
      catch (e) { console.log(`  immoscout(browser): nav ${targetUrl}: ${e.message}`); }
      page.off("response", onResp);
      return captured;
    };

    for (const city of cities) {
      for (const spec of specs) {
        let specAdded = 0, totalPages = 1;
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          const url = searchUrl(city, spec.path, maxPrice, pageNum);
          let captured = await load(url);

          // Bot-wall detection (only really expected on the first page).
          const title = await page.title().catch(() => "");
          if (isBotWall(title, 200)) {
            if (debug) {
              console.log(`  immoscout(browser): bot wall on ${city}/${spec.label} — `
                + `solve the challenge in the open window (waiting up to 120s)…`);
              await page.waitForFunction(
                () => !/kein roboter|just a moment|robot/i.test(document.title),
                { timeout: 120000 }).catch(() => {});
              captured = await load(url);
            } else {
              console.log(`  immoscout(browser): bot wall on ${city}/${spec.label}. `
                + `Run via the run-is24 launcher (attaches to your real Chrome).`);
              break;
            }
          }

          const html = await page.content().catch(() => "");
          if (pageNum === 1) totalPages = Math.min(maxPages, pageCount(html) || 1);

          let entries = extractFromHtml(html);
          if (!entries.length) entries = captured.flatMap((c) => extractEntries(c.json));

          // Foreclosures: merge the Mindestgebot (starting bid) in as price.
          const bids = spec.source === "is24-zvg" ? parseBidMap(html) : null;

          let pageAdded = 0;
          for (const re of entries) {
            const l = entryToListing(re, spec.source);
            if (!l.source_id || seenIds.has(l.source_id)) continue;
            seenIds.add(l.source_id);
            if (city && !l.city) l.city = city;
            if (!l.property_type && spec.forcedType) l.property_type = spec.forcedType;
            if (bids && l.price == null) l.price = bids.get(l.source_id) ?? null;
            out.push(l);
            pageAdded++; specAdded++;
          }

          // Diagnostics: only the first page, to avoid clutter.
          if (debug && pageNum === 1) {
            const { writeFileSync } = await import("node:fs");
            const tag = `${city}-${spec.label}`.replace(/[^\w-]/g, "");
            await page.screenshot({ path: `is24-${tag}.png`, fullPage: true }).catch(() => {});
            try { writeFileSync(`is24-page-${tag}.html`, html, "utf-8"); } catch { /* ignore */ }
            try {
              writeFileSync(`is24-debug-${tag}.json`, JSON.stringify({
                url, title, totalPages, entriesFound: entries.length, sampleEntry: entries[0] || null,
              }, null, 2), "utf-8");
            } catch { /* ignore */ }
          }

          if (!entries.length) break;   // nothing more to page through
        }
        console.log(`  immoscout(browser): ${city}/${spec.label} -> ${specAdded} listings (${totalPages} page${totalPages > 1 ? "s" : ""})`);
      }
    }
  } finally {
    if (attached) {
      // Leave the user's Chrome open — just detach.
      await browser.close().catch(() => {});   // for CDP this disconnects, doesn't quit Chrome
    } else {
      await ctx.close().catch(() => {});
      if (browser) await browser.close().catch(() => {});
    }
  }
  return out;
}
