import { generateId } from '../utils/id'
import { credibilityScore, PEER_PALETTE, FOCAL_COLOR } from '../data/constants'

export const initialState = {
  sector: { id: generateId(), name: '', description: '', currencyUnit: '$M', createdAt: new Date().toISOString() },
  stages: [],
  companies: [],
  sources: [],
  candidates: [],
  metrics: [],
  ui: { view: 'setup', selectedYear: new Date().getFullYear() - 1 },
}

function nextPeerColor(companies) {
  const used = new Set(companies.filter(c => !c.isFocal).map(c => c.color))
  return PEER_PALETTE.find(c => !used.has(c)) || PEER_PALETTE[companies.length % PEER_PALETTE.length]
}

export function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...initialState, ...action.payload }

    case 'RESET_DEMO':
      return action.payload

    case 'RESET_BLANK':
      return { ...initialState, sector: { ...initialState.sector, id: generateId() } }

    case 'UPDATE_SECTOR':
      return { ...state, sector: { ...state.sector, ...action.payload } }

    case 'ADD_STAGE': {
      const stage = { id: generateId(), name: action.payload.name, description: action.payload.description || '', order: state.stages.length }
      return { ...state, stages: [...state.stages, stage] }
    }
    case 'UPDATE_STAGE':
      return { ...state, stages: state.stages.map(s => s.id === action.payload.id ? { ...s, ...action.payload } : s) }
    case 'REMOVE_STAGE':
      return {
        ...state,
        stages: state.stages.filter(s => s.id !== action.payload.id).map((s, i) => ({ ...s, order: i })),
        metrics: state.metrics.filter(m => m.stageId !== action.payload.id),
        candidates: state.candidates.filter(c => c.stageId !== action.payload.id),
      }
    case 'MOVE_STAGE': {
      const idx = state.stages.findIndex(s => s.id === action.payload.id)
      const dir = action.payload.direction === 'up' ? -1 : 1
      const swapIdx = idx + dir
      if (idx < 0 || swapIdx < 0 || swapIdx >= state.stages.length) return state
      const stages = [...state.stages]
      ;[stages[idx], stages[swapIdx]] = [stages[swapIdx], stages[idx]]
      return { ...state, stages: stages.map((s, i) => ({ ...s, order: i })) }
    }

    case 'ADD_COMPANY': {
      const isFocal = state.companies.length === 0 || !!action.payload.isFocal
      const company = {
        id: generateId(),
        name: action.payload.name,
        ticker: action.payload.ticker || '',
        notes: action.payload.notes || '',
        isFocal,
        color: isFocal ? FOCAL_COLOR : nextPeerColor(state.companies),
      }
      let companies = [...state.companies, company]
      if (isFocal) companies = companies.map(c => c.id === company.id ? c : { ...c, isFocal: false })
      return { ...state, companies }
    }
    case 'UPDATE_COMPANY':
      return { ...state, companies: state.companies.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) }
    case 'REMOVE_COMPANY':
      return {
        ...state,
        companies: state.companies.filter(c => c.id !== action.payload.id),
        metrics: state.metrics.filter(m => m.companyId !== action.payload.id),
        candidates: state.candidates.filter(c => c.companyId !== action.payload.id),
      }
    case 'SET_FOCAL_COMPANY':
      return {
        ...state,
        companies: state.companies.map(c => c.id === action.payload.id
          ? { ...c, isFocal: true, color: FOCAL_COLOR }
          : { ...c, isFocal: false, color: c.color === FOCAL_COLOR ? nextPeerColor(state.companies) : c.color }),
      }

    case 'ADD_SOURCE': {
      const source = {
        id: generateId(),
        title: action.payload.title,
        url: action.payload.url || '',
        publisher: action.payload.publisher || '',
        publishedDate: action.payload.publishedDate || '',
        tier: action.payload.tier || 'other',
        excerpt: action.payload.excerpt || '',
        notes: action.payload.notes || '',
        retrievedAt: new Date().toISOString(),
      }
      source.credibilityScore = credibilityScore(source.tier, source.publishedDate)
      return { ...state, sources: [...state.sources, source] }
    }
    case 'UPDATE_SOURCE': {
      const sources = state.sources.map(s => {
        if (s.id !== action.payload.id) return s
        const updated = { ...s, ...action.payload }
        updated.credibilityScore = credibilityScore(updated.tier, updated.publishedDate)
        return updated
      })
      return { ...state, sources }
    }
    case 'REMOVE_SOURCE':
      return {
        ...state,
        sources: state.sources.filter(s => s.id !== action.payload.id),
        candidates: state.candidates.filter(c => c.sourceId !== action.payload.id),
        metrics: state.metrics.map(m => m.sourceId === action.payload.id ? { ...m, sourceId: null } : m),
      }

    case 'ADD_CANDIDATES':
      return { ...state, candidates: [...state.candidates.filter(c => c.sourceId !== action.payload.sourceId), ...action.payload.candidates] }
    case 'UPDATE_CANDIDATE':
      return { ...state, candidates: state.candidates.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) }
    case 'REJECT_CANDIDATE':
      return { ...state, candidates: state.candidates.map(c => c.id === action.payload.id ? { ...c, status: 'rejected' } : c) }
    case 'APPROVE_CANDIDATE': {
      const candidate = state.candidates.find(c => c.id === action.payload.id)
      if (!candidate) return state
      const metric = {
        id: generateId(),
        companyId: candidate.companyId,
        stageId: candidate.stageId || null,
        period: candidate.period,
        metricType: candidate.metricType,
        value: candidate.value,
        sourceId: candidate.sourceId,
        confidence: candidate.confidence || 'medium',
        isEstimate: false,
        curatedAt: new Date().toISOString(),
      }
      return {
        ...state,
        candidates: state.candidates.map(c => c.id === action.payload.id ? { ...c, status: 'approved' } : c),
        metrics: [...state.metrics, metric],
      }
    }

    case 'ADD_METRIC':
      return { ...state, metrics: [...state.metrics, { id: generateId(), curatedAt: new Date().toISOString(), sourceId: null, isEstimate: true, confidence: 'medium', stageId: null, ...action.payload }] }
    case 'UPDATE_METRIC':
      return { ...state, metrics: state.metrics.map(m => m.id === action.payload.id ? { ...m, ...action.payload } : m) }
    case 'REMOVE_METRIC':
      return { ...state, metrics: state.metrics.filter(m => m.id !== action.payload.id) }

    case 'SET_VIEW':
      return { ...state, ui: { ...state.ui, view: action.payload } }
    case 'SET_SELECTED_YEAR':
      return { ...state, ui: { ...state.ui, selectedYear: action.payload } }

    default:
      return state
  }
}
