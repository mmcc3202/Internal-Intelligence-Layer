// Profit pool analysis engine.
//
// Pure functions over the curated Metrics table — no side effects, easy to
// unit test, and reusable by both the on-screen charts and the PPTX export
// (buildPptx.js feeds these same computed rows into native pptxgenjs
// charts so the numbers on screen and in the deck can never drift apart).

function median(values) {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function sumMetric(metrics, { companyId, stageId, period, metricType }) {
  return metrics
    .filter(m => m.companyId === companyId
      && m.period === period
      && m.metricType === metricType
      && (stageId === undefined || m.stageId === stageId))
    .reduce((sum, m) => sum + m.value, 0)
}

export function getAvailableYears(metrics) {
  return [...new Set(metrics.map(m => m.period).filter(Boolean))].sort((a, b) => b - a)
}

function companyMetricTotal(metrics, companyId, year, metricType) {
  const rows = metrics.filter(m => m.companyId === companyId && m.period === year && m.metricType === metricType)
  const stageRows = rows.filter(m => m.stageId != null)
  const companyLevelRows = rows.filter(m => m.stageId == null)
  // Prefer the stage breakdown over a company-level total when both exist, to avoid double counting.
  const source = stageRows.length ? stageRows : companyLevelRows
  return source.reduce((sum, m) => sum + m.value, 0)
}

/** Company-level revenue/EBIT for a year, preferring a stage breakdown over a company-level total when both exist (avoids double counting). */
export function getCompanyTotals(companies, metrics, year) {
  return companies.map(company => {
    const revenue = companyMetricTotal(metrics, company.id, year, 'revenue')
    const ebit = companyMetricTotal(metrics, company.id, year, 'ebit')

    const capitalEmployed = sumMetric(metrics, { companyId: company.id, stageId: null, period: year, metricType: 'capitalEmployed' }) || null

    return {
      companyId: company.id,
      name: company.name,
      isFocal: company.isFocal,
      color: company.color,
      revenue: revenue || 0,
      ebit: ebit || 0,
      margin: revenue ? (ebit / revenue) * 100 : null,
      capitalEmployed,
      roic: capitalEmployed ? (ebit / capitalEmployed) * 100 : null,
    }
  }).filter(c => c.revenue > 0 || c.ebit > 0)
}

/** Value-chain stage totals for a year (sector-wide profit pool by stage). */
export function getStageTotals(stages, metrics, year) {
  return [...stages].sort((a, b) => a.order - b.order).map(stage => {
    const revenue = metrics.filter(m => m.stageId === stage.id && m.period === year && m.metricType === 'revenue').reduce((s, m) => s + m.value, 0)
    const ebit = metrics.filter(m => m.stageId === stage.id && m.period === year && m.metricType === 'ebit').reduce((s, m) => s + m.value, 0)
    return { stageId: stage.id, name: stage.name, order: stage.order, revenue, ebit, margin: revenue ? (ebit / revenue) * 100 : null }
  }).filter(s => s.revenue > 0 || s.ebit > 0)
}

/** Per-stage company breakdown, for a stacked "who captures each stage" view. */
export function getStageByCompany(stages, companies, metrics, year) {
  return [...stages].sort((a, b) => a.order - b.order).map(stage => ({
    stageId: stage.id,
    name: stage.name,
    companies: companies.map(company => {
      const revenue = metrics.filter(m => m.companyId === company.id && m.stageId === stage.id && m.period === year && m.metricType === 'revenue').reduce((s, m) => s + m.value, 0)
      const ebit = metrics.filter(m => m.companyId === company.id && m.stageId === stage.id && m.period === year && m.metricType === 'ebit').reduce((s, m) => s + m.value, 0)
      return { companyId: company.id, name: company.name, color: company.color, isFocal: company.isFocal, revenue, ebit }
    }).filter(c => c.revenue > 0 || c.ebit > 0),
  })).filter(s => s.companies.length > 0)
}

/** The core profit-pool matrix: revenue share vs profit share vs pool size, per company. */
export function getProfitPoolMatrix(companies, metrics, year) {
  const totals = getCompanyTotals(companies, metrics, year)
  const sectorRevenue = totals.reduce((s, c) => s + c.revenue, 0)
  const sectorEbit = totals.reduce((s, c) => s + c.ebit, 0)
  return totals.map(c => ({
    ...c,
    revenueShare: sectorRevenue ? (c.revenue / sectorRevenue) * 100 : 0,
    profitShare: sectorEbit ? (c.ebit / sectorEbit) * 100 : 0,
  }))
}

export function getPeerBenchmark(companies, metrics, year) {
  const totals = getCompanyTotals(companies, metrics, year)
  return totals.sort((a, b) => (b.margin ?? -Infinity) - (a.margin ?? -Infinity))
}

export function getTrend(companies, metrics, metricType) {
  const years = getAvailableYears(metrics)
  return companies.map(company => ({
    companyId: company.id,
    name: company.name,
    isFocal: company.isFocal,
    color: company.color,
    series: years
      .map(year => ({ year, value: companyMetricTotal(metrics, company.id, year, metricType) }))
      .filter(p => p.value)
      .sort((a, b) => a.year - b.year),
  })).filter(c => c.series.length > 0)
}

/** Plain-language takeaways computed live from the curated data — never hardcoded. */
export function getInsights({ stages, companies, metrics, year }) {
  const insights = []
  const stageTotals = getStageTotals(stages, metrics, year)
  const sectorEbit = stageTotals.reduce((s, x) => s + x.ebit, 0)
  const sectorRevenue = stageTotals.reduce((s, x) => s + x.revenue, 0)

  if (stageTotals.length && sectorEbit > 0 && sectorRevenue > 0) {
    const ranked = stageTotals
      .map(s => ({ ...s, profitShare: (s.ebit / sectorEbit) * 100, revenueShare: (s.revenue / sectorRevenue) * 100 }))
      .sort((a, b) => (b.profitShare - b.revenueShare) - (a.profitShare - a.revenueShare))
    const top = ranked[0]
    if (top && top.profitShare - top.revenueShare > 3) {
      insights.push(`${top.name} captures ${top.profitShare.toFixed(0)}% of the sector profit pool from just ${top.revenueShare.toFixed(0)}% of revenue — the largest concentration of profit relative to scale in the chain.`)
    }
  }

  const matrix = getProfitPoolMatrix(companies, metrics, year)
  const focal = matrix.find(c => c.isFocal)
  const peers = matrix.filter(c => !c.isFocal)
  if (focal && peers.length) {
    const peerMedianMargin = median(peers.map(p => p.margin).filter(v => v != null))
    if (focal.margin != null && peerMedianMargin != null) {
      const diff = focal.margin - peerMedianMargin
      insights.push(`${focal.name} posts a ${focal.margin.toFixed(1)}% EBIT margin, ${Math.abs(diff).toFixed(1)} points ${diff >= 0 ? 'above' : 'below'} the peer median of ${peerMedianMargin.toFixed(1)}%.`)
    }
    const rankByProfitShare = [...matrix].sort((a, b) => b.profitShare - a.profitShare)
    const rank = rankByProfitShare.findIndex(c => c.isFocal) + 1
    if (rank > 0) {
      insights.push(`${focal.name} ranks #${rank} of ${matrix.length} tracked companies by share of sector profit pool (${focal.profitShare.toFixed(0)}%), vs #${[...matrix].sort((a, b) => b.revenueShare - a.revenueShare).findIndex(c => c.isFocal) + 1} by revenue share.`)
    }
    const peerMedianRoic = median(peers.map(p => p.roic).filter(v => v != null))
    if (focal.roic != null && peerMedianRoic != null) {
      const diff = focal.roic - peerMedianRoic
      insights.push(`Return on capital employed of ${focal.roic.toFixed(1)}% is ${Math.abs(diff).toFixed(1)} points ${diff >= 0 ? 'above' : 'below'} the peer median (${peerMedianRoic.toFixed(1)}%).`)
    }
  }

  if (!insights.length) {
    insights.push(`Not enough curated data for ${year} yet to generate takeaways — add metrics in Data Curation.`)
  }
  return insights
}
