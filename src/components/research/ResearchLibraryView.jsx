import { useState } from 'react'
import { useApp } from '../../store/useApp'
import { Button } from '../common/Button'
import { EmptyState } from '../common/EmptyState'
import { SourceCard } from './SourceCard'
import { AddSourceModal } from './AddSourceModal'
import { describeWebConnectorSetup } from '../../connectors/researchConnector'

export function ResearchLibraryView() {
  const { state, actions } = useApp()
  const [showAdd, setShowAdd] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const pendingCount = state.candidates.filter(c => c.status === 'pending').length

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="text-sm text-blue-900">
          <p className="font-medium">How this works</p>
          <p className="text-blue-800/80 mt-0.5">
            Add a source, paste an excerpt from it, then run extraction to surface candidate facts with the source sentence attached as evidence.
            Nothing enters the metrics database until you review and approve it in the curation queue below.
            {' '}
            <button onClick={() => setShowSetup(x => !x)} className="underline">
              {showSetup ? 'Hide' : 'Want live web search instead of pasting?'}
            </button>
          </p>
          {showSetup && (
            <ul className="list-disc list-inside mt-2 space-y-1 text-blue-800/80">
              {describeWebConnectorSetup().map((line, i) => <li key={i}>{line}</li>)}
            </ul>
          )}
        </div>
        <Button onClick={() => setShowAdd(true)} className="shrink-0">+ Add source</Button>
      </div>

      {pendingCount > 0 && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          {pendingCount} candidate{pendingCount === 1 ? '' : 's'} awaiting review across your sources — expand a source below to approve or reject them.
        </p>
      )}

      {state.sources.length === 0 ? (
        <EmptyState message="No sources yet" subtext="Add your first source to start building the evidence base." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {state.sources.map(source => <SourceCard key={source.id} source={source} />)}
        </div>
      )}

      {showAdd && <AddSourceModal onClose={() => setShowAdd(false)} onSave={actions.addSource} />}
    </div>
  )
}
