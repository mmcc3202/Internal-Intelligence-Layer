import { getStageConfig } from '../../constants/stages'

const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-2.5 py-1', lg: 'text-base px-3 py-1.5' }

export function StageChip({ stage, size = 'md' }) {
  const cfg = getStageConfig(stage)
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizes[size]} ${cfg.bgClass} ${cfg.textClass} border ${cfg.borderClass}`}>
      {cfg.label}
    </span>
  )
}
