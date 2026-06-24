---
type: question
address: c-000008
title: Questions Auto Translate
created: 2026-06-10
updated: 2026-06-23
tags:
  - autotranslate
  - deepl
  - dashboard
  - spreedly
status: developing
related:
  - "[[ePages Spreedly Migration]]"
  - "[[meeting-2026-06-15-with-Chris]]"
---

# Questions Auto Translate

Open questions and findings about the AutoTranslate feature tracking dashboard.

> [!info] 2026-06-15 meeting
> From [[meeting-2026-06-15-with-Chris]]: "Maybe Karsten sends raw data to **Enzio**."

> [!success] 2026-06-23 — Marion's reply (the data answer)
> Marion (cc Ezio Ferrari, Karsten Peskova) explained how AutoTranslate usage is tracked. **Bottom line: there is no automated raw-data feed.** The Wilfried overview was assembled by hand; automatic updates/overviews would have to be prioritized by R&D.
>
> **How tracking works today:**
> - One **DeepL account** runs all providers (+ Beyond). Each provider has its **own key**, tracked for characters consumed per provider in the current month (billing cycle runs **4th → 4th** of each month).
> - On the ePages side, **each shop's DB stores how many characters it currently uses**. When that exceeds the amount configured in its **ShopType**, the merchant is prompted to **book the AddOn**.
> - When a merchant books it, ePages gets a mail **via Ezio** and the AddOn is added to the shop **manually**.
> - From the DeepL account, CSVs can be **exported per time period** and assembled manually — e.g. `20260604_key_level_report.xlsx`. The Wilfried overview was `20260526_Usage_AutoTranslation.xlsx`, "händisch" (by hand).
> - **No automatic updates/overviews exist.** Would need R&D prioritization → ticket **UNITY-9917** (reopen or open a new case with our requirements).
>
> **References (Confluence):**
> - [AutoTranslation — ShopType configurations](https://epages.atlassian.net/wiki/spaces/AM/pages/5137367066/AutoTranslation#ShopType-configurations)
> - [AutoTranslation and Stripe Billing — Shops with feature-pack AutoTranslationAddOnBought](https://epages.atlassian.net/wiki/spaces/AM/pages/5387452418/AutoTranslation+and+Stripe+Billing#Shops-with-feature-pack-AutoTranslationAddOnBought)
> - [UNITY-9917](https://epages.atlassian.net/browse/UNITY-9917)
>
> ⚠️ **Confluence is access-restricted for Claude** — do not attempt the Atlassian connector. To use these pages, contents must be pasted in manually.

---

## Feature Overview

AutoTranslate is an ePages feature that uses DeepL to translate shop content. Usage is tracked weekly via CSV imports with the following columns:

| Column | Description |
|--------|-------------|
| `Store` | Internal store type (e.g. `epagesDE`, `StoreES3`, `Store10`) — NOT the partner |
| `Alias` | Unique shop identifier — used as the primary key per shop |
| `Domain` | Shop domain |
| `TranslatedLanguageCount` | Number of languages actively translated |
| `ShopCharacters` | Total shop content characters |
| `TranslatedCharacters` | Characters sent to DeepL for translation |
| `CostsDeepl` | DeepL API cost in € (European format: `"1.145,07 €"`) |
| col 8 | `AddOnBought` flag (literal string) if the shop bought extra budget |
| col 9 | Date the AddOn was purchased (e.g. `"Dec 2, 2025"`) |

### CSV Structure — Partner Detection

Partners are NOT a column. They are encoded as **section header rows**:

```
Acens:,,,,,,,,
hostalia,40888861,naturalvegano.com,...
```

A row where `Store` ends with `:` and `Alias` is empty = section header → sets `currentPartner` for all subsequent rows until the next header.

Known partners in the 2026-05-26 export:

| Partner | Store types used |
|---------|-----------------|
| Acens | hostalia |
| Arsys | StoreES, StoreES3, StorePiensa |
| Vilkas | VilkasStoreFI |
| epagesCloud | epagesDE, epagesUK |
| Strato | Store10, Store18–Store32, StoreNL3 |
| 1und1EU | Store13, Store18–Store27 |
| TOnline | Store2, Store6, Store7 |

**Known edge case:** `HostEurope` appears inside the `epagesCloud:` block without its own section header → gets assigned partner `epagesCloud` incorrectly. No fix without a manual mapping table or a corrected CSV.

---

## Dashboard Implementation

Dashboard page added to `Spreedly_Conversion.html` on 2026-06-10.

**Features built:**
- KPI cards: Total Cost, Translated Chars, Shop Chars, Active Stores, Avg Cost/Store
- Filter bar: partner multi-select + ISO week range
- Line chart: DeepL cost over time (respects partner + week filter)
- Bar chart: **Cost by Partner** — always shows all partners; only respects week filter, NOT partner filter
- Sortable store breakdown table with utilization % and AddOn badge
- Search box on store breakdown table
- Weekly CSV import (admin only, stamped with ISO week)
- Duplicate week detection with overwrite prompt
- Data persisted in Supabase `mappings` table (`id = autotranslate`)
- Admin bar buttons are context-aware: Import AT CSV and Clear AT Data only visible on the AT tab

**Import instructions:** Admin mode → Autotranslate tab → "Import AT CSV" in admin bar.

---

## Bugs Fixed (2026-06-10 session)

| Bug | Root cause | Fix |
|-----|-----------|-----|
| Partner column showed store type (e.g. `epagesDE`) instead of partner name | `atRenderTable` built aggregation with `partner: r.store` | Changed to `partner: r.partner` |
| AddOn badge never appeared | `addOnBought` / `addOnDate` not copied into `byAlias` aggregation | Added propagation in the forEach loop |
| CostsDeepl always 0 | European format `"3,43 €"` not parsed correctly | `atParseCost()` helper handles period=thousands, comma=decimal |
| Partner filter dropdown showed store types, not partner names | `atGetAllStores()` was collecting `r.store` values | Changed to collect `r.partner` |

---

## Confluence reference — AutoTranslation page (pasted 2026-06-23)

Authoritative content from the [AutoTranslation](https://epages.atlassian.net/wiki/spaces/AM/pages/5137367066/AutoTranslation) Confluence page (by Marion Kulig).

### Monetization & character limits

Monetization started with **7.111.0** ([UNITY-9665](https://epages.atlassian.net/browse/UNITY-9665), closed). Shop features:

| Feature | Value / behaviour |
|---------|-------------------|
| `AutoTranslation` | `1` (feature on) |
| `AutoTranslationMaxCharacters` | **25,000,000** — the maximal limit once `AutoTranslationAddOnBought = 1` |
| `AutoTranslationMaxPackageCharacters` | base budget; **differs by ShopType** (NowS/M/L/XL). When the limit is reached the merchant gets a notification in **MBO** to buy via **Stripe**. After purchase, someone sets `AutoTranslationAddOnBought = 1` → the shop then gets the `AutoTranslationMaxCharacters` value (25M). |
| `AutoTranslationAddOnBought` | `1` once the AddOn is purchased |

Character-limit decision made by Donal & Wilfried: [AM-19783](https://epages.atlassian.net/browse/AM-19783).

### ShopType budgets (base `AutoTranslationMaxPackageCharacters`)

**ePages Cloud / Direct**

| ShopType | Additional languages ("Languages" −1) | MaxPackageCharacters |
|----------|----------------------------------------|----------------------|
| NowS  | 0 | n/a |
| NowM  | 1 | 1,000,000 |
| NowL  | 3 | 1,000,000 |
| NowXL | 5 | 5,000,000 |

**Everyone else** (other providers)

| ShopType | Additional languages ("Languages" −1) | MaxPackageCharacters |
|----------|----------------------------------------|----------------------|
| NowS  | 0 | n/a |
| NowM  | 1 | 500,000 |
| NowL  | 2 | 500,000 |
| NowXL | 3 | 1,000,000 |

### Provider rollout (pilot shops with feature activated)

| Provider                                                      | Activation                                                                       | Jira                                    |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------- |
| epagesCloud (epagesDE + UK)                                   | 7.111.0 — Nov 12, 2025                                                           | AM-19792 (Resolved)                     |
| epagesCloud (epagesES, FR, IT, US) + all other Now-Providers? | 7.117.0 — Jun 17, 2026                                                           | —                                       |
| epagesCloud – Claranet                                        | 7.117.0 — Jun 17, 2026                                                           | —                                       |
| epagesCloud – HostEurope                                      | 7.117.0 — Jun 17, 2026                                                           | —                                       |
| Acens                                                         | 7.114.0 — Mar 17, 2026                                                           | AM-20061 (Reopened)                     |
| Arsys                                                         | 7.114.0 — Mar 19, 2026                                                           | AM-20061 (Reopened)                     |
| TOnline / Telekom                                             | 7.114.0 — Mar 25, 2026                                                           | AM-20061 (Reopened)                     |
| Vilkas                                                        | 7.115.0 — Apr 21, 2026 (manually)                                                | AM-20169 (Resolved)                     |
| 1und1EU                                                       | DE 7.114.0 — Apr 21, 2026; ES/FR/UK/IT 7.115.0 — May 5, 2026 (all manually)      | AM-20170 (Review), AM-20186 (Resolved)  |
| Strato                                                        | NL 7.114.0 — Apr 22; DE 7.115.0 — Apr 28; ES/SE 7.115.0 — May 5, 2026 (manually) | AM-20168, AM-20176, AM-20184 (Resolved) |
| Hostpoint                                                     | don't activate — they want extra adaptions?                                      | —                                       |
| 1und1US                                                       | (not yet)                                                                        | —                                       |

### System configuration (for activation)

- `ui >= 3.28.1`; `Cartridges.xml → AutoTranslation`
- Scheduler `[AutomaticTranslation]` runs **every minute**, script `AutoTranslation/Scripts/insertAutoTranslation.pl`
- `$EPAGES/j/config/epagesj.conf`: add `deeplAuthKey` — **keys are separated per provider in AM keepass**
- `epages-ui-deployment.yaml`: `TRANSLATION_API_URL = http://#CurrentStore.InternalEPagesJDomain:#CurrentStore.InternalEPagesJPort/rs/deepl/translate`

### Workflow & DB status (7.108.0+)

Merchant adds a language in MBO (or changes product texts) → a row appears in DB table **`autotranslation`** with status `0`. The scheduler processes status-`0` rows:

```
TRANSLATION_STATUS = { PENDING => 0, COMPLETED => 2 (scheduler deletes these on every run), ERROR => 4 }
```

> A full AI translation can only be done **once per language**. Deleting an AI-translated language means re-adding requires manual translation (or temporarily hide languages). To force a re-translation, empty the shop attribute `AutoTranslationTranslatedLanguagesIDs`.

### Accounting

- **DeepL API Pro**, subscription `3480203`, **4.99 €/month** + **usage: 20 € per 1,000,000 characters**.
- Account credentials in AM keepass. Relevant for billing = characters **sent to DeepL**.
- Rule of thumb: Spotlight demo content (~11,000–28,000 chars) ≈ **0.22 €–0.56 € per initially-added language**.
- Even if the ShopType allows only 1 language, all possible languages can be added and are translated immediately (though not visible).
- Helper (pre-activation estimate, a "minimum guess"): `AutoTranslation/Scripts/countCharsByShopForAutoTranslation.pl`.

### ⭐ Export AutoTranslation usage (the raw-data source)

This is the script that generates the per-store usage CSV — the candidate for automating the dashboard feed:

```bash
. /etc/default/epages6
TIMESTAMP=$(date +"%Y%m%d")
cd $EPAGES_PATCHES
$PERL $EPAGES_CARTRIDGES/DE_EPAGES_CONSULTING/Store/Scripts/usageAutoTranslation.pl -allstores > TIMESTAMP_provider.csv
```

---

## Confluence reference — AutoTranslation and Stripe Billing (pasted 2026-06-23)

From the [AutoTranslation and Stripe Billing](https://epages.atlassian.net/wiki/spaces/AM/pages/5387452418/) page (by Karsten Peskova). DeepL pricing basis on this page: **1,000,000 characters = 20 €**.

> Context (Donal O'Meara): releasing the updated Automatic Translations *with the payment link* asap; a merchant was contacted for testing to validate the whole workflow before go-live; status to be tracked "in Excel, Confluence, or wherever is easiest."

### Tracked shops — usage & DeepL cost (partial; screenshot didn't show all rows)

| Shop | Provider | Characters | DeepL cost | Date | Ticket | Note |
|------|----------|-----------:|-----------:|------|--------|------|
| shop.historicracing.de | Direct (epagesDE) | 979,813 | 19.60 € | | | |
| shop.kabelknecht.de | HostEurope | 1,725,143 | 34.50 € | | | |
| www.forhouse.de | Strato | 7,966,132 | 159.32 € | | | |
| www.geschenkestern.com | Strato | 10,897,909 | 217.96 € | | | |
| www.hansemann.de | Strato | 3,760,829 | 75.37 € | | | |
| www.oilexpress.de | Strato | 6,977,146 | 139.54 € | | | |
| www.whisky-erlebnis-ol.de | Strato | 9,904,278 | 198.09 € | | | |
| www.schwimmshop.de | Strato | 3,977,560 | 79.55 € | | | |
| ulli.design | Direct (epagesDE) | 148,249 | 2.96 € | | | |
| www.tiendadebastones.com | Arsys | 26,600,995 | 532.02 € | | | |
| www.greenki.de | Strato | 271,693 | 5.43 € | | | |
| www.shop-wittlich.de | Strato | 12,414,626 | 248.29 € | May 18, 2026 | #2031577 | |
| www.glassstudiosupplies.co.uk | epagesCloud (epagesUK) | 7,851,952 | 157.04 € | May 20, 2026 | #2031639 | UNITY-10204 (open) |
| lejada.de | epagesCloud (epagesDE) | 2,332,435 | 46.65 € | May 29, 2026 | #2032033 | |
| www.goodkarmacoffee.de | Strato | 1,084,329 | 21.67 € | Jun 2, 2026 | #2032094 | |
| leolienchen-design.com | Strato | 5,189,604 | 103.79 € | Jun 3, 2026 | #2032112 | UNITY-10244 (open) |
| fuxxer.eu | 1und1DE | 804,238 | 16.08 € | Jun 16, 2026 | #2032498 | |
| tcg-trade.de | Strato | 613,249 | 12.26 € | Jun 19, 2026 | #2032632 | |
| www.frottierware-grosshandel.de | Strato | 3,892,835 | 77.86 € | Jun 22, 2026 | #2032677 | |

### Shops with feature pack `AutoTranslationAddOnBought` (booked the AddOn)

| Shop | Provider | Characters | Cost/lang | Date | Zammad | Comment |
|------|----------|-----------:|----------:|------|--------|---------|
| www.tiendadebastones.com | Arsys | 28,662,859 | 573.26 € | Dec 2, 2025 | #2025834 | |
| www.iberianwinesandfood.com | Arsys | 580,850 | 11.62 € | Feb 23, 2026 | #2027424 | doesn't need to pay – WB |
| retterstore.de | 1und1DE | 1,201,657 | 24.03 € | Feb 23, 2026 | #2021517 | doesn't need to pay – WB |
| fossilien-mineralien.org | 1und1DE | 1,827,182 | 36.54 € | Apr 28, 2026 | #2030860 | |
| www.skoldtimer.de | Strato | 2,632,913 | 52.66 € | May 15, 2026 | #2031550 | blocked by UNITY-10199 (open) |

*(Both tables may have more rows below the screenshot fold.)*

---

## ⚠️ Shops over the 25M AddOn cap (for the Chris call)

Found 2026-06-23 in the loaded dashboard data: two shops have translated **beyond the 25M `AutoTranslationMaxCharacters` ceiling** — i.e. past even the paid AddOn package.

- **www.tiendadebastones.com** (Arsys) — the AddOnBought table records 28,662,859 chars (573.26 €), already > 25M.
- **www.glassstudiosupplies.co.uk** (epagesCloud / epagesUK) — over cap in the live data. ⚠️ The snapshot table above shows it at 7,851,952 chars **without** an AddOn (May 20, 2026, #2031639, UNITY-10204), so the live figures have moved since that screenshot — reconcile against the current export.

### Shops over their base package with NO AddOn (the bigger billing gap)

Also found 2026-06-23: shops at **5.5M, 10M, and 20M** translated characters **without an AddOn**. Every base package tops out at 5M (Cloud NowXL), so these are unambiguously over budget regardless of ShopType — yet they bought nothing extra. At 20 €/1M that's ≈ **110 € / 200 € / 400 €** of DeepL cost each, on shops paying no AddOn. They should have been forced through the MBO → Stripe prompt. This is a larger leak than the over-cap shops.

The dashboard flags these today even without ShopType data: any non-AddOn shop over 5M shows red **>100%** in Budget Use and is counted as "**N over base pkg (no AddOn)**" in the header.

**Questions to raise with Chris:**
1. Is the 25M cap actually **enforced**, or does the scheduler keep translating past it (making 25M a billing tier, not a stop)?
2. Same question for the **base package** — non-AddOn shops at 5.5M/10M/20M imply the package limit isn't a hard stop either, and the MBO/Stripe prompt isn't blocking continued translation.
3. Is the **overage billed** at all (25M+ for AddOn shops; package+ for non-AddOn shops, at 20 €/1M)? If not, that cost is leaking.
4. Do these shops need manual intervention now?

### AddOn flag discrepancy: Confluence vs CSV (data reliability)

The dashboard derives the AddOn badge **only from the CSV `AddOnBought` column** (CSV = live source of truth; the Confluence list is a point-in-time snapshot — decision 2026-06-23 to keep it CSV-only, not hardcode the Confluence list). Reconciling the Confluence `AutoTranslationAddOnBought` table against the loaded CSV (2026-06-23):

- **Match:** www.tiendadebastones.com, fossilien-mineralien.org, www.skoldtimer.de — AddOn in both, dates align.
- **CSV newer than Confluence:** www.glassstudiosupplies.co.uk and www.shop-wittlich.de show AddOn in the CSV but were in the Confluence *tracked* (non-AddOn) table — they bought it after the snapshot. Expected.
- **❌ Discrepancy:** **retterstore.de** and **www.iberianwinesandfood.com** are listed AddOnBought in Confluence (both Feb 23 2026, both **"doesn't need to pay – WB"** waivers) but the CSV carries **no AddOn flag** for them.

**Question for Chris:** is `AutoTranslationAddOnBought` set consistently in the system, **including waiver ("WB") shops**? If waivers don't get the flag, any tool reading the CSV will misclassify them (and they'd show as over-budget once usage grows). This is the same enforcement/data-integrity theme as the cap questions above.

### Is the limit per language or per shop? → **per shop (total)**

Confirmed by re-reading the Confluence tables 2026-06-23. `AutoTranslationMaxPackageCharacters` is a single shop attribute (base-tier sibling of the 25M `AutoTranslationMaxCharacters` cap, which is plainly a per-shop total). The clincher: Cloud **NowM (1 language) = 1M** and **NowL (3 languages) = 1M** — equal budget despite different language counts, so the "additional languages" column is an entitlement, not a per-language multiplier. Characters are *consumed* per language (each translated once) but counted against one cumulative per-shop total; the CSV's `TranslatedCharacters` is already that shop-level sum. The dashboard compares total-vs-budget, which is correct. (Inference from table structure, not an explicit statement — worth a one-line confirm with Chris.)

---

## Open Questions

- [x] Why is the translated character count sometimes higher than the shop character count?
- [ ] How can we identify from what Partner each Shop is? *(partially answered — section headers in CSV, but HostEurope edge case remains)*
- [x] Is the table that Wilfried sent the exact one that we would get? *(answered 2026-06-23 — no; it was hand-assembled by Marion. No automated export exists; would need R&D via UNITY-9917.)*
- [x] What is the base budget and when do shops have to Add On budget? *(answered 2026-06-23 — per-ShopType `AutoTranslationMaxPackageCharacters` (see tables above); when exceeded the merchant is prompted in MBO to buy via Stripe; AddOn raises the cap to `AutoTranslationMaxCharacters` = 25M.)*
- [ ] What is the expected cost per week across all stores? *(now derivable — 20 €/1M chars sent to DeepL; needs the `usageAutoTranslation.pl` export to compute actuals)*
- [ ] How does cost trend week-over-week?
- [x] Is there a cost ceiling / budget we are tracking against? *(answered 2026-06-23 — per-ShopType package limits, hard cap 25M chars once AddOn bought; pricing 20 €/1M chars.)*
- [ ] Are there stores with languages configured but zero translated characters?

---

## Notes

- The partner filter affects KPIs, line chart, and store breakdown table — but intentionally NOT the "Cost by Partner" bar chart (so you always see the full partner split for context).
- `HostEurope` is the only partner without a section header in the current CSV export.


