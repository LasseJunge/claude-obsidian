---
type: concept
title: "Machine Learning for Asset Pricing"
created: 2026-06-16
updated: 2026-06-16
tags:
  - concept
  - machine-learning
  - investing
status: current
related:
  - "[[Efficient Market Hypothesis]]"
  - "[[Backtest Overfitting]]"
  - "[[Alpha Decay and Transaction Costs]]"
  - "[[Honest Stock-Signal Tool Blueprint]]"
sources:
  - "[[gu-kelly-xiu-empirical-asset-pricing-ml]]"
---

# Machine Learning for Asset Pricing

What the best peer-reviewed evidence actually says ML can and cannot do for predicting stock returns. The honest answer is "a little, in a specific place, before costs."

## What works (the real signal)
- ML — especially **neural networks and gradient-boosted trees** — does extract *some* predictability that linear models miss, via nonlinear interactions. (Source: [[gu-kelly-xiu-empirical-asset-pricing-ml]], confidence: high)
- The recurring predictive signals are **momentum, liquidity, and volatility** — i.e. known risk factors, not secret patterns.

## How small the edge is
- Best out-of-sample **monthly R² ≈ 0.33–0.40%.** That is not a typo: the model explains well under 1% of next month's return variance. The "signal" is a faint tilt of the odds, not a crystal ball.
- A long–short portfolio on those predictions shows a strong-looking Sharpe — **but 1.35 value-weighted vs 2.45 equal-weighted.**

## The critical tell: the value-weighted / equal-weighted gap
The equal-weighted Sharpe is ~80% higher than the value-weighted one. **Equal-weighting overloads tiny, illiquid stocks.** So most of the measured "alpha" lives where you cannot trade meaningful size without moving the price against yourself. This is the recurring pattern in academic return prediction: the edge is real, gross, and mostly trapped in microcaps. (confidence: high)

## What this means for a builder
1. The academic result is **gross of transaction costs** and assumes frictionless rebalancing — see [[Alpha Decay and Transaction Costs]].
2. It uses a **45-year dataset and 900+ engineered signals** built by finance PhDs — not something a retail tool reproduces casually.
3. Even then it is a *statistical tilt*, best expressed as a diversified long-short factor portfolio, **not** a "this stock will go up" oracle.
4. Newer "virtue of complexity" work (Kelly et al., 2024) argues very high-parameter models can help — but the costs, capacity, and overfitting caveats compound, not vanish.

The defensible use of ML here is **factor harvesting and risk modeling**, not point prediction of single-stock direction.
