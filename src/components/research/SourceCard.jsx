import { useState } from 'react'
import { Button } from '../common/Button'
import { CandidateRow } from './CandidateRow'
import { tierById } from '../../data/constants'
import { formatDate } from '../../utils/formatters'
import { manualExtract } from '../../connectors/researchConnector'
import { useApp } from '../../store/useApp'

export function SourceCard({ source }) {
  const { state, actions } = useApp()
  const [expanded, setExpanded] = useState(false)
  const tier = tierById(source.tier)
  const candidates = state.candidates.filter(c => c.sourceId === source.id && c.status === 'pending')

  const runExtraction = () => {
    const drafts = manualExtract(source.excerpt, { sourceId: source.id, companies: state.companies, stages: state.stages })
    const withIds = drafts.map((d, i) => ({ ...d, id: `${source.id}-cand-${Date.now()}-${i}` }))
    actions.addCandidates(source.id, withIds)
    setExpanded(true)
  }

  const scoreColor = source.credibilityScore >= 70 ? 'text-emerald-600' : source.credibilityScore >= 40 ? 'text-amber-600' : 'text-red-600'

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">{source.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {source.publisher || 'Unknown publisher'} · {formatDate(source.publishedDate)}
            {source.url && <> · <a href={source.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">link</a></>}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">{tier.label.split(' (')[0]}</span>
          <p className={`text-xs font-semibold mt-1 ${scoreColor}`}>{source.credibilityScore}/100 credibility</p>
        </div>
      </div>

      {source.excerpt && (
        <div className="mt-3">
          <button onClick={() => setExpanded(x => !x)} className="text-xs text-blue-600 hover:underline">
            {expanded ? 'Hide excerpt & candidates' : 'Show excerpt & run extraction'}
          </button>
          {expanded && (
            <div className="mt-2 space-y-3">
              <p className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3 whitespace-pre-wrap">{source.excerpt}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">{candidates.length} pending candidate{candidates.length === 1 ? '' : 's'} from this source</p>
                <Button size="sm" variant="secondary" onClick={runExtraction}>Run extraction on excerpt</Button>
              </div>
              {candidates.length > 0 && (
                <div className="space-y-2">
                  {candidates.map(c => (
                    <CandidateRow
                      key={c.id}
                      candidate={c}
                      companies={state.companies}
                      stages={state.stages}
                      onUpdate={actions.updateCandidate}
                      onApprove={actions.approveCandidate}
                      onReject={actions.rejectCandidate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex justify-end">
        <button onClick={() => { if (confirm('Remove this source? Approved metrics that cite it will stay, but lose their citation link.')) actions.removeSource(source.id) }} className="text-xs text-gray-400 hover:text-red-600">
          Remove source
        </button>
      </div>
    </div>
  )
}
