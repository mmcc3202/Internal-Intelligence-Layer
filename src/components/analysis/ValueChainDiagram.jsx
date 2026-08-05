import { forwardRef } from 'react'
import { formatCurrency, formatPercent } from '../../utils/formatters'

const BOX_W = 190
const GAP = 46
const MAX_BAR_H = 190
const BASELINE = 260
const MIN_BAR_H = 46

function stageColor(index, count) {
  // Sequential blue scale, darker = further along (and typically higher-margin) stages.
  const t = count > 1 ? index / (count - 1) : 0
  const from = [191, 219, 254] // blue-200
  const to = [30, 64, 175] // blue-800
  const rgb = from.map((c, i) => Math.round(c + (to[i] - c) * t))
  return `rgb(${rgb.join(',')})`
}

/**
 * A value-chain "profit pool map": one box per chain stage, bar height
 * proportional to the stage's share of the sector profit pool, connected
 * left-to-right in chain order. The focal company's stake in a stage (when
 * curated at company level) is called out with a highlighted outline + badge.
 */
export const ValueChainDiagram = forwardRef(function ValueChainDiagram({ stageTotals, stageByCompany, focalCompanyId, focalColor, currencyUnit, sectorName }, ref) {
  if (!stageTotals.length) return null
  const sectorEbit = stageTotals.reduce((s, x) => s + x.ebit, 0)
  const sectorRevenue = stageTotals.reduce((s, x) => s + x.revenue, 0)
  const maxProfitShare = Math.max(...stageTotals.map(s => (sectorEbit ? s.ebit / sectorEbit : 0)))

  const width = stageTotals.length * BOX_W + (stageTotals.length - 1) * GAP + 40
  const height = BASELINE + 90

  const stageFocalShare = (stageId) => {
    const entry = stageByCompany?.find(s => s.stageId === stageId)
    if (!entry) return null
    const focal = entry.companies.find(c => c.companyId === focalCompanyId)
    const stageEbit = entry.companies.reduce((s, c) => s + c.ebit, 0)
    if (!focal || !stageEbit) return null
    return (focal.ebit / stageEbit) * 100
  }

  return (
    <svg ref={ref} viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label={`Value chain profit pool map for ${sectorName || 'sector'}`} style={{ maxWidth: '100%', height: 'auto' }}>
      <text x={20} y={24} fontSize="15" fontWeight="600" fill="#111827">{sectorName ? `${sectorName}: profit pool by value chain stage` : 'Profit pool by value chain stage'}</text>

      {stageTotals.map((stage, i) => {
        const x = 20 + i * (BOX_W + GAP)
        const profitShare = sectorEbit ? stage.ebit / sectorEbit : 0
        const revenueShare = sectorRevenue ? stage.revenue / sectorRevenue : 0
        const barH = Math.max(MIN_BAR_H, maxProfitShare ? (profitShare / maxProfitShare) * MAX_BAR_H : MIN_BAR_H)
        const y = BASELINE - barH
        const focalShare = stageFocalShare(stage.stageId)
        const isFocalStage = focalShare != null

        return (
          <g key={stage.stageId}>
            {i > 0 && (
              <path d={`M ${x - GAP + 8} ${BASELINE - 30} L ${x - 10} ${BASELINE - 30} L ${x - 18} ${BASELINE - 24} M ${x - 10} ${BASELINE - 30} L ${x - 18} ${BASELINE - 36}`}
                stroke="#cbd5e1" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            )}
            <rect x={x} y={y} width={BOX_W} height={barH} rx="6"
              fill={stageColor(i, stageTotals.length)}
              stroke={isFocalStage ? focalColor : 'transparent'}
              strokeWidth={isFocalStage ? 3 : 0} />
            <line x1={x} y1={BASELINE} x2={x + BOX_W} y2={BASELINE} stroke="#d1d5db" strokeWidth="1" />

            {isFocalStage && (
              <g>
                <rect x={x + BOX_W / 2 - 54} y={y - 24} width="108" height="18" rx="9" fill={focalColor} />
                <text x={x + BOX_W / 2} y={y - 11} fontSize="10" fill="white" textAnchor="middle" fontWeight="600">focal: {focalShare.toFixed(0)}% of stage</text>
              </g>
            )}

            <text x={x + BOX_W / 2} y={y + barH / 2 - 4} fontSize="13" fontWeight="700" fill="white" textAnchor="middle">{formatPercent(profitShare * 100, 0)}</text>
            <text x={x + BOX_W / 2} y={y + barH / 2 + 12} fontSize="10" fill="rgba(255,255,255,0.85)" textAnchor="middle">of profit pool</text>

            <text x={x + BOX_W / 2} y={BASELINE + 22} fontSize="12" fontWeight="600" fill="#111827" textAnchor="middle">{stage.name}</text>
            <text x={x + BOX_W / 2} y={BASELINE + 38} fontSize="10.5" fill="#6b7280" textAnchor="middle">{formatPercent(revenueShare * 100, 0)} of revenue</text>
            <text x={x + BOX_W / 2} y={BASELINE + 53} fontSize="10.5" fill="#6b7280" textAnchor="middle">{formatCurrency(stage.ebit, currencyUnit)} profit pool</text>
          </g>
        )
      })}
    </svg>
  )
})
