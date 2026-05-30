import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { reducer } from './reducer'
import { loadFromStorage, saveToStorage } from './storage'
import { SEED_DATA } from '../data/seedData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => {
    return loadFromStorage() || SEED_DATA
  })
  const [currentView, setCurrentView] = useState('pipeline')
  const [selectedInitiativeId, setSelectedInitiativeId] = useState(null)
  const [role, setRole] = useState(() => localStorage.getItem('vf_role') || 'owner')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingInitiativeId, setEditingInitiativeId] = useState(null)
  const [isGateReviewOpen, setIsGateReviewOpen] = useState(false)
  const [gateReviewInitiativeId, setGateReviewInitiativeId] = useState(null)

  useEffect(() => { saveToStorage(state) }, [state])
  useEffect(() => { localStorage.setItem('vf_role', role) }, [role])

  function navigate(view, initiativeId = null) {
    setCurrentView(view)
    if (initiativeId) setSelectedInitiativeId(initiativeId)
  }

  function openForm(initiativeId = null) {
    setEditingInitiativeId(initiativeId)
    setIsFormOpen(true)
  }

  function openGateReview(initiativeId) {
    setGateReviewInitiativeId(initiativeId)
    setIsGateReviewOpen(true)
  }

  const selectedInitiative = state.initiatives.find(i => i.id === selectedInitiativeId) || null

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      currentView,
      navigate,
      selectedInitiative,
      selectedInitiativeId,
      setSelectedInitiativeId,
      role,
      setRole,
      isFormOpen,
      openForm,
      closeForm: () => { setIsFormOpen(false); setEditingInitiativeId(null) },
      editingInitiativeId,
      isGateReviewOpen,
      openGateReview,
      closeGateReview: () => { setIsGateReviewOpen(false); setGateReviewInitiativeId(null) },
      gateReviewInitiativeId
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
