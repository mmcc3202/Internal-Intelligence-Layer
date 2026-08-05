const baseInput = 'w-full text-sm rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium text-gray-700 mb-1">{label}</span>}
      {children}
      {hint && <span className="block text-xs text-gray-400 mt-1">{hint}</span>}
    </label>
  )
}

export function Input(props) {
  return <input {...props} className={`${baseInput} ${props.className || ''}`} />
}

export function TextArea(props) {
  return <textarea {...props} className={`${baseInput} ${props.className || ''}`} />
}

export function Select({ children, ...props }) {
  return <select {...props} className={`${baseInput} bg-white ${props.className || ''}`}>{children}</select>
}
