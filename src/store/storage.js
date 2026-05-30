const STORAGE_KEY = 'vf_tracker_v1'
const MAX_SIZE_BYTES = 5 * 1024 * 1024  // 5MB

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Storage save failed:', e)
  }
}

export function estimateStorageUsage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Blob([raw]).size : 0
  } catch {
    return 0
  }
}

export function getStoragePercent() {
  return (estimateStorageUsage() / MAX_SIZE_BYTES) * 100
}
