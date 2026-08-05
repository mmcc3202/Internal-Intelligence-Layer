import { useMemo } from 'react'
import { useApp } from '../../store/useApp'
import { Card } from '../common/Card'
import { Select } from '../common/FormField'
import { EmptyState } from '../common/EmptyState'
import { ProfitPoolMatrixChart } from './ProfitPoolMatrixChart'
import { ValueChainCaptureChart } from './ValueChainCaptureChart'
import { PeerBenchmarkChart } from './PeerBenchmarkChart'
import { ValueChainDiagram } from './ValueChainDiagram'
import { getAvailableYears, getProfitPoolMatrix, getStageTotals, getStageByCompany, getInsights } from '../../analysis/profitPool'

export function AnalysisView() {
  const { state, actions } = useApp()
  const years = useMemo(() => getAvailableYears(state.metrics), [state.metrics])
  const year = years.includes(state.ui.selectedYear) ? state.ui.selectedYear : years[0]

  const matrix = useMemo(() => year ? getProfitPoolMatrix(state.companies, state.metrics, year) : [], [state.companies, state.metrics, year])
  const stageTotals = useMemo(() => year ? getStageTotals(state.stages, state.metrics, year) : [], [state.stages, state.metrics, year])
  const stageByCompany = useMemo(() => year ? getStageByCompany(state.stages, state.companies, state.metrics, year) : [], [state.stages, state.companies, state.metrics, year])
  const insights = useMemo(() => year ? getInsights({ stages: state.stages, companies: state.companies, metrics: state.metrics, year }) : [], [state.stages, state.companies, state.metrics, year])
  const focal = state.companies.find(c => c.isFocal)

  if (!years.length) {
    return <EmptyState message="No curated metrics yet" subtext="Head to Data Curation or Research Library to add revenue and EBIT figures before analyzing." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Analysis year</h2>
        <Select value={year} onChange={e => actions.setSelectedYear(parseInt(e.target.value, 10))} className="w-32">
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </Select>
      </div>

      <Card title="Key takeaways" subtitle={`Computed live from curated ${year} data`}>
        <ul className="space-y-2">
          {insights.map((line, i) => (
            <li key={i} className="text-sm text-gray-700 flex gap-2">
              <span className="text-blue-500 mt-0.5">▸</span>{line}
            </li>
          ))}
        </ul>
      </Card>

      {stageTotals.length > 0 && (
        <Card title="Value chain profit pool map" subtitle="Where in the chain does profit actually concentrate?">
          <ValueChainDiagram
            stageTotals={stageTotals}
            stageByCompany={stageByCompany}
            focalCompanyId={focal?.id}
            focalColor={focal?.color || '#dc2626'}
            currencyUnit={state.sector.currencyUnit}
            sectorName={state.sector.name}
          />
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Profit pool matrix" subtitle="Revenue share vs. profit share, by company">
          {matrix.length > 0 ? <ProfitPoolMatrixChart data={matrix} currencyUnit={state.sector.currencyUnit} /> : <EmptyState message="No company-level data for this year" />}
        </Card>
        <Card title="Peer benchmarking" subtitle="Focal company vs. peer set">
          {matrix.length > 0 ? <PeerBenchmarkChart data={matrix} /> : <EmptyState message="No company-level data for this year" />}
        </Card>
      </div>

      {stageTotals.length > 0 && (
        <Card title="Revenue share vs. profit share by stage" subtitle="The classic profit pool signature: where scale and profitability diverge">
          <ValueChainCaptureChart stageTotals={stageTotals} currencyUnit={state.sector.currencyUnit} />
        </Card>
      )}
    </div>
  )
}
