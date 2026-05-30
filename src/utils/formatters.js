export function formatValue(valueMillion) {
  if (valueMillion === null || valueMillion === undefined || isNaN(valueMillion)) return '—'
  if (valueMillion >= 1000) return `£${(valueMillion/1000).toFixed(1)}B`
  if (valueMillion >= 1) return `£${valueMillion.toFixed(1)}M`
  return `£${(valueMillion * 1000).toFixed(0)}K`
}

export function formatDate(isoString) {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatStage(stageId) {
  const map = {
    G0: 'G0 – Idea', G1: 'G1 – Solution Outline', G2: 'G2 – MVP Defined',
    G3: 'G3 – MVP Built', G4: 'G4 – Deployed & Scaled', G5: 'G5 – Benefits Realised',
    Banked: 'Banked', Rejected: 'Rejected'
  }
  return map[stageId] || stageId
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes/1024).toFixed(1)} KB`
  return `${(bytes/1024/1024).toFixed(1)} MB`
}
