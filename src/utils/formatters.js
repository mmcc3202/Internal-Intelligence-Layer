export function formatCurrency(value, unit = '$M') {
  if (value == null || Number.isNaN(value)) return '—'
  const symbol = unit.replace(/[A-Z]/g, '')
  const suffix = unit.replace(/[^A-Z]/g, '')
  return `${symbol}${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}${suffix}`
}

export function formatPercent(value, digits = 1) {
  if (value == null || Number.isNaN(value)) return '—'
  return `${value.toFixed(digits)}%`
}

export function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}
