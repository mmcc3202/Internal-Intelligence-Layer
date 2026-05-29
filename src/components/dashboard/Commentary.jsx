import { useState } from 'react'
import { useApp } from '../../store/AppContext'
import { formatDate } from '../../utils/formatters'

export function Commentary() {
  const { state, dispatch } = useApp()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(state.meta.commentary || '')

  function handleBlur() {
    dispatch({ type: 'SET_COMMENTARY', payload: value })
    setEditing(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-900">Programme Commentary</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            Updated {formatDate(state.meta.lastUpdated)}
          </span>
          {!editing && (
            <button
              onClick={() => { setValue(state.meta.commentary || ''); setEditing(true) }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <div>
          <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            rows={4}
            className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Enter programme commentary..."
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setEditing(false)}
              className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1 rounded border border-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleBlur}
              className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded font-medium"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-700 leading-relaxed">
          {state.meta.commentary || <span className="text-gray-400 italic">No commentary yet. Click Edit to add.</span>}
        </p>
      )}
    </div>
  )
}
