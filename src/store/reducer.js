import { generateId } from '../utils/uuid'
import { getNextStage } from '../constants/stages'

export function reducer(state, action) {
  switch (action.type) {
    case 'INIT_FROM_STORAGE':
      return action.payload

    case 'SET_TARGET_VALUE':
      return { ...state, meta: { ...state.meta, targetValue: action.payload, lastUpdated: new Date().toISOString() } }

    case 'SET_COMMENTARY':
      return { ...state, meta: { ...state.meta, commentary: action.payload, lastUpdated: new Date().toISOString() } }

    case 'CREATE_INITIATIVE': {
      const now = new Date().toISOString()
      const newInitiative = {
        id: generateId(),
        title: action.payload.title,
        owner: action.payload.owner,
        businessUnit: action.payload.businessUnit || '',
        description: action.payload.description || '',
        stage: 'G0',
        createdAt: now,
        updatedAt: now,
        valueEstimates: { G0: action.payload.valueEstimate || null },
        stageData: { G0: action.payload.stageData || {} },
        history: [{
          id: generateId(),
          type: 'stage_submission',
          fromStage: null,
          toStage: 'G0',
          decision: null,
          comment: 'Initiative created and logged.',
          actionsRequired: [],
          decidedBy: action.payload.owner,
          decidedAt: now
        }],
        documents: [],
        tags: action.payload.tags || []
      }
      return { ...state, initiatives: [...state.initiatives, newInitiative], meta: { ...state.meta, lastUpdated: now } }
    }

    case 'UPDATE_STAGE_DATA': {
      const now = new Date().toISOString()
      return {
        ...state,
        initiatives: state.initiatives.map(init =>
          init.id !== action.payload.id ? init : {
            ...init,
            stageData: { ...init.stageData, [init.stage]: action.payload.stageData },
            valueEstimates: { ...init.valueEstimates, [init.stage]: action.payload.valueEstimate ?? init.valueEstimates[init.stage] },
            updatedAt: now
          }
        ),
        meta: { ...state.meta, lastUpdated: now }
      }
    }

    case 'SUBMIT_FOR_GATE': {
      const now = new Date().toISOString()
      return {
        ...state,
        initiatives: state.initiatives.map(init =>
          init.id !== action.payload.id ? init : {
            ...init,
            status: 'pending_review',
            updatedAt: now,
            history: [...init.history, {
              id: generateId(),
              type: 'stage_submission',
              fromStage: init.stage,
              toStage: init.stage,
              decision: null,
              comment: action.payload.comment || `Submitted for gate review at ${init.stage}.`,
              actionsRequired: [],
              decidedBy: action.payload.submittedBy || 'Owner',
              decidedAt: now
            }]
          }
        )
      }
    }

    case 'GATE_DECISION': {
      const now = new Date().toISOString()
      const { id, decision, comment, actionsRequired, priorityFocus, rejectionReason, reviewer, newValueEstimate } = action.payload
      return {
        ...state,
        initiatives: state.initiatives.map(init => {
          if (init.id !== id) return init
          const nextStage = decision === 'approved' ? getNextStage(init.stage) : null
          const newStage = decision === 'approved' ? (nextStage || init.stage) : decision === 'rejected' ? 'Rejected' : init.stage
          const historyEntry = {
            id: generateId(),
            type: 'gate_decision',
            fromStage: init.stage,
            toStage: newStage,
            decision,
            comment: comment || '',
            actionsRequired: actionsRequired || [],
            priorityFocus: priorityFocus || '',
            rejectionReason: rejectionReason || '',
            decidedBy: reviewer || 'Reviewer',
            decidedAt: now
          }
          const updatedValueEstimates = newValueEstimate != null
            ? { ...init.valueEstimates, [newStage]: newValueEstimate }
            : init.valueEstimates
          return {
            ...init,
            stage: newStage,
            status: decision === 'approved' ? 'active' : decision === 'rejected' ? 'rejected' : 'needs_info',
            updatedAt: now,
            valueEstimates: updatedValueEstimates,
            history: [...init.history, historyEntry]
          }
        }),
        meta: { ...state.meta, lastUpdated: now }
      }
    }

    case 'ADD_DOCUMENT': {
      const now = new Date().toISOString()
      return {
        ...state,
        initiatives: state.initiatives.map(init =>
          init.id !== action.payload.initiativeId ? init : {
            ...init,
            documents: [...init.documents, { ...action.payload.document, id: generateId(), uploadedAt: now }],
            updatedAt: now
          }
        )
      }
    }

    case 'REMOVE_DOCUMENT': {
      const now = new Date().toISOString()
      return {
        ...state,
        initiatives: state.initiatives.map(init =>
          init.id !== action.payload.initiativeId ? init : {
            ...init,
            documents: init.documents.filter(d => d.id !== action.payload.documentId),
            updatedAt: now
          }
        )
      }
    }

    default:
      return state
  }
}
