---
type: source
source_type: peer-reviewed paper
title: "Empirical Asset Pricing via Machine Learning"
author: "Shihao Gu, Bryan T. Kelly, Dacheng Xiu"
date_published: 2020
venue: "Review of Financial Studies 33(5), 2223–2273"
url: "https://academic.oup.com/rfs/article/33/5/2223/5758276"
retrieved: 2026-06-16
confidence: high
tags:
  - source
  - machine-learning
  - investing
  - asset-pricing
related:
  - "[[Machine Learning for Asset Pricing]]"
  - "[[Efficient Market Hypothesis]]"
  - "[[Research- Can AI Predict Which Stocks Will Go Up]]"
---

# Empirical Asset Pricing via Machine Learning (Gu, Kelly, Xiu 2020)

The canonical academic study on whether machine learning predicts stock returns. Published in the *Review of Financial Studies*, the highest-tier finance journal — not a vendor whitepaper.

## What they did
Compared ML methods (penalized linear/elastic net, dimension reduction, random forests, gradient-boosted trees, neural networks) on a panel of ~30,000 US stocks, 1957–2016, using 94 firm characteristics + 8 macro time-series + 74 industry dummies (>900 signals total). (Source: search synthesis of the paper)

## Key claims
- ML beats traditional linear forecasts; **neural networks and trees win** because they capture nonlinear interactions. (confidence: high)
- **Out-of-sample monthly R² is ~0.33–0.40%** for the best stock-level models. This is the headline number — predictability is real but *tiny*. (confidence: high)
- A long–short decile portfolio sorted on NN predictions earns an **annualized out-of-sample Sharpe of 1.35 value-weighted vs 2.45 equal-weighted**. (confidence: high)
- Dominant signals across all methods: **momentum, liquidity, volatility**. (confidence: high)

## The critical read
The equal-weighted Sharpe (2.45) is nearly double the value-weighted one (1.35). That gap is the tell: **most of the predictability lives in small, illiquid stocks** that are costly or impossible to trade at scale. The authors themselves flag that trading costs erode gross returns and gains concentrate in microcaps. A retail tool replicating this captures the *gross academic* signal, not the *net tradable* one.

> [!gap] Exact per-method R² and Sharpe tables were extracted via a secondary summary, not the raw PDF (the PDF fetch returned rounded/unreliable figures). Numbers above match the widely-cited replication figures; verify against the RFS PDF before quoting in a formal context.
