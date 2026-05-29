import { useState } from 'react'
import { useApp } from '../../store/AppContext'
import { STAGES, REJECTED_STAGE } from '../../constants/stages'
import { StageColumn } from './StageColumn'
import { Button } from '../common/Button'
import { InitiativeTile } from './InitiativeTile'

export function PipelineBoard() {
  const { state, openForm } = useApp()
  const [showRejected, setShowRejected] = useState(false)

  const initiativesByStage = (stageId) =>
    state.initiatives.filter(i => i.stage === stageId)

  const rejectedInitiatives = state.initiatives.filter(i => i.stage === 'Rejected')
  const totalPipeline = state.initiatives
    .filter(i => i.stage !== 'Rejected')
    .reduce((sum, i) => sum + (i.valueEstimates[i.stage] || 0), 0)

  return (
    <div className="space-y-4">
      {/* Board header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Initiative Pipeline</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {state.initiatives.filter(i => i.stage !== 'Rejected').length} active initiatives
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            Total pipeline: <span className="font-bold text-blue-700">£{totalPipeline.toFixed(1)}M</span>
          </span>
          <Button onClick={() => openForm()} size="sm">
            + Add Initiative
          </Button>
        </div>
      </div>

      {/* Scrollable kanban board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 min-w-max">
          {STAGES.map(stage => (
            <StageColumn
              key={stage.id}
              stageId={stage.id}
              initiatives={initiativesByStage(stage.id)}
            />
          ))}
        </div>
      </div>

      {/* Rejected section */}
      {rejectedInitiatives.length > 0 && (
        <div className="border border-gray-200 rounded-lg bg-white">
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors rounded-lg"
            onClick={() => setShowRejected(!showRejected)}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Rejected Initiatives</span>
              <span className="text-xs bg-red-100 text-red-700 rounded-full px-2 py-0.5 font-medium">
                {rejectedInitiatives.length}
              </span>
            </div>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${showRejected ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showRejected && (
            <div className="px-4 pb-4 border-t border-gray-100">
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {rejectedInitiatives.map(initiative => (
                  <InitiativeTile
                    key={initiative.id}
                    initiative={initiative}
                    columnMax={Math.max(...rejectedInitiatives.map(i => Object.values(i.valueEstimates).at(-1) || 0), 0.1)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
