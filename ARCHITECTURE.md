# Profit Pool Analyzer — architecture & design

A tool for running a "profit pool" study on an industry sector: research
credible sources, curate the numbers into a database, analyze where profit
concentrates across the value chain and across competitors, and export the
result as a PowerPoint deck that highlights one focal company against its
peers.

## Why it's shaped this way

Profit pool analysis (Gadiesh & Gilbert, *HBR* 1998) asks two questions at
once: how is *revenue* distributed across the value chain and the players in
it, and how is *profit* distributed the same way? The gap between the two is
the story — a stage or a company capturing far more profit than its revenue
share would predict is where the value is. Every part of this app is built
to make that comparison easy to produce, trust, and present:

- **Curation is a gate, not a formality.** Research (web or pasted text) only
  produces *candidates*. Nothing reaches the Metrics table without a human
  approving it, with the source sentence attached. This is the difference
  between a tool that looks authoritative and one that actually is.
- **The chart data and the slide data are the same function calls.**
  `src/analysis/profitPool.js` is pure and stateless; both the on-screen
  charts and `src/pptx/buildPptx.js` call it. There's no separate "export
  path" that can drift from what's on screen.
- **Exported charts and diagrams are native PowerPoint objects**, not
  pasted-in images. `buildPptx.js` draws bars via pptxgenjs's chart API and
  the value chain map via pptxgenjs shapes (rectangles, arrows, text) placed
  with the same geometry as the on-screen SVG. A user can still recolor or
  resize them in PowerPoint afterward.

## Data model

Plain-JS shapes documented as JSDoc typedefs in `src/data/schema.js`, stored
today via a localStorage-backed repository (`src/store/storage.js` +
`src/store/reducer.js`). In a hosted deployment these become tables:

| Entity | Purpose |
|---|---|
| `Sector` | The industry under study — name, scope notes, reporting currency/scale |
| `ValueChainStage` | An ordered step in the chain (e.g. Sourcing → Manufacturing → Distribution → Retail) |
| `Company` | A tracked competitor; exactly one is flagged `isFocal` |
| `Source` | A citation — title, URL, publisher, date, credibility tier, pasted excerpt |
| `ExtractionCandidate` | A fact proposed from a source, pending human review |
| `Metric` | An approved, curated data point: company × (stage or sector-level) × year × metric type, with a link back to its `Source` |

`Metric.metricType` is one of `revenue`, `ebit`, `capitalEmployed`,
`ebitMargin`, `marketShare` (`src/data/constants.js`). Revenue and EBIT can
be entered at the stage level (to build the value-chain view) or at the
company level only (for years where only a topline figure is available) —
`getCompanyTotals()` prefers the stage breakdown when both exist, so nothing
double-counts.

## Research pipeline

`src/connectors/researchConnector.js` implements the connector interface
described in the Research Library UI:

1. **Add a source** — title, URL, publisher, date, credibility tier. The
   tier plus recency drive a 0–100 credibility score (`credibilityScore()`
   in `constants.js`) shown on every source card.
2. **Paste an excerpt** — the actual passage from that source.
3. **Run extraction** (`manualExtract()`) — splits the excerpt into
   sentences, and for each one, looks for a metric keyword (revenue, EBIT,
   EBIT margin, market share, capital employed) and the nearest number to
   it, plus a year and a company name if mentioned. This is a real,
   deterministic parser — not a canned demo — so it works on whatever text
   you paste in.
4. **Review** — every candidate keeps the evidence sentence, and needs a
   company + year assigned before it can be approved. Approve moves it into
   the Metrics table; reject discards it.

This environment has no live web-search or LLM API credentials configured,
so there is no automated crawler wired up today — `describeWebConnectorSetup()`
(surfaced in the Research Library UI) documents exactly what to add:

1. `search(query)` — a web search API (Bing Web Search, SerpAPI, Brave
   Search) scoped to credible domains: regulatory filings, paid industry
   research (IBISWorld/Gartner/Bloomberg), and reputable business press.
2. `fetch(url)` — retrieve and clean the page or PDF.
3. `extract(content)` — replace/augment `manualExtract()` with an LLM
   extraction call (e.g. Claude) prompted to return the same
   `ExtractionCandidate` shape.

The human approval gate stays regardless of source — automation should
raise the volume of candidates for review, not skip review.

## Analysis engine (`src/analysis/profitPool.js`)

Pure functions over the curated `Metric` rows for a chosen year:

- `getProfitPoolMatrix` — revenue share vs. profit share vs. pool size, per
  company. This is the core "profit pool matrix" bubble chart.
- `getStageTotals` / `getStageByCompany` — the value-chain view: how much
  revenue and profit each stage captures, and (where curated) which
  companies capture it within that stage.
- `getPeerBenchmark` — EBIT margin / ROIC ranking, focal company highlighted.
- `getTrend` — multi-year series per company for any metric type.
- `getInsights` — plain-language takeaways computed live from the data
  (e.g. "Retail captures 61% of the profit pool from 39% of revenue") —
  never hardcoded strings, so they can't drift from what's on screen.

## Presentation & export

`src/components/present/PresentationView.jsx` lets the user pick a title,
year, and which slides to include, then either:

- **Generate PowerPoint (.pptx)** — `src/pptx/buildPptx.js`, loaded on
  demand (dynamic `import()`, kept out of the main bundle) so pptxgenjs only
  loads when it's actually used. Produces a title slide, the value chain
  profit pool map, the profit pool matrix, a stage revenue/profit-share bar
  chart, a peer benchmarking bar chart, and a takeaways slide — all native
  editable PowerPoint objects.
- **Download the value chain map as PNG** — serializes the on-screen SVG
  (`src/utils/svgExport.js`) for use anywhere a static image is easier
  (e.g. pasting into a doc).

## What ships today vs. what a production deployment adds

This build runs entirely client-side (React + Vite + Tailwind + Recharts),
persisting to the browser's `localStorage` — enough to fully exercise the
research → curate → analyze → present loop end to end, seeded with an
illustrative (fictional) sector so every view has data on first load.

Turning this into a shared, multi-user internal tool means:

- **Real database** — Postgres, with the tables above; `Source.excerpt` and
  `ExtractionCandidate` are natural fits for a `pgvector`-backed similarity
  search if source volume grows.
- **A backend** for the `WebResearchConnector` (search/fetch/LLM-extract),
  since browsers can't make arbitrary cross-origin fetches or hold API keys
  safely.
- **Auth + multi-tenancy** so multiple analysts can share a sector's
  workspace instead of it living in one browser's `localStorage`.
- **Audit trail** on `Metric` edits (who changed what, when) given the data
  feeds external presentations.

## Code map

```
src/
  data/            constants, schema reference, illustrative seed dataset
  connectors/       research/extraction pipeline
  store/            reducer + localStorage-backed repository (AppContext)
  analysis/         profitPool.js — pure analysis functions
  pptx/             buildPptx.js — native PowerPoint export
  components/
    setup/          sector, value chain, peer set
    research/       source library + extraction review queue
    curation/       curated metrics table
    analysis/       charts + value chain diagram
    present/        deck builder
    common/         shared UI atoms
```
