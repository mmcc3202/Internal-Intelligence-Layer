import { Button } from '../common/Button'
import { Select, Input } from '../common/FormField'
import { METRIC_TYPES } from '../../data/constants'

const confidenceStyle = { high: 'bg-emerald-50 text-emerald-700 border-emerald-200', medium: 'bg-amber-50 text-amber-700 border-amber-200', low: 'bg-gray-100 text-gray-500 border-gray-200' }

export function CandidateRow({ candidate, companies, stages, onUpdate, onApprove, onReject }) {
  const metricDef = METRIC_TYPES.find(m => m.id === candidate.metricType)
  const canApprove = candidate.companyId && candidate.period

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <span className="text-sm font-semibold text-gray-900">{metricDef?.label || candidate.metricType}</span>
          <span className="ml-2 text-sm text-gray-700">{candidate.value}{metricDef?.unitKind === 'percent' ? '%' : ''}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${confidenceStyle[candidate.confidence] || confidenceStyle.low}`}>{candidate.confidence} confidence</span>
      </div>
      <p className="text-xs text-gray-500 italic mb-3">&ldquo;{candidate.evidenceText}&rdquo;</p>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <Select value={candidate.companyId || ''} onChange={e => onUpdate({ id: candidate.id, companyId: e.target.value || null })}>
          <option value="">Assign company…</option>
          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        <Input type="number" placeholder="Year" value={candidate.period || ''} onChange={e => onUpdate({ id: candidate.id, period: e.target.value ? parseInt(e.target.value, 10) : null })} />
        <Select value={candidate.stageId || ''} onChange={e => onUpdate({ id: candidate.id, stageId: e.target.value || null })}>
          <option value="">Sector-level (no stage)</option>
          {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={() => onReject(candidate.id)}>Reject</Button>
        <Button size="sm" variant="success" disabled={!canApprove} onClick={() => onApprove(candidate.id)}>
          Approve into database
        </Button>
      </div>
    </div>
  )
}
