// Data model reference (JSDoc typedefs — this is a plain-JS app, so these
// document the shape of records stored in the local repository rather than
// being enforced at runtime). Mirrors the tables a production deployment
// would hold in Postgres (see ARCHITECTURE.md).

/**
 * @typedef {Object} Sector
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} currencyUnit  e.g. "$M"
 * @property {string} createdAt     ISO date
 */

/**
 * @typedef {Object} ValueChainStage
 * @property {string} id
 * @property {string} name
 * @property {number} order          position along the chain, 0-based
 * @property {string} description
 */

/**
 * @typedef {Object} Company
 * @property {string} id
 * @property {string} name
 * @property {string} ticker
 * @property {boolean} isFocal      exactly one company should be focal
 * @property {string} color         hex, assigned automatically for peers
 * @property {string} notes
 */

/**
 * @typedef {Object} Source
 * @property {string} id
 * @property {string} title
 * @property {string} url
 * @property {string} publisher
 * @property {string} publishedDate  ISO date, optional
 * @property {string} tier           see SOURCE_TIERS in constants.js
 * @property {number} credibilityScore  0-100, derived
 * @property {string} excerpt        pasted text used for extraction
 * @property {string} retrievedAt    ISO date
 * @property {string} notes
 */

/**
 * @typedef {Object} ExtractionCandidate
 * @property {string} id
 * @property {string} sourceId
 * @property {string} metricType     see METRIC_TYPES in constants.js
 * @property {number} value
 * @property {string} companyId      nullable — may need human assignment
 * @property {string} stageId        nullable — value-chain-level metrics only
 * @property {number} period         year, nullable — may need human assignment
 * @property {string} evidenceText   the sentence the value was found in
 * @property {string} status         'pending' | 'approved' | 'rejected'
 */

/**
 * @typedef {Object} Metric
 * @property {string} id
 * @property {string} companyId
 * @property {string} stageId        nullable — null means company/sector-level
 * @property {number} period         year
 * @property {string} metricType
 * @property {number} value
 * @property {string} sourceId       nullable for manually-entered estimates
 * @property {string} confidence     'high' | 'medium' | 'low'
 * @property {boolean} isEstimate
 * @property {string} curatedAt      ISO date
 */

export {}
