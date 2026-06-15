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

// Build the IS24 search URL for a city + type + price ceiling.
function searchUrl(city, type, maxPrice) {
  const slug = (city || "").toLowerCase().replace(/\s+/g, "-");
  const path = TYPE_PATH[type] || "wohnung-kaufen";
  const q = maxPrice ? `?price=-${maxPrice}` : "";
  return `https://www.immobilienscout24.de/Suche/de/${slug}/${slug}/${path}${q}`;
}

// Normalize one IS24 result entry (the realEstate object) into a Listing.
function entryToListing(re) {
  const addr = re.address || {};
  const rt = String(re["@xsi.type"] || re.realEstateType || "").toLowerCase().replace(/[^a-z]/g, "");
  return makeListing({
    source: "immoscout",
    source_id: String(re["@id"] || re.id || re.exposeId || ""),
    url: re["@id"] ? `https://www.immobilienscout24.de/expose/${re["@id"]}` : (re.url || ""),
    title: re.title || "",
    property_type: TYPE_MAP[rt] || "",
    price: num(re.price?.value ?? re.price),
    living_area: num(re.livingSpace ?? re.area),
    rooms: num(re.numberOfRooms ?? re.rooms),
    city: addr.city || "",
    plz: String(addr.postcode || ""),
    lat: num(addr.wgs84Coordinate?.latitude),
    lng: num(addr.wgs84Coordinate?.longitude),
  });
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

  const out = [];
  const seenIds = new Set();
  try {
    for (const city of cities) {
      for (const type of types.length ? types : ["wohnung"]) {
        const url = searchUrl(city, type, maxPrice);
        const timeout = (cfg.http?.timeout_seconds || 30) * 1000;

        // Load the page while capturing ALL JSON responses (IS24's result API
        // host/path isn't fixed, so we keep everything and pick later/diagnose).
        const load = async () => {
          const captured = [];
          const onResp = async (resp) => {
            if (!(resp.headers()["content-type"] || "").includes("json")) return;
            try { captured.push({ url: resp.url(), json: await resp.json() }); }
            catch { /* not json */ }
          };
          page.on("response", onResp);
          try {
            await page.goto(url, { waitUntil: "networkidle", timeout });
          } catch (e) {
            console.log(`  immoscout(browser): nav ${url}: ${e.message}`);
          }
          page.off("response", onResp);
          return captured;
        };

        let captured = await load();

        // Bot-wall detection.
        const title = await page.title().catch(() => "");
        if (isBotWall(title, 200)) {
          if (debug) {
            // Headful: let the human solve "Ich bin kein Roboter", then reload.
            console.log(`  immoscout(browser): bot wall on ${city}/${type} — `
              + `solve the challenge in the open window (waiting up to 120s)…`);
            await page.waitForFunction(
              () => !/kein roboter|just a moment|robot/i.test(document.title),
              { timeout: 120000 }).catch(() => {});
            captured = await load();   // re-capture now-authorized results
          } else {
            console.log(`  immoscout(browser): bot wall on ${city}/${type}. `
              + `Run once with sources.immoscout.debug=true to solve it; the cleared `
              + `session then persists for headless runs.`);
            continue;
          }
        }

        // 1) Preferred: entries from captured search-API JSON.
        let entries = captured.flatMap((c) => extractEntries(c.json));

        // 2) Fallback: scrape result cards from the DOM.
        if (!entries.length) {
          const cards = await page.$$eval("article[data-obid], [data-id].result-list-entry, .result-list__listing", (els) =>
            els.map((el) => ({
              "@id": el.getAttribute("data-obid") || el.getAttribute("data-id") || "",
              title: el.querySelector("h2,h5,.result-list-entry__brand-title")?.textContent?.trim() || "",
              priceText: el.querySelector("[data-is24-qa='attribute-1'] dd, .result-list-entry__primary-criterion dd")?.textContent || "",
              areaText: [...el.querySelectorAll("dd")].map((d) => d.textContent).find((t) => /m²/.test(t)) || "",
              roomsText: [...el.querySelectorAll("dd")].map((d) => d.textContent).find((t) => /Zi/.test(t)) || "",
            })).filter((x) => x["@id"])
          ).catch(() => []);
          entries = cards.map((c) => ({
            "@id": c["@id"], title: c.title,
            price: c.priceText, livingSpace: c.areaText, numberOfRooms: c.roomsText,
            address: {},
          }));
        }

        let added = 0;
        for (const re of entries) {
          const l = entryToListing(re);
          if (!l.source_id || seenIds.has(l.source_id)) continue;
          seenIds.add(l.source_id);
          if (city && !l.city) l.city = city;
          if (!l.property_type) l.property_type = type;
          out.push(l);
          added++;
        }
        console.log(`  immoscout(browser): ${city}/${type} -> ${added} listings`);

        // Diagnostics (debug mode): leave a screenshot + JSON so a failed run can
        // be inspected after the fact (the parser is unverified against live IS24).
        if (debug) {
          const { writeFileSync } = await import("node:fs");
          const tag = `${city}-${type}`.replace(/[^\w-]/g, "");
          await page.screenshot({ path: `is24-${tag}.png`, fullPage: true }).catch(() => {});
          // Full page HTML — lets me reverse-engineer the current structure
          // (embedded JSON, data-* attributes) even if my selectors miss.
          try { writeFileSync(`is24-page-${tag}.html`, await page.content(), "utf-8"); } catch {}
          try {
            writeFileSync(`is24-debug-${tag}.json`, JSON.stringify({
              url, title: await page.title().catch(() => ""),
              capturedResponseCount: captured.length,
              // All JSON endpoints the page hit + their top-level keys — reveals
              // which response holds the listings and under what shape.
              capturedResponses: captured.map((c) => ({
                url: c.url,
                topKeys: c.json && typeof c.json === "object" ? Object.keys(c.json).slice(0, 25) : typeof c.json,
              })),
              entriesFound: entries.length,
              listingsAdded: added,
              sampleEntry: entries[0] || null,
            }, null, 2), "utf-8");
          } catch { /* ignore */ }
        }
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
