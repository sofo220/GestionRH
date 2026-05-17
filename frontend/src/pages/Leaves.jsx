import { useEffect, useState } from 'react'
import { CheckCircle2, Send, XCircle } from 'lucide-react'
import api from '../api/api.js'
import PageHeader from '../shared/PageHeader.jsx'
import MotionPage from '../shared/MotionPage.jsx'
import DataTable from '../shared/DataTable.jsx'
import Button from '../shared/Button.jsx'
import { getUser } from '../auth/auth.js'

export default function Leaves() {
  const [leaves, setLeaves] = useState([])
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({ type: 'Annuel', startDate: '', endDate: '', reason: '', employeeId: '' })
  const user = getUser()
  const canManage = ['ADMIN', 'RH'].includes(user?.role)

  async function load() {
    const [leavesRes, employeesRes] = await Promise.all([api.get('/leaves'), api.get('/employees')])
    setLeaves(leavesRes.data)
    setEmployees(employeesRes.data)
  }

  useEffect(() => {
    load()
  }, [])

  async function submit(event) {
    event.preventDefault()
    await api.post('/leaves', { ...form, employeeId: Number(form.employeeId) })
    setForm({ type: 'Annuel', startDate: '', endDate: '', reason: '', employeeId: '' })
    load()
  }

  async function status(id, action) {
    await api.put(`/leaves/${id}/${action}`)
    load()
  }

  return (
    <MotionPage>
      <PageHeader title="Conges" subtitle="Demandes et validation" />
      {canManage && <form onSubmit={submit} className="card mb-4 grid gap-3 md:grid-cols-5">
        <input className="input" placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required />
        <input className="input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
        <input className="input" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
        <select className="input" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required>
          <option value="">Employe</option>
          {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.firstName} {employee.lastName}</option>)}
        </select>
        <Button><Send size={18} /> Demander</Button>
        <input className="input md:col-span-5" placeholder="Motif" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
      </form>}
      <DataTable
        rows={leaves}
        columns={[
          { key: 'employee', label: 'Employe', render: (l) => `${l.employee?.firstName ?? ''} ${l.employee?.lastName ?? ''}` },
          { key: 'type', label: 'Type' },
          { key: 'dates', label: 'Dates', render: (l) => `${l.startDate} au ${l.endDate}` },
          { key: 'days', label: 'Jours' },
          { key: 'status', label: 'Statut', render: (l) => <StatusBadge status={l.status} /> }
        ]}
        actions={canManage ? ((leave) => (
          <div className="flex gap-2">
            <Button variant="success" className="px-3" onClick={() => status(leave.id, 'approve')}><CheckCircle2 size={16} /></Button>
            <Button variant="danger" className="px-3" onClick={() => status(leave.id, 'reject')}><XCircle size={16} /></Button>
          </div>
        )) : null}
      />
    </MotionPage>
  )
}

function StatusBadge({ status }) {
  const styles = {
    EN_ATTENTE: 'bg-amber-50 text-amber-700',
    ACCEPTE: 'bg-emerald-50 text-emerald-700',
    REFUSE: 'bg-rose-50 text-rose-700'
  }
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}>{status}</span>
}
