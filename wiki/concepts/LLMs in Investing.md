---
type: concept
title: "LLMs in Investing"
created: 2026-06-16
updated: 2026-06-16
tags:
  - concept
  - llm
  - investing
  - ai
status: current
related:
  - "[[Machine Learning for Asset Pricing]]"
  - "[[Backtest Overfitting]]"
  - "[[Honest Stock-Signal Tool Blueprint]]"
  - "[[Research- Can AI Predict Which Stocks Will Go Up]]"
sources:
  - "[[llms-in-equity-markets-review]]"
---

# LLMs in Investing

Separating what large language models genuinely do in investing from the marketing. The split is sharp: **good at reading text, unproven at beating the market.**

## Where LLMs genuinely help (real, modest)
- **Sentiment extraction** from news, transcripts, and social text — LLMs beat older tools (FinBERT, VADER) at reading tone. (Source: [[llms-in-equity-markets-review]], confidence: medium)
- **Summarizing long filings** (100+ page 10-Ks/annual reports) and **accelerating research** — turning unstructured documents into structured notes.
- **Drafting and triage** — surfacing what a human analyst should look at, faster.

These are *research-productivity* gains. They make a human (or a disciplined factor process) faster — they do not, by themselves, constitute an edge.

## Where the hype outruns the evidence
- The review found **almost no studies reporting profit *after* transaction costs.** Accuracy percentages and Sharpe ratios are quoted; net tradable profit is the missing number. (confidence: high)
- Positive cases are single studies (e.g. MarketSenseAI 2.0: 125.9% vs 73.5% index, *not* net of costs — confidence: low). A Gemini 1.5 Flash test did **not** consistently beat basic benchmarks. (confidence: medium)

## The LLM-specific killer: look-ahead bias
An LLM trained on text through 2024 **already "knows" what happened.** Backtesting it on 2020–2023 headlines lets it leak the future into its "predictions." A spectacular backtest may just be **the model remembering the answer.** (Glasserman & Lin 2023, confidence: high.) This is uniquely severe for LLMs and trivially easy to get wrong. To test honestly you must use a model whose training cutoff precedes the test window, or strictly point-in-time data.

## Verdict for a stock tool
Use an LLM as a **reading and summarization layer** over point-in-time sources, feeding a transparent, separately-validated decision process. Do **not** ask an LLM "will this stock go up?" and trade on the answer — that path is contaminated by look-ahead bias and unvalidated against costs.
