import { useEffect, useReducer } from 'react'
import { reducer } from './reducer'
import { loadFromStorage, saveToStorage, clearStorage } from './storage'
import { buildDemoState } from '../data/seedData'
import { AppContext } from './context'

function loadInitial() {
  const stored = loadFromStorage()
  if (stored) return stored
  return buildDemoState()
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial)

  useEffect(() => {
    saveToStorage(state)
  }, [state])

  const actions = {
    setView: (view) => dispatch({ type: 'SET_VIEW', payload: view }),
    setSelectedYear: (year) => dispatch({ type: 'SET_SELECTED_YEAR', payload: year }),

    updateSector: (payload) => dispatch({ type: 'UPDATE_SECTOR', payload }),

    addStage: (payload) => dispatch({ type: 'ADD_STAGE', payload }),
    updateStage: (payload) => dispatch({ type: 'UPDATE_STAGE', payload }),
    removeStage: (id) => dispatch({ type: 'REMOVE_STAGE', payload: { id } }),
    moveStage: (id, direction) => dispatch({ type: 'MOVE_STAGE', payload: { id, direction } }),

    addCompany: (payload) => dispatch({ type: 'ADD_COMPANY', payload }),
    updateCompany: (payload) => dispatch({ type: 'UPDATE_COMPANY', payload }),
    removeCompany: (id) => dispatch({ type: 'REMOVE_COMPANY', payload: { id } }),
    setFocalCompany: (id) => dispatch({ type: 'SET_FOCAL_COMPANY', payload: { id } }),

    addSource: (payload) => dispatch({ type: 'ADD_SOURCE', payload }),
    updateSource: (payload) => dispatch({ type: 'UPDATE_SOURCE', payload }),
    removeSource: (id) => dispatch({ type: 'REMOVE_SOURCE', payload: { id } }),

    addCandidates: (sourceId, candidates) => dispatch({ type: 'ADD_CANDIDATES', payload: { sourceId, candidates } }),
    updateCandidate: (payload) => dispatch({ type: 'UPDATE_CANDIDATE', payload }),
    approveCandidate: (id) => dispatch({ type: 'APPROVE_CANDIDATE', payload: { id } }),
    rejectCandidate: (id) => dispatch({ type: 'REJECT_CANDIDATE', payload: { id } }),

    addMetric: (payload) => dispatch({ type: 'ADD_METRIC', payload }),
    updateMetric: (payload) => dispatch({ type: 'UPDATE_METRIC', payload }),
    removeMetric: (id) => dispatch({ type: 'REMOVE_METRIC', payload: { id } }),

    loadDemo: () => dispatch({ type: 'RESET_DEMO', payload: buildDemoState() }),
    resetBlank: () => {
      clearStorage()
      dispatch({ type: 'RESET_BLANK' })
    },
  }

  return <AppContext.Provider value={{ state, dispatch, actions }}>{children}</AppContext.Provider>
}
