import { useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine } from 'recharts'
import { formatPercent } from '../../utils/formatters'

function median(values) {
  if (!values.length) return null
  const s = [...values].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

export function PeerBenchmarkChart({ data }) {
  const [metric, setMetric] = useState('margin')
  const hasRoic = data.some(d => d.roic != null)
  const rows = data
    .filter(d => d[metric] != null)
    .map(d => ({ name: d.name, value: +d[metric].toFixed(1), color: d.color, isFocal: d.isFocal }))
    .sort((a, b) => b.value - a.value)
  const peerMedian = median(data.filter(d => !d.isFocal && d[metric] != null).map(d => d[metric]))

  if (!rows.length) return <p className="text-sm text-gray-400">No data for this metric yet.</p>

  return (
    <div>
      <div className="flex justify-end gap-1 mb-2">
        <button onClick={() => setMetric('margin')} className={`text-xs px-2 py-1 rounded-full border ${metric === 'margin' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-500'}`}>EBIT margin</button>
        {hasRoic && <button onClick={() => setMetric('roic')} className={`text-xs px-2 py-1 rounded-full border ${metric === 'roic' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-500'}`}>ROIC</button>}
      </div>
      <ResponsiveContainer width="100%" height={Math.max(220, rows.length * 48)}>
        <BarChart data={rows} layout="vertical" margin={{ top: 10, right: 30, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
          <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => formatPercent(v)} />
          {peerMedian != null && <ReferenceLine x={+peerMedian.toFixed(1)} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'peer median', position: 'top', fontSize: 10, fill: '#6b7280' }} />}
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {rows.map(r => <Cell key={r.name} fill={r.isFocal ? '#dc2626' : r.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
