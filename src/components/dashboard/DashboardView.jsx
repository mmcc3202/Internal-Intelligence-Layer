import { StatsBar } from './StatsBar'
import { WaterfallChart } from './WaterfallChart'
import { Commentary } from './Commentary'
import { useApp } from '../../store/AppContext'
import { STAGE_ORDER, getStageConfig } from '../../constants/stages'
import { formatValue, formatDate } from '../../utils/formatters'

function StageBreakdownTable() {
  const { state, navigate } = useApp()
  const { initiatives } = state

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Stage Breakdown</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 pb-2">Stage</th>
              <th className="text-right text-xs font-medium text-gray-500 pb-2">Count</th>
              <th className="text-right text-xs font-medium text-gray-500 pb-2">Value</th>
              <th className="text-left text-xs font-medium text-gray-500 pb-2 pl-4">Initiatives</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {STAGE_ORDER.map(stageId => {
              const stageInitiatives = initiatives.filter(i => i.stage === stageId)
              if (stageInitiatives.length === 0) return null
              const cfg = getStageConfig(stageId)
              const totalValue = stageInitiatives.reduce((sum, i) => sum + (i.valueEstimates[stageId] || 0), 0)

              return (
                <tr key={stageId} className="hover:bg-gray-50">
                  <td className="py-2">
                    <span className={`inline-flex items-center rounded-full text-xs font-medium px-2 py-0.5 ${cfg.bgClass} ${cfg.textClass}`}>
                      {cfg.label}
                    </span>
                  </td>
                  <td className="py-2 text-right font-medium text-gray-900">{stageInitiatives.length}</td>
                  <td className="py-2 text-right font-semibold text-gray-900">{formatValue(totalValue)}</td>
                  <td className="py-2 pl-4">
                    <div className="flex flex-wrap gap-1">
                      {stageInitiatives.map(i => (
                        <button
                          key={i.id}
                          onClick={() => navigate('detail', i.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {i.title}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RecentActivity() {
  const { state, navigate } = useApp()

  // Collect recent history entries across all initiatives
  const recentEntries = state.initiatives
    .flatMap(i => i.history.map(h => ({ ...h, initiativeTitle: i.title, initiativeId: i.id })))
    .sort((a, b) => new Date(b.decidedAt) - new Date(a.decidedAt))
    .slice(0, 8)

  const decisionColors = {
    approved: 'text-emerald-700 bg-emerald-50',
    rejected: 'text-red-700 bg-red-50',
    needs_info: 'text-orange-700 bg-orange-50',
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {recentEntries.map(entry => (
          <div key={entry.id} className="flex gap-3">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-1.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <button
                  onClick={() => navigate('detail', entry.initiativeId)}
                  className="text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline text-left truncate"
                >
                  {entry.initiativeTitle}
                </button>
                <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(entry.decidedAt)}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {entry.decision && (
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${decisionColors[entry.decision] || 'text-gray-600 bg-gray-100'}`}>
                    {entry.decision}
                  </span>
                )}
                <span className="text-xs text-gray-500 truncate">
                  {entry.type === 'gate_decision' ? `Gate: ${entry.fromStage} → ${entry.toStage || 'Rejected'}` : 'Submitted'}
                </span>
              </div>
              {entry.comment && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{entry.comment}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Value Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track pipeline value against programme targets</p>
      </div>

      <StatsBar />

      <WaterfallChart />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StageBreakdownTable />
        </div>
        <div>
          <Commentary />
        </div>
      </div>

      <RecentActivity />
    </div>
  )
}
