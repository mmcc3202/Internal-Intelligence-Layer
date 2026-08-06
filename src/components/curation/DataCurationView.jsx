import { useMemo, useState } from 'react'
import { useApp } from '../../store/useApp'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { Select } from '../common/FormField'
import { EmptyState } from '../common/EmptyState'
import { METRIC_TYPES, CONFIDENCE_LEVELS } from '../../data/constants'

export function DataCurationView() {
  const { state, actions } = useApp()
  const [companyFilter, setCompanyFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')

  const years = useMemo(() => [...new Set(state.metrics.map(m => m.period))].sort((a, b) => b - a), [state.metrics])

  const rows = useMemo(() => {
    return state.metrics
      .filter(m => !companyFilter || m.companyId === companyFilter)
      .filter(m => !yearFilter || String(m.period) === yearFilter)
      .sort((a, b) => b.period - a.period || a.metricType.localeCompare(b.metricType))
  }, [state.metrics, companyFilter, yearFilter])

  const sourceTitle = (id) => state.sources.find(s => s.id === id)?.title

  const addBlank = () => {
    if (!state.companies.length) return alert('Add at least one company in Setup first.')
    actions.addMetric({ companyId: state.companies[0].id, period: yearFilter ? parseInt(yearFilter, 10) : new Date().getFullYear() - 1, metricType: 'revenue', value: 0 })
  }

  return (
    <div className="space-y-4">
      <Card
        title="Curated metrics"
        subtitle="Every row here feeds the analysis views. Approve candidates in Research Library, or add/edit directly."
        actions={<Button size="sm" onClick={addBlank}>+ Add metric</Button>}
      >
        <div className="flex gap-3 mb-4">
          <Select value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} className="w-56">
            <option value="">All companies</option>
            {state.companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="w-32">
            <option value="">All years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </Select>
        </div>

        {rows.length === 0 ? (
          <EmptyState message="No curated metrics yet" subtext="Approve candidates from Research Library, or add one manually." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-3 font-medium">Company</th>
                  <th className="py-2 pr-3 font-medium">Value chain stage</th>
                  <th className="py-2 pr-3 font-medium">Year</th>
                  <th className="py-2 pr-3 font-medium">Metric</th>
                  <th className="py-2 pr-3 font-medium">Value</th>
                  <th className="py-2 pr-3 font-medium">Confidence</th>
                  <th className="py-2 pr-3 font-medium">Source</th>
                  <th className="py-2 pr-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(m => (
                  <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 pr-3">
                      <Select value={m.companyId} onChange={e => actions.updateMetric({ id: m.id, companyId: e.target.value })} className="border-transparent bg-transparent px-0 py-0.5">
                        {state.companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </Select>
                    </td>
                    <td className="py-2 pr-3">
                      <Select value={m.stageId || ''} onChange={e => actions.updateMetric({ id: m.id, stageId: e.target.value || null })} className="border-transparent bg-transparent px-0 py-0.5">
                        <option value="">Sector-level</option>
                        {state.stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </Select>
                    </td>
                    <td className="py-2 pr-3">
                      <input type="number" value={m.period} onChange={e => actions.updateMetric({ id: m.id, period: parseInt(e.target.value, 10) || m.period })} className="w-20 border-transparent bg-transparent focus:border-gray-300 focus:bg-white rounded px-1 py-0.5" />
                    </td>
                    <td className="py-2 pr-3">
                      <Select value={m.metricType} onChange={e => actions.updateMetric({ id: m.id, metricType: e.target.value })} className="border-transparent bg-transparent px-0 py-0.5">
                        {METRIC_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                      </Select>
                    </td>
                    <td className="py-2 pr-3">
                      <input type="number" step="any" value={m.value} onChange={e => actions.updateMetric({ id: m.id, value: parseFloat(e.target.value) || 0 })} className="w-24 border-transparent bg-transparent focus:border-gray-300 focus:bg-white rounded px-1 py-0.5 font-medium" />
                    </td>
                    <td className="py-2 pr-3">
                      <Select value={m.confidence} onChange={e => actions.updateMetric({ id: m.id, confidence: e.target.value })} className="border-transparent bg-transparent px-0 py-0.5">
                        {CONFIDENCE_LEVELS.map(c => <option key={c} value={c}>{c}</option>)}
                      </Select>
                    </td>
                    <td className="py-2 pr-3 text-xs text-gray-500 max-w-[14rem] truncate" title={sourceTitle(m.sourceId) || 'No source — manual estimate'}>
                      {sourceTitle(m.sourceId) || <span className="italic">manual estimate</span>}
                    </td>
                    <td className="py-2 pr-1 text-right">
                      <button onClick={() => actions.removeMetric(m.id)} className="text-gray-400 hover:text-red-600">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
