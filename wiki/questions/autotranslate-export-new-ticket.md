---
type: draft
title: AutoTranslation usage export — new ticket (paste-ready)
created: 2026-06-23
tags:
  - autotranslate
  - deepl
  - jira
related:
  - "[[Questions Auto Translate]]"
  - "[[UNITY-9917-export-request-draft]]"
---

# New ticket — Schedule the AutoTranslation usage export

Paste-ready for the Jira create-issue form. Related prior case: [UNITY-9917](https://epages.atlassian.net/browse/UNITY-9917) (link as "relates to").

---

**Project:** UNITY (R&D)
**Issue type:** Story (or Task)
**Components:** AutoTranslation
**Labels:** `autotranslation`, `deepl`, `reporting`

## Summary

Schedule the existing AutoTranslation usage export and deposit the CSV where it can be consumed automatically

## Description

We track per-shop DeepL usage and cost against the per-ShopType `AutoTranslationMaxPackageCharacters` limits, to monitor budget consumption and see which shops approach the AddOn threshold. Today this data is assembled by hand (per Marion's note and the "AutoTranslation and Stripe Billing" Confluence page), so there are no recurring, reliable figures.

A working export script already exists — it just isn't scheduled:

```bash
. /etc/default/epages6
TIMESTAMP=$(date +"%Y%m%d")
cd $EPAGES_PATCHES
$PERL $EPAGES_CARTRIDGES/DE_EPAGES_CONSULTING/Store/Scripts/usageAutoTranslation.pl -allstores > ${TIMESTAMP}_provider.csv
```

### Request

1. Run `usageAutoTranslation.pl -allstores` on a **scheduled** basis — proposed **weekly** (happy to align with the DeepL 4th→4th billing cycle if preferred).
2. Write the output CSV to an agreed, reachable location with a stable, timestamped filename (e.g. `YYYYMMDD_provider.csv`) — a shared/export directory or object storage we can pull from.
3. Keep the column set stable across runs (shop/alias, provider, character count, cost, date). If columns are added, append rather than reorder.

### Why scheduled vs. manual

- The export already produces exactly the data we need; only the cadence and delivery are missing.
- Cheapest possible path — a cron plus an output destination, no new tooling.
- Unblocks an automated usage/cost dashboard (we already have an AutoTranslate tab that imports this CSV shape).

## Acceptance criteria

- [ ] Script runs on a schedule without manual intervention.
- [ ] CSV lands in the agreed location with a predictable, timestamped name.
- [ ] Column layout is documented and stable.
- [ ] One successful automated run verified end-to-end.

## Open points to confirm with R&D

- Exact run host + output location (and how we access it).
- Cadence: weekly vs. monthly (4th→4th billing cycle).
- Whether per-provider splitting is needed in the filename/output, or one combined file is fine.

## References

- [AutoTranslation (ShopType configs, workflow, export script)](https://epages.atlassian.net/wiki/spaces/AM/pages/5137367066/AutoTranslation)
- [AutoTranslation and Stripe Billing (usage + AddOnBought shops)](https://epages.atlassian.net/wiki/spaces/AM/pages/5387452418/)
- Character-limit decision: [AM-19783](https://epages.atlassian.net/browse/AM-19783)
- Monetization MVP: [UNITY-9665](https://epages.atlassian.net/browse/UNITY-9665)
- Prior request case: [UNITY-9917](https://epages.atlassian.net/browse/UNITY-9917)
</content>
</invoke>
