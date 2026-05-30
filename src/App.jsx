import { AppProvider, useApp } from './store/AppContext'
import { Layout } from './components/layout/Layout'
import { PipelineBoard } from './components/pipeline/PipelineBoard'
import { DashboardView } from './components/dashboard/DashboardView'
import { AllInitiativesTable } from './components/table/AllInitiativesTable'
import { InitiativeDetailView } from './components/detail/InitiativeDetailView'
import { InitiativeFormModal } from './components/form/InitiativeFormModal'
import { GateReviewModal } from './components/gate/GateReviewModal'

function AppInner() {
  const { currentView, isFormOpen, closeForm, editingInitiativeId, isGateReviewOpen, closeGateReview, gateReviewInitiativeId, state } = useApp()

  const editingInitiative = editingInitiativeId ? state.initiatives.find(i => i.id === editingInitiativeId) : null
  const gateInitiative = gateReviewInitiativeId ? state.initiatives.find(i => i.id === gateReviewInitiativeId) : null

  return (
    <Layout>
      {currentView === 'pipeline' && <PipelineBoard />}
      {currentView === 'dashboard' && <DashboardView />}
      {currentView === 'table' && <AllInitiativesTable />}
      {currentView === 'detail' && <InitiativeDetailView />}
      {isFormOpen && <InitiativeFormModal initiative={editingInitiative} onClose={closeForm} />}
      {isGateReviewOpen && gateInitiative && <GateReviewModal initiative={gateInitiative} onClose={closeGateReview} />}
    </Layout>
  )
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>
}
