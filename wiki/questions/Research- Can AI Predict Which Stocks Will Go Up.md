---
type: synthesis
title: "Research: Can AI Predict Which Stocks Will Go Up? (and how to build an honest tool)"
created: 2026-06-16
updated: 2026-06-16
tags:
  - research
  - investing
  - machine-learning
  - ai
status: developing
related:
  - "[[Efficient Market Hypothesis]]"
  - "[[Machine Learning for Asset Pricing]]"
  - "[[Backtest Overfitting]]"
  - "[[Alpha Decay and Transaction Costs]]"
  - "[[LLMs in Investing]]"
  - "[[Honest Stock-Signal Tool Blueprint]]"
  - "[[Marcos Lopez de Prado]]"
  - "[[Renaissance Technologies]]"
sources:
  - "[[gu-kelly-xiu-empirical-asset-pricing-ml]]"
  - "[[bailey-lopez-de-prado-backtest-overfitting]]"
  - "[[spiva-us-scorecard]]"
  - "[[lopez-de-prado-10-reasons-ml-funds-fail]]"
  - "[[llms-in-equity-markets-review]]"
  - "[[day-trading-profitability-studies]]"
  - "[[buffett-hedge-fund-bet]]"
---

# Research: Can AI Predict Which Stocks Will Go Up?

> Scope chosen with the user: **Evidence + honest blueprint**, for **real money / own capital**. Cost drag, position sizing, risk of ruin, and net-of-fee reality are kept front and center.

## Overview
The evidence is consistent and unsentimental: **AI does not reliably predict which individual stocks will go up, net of costs.** It extracts a *tiny* statistical tilt (best-case ~0.3–0.4% monthly R²) that is real but mostly trapped in small, illiquid stocks and largely eaten by trading costs and taxes. AI *is* genuinely useful in investing — for reading text, summarizing research, factor harvesting, and risk management — but the "automatically tracks what stock will go up" framing is the single least defensible use, and the one most likely to lose real money.

## The prompt, made better (what you asked for)
**Original:** "investing with AI and how to build a tool that automatically tracks what stock will go up."

**Why it's flawed:** (1) "*will* go up" assumes deterministic predictability the evidence rejects; (2) it conflates broadly-useful "AI in investing" with the hardest, most over-promised "AI stock-picker"; (3) it omits the factors that actually decide viability — overfitting, costs, capacity, taxes, look-ahead bias.

**Reframed research question (used for this study):**
> *"Where does AI genuinely add edge in investing vs where is it hype — judged against the efficient-market baseline and net-of-cost reality — and what would a technically and intellectually honest stock-signal tool look like (data, models, validation, costs, legal), including a candid account of why most such tools fail?"*

**Better builder prompt** (if you proceed): *"Build a research instrument that honestly measures whether a cross-sectional stock-ranking signal has any edge after realistic costs and German tax, using point-in-time data including delisted names, purged/embargoed cross-validation, a deflated Sharpe ratio, and a one-touch hold-out — and that reports 'no edge' as a valid, expected result."*

## Key Findings
- **The base rate is brutal.** Over 15 years, *no* US equity fund category had a majority of active managers beat their benchmark; ~79% of large-cap funds lag over 20 years. (Source: [[spiva-us-scorecard]], confidence: high)
- **The pros lose too.** The most sophisticated hedge funds lost a decade-long bet to a passive index, ~7.1% vs ~2.2% annualized. (Source: [[buffett-hedge-fund-bet]], confidence: high)
- **Retail odds are worse.** 97% of persistent day traders lose money; <1% reliably earn abnormal returns net of fees. (Source: [[day-trading-profitability-studies]], confidence: high)
- **ML's edge is real but tiny and illiquid.** Best out-of-sample monthly R² ≈ 0.33–0.40%; long-short NN Sharpe 1.35 value-weighted vs **2.45 equal-weighted** — the gap proves the signal lives in microcaps you can't trade at size. (Source: [[gu-kelly-xiu-empirical-asset-pricing-ml]], confidence: high)
- **Most backtests are fiction.** Try enough configurations and a high Sharpe appears by chance; out-of-sample then collapses. Deflate by trials; use purged CV. (Source: [[bailey-lopez-de-prado-backtest-overfitting]]; [[lopez-de-prado-10-reasons-ml-funds-fail]], confidence: high)
- **LLMs read text well, beat the market unproven.** Strong at sentiment/summarization; almost no studies show profit *after* costs; uniquely exposed to look-ahead bias. (Source: [[llms-in-equity-markets-review]], confidence: high)
- **Costs + tax are decisive for real money.** Spread + impact + slippage + ~26.4% German Abgeltungssteuer, with no long-term-holding discount, turn many gross "edges" into net losses. (Source: [[Alpha Decay and Transaction Costs]], confidence: high)

## Key Entities
- [[Marcos Lopez de Prado]]: the authority on why ML funds fail; deflated Sharpe, purged CV.
- [[Renaissance Technologies]]: the Medallion outlier — proves an edge *can* exist, proves *you* can't replicate it (closed, capacity-capped, dozens of PhDs).

## Key Concepts
- [[Efficient Market Hypothesis]]: the baseline; beating it net of costs is the extraordinary claim.
- [[Machine Learning for Asset Pricing]]: what ML can (a tiny tilt) and can't (oracle prediction) do.
- [[Backtest Overfitting]]: the #1 way DIY tools fool their builders.
- [[Alpha Decay and Transaction Costs]]: where gross edges die; the German tax math.
- [[LLMs in Investing]]: real-vs-hype on the AI-specific angle; look-ahead bias.
- [[Honest Stock-Signal Tool Blueprint]]: the constructive how-to, built to find truth not confirm hope.

## Contradictions
- **"ML doubles returns" (Gu/Kelly/Xiu) vs "active management fails" (SPIVA).** Reconciled: the ML gains are *gross*, mostly in *illiquid* stocks, in an *academic* setting; SPIVA measures *net, real-world, at-scale* results. Both are true at their own altitude. The honest read: gross statistical signal ≠ net tradable profit.
- **"AI beats benchmarks" (vendor/MarketSenseAI) vs "no net-of-cost evidence" (review).** The positive cases are single studies, not net of costs, and exposed to look-ahead bias. Weight the cautious review (confidence: high) over single vendor results (confidence: low).
- **"Renaissance proves it works" vs EMH.** Reconciled: a tiny, well-resourced, capacity-limited edge exists; it does not generalize to a retail laptop in liquid large-caps.

## Open Questions
- Exact per-method R²/Sharpe tables and the MinBTL formula were extracted via secondary sources (the RFS and AMS PDFs returned 403 / unreadable). Verify against primary PDFs before formal use. (see [[gu-kelly-xiu-empirical-asset-pricing-ml]], [[bailey-lopez-de-prado-backtest-overfitting]])
- What is the *realistic capacity* (€ AUM) at which the academic cross-sectional signal stops working for a retail account? Not quantified here.
- Does any post-2024 "virtue of complexity" result survive *net of costs* out-of-sample? Open.
- German-specific: precise tax treatment of an automated long-short equity strategy (Termingeschäfte/derivatives loss-offset rules) — flagged, not fully resolved.
- Not researched: crypto markets (different microstructure/regulation), and the legal line if the tool ever advises *others* (would trigger BaFin/MiFID investment-advice rules — out of scope for own-capital use).

## Sources
- [[gu-kelly-xiu-empirical-asset-pricing-ml]]: Gu, Kelly, Xiu, RFS 2020
- [[bailey-lopez-de-prado-backtest-overfitting]]: Bailey et al., AMS Notices 2014
- [[spiva-us-scorecard]]: S&P Dow Jones Indices, 2025
- [[lopez-de-prado-10-reasons-ml-funds-fail]]: López de Prado, JPM 2018
- [[llms-in-equity-markets-review]]: LLMs in equity markets review, 2025
- [[day-trading-profitability-studies]]: Brazil (Chague et al.) & Taiwan (Barber et al.)
- [[buffett-hedge-fund-bet]]: Long Bets #362, 2008–2017

## Bottom line
If the goal is to make money: the highest-expected-value "AI investing" move for own capital is **low-cost, diversified, factor-aware index investing with AI used for research and risk monitoring** — not a single-stock prediction engine. If you build the predictor anyway, build it as an **honest measurement instrument** ([[Honest Stock-Signal Tool Blueprint]]) whose most probable — and still valuable — output is *"no edge survives costs."*
