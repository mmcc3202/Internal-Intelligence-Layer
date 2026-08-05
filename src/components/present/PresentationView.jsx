import { useMemo, useRef, useState } from 'react'
import { useApp } from '../../store/useApp'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { Field, Input, Select } from '../common/FormField'
import { EmptyState } from '../common/EmptyState'
import { ValueChainDiagram } from '../analysis/ValueChainDiagram'
import { getAvailableYears, getProfitPoolMatrix, getStageTotals, getStageByCompany, getInsights } from '../../analysis/profitPool'
import { downloadSvgAsPng } from '../../utils/svgExport'
import { buildPptx } from '../../pptx/buildPptx'

const SLIDE_OPTIONS = [
  { key: 'valueChain', label: 'Value chain profit pool map' },
  { key: 'matrix', label: 'Profit pool matrix (revenue vs. profit share)' },
  { key: 'stageBars', label: 'Revenue vs. profit share by stage (bar chart)' },
  { key: 'benchmark', label: 'Peer benchmarking (EBIT margin)' },
  { key: 'insights', label: 'Key takeaways' },
]

export function PresentationView() {
  const { state } = useApp()
  const years = useMemo(() => getAvailableYears(state.metrics), [state.metrics])
  const [year, setYear] = useState(years[0])
  const activeYear = years.includes(year) ? year : years[0]

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [include, setInclude] = useState({ valueChain: true, matrix: true, stageBars: true, benchmark: true, insights: true })
  const [generating, setGenerating] = useState(false)
  const svgRef = useRef(null)

  const focal = state.companies.find(c => c.isFocal)
  const matrix = useMemo(() => activeYear ? getProfitPoolMatrix(state.companies, state.metrics, activeYear) : [], [state.companies, state.metrics, activeYear])
  const stageTotals = useMemo(() => activeYear ? getStageTotals(state.stages, state.metrics, activeYear) : [], [state.stages, state.metrics, activeYear])
  const stageByCompany = useMemo(() => activeYear ? getStageByCompany(state.stages, state.companies, state.metrics, activeYear) : [], [state.stages, state.companies, state.metrics, activeYear])
  const insights = useMemo(() => activeYear ? getInsights({ stages: state.stages, companies: state.companies, metrics: state.metrics, year: activeYear }) : [], [state.stages, state.companies, state.metrics, activeYear])

  if (!years.length) {
    return <EmptyState message="Nothing to present yet" subtext="Curate some metrics first, then come back to build the deck." />
  }

  const toggle = (key) => setInclude(s => ({ ...s, [key]: !s[key] }))

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await buildPptx({
        sectorName: title || state.sector.name || 'Untitled sector',
        subtitle: subtitle || `Profit pool analysis · ${activeYear}`,
        focalName: focal?.name,
        focalCompanyId: focal?.id,
        focalColor: focal?.color || '#dc2626',
        currencyUnit: state.sector.currencyUnit,
        matrix, stageTotals, stageByCompany, insights, include,
        fileName: `${(state.sector.name || 'profit-pool-analysis').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${activeYear}.pptx`,
      })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <Card title="Deck details">
          <div className="space-y-3">
            <Field label="Title"><Input value={title} onChange={e => setTitle(e.target.value)} placeholder={state.sector.name || 'Sector name'} /></Field>
            <Field label="Subtitle"><Input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder={`Profit pool analysis · ${activeYear}`} /></Field>
            <Field label="Year">
              <Select value={activeYear} onChange={e => setYear(parseInt(e.target.value, 10))}>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </Select>
            </Field>
            {focal && (
              <p className="text-xs text-gray-500">
                Focal company <span className="font-medium" style={{ color: focal.color }}>{focal.name}</span> will be highlighted against {state.companies.length - 1} peer{state.companies.length - 1 === 1 ? '' : 's'} throughout.
              </p>
            )}
          </div>
        </Card>

        <Card title="Slides to include">
          <ul className="space-y-2">
            {SLIDE_OPTIONS.map(opt => (
              <li key={opt.key}>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={include[opt.key]} onChange={() => toggle(opt.key)} className="rounded border-gray-300" />
                  {opt.label}
                </label>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-2">
          <Button className="w-full" onClick={handleGenerate} disabled={generating}>
            {generating ? 'Generating…' : 'Generate PowerPoint (.pptx)'}
          </Button>
          <Button className="w-full" variant="secondary" onClick={() => downloadSvgAsPng(svgRef.current, `value-chain-${activeYear}.png`)}>
            Download value chain map as PNG
          </Button>
          <p className="text-xs text-gray-400">Charts and shapes in the .pptx are native, editable PowerPoint objects — not flattened images — so you can restyle them after export.</p>
        </div>
      </div>

      <div className="lg:col-span-2">
        <Card title="Preview: value chain profit pool map" subtitle="This is what gets embedded natively in the deck and exported as PNG">
          {stageTotals.length > 0 ? (
            <ValueChainDiagram
              ref={svgRef}
              stageTotals={stageTotals}
              stageByCompany={stageByCompany}
              focalCompanyId={focal?.id}
              focalColor={focal?.color || '#dc2626'}
              currencyUnit={state.sector.currencyUnit}
              sectorName={title || state.sector.name}
            />
          ) : (
            <EmptyState message="No value-chain-level data for this year" subtext="Add stage-level revenue and EBIT in Data Curation to unlock this view." />
          )}
        </Card>
      </div>
    </div>
  )
}
