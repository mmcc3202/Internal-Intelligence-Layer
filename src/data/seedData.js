// Illustrative demo dataset — a fictional sector and fictional companies
// used only to make every chart and export in the app render meaningfully
// on first load. Nothing here represents real company financials. Replace
// it by clearing the workspace (Setup > Reset workspace) and building your
// own sector, peer set, and curated sources.
import { FOCAL_COLOR, PEER_PALETTE } from './constants'

const sectorId = 'demo-sector'

const stages = [
  { id: 'stage-growing', name: 'Growing & Sourcing', order: 0, description: 'Green coffee cultivation and procurement from origin.' },
  { id: 'stage-roasting', name: 'Roasting & Processing', order: 1, description: 'Roasting, blending, and packaging.' },
  { id: 'stage-distribution', name: 'Distribution & Wholesale', order: 2, description: 'Logistics, grocery and food-service wholesale.' },
  { id: 'stage-retail', name: 'Retail (Coffee Shops)', order: 3, description: 'Company-owned and franchised retail locations.' },
]

const companies = [
  { id: 'co-bluebear', name: 'Blue Bear Coffee Co.', ticker: 'BLUB', isFocal: true, color: FOCAL_COLOR, notes: 'Focal company — illustrative, vertically integrated retail-led operator.' },
  { id: 'co-globalroast', name: 'Global Roast Corp', ticker: 'GRST', isFocal: false, color: PEER_PALETTE[0], notes: 'Illustrative diversified incumbent.' },
  { id: 'co-cascade', name: 'Cascade Bean Holdings', ticker: 'CASB', isFocal: false, color: PEER_PALETTE[1], notes: 'Illustrative upstream-weighted supplier.' },
  { id: 'co-urbangrind', name: 'Urban Grind Ltd', ticker: 'UGRD', isFocal: false, color: PEER_PALETTE[2], notes: 'Illustrative premium retail-only specialist.' },
  { id: 'co-homebrew', name: 'Home Brew Group', ticker: 'HBRW', isFocal: false, color: PEER_PALETTE[3], notes: 'Illustrative grocery/wholesale-focused peer.' },
]

// [companyId, stageId, revenue $M, ebit $M] for FY2024
const stage2024 = [
  ['co-bluebear', 'stage-growing', 40, 2.4],
  ['co-bluebear', 'stage-roasting', 320, 41.6],
  ['co-bluebear', 'stage-distribution', 180, 9.0],
  ['co-bluebear', 'stage-retail', 1450, 319.0],

  ['co-globalroast', 'stage-growing', 260, 18.2],
  ['co-globalroast', 'stage-roasting', 980, 117.6],
  ['co-globalroast', 'stage-distribution', 640, 32.0],
  ['co-globalroast', 'stage-retail', 1100, 209.0],

  ['co-cascade', 'stage-growing', 780, 62.4],
  ['co-cascade', 'stage-roasting', 560, 61.6],
  ['co-cascade', 'stage-distribution', 210, 8.4],
  ['co-cascade', 'stage-retail', 60, 9.0],

  ['co-urbangrind', 'stage-growing', 10, 0.5],
  ['co-urbangrind', 'stage-roasting', 90, 12.6],
  ['co-urbangrind', 'stage-distribution', 40, 2.0],
  ['co-urbangrind', 'stage-retail', 620, 148.8],

  ['co-homebrew', 'stage-growing', 30, 1.8],
  ['co-homebrew', 'stage-roasting', 300, 30.0],
  ['co-homebrew', 'stage-distribution', 900, 54.0],
  ['co-homebrew', 'stage-retail', 210, 33.6],
]

// Company totals, FY2023 (prior year — company-level only, as is typical
// when detailed stage splits are only curated for the current year).
const totals2023 = [
  ['co-bluebear', 1760, 296],
  ['co-globalroast', 2710, 317],
  ['co-cascade', 1490, 121],
  ['co-urbangrind', 690, 138],
  ['co-homebrew', 1330, 98],
]

const capitalEmployed2024 = [
  ['co-bluebear', 950],
  ['co-globalroast', 2400],
  ['co-cascade', 1050],
  ['co-urbangrind', 380],
  ['co-homebrew', 980],
]

let metricSeq = 0
function metric({ companyId, stageId = null, period, metricType, value, sourceId = 'demo-source-1', confidence = 'medium' }) {
  metricSeq += 1
  return {
    id: `demo-metric-${metricSeq}`,
    companyId,
    stageId,
    period,
    metricType,
    value,
    sourceId,
    confidence,
    isEstimate: false,
    curatedAt: new Date().toISOString(),
  }
}

const metrics = [
  ...stage2024.flatMap(([companyId, stageId, revenue, ebit]) => ([
    metric({ companyId, stageId, period: 2024, metricType: 'revenue', value: revenue }),
    metric({ companyId, stageId, period: 2024, metricType: 'ebit', value: ebit }),
  ])),
  ...totals2023.flatMap(([companyId, revenue, ebit]) => ([
    metric({ companyId, period: 2023, metricType: 'revenue', value: revenue, confidence: 'high' }),
    metric({ companyId, period: 2023, metricType: 'ebit', value: ebit, confidence: 'high' }),
  ])),
  ...capitalEmployed2024.map(([companyId, value]) => metric({ companyId, period: 2024, metricType: 'capitalEmployed', value, confidence: 'high' })),
]

const sources = [
  {
    id: 'demo-source-1',
    title: '(Sample) Blue Bear Coffee Co. FY2024 results summary',
    url: 'https://example.com/investor-relations/fy2024-results',
    publisher: 'Illustrative annual report excerpt',
    publishedDate: '2024-11-15',
    tier: 'primary_filing',
    excerpt: `In its FY2024 annual update, Blue Bear Coffee Co. reported group revenue of $1,990 million and operating profit (EBIT) of $372 million, an EBIT margin of approximately 18.7%. Retail like-for-like sales continued to outperform wholesale channels. Peer Global Roast Corp posted revenue of $2,980 million and EBIT of $376.8 million for the same period.`,
    notes: 'Sample source pre-loaded so you can try Research Library > Run extraction and see how pasted text becomes reviewable candidate metrics.',
    retrievedAt: new Date().toISOString(),
    credibilityScore: 90,
  },
]

export function buildDemoState() {
  return {
    sector: {
      id: sectorId,
      name: 'Illustrative Sector: Coffee Value Chain',
      description: 'Sample sector pre-loaded to demonstrate profit pool analysis across growing, roasting, distribution, and retail. All company names and figures are fictional — replace with your own curated research.',
      currencyUnit: '$M',
      createdAt: new Date().toISOString(),
    },
    stages,
    companies,
    sources,
    candidates: [],
    metrics,
    ui: { view: 'analysis', selectedYear: 2024 },
  }
}
