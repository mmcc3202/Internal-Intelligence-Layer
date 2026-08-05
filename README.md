# Profit Pool Analyzer

A tool for running a profit-pool study on an industry sector: curate
research from credible sources into a database, analyze where revenue and
profit concentrate across the value chain and across competitors, and
export the result as a PowerPoint deck that highlights a focal company
against its peers.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full design — data model,
research/curation pipeline, analysis engine, and presentation export.

## Getting started

```bash
npm install
npm run dev
```

The app loads with an illustrative (fictional) sample sector pre-loaded so
every screen has data to show. Use **Reset workspace** in the header to
start from a blank slate with your own sector.

## Workflow

1. **Setup** — define the sector, its value chain stages, and the peer set
   (mark one company as focal).
2. **Research Library** — add sources, paste excerpts, run extraction, and
   review/approve the candidate facts it proposes.
3. **Data Curation** — the curated metrics table; edit directly or fill
   gaps the research pipeline didn't cover.
4. **Analysis** — profit pool matrix, value chain profit pool map, and peer
   benchmarking, with plain-language takeaways computed live from the data.
5. **Present** — pick slides and export a native, editable PowerPoint deck,
   or download the value chain map as a PNG.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run preview` — preview the production build
