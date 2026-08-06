// Domain constants shared across the app.

export const SOURCE_TIERS = [
  { id: 'primary_filing', label: 'Primary filing (10-K, annual report, investor deck)', weight: 5 },
  { id: 'regulator_data', label: 'Regulator / government / trade body data', weight: 5 },
  { id: 'industry_research', label: 'Paid industry research (e.g. Gartner, IBISWorld, Bloomberg)', weight: 4 },
  { id: 'analyst_report', label: 'Sell-side / equity analyst report', weight: 4 },
  { id: 'reputable_press', label: 'Reputable business press (e.g. WSJ, FT, Reuters)', weight: 3 },
  { id: 'trade_press', label: 'Trade press / industry blog', weight: 2 },
  { id: 'other', label: 'Other / unverified', weight: 1 },
]

export const CONFIDENCE_LEVELS = ['high', 'medium', 'low']

export const METRIC_TYPES = [
  { id: 'revenue', label: 'Revenue', unitKind: 'currency' },
  { id: 'ebit', label: 'EBIT / Operating profit', unitKind: 'currency' },
  { id: 'capitalEmployed', label: 'Capital employed', unitKind: 'currency' },
  { id: 'ebitMargin', label: 'EBIT margin', unitKind: 'percent' },
  { id: 'marketShare', label: 'Market share', unitKind: 'percent' },
]

export const CURRENCY_UNITS = ['$M', '$B', '€M', '€B', '£M', '£B']

// Deterministic, distinguishable palette for peer companies. The focal
// company always renders in ACCENT regardless of this list.
export const PEER_PALETTE = ['#64748b', '#94a3b8', '#0891b2', '#7c3aed', '#b45309', '#4d7c0f', '#be185d', '#0f766e']
export const FOCAL_COLOR = '#dc2626'
export const ACCENT_COLOR = '#2563eb'

export function tierById(id) {
  return SOURCE_TIERS.find(t => t.id === id) || SOURCE_TIERS[SOURCE_TIERS.length - 1]
}

// Credibility score 0-100 blending source-tier weight with recency.
export function credibilityScore(tier, publishedDate) {
  const t = tierById(tier)
  let score = (t.weight / 5) * 70
  if (publishedDate) {
    const ageYears = (Date.now() - new Date(publishedDate).getTime()) / (365 * 24 * 3600 * 1000)
    if (ageYears <= 1) score += 30
    else if (ageYears <= 2) score += 20
    else if (ageYears <= 4) score += 10
    else score += 0
  } else {
    score += 10
  }
  return Math.max(0, Math.min(100, Math.round(score)))
}
