import { formatValue } from '../../utils/formatters'

export function ValueDisplay({ value, className = '', size = 'md' }) {
  const sizeClass = size === 'lg' ? 'text-2xl font-bold' : size === 'sm' ? 'text-sm' : 'text-base font-semibold'
  return <span className={`${sizeClass} ${className}`}>{formatValue(value)}</span>
}
