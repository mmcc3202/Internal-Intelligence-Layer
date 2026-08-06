import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ReferenceLine, Cell } from 'recharts'
import { formatCurrency, formatPercent } from '../../utils/formatters'

function CustomTooltip({ active, payload, currencyUnit }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-900 mb-1">{d.name}{d.isFocal ? ' (focal)' : ''}</p>
      <p>Revenue: {formatCurrency(d.revenue, currencyUnit)} ({formatPercent(d.revenueShare, 0)} share)</p>
      <p>EBIT: {formatCurrency(d.ebit, currencyUnit)} ({formatPercent(d.profitShare, 0)} share)</p>
      <p>Margin: {formatPercent(d.margin)}</p>
    </div>
  )
}

/**
 * The core profit pool chart: revenue share (x) vs profit share (y), bubble
 * size = pool size ($ EBIT). Points above the diagonal capture more profit
 * than their scale would suggest; points below underperform their scale.
 */
export function ProfitPoolMatrixChart({ data, currencyUnit }) {
  if (!data.length) return null
  const maxShare = Math.max(100, ...data.map(d => Math.max(d.revenueShare, d.profitShare))) * 1.05

  return (
    <div>
      <ResponsiveContainer width="100%" height={420}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
          <XAxis type="number" dataKey="revenueShare" domain={[0, maxShare]} unit="%" name="Revenue share" tick={{ fontSize: 11 }} label={{ value: 'Share of sector revenue (%)', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#6b7280' }} />
          <YAxis type="number" dataKey="profitShare" domain={[0, maxShare]} unit="%" name="Profit share" tick={{ fontSize: 11 }} label={{ value: 'Share of sector profit pool (%)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#6b7280' }} />
          <ZAxis type="number" dataKey="ebit" range={[200, 1800]} name="Profit pool" />
          <ReferenceLine segment={[{ x: 0, y: 0 }, { x: maxShare, y: maxShare }]} stroke="#cbd5e1" strokeDasharray="4 4" ifOverflow="extendDomain" />
          <Tooltip content={<CustomTooltip currencyUnit={currencyUnit} />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter data={data} fillOpacity={0.85}>
            {data.map(d => <Cell key={d.companyId} fill={d.color} stroke={d.isFocal ? '#7f1d1d' : 'transparent'} strokeWidth={d.isFocal ? 2 : 0} />)}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center -mt-2">
        {data.map(d => (
          <span key={d.companyId} className="inline-flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: d.color }} />
            {d.name}{d.isFocal ? ' (focal)' : ''}
          </span>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">Bubble size = profit pool captured ({currencyUnit} EBIT). Above the dashed line = capturing more profit than revenue scale alone would predict.</p>
    </div>
  )
}
