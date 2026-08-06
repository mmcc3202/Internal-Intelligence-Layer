import { useApp } from '../../store/useApp'

const NAV = [
  { id: 'setup', label: 'Setup', hint: 'Sector, value chain, peers' },
  { id: 'research', label: 'Research Library', hint: 'Sources & extraction' },
  { id: 'curation', label: 'Data Curation', hint: 'Curated metrics' },
  { id: 'analysis', label: 'Analysis', hint: 'Profit pool views' },
  { id: 'present', label: 'Present', hint: 'Build the deck' },
]

export function AppShell({ children }) {
  const { state, actions } = useApp()
  const focal = state.companies.find(c => c.isFocal)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">PP</div>
              <h1 className="text-base font-semibold text-gray-900 truncate">{state.sector.name || 'Untitled sector'}</h1>
              {focal && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 shrink-0">
                  Focal: {focal.name}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">{state.companies.length} companies · {state.stages.length} value chain stages · {state.metrics.length} curated metrics</p>
          </div>
          <button
            onClick={() => { if (confirm('Clear the workspace and start blank? This removes all sector, company, source and metric data from this browser.')) actions.resetBlank() }}
            className="text-xs text-gray-400 hover:text-gray-600 shrink-0"
          >
            Reset workspace
          </button>
        </div>
        <nav className="max-w-7xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => actions.setView(item.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                state.ui.view === item.id
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
              }`}
              title={item.hint}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-6">{children}</main>
    </div>
  )
}
