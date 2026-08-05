// Research connector layer.
//
// A "connector" turns raw source material into ExtractionCandidate rows that
// a human then reviews and approves into the Metrics table (see
// src/store/reducer.js: ADD_CANDIDATES / APPROVE_CANDIDATE). Nothing ever
// lands in the database without that approval step — see ARCHITECTURE.md
// for why the curation gate is a deliberate design choice, not a shortcut.
//
// manualExtract() below is a real, working implementation: it parses text
// the user pastes in from a credible source (an annual report excerpt, a
// research note, a press release) and proposes structured facts with the
// evidence sentence attached for citation. It runs entirely client-side.
//
// This environment has no live internet access or LLM/search API
// credentials wired in, so there is no WebSearchConnector making live
// calls out of the box. `describeWebConnectorSetup()` documents exactly
// what to add to turn this into an automated fetch-the-web pipeline.

const MONEY_RE = /\$?\s?([\d][\d,]*(?:\.\d+)?)\s*(billion|bn|million|mn|m)\b/i
const PERCENT_RE = /([\d]+(?:\.\d+)?)\s?%/
const YEAR_RE = /\b(?:FY\s*)?(20\d{2})\b/i

const METRIC_PATTERNS = [
  { metricType: 'ebitMargin', keyword: /\b(ebit margin|operating margin)\b/i, unitKind: 'percent' },
  { metricType: 'marketShare', keyword: /\bmarket share\b/i, unitKind: 'percent' },
  { metricType: 'capitalEmployed', keyword: /\b(capital employed|invested capital)\b/i, unitKind: 'currency' },
  { metricType: 'revenue', keyword: /\b(revenue|net sales|group revenue|total revenue)\b/i, unitKind: 'currency' },
  { metricType: 'ebit', keyword: /\b(ebit|operating profit|operating income)\b(?!\s+margin)/i, unitKind: 'currency' },
]

function splitSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z(])/)
    .map(s => s.trim())
    .filter(Boolean)
}

function toMillions(amount, unit) {
  const n = parseFloat(amount.replace(/,/g, ''))
  if (/^b|billion|bn$/i.test(unit)) return n * 1000
  return n
}

function findCompanyId(sentence, companies) {
  const hit = companies.find(c => c.name && sentence.toLowerCase().includes(c.name.toLowerCase()))
  return hit ? hit.id : null
}

/**
 * Parse pasted source text into ExtractionCandidate drafts.
 * @param {string} text
 * @param {{sourceId: string, companies: Array, stages: Array}} ctx
 * @returns {Array} candidate drafts (missing `id`/`status`, added by the caller)
 */
export function manualExtract(text, { sourceId, companies }) {
  if (!text || !text.trim()) return []
  const sentences = splitSentences(text)
  const candidates = []

  for (const sentence of sentences) {
    const yearMatch = sentence.match(YEAR_RE)
    const period = yearMatch ? parseInt(yearMatch[1], 10) : null
    const companyId = findCompanyId(sentence, companies)

    for (const pattern of METRIC_PATTERNS) {
      const keywordMatch = sentence.match(pattern.keyword)
      if (!keywordMatch) continue
      // A number is looked for right after the keyword first ("revenue of $X"),
      // falling back to just before it ("$X in revenue") — never anywhere in the
      // sentence, or two metrics named in one sentence would both grab whichever
      // number happens to appear first.
      const keywordEnd = keywordMatch.index + keywordMatch[0].length
      const forward = sentence.slice(keywordEnd, Math.min(sentence.length, keywordEnd + 60))
      const backward = sentence.slice(Math.max(0, keywordMatch.index - 40), keywordMatch.index)
      const numberRe = pattern.unitKind === 'percent' ? PERCENT_RE : MONEY_RE
      const match = forward.match(numberRe) || backward.match(numberRe)
      if (!match) continue
      const value = pattern.unitKind === 'percent' ? parseFloat(match[1]) : toMillions(match[1], match[2])
      candidates.push({
        sourceId,
        metricType: pattern.metricType,
        value,
        companyId,
        stageId: null,
        period,
        evidenceText: sentence,
        status: 'pending',
        confidence: companyId && period ? 'medium' : 'low',
      })
    }
  }
  return candidates
}

export function describeWebConnectorSetup() {
  return [
    'To automate discovery instead of pasting excerpts by hand, wire up a WebResearchConnector with three steps:',
    '1. search(query) — call a web search API (e.g. Bing Web Search, SerpAPI, Brave Search) scoped to credible domains (10-K/annual-report filings, IBISWorld/Gartner/Bloomberg, regulator sites, reputable business press).',
    '2. fetch(url) — retrieve and clean the page/document (readability extraction; PDF text extraction for filings).',
    '3. extract(content) — replace or augment manualExtract() with an LLM extraction call (e.g. Claude) prompted to return structured {metricType, value, companyId, period, evidenceText} JSON, still landing in the same ExtractionCandidate review queue.',
    'Keep the human approval gate regardless of source — automated extraction should raise the volume of candidates for review, not bypass review.',
  ]
}
