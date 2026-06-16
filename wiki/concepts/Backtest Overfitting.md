---
type: concept
title: "Backtest Overfitting"
created: 2026-06-16
updated: 2026-06-16
tags:
  - concept
  - investing
  - machine-learning
  - statistics
status: current
related:
  - "[[Honest Stock-Signal Tool Blueprint]]"
  - "[[Machine Learning for Asset Pricing]]"
  - "[[Survivorship Bias in SaaS Metrics]]"
  - "[[Research- Can AI Predict Which Stocks Will Go Up]]"
sources:
  - "[[bailey-lopez-de-prado-backtest-overfitting]]"
  - "[[lopez-de-prado-10-reasons-ml-funds-fail]]"
---

# Backtest Overfitting

**The single biggest reason DIY stock tools fail.** A backtest tells you how a strategy *would have* performed on past data. If you tune the strategy until the backtest looks good, you have not found an edge — you have found the configuration that best fits *noise* that won't repeat.

## The core result
With modern compute you can try thousands of configurations. **A high in-sample Sharpe ratio is trivially achievable by chance** once you try enough. The more you optimize, the more out-of-sample performance regresses toward — or below — zero. (Source: [[bailey-lopez-de-prado-backtest-overfitting]], confidence: high)

Because builders rarely report how many configurations they tried, **most reported backtests are uninterpretable**: you cannot tell skill from luck.

## The defenses (use all of them)
- **Deflated Sharpe Ratio (DSR)** — discount the observed Sharpe by the number of trials, skew, and kurtosis. A Sharpe of 2 after 1 trial ≠ a Sharpe of 2 after 1,000 trials.
- **Probability of Backtest Overfitting (PBO)** — estimates the chance your "best" config is a fluke.
- **Minimum Backtest Length (MinBTL)** — the data length needed before a top-N selection is meaningful; grows with the number of strategies tried.
- **Purging + embargo + Combinatorial Purged CV (CPCV)** — remove training samples whose labels overlap the test window, add a time buffer, and test on many paths instead of one. Plain k-fold and single-path walk-forward both leak or overfit. (Source: [[lopez-de-prado-10-reasons-ml-funds-fail]])

## Sibling failure modes
- **Look-ahead bias** — using info not available at decision time (e.g. an LLM that already "knows" the outcome; see [[LLMs in Investing]]).
- **Survivorship bias** — testing only on stocks that still exist deletes the failures, inflating returns. Same disease as [[Survivorship Bias in SaaS Metrics]] in a different domain: you must retain the dead names.
- **Data snooping** — reusing the same test set until something passes.

## The honest discipline
Decide the strategy *before* seeing the test data. Track every configuration you try. Deflate accordingly. Hold out a final test set you touch exactly once. If you can't do this with discipline, a backtest will lie to you — confidently.
