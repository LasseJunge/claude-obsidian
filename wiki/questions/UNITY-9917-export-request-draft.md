---
type: draft
title: UNITY-9917 — scheduled AutoTranslation usage export (request draft)
created: 2026-06-23
tags:
  - autotranslate
  - deepl
  - jira
related:
  - "[[Questions Auto Translate]]"
---

# UNITY-9917 — Request: scheduled AutoTranslation usage export

Draft to reopen / extend [UNITY-9917](https://epages.atlassian.net/browse/UNITY-9917). Paste into Jira and adjust owners.

---

## Short version (reopen comment)

**Reopening to request a scheduled run of the AutoTranslation usage export.**

We're tracking per-shop DeepL usage/cost against the ShopType character limits, but the data is currently assembled by hand. The export script already exists and works — it just isn't scheduled:

```bash
$PERL $EPAGES_CARTRIDGES/DE_EPAGES_CONSULTING/Store/Scripts/usageAutoTranslation.pl -allstores > ${TIMESTAMP}_provider.csv
```

**Ask:** run it **weekly** (or on the 4th→4th DeepL cycle) and drop the CSV in a reachable location with a stable `YYYYMMDD_provider.csv` name and a stable column layout. That's all we need — it feeds an existing dashboard import, no new tooling.

**To confirm:** run host + output location, and weekly vs. monthly.

---

## Long version

**Summary:** Schedule the existing AutoTranslation usage export and deposit the output where it can be consumed automatically (no more manual assembly).

**Background**

We're tracking AutoTranslation / DeepL usage and cost per shop to monitor budget consumption against the per-ShopType `AutoTranslationMaxPackageCharacters` limits and to see which shops are approaching the AddOn threshold. Today this data is gathered by hand (per Marion's note + the "AutoTranslation and Stripe Billing" Confluence page), so there are no recurring, reliable figures.

A working export script already exists — it just isn't scheduled:

```bash
. /etc/default/epages6
TIMESTAMP=$(date +"%Y%m%d")
cd $EPAGES_PATCHES
$PERL $EPAGES_CARTRIDGES/DE_EPAGES_CONSULTING/Store/Scripts/usageAutoTranslation.pl -allstores > ${TIMESTAMP}_provider.csv
```

**Request**

1. Run `usageAutoTranslation.pl -allstores` on a **scheduled** basis — proposed **weekly** (align with our existing weekly snapshot cadence; happy to match the DeepL 4th→4th billing cycle if preferred).
2. Write the output CSV to an agreed, reachable location with a stable, timestamped filename (e.g. `YYYYMMDD_provider.csv`) — e.g. a shared/export directory or object storage we can pull from.
3. Keep the column set stable across runs (shop/alias, provider, character count, cost, date). If columns are added, append rather than reorder.

**Why scheduled vs. manual**

- The export already produces exactly the data we need; only the cadence + delivery is missing.
- Cheapest possible path — no new tooling, just a cron + an output destination.
- Unblocks an automated usage/cost dashboard (we already have an AutoTranslate tab that imports this CSV shape).

**Acceptance criteria**

- [ ] Script runs on a schedule without manual intervention.
- [ ] CSV lands in the agreed location with a predictable, timestamped name.
- [ ] Column layout is documented and stable.
- [ ] One successful automated run verified end-to-end.

**Open points to confirm with R&D**

- Exact run host + output location (and how we access it).
- Cadence: weekly vs. monthly (4th→4th billing cycle).
- Whether per-provider splitting is needed in the filename/output, or one combined file is fine.

**References**

- [AutoTranslation (ShopType configs, workflow, export script)](https://epages.atlassian.net/wiki/spaces/AM/pages/5137367066/AutoTranslation)
- [AutoTranslation and Stripe Billing (usage + AddOnBought shops)](https://epages.atlassian.net/wiki/spaces/AM/pages/5387452418/)
- Character-limit decision: [AM-19783](https://epages.atlassian.net/browse/AM-19783)
- Monetization MVP: [UNITY-9665](https://epages.atlassian.net/browse/UNITY-9665)
