---
type: session
title: "2026-06-23 — AutoTranslate data answers + Conversion Dashboard deploy-lag"
created: 2026-06-23
updated: 2026-06-23
tags:
  - autotranslate
  - deepl
  - dashboard
  - netlify
  - session
status: current
related:
  - "[[Questions Auto Translate]]"
  - "[[UNITY-9917-export-request-draft]]"
  - "[[meeting-2026-06-15-with-Chris]]"
---

# 2026-06-23 — AutoTranslate data answers + Conversion Dashboard deploy-lag

Two threads: diagnosing a Trial Conversion Dashboard "missing changes" report, and capturing the AutoTranslate data Marion + two Confluence pages finally provided.

## Conversion Dashboard — it was a deploy lag, not a code problem

A downloaded `index (2).html` (pulled from the Netlify deploy) appeared to be "missing the last changes" versus `.raw/Conversion_Dashboard.html`. Investigation:

- The download and `.raw/Conversion_Dashboard.html` are **byte-identical** (same MD5 after normalizing CRLF→LF). `.raw` is itself only a "rescue from Netlify" snapshot, not the edit source — so it is not authoritative.
- Both files contain the **cohort-baseline code**: `TRACKING_START = '2026-04'`, the `created_at >= '2026-04'` cohort filter, and the unconditional "Since April 2026" badge.
- Rendering the downloaded file live (served locally, real Supabase data) produced the **correct** view: 81-shop cohort, 6.2 % conversion, "Since April 2026", no Payment-Failed cohort row.
- The "wrong" 28 % / 118-shop view (with a Payment-Failed row, no badge) is an **older build still live on Netlify** — the cohort-baseline change was never deployed.

**Resolution:** the user's bookmarked link pointed at an old deploy. The file on disk is correct; the live site just needs a redeploy to match. Key lesson: `.raw/Conversion_Dashboard.html` is a downstream snapshot, not where edits live.

## AutoTranslate — the data finally arrived

Marion's email (2026-06-23) plus two Confluence pages answered the long-open AutoTranslate questions. Full detail (tables, provider rollout, workflow, accounting, both shop lists) is captured in [[Questions Auto Translate]]. Headlines:

- **No automated data feed exists today** — usage is assembled by hand. But an **export script already exists and works**, it just isn't scheduled: `usageAutoTranslation.pl -allstores` produces a per-store usage CSV.
- **Budget model:** per-ShopType `AutoTranslationMaxPackageCharacters` (e.g. ePages Cloud/Direct NowM 1M, NowXL 5M; other providers NowM 500K, NowXL 1M). Exceeding it prompts the merchant to buy via Stripe; once `AutoTranslationAddOnBought = 1` the cap rises to 25M chars.
- **Pricing:** DeepL API Pro, 4.99 €/month + 20 € per 1,000,000 characters sent to DeepL.
- **Booked-AddOn shops** and a tracked-usage shop list are now recorded (partial — screenshots cut at the fold).

## Outputs

- [[Questions Auto Translate]] — both Confluence pages folded in; budget/cost/Wilfried-table questions closed.
- [[UNITY-9917-export-request-draft]] — drafted (short + long) request asking R&D to schedule the export script and deposit a stable CSV.
- TODO updated: "Chase Marion" done; new item to decide the export-automation next step with Chris.

## Constraints noted

- Claude has **no Confluence/Atlassian access** (org policy) — content must be pasted in by the user.
