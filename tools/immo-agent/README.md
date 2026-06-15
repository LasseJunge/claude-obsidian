# immo-agent

Autonomous **German real-estate + forced-auction (Zwangsversteigerung)** monitor.
Zero-dependency Node.js (uses built-in `fetch`; runs on Node 18+). Part of the
`claude-obsidian` vault — invoke conversationally via the `/immo` command.

## Quick start

```bash
cd tools/immo-agent
cp config.example.json config.json     # edit your search criteria
node src/index.mjs run                 # scrape -> score -> notes + dashboard
```

Outputs land in the vault:
- **Notes:** `wiki/immo/*.md` (one per match; forced auctions always filed)
- **Dashboard:** `wiki/immo/dashboard.html` (open in any browser)
- **Data:** `tools/immo-agent/immo.json` (deduped, survivorship-safe)

## Commands

| Command | Does |
|---|---|
| `node src/index.mjs run` | Full pipeline → notes + dashboard |
| `node src/index.mjs run --dry` | Fetch + score, **no writes** (safe test) |
| `node src/index.mjs top [N]` | Print top N stored matches |
| `node src/index.mjs dashboard` | Rebuild dashboard from stored data |
| `node test/smoke.mjs` | Offline pipeline test (no network) |

## Sources

| Key | Source | Status | Notes |
|---|---|---|---|
| `zvg` | zvg-portal.de | ✅ live | Official forced-auction portal. Public data. Verkehrswert only when listed inline (often in the PDF). |
| `bank_auctions` | dga-ag.de (argetra) | ✅ live | Bank/insolvency/voluntary auctions. JSON markers: Limit, category, region, GPS. |
| `kleinanzeigen` | kleinanzeigen.de | ✅ live | Buy categories. Listing facts only, no seller PII. |
| `immoscout` | ImmoScout24 (headless browser) | ⚙️ needs setup | Real Chromium via Playwright — no paid API. Requires a one-time manual challenge solve (see below). ToS-sensitive. `method:"piloterr"` switches to the Piloterr API instead. |

## Configuration

See `config.example.json`. Key fields: `regions` (Bundesländer / PLZ prefixes / cities,
matched with OR), `property_types`, `price` (min/max), `yield` thresholds
(`min_gross_yield_pct`, `min_auction_discount_pct`, `max_price_per_sqm`),
`rent_benchmark_eur_sqm` (for estimating yield on listings without a stated rent),
and `sources.*.enabled`.

### ImmoScout24 (on-demand, headful) — `--is24`

IS24 fronts everything with a bot wall ("Ich bin kein Roboter") **and** detects headless
browsers by fingerprint, so it must run **headful** (a visible window). A headful solve
persists a session in `.is24-profile/`, but headless runs are still re-challenged — so IS24
is deliberately **kept out of the automated headless job** and run on demand instead.

```bash
npm install playwright && npx playwright install chromium   # one time
node src/index.mjs run --is24                               # opens a visible browser
```

`--is24` forces ImmoScout24 on in headful mode for that run only (the saved `config.json`
keeps it disabled, so the daily/scheduled job stays clean). If the challenge appears, solve
it in the window (you have ~120s); the agent then captures listings and merges them into the
same notes/dashboard as the other sources. Thanks to the persisted profile, repeat headful
runs usually skip the challenge.

> ⚠️ Must be run from an **interactive terminal on your desktop** — a headful browser cannot
> launch from a non-interactive/service session.
>
> ⚠️ The parser targets IS24's own search-result JSON (`resultlist.resultlist`), captured via
> network interception, with a DOM-card fallback. It's robust but **unverified against live
> IS24 data**. If a run passes the wall but returns 0 listings, the response shape changed —
> check the browser console to tune `extractEntries()` in `immoscout-browser.mjs`.

**Alternative — Piloterr API** (paid, no browser): set `sources.immoscout.method: "piloterr"`
and the key (never commit it):

```powershell
$env:IMMO_PILOTERR_KEY = "your-key"      # PowerShell
```

## Scheduling (daily monitor) — Windows Task Scheduler

Each run dedups against `immo.json`, so scheduling it just keeps the vault fresh.

A task named **`immo-agent-daily`** is installed to run at **09:00**, run-if-missed
(catches up next time the laptop is on), allowed on battery, logging to `immo-daily.log`.
The laptop must be powered on and online; it is not woken from sleep.

Recreate / change it:

```powershell
$node = (Get-Command node).Source
$dir  = "C:\Users\ljunge\claude-obsidian\tools\immo-agent"
$action  = New-ScheduledTaskAction -Execute "cmd.exe" `
  -Argument "/c `"`"$node`" src\index.mjs run >> immo-daily.log 2>&1`"" -WorkingDirectory $dir
$trigger = New-ScheduledTaskTrigger -Daily -At 9am
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
Register-ScheduledTask -TaskName "immo-agent-daily" -Action $action -Trigger $trigger `
  -Settings $settings -Description "Daily German real-estate + auction scan" -Force
```

Run it now: `Start-ScheduledTask -TaskName "immo-agent-daily"`.
Remove it: `Unregister-ScheduledTask -TaskName "immo-agent-daily" -Confirm:$false`.

ImmoScout24 is **not** part of this job (headful-only — see above); run it on demand
with `node src/index.mjs run --is24`.

## Architecture

```
src/
  index.mjs          CLI
  agent.mjs          orchestrator: scrape -> normalize -> score -> store -> notes -> dashboard
  config.mjs         loads config.json (+ env for API keys)
  http.mjs           polite throttled fetch, ISO-8859-1 aware
  model.mjs          Listing factory, dedup uid + change fingerprint
  store.mjs          JSON store, dedup + survivorship (never deletes)
  normalize.mjs      €/m², gross yield, auction discount, scoring, filters
  obsidian.mjs       writes structured wiki notes
  dashboard.mjs      self-contained HTML dashboard (inline SVG charts)
  connectors/
    parse.mjs        shared dependency-free HTML/entity helpers
    zvg.mjs          Zwangsversteigerungen (zvg-portal.de)
    bank.mjs         bank/insolvency auctions (dga-ag.de JSON)
    kleinanzeigen.mjs
    immoscout.mjs          dispatcher: browser (default) | piloterr
    immoscout-browser.mjs  IS24 via Playwright Chromium (persistent session)
```

Each connector exposes `fetchListings(cfg, http) -> Listing[]` and isolates its parsing
in one function, so a portal markup change only touches that file. Every connector also
supports a `sample_html` config key pointing at a saved page for offline development.

## Legal

Forced-auction (zvg) and bank-catalogue data is public — fine to read. Commercial portals
prohibit scraping in their ToS and GDPR restricts storing agent/realtor PII; the agent
stores **only listing facts**, never personal contact data. For commercial use, consult
German legal counsel. See `wiki/sources/german-scraping-legality.md`.
