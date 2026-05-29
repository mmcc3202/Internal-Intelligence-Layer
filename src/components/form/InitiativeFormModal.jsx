import { useState } from 'react'
import { useApp } from '../../store/AppContext'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { fileToBase64, estimateStorageSize } from '../../utils/fileHelpers'
import { formatFileSize } from '../../utils/formatters'

const MAX_FILE_SIZE = 400 * 1024 // 400KB
const WARN_TOTAL_SIZE = 4 * 1024 * 1024 // 4MB

function FieldGroup({ label, children, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, required }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  )
}

function TextareaInput({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
    />
  )
}

function SelectInput({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}

const tshirtOptions = [
  { value: '', label: 'Select...' },
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
]

function G0Fields({ data, onChange }) {
  const set = (key) => (val) => onChange({ ...data, [key]: val })
  return (
    <div className="space-y-4">
      <FieldGroup label="Problem Statement" required>
        <TextareaInput value={data.problemStatement || ''} onChange={set('problemStatement')} placeholder="Describe the business problem..." />
      </FieldGroup>
      <FieldGroup label="Hypothesis">
        <TextareaInput value={data.hypothesis || ''} onChange={set('hypothesis')} placeholder="How do you think this problem can be solved..." />
      </FieldGroup>
      <FieldGroup label="Sponsor">
        <TextInput value={data.sponsor || ''} onChange={set('sponsor')} placeholder="Executive sponsor name and title" />
      </FieldGroup>
      <FieldGroup label="Data Available">
        <TextInput value={data.dataAvailable || ''} onChange={set('dataAvailable')} placeholder="What data is available?" />
      </FieldGroup>
    </div>
  )
}

function G1Fields({ data, onChange }) {
  const set = (key) => (val) => onChange({ ...data, [key]: val })
  return (
    <div className="space-y-4">
      <FieldGroup label="Business Problem" required>
        <TextareaInput value={data.businessProblem || ''} onChange={set('businessProblem')} placeholder="Quantified business problem..." />
      </FieldGroup>
      <FieldGroup label="Current Workflow">
        <TextareaInput value={data.workflow || ''} onChange={set('workflow')} placeholder="Describe current process..." />
      </FieldGroup>
      <FieldGroup label="Hypothesis">
        <TextareaInput value={data.hypothesis || ''} onChange={set('hypothesis')} placeholder="Solution hypothesis..." />
      </FieldGroup>
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="T-shirt Cost Size">
          <SelectInput value={data.tshirtCostSize || ''} onChange={set('tshirtCostSize')} options={tshirtOptions} />
        </FieldGroup>
        <FieldGroup label="T-shirt Value Size">
          <SelectInput value={data.tshirtValueSize || ''} onChange={set('tshirtValueSize')} options={tshirtOptions} />
        </FieldGroup>
      </div>
      <FieldGroup label="Technical Feasibility">
        <TextInput value={data.technicalFeasibility || ''} onChange={set('technicalFeasibility')} placeholder="High / Medium / Low + notes" />
      </FieldGroup>
      <FieldGroup label="Data Feasibility">
        <TextInput value={data.dataFeasibility || ''} onChange={set('dataFeasibility')} placeholder="High / Medium / Low + notes" />
      </FieldGroup>
      <FieldGroup label="People Impact">
        <TextInput value={data.peopleImpact || ''} onChange={set('peopleImpact')} placeholder="FTE impact, redeployment..." />
      </FieldGroup>
      <FieldGroup label="Risk Assessment">
        <TextareaInput value={data.riskAssessment || ''} onChange={set('riskAssessment')} placeholder="Key risks and mitigations..." />
      </FieldGroup>
    </div>
  )
}

function G2Fields({ data, onChange }) {
  const set = (key) => (val) => onChange({ ...data, [key]: val })
  return (
    <div className="space-y-4">
      <FieldGroup label="MVP Scope" required>
        <TextareaInput value={data.mvpScope || ''} onChange={set('mvpScope')} placeholder="What is in scope for the MVP?" />
      </FieldGroup>
      <FieldGroup label="User Strategy">
        <TextareaInput value={data.userStrategy || ''} onChange={set('userStrategy')} placeholder="Who are the users and how will they adopt?" />
      </FieldGroup>
      <FieldGroup label="Data Feasibility Detail">
        <TextareaInput value={data.dataFeasibilityDetail || ''} onChange={set('dataFeasibilityDetail')} placeholder="Detailed data feasibility assessment..." />
      </FieldGroup>
      <FieldGroup label="Data Readiness Plan">
        <TextareaInput value={data.dataReadinessPlan || ''} onChange={set('dataReadinessPlan')} placeholder="Steps to get data ready..." />
      </FieldGroup>
      <FieldGroup label="Technical Readiness">
        <TextareaInput value={data.technicalReadiness || ''} onChange={set('technicalReadiness')} placeholder="Technical platform and team readiness..." />
      </FieldGroup>
      <FieldGroup label="Org Readiness">
        <TextareaInput value={data.orgReadiness || ''} onChange={set('orgReadiness')} placeholder="Organisational readiness and change..." />
      </FieldGroup>
      <FieldGroup label="Delivery Roadmap">
        <TextareaInput value={data.deliveryRoadmap || ''} onChange={set('deliveryRoadmap')} placeholder="Quarter-by-quarter delivery plan..." />
      </FieldGroup>
      <FieldGroup label="Phase Breakdown / Budget">
        <TextareaInput value={data.phaseBreakdown || ''} onChange={set('phaseBreakdown')} placeholder="Investment by phase..." />
      </FieldGroup>
      <FieldGroup label="Business Case Narrative">
        <TextareaInput value={data.businessCaseNarrative || ''} onChange={set('businessCaseNarrative')} placeholder="NPV, payback period, value drivers..." rows={4} />
      </FieldGroup>
      <FieldGroup label="Expert Review Notes">
        <TextareaInput value={data.expertReviewNotes || ''} onChange={set('expertReviewNotes')} placeholder="Finance, legal, IT, HR sign-offs..." />
      </FieldGroup>
    </div>
  )
}

function G3Fields({ data, onChange }) {
  const set = (key) => (val) => onChange({ ...data, [key]: val })
  return (
    <div className="space-y-4">
      <FieldGroup label="Data Sourced" required>
        <TextareaInput value={data.dataSourced || ''} onChange={set('dataSourced')} placeholder="Confirm all data sources are live..." />
      </FieldGroup>
      <FieldGroup label="Platform Access">
        <TextInput value={data.platformAccess || ''} onChange={set('platformAccess')} placeholder="ML/analytics platform details..." />
      </FieldGroup>
      <FieldGroup label="MVP Description">
        <TextareaInput value={data.mvpDescription || ''} onChange={set('mvpDescription')} placeholder="What was built?" />
      </FieldGroup>
      <FieldGroup label="OKRs">
        <TextareaInput value={data.okrs || ''} onChange={set('okrs')} placeholder="OKR1: ..., OKR2: ..." />
      </FieldGroup>
      <FieldGroup label="Measurement Framework">
        <TextareaInput value={data.measurementFramework || ''} onChange={set('measurementFramework')} placeholder="How will value be measured?" />
      </FieldGroup>
      <FieldGroup label="Model Monitoring Strategy">
        <TextareaInput value={data.modelMonitoringStrategy || ''} onChange={set('modelMonitoringStrategy')} placeholder="How will the model be monitored?" />
      </FieldGroup>
      <FieldGroup label="User Testing Feedback">
        <TextareaInput value={data.userTestingFeedback || ''} onChange={set('userTestingFeedback')} placeholder="Feedback from user testing..." />
      </FieldGroup>
      <FieldGroup label="Value Proof Points">
        <TextareaInput value={data.valueProofPoints || ''} onChange={set('valueProofPoints')} placeholder="Early evidence of value..." />
      </FieldGroup>
    </div>
  )
}

function G4Fields({ data, onChange }) {
  const set = (key) => (val) => onChange({ ...data, [key]: val })
  return (
    <div className="space-y-4">
      <FieldGroup label="API Documentation">
        <TextareaInput value={data.apiDocumentation || ''} onChange={set('apiDocumentation')} placeholder="Integration APIs documented..." />
      </FieldGroup>
      <FieldGroup label="Quality Controls" required>
        <TextareaInput value={data.qualityControls || ''} onChange={set('qualityControls')} placeholder="QA processes and automated checks..." />
      </FieldGroup>
      <FieldGroup label="IP Protection">
        <TextInput value={data.ipProtection || ''} onChange={set('ipProtection')} placeholder="How is IP protected?" />
      </FieldGroup>
      <FieldGroup label="Disaster Recovery Plan">
        <TextareaInput value={data.disasterRecoveryPlan || ''} onChange={set('disasterRecoveryPlan')} placeholder="Fallback processes..." />
      </FieldGroup>
      <FieldGroup label="Org Model">
        <TextareaInput value={data.orgModel || ''} onChange={set('orgModel')} placeholder="Team structure to run the solution..." />
      </FieldGroup>
      <FieldGroup label="Change Delivery Strategy">
        <TextareaInput value={data.changeDeliveryStrategy || ''} onChange={set('changeDeliveryStrategy')} placeholder="Training, rollout, adoption strategy..." />
      </FieldGroup>
      <FieldGroup label="Adoption Metrics">
        <TextareaInput value={data.adoptionMetrics || ''} onChange={set('adoptionMetrics')} placeholder="DAU, engagement, usage metrics..." />
      </FieldGroup>
      <FieldGroup label="Value Creation Milestones" required>
        <TextareaInput value={data.valueCreationMilestones || ''} onChange={set('valueCreationMilestones')} placeholder="Month-by-month value tracking..." />
      </FieldGroup>
      <FieldGroup label="Governance Setup">
        <TextareaInput value={data.governanceSetup || ''} onChange={set('governanceSetup')} placeholder="Steering committee, review cadence..." />
      </FieldGroup>
    </div>
  )
}

function G5Fields({ data, onChange }) {
  const set = (key) => (val) => onChange({ ...data, [key]: val })
  return (
    <div className="space-y-4">
      <FieldGroup label="Finance Evidence" required>
        <TextareaInput value={data.financeEvidence || ''} onChange={set('financeEvidence')} placeholder="Finance sign-off evidence..." />
      </FieldGroup>
      <FieldGroup label="3-Month Data">
        <TextareaInput value={data.threeMonthData || ''} onChange={set('threeMonthData')} placeholder="3 months of realised value data..." />
      </FieldGroup>
      <FieldGroup label="Signed Off By">
        <TextInput value={data.signOffBy || ''} onChange={set('signOffBy')} placeholder="Finance signatory name and title" />
      </FieldGroup>
      <FieldGroup label="Actual vs Forecast">
        <TextareaInput value={data.actualVsForecast || ''} onChange={set('actualVsForecast')} placeholder="Actual delivery vs business case forecast..." />
      </FieldGroup>
      <FieldGroup label="Lessons Learned">
        <TextareaInput value={data.lessonsLearned || ''} onChange={set('lessonsLearned')} placeholder="What worked, what to do differently..." />
      </FieldGroup>
    </div>
  )
}

function DocumentUpload({ documents, onAdd, onRemove }) {
  const [error, setError] = useState('')

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large (${formatFileSize(file.size)}). Maximum 400KB.`)
      return
    }

    try {
      const base64 = await fileToBase64(file)
      onAdd({ name: file.name, size: file.size, type: file.type, data: base64 })
    } catch {
      setError('Failed to read file.')
    }
    e.target.value = ''
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2">Documents</label>
      {documents.length > 0 && (
        <div className="space-y-1 mb-2">
          {documents.map((doc, i) => (
            <div key={i} className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded text-sm">
              <span className="truncate text-gray-700">{doc.name}</span>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className="text-xs text-gray-400">{formatFileSize(doc.size)}</span>
                <button onClick={() => onRemove(i)} className="text-red-400 hover:text-red-600 text-xs">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-600 hover:text-blue-800">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Attach document
        <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg" />
      </label>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      <p className="text-xs text-gray-400 mt-1">Max 400KB per file. Accepted: PDF, Office docs, images.</p>
    </div>
  )
}

export function InitiativeFormModal({ initiative, onClose }) {
  const { dispatch, state } = useApp()
  const isEditing = !!initiative

  const [title, setTitle] = useState(initiative?.title || '')
  const [owner, setOwner] = useState(initiative?.owner || '')
  const [businessUnit, setBusinessUnit] = useState(initiative?.businessUnit || '')
  const [description, setDescription] = useState(initiative?.description || '')
  const [valueEstimate, setValueEstimate] = useState(
    initiative ? String(initiative.valueEstimates[initiative.stage] || '') : ''
  )
  const [tags, setTags] = useState((initiative?.tags || []).join(', '))
  const [stageData, setStageData] = useState(
    initiative ? (initiative.stageData[initiative.stage] || {}) : {}
  )
  const [pendingDocs, setPendingDocs] = useState([])
  const [error, setError] = useState('')

  const stage = initiative?.stage || 'G0'

  const stageFieldComponents = {
    G0: <G0Fields data={stageData} onChange={setStageData} />,
    G1: <G1Fields data={stageData} onChange={setStageData} />,
    G2: <G2Fields data={stageData} onChange={setStageData} />,
    G3: <G3Fields data={stageData} onChange={setStageData} />,
    G4: <G4Fields data={stageData} onChange={setStageData} />,
    G5: <G5Fields data={stageData} onChange={setStageData} />,
  }

  function handleSave() {
    if (!title.trim()) { setError('Title is required.'); return }
    if (!owner.trim()) { setError('Owner is required.'); return }
    setError('')

    const valueNum = parseFloat(valueEstimate)
    const parsedValue = !isNaN(valueNum) && valueNum > 0 ? valueNum : null
    const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean)

    if (isEditing) {
      dispatch({
        type: 'UPDATE_STAGE_DATA',
        payload: {
          id: initiative.id,
          stageData,
          valueEstimate: parsedValue,
        }
      })
      // Add pending docs
      pendingDocs.forEach(doc => {
        dispatch({ type: 'ADD_DOCUMENT', payload: { initiativeId: initiative.id, document: doc } })
      })
    } else {
      dispatch({
        type: 'CREATE_INITIATIVE',
        payload: { title, owner, businessUnit, description, valueEstimate: parsedValue, stageData, tags: parsedTags }
      })
    }
    onClose()
  }

  const totalStorageEstimate = estimateStorageSize(state)
  const storageWarning = totalStorageEstimate > WARN_TOTAL_SIZE

  return (
    <Modal onClose={onClose} size="xl" title={isEditing ? `Edit: ${initiative.title}` : 'New Initiative'}>
      <div className="overflow-y-auto p-6 space-y-6" style={{ maxHeight: '80vh' }}>
        {storageWarning && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 text-sm text-orange-800">
            Warning: Storage is approaching 4MB limit. Consider removing large documents.
          </div>
        )}

        {/* Core fields */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Core Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldGroup label="Title" required>
              <TextInput value={title} onChange={setTitle} placeholder="Initiative name" required />
            </FieldGroup>
            <FieldGroup label="Owner" required>
              <TextInput value={owner} onChange={setOwner} placeholder="Full name" required />
            </FieldGroup>
            <FieldGroup label="Business Unit">
              <TextInput value={businessUnit} onChange={setBusinessUnit} placeholder="e.g. Finance, HR, IT" />
            </FieldGroup>
            <FieldGroup label="Value Estimate (£M)">
              <input
                type="number"
                value={valueEstimate}
                onChange={e => setValueEstimate(e.target.value)}
                placeholder="e.g. 2.5"
                step="0.1"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FieldGroup>
          </div>
          <FieldGroup label="Description">
            <TextareaInput value={description} onChange={setDescription} placeholder="Brief description of the initiative..." />
          </FieldGroup>
          <FieldGroup label="Tags (comma separated)">
            <TextInput value={tags} onChange={setTags} placeholder="AI, Cost Reduction, Finance" />
          </FieldGroup>
        </div>

        {/* Stage-specific fields */}
        {stageFieldComponents[stage] && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Stage Data: {stage}
            </h3>
            {stageFieldComponents[stage]}
          </div>
        )}

        {/* Document upload */}
        {isEditing && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Documents</h3>
            <DocumentUpload
              documents={pendingDocs}
              onAdd={doc => setPendingDocs(prev => [...prev, doc])}
              onRemove={i => setPendingDocs(prev => prev.filter((_, idx) => idx !== i))}
            />
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            {isEditing ? 'Save Changes' : 'Create Initiative'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
