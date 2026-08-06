const STORAGE_KEY = 'profit_pool_analyzer_v1'
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB — see ARCHITECTURE.md for the real-DB migration path

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

export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function getStoragePercent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const size = raw ? new Blob([raw]).size : 0
    return (size / MAX_SIZE_BYTES) * 100
  } catch {
    return 0
  }
}
