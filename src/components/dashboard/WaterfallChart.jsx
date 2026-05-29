import {
  ComposedChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList
} from 'recharts'
import { useApp } from '../../store/AppContext'
import { STAGE_ORDER } from '../../constants/stages'
import { formatValue } from '../../utils/formatters'

const STAGE_COLORS = {
  G0: '#9ca3af',
  G1: '#60a5fa',
  G2: '#818cf8',
  G3: '#c084fc',
  G4: '#2dd4bf',
  G5: '#34d399',
  Banked: '#fbbf24',
}

const STAGE_LABELS = {
  G0: 'G0 – Idea',
  G1: 'G1 – Outline',
  G2: 'G2 – MVP Def',
  G3: 'G3 – MVP Built',
  G4: 'G4 – Deployed',
  G5: 'G5 – Realised',
  Banked: 'Banked',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  const valueBar = payload.find(p => p.dataKey === 'value')
  if (!valueBar) return null

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
      <p className="font-semibold text-gray-900 text-sm">{label}</p>
      <p className="text-blue-700 font-bold">{formatValue(valueBar.value)}</p>
      <p className="text-xs text-gray-500">{valueBar.payload?.count || 0} initiative{(valueBar.payload?.count || 0) !== 1 ? 's' : ''}</p>
    </div>
  )
}

export function WaterfallChart() {
  const { state } = useApp()
  const { initiatives, meta } = state

  // Build waterfall data: for each stage, sum the current value estimates
  let runningStart = 0
  const data = STAGE_ORDER.map(stageId => {
    const stageInitiatives = initiatives.filter(i => i.stage === stageId && i.stage !== 'Rejected')
    const value = stageInitiatives.reduce((sum, i) => sum + (i.valueEstimates[stageId] || 0), 0)
    const entry = {
      stage: stageId,
      label: STAGE_LABELS[stageId] || stageId,
      value,
      spacer: runningStart,
      count: stageInitiatives.length,
      color: STAGE_COLORS[stageId] || '#9ca3af',
    }
    runningStart += value
    return entry
  })

  const maxValue = Math.max(runningStart * 1.2, meta.targetValue * 1.1, 1)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Pipeline Value by Stage</h2>
          <p className="text-xs text-gray-500 mt-0.5">Cumulative value across the initiative pipeline</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-3 h-0.5 border-t-2 border-dashed border-orange-400 inline-block" />
          Target: <span className="font-semibold text-orange-600">{formatValue(meta.targetValue)}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => v === 0 ? '£0' : formatValue(v)}
            domain={[0, maxValue]}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Spacer bar (transparent) */}
          <Bar dataKey="spacer" stackId="waterfall" fill="transparent" radius={0} />

          {/* Value bar */}
          <Bar dataKey="value" stackId="waterfall" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.stage} fill={entry.color} />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              formatter={v => v > 0 ? formatValue(v) : ''}
              style={{ fontSize: '10px', fill: '#374151', fontWeight: 600 }}
            />
          </Bar>

          {/* Target reference line */}
          <ReferenceLine
            y={meta.targetValue}
            stroke="#f97316"
            strokeDasharray="6 3"
            strokeWidth={2}
            label={{ value: `Target ${formatValue(meta.targetValue)}`, position: 'insideTopRight', fontSize: 11, fill: '#f97316', fontWeight: 600 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3">
        {STAGE_ORDER.map(stageId => {
          const entry = data.find(d => d.stage === stageId)
          if (!entry || entry.value === 0) return null
          return (
            <div key={stageId} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: STAGE_COLORS[stageId] }} />
              {STAGE_LABELS[stageId]}: <span className="font-semibold">{formatValue(entry.value)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
