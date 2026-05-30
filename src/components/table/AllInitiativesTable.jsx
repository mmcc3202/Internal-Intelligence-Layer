import { useState, useMemo } from 'react'
import { useApp } from '../../store/AppContext'
import { StageChip } from '../common/StageChip'
import { Button } from '../common/Button'
import { formatValue, formatDate } from '../../utils/formatters'
import { STAGES, REJECTED_STAGE } from '../../constants/stages'

const ALL_STAGE_OPTIONS = [...STAGES, REJECTED_STAGE]

function SortIcon({ active, dir }) {
  return (
    <svg className={`w-3 h-3 inline-block ml-1 ${active ? 'text-blue-600' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {active && dir === 'asc'
        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      }
    </svg>
  )
}

export function AllInitiativesTable() {
  const { state, navigate, openForm, openGateReview, role } = useApp()
  const [search, setSearch] = useState('')
  const [selectedStages, setSelectedStages] = useState([])
  const [sortKey, setSortKey] = useState('updatedAt')
  const [sortDir, setSortDir] = useState('desc')

  function toggleStage(stageId) {
    setSelectedStages(prev =>
      prev.includes(stageId) ? prev.filter(s => s !== stageId) : [...prev, stageId]
    )
  }

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filteredAndSorted = useMemo(() => {
    let items = state.initiatives

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.owner.toLowerCase().includes(q) ||
        (i.businessUnit || '').toLowerCase().includes(q) ||
        (i.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }

    // Stage filter
    if (selectedStages.length > 0) {
      items = items.filter(i => selectedStages.includes(i.stage))
    }

    // Sort
    items = [...items].sort((a, b) => {
      let aVal, bVal
      switch (sortKey) {
        case 'title': aVal = a.title; bVal = b.title; break
        case 'owner': aVal = a.owner; bVal = b.owner; break
        case 'businessUnit': aVal = a.businessUnit || ''; bVal = b.businessUnit || ''; break
        case 'stage': aVal = a.stage; bVal = b.stage; break
        case 'value':
          aVal = a.valueEstimates[a.stage] || 0
          bVal = b.valueEstimates[b.stage] || 0
          break
        case 'updatedAt': aVal = a.updatedAt; bVal = b.updatedAt; break
        default: aVal = a.updatedAt; bVal = b.updatedAt
      }
      if (typeof aVal === 'string') {
        const cmp = aVal.localeCompare(bVal)
        return sortDir === 'asc' ? cmp : -cmp
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    })

    return items
  }, [state.initiatives, search, selectedStages, sortKey, sortDir])

  const totalValue = filteredAndSorted
    .filter(i => i.stage !== 'Rejected')
    .reduce((sum, i) => sum + (i.valueEstimates[i.stage] || 0), 0)

  const columns = [
    { key: 'title', label: 'Initiative' },
    { key: 'owner', label: 'Owner' },
    { key: 'businessUnit', label: 'BU' },
    { key: 'stage', label: 'Stage' },
    { key: 'value', label: 'Value' },
    { key: 'updatedAt', label: 'Updated' },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">All Initiatives</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filteredAndSorted.length} of {state.initiatives.length} initiatives
            {filteredAndSorted.filter(i => i.stage !== 'Rejected').length > 0 && (
              <span> · Total: <span className="font-semibold text-blue-700">{formatValue(totalValue)}</span></span>
            )}
          </p>
        </div>
        <Button onClick={() => openForm()} size="sm">+ New Initiative</Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search initiatives, owners, tags..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Stage filter */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Filter by stage:</p>
          <div className="flex flex-wrap gap-2">
            {ALL_STAGE_OPTIONS.map(stage => (
              <button
                key={stage.id}
                onClick={() => toggleStage(stage.id)}
                className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${
                  selectedStages.includes(stage.id)
                    ? `${stage.bgClass} ${stage.textClass} ${stage.borderClass}`
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                {stage.shortLabel}
              </button>
            ))}
            {selectedStages.length > 0 && (
              <button
                onClick={() => setSelectedStages([])}
                className="text-xs px-2.5 py-1 text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key}
                    className="text-left text-xs font-semibold text-gray-500 px-4 py-3 cursor-pointer hover:text-gray-700 select-none"
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    <SortIcon active={sortKey === col.key} dir={sortDir} />
                  </th>
                ))}
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                    No initiatives match your filters.
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map(initiative => {
                  const currentValue = initiative.valueEstimates[initiative.stage]
                  const isPending = initiative.status === 'pending_review'
                  return (
                    <tr
                      key={initiative.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate('detail', initiative.id)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 hover:text-blue-700">{initiative.title}</span>
                          {isPending && (
                            <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" title="Pending review" />
                          )}
                        </div>
                        {initiative.tags && initiative.tags.length > 0 && (
                          <div className="flex gap-1 mt-0.5">
                            {initiative.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-xs text-gray-400">{tag}</span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{initiative.owner}</td>
                      <td className="px-4 py-3 text-gray-500">{initiative.businessUnit || '—'}</td>
                      <td className="px-4 py-3">
                        <StageChip stage={initiative.stage} size="sm" />
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {currentValue ? formatValue(currentValue) : '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(initiative.updatedAt)}</td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate('detail', initiative.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50"
                          >
                            View
                          </button>
                          {role === 'owner' && initiative.stage !== 'Rejected' && initiative.stage !== 'Banked' && (
                            <button
                              onClick={() => openForm(initiative.id)}
                              className="text-xs text-gray-600 hover:text-gray-800 font-medium px-2 py-1 rounded hover:bg-gray-100"
                            >
                              Edit
                            </button>
                          )}
                          {role === 'reviewer' && initiative.stage !== 'Rejected' && initiative.stage !== 'Banked' && (
                            <button
                              onClick={() => openGateReview(initiative.id)}
                              className="text-xs text-emerald-600 hover:text-emerald-800 font-medium px-2 py-1 rounded hover:bg-emerald-50"
                            >
                              Review
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredAndSorted.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              Showing {filteredAndSorted.length} initiative{filteredAndSorted.length !== 1 ? 's' : ''}
              {selectedStages.length > 0 && ` · filtered by ${selectedStages.join(', ')}`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
