import { formatCurrency, formatPercent } from '../utils/formatters'

const HEX = (c) => (c || '#94a3b8').replace('#', '')
const SLIDE_W = 10
const SLIDE_H = 5.63

function addHeader(slide, title, subtitle) {
  slide.addText(title, { x: 0.4, y: 0.25, w: SLIDE_W - 0.8, h: 0.5, fontSize: 20, bold: true, color: '111827' })
  if (subtitle) slide.addText(subtitle, { x: 0.4, y: 0.68, w: SLIDE_W - 0.8, h: 0.35, fontSize: 12, color: '6b7280' })
}

function titleSlide(pres, { sectorName, subtitle, focalName, accentColor, dateLabel }) {
  const slide = pres.addSlide()
  slide.background = { color: '0f172a' }
  slide.addText('PROFIT POOL ANALYSIS', { x: 0.6, y: 1.7, w: 8.8, h: 0.4, fontSize: 14, color: HEX(accentColor), bold: true, charSpacing: 2 })
  slide.addText(sectorName || 'Untitled sector', { x: 0.6, y: 2.1, w: 8.8, h: 1.0, fontSize: 32, color: 'FFFFFF', bold: true })
  if (subtitle) slide.addText(subtitle, { x: 0.6, y: 3.0, w: 8.8, h: 0.5, fontSize: 15, color: 'cbd5e1' })
  if (focalName) slide.addText(`Focal company: ${focalName}`, { x: 0.6, y: 3.6, w: 8.8, h: 0.4, fontSize: 13, color: HEX(accentColor), bold: true })
  slide.addText(dateLabel, { x: 0.6, y: SLIDE_H - 0.6, w: 6, h: 0.3, fontSize: 10, color: '94a3b8' })
}

function valueChainSlide(pres, { stageTotals, stageByCompany, focalCompanyId, focalColor, currencyUnit }) {
  const slide = pres.addSlide()
  addHeader(slide, 'Value chain profit pool map', 'Where profit concentrates along the chain, indexed to each stage’s share of the total pool')

  const n = stageTotals.length
  const marginX = 0.5
  const gap = 0.18
  const boxW = (SLIDE_W - 2 * marginX - gap * (n - 1)) / n
  const baseline = 4.55
  const maxBarH = 2.15
  const minBarH = 0.45

  const sectorEbit = stageTotals.reduce((s, x) => s + x.ebit, 0)
  const sectorRevenue = stageTotals.reduce((s, x) => s + x.revenue, 0)
  const maxProfitShare = Math.max(...stageTotals.map(s => (sectorEbit ? s.ebit / sectorEbit : 0)))

  stageTotals.forEach((stage, i) => {
    const x = marginX + i * (boxW + gap)
    const profitShare = sectorEbit ? stage.ebit / sectorEbit : 0
    const revenueShare = sectorRevenue ? stage.revenue / sectorRevenue : 0
    const barH = Math.max(minBarH, maxProfitShare ? (profitShare / maxProfitShare) * maxBarH : minBarH)
    const y = baseline - barH

    if (i > 0) {
      slide.addShape(pres.ShapeType.rightArrow, { x: x - gap - 0.02, y: baseline - 0.28, w: gap + 0.04, h: 0.14, fill: { color: 'cbd5e1' }, line: { color: 'cbd5e1' } })
    }

    slide.addShape(pres.ShapeType.roundRect, {
      x, y, w: boxW, h: barH, rectRadius: 0.06,
      fill: { color: i % 2 === 0 ? '2563eb' : '1e40af' },
      line: stageByCompany.some(s => s.stageId === stage.stageId && s.companies.some(c => c.companyId === focalCompanyId))
        ? { color: HEX(focalColor), width: 2.25 }
        : { color: HEX('#2563eb'), width: 0 },
    })
    slide.addText(formatPercent(profitShare * 100, 0), { x, y, w: boxW, h: barH * 0.6, align: 'center', valign: 'bottom', fontSize: 15, bold: true, color: 'FFFFFF' })
    slide.addText('of profit pool', { x, y: y + barH * 0.6, w: boxW, h: barH * 0.4, align: 'center', valign: 'top', fontSize: 8.5, color: 'dbeafe' })

    const entry = stageByCompany.find(s => s.stageId === stage.stageId)
    const focal = entry?.companies.find(c => c.companyId === focalCompanyId)
    const stageEbit = entry?.companies.reduce((s, c) => s + c.ebit, 0)
    if (focal && stageEbit) {
      slide.addShape(pres.ShapeType.roundRect, { x: x + boxW / 2 - 0.75, y: y - 0.28, w: 1.5, h: 0.22, rectRadius: 0.05, fill: { color: HEX(focalColor) }, line: { type: 'none' } })
      slide.addText(`focal: ${((focal.ebit / stageEbit) * 100).toFixed(0)}% of stage`, { x: x + boxW / 2 - 0.75, y: y - 0.28, w: 1.5, h: 0.22, align: 'center', valign: 'middle', fontSize: 8, color: 'FFFFFF', bold: true })
    }

    slide.addText(stage.name, { x, y: baseline + 0.06, w: boxW, h: 0.28, align: 'center', fontSize: 11, bold: true, color: '111827' })
    slide.addText(`${formatPercent(revenueShare * 100, 0)} of revenue`, { x, y: baseline + 0.32, w: boxW, h: 0.2, align: 'center', fontSize: 9, color: '6b7280' })
    slide.addText(`${formatCurrency(stage.ebit, currencyUnit)} pool`, { x, y: baseline + 0.5, w: boxW, h: 0.2, align: 'center', fontSize: 9, color: '6b7280' })
  })
}

function profitPoolMatrixSlide(pres, { matrix, currencyUnit }) {
  const slide = pres.addSlide()
  addHeader(slide, 'Profit pool matrix', 'Revenue share vs. profit share by company — bubble size = profit pool captured')

  const plot = { x0: 1.3, x1: SLIDE_W - 0.6, yTop: 1.15, yBottom: 4.75 }
  const maxShare = Math.max(100, ...matrix.map(d => Math.max(d.revenueShare, d.profitShare))) * 1.08
  const sx = (v) => plot.x0 + (v / maxShare) * (plot.x1 - plot.x0)
  const sy = (v) => plot.yBottom - (v / maxShare) * (plot.yBottom - plot.yTop)
  const maxEbit = Math.max(...matrix.map(d => d.ebit), 1)

  slide.addShape(pres.ShapeType.line, { x: plot.x0, y: plot.yBottom, w: plot.x1 - plot.x0, h: 0, line: { color: 'd1d5db', width: 1 } })
  slide.addShape(pres.ShapeType.line, { x: plot.x0, y: plot.yTop, w: 0, h: plot.yBottom - plot.yTop, line: { color: 'd1d5db', width: 1 } })
  slide.addShape(pres.ShapeType.line, { x: sx(0), y: sy(0), w: sx(maxShare) - sx(0), h: sy(maxShare) - sy(0), line: { color: 'cbd5e1', width: 1, dashType: 'dash' } })
  slide.addText('Share of sector revenue →', { x: plot.x0, y: plot.yBottom + 0.08, w: plot.x1 - plot.x0, h: 0.25, fontSize: 9, color: '6b7280', align: 'center' })
  slide.addText('Share of profit pool ↑', { x: 0.05, y: (plot.yTop + plot.yBottom) / 2 - 0.6, w: 1.2, h: 1.2, fontSize: 9, color: '6b7280', rotate: 270, align: 'center' })

  matrix.forEach(d => {
    const r = 0.12 + Math.sqrt(d.ebit / maxEbit) * 0.32
    const cx = sx(d.revenueShare)
    const cy = sy(d.profitShare)
    slide.addShape(pres.ShapeType.ellipse, {
      x: cx - r, y: cy - r, w: r * 2, h: r * 2,
      fill: { color: HEX(d.color), transparency: 10 },
      line: d.isFocal ? { color: '7f1d1d', width: 2 } : { color: HEX(d.color), width: 0 },
    })
  })

  matrix.forEach((d, i) => {
    slide.addText(`${d.isFocal ? '● ' : '○ '}${d.name}`, { x: 0.4, y: 1.15 + i * 0.28, w: 0.85, h: 0.24, fontSize: 8, color: d.isFocal ? '991b1b' : '374151', bold: d.isFocal })
  })
  slide.addText(`Bubble size = profit pool (${currencyUnit} EBIT)`, { x: plot.x0, y: 0.85, w: 6, h: 0.25, fontSize: 9, italic: true, color: '9ca3af' })
}

function barChartSlide(pres, { title, subtitle, labels, series, horizontal, singleSeriesColors }) {
  const slide = pres.addSlide()
  addHeader(slide, title, subtitle)
  const data = series.map(s => ({ name: s.name, labels, values: s.values }))
  const opts = {
    x: 0.6, y: 1.2, w: SLIDE_W - 1.2, h: SLIDE_H - 1.8,
    barDir: horizontal ? 'bar' : 'col',
    barGrouping: 'clustered',
    showLegend: series.length > 1,
    legendPos: 'b',
    showValue: true,
    dataLabelFormatCode: '0"%"',
    valAxisTitle: '%',
    chartColors: series.length === 1 && singleSeriesColors ? singleSeriesColors : undefined,
    catAxisLabelColor: '374151',
    catAxisLabelFontSize: 9,
  }
  slide.addChart(pres.ChartType.bar, data, opts)
}

function insightsSlide(pres, { insights }) {
  const slide = pres.addSlide()
  addHeader(slide, 'Key takeaways', 'Computed directly from curated data')
  slide.addText(insights.map(text => ({ text, options: { bullet: { code: '25B8' }, breakLine: true, paraSpaceAfter: 14 } })), {
    x: 0.6, y: 1.3, w: SLIDE_W - 1.2, h: SLIDE_H - 1.8, fontSize: 15, color: '1f2937', valign: 'top',
  })
}

export async function buildPptx({
  sectorName, subtitle, focalName, focalCompanyId, focalColor, currencyUnit,
  matrix, stageTotals, stageByCompany, insights,
  include = { valueChain: true, matrix: true, stageBars: true, benchmark: true, insights: true },
  fileName = 'profit-pool-analysis.pptx',
}) {
  const { default: PptxGenJS } = await import('pptxgenjs')
  const pres = new PptxGenJS()
  pres.defineLayout({ name: 'PPA_16x9', width: SLIDE_W, height: SLIDE_H })
  pres.layout = 'PPA_16x9'

  titleSlide(pres, {
    sectorName, subtitle, focalName, accentColor: focalColor,
    dateLabel: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
  })

  if (include.valueChain && stageTotals.length) {
    valueChainSlide(pres, { stageTotals, stageByCompany, focalCompanyId, focalColor, currencyUnit })
  }
  if (include.matrix && matrix.length) {
    profitPoolMatrixSlide(pres, { matrix, currencyUnit })
  }
  if (include.stageBars && stageTotals.length) {
    const labels = stageTotals.map(s => s.name)
    const sectorRevenue = stageTotals.reduce((s, x) => s + x.revenue, 0)
    const sectorEbit = stageTotals.reduce((s, x) => s + x.ebit, 0)
    barChartSlide(pres, {
      title: 'Revenue share vs. profit share by stage',
      subtitle: 'The classic profit pool signature: where scale and profitability diverge',
      labels,
      series: [
        { name: 'Revenue share', values: stageTotals.map(s => sectorRevenue ? +(s.revenue / sectorRevenue * 100).toFixed(1) : 0) },
        { name: 'Profit share', values: stageTotals.map(s => sectorEbit ? +(s.ebit / sectorEbit * 100).toFixed(1) : 0) },
      ],
    })
  }
  if (include.benchmark && matrix.length) {
    const sorted = [...matrix].sort((a, b) => (b.margin ?? -Infinity) - (a.margin ?? -Infinity))
    barChartSlide(pres, {
      title: 'Peer benchmarking: EBIT margin',
      subtitle: 'Focal company highlighted against the peer set',
      labels: sorted.map(c => c.name),
      series: [{ name: 'EBIT margin', values: sorted.map(c => c.margin != null ? +c.margin.toFixed(1) : 0) }],
      horizontal: true,
      singleSeriesColors: sorted.map(c => HEX(c.isFocal ? '#dc2626' : c.color)),
    })
  }
  if (include.insights && insights.length) {
    insightsSlide(pres, { insights })
  }

  await pres.writeFile({ fileName })
}
