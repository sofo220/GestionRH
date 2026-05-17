import { useEffect, useState } from 'react'
import { Download, ReceiptText } from 'lucide-react'
import api from '../api/api.js'
import PageHeader from '../shared/PageHeader.jsx'
import MotionPage from '../shared/MotionPage.jsx'
import DataTable from '../shared/DataTable.jsx'
import Button from '../shared/Button.jsx'
import { getUser } from '../auth/auth.js'

export default function Payrolls() {
  const [payrolls, setPayrolls] = useState([])
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({ employeeId: '', bonuses: 0, deductions: 0, paymentDate: '' })
  const user = getUser()
  const canManage = ['ADMIN', 'RH'].includes(user?.role)

  async function load() {
    const [payrollRes, employeeRes] = await Promise.all([api.get('/payrolls'), api.get('/employees')])
    setPayrolls(payrollRes.data)
    setEmployees(employeeRes.data)
  }

  useEffect(() => {
    load()
  }, [])

  async function submit(event) {
    event.preventDefault()
    await api.post('/payrolls/generate', {
      employeeId: Number(form.employeeId),
      bonuses: Number(form.bonuses),
      deductions: Number(form.deductions),
      paymentDate: form.paymentDate
    })
    setForm({ employeeId: '', bonuses: 0, deductions: 0, paymentDate: '' })
    load()
  }

  async function pdf(id) {
    const { data } = await api.get(`/payrolls/${id}/pdf`, { responseType: 'blob' })
    const url = URL.createObjectURL(data)
    window.open(url, '_blank')
  }

  return (
    <MotionPage>
      <PageHeader title="Paie" subtitle="Generation et historique des paiements" />
      {canManage && <form onSubmit={submit} className="card mb-4 grid gap-3 md:grid-cols-5">
        <select className="input" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required>
          <option value="">Employe</option>
          {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.firstName} {employee.lastName}</option>)}
        </select>
        <input className="input" type="number" placeholder="Primes" value={form.bonuses} onChange={(e) => setForm({ ...form, bonuses: e.target.value })} />
        <input className="input" type="number" placeholder="Retenues" value={form.deductions} onChange={(e) => setForm({ ...form, deductions: e.target.value })} />
        <input className="input" type="date" value={form.paymentDate} onChange={(e) => setForm({ ...form, paymentDate: e.target.value })} required />
        <Button><ReceiptText size={18} /> Generer</Button>
      </form>}
      <DataTable
        rows={payrolls}
        columns={[
          { key: 'employee', label: 'Employe', render: (p) => `${p.employee?.firstName ?? ''} ${p.employee?.lastName ?? ''}` },
          { key: 'baseSalary', label: 'Base' },
          { key: 'bonuses', label: 'Primes' },
          { key: 'deductions', label: 'Retenues' },
          { key: 'netSalary', label: 'Net', render: (p) => <span className="font-bold text-brand-600">{p.netSalary} MAD</span> },
          { key: 'paymentDate', label: 'Date' }
        ]}
        actions={(payroll) => <Button variant="outline" onClick={() => pdf(payroll.id)}><Download size={16} /> PDF</Button>}
      />
    </MotionPage>
  )
}
