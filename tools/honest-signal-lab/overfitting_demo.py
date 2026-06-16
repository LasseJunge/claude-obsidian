#!/usr/bin/env python3
"""
overfitting_demo.py - Watch great-looking backtests turn out to be pure luck.

WHY THIS EXISTS
---------------
The wiki research "Can AI Predict Which Stocks Will Go Up?" concluded that the
single biggest reason DIY stock tools lose real money is BACKTEST OVERFITTING:
if you try enough strategy configurations, one of them WILL look brilliant on
past data by chance alone - and then fail the moment you trade it.

This script proves it on your own screen, with no internet, no data files, and
no third-party packages (pure Python standard library only).

WHAT IT DOES (Monte Carlo, so the lesson is not one lucky anecdote)
-------------------------------------------------------------------
1. Builds MANY independent synthetic markets, each with NO timing-exploitable
   signal (independent daily returns with a small positive drift - buy-and-hold
   works, timing does not). We KNOW there is no edge, by construction.
2. In EACH market it grid-searches ~100 moving-average strategies and keeps the
   one with the best IN-SAMPLE Sharpe ratio.
3. It then measures that same "winner" OUT-OF-SAMPLE, and averages across all
   markets - revealing the systematic truth: in-sample Sharpe is inflated by the
   search, and it does NOT persist (out-of-sample Sharpe ~0, positive about half
   the time - a coin flip).
4. It computes the DEFLATED SHARPE RATIO (Bailey & Lopez de Prado, 2014), which
   accounts for the number of configurations tried and correctly reports the
   winners as no better than chance.
5. It applies a realistic cost model + German Abgeltungssteuer (~26.375%) to show
   that trading the "winner" loses to simply holding, net of everything.

A single random dataset is itself subject to luck (sometimes the overfit
strategy looks good out-of-sample by chance). Averaging over many markets is what
makes the demonstration honest rather than an anecdote - the same discipline the
tool is trying to teach.

It is a TEACHING INSTRUMENT, not a trading system.

RUN
---
    python overfitting_demo.py

(Needs only a Python 3 install - no `pip install` required.)

EXTEND TO REAL DATA
-------------------
See README.md. Replace `generate_synthetic_returns()` with POINT-IN-TIME real
returns that INCLUDE delisted stocks (survivorship bias is the other silent
killer). Everything else - the deflated Sharpe gate, the cost and tax model, the
out-of-sample discipline - stays the same and is the part that actually matters.

Related wiki pages:
  wiki/concepts/Backtest Overfitting.md
  wiki/concepts/Honest Stock-Signal Tool Blueprint.md
  wiki/sources/bailey-lopez-de-prado-backtest-overfitting.md
"""

import math
import random

# ----------------------------------------------------------------------------
# Configuration  (change these and watch how the conclusion does NOT change)
# ----------------------------------------------------------------------------
SEED = 20260616            # fixed base seed -> reproducible run
M_DATASETS = 80           # independent synthetic markets (Monte Carlo)
N_DAYS = 2016             # ~8 years of trading days per market
PERIODS_PER_YEAR = 252
DRIFT_PER_DAY = 0.0002    # ~5%/yr drift  -> buy-and-hold is mildly positive
VOL_PER_DAY = 0.010       # ~16%/yr volatility
FAST_GRID = list(range(5, 55, 5))      # 5,10,...,50   (10 values)
SLOW_GRID = list(range(60, 180, 10))   # 60,70,...,170 (12 values)
COST_ONE_WAY = 0.0005     # 5 bps per side (spread+commission+slippage). Optimistic.
TAX_RATE = 0.26375        # German Abgeltungssteuer 25% + 5.5% Solidaritaetszuschlag
EULER_GAMMA = 0.5772156649015329

# ----------------------------------------------------------------------------
# Math helpers (pure stdlib)
# ----------------------------------------------------------------------------

def norm_cdf(x):
    """Standard normal CDF via the error function."""
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))


def norm_ppf(p):
    """Inverse standard normal CDF (Acklam's rational approximation)."""
    if p <= 0.0:
        return -float("inf")
    if p >= 1.0:
        return float("inf")
    a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02,
         1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00]
    b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02,
         6.680131188771972e+01, -1.328068155288572e+01]
    c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
         -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00]
    d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00,
         3.754408661907416e+00]
    p_low = 0.02425
    p_high = 1.0 - p_low
    if p < p_low:
        q = math.sqrt(-2.0 * math.log(p))
        return (((((c[0]*q + c[1])*q + c[2])*q + c[3])*q + c[4])*q + c[5]) / \
               ((((d[0]*q + d[1])*q + d[2])*q + d[3])*q + 1.0)
    if p <= p_high:
        q = p - 0.5
        r = q * q
        return (((((a[0]*r + a[1])*r + a[2])*r + a[3])*r + a[4])*r + a[5]) * q / \
               (((((b[0]*r + b[1])*r + b[2])*r + b[3])*r + b[4])*r + 1.0)
    q = math.sqrt(-2.0 * math.log(1.0 - p))
    return -(((((c[0]*q + c[1])*q + c[2])*q + c[3])*q + c[4])*q + c[5]) / \
            ((((d[0]*q + d[1])*q + d[2])*q + d[3])*q + 1.0)


def mean(xs):
    return sum(xs) / len(xs)


def std(xs):
    """Sample standard deviation (ddof=1)."""
    n = len(xs)
    if n < 2:
        return 0.0
    m = mean(xs)
    return math.sqrt(sum((x - m) ** 2 for x in xs) / (n - 1))


def skewness(xs):
    n = len(xs)
    s = std(xs)
    if n < 3 or s == 0.0:
        return 0.0
    m = mean(xs)
    return sum(((x - m) / s) ** 3 for x in xs) / n


def kurtosis(xs):
    """Non-excess kurtosis (a normal distribution has kurtosis 3)."""
    n = len(xs)
    s = std(xs)
    if n < 4 or s == 0.0:
        return 3.0
    m = mean(xs)
    return sum(((x - m) / s) ** 4 for x in xs) / n


def sharpe_per_period(returns):
    """Per-period Sharpe ratio (no risk-free; demo simplification)."""
    s = std(returns)
    if s == 0.0:
        return 0.0
    return mean(returns) / s


def annualize_sharpe(sr_pp):
    return sr_pp * math.sqrt(PERIODS_PER_YEAR)


def after_tax_terminal(rs):
    """Terminal compounded return of a return stream, taxed if positive."""
    total = 1.0
    for r in rs:
        total *= (1.0 + r)
    gain = total - 1.0
    if gain > 0:
        gain *= (1.0 - TAX_RATE)
    return gain


# ----------------------------------------------------------------------------
# Probabilistic & Deflated Sharpe Ratio (Bailey & Lopez de Prado, 2014)
# ----------------------------------------------------------------------------

def probabilistic_sharpe_ratio(sr_pp, n, skew, kurt, sr_benchmark_pp):
    """P(true Sharpe > benchmark) given observed per-period Sharpe sr_pp."""
    denom = math.sqrt(max(1e-12, 1.0 - skew * sr_pp + ((kurt - 1.0) / 4.0) * sr_pp ** 2))
    z = (sr_pp - sr_benchmark_pp) * math.sqrt(n - 1) / denom
    return norm_cdf(z)


def expected_max_sharpe(sr_variance_across_trials, n_trials):
    """Expected MAXIMUM per-period Sharpe across N independent trials, under the
    null that every strategy's true Sharpe is zero. This is the bar the
    in-sample winner must clear to be more than luck."""
    if n_trials < 2 or sr_variance_across_trials <= 0.0:
        return 0.0
    v = math.sqrt(sr_variance_across_trials)
    return v * ((1.0 - EULER_GAMMA) * norm_ppf(1.0 - 1.0 / n_trials)
                + EULER_GAMMA * norm_ppf(1.0 - 1.0 / (n_trials * math.e)))


def deflated_sharpe_ratio(sr_pp, n, skew, kurt, sr_variance_across_trials, n_trials):
    """The PSR measured against the expected-max-Sharpe-under-the-null bar.
    Returns P(true Sharpe > 0) AFTER accounting for the number of trials.
    A value near 0.5 or below means 'indistinguishable from luck'."""
    sr_star = expected_max_sharpe(sr_variance_across_trials, n_trials)
    return probabilistic_sharpe_ratio(sr_pp, n, skew, kurt, sr_star)


# ----------------------------------------------------------------------------
# Synthetic data & strategy
# ----------------------------------------------------------------------------

def generate_synthetic_returns(seed):
    """Independent daily returns with positive drift. NO timing signal exists."""
    rng = random.Random(seed)
    return [rng.gauss(DRIFT_PER_DAY, VOL_PER_DAY) for _ in range(N_DAYS)]


def returns_to_prices(returns, start=100.0):
    prices = [start]
    for r in returns:
        prices.append(prices[-1] * (1.0 + r))
    return prices  # len = N_DAYS + 1


def sma_close(prefix, day, window):
    """Average of the last `window` daily closes, through the close of `day`.

    Close of day d is prices[d + 1] (prices[0] is the pre-history start value),
    so this averages prices[day-window+2 .. day+1]."""
    lo = day - window + 2
    hi = day + 2
    if lo < 0:
        return None
    return (prefix[hi] - prefix[lo]) / window


def backtest_crossover(returns, prefix, fast, slow):
    """Long (+1) when fast SMA > slow SMA, short (-1) otherwise. The position is
    decided using information through the close of day i, then earns the return
    on day i+1 - so there is strictly no look-ahead. Long/short is used because
    it gives the search a wider spread of outcomes, so the luckiest in-sample
    configuration looks genuinely impressive before it collapses out-of-sample.
    Costs are charged on turnover (a +1 -> -1 flip trades 2 units).

    Returns (strat_returns, day_index) where day_index[k] is the return's day."""
    strat = []
    days = []
    prev_pos = 0
    for i in range(slow - 1, len(returns) - 1):
        f = sma_close(prefix, i, fast)
        s = sma_close(prefix, i, slow)
        pos = 1 if (f is not None and s is not None and f > s) else -1
        gross = pos * returns[i + 1]
        cost = abs(pos - prev_pos) * COST_ONE_WAY
        strat.append(gross - cost)
        days.append(i + 1)
        prev_pos = pos
    return strat, days


def split_is_oos(strat, days, mid):
    is_r = [r for r, d in zip(strat, days) if d <= mid]
    oos_r = [r for r, d in zip(strat, days) if d > mid]
    return is_r, oos_r


# ----------------------------------------------------------------------------
# One synthetic market: search in-sample, judge out-of-sample
# ----------------------------------------------------------------------------

def run_one_dataset(seed):
    returns = generate_synthetic_returns(seed)
    prices = returns_to_prices(returns)
    prefix = [0.0]
    for p in prices:
        prefix.append(prefix[-1] + p)
    mid = N_DAYS // 2

    trials = []  # (is_sharpe_pp, is_returns, oos_returns)
    for fast in FAST_GRID:
        for slow in SLOW_GRID:
            if fast >= slow:
                continue
            strat, days = backtest_crossover(returns, prefix, fast, slow)
            is_r, oos_r = split_is_oos(strat, days, mid)
            if len(is_r) < 30 or len(oos_r) < 30:
                continue
            trials.append((sharpe_per_period(is_r), is_r, oos_r))

    n_trials = len(trials)
    sr_variance = std([t[0] for t in trials]) ** 2

    best_sr_is_pp, best_is, best_oos = max(trials, key=lambda t: t[0])
    naive = probabilistic_sharpe_ratio(
        best_sr_is_pp, len(best_is), skewness(best_is), kurtosis(best_is), 0.0)
    dsr = deflated_sharpe_ratio(
        best_sr_is_pp, len(best_is), skewness(best_is), kurtosis(best_is),
        sr_variance, n_trials)

    return {
        "n_trials": n_trials,
        "is_sharpe": annualize_sharpe(best_sr_is_pp),
        "oos_sharpe": annualize_sharpe(sharpe_per_period(best_oos)),
        "naive": naive,
        "dsr": dsr,
        "tool_oos_net": after_tax_terminal(best_oos),
        "bh_oos_net": after_tax_terminal(returns[mid:]),
    }


# ----------------------------------------------------------------------------
# Report
# ----------------------------------------------------------------------------

def main():
    results = [run_one_dataset(SEED + k) for k in range(M_DATASETS)]
    n = len(results)
    n_trials = results[0]["n_trials"]

    def avg(key):
        return sum(r[key] for r in results) / n

    mean_is = avg("is_sharpe")
    mean_oos = avg("oos_sharpe")
    pct_oos_pos = 100.0 * sum(1 for r in results if r["oos_sharpe"] > 0) / n
    mean_naive = avg("naive")
    mean_dsr = avg("dsr")
    mean_tool = avg("tool_oos_net")
    mean_bh = avg("bh_oos_net")
    tool_beats = 100.0 * sum(1 for r in results if r["tool_oos_net"] > r["bh_oos_net"]) / n

    ann_drift = (1.0 + DRIFT_PER_DAY) ** PERIODS_PER_YEAR - 1.0
    ann_vol = VOL_PER_DAY * math.sqrt(PERIODS_PER_YEAR)
    line = "=" * 74

    print(line)
    print(" HONEST SIGNAL LAB - Backtest Overfitting Demonstrator")
    print(line)
    print(f" Method: {n} independent synthetic markets, each ~{N_DAYS // PERIODS_PER_YEAR}"
          f" years (drift ~{ann_drift*100:.0f}%/yr, vol ~{ann_vol*100:.0f}%/yr).")
    print(" Returns are INDEPENDENT - NO timing edge exists, by construction.")
    print(f" In each market we searched {n_trials} moving-average strategies and kept the")
    print(" one with the best IN-SAMPLE Sharpe, then judged it OUT-OF-SAMPLE.")
    print()
    print(" WHAT THE SEARCH FINDS  (averaged over all markets)")
    print(f"   Best IN-SAMPLE annualized Sharpe  (your backtest brags about this) : {mean_is:6.2f}")
    print(f"   Its OUT-OF-SAMPLE annualized Sharpe (what you actually get)         : {mean_oos:6.2f}")
    print(f"   Markets where the 'winner' even stayed positive out-of-sample      : {pct_oos_pos:4.0f}%  (coin flip)")
    print()
    print(" IS THAT IN-SAMPLE SHARPE REAL, OR LUCK?")
    print(f"   Naive single-trial confidence  P(true Sharpe > 0) : {mean_naive*100:4.0f}%   (what a beginner reports)")
    print(f"   DEFLATED confidence            P(true Sharpe > 0) : {mean_dsr*100:4.0f}%   (after {n_trials} trials)")
    print()
    print(" DOES TRADING THE 'WINNER' BEAT JUST HOLDING?  (out-of-sample, after costs + ~26% tax)")
    print(f"   Mean return - the overfit tool : {mean_tool*100:+6.1f}%")
    print(f"   Mean return - buy-and-hold     : {mean_bh*100:+6.1f}%")
    print(f"   Markets where the tool beat buy-and-hold : {tool_beats:.0f}%")
    print(line)
    print(" VERDICT: the in-sample Sharpe is an artifact of searching", n_trials, "configs.")
    print("          It does NOT persist (out-of-sample Sharpe ~0, positive only about")
    print("          half the time), the deflated Sharpe flags it as luck, and after")
    print("          costs + tax the tool loses to doing nothing.")
    print()
    print("          Real strategy research lives or dies on exactly this discipline:")
    print("          count every configuration, deflate the Sharpe, net out costs+tax,")
    print("          and judge strictly out-of-sample. See wiki/concepts/Backtest Overfitting.md")
    print(line)


if __name__ == "__main__":
    main()
