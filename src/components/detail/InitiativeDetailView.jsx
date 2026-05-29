import { useApp } from '../../store/AppContext'
import { StageChip } from '../common/StageChip'
import { Button } from '../common/Button'
import { formatValue, formatDate } from '../../utils/formatters'
import { getStageConfig, STAGE_ORDER } from '../../constants/stages'

function HistoryTimeline({ history }) {
  const decisionStyles = {
    approved: { dot: 'bg-emerald-500 ring-emerald-200', label: 'bg-emerald-100 text-emerald-700', text: 'Approved' },
    rejected: { dot: 'bg-red-500 ring-red-200', label: 'bg-red-100 text-red-700', text: 'Rejected' },
    needs_info: { dot: 'bg-orange-400 ring-orange-200', label: 'bg-orange-100 text-orange-700', text: 'Needs Info' },
  }
  const defaultStyle = { dot: 'bg-blue-400 ring-blue-200', label: 'bg-blue-100 text-blue-700', text: 'Submitted' }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {[...history].reverse().map((entry, idx) => {
          const style = decisionStyles[entry.decision] || defaultStyle
          const isLast = idx === history.length - 1
          return (
            <li key={entry.id}>
              <div className="relative pb-8">
                {!isLast && (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white ${style.dot}`}>
                      {entry.decision === 'approved' && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {entry.decision === 'rejected' && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      {!entry.decision && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {entry.decision && (
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${style.label}`}>
                            {style.text}
                          </span>
                        )}
                        <span className="text-sm text-gray-600">
                          {entry.type === 'gate_decision'
                            ? `Gate: ${entry.fromStage} → ${entry.toStage || 'Rejected'}`
                            : entry.fromStage ? `Resubmission at ${entry.toStage}` : `Created at ${entry.toStage}`}
                        </span>
                      </div>
                      <time className="text-xs text-gray-400 flex-shrink-0">{formatDate(entry.decidedAt)}</time>
                    </div>
                    {entry.comment && (
                      <p className="mt-0.5 text-sm text-gray-700">{entry.comment}</p>
                    )}
                    {entry.actionsRequired && entry.actionsRequired.length > 0 && (
                      <div className="mt-1">
                        <p className="text-xs font-medium text-orange-700 mb-0.5">Actions Required:</p>
                        <ul className="space-y-0.5">
                          {entry.actionsRequired.map((a, i) => (
                            <li key={i} className="text-xs text-orange-700 flex gap-1">
                              <span>•</span> {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {entry.priorityFocus && (
                      <p className="mt-0.5 text-xs text-blue-700">Priority: {entry.priorityFocus}</p>
                    )}
                    <p className="mt-0.5 text-xs text-gray-400">by {entry.decidedBy}</p>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function ValueProgressBar({ initiative }) {
  const { meta } = useApp().state
  const estimates = initiative.valueEstimates

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Value Estimates by Stage</h2>
      <div className="flex flex-wrap gap-2">
        {STAGE_ORDER.map(stageId => {
          const val = estimates[stageId]
          if (val == null) return null
          const cfg = getStageConfig(stageId)
          const isCurrent = stageId === initiative.stage
          return (
            <div
              key={stageId}
              className={`flex flex-col items-center p-3 rounded-lg border-2 ${cfg.bgClass} ${isCurrent ? cfg.borderClass : 'border-transparent'}`}
            >
              <span className={`text-xs font-semibold ${cfg.textClass}`}>{stageId}</span>
              <span className={`text-lg font-bold ${cfg.textClass} mt-1`}>{formatValue(val)}</span>
              {isCurrent && <span className="text-xs text-gray-500 mt-0.5">Current</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StageDataSection({ initiative }) {
  const stage = initiative.stage
  const data = initiative.stageData?.[stage]

  const fieldLabels = {
    problemStatement: 'Problem Statement',
    hypothesis: 'Hypothesis',
    sponsor: 'Sponsor',
    dataAvailable: 'Data Available',
    businessProblem: 'Business Problem',
    workflow: 'Current Workflow',
    tshirtCostSize: 'T-shirt Cost Size',
    tshirtValueSize: 'T-shirt Value Size',
    technicalFeasibility: 'Technical Feasibility',
    dataFeasibility: 'Data Feasibility',
    peopleImpact: 'People Impact',
    riskAssessment: 'Risk Assessment',
    mvpScope: 'MVP Scope',
    userStrategy: 'User Strategy',
    dataFeasibilityDetail: 'Data Feasibility Detail',
    dataReadinessPlan: 'Data Readiness Plan',
    technicalReadiness: 'Technical Readiness',
    orgReadiness: 'Org Readiness',
    deliveryRoadmap: 'Delivery Roadmap',
    phaseBreakdown: 'Phase Breakdown',
    businessCaseNarrative: 'Business Case',
    expertReviewNotes: 'Expert Reviews',
    dataSourced: 'Data Sourced',
    platformAccess: 'Platform Access',
    mvpDescription: 'MVP Description',
    okrs: 'OKRs',
    measurementFramework: 'Measurement Framework',
    modelMonitoringStrategy: 'Model Monitoring',
    userTestingFeedback: 'User Testing Feedback',
    valueProofPoints: 'Value Proof Points',
    apiDocumentation: 'API Documentation',
    qualityControls: 'Quality Controls',
    ipProtection: 'IP Protection',
    disasterRecoveryPlan: 'Disaster Recovery',
    orgModel: 'Org Model',
    changeDeliveryStrategy: 'Change Delivery Strategy',
    adoptionMetrics: 'Adoption Metrics',
    valueCreationMilestones: 'Value Creation Milestones',
    governanceSetup: 'Governance Setup',
    financeEvidence: 'Finance Evidence',
    threeMonthData: '3-Month Data',
    signOffDate: 'Sign-off Date',
    signOffBy: 'Signed Off By',
    actualVsForecast: 'Actual vs Forecast',
    lessonsLearned: 'Lessons Learned',
    realisedDate: 'Realised Date',
    realisedValue: 'Realised Value',
    notes: 'Notes',
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-2">Stage Data: {stage}</h2>
        <p className="text-sm text-gray-400 italic">No data recorded for this stage yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Stage Data: {stage}</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {Object.entries(data).map(([key, val]) => {
          if (!val && val !== 0) return null
          const label = fieldLabels[key] || key
          const isDate = key.toLowerCase().includes('date')
          const displayVal = isDate ? formatDate(val) : key === 'realisedValue' ? formatValue(val) : String(val)
          return (
            <div key={key} className={key === 'businessCaseNarrative' || key === 'lessonsLearned' ? 'sm:col-span-2' : ''}>
              <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</dt>
              <dd className="text-sm text-gray-800 mt-0.5 whitespace-pre-wrap">{displayVal}</dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}

function DocumentsPanel({ initiative }) {
  const { dispatch } = useApp()
  const docs = initiative.documents || []

  function handleRemove(docId) {
    dispatch({ type: 'REMOVE_DOCUMENT', payload: { initiativeId: initiative.id, documentId: docId } })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-3">Documents</h2>
      {docs.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No documents attached.</p>
      ) : (
        <div className="space-y-2">
          {docs.map(doc => (
            <div key={doc.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 min-w-0">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="min-w-0">
                  <p className="text-sm text-gray-700 truncate">{doc.name}</p>
                  <p className="text-xs text-gray-400">{formatDate(doc.uploadedAt)}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(doc.id)}
                className="text-red-400 hover:text-red-600 text-xs ml-3 flex-shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function InitiativeDetailView() {
  const { selectedInitiative, navigate, openForm, openGateReview, role, dispatch } = useApp()

  if (!selectedInitiative) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No initiative selected.</p>
        <Button onClick={() => navigate('pipeline')} variant="secondary" className="mt-4">
          Back to Pipeline
        </Button>
      </div>
    )
  }

  const initiative = selectedInitiative
  const cfg = getStageConfig(initiative.stage)
  const isPendingReview = initiative.status === 'pending_review'
  const currentValue = initiative.valueEstimates[initiative.stage]

  function handleSubmitForReview() {
    dispatch({
      type: 'SUBMIT_FOR_GATE',
      payload: { id: initiative.id, submittedBy: initiative.owner, comment: `Submitted for gate review at ${initiative.stage}.` }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => navigate('pipeline')}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Pipeline
              </button>
              <span className="text-gray-300">/</span>
              <span className="text-xs text-gray-500">{initiative.title}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <StageChip stage={initiative.stage} size="md" />
              {isPendingReview && (
                <span className="text-xs bg-orange-100 text-orange-700 border border-orange-200 rounded-full px-2 py-0.5 font-medium">
                  Pending Review
                </span>
              )}
              {initiative.tags?.map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">{tag}</span>
              ))}
            </div>
            <h1 className="text-xl font-bold text-gray-900">{initiative.title}</h1>
            <p className="text-sm text-gray-600 mt-1">{initiative.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-500">Owner</p>
                <p className="text-sm font-medium text-gray-900">{initiative.owner}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Business Unit</p>
                <p className="text-sm font-medium text-gray-900">{initiative.businessUnit || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Value Estimate</p>
                <p className={`text-sm font-bold ${cfg.textClass}`}>{formatValue(currentValue)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="text-sm text-gray-700">{formatDate(initiative.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            {role === 'owner' && !isPendingReview && initiative.stage !== 'Rejected' && initiative.stage !== 'Banked' && (
              <>
                <Button onClick={() => openForm(initiative.id)} variant="secondary" size="sm">
                  Edit
                </Button>
                <Button onClick={handleSubmitForReview} size="sm">
                  Submit for Review
                </Button>
              </>
            )}
            {role === 'reviewer' && (isPendingReview || true) && initiative.stage !== 'Rejected' && initiative.stage !== 'Banked' && (
              <Button
                onClick={() => openGateReview(initiative.id)}
                variant="success"
                size="sm"
              >
                Gate Review
              </Button>
            )}
          </div>
        </div>

        {/* Prominent review CTA for reviewer when pending */}
        {role === 'reviewer' && isPendingReview && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-800">This initiative is awaiting gate review</p>
              <p className="text-xs text-orange-700 mt-0.5">Review the stage data and make a decision to advance, request more info, or reject.</p>
            </div>
            <Button onClick={() => openGateReview(initiative.id)} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white ml-4 flex-shrink-0">
              Start Review
            </Button>
          </div>
        )}
      </div>

      {/* Value progress */}
      <ValueProgressBar initiative={initiative} />

      {/* Stage data */}
      <StageDataSection initiative={initiative} />

      {/* History + Documents side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">History & Audit Trail</h2>
          <HistoryTimeline history={initiative.history} />
        </div>
        <DocumentsPanel initiative={initiative} />
      </div>
    </div>
  )
}
