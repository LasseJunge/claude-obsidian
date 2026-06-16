---
type: source
source_type: peer-reviewed paper
title: "Pseudo-Mathematics and Financial Charlatanism / The Deflated Sharpe Ratio"
author: "David H. Bailey, Jonathan Borwein, Marcos López de Prado, Qiji Jim Zhu"
date_published: 2014
venue: "Notices of the American Mathematical Society 61(5); Journal of Portfolio Management"
url: "https://www.ams.org/notices/201405/rnoti-p458.pdf"
retrieved: 2026-06-16
confidence: high
tags:
  - source
  - backtesting
  - statistics
  - investing
related:
  - "[[Backtest Overfitting]]"
  - "[[Marcos Lopez de Prado]]"
  - "[[Honest Stock-Signal Tool Blueprint]]"
---

# Pseudo-Mathematics and Financial Charlatanism (Bailey et al. 2014)

Published in the *Notices of the American Mathematical Society* — mathematicians, not marketers, warning the finance industry. The foundational paper on why most backtests are worthless.

## Key claims
- With modern compute, a researcher can try thousands of strategy configurations. **High in-sample Sharpe ratios are trivially achievable by chance once you try enough configurations** — this is "backtest overfitting." (confidence: high)
- The probability of overfitting rises with the number of configurations tried. **The more you optimize, the more the out-of-sample performance tends toward (or below) zero.** (confidence: high)
- Because analysts almost never report how many configurations they tried, **investors cannot assess overfitting in most published backtests** — making them uninterpretable. (confidence: high)
- Solution: the **Deflated Sharpe Ratio (DSR)** corrects for multiple testing (selection bias) and non-normal returns; the **Probability of Backtest Overfitting (PBO)** and **Minimum Backtest Length (MinBTL)** quantify the risk. MinBTL grows with the number of independent strategies tested. (confidence: high)

## The critical read
This is the single most important paper for anyone building a stock-prediction tool. A tool that lets you "try strategies until one looks good" is an overfitting machine by construction. Any reported Sharpe must be deflated by the number of trials — which a solo builder rarely tracks honestly.

> [!gap] The exact MinBTL formula and the "N trials → expected max Sharpe" table were not extracted (AMS PDF returned HTTP 403). The qualitative result is high-confidence and well-replicated; the formula is in the Deflated Sharpe paper (Bailey & López de Prado, SSRN 2460551).
