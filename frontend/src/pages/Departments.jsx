import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import api from '../api/api.js'
import PageHeader from '../shared/PageHeader.jsx'
import MotionPage from '../shared/MotionPage.jsx'
import DataTable from '../shared/DataTable.jsx'
import Button from '../shared/Button.jsx'
import { getUser } from '../auth/auth.js'

export default function Departments() {
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [editing, setEditing] = useState(null)
  const user = getUser()
  const canManage = ['ADMIN', 'RH'].includes(user?.role)

  async function load() {
    const { data } = await api.get('/departments')
    setDepartments(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function submit(event) {
    event.preventDefault()
    if (editing) await api.put(`/departments/${editing}`, form)
    else await api.post('/departments', form)
    setForm({ name: '', description: '' })
    setEditing(null)
    load()
  }

  async function remove(id) {
    if (confirm('Supprimer ce departement ?')) {
      await api.delete(`/departments/${id}`)
      load()
    }
  }

  return (
    <MotionPage>
      <PageHeader title="Departements" subtitle="Organisation des equipes" />
      {canManage && <form onSubmit={submit} className="card mb-4 grid gap-3 md:grid-cols-[1fr_2fr_auto]">
        <input className="input" placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Button><Plus size={18} /> {editing ? 'Modifier' : 'Ajouter'}</Button>
      </form>}
      <DataTable
        rows={departments}
        columns={[
          { key: 'name', label: 'Nom', render: (d) => <span className="font-semibold text-slate-950">{d.name}</span> },
          { key: 'description', label: 'Description' }
        ]}
        actions={canManage ? ((department) => (
          <div className="flex gap-2">
            <Button variant="outline" className="px-3" onClick={() => { setEditing(department.id); setForm({ name: department.name, description: department.description ?? '' }) }}><Pencil size={16} /></Button>
            <Button variant="danger" className="px-3" onClick={() => remove(department.id)}><Trash2 size={16} /></Button>
          </div>
        )) : null}
      />
    </MotionPage>
  )
}
