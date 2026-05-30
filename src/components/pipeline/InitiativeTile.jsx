import { useApp } from '../../store/AppContext'
import { getStageConfig } from '../../constants/stages'
import { formatValue } from '../../utils/formatters'

export function InitiativeTile({ initiative, columnMax }) {
  const { navigate, openGateReview, role } = useApp()
  const cfg = getStageConfig(initiative.stage)
  const value = initiative.valueEstimates[initiative.stage]
  const tileHeight = Math.max(80, Math.min(220, (value / Math.max(columnMax, 0.1)) * 200))

  const isPendingReview = initiative.status === 'pending_review'

  return (
    <div
      className={`group relative rounded-lg border-2 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${cfg.bgClass} ${cfg.borderClass}`}
      style={{ minHeight: '80px', height: `${tileHeight}px` }}
      onClick={() => navigate('detail', initiative.id)}
    >
      <div className="p-3 flex flex-col h-full">
        {/* Top row: status indicator */}
        <div className="flex items-start justify-between gap-1 mb-1">
          <span className={`text-xs font-semibold ${cfg.textClass} leading-tight line-clamp-2 flex-1`}>
            {initiative.title}
          </span>
          {isPendingReview && (
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-400 mt-0.5" title="Pending review" />
          )}
        </div>

        {/* Owner */}
        <p className="text-xs text-gray-500 truncate">{initiative.owner}</p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom: value + actions */}
        <div className="flex items-end justify-between mt-1">
          <span className={`text-sm font-bold ${cfg.textClass}`}>
            {value ? formatValue(value) : '—'}
          </span>

          {/* Tags if room */}
          {tileHeight >= 120 && initiative.tags && initiative.tags.length > 0 && (
            <span className="text-xs text-gray-400 truncate max-w-24">{initiative.tags[0]}</span>
          )}
        </div>

        {/* Review button for reviewers */}
        {role === 'reviewer' && isPendingReview && (
          <button
            className="mt-1.5 text-xs bg-orange-100 text-orange-700 border border-orange-300 rounded px-2 py-0.5 hover:bg-orange-200 transition-colors"
            onClick={e => { e.stopPropagation(); openGateReview(initiative.id) }}
          >
            Review
          </button>
        )}
      </div>
    </div>
  )
}
