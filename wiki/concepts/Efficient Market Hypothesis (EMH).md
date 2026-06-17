---created: 2026-06-16
updated: 2026-06-16

aliases:
  - "Efficient Market Hypothesis"
---

﻿---
type: concept
title: "Efficient Market Hypothesis"
aliases:
  - "Efficient Market Hypothesis"
created: 2026-06-16
updated: 2026-06-16
tags:
  - concept
  - investing
  - finance-theory
status: current
related:
  - "[[Machine Learning for Asset Pricing]]"
  - "[[Alpha Decay and Transaction Costs]]"
  - "[[Research- Can AI Predict Which Stocks Will Go Up]]"
sources:
  - "[[spiva-us-scorecard]]"
  - "[[buffett-hedge-fund-bet]]"
  - "[[day-trading-profitability-studies]]"
---

# Efficient Market Hypothesis (EMH)

The baseline any stock-prediction tool must argue against. EMH (Fama, 1970) says prices already reflect available information, so consistently predicting *which stock will go up* — net of costs — is extremely hard. Three forms: **weak** (past prices don't predict future prices), **semi-strong** (public info is priced in), **strong** (even private info is priced in). The semi-strong form is the practical battleground.

## EMH is not "markets are perfect" — it's "your edge is the exception"
The honest framing is not that markets are flawless. It is that **beating them reliably, after costs, is rare** — and the burden of proof is on the would-be beater.

## The empirical backbone
- Over 15 years, **no equity fund category** had a majority of active managers beat their benchmark; ~79% of large-cap funds lag over 20 years. (Source: [[spiva-us-scorecard]])
- The most sophisticated active managers lost a decade-long bet to a passive index, ~7.1% vs ~2.2% annualized. (Source: [[buffett-hedge-fund-bet]])
- 97% of persistent retail day traders lose money; <1% reliably earn abnormal returns net of fees. (Source: [[day-trading-profitability-studies]])

## The Grossman–Stiglitz paradox (the nuance that matters for a builder)
If markets were *perfectly* efficient, no one would be paid to gather information, so there must be *some* exploitable inefficiency to compensate the information-gatherers. (Grossman & Stiglitz, 1980, confidence: high — foundational.) This is the crack a tool aims at. But the inefficiency is small, competed-over by funds with co-located servers and PhD teams, and **shrinks the moment it's discovered** (see [[Alpha Decay and Transaction Costs]]). The realistic conclusion: tiny, fleeting, capacity-limited edges exist; a durable retail edge in liquid large-caps is the extraordinary claim.

## Why this kills the naive prompt
"A tool that automatically tracks what stock *will* go up" assumes a stable, exploitable signal in liquid stocks. EMH + the base rates say that for the average builder, the expected net edge is approximately zero, and variance is large. The defensible reframes are: harvest *known* risk premia (factors) cheaply, manage risk, or accelerate research — not "predict winners."
