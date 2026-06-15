// Offline smoke test: parse a fixture through the full pipeline, no network.
import { strict as assert } from "node:assert";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { Http } from "../src/http.mjs";
import { enrich, scoreAndFlag, passesFilters } from "../src/normalize.mjs";
import * as zvg from "../src/connectors/zvg.mjs";
import { writeNotes } from "../src/obsidian.mjs";
import { generateDashboard } from "../src/dashboard.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = join(__dirname, "fixtures", "zvg-sample.html");

const cfg = {
  _vaultRoot: join(__dirname, "out"),                   // write into a sandbox
  regions: { bundeslaender: ["Hamburg"], cities: ["Hamburg", "Lübeck"], plz_prefixes: ["22", "23"] },
  property_types: ["haus", "wohnung"],
  price: { min: 0, max: 600000 },
  yield: { min_gross_yield_pct: 4, min_auction_discount_pct: 20, max_price_per_sqm: 5000 },
  rent_benchmark_eur_sqm: 12.5,
  sources: { zvg: { enabled: true, sample_html: fixture, sample_land: "hh" } },
  output: { vault_subdir: "notes", obsidian_notes: true, dashboard: true, max_notes_per_run: 50 },
  http: { delay_seconds: 0 },
};

let pass = 0;
const ok = (label, cond) => { assert.ok(cond, label); console.log("  ✓ " + label); pass++; };

// 1. parse — 2 real objects (the 3rd is "aufgehoben" and must be skipped)
const raw = await zvg.fetchListings(cfg, new Http(cfg));
ok("zvg parsed 2 active objects (skipped cancelled one)", raw.length === 2);
const wohnung = raw.find((l) => l.source_id === "123456");
ok("extracted Verkehrswert 320000 inline", wohnung.verkehrswert === 320000);
ok("extracted auction_date 2026-07-14 (German month parse)", wohnung.auction_date === "2026-07-14");
ok("guessed property_type wohnung", wohnung.property_type === "wohnung");
ok("extracted Aktenzeichen", /0003 K 0016\/2023/.test(wohnung.court));
ok("extracted PLZ 22765 from address", wohnung.plz === "22765");
ok("decoded umlaut entity (ß) in title", wohnung.title.includes("Heimstraße"));
const haus = raw.find((l) => l.source_id === "987654");
ok("Verkehrswert null when 's. Beschreibung'", haus.verkehrswert === null);

// 2. normalize + score — simulate a bargain bid below Verkehrswert
wohnung.price = 220000;
enrich(wohnung, cfg); scoreAndFlag(wohnung, cfg);
ok("price_per_sqm computed when area known? (no area => null)", wohnung.price_per_sqm === null);
ok("discount > 30% when price 220k vs VW 320k", wohnung.auction_discount_pct > 30);
ok("bargain gets flagged", wohnung.flags.some((f) => f.includes("Verkehrswert")));

// 3. filters
ok("Hamburg wohnung passes region+type+price filters", passesFilters(wohnung, cfg));

// 4. outputs
const flagged = raw.filter((l) => l.flags?.length);
const notes = writeNotes(flagged, cfg, 50);
ok("wrote at least one note", notes >= 1);
const dash = generateDashboard(raw, cfg, "test");
ok("dashboard file exists", existsSync(dash));
ok("dashboard embeds data", readFileSync(dash, "utf-8").includes("123456"));

// --- ImmoScout24 HTML-blob parser (the resultListModel embedded in the page) ---
const { extractFromHtml } = await import("../src/connectors/immoscout-browser.mjs");
const is24Html = `<html><script>
  IS24.resultList = { Mobile:false, resultListModel: {"searchResponseModel":{"resultlist.resultlist":{"resultlistEntries":[{"resultlistEntry":[
    {"resultlist.realEstate":{"@xsi.type":"search:ApartmentBuy","@id":"153495230","title":"Test ETW","address":{"postcode":"22767","city":"Hamburg"},"price":{"value":329900,"currency":"EUR"},"livingSpace":34,"numberOfRooms":1.5}},
    {"resultlist.realEstate":{"@xsi.type":"search:ApartmentBuy","@id":"159325420","title":"Zwei","address":{"postcode":"22527","city":"Hamburg"},"price":{"value":285000},"livingSpace":28,"numberOfRooms":1}}
  ]}]}}} };
</script></html>`;
const is24 = extractFromHtml(is24Html);
ok("IS24 extractFromHtml parses embedded resultListModel (2 entries)", is24.length === 2);
ok("IS24 entry has @id + price + postcode", is24[0]["@id"] === "153495230" && is24[0].price.value === 329900 && is24[0].address.postcode === "22767");

console.log(`\nAll ${pass} checks passed.`);
