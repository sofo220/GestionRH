import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import api from '../api/api.js'
import PageHeader from '../shared/PageHeader.jsx'
import MotionPage from '../shared/MotionPage.jsx'
import DataTable from '../shared/DataTable.jsx'
import Button from '../shared/Button.jsx'
import { getUser } from '../auth/auth.js'

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const user = getUser()
  const canManage = ['ADMIN', 'RH'].includes(user?.role)

  async function load() {
    const { data } = await api.get('/employees')
    setEmployees(data)
  }

  async function remove(id) {
    if (confirm('Supprimer cet employe ?')) {
      await api.delete(`/employees/${id}`)
      load()
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <MotionPage>
      <PageHeader
        title="Employes"
        subtitle="Liste, recherche et actions principales"
        action={canManage ? <Link className="btn btn-primary" to="/employees/new"><Plus size={18} /> Ajouter</Link> : null}
      />
      <DataTable
        rows={employees}
        searchPlaceholder="Nom, email, poste ou departement"
        columns={[
          { key: 'name', label: 'Nom', render: (e) => <div><p className="font-semibold text-slate-950">{e.firstName} {e.lastName}</p><p className="text-xs text-slate-500">{e.status}</p></div> },
          { key: 'email', label: 'Email' },
          { key: 'position', label: 'Poste' },
          { key: 'department', label: 'Departement', render: (e) => e.department?.name ?? '-' },
          { key: 'salary', label: 'Salaire', render: (e) => `${e.salary} MAD` }
        ]}
        actions={(employee) => (
          <div className="flex flex-wrap gap-2">
            <Link className="btn btn-secondary px-3" to={`/employees/${employee.id}`}><Eye size={16} /></Link>
            {canManage && <Link className="btn btn-secondary px-3" to={`/employees/${employee.id}/edit`}><Pencil size={16} /></Link>}
            {canManage && <Button variant="danger" className="px-3" onClick={() => remove(employee.id)}><Trash2 size={16} /></Button>}
          </div>
        )}
      />
    </MotionPage>
  )
}
