---
type: meta
title: "Wiki Index"
updated: 2026-04-07
tags:
  - meta
  - index
status: evergreen
related:
  - "[[overview]]"
  - "[[log]]"
  - "[[hot]]"
  - "[[dashboard]]"
  - "[[Wiki Map]]"
  - "[[concepts/_index]]"
  - "[[entities/_index]]"
  - "[[sources/_index]]"
  - "[[LLM Wiki Pattern]]"
  - "[[Hot Cache]]"
  - "[[Compounding Knowledge]]"
  - "[[Andrej Karpathy]]"
---

# Wiki Index

Last updated: 2026-06-16 | Total pages: 101 | Sources ingested: 29

Navigation: [[overview]] | [[log]] | [[hot]] | [[dashboard]] | [[Wiki Map]] | [[getting-started]]

---

## Questions

- [[Questions Auto Translate]] — open questions and implementation notes for the AutoTranslate DeepL usage tracking dashboard (status: developing)
- [[Research- AI Agents for Autonomous Tasks and German Real Estate Rent Comparison]] — best autonomous-agent options + feasibility of scraping German real estate and comparing to regional rent indices (status: developing)
- [[Research- Can AI Predict Which Stocks Will Go Up]] — critical evidence review + honest builder blueprint; AI does NOT reliably predict single-stock direction net of costs; defensible uses are factor harvesting, research speed, risk management (status: developing)

## Sessions

- [[2026-06-16-vault-exploration-and-ponytail-install]] — full vault inventory, proactive skill suggestion map, ponytail installed from GitHub (status: evergreen)
- [[2026-06-15-immo-agent-build-session]] — built `tools/immo-agent/`: autonomous German real-estate + forced-auction monitor (zvg-portal, bank auctions, Kleinanzeigen, ImmoScout24 via real-Chrome CDP attach); Node not Python; daily schedule + dashboard + private backup (status: developing)
- [[2026-06-15-churn-growth-styling-supabase-session]] — negative churn (net growth) gets distinct blue/▲ styling across KPIs, tables, and the line chart; Supabase RLS hardening (writes/reads/storage all authenticated) verified complete (status: developing)
- [[2026-06-10-dashboard-bug-fixes-and-tests]] — 4 bugs fixed across Spreedly + Conversion dashboards; Vitest test suite added; decisions on Vite migration, Supabase environments, auth hardening (status: evergreen)

## Concepts

- [[Data Analytics Stack 2026]] — reference stack for 2026: React+Vite+Recharts+Supabase+Metabase+Supabase MCP; AI layer via data: skills + Supabase MCP (status: current)
- [[ePages Spreedly Migration]] — project to migrate ePages shops off Spreedly before shutdown deadline; sleeper exception built into 100% metric (status: current)
- [[Base to Now Tracker]] — planned tracker for shops migrating from ePages Base to Now; open question is the Base↔Now package mapping (status: developing)
- [[Churn Dashboard]] — planned second analytics dashboard for ePages; requirements owned by Wilfried, data by Karsten; tool choice undecided as of May 2026 (status: developing)
- [[Trial Cohort Conversion Rate]] — conversion metric for ePages Stripe trial shops; deleted shops must stay visible (labelled "Abgelaufen") so cohort slices sum to 100% (status: current)
- [[Trial Conversion Dashboard]] — Lovable/Netlify/Supabase trial funnel dashboard; true conversion rate 48.3% after survivorship-bias fix (status: current)
- [[Survivorship Bias in SaaS Metrics]] — dashboards showing only active records inflate conversion/retention rates; fix by retaining deleted-shop records with explicit status (status: evergreen)
- [[Stripe Subscription Trial Tracking]] — 14-day trial window from `created_at`; cohort analysis anchors on `created_at` because TRIAL_ENDED shops disappear from later CSVs when deleted (status: current)
- [[Test Shop Exclusion]] — filter `@epages.com` login emails at CSV import time before React state so all downstream metrics are automatically clean (status: current)
- [[Company-Wide Dashboard Hosting]] — self-hosted server + WireGuard VPN architecture; chosen by ePages for data sovereignty over managed options (Vercel/Railway) (status: current)
- [[LLM Wiki Pattern]] — the pattern for building persistent, compounding knowledge bases using LLMs; 2026 ecosystem added (status: mature)
- [[Zweites Hirn Aufbau Stack]] — empfohlener 5-Schichten Stack 2026: Web Clipper → Claude Code → Notemd → Local LLM → AI Librarian (status: current)
- [[Hot Cache]] — ~500-word session context file, updated after every ingest and session (status: mature)
- [[Compounding Knowledge]] — why wiki knowledge grows more valuable over time, unlike RAG (status: mature)
- [[cherry-picks]] — prioritized feature backlog from ecosystem research; 13 features to add to claude-obsidian (status: current)
- [[SVG Diagram Style Guide]] — canonical visual style for all diagrams: Space Grotesk, #0A0A0A dark theme, #E07850 accent, full design tokens (status: evergreen)
- [[Pro Hub Challenge]] — community challenge pattern for building claude-seo/claude-blog extensions; first challenge produced 6 submissions, 5 integrated in v1.9.0 (status: evergreen)
- [[Semantic Topic Clustering]] — SERP-based keyword grouping replacing paid tools; hub-spoke architecture with interactive visualization (status: evergreen)
- [[Search Experience Optimization]] — "read SERPs backwards" methodology for page-type mismatch detection and persona scoring (status: evergreen)
- [[SEO Drift Monitoring]] — "git for SEO" baseline/diff/track with 17 comparison rules and SQLite persistence (status: evergreen)
- [[DragonScale Memory]] — memory-layer spec inspired by the Heighway dragon curve; fold operator, deterministic page addresses, semantic tiling, boundary-first autoresearch (status: shipped v0.4, all four mechanisms opt-in)
- [[Persistent Wiki Artifact]]: durable Markdown page as the LLM's memory object, distinct from ephemeral chat turns (status: developing)
- [[Source-First Synthesis]]: provenance discipline; raw sources stay immutable while the wiki layer is synthesized and cited (status: developing)
- [[Query-Time Retrieval]]: wiki query path synthesizes with citations; complementary to Obsidian's in-vault search (status: developing)
- [[Efficient Market Hypothesis]] — the baseline a stock-picker must beat; SPIVA/Buffett/day-trader base rates; Grossman-Stiglitz nuance (status: current)
- [[Machine Learning for Asset Pricing]] — Gu/Kelly/Xiu: ~0.4% monthly R², edge real but tiny and trapped in illiquid microcaps (status: current)
- [[Backtest Overfitting]] — the #1 way DIY stock tools fool their builders; deflated Sharpe, PBO, purged CV (status: current)
- [[Alpha Decay and Transaction Costs]] — where gross edges die; cost wall + ~26% German Abgeltungssteuer math (status: current)
- [[LLMs in Investing]] — good at reading text, unproven at beating the market; look-ahead bias is the killer (status: current)
- [[Honest Stock-Signal Tool Blueprint]] — how to build it as a truth-finding instrument: point-in-time data, purged CV, net-of-cost eval (status: current)

---

## Entities

- [[ePages]] — German e-commerce SaaS; Base and Now variants; partner/reseller model (status: current)
- [[Spreedly]] — payment gateway being retired; ePages migrating shops off it (status: current)
- [[Stripe]] — target payment gateway for ePages migration; also used for Stripe trial subscription tracking (status: current)
- [[Sage]] — payment/accounting connector; new "HTK" connector, ~350 Base shops must update; track usage like Spreedly (status: current)
- [[PayPal]] — payment provider going live ~2026-06-16; track like Spreedly; hard deadline 01.01.27 (status: current)
- [[Supabase]] — auth + Postgres + CSV blob storage backend for ePages dashboards; anon key is public so RLS is required (status: current)
- [[Netlify]] — hosting platform for ePages trial conversion and migration dashboards (status: current)
- [[Andrej Karpathy]] — AI researcher, creator of the LLM Wiki pattern, former Tesla AI director (status: developing)
- [[Notemd]] — Obsidian-Plugin für automatische [[wiki-links]] und Konzeptseiten via LLM; ergänzt den Karpathy-Stack (status: current)
- [[Ar9av-obsidian-wiki]] — multi-agent compatible LLM Wiki plugin; delta tracking manifest (status: current)
- [[Nexus-claudesidian-mcp]] — native Obsidian plugin + MCP bridge; workspace memory, task management (status: current)
- [[ballred-obsidian-claude-pkm]] — goal cascade PKM; auto-commit hooks, /adopt command (status: current)
- [[rvk7895-llm-knowledge-bases]] — 3-depth query system, Marp slides, parallel deep research (status: current)
- [[kepano-obsidian-skills]] — official skills from Obsidian creator; defuddle, obsidian-bases (status: current)
- [[Claudian-YishenTu]] — native Obsidian plugin embedding Claude Code; plan mode, @mention (status: current)
- [[Claude SEO]] — Tier 4 Claude Code skill for SEO analysis; 23 skills, 17 agents, 30 scripts at v1.9.0 (status: evergreen)
- [[Marcos Lopez de Prado]] — quant authority on why ML-in-finance fails; deflated Sharpe, purged CV, "10 Reasons" (status: current)
- [[Renaissance Technologies]] — Medallion fund: the "it CAN be done" outlier that proves you can't replicate it (closed, capacity-capped) (status: current)

---

## Sources

- [[claude-code-dashboard-best-practices]] — 2026-06-09 | web research | Claude Code + Dashboard: Spec-First, Recharts, Context-Management, Kosten
- [[recharts-vs-chartjs-2026]] — 2026-06-09 | web research | Recharts 85/100 vs Chart.js 67/100; Recharts Standard für React
- [[obsidian-second-brain-ai-stack-2026]] — 2026-06-09 | web research | PKM Second Brain mit Obsidian + AI, Zettelkasten-Prinzipien, 2026-Update
- [[karpathy-llm-wiki-step-by-step]] — 2026-06-09 | web research | Schritt-für-Schritt Karpathy LLM Wiki Aufbau
- [[notemd-plugin]] — 2026-06-09 | GitHub | Auto-Wiki-Links + Konzeptseiten via LLM
- [[local-llm-hub-plugin]] — 2026-06-09 | GitHub | Lokales LLM + RAG + Workflow-Automation für Obsidian
- [[johnny-decimal-zettelkasten-ai-librarian]] — 2026-06-09 | GitHub | AI Librarian Agents + Crystallization Principle
- [[epages-spreedly-migration-dashboard]] — 2026-06-09 | internal ePages dashboard HTML | Spreedly offboarding tracker, Supabase-backed, churn analysis (mock), shop search
- [[conversion-dashboard]] — 2026-06-09 | production React SPA source | ePages trial conversion dashboard; two datasets (ePages Direct + S-Payment); cohort logic, login activity, timing buckets
- [[churn-dashboard-anforderungen]] — 2026-05-11 | Claude conversation | Churn dashboard requirements; Wilfried + Karsten stakeholders
- [[churn-dashboard-dokumentation]] — 2026-05-11 | Claude conversation | 6-area documentation checklist + tool comparison (Looker/Power BI)
- [[epages-conversion-rate-scaling]] — 2026-05-xx | Claude conversation | Deleted shops must remain visible as "Abgelaufen" for accurate cohort sums
- [[epages-spreedly-dashboard-conversation]] — Claude conversation | Metric reframe: "get off Spreedly" vs "get to Stripe"; progress = (baseline − still_on_spreedly) / baseline
- [[epages-trial-conversion-dashboard-kpi]] — 2026-05-04 | Claude conversation | Survivorship bias discovery; true rate 48.3% vs apparent 75.6%
- [[epages-trial-conversion-dashboard]] — Claude conversation | CSV snapshot approach; 14-day trial window; Chart.js dynamic filtering
- [[epages-spreedly-stripe-dashboard-integration]] — Claude conversation | localStorage → Supabase Storage migration; Chart.js Churn tab; TODO for future API
- [[supabase-netlify-debug]] — 2026-05-05 | Claude conversation | window-global credential pattern; RLS required since anon key is public
- [[epages-testshop-filter]] — 2026-05-05 | Claude conversation | Filter @epages.com shops at CSV import time
- [[epages-company-dashboard-setup]] — Claude conversation | Self-hosted + WireGuard VPN architecture for company-wide access
- [[meeting-2026-06-15-with-Chris]] — 2026-06-15 | meeting notes (2-page scan) | Base→Now tracker, Auto Translate, PayPal (live ~06-16, deadline 01.01.27), Sage (HTK), Stripe — all tracked like Spreedly
- [[claude-obsidian-ecosystem-research]] — 2026-04-08 | web research across 16+ repos | 8 wiki pages created
- [[gu-kelly-xiu-empirical-asset-pricing-ml]] — 2020 | RFS paper | ML predicts ~0.4% monthly R²; best methods NN/trees; signal in illiquid stocks
- [[bailey-lopez-de-prado-backtest-overfitting]] — 2014 | AMS Notices | enough backtest trials guarantee a fake high Sharpe; deflated Sharpe / PBO / MinBTL
- [[spiva-us-scorecard]] — 2025 | S&P Dow Jones Indices | ~79% large-cap funds lag over 20y; no category beats over 15y
- [[lopez-de-prado-10-reasons-ml-funds-fail]] — 2018 | JPM | Sisyphus vs Meta-Strategy; leakage, non-IID, integer differentiation
- [[llms-in-equity-markets-review]] — 2025 | review | LLMs good at sentiment/summarization; no net-of-cost profit evidence; look-ahead bias
- [[day-trading-profitability-studies]] — 2020 | Brazil/Taiwan studies | 97% of persistent day traders lose; <1% reliably profitable net of fees
- [[buffett-hedge-fund-bet]] — 2018 | Long Bets #362 | S&P 500 7.1% vs hedge funds 2.2% annualized, 2008–2017

---

## Questions

- [[Research- Data Analytics Skills and Plugins]] — Supabase MCP, data: skills, Metabase for churn, confirmed 2026 stack (status: developing)
- [[Research- Claude Dashboard Best Practices und Kritik]] — Best Practices für Claude Dashboard-Entwicklung + kritische Analyse der ePages-Dashboards; Spec-First, Recharts, Vite, Supabase-Security (status: developing)
- [[Research- Obsidian zweites Hirn automatisch lernen]] — wie man mit Obsidian ein automatisch lernendes zweites Hirn aufbaut; 5-Schichten Stack, Karpathy-Muster, Compounding (status: developing)
- [[How does the LLM Wiki pattern work]] — how the pattern works and why it outperforms RAG at human scale (status: developing)

---

## Comparisons

- [[Wiki vs RAG]] — when to use a wiki knowledge base versus RAG; verdict: wiki wins at <1000 pages
- [[claude-obsidian-ecosystem]] — feature matrix of 16+ Claude+Obsidian projects; where claude-obsidian wins and gaps

---

## Decisions

- [[claude-commands-skill-registration]] — `.claude/commands/` Wrapper für alle 15 claude-obsidian Skills angelegt; behebt „Unknown command"-Fehler bei Slash Commands (status: active)
- [[2026-04-14-community-cta-rollout]] - Skool community CTA footer added to 6 skill repos with per-tool frequency rules (status: active)
- [[2026-04-15-slides-and-release-session]] - Claude SEO v1.9.0 slides (15-slide HTML deck) + GitHub release v1.9.0 with PDF asset (status: complete)
- [[2026-04-15-release-report-session]] - Claude SEO v1.9.0 Release Report PDF: dark theme, 13 pages, WeasyPrint layout fixes, Challenge v2 added (status: complete)
- [[2026-04-14-claude-seo-v190-session]] - Claude SEO v1.9.0 Pro Hub Challenge integration: 5 submissions, 4 new skills, 4 review rounds, cybersecurity audit (status: complete)

---

## References

- [[methodology-modes]] — quick decision tree for picking a vault organizational style (Generic / LYT / PARA / Zettelkasten)
- [[transport-fallback]] — canonical decision tree skills use when reading/writing vault notes (cli → mcp-obsidian → mcpvault → filesystem)

---

## Domains

<!-- Add domain entries here after scaffold -->
