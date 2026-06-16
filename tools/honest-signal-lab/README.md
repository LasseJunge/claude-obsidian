# honest-signal-lab

Two small tools that make you **distrust your own backtests before you risk real
money** — companions to the wiki research
[*Can AI Predict Which Stocks Will Go Up?*](../../wiki/questions/Research-%20Can%20AI%20Predict%20Which%20Stocks%20Will%20Go%20Up.md)
and its [Honest Stock-Signal Tool Blueprint](../../wiki/concepts/Honest%20Stock-Signal%20Tool%20Blueprint.md).

- **`overfitting_demo.py`** — pure standard library, zero setup. A synthetic Monte
  Carlo that shows a great-looking backtest is usually luck, and runs the Deflated
  Sharpe gate that catches it.
- **`signal_lab.py`** — *real* market data (yfinance). Runs a momentum factor and a
  walk-forward ML model through the same honest gauntlet and compares them to just
  buying the index. Needs `pip install yfinance scikit-learn`.

Both exist because the research found the #1 reason DIY stock tools lose money is
**backtest overfitting**: try enough configurations and one *will* look brilliant
on past data by pure chance, then fail live. These tools show that truth instead
of hiding it.

## What `overfitting_demo.py` does

It runs a **Monte Carlo** — many independent synthetic markets — so the lesson is
the systematic truth, not one lucky dataset:

1. Builds **80 independent synthetic markets**, each with **no timing-exploitable
   signal** (independent daily returns, small positive drift). Buy-and-hold works;
   timing does not. We *know* there is no edge, by construction.
2. In **each** market it grid-searches **120 moving-average strategies** (long/short)
   and keeps the one with the best **in-sample** Sharpe.
3. It judges that same "winner" **out-of-sample** and **averages across all markets**,
   exposing the systematic pattern: in-sample Sharpe is inflated by the search and
   does **not** persist (out-of-sample Sharpe ≈ 0, positive about half the time).
4. Computes the **Deflated Sharpe Ratio** (Bailey & López de Prado, 2014), which
   accounts for how many configurations you tried and correctly reports the winners
   as *no better than chance*.
5. Applies a realistic **cost model + German Abgeltungssteuer (~26.375%)** to show
   the overfit tool **loses to simply holding**, net of everything.

> A single random dataset is itself subject to luck — sometimes an overfit strategy
> looks good out-of-sample by chance. Averaging over many markets is what makes the
> demonstration honest rather than an anecdote — the same discipline the tool teaches.

## Run `overfitting_demo.py`

It uses **only the Python 3 standard library** — no `pip install`.

```powershell
python overfitting_demo.py
```

> **Note for this machine:** Python is installed at
> `%LOCALAPPDATA%\Programs\Python\Python312\python.exe`. The bare name `python` is
> still shadowed by the Windows Store stub, so either call that full path, e.g.
> ```powershell
> & "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" overfitting_demo.py
> ```
> or disable the stub under **Settings → Apps → Advanced app settings → App
> execution aliases** (toggle off `python.exe` / `python3.exe`).

## Reading the output

| Line | What it tells you |
|------|-------------------|
| **strategies searched** | The multiple-testing count per market. More trials → easier to find a fake winner. |
| **Best in-sample Sharpe** | The seductive number, averaged over markets. Looks like a real edge (~0.7). |
| **Out-of-sample Sharpe** | Reality, averaged: ≈ 0 — the in-sample edge does not persist. |
| **OOS stayed positive %** | How often the "winner" was even positive out-of-sample (~50%, a coin flip). |
| **Naive P(SR>0)** | What a beginner reports — ignores the search, looks high (~84%). |
| **Deflated P(SR>0)** | The honest number — ~46%, i.e. no better than chance once the trial count is in. |
| **tool vs buy-and-hold** | Net-of-cost-and-tax: the overfit tool *loses* to simply holding. |

## The three guardrails it operationalizes

1. **Count every configuration you try** — then deflate for it.
2. **Deflate the Sharpe** — a Sharpe of 2 after 1 trial ≠ after 1,000 trials.
3. **Net out costs and tax** — gross signal ≠ net profit.

## `signal_lab.py` — the same discipline on real data

This is the blueprint realized on actual market history. It builds a monthly panel
for ~48 large-cap US stocks (+ SPY benchmark), then runs two strategies through the
honest gauntlet and compares them to **just buying the index**:

1. **Momentum 12-1** — rank by the past-12-months-skip-1 return, hold the top third.
   A pre-specified rule (no fitting). The control.
2. **ML (walk-forward)** — gradient-boosted trees predict next-month returns from a
   few features, retrained each month on only past data **with a 1-month embargo**
   so the model never sees the future. Long the top third of its predictions.

Everything is **out-of-sample**, **net of 10 bps/side costs + ~26.375% German tax**,
with a P(Sharpe>0) significance check. Setup and run:

```powershell
& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" -m pip install yfinance scikit-learn
& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" signal_lab.py
# (first run downloads + caches to ./data/prices.csv; use --refresh to re-fetch)
```

**Representative result** (2014-2024, your mileage will vary):

```
 Momentum 12-1       12.1%    0.87   ...   LOST TO buy-and-hold
 ML (walk-fwd)       10.7%    0.68   ...   LOST TO buy-and-hold
 Buy & hold SPY      13.2%    0.92   ...   winner
```

Both stock-pickers lost to simply holding SPY — *even with* the biases below
stacked in their favor. That is the honest answer.

### Warnings baked into the output (read them)

- **Survivorship bias.** The universe is stocks that still trade *today*; the dead
  ones are missing, so every result is an **optimistic upper bound**. Same trap as
  [Survivorship Bias in SaaS Metrics](../../wiki/concepts/Survivorship%20Bias%20in%20SaaS%20Metrics.md).
- **P(SR>0) assumes ONE pre-specified strategy.** If you try many and keep the best,
  you must deflate — that is what `overfitting_demo.py` shows.
- **Costs are optimistic** (real spreads/slippage and German tax filing add more),
  and **one historical path is not the future** — alpha decays as others find it.
- For production-grade work the Python ecosystem is `skfolio` (`CombinatorialPurgedCV`),
  `mlfinlab`, `vectorbt`, `backtrader`. This tool stays small and readable on purpose.

## Disclaimer

These are educational instruments, **not** a trading system and **not** financial
advice. Their most valuable output is teaching you to expect *"no edge survives
costs"* — which, for real money, is usually the correct and profitable answer.
