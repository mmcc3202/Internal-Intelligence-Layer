import { useState } from 'react'
import { useApp } from '../../store/useApp'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { Field, Input, TextArea, Select } from '../common/FormField'
import { EmptyState } from '../common/EmptyState'
import { CURRENCY_UNITS } from '../../data/constants'

export function SetupView() {
  const { state, actions } = useApp()

  return (
    <div className="space-y-6">
      <Card title="Sector definition" subtitle="What industry sector is this profit pool analysis about?">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Field label="Sector name">
              <Input value={state.sector.name} onChange={e => actions.updateSector({ name: e.target.value })} placeholder="e.g. North American Freight Brokerage" />
            </Field>
          </div>
          <Field label="Reporting currency / scale">
            <Select value={state.sector.currencyUnit} onChange={e => actions.updateSector({ currencyUnit: e.target.value })}>
              {CURRENCY_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </Select>
          </Field>
          <div className="md:col-span-3">
            <Field label="Scope notes" hint="Defines the boundary of the analysis — what's in scope, what year range, any exclusions.">
              <TextArea rows={2} value={state.sector.description} onChange={e => actions.updateSector({ description: e.target.value })} />
            </Field>
          </div>
        </div>
      </Card>

      <ValueChainEditor state={state} actions={actions} />
      <CompanyManager state={state} actions={actions} />
    </div>
  )
}

function ValueChainEditor({ state, actions }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    actions.addStage({ name: name.trim(), description: description.trim() })
    setName('')
    setDescription('')
  }

  const sorted = [...state.stages].sort((a, b) => a.order - b.order)

  return (
    <Card title="Value chain" subtitle="The sequential steps profit flows through, from upstream to end customer. This defines the stages used in the value chain profit pool view.">
      {sorted.length === 0 && <EmptyState message="No value chain stages yet" subtext="Add the steps of the chain in order, e.g. Sourcing → Manufacturing → Distribution → Retail." />}
      <ol className="space-y-2 mb-4">
        {sorted.map((stage, i) => (
          <li key={stage.id} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <span className="text-xs font-semibold text-gray-400 w-5 text-center shrink-0">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <Input value={stage.name} onChange={e => actions.updateStage({ id: stage.id, name: e.target.value })} className="border-transparent bg-transparent px-0 py-0 font-medium focus:bg-white focus:border-gray-300 focus:px-2 focus:py-1" />
              <Input value={stage.description} onChange={e => actions.updateStage({ id: stage.id, description: e.target.value })} placeholder="description" className="border-transparent bg-transparent px-0 py-0 text-xs text-gray-500 focus:bg-white focus:border-gray-300 focus:px-2 focus:py-1" />
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => actions.moveStage(stage.id, 'up')} disabled={i === 0} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">↑</button>
              <button onClick={() => actions.moveStage(stage.id, 'down')} disabled={i === sorted.length - 1} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">↓</button>
              <button onClick={() => actions.removeStage(stage.id)} className="p-1 text-gray-400 hover:text-red-600">✕</button>
            </div>
          </li>
        ))}
      </ol>
      <form onSubmit={submit} className="flex gap-2 items-end">
        <div className="flex-1">
          <Field label="New stage name"><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Distribution & Wholesale" /></Field>
        </div>
        <div className="flex-1">
          <Field label="Description (optional)"><Input value={description} onChange={e => setDescription(e.target.value)} /></Field>
        </div>
        <Button type="submit">Add stage</Button>
      </form>
    </Card>
  )
}

function CompanyManager({ state, actions }) {
  const [name, setName] = useState('')
  const [ticker, setTicker] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    actions.addCompany({ name: name.trim(), ticker: ticker.trim() })
    setName('')
    setTicker('')
  }

  return (
    <Card title="Companies & peer set" subtitle="Mark the company you're analyzing as focal — every chart and slide highlights it against the rest of the peer set.">
      {state.companies.length === 0 && <EmptyState message="No companies yet" subtext="Add your focal company first, then its relevant peers." />}
      <ul className="space-y-2 mb-4">
        {state.companies.map(company => (
          <li key={company.id} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: company.color }} />
            <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
              <Input value={company.name} onChange={e => actions.updateCompany({ id: company.id, name: e.target.value })} className="border-transparent bg-transparent px-0 py-0 font-medium focus:bg-white focus:border-gray-300 focus:px-2 focus:py-1" />
              <Input value={company.ticker} onChange={e => actions.updateCompany({ id: company.id, ticker: e.target.value })} placeholder="ticker" className="border-transparent bg-transparent px-0 py-0 text-xs text-gray-500 focus:bg-white focus:border-gray-300 focus:px-2 focus:py-1" />
            </div>
            {company.isFocal ? (
              <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 shrink-0">Focal company</span>
            ) : (
              <button onClick={() => actions.setFocalCompany(company.id)} className="text-xs px-2 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 shrink-0">Make focal</button>
            )}
            <button onClick={() => actions.removeCompany(company.id)} className="p-1 text-gray-400 hover:text-red-600 shrink-0">✕</button>
          </li>
        ))}
      </ul>
      <form onSubmit={submit} className="flex gap-2 items-end">
        <div className="flex-1">
          <Field label="Company name"><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Acme Corp" /></Field>
        </div>
        <div className="w-32">
          <Field label="Ticker (optional)"><Input value={ticker} onChange={e => setTicker(e.target.value)} /></Field>
        </div>
        <Button type="submit">Add company</Button>
      </form>
    </Card>
  )
}
