---
type: question
title: Questions Auto Translate
created: 2026-06-10
updated: 2026-06-10
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

## Open Questions

- [x] Why is the translated character count sometimes higher than the shop character count?
- [ ] How can we identify from what Partner each Shop is? *(partially answered — section headers in CSV, but HostEurope edge case remains)*
- [ ] Is the table that Wilfried sent the exact one that we would get?
- [ ] What is the base budget and when do shops have to Add On budget?
- [ ] What is the expected cost per week across all stores?
- [ ] How does cost trend week-over-week?
- [ ] Is there a cost ceiling / budget we are tracking against?
- [ ] Are there stores with languages configured but zero translated characters?

---

## Notes

- The partner filter affects KPIs, line chart, and store breakdown table — but intentionally NOT the "Cost by Partner" bar chart (so you always see the full partner split for context).
- `HostEurope` is the only partner without a section header in the current CSV export.


