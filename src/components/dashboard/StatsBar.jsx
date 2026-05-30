import { useApp } from '../../store/AppContext'
import { formatValue } from '../../utils/formatters'

export function StatsBar() {
  const { state } = useApp()
  const { initiatives, meta } = state

  const activeInitiatives = initiatives.filter(i => i.stage !== 'Rejected')
  const totalPipeline = activeInitiatives.reduce((sum, i) => sum + (i.valueEstimates[i.stage] || 0), 0)
  const bankedInitiatives = initiatives.filter(i => i.stage === 'Banked')
  const bankedValue = bankedInitiatives.reduce((sum, i) => {
    const bankedData = i.stageData?.Banked
    return sum + (bankedData?.realisedValue || i.valueEstimates?.Banked || 0)
  }, 0)
  const targetPercent = meta.targetValue > 0 ? Math.round((totalPipeline / meta.targetValue) * 100) : 0

  const stats = [
    {
      label: 'Total Pipeline Value',
      value: formatValue(totalPipeline),
      sub: `across ${activeInitiatives.length} initiatives`,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    {
      label: 'Banked Value',
      value: formatValue(bankedValue),
      sub: `${bankedInitiatives.length} initiative${bankedInitiatives.length !== 1 ? 's' : ''} banked`,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    {
      label: '% of Target',
      value: `${targetPercent}%`,
      sub: `target: ${formatValue(meta.targetValue)}`,
      color: targetPercent >= 100 ? 'text-emerald-700' : targetPercent >= 75 ? 'text-blue-700' : 'text-orange-700',
      bg: targetPercent >= 100 ? 'bg-emerald-50' : targetPercent >= 75 ? 'bg-blue-50' : 'bg-orange-50',
      border: targetPercent >= 100 ? 'border-emerald-200' : targetPercent >= 75 ? 'border-blue-200' : 'border-orange-200',
    },
    {
      label: 'Active Initiatives',
      value: String(activeInitiatives.length),
      sub: `${initiatives.filter(i => i.stage === 'Rejected').length} rejected`,
      color: 'text-gray-700',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(stat => (
        <div key={stat.label} className={`rounded-xl border p-4 ${stat.bg} ${stat.border}`}>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
          <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{stat.sub}</p>
        </div>
      ))}
    </div>
  )
}
