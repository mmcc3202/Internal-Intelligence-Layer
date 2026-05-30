import { useState } from 'react'
import { useApp } from '../../store/AppContext'
import { Button } from '../common/Button'

const tabs = [
  { id: 'pipeline', label: 'Pipeline Board' },
  { id: 'dashboard', label: 'Value Dashboard' },
  { id: 'table', label: 'All Initiatives' },
]

export function Header() {
  const { currentView, navigate, role, setRole, state, dispatch, openForm } = useApp()
  const [editingTarget, setEditingTarget] = useState(false)
  const [targetInput, setTargetInput] = useState(String(state.meta.targetValue))

  function handleTargetBlur() {
    const v = parseFloat(targetInput)
    if (!isNaN(v) && v > 0) dispatch({ type: 'SET_TARGET_VALUE', payload: v })
    setEditingTarget(false)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm">VF Value Tracker</span>
              <span className="hidden sm:block text-xs text-gray-500">Initiative Pipeline</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentView === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Target value */}
            <div className="hidden md:flex items-center gap-1.5 text-sm">
              <span className="text-gray-500">Target:</span>
              {editingTarget ? (
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">£</span>
                  <input
                    type="number"
                    value={targetInput}
                    onChange={e => setTargetInput(e.target.value)}
                    onBlur={handleTargetBlur}
                    onKeyDown={e => e.key === 'Enter' && handleTargetBlur()}
                    className="w-16 border border-blue-300 rounded px-1.5 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                  <span className="text-gray-600">M</span>
                </div>
              ) : (
                <button
                  onClick={() => { setTargetInput(String(state.meta.targetValue)); setEditingTarget(true) }}
                  className="font-semibold text-blue-700 hover:text-blue-900 underline decoration-dashed"
                >
                  £{state.meta.targetValue}M
                </button>
              )}
            </div>

            {/* Role toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setRole('owner')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${role === 'owner' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Owner
              </button>
              <button
                onClick={() => setRole('reviewer')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${role === 'reviewer' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Reviewer
              </button>
            </div>

            <Button onClick={() => openForm()} size="sm">
              + New Initiative
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
