import { AppProvider } from './store/AppContext'
import { useApp } from './store/useApp'
import { AppShell } from './components/layout/AppShell'
import { SetupView } from './components/setup/SetupView'
import { ResearchLibraryView } from './components/research/ResearchLibraryView'
import { DataCurationView } from './components/curation/DataCurationView'
import { AnalysisView } from './components/analysis/AnalysisView'
import { PresentationView } from './components/present/PresentationView'

function AppInner() {
  const { state } = useApp()
  return (
    <AppShell>
      {state.ui.view === 'setup' && <SetupView />}
      {state.ui.view === 'research' && <ResearchLibraryView />}
      {state.ui.view === 'curation' && <DataCurationView />}
      {state.ui.view === 'analysis' && <AnalysisView />}
      {state.ui.view === 'present' && <PresentationView />}
    </AppShell>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
