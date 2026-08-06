import { useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { Field, Input, TextArea, Select } from '../common/FormField'
import { SOURCE_TIERS } from '../../data/constants'

export function AddSourceModal({ onClose, onSave }) {
  const [form, setForm] = useState({ title: '', url: '', publisher: '', publishedDate: '', tier: 'industry_research', excerpt: '', notes: '' })
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave(form)
    onClose()
  }

  return (
    <Modal title="Add research source" onClose={onClose} size="lg">
      <form onSubmit={submit} className="p-6 space-y-4">
        <Field label="Title"><Input required value={form.title} onChange={set('title')} placeholder="e.g. Company FY2024 annual report" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="URL"><Input type="url" value={form.url} onChange={set('url')} placeholder="https://…" /></Field>
          <Field label="Publisher"><Input value={form.publisher} onChange={set('publisher')} placeholder="e.g. Company IR site, IBISWorld" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Published date"><Input type="date" value={form.publishedDate} onChange={set('publishedDate')} /></Field>
          <Field label="Credibility tier" hint="Drives the credibility score used to flag low-confidence data.">
            <Select value={form.tier} onChange={set('tier')}>
              {SOURCE_TIERS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Excerpt" hint="Paste the relevant passage(s) — this is what gets scanned for candidate facts and quoted as evidence for citation.">
          <TextArea rows={6} value={form.excerpt} onChange={set('excerpt')} placeholder="Paste text from the source here…" />
        </Field>
        <Field label="Notes (optional)"><TextArea rows={2} value={form.notes} onChange={set('notes')} /></Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit">Save source</Button>
        </div>
      </form>
    </Modal>
  )
}
