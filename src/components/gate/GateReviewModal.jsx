import { useState } from 'react'
import { useApp } from '../../store/AppContext'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { StageChip } from '../common/StageChip'
import { formatValue, formatDate } from '../../utils/formatters'
import { getStageConfig, getNextStage } from '../../constants/stages'

function HistoryTimeline({ history }) {
  const decisionStyles = {
    approved: { dot: 'bg-emerald-500', label: 'bg-emerald-100 text-emerald-700', text: 'Approved' },
    rejected: { dot: 'bg-red-500', label: 'bg-red-100 text-red-700', text: 'Rejected' },
    needs_info: { dot: 'bg-orange-400', label: 'bg-orange-100 text-orange-700', text: 'Needs Info' },
    null: { dot: 'bg-blue-400', label: 'bg-blue-100 text-blue-700', text: 'Submitted' },
  }

  return (
    <div className="space-y-3">
      {[...history].reverse().map((entry, idx) => {
        const style = decisionStyles[entry.decision] || decisionStyles[null]
        return (
          <div key={entry.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${style.dot}`} />
              {idx < history.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-1" />}
            </div>
            <div className="flex-1 pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {entry.decision && (
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${style.label}`}>
                      {style.text}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {entry.type === 'gate_decision'
                      ? `${entry.fromStage} → ${entry.toStage || 'Rejected'}`
                      : `Submitted at ${entry.toStage}`}
                  </span>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(entry.decidedAt)}</span>
              </div>
              {entry.comment && <p className="text-xs text-gray-700 mt-1">{entry.comment}</p>}
              {entry.actionsRequired && entry.actionsRequired.length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {entry.actionsRequired.map((a, i) => (
                    <li key={i} className="text-xs text-orange-700 flex gap-1">
                      <span>•</span> {a}
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-gray-400 mt-0.5">by {entry.decidedBy}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function StageDataPanel({ stageData, stageId }) {
  if (!stageData || Object.keys(stageData).length === 0) {
    return <p className="text-sm text-gray-400 italic">No stage data recorded.</p>
  }

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
    dataFeasibilityDetail: 'Data Feasibility (Detail)',
    dataReadinessPlan: 'Data Readiness Plan',
    technicalReadiness: 'Technical Readiness',
    orgReadiness: 'Org Readiness',
    deliveryRoadmap: 'Delivery Roadmap',
    phaseBreakdown: 'Phase Breakdown',
    businessCaseNarrative: 'Business Case',
    expertReviewNotes: 'Expert Review Notes',
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

  return (
    <div className="space-y-3">
      {Object.entries(stageData).map(([key, val]) => {
        if (!val || val === '') return null
        const label = fieldLabels[key] || key
        const isDate = key.toLowerCase().includes('date')
        const displayVal = isDate ? formatDate(val) : key === 'realisedValue' ? formatValue(val) : String(val)

        return (
          <div key={key}>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</dt>
            <dd className="text-sm text-gray-800 mt-0.5 whitespace-pre-wrap">{displayVal}</dd>
          </div>
        )
      })}
    </div>
  )
}

export function GateReviewModal({ initiative, onClose }) {
  const { dispatch, role } = useApp()
  const [decision, setDecision] = useState('approved')
  const [comment, setComment] = useState('')
  const [actionsInput, setActionsInput] = useState('')
  const [priorityFocus, setPriorityFocus] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [newValueEstimate, setNewValueEstimate] = useState('')
  const [reviewer, setReviewer] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const cfg = getStageConfig(initiative.stage)
  const nextStage = getNextStage(initiative.stage)
  const currentValue = initiative.valueEstimates[initiative.stage]

  function handleSubmit() {
    if (!comment.trim()) return
    setSubmitting(true)
    const actionsRequired = actionsInput.split('\n').map(a => a.trim()).filter(Boolean)
    const valueNum = newValueEstimate ? parseFloat(newValueEstimate) : null
    dispatch({
      type: 'GATE_DECISION',
      payload: {
        id: initiative.id,
        decision,
        comment,
        actionsRequired,
        priorityFocus,
        rejectionReason,
        reviewer: reviewer || 'Reviewer',
        newValueEstimate: !isNaN(valueNum) && valueNum !== null ? valueNum : null,
      }
    })
    onClose()
  }

  return (
    <Modal onClose={onClose} size="xl" title={`Gate Review: ${initiative.title}`}>
      <div className="flex flex-col lg:flex-row max-h-screen-minus-header overflow-hidden" style={{ maxHeight: '80vh' }}>
        {/* Left panel: Initiative info */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 border-r border-gray-100">
          {/* Summary */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <StageChip stage={initiative.stage} />
              <span className="text-sm text-gray-500">{initiative.businessUnit}</span>
            </div>
            <p className="text-sm text-gray-700">{initiative.description}</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Owner</p>
                <p className="text-sm font-medium text-gray-900">{initiative.owner}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Current Value Estimate</p>
                <p className="text-sm font-bold text-blue-700">{formatValue(currentValue)}</p>
              </div>
            </div>
          </div>

          {/* Stage data */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Stage Data: {cfg.label}
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <StageDataPanel
                stageData={initiative.stageData?.[initiative.stage]}
                stageId={initiative.stage}
              />
            </div>
          </div>

          {/* Value progression */}
          {Object.keys(initiative.valueEstimates).length > 1 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Value Progression</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(initiative.valueEstimates).map(([stage, val]) => {
                  const stageCfg = getStageConfig(stage)
                  return (
                    <div key={stage} className={`text-xs px-2 py-1 rounded ${stageCfg.bgClass} ${stageCfg.textClass}`}>
                      {stage}: <span className="font-bold">{formatValue(val)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Documents */}
          {initiative.documents && initiative.documents.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Documents</h3>
              <div className="space-y-1">
                {initiative.documents.map(doc => (
                  <div key={doc.id} className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {doc.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">History</h3>
            <HistoryTimeline history={initiative.history} />
          </div>
        </div>

        {/* Right panel: Review decision */}
        <div className="w-full lg:w-96 overflow-y-auto p-6 space-y-5 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-900">Gate Decision</h3>

          {nextStage && (
            <p className="text-xs text-gray-500">
              Advancing from <span className="font-medium">{initiative.stage}</span> to <span className="font-medium">{nextStage}</span>
            </p>
          )}

          {/* Reviewer name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Reviewer Name</label>
            <input
              type="text"
              value={reviewer}
              onChange={e => setReviewer(e.target.value)}
              placeholder="Your name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Decision */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Decision</label>
            <div className="space-y-2">
              {[
                { value: 'approved', label: nextStage ? `Approve – Advance to ${nextStage}` : 'Approve – Bank Value', color: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
                { value: 'needs_info', label: 'Request More Information', color: 'border-orange-400 bg-orange-50 text-orange-700' },
                { value: 'rejected', label: 'Reject Initiative', color: 'border-red-500 bg-red-50 text-red-700' },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="decision"
                    value={opt.value}
                    checked={decision === opt.value}
                    onChange={() => setDecision(opt.value)}
                    className="text-blue-600"
                  />
                  <span className={`text-sm font-medium px-2 py-0.5 rounded border ${opt.color}`}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Decision Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
              placeholder="Provide rationale for your decision..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Conditional fields */}
          {decision === 'approved' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Priority Focus for Next Stage</label>
                <input
                  type="text"
                  value={priorityFocus}
                  onChange={e => setPriorityFocus(e.target.value)}
                  placeholder="e.g. Validate data pipeline before G3 gate"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Revised Value Estimate (£M) — optional
                </label>
                <input
                  type="number"
                  value={newValueEstimate}
                  onChange={e => setNewValueEstimate(e.target.value)}
                  placeholder={currentValue ? String(currentValue) : '0.0'}
                  step="0.1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {(decision === 'needs_info' || decision === 'rejected') && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {decision === 'rejected' ? 'Rejection Reason' : 'Actions Required (one per line)'}
              </label>
              {decision === 'rejected' ? (
                <textarea
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  rows={2}
                  placeholder="Why is this initiative being rejected?"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              ) : (
                <textarea
                  value={actionsInput}
                  onChange={e => setActionsInput(e.target.value)}
                  rows={3}
                  placeholder="List each action on a new line..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              )}
            </div>
          )}

          {/* Submit */}
          <div className="pt-2 flex gap-2">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              variant={decision === 'approved' ? 'success' : decision === 'rejected' ? 'danger' : 'primary'}
              onClick={handleSubmit}
              disabled={!comment.trim() || submitting}
              className="flex-1"
            >
              {submitting ? 'Saving...' : decision === 'approved' ? 'Approve' : decision === 'rejected' ? 'Reject' : 'Request Info'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
