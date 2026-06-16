---
type: concept
title: "Honest Stock-Signal Tool Blueprint"
created: 2026-06-16
updated: 2026-06-16
tags:
  - concept
  - investing
  - machine-learning
  - architecture
  - how-to
status: current
related:
  - "[[Backtest Overfitting]]"
  - "[[Machine Learning for Asset Pricing]]"
  - "[[Alpha Decay and Transaction Costs]]"
  - "[[LLMs in Investing]]"
  - "[[Efficient Market Hypothesis]]"
  - "[[Research- Can AI Predict Which Stocks Will Go Up]]"
sources:
  - "[[lopez-de-prado-10-reasons-ml-funds-fail]]"
  - "[[bailey-lopez-de-prado-backtest-overfitting]]"
---

# Honest Stock-Signal Tool Blueprint

If you build this anyway (real money, own capital), build it to *find out whether you have an edge* — not to confirm you do. The goal is an honest measurement instrument first, a money-maker second. This is the constructive answer to the reframed research question.

## Step 0 — Pick a defensible objective
Ranked from sane to delusional:
1. **Risk + portfolio tool** (lowest risk): position sizing, exposure/drawdown monitoring, rebalancing a factor/index portfolio. Most reliable value. (confidence: high)
2. **Factor harvesting**: tilt toward documented premia (value, momentum, quality, low-vol) cheaply. Defensible — you're capturing known risk premia, not "alpha."
3. **Cross-sectional ranking** of a broad universe into a *diversified long-short basket* (the [[Machine Learning for Asset Pricing]] approach) — accept the edge is tiny and mostly in illiquid names.
4. **"Predict which single stock will go up"** (highest risk): the original prompt. Treat as the least defensible; if you pursue it, the bar below is non-negotiable.

## Data layer (and its costs)
- **Point-in-time data only** — prices, fundamentals, and any text must reflect *what was knowable on the decision date*. Restated fundamentals and survivorship-cleaned universes leak the future.
- **Include delisted/dead stocks** (survivorship bias — same lesson as [[Survivorship Bias in SaaS Metrics]]).
- Quality market/fundamental data is **licensed and not free**; free APIs are often survivorship-biased or restated. Budget for this.

## Modeling layer
- Start with a **simple, transparent baseline** (linear/logistic, or a single gradient-boosted tree). Simple usually wins net of costs; complexity mostly adds overfitting.
- Use **fractional differentiation** (keep memory while making data stationary), sane **labels** (triple-barrier, not fixed-horizon), and **sample weights** for overlapping/non-IID labels. (Source: [[lopez-de-prado-10-reasons-ml-funds-fail]])
- LLMs belong in the **feature layer** (sentiment, filing summaries) over point-in-time text — never as the final oracle (see [[LLMs in Investing]]).

## Validation layer (the part that matters most)
- **Purged + embargoed cross-validation; Combinatorial Purged CV** for multiple backtest paths — never plain k-fold or single-path walk-forward.
- **Track every configuration you try.** Report the **Deflated Sharpe Ratio** and **Probability of Backtest Overfitting**. (Source: [[bailey-lopez-de-prado-backtest-overfitting]])
- Reserve a **final hold-out set touched exactly once.**
- Evaluate **net of realistic costs and ~26% German tax** (see [[Alpha Decay and Transaction Costs]]), not gross.

## Tooling (open source, 2025)
- Backtesting: **VectorBT** (fast, vectorized signal research), **Backtrader** (event-driven, realistic), **Zipline/Zipline-Reloaded** (factor research via Pipeline API, legacy Python), **Qlib** (Microsoft, ML-oriented). (confidence: medium)
- Validation: `mlfinlab`-style purged CV, `skfolio` (CombinatorialPurgedCV), `pypbo` for PBO.
- Execution/data: **Interactive Brokers API** (Python) for both data and automated orders; paper-trade account first.

## Execution & risk discipline
- **Paper-trade for months** before committing money; live behavior diverges from backtest.
- **No-trade zone**: only act when signal strength exceeds round-trip cost (see [[Alpha Decay and Transaction Costs]]).
- Hard **position sizing and stop/drawdown limits**; size for risk-of-ruin, not for maximum expected return (avoid full-Kelly).
- Pre-commit a **kill criterion**: the live-performance threshold below which you stop. Decide it *before* trading.

## The honest expectation
Built this way, the most likely finding is **"no edge survives costs"** — and that is a *successful* outcome, because it saves real money. The tool's first job is to deliver that verdict credibly. See the parent synthesis: [[Research- Can AI Predict Which Stocks Will Go Up]].
