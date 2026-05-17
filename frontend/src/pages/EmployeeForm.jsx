import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save } from 'lucide-react'
import api from '../api/api.js'
import PageHeader from '../shared/PageHeader.jsx'
import Message from '../shared/Message.jsx'
import MotionPage from '../shared/MotionPage.jsx'
import Button from '../shared/Button.jsx'

const empty = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  position: '',
  salary: 0,
  hireDate: '',
  status: 'ACTIF',
  departmentId: ''
}

export default function EmployeeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [departments, setDepartments] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/departments').then((res) => setDepartments(res.data))
    if (id) {
      api.get(`/employees/${id}`).then(({ data }) => setForm({
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        email: data.email ?? '',
        phone: data.phone ?? '',
        address: data.address ?? '',
        position: data.position ?? '',
        salary: data.salary ?? 0,
        hireDate: data.hireDate ?? '',
        status: data.status ?? 'ACTIF',
        departmentId: data.department?.id ?? ''
      }))
    }
  }, [id])

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    try {
      const payload = { ...form, salary: Number(form.salary), departmentId: form.departmentId ? Number(form.departmentId) : null }
      if (id) await api.put(`/employees/${id}`, payload)
      else await api.post('/employees', payload)
      navigate('/employees')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Erreur lors de l enregistrement.')
    }
  }

  return (
    <MotionPage>
      <PageHeader title={id ? 'Modifier employe' : 'Ajouter employe'} />
      <form onSubmit={submit} className="card grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Message type="error">{error}</Message>
        </div>
        {['firstName', 'lastName', 'email', 'phone', 'position', 'salary', 'hireDate', 'address'].map((name) => (
          <div key={name}>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">{labels[name]}</label>
            <input className="input" name={name} type={name === 'hireDate' ? 'date' : name === 'salary' ? 'number' : 'text'} value={form[name]} onChange={change} required={required.includes(name)} />
          </div>
        ))}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">Statut</label>
          <select className="input" name="status" value={form.status} onChange={change}>
            <option>ACTIF</option>
            <option>INACTIF</option>
            <option>SUSPENDU</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">Departement</label>
          <select className="input" name="departmentId" value={form.departmentId} onChange={change}>
            <option value="">Aucun</option>
            {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <Button><Save size={18} /> Enregistrer</Button>
        </div>
      </form>
    </MotionPage>
  )
}

const labels = {
  firstName: 'Prenom',
  lastName: 'Nom',
  email: 'Email',
  phone: 'Telephone',
  address: 'Adresse',
  position: 'Poste',
  salary: 'Salaire',
  hireDate: 'Date embauche'
}

const required = ['firstName', 'lastName', 'email', 'position', 'salary', 'hireDate']
