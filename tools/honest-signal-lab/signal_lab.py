#!/usr/bin/env python3
"""
signal_lab.py - An HONEST real-data stock-signal research harness.

It does NOT try to sell you an edge. It builds two ranking strategies on real
market data and puts them through the gauntlet that kills most fake edges:
out-of-sample only, net of trading costs AND ~26.375% German tax, compared
against simply buying the index, with a significance check on the Sharpe ratio.

  1. MOMENTUM FACTOR  - rank stocks by 12-1 month momentum, hold the top third.
     A pre-specified, well-documented rule (no fitting). The control.
  2. ML MODEL         - gradient-boosted trees predict next-month returns from a
     few features, in a WALK-FORWARD loop with an embargo so the model never
     sees the future. Long the top third of its predictions.

Both are compared to BUY-AND-HOLD SPY over the same months.

Honest expectation, consistent with the wiki research: a known factor may show a
small, fragile, cost-sensitive edge; the ML model usually does NOT beat the index
net of costs. Either way, this tells you the truth instead of a backtest fantasy.

DATA: yfinance (Yahoo). Stooq was the first choice but is now behind an anti-bot
gate. yfinance is the other no-signup source.

  >>> SURVIVORSHIP-BIAS WARNING <<<
  The universe below is tickers that still exist and trade TODAY. Stocks that
  went to zero or were delisted are missing. This makes EVERY backtest here
  look better than reality. Treat all results as an optimistic upper bound.

USAGE
    python signal_lab.py            # fetches once, caches to ./data/prices.csv
    python signal_lab.py --refresh  # force re-download

Dependencies: yfinance, pandas, numpy, scikit-learn (all pip-installable).

Related wiki pages:
  wiki/concepts/Honest Stock-Signal Tool Blueprint.md
  wiki/concepts/Backtest Overfitting.md
  wiki/concepts/Alpha Decay and Transaction Costs.md
"""

import os
import sys
import math

import numpy as np
import pandas as pd

# Reuse the verified, unit-checked statistics from the overfitting demo.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import overfitting_demo as od  # noqa: E402

# ----------------------------------------------------------------------------
# Configuration
# ----------------------------------------------------------------------------
HERE = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(HERE, "data")
CACHE = os.path.join(DATA_DIR, "prices.csv")

# Large-cap US names that trade today (SURVIVORSHIP-BIASED on purpose; see header).
UNIVERSE = [
    "AAPL", "MSFT", "AMZN", "GOOGL", "JNJ", "JPM", "PG", "KO", "PEP", "WMT",
    "XOM", "CVX", "HD", "MCD", "DIS", "CSCO", "INTC", "VZ", "T", "PFE",
    "MRK", "ABT", "ORCL", "IBM", "CAT", "BA", "MMM", "NKE", "COST", "QCOM",
    "TXN", "HON", "UNH", "WFC", "BAC", "C", "GS", "AXP", "UPS", "LOW",
    "SBUX", "AMGN", "ADBE", "CMCSA", "NEE", "SO", "TGT", "GE",
]
BENCHMARK = "SPY"
START, END = "2010-01-01", "2024-12-31"

COST_ONE_WAY = 0.0010      # 10 bps per side: spread + commission + slippage (optimistic)
TAX_RATE = 0.26375         # German Abgeltungssteuer 25% + 5.5% Soli
TOP_FRACTION = 1.0 / 3.0   # long the top third each month
PERIODS_PER_YEAR = 12      # monthly rebalancing
EMBARGO_MONTHS = 1         # gap between train labels and the prediction month
ML_MIN_TRAIN_MONTHS = 36   # warm-up before the ML walk-forward starts
FEATURES = ["mom_12_1", "mom_6_1", "rev_1", "vol_6"]


# ----------------------------------------------------------------------------
# Data
# ----------------------------------------------------------------------------

def load_prices(refresh=False):
    if os.path.exists(CACHE) and not refresh:
        px = pd.read_csv(CACHE, index_col=0, parse_dates=True)
        return px
    import yfinance as yf
    tickers = UNIVERSE + [BENCHMARK]
    print(f"Downloading {len(tickers)} tickers from yfinance ({START}..{END}) ...")
    raw = yf.download(tickers, start=START, end=END, auto_adjust=True,
                      progress=False)
    px = raw["Close"].copy()
    px = px.dropna(axis=1, how="all")
    os.makedirs(DATA_DIR, exist_ok=True)
    px.to_csv(CACHE)
    print(f"Cached prices to {CACHE}")
    return px


def build_panel(px):
    """Monthly features + forward return. All features at month t use only data
    knowable by the close of month t; the label is the t -> t+1 return."""
    monthly = px.resample("ME").last()
    uni = [t for t in UNIVERSE if t in monthly.columns]
    pxm = monthly[uni]
    ret = pxm.pct_change()

    feats = {
        "mom_12_1": pxm.shift(1) / pxm.shift(13) - 1.0,   # 12m return, skip last month
        "mom_6_1": pxm.shift(1) / pxm.shift(7) - 1.0,     # 6m return, skip last month
        "rev_1": ret,                                      # last-month return (reversal)
        "vol_6": ret.rolling(6).std(),                     # trailing 6m volatility
    }
    fwd = ret.shift(-1)                                    # label: next-month return
    bench_fwd = monthly[BENCHMARK].pct_change().shift(-1)  # SPY t -> t+1
    return monthly.index, uni, feats, fwd, bench_fwd


# ----------------------------------------------------------------------------
# Backtest engine: long the top fraction by score, equal weight, monthly
# ----------------------------------------------------------------------------

def backtest_from_scores(scores, fwd, top_fraction, cost):
    """scores: DataFrame [month x ticker], higher = more long (NaN = unavailable).
    fwd: forward returns [month x ticker] (t -> t+1).
    Returns (monthly_net_return_series, avg_turnover)."""
    prev_w = pd.Series(0.0, index=scores.columns)
    out_r, out_idx, turns = [], [], []
    for t in scores.index:
        row = scores.loc[t].dropna()
        if len(row) < 5:
            continue
        k = max(1, int(round(len(row) * top_fraction)))
        winners = list(row.sort_values(ascending=False).head(k).index)
        fr = fwd.loc[t, winners].dropna()
        if len(fr) == 0:
            continue
        w = pd.Series(0.0, index=scores.columns)
        w[winners] = 1.0 / len(winners)
        gross = fr.mean()
        turnover = float((w - prev_w).abs().sum())
        out_r.append(gross - turnover * cost)
        out_idx.append(t)
        turns.append(turnover)
        prev_w = w
    return pd.Series(out_r, index=pd.DatetimeIndex(out_idx)), (np.mean(turns) if turns else 0.0)


def momentum_scores(uni, feats):
    return feats["mom_12_1"][uni].copy()


def ml_scores(monthly_index, uni, feats, fwd):
    """Walk-forward gradient-boosted trees. Train only on labels realized before
    the prediction month (plus an embargo), so there is no look-ahead."""
    from sklearn.ensemble import HistGradientBoostingRegressor

    # Long panel: rows = (month, ticker), cols = features + label.
    parts = {f: feats[f][uni].stack() for f in FEATURES}
    panel = pd.concat(parts, axis=1)
    panel.columns = FEATURES
    panel["fwd"] = fwd[uni].stack()
    panel = panel.dropna()
    panel.index.names = ["month", "ticker"]

    months = sorted(panel.index.get_level_values("month").unique())
    scores = pd.DataFrame(index=monthly_index, columns=uni, dtype=float)

    for i in range(ML_MIN_TRAIN_MONTHS, len(months)):
        t = months[i]
        cutoff = months[i - 1 - EMBARGO_MONTHS]
        m = panel.index.get_level_values("month")
        train = panel[m <= cutoff]
        test = panel[m == t]
        if len(train) < 200 or len(test) < 5:
            continue
        model = HistGradientBoostingRegressor(
            max_depth=3, max_iter=150, learning_rate=0.05,
            l2_regularization=1.0, random_state=0)
        model.fit(train[FEATURES].values, train["fwd"].values)
        preds = model.predict(test[FEATURES].values)
        for (_, tk), p in zip(test.index, preds):
            scores.loc[t, tk] = p
    return scores


# ----------------------------------------------------------------------------
# Metrics
# ----------------------------------------------------------------------------

def metrics(r):
    """r: monthly return Series (net). Returns a dict of annualized stats."""
    rl = list(r.values)
    n = len(rl)
    cum = float(np.prod([1.0 + x for x in rl]))
    ann_ret = cum ** (PERIODS_PER_YEAR / n) - 1.0 if n and cum > 0 else -1.0
    sr_pp = od.sharpe_per_period(rl)
    ann_sr = sr_pp * math.sqrt(PERIODS_PER_YEAR)
    # Max drawdown on the compounded equity curve.
    eq = np.cumprod([1.0 + x for x in rl])
    peak = np.maximum.accumulate(eq)
    mdd = float((eq / peak - 1.0).min()) if n else 0.0
    # Probability the true (per-period) Sharpe > 0, single strategy (trials = 1).
    psr = od.probabilistic_sharpe_ratio(
        sr_pp, n, od.skewness(rl), od.kurtosis(rl), 0.0) if n > 2 else float("nan")
    net_tax = od.after_tax_terminal(rl)
    return {"n": n, "ann_ret": ann_ret, "ann_sr": ann_sr, "mdd": mdd,
            "psr": psr, "net_tax_total": net_tax}


def fmt_row(name, m, turnover):
    turn = "  n/a" if turnover is None else f"{turnover*100:4.0f}%"
    return (f" {name:<16} {m['ann_ret']*100:7.1f}%  {m['ann_sr']:6.2f}   "
            f"{m['mdd']*100:7.1f}%   {turn}   {m['net_tax_total']*100:8.1f}%   "
            f"{m['psr']*100:5.0f}%")


# ----------------------------------------------------------------------------
# Main
# ----------------------------------------------------------------------------

def main():
    refresh = "--refresh" in sys.argv[1:]
    px = load_prices(refresh=refresh)
    monthly_index, uni, feats, fwd, bench_fwd = build_panel(px)

    # Strategies (each produces a monthly net-return series).
    mom_r, mom_turn = backtest_from_scores(momentum_scores(uni, feats), fwd,
                                           TOP_FRACTION, COST_ONE_WAY)
    print("Training walk-forward ML model (this takes a moment) ...")
    ml_r, ml_turn = backtest_from_scores(ml_scores(monthly_index, uni, feats, fwd),
                                         fwd, TOP_FRACTION, COST_ONE_WAY)

    # Fair comparison: evaluate everything over the ML test window (most restrictive).
    common = ml_r.index.intersection(mom_r.index)
    bench_r = bench_fwd.reindex(common).dropna()
    common = common.intersection(bench_r.index)
    mom_c, ml_c, bench_c = mom_r.loc[common], ml_r.loc[common], bench_r.loc[common]

    m_mom, m_ml, m_bh = metrics(mom_c), metrics(ml_c), metrics(bench_c)
    span = f"{common.min():%Y-%m} .. {common.max():%Y-%m}"

    line = "=" * 86
    print(line)
    print(" HONEST SIGNAL LAB - Real-Data Strategy Harness (yfinance)")
    print(line)
    print(f" Universe: {len(uni)} large-cap US stocks | Benchmark: {BENCHMARK} | "
          f"Period compared: {span} ({len(common)} months)")
    print(f" Rules: long top {TOP_FRACTION*100:.0f}% each month, equal weight, "
          f"{COST_ONE_WAY*1e4:.0f} bps/side cost, {TAX_RATE*100:.1f}% tax on gains")
    print()
    print(" !! SURVIVORSHIP-BIASED universe (only stocks that still exist). Results")
    print("    are an OPTIMISTIC upper bound, not what you would have actually earned.")
    print()
    print(" Strategy            Ann.Ret  Ann.SR    MaxDD   Turn   Net(after tax)   P(SR>0)")
    print(" " + "-" * 84)
    print(fmt_row("Momentum 12-1", m_mom, mom_turn))
    print(fmt_row("ML (walk-fwd)", m_ml, ml_turn))
    print(fmt_row(f"Buy & hold {BENCHMARK}", m_bh, None))
    print(line)

    # Honest read-out.
    beat_mom = m_mom["ann_ret"] > m_bh["ann_ret"]
    beat_ml = m_ml["ann_ret"] > m_bh["ann_ret"]
    print(" READ-OUT")
    print(f"   Momentum {'BEAT' if beat_mom else 'LOST TO'} buy-and-hold "
          f"({m_mom['ann_ret']*100:+.1f}% vs {m_bh['ann_ret']*100:+.1f}% ann.), "
          f"P(SR>0)={m_mom['psr']*100:.0f}%.")
    print(f"   ML model {'BEAT' if beat_ml else 'LOST TO'} buy-and-hold "
          f"({m_ml['ann_ret']*100:+.1f}% vs {m_bh['ann_ret']*100:+.1f}% ann.), "
          f"P(SR>0)={m_ml['psr']*100:.0f}%.")
    print()
    print("   Caveats that make even a 'win' here untrustworthy:")
    print("   - Survivorship bias inflates every line above.")
    print("   - P(SR>0) assumes ONE pre-specified strategy. If you tried many and")
    print("     kept the best, deflate it (see overfitting_demo.py + Backtest Overfitting.md).")
    print("   - Costs are optimistic; real spreads/slippage and German tax filing add more.")
    print("   - One historical path is not the future; alpha decays as others find it.")
    print(line)


if __name__ == "__main__":
    main()
