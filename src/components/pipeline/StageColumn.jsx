import { getStageConfig } from '../../constants/stages'
import { formatValue } from '../../utils/formatters'
import { InitiativeTile } from './InitiativeTile'
import { EmptyState } from '../common/EmptyState'

export function StageColumn({ stageId, initiatives }) {
  const cfg = getStageConfig(stageId)
  const totalValue = initiatives.reduce((sum, i) => sum + (i.valueEstimates[i.stage] || 0), 0)
  const columnMax = Math.max(...initiatives.map(i => i.valueEstimates[i.stage] || 0), 0.1)

  return (
    <div className="flex flex-col min-w-48 w-48 flex-shrink-0">
      {/* Column header */}
      <div className={`rounded-t-lg px-3 py-2 ${cfg.headerBg}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold ${cfg.textClass} truncate`}>{cfg.label}</span>
          <span className={`text-xs font-semibold ${cfg.textClass} ml-1 flex-shrink-0`}>
            {initiatives.length}
          </span>
        </div>
        {totalValue > 0 && (
          <div className={`text-xs font-medium ${cfg.textClass} opacity-80 mt-0.5`}>
            {formatValue(totalValue)}
          </div>
        )}
      </div>

      {/* Column body */}
      <div className={`flex-1 rounded-b-lg border-2 ${cfg.borderClass} border-t-0 p-2 space-y-2 min-h-32`}
        style={{ background: 'rgba(255,255,255,0.7)' }}
      >
        {initiatives.length === 0 ? (
          <EmptyState message="No initiatives" />
        ) : (
          initiatives.map(initiative => (
            <InitiativeTile
              key={initiative.id}
              initiative={initiative}
              columnMax={columnMax}
            />
          ))
        )}
      </div>
    </div>
  )
}
