import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts'
import { formatCurrency } from '../../utils/formatters'

export function ValueChainCaptureChart({ stageTotals, currencyUnit }) {
  if (!stageTotals.length) return null
  const sectorRevenue = stageTotals.reduce((s, x) => s + x.revenue, 0)
  const sectorEbit = stageTotals.reduce((s, x) => s + x.ebit, 0)
  const data = stageTotals.map(s => ({
    name: s.name,
    'Revenue share': sectorRevenue ? +(s.revenue / sectorRevenue * 100).toFixed(1) : 0,
    'Profit share': sectorEbit ? +(s.ebit / sectorEbit * 100).toFixed(1) : 0,
    pool: s.ebit,
  }))

  return (
    <div>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis unit="%" tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Revenue share" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Profit share" fill="#2563eb" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="pool" position="top" formatter={(v) => formatCurrency(v, currencyUnit)} style={{ fontSize: 10, fill: '#6b7280' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-400 text-center -mt-2">Stages ordered along the value chain. Label above each blue bar is the absolute profit pool size at that stage.</p>
    </div>
  )
}
