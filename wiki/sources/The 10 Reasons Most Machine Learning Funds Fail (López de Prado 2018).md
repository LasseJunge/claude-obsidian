---created: 2026-06-16
updated: 2026-06-16

aliases:
  - "lopez-de-prado-10-reasons-ml-funds-fail"
---

﻿---
type: source
source_type: peer-reviewed paper
title: "The 10 Reasons Most Machine Learning Funds Fail"
aliases:
  - "lopez-de-prado-10-reasons-ml-funds-fail"
author: "Marcos López de Prado"
date_published: 2018
venue: "Journal of Portfolio Management 44(6), 120–133"
url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3104816"
retrieved: 2026-06-16
confidence: high
tags:
  - source
  - machine-learning
  - investing
  - backtesting
related:
  - "[[Backtest Overfitting]]"
  - "[[Marcos Lopez de Prado]]"
  - "[[Honest Stock-Signal Tool Blueprint]]"
---

# The 10 Reasons Most Machine Learning Funds Fail (López de Prado 2018)

A practitioner-academic (then at AQR / Lawrence Berkeley National Lab) enumerating the concrete technical errors that sink ML-in-finance projects. Companion to his book *Advances in Financial Machine Learning*.

## The pitfalls
1. **The Sisyphus paradigm** — a lone researcher trying to build a full strategy end-to-end. "It takes almost as much effort to produce one true strategy as a hundred." Solution: the **Meta-Strategy paradigm** — a specialized, assembly-line team. A solo retail builder is structurally disadvantaged. (confidence: high)
2. **Research through backtesting** — using the backtest as the discovery tool guarantees overfitting (see [[Backtest Overfitting]]).
3. **Chronological / inefficient sampling** — sampling bars by clock time rather than information arrival.
4. **Integer differentiation** — over-differencing to force stationarity destroys the memory (predictive signal). Use fractional differentiation.
5. **Fixed-time-horizon labeling** — naive labels; he proposes the *triple-barrier* method.
6. **Learning side and size simultaneously** — conflating direction and bet-sizing.
7. **Weighting non-IID samples** — financial labels overlap in time and are not independent.
8. **Cross-validation leakage** — standard k-fold leaks future info; needs **purging + embargo** (see [[Backtest Overfitting]]).
9. **Walk-forward-only backtesting** — a single path overfits; use combinatorial purged CV.
10. **Backtest overfitting** — the cumulative result of the above.

## The critical read
Nearly every item is a way the model "learns" noise that won't repeat. Most are invisible to a beginner: the tool will look like it works and then lose money live. This list doubles as the QA checklist for the [[Honest Stock-Signal Tool Blueprint]].
