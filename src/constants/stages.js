export const STAGE_ORDER = ["G0","G1","G2","G3","G4","G5","Banked"]

export const STAGES = [
  {
    id: "G0", label: "G0 – Idea", shortLabel: "G0",
    bgClass: "bg-gray-100", textClass: "text-gray-700", borderClass: "border-gray-300",
    headerBg: "bg-gray-200", ringClass: "ring-gray-400",
    dotClass: "bg-gray-400", lightBg: "bg-gray-50",
    description: "New use-case identified and logged with owner"
  },
  {
    id: "G1", label: "G1 – Solution Outline", shortLabel: "G1",
    bgClass: "bg-blue-100", textClass: "text-blue-700", borderClass: "border-blue-300",
    headerBg: "bg-blue-200", ringClass: "ring-blue-400",
    dotClass: "bg-blue-400", lightBg: "bg-blue-50",
    description: "Business problem defined, T-shirt sized, feasibility assessed"
  },
  {
    id: "G2", label: "G2 – MVP Defined", shortLabel: "G2",
    bgClass: "bg-indigo-100", textClass: "text-indigo-700", borderClass: "border-indigo-300",
    headerBg: "bg-indigo-200", ringClass: "ring-indigo-400",
    dotClass: "bg-indigo-400", lightBg: "bg-indigo-50",
    description: "Full business case, data plan, delivery roadmap, MVP strategy"
  },
  {
    id: "G3", label: "G3 – MVP Built", shortLabel: "G3",
    bgClass: "bg-purple-100", textClass: "text-purple-700", borderClass: "border-purple-300",
    headerBg: "bg-purple-200", ringClass: "ring-purple-400",
    dotClass: "bg-purple-400", lightBg: "bg-purple-50",
    description: "Data sourced, MVP built, OKRs locked, measurement framework"
  },
  {
    id: "G4", label: "G4 – Deployed & Scaled", shortLabel: "G4",
    bgClass: "bg-teal-100", textClass: "text-teal-700", borderClass: "border-teal-300",
    headerBg: "bg-teal-200", ringClass: "ring-teal-400",
    dotClass: "bg-teal-400", lightBg: "bg-teal-50",
    description: "Full deployment, quality controls, org model, production"
  },
  {
    id: "G5", label: "G5 – Benefits Realised", shortLabel: "G5",
    bgClass: "bg-emerald-100", textClass: "text-emerald-700", borderClass: "border-emerald-300",
    headerBg: "bg-emerald-200", ringClass: "ring-emerald-400",
    dotClass: "bg-emerald-400", lightBg: "bg-emerald-50",
    description: "Finance sign-off, value banked, 3-month evidence confirmed"
  },
  {
    id: "Banked", label: "Banked", shortLabel: "Banked",
    bgClass: "bg-amber-100", textClass: "text-amber-700", borderClass: "border-amber-300",
    headerBg: "bg-amber-200", ringClass: "ring-amber-400",
    dotClass: "bg-amber-400", lightBg: "bg-amber-50",
    description: "Value confirmed and banked in financial statements"
  },
]

export const REJECTED_STAGE = {
  id: "Rejected", label: "Rejected", shortLabel: "Rej",
  bgClass: "bg-red-100", textClass: "text-red-700", borderClass: "border-red-300",
  headerBg: "bg-red-200", ringClass: "ring-red-400",
  dotClass: "bg-red-400", lightBg: "bg-red-50",
  description: "Initiative did not pass gate review"
}

export const ALL_STAGES_MAP = Object.fromEntries(
  [...STAGES, REJECTED_STAGE].map(s => [s.id, s])
)

export function getStageConfig(stageId) {
  return ALL_STAGES_MAP[stageId] || REJECTED_STAGE
}

export function getNextStage(currentStage) {
  const idx = STAGE_ORDER.indexOf(currentStage)
  if (idx === -1 || idx >= STAGE_ORDER.length - 1) return null
  return STAGE_ORDER[idx + 1]
}
