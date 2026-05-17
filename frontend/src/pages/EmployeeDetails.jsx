import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/api.js'
import PageHeader from '../shared/PageHeader.jsx'
import MotionPage from '../shared/MotionPage.jsx'

export default function EmployeeDetails() {
  const { id } = useParams()
  const [employee, setEmployee] = useState(null)

  useEffect(() => {
    api.get(`/employees/${id}`).then((res) => setEmployee(res.data))
  }, [id])

  if (!employee) return null

  return (
    <MotionPage>
      <PageHeader title={`${employee.firstName} ${employee.lastName}`} subtitle={employee.position} />
      <div className="card grid gap-4 md:grid-cols-2">
        <Info label="Email" value={employee.email} />
        <Info label="Telephone" value={employee.phone} />
        <Info label="Adresse" value={employee.address} />
        <Info label="Salaire" value={employee.salary} />
        <Info label="Date embauche" value={employee.hireDate} />
        <Info label="Statut" value={employee.status} />
        <Info label="Departement" value={employee.department?.name ?? '-'} />
      </div>
    </MotionPage>
  )
}

function Info({ label, value }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-950">{value ?? '-'}</p></div>
}
