---
type: source
source_type: peer-reviewed review
title: "Large Language Models in equity markets: applications, techniques, and insights"
author: "(review article, PMC12421730)"
date_published: 2025
venue: "Discover Computing / PMC"
url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12421730/"
retrieved: 2026-06-16
confidence: medium
tags:
  - source
  - llm
  - investing
  - sentiment
related:
  - "[[LLMs in Investing]]"
  - "[[Research- Can AI Predict Which Stocks Will Go Up]]"
---

# LLMs in Equity Markets — Review (2025)

A 2025 survey of how large language models are used in equity investing. Useful because it is a *review* (aggregates many studies) and is explicitly cautious rather than promotional.

## Key claims
- LLMs add genuine value in **sentiment extraction from news/social text, summarizing long filings (100+ page 10-Ks), and automating research reporting** — they beat older methods (FinBERT, VADER) at reading tone. (confidence: medium)
- Concrete profit-after-costs figures are **almost entirely absent** from the literature. The review calls this a major gap: "few have tested LLM-driven investment strategies in real-world trading conditions." (confidence: high)
- Cited positive case: **MarketSenseAI 2.0 — 125.9% cumulative vs 73.5% index** on S&P 100 (2023–2024). But it is a single study, not net of costs. (confidence: low)
- Cited negative case: a **Gemini 1.5 Flash evaluation (Perlin et al.) did NOT consistently beat basic benchmarks**, and risk-adjusted returns *declined* with longer horizons. (confidence: medium)

## Critical risks the review flags
- **Look-ahead bias** (Glasserman & Lin 2023): an LLM trained on text up to 2024 already "knows" what happened — backtests on pre-cutoff periods inadvertently leak the future. This is uniquely severe for LLMs and easy to get wrong. (confidence: high)
- **Distraction effect**: irrelevant company info skews sentiment scoring.
- **Survivorship bias & data leakage** in most backtests inflate the reported numbers.

## The critical read
The review's verdict: useful for *reading text*, unproven for *beating the market net of costs*. The look-ahead bias point is the killer for any LLM-based stock tool — a glowing backtest may just be the model remembering the answer.
