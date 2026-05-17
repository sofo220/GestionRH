import { useEffect, useState } from 'react'
import { Plus, UserPlus, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import api from '../api/api.js'
import PageHeader from '../shared/PageHeader.jsx'
import MotionPage from '../shared/MotionPage.jsx'
import DataTable from '../shared/DataTable.jsx'
import Button from '../shared/Button.jsx'
import Message from '../shared/Message.jsx'

export default function Users() {
  const [users, setUsers] = useState([])
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    type: 'USER'
  })

  async function load() {
    const { data } = await api.get('/users')
    setUsers(data)
  }

  useEffect(() => {
    load()
  }, [])

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    try {
      await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.type === 'ADMIN' ? 'ADMIN' : 'EMPLOYE'
      })
      setMessage(form.type === 'ADMIN'
        ? 'Administrateur cree avec succes.'
        : 'Utilisateur stagiaire cree avec acces lecture seule.')
      setForm({ name: '', email: '', password: '', type: 'USER' })
      setOpen(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Impossible de creer cet utilisateur.')
    }
  }

  return (
    <MotionPage>
      <PageHeader
        title="Utilisateurs"
        subtitle="Comptes, roles et acces"
        action={<Button onClick={() => setOpen(true)}><Plus size={18} /> Ajouter utilisateur</Button>}
      />
      <Message>{message}</Message>
      <Message type="error">{error}</Message>
      <DataTable
        rows={users}
        columns={[
          { key: 'name', label: 'Nom', render: (u) => <span className="font-semibold text-slate-950">{u.name}</span> },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role', render: (u) => <RoleBadge role={u.role?.name} /> },
          { key: 'access', label: 'Acces', render: (u) => u.role?.name === 'ADMIN' ? 'Gestion complete' : 'Lecture seule stagiaire' }
        ]}
      />
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.form
              onSubmit={submit}
              initial={{ scale: 0.96, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 20 }}
              className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-soft"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-950">Nouveau utilisateur</h3>
                    <p className="text-sm text-slate-500">Choisir admin ou user stagiaire.</p>
                  </div>
                </div>
                <button type="button" className="rounded-xl p-2 hover:bg-slate-100" onClick={() => setOpen(false)}><X size={20} /></button>
              </div>
              <div className="grid gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nom complet</label>
                  <input className="input" name="name" value={form.name} onChange={change} placeholder="Ex: Stagiaire RH" required />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
                  <input className="input" name="email" type="email" value={form.email} onChange={change} placeholder="user@gestionrh.com" required />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Mot de passe</label>
                  <input className="input" name="password" type="password" value={form.password} onChange={change} placeholder="Mot de passe" required minLength={6} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Type de compte</label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <RoleOption
                      active={form.type === 'USER'}
                      title="User stagiaire"
                      text="Lecture seule : dashboard et situation des employes."
                      onClick={() => setForm({ ...form, type: 'USER' })}
                    />
                    <RoleOption
                      active={form.type === 'ADMIN'}
                      title="Admin"
                      text="Comme admin@gestionrh.com : gestion complete."
                      onClick={() => setForm({ ...form, type: 'ADMIN' })}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                <Button type="submit"><UserPlus size={18} /> Creer</Button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionPage>
  )
}

function RoleBadge({ role }) {
  const label = role === 'EMPLOYE' ? 'USER' : role
  const styles = role === 'ADMIN'
    ? 'bg-brand-50 text-brand-600'
    : 'bg-cyan-50 text-cyan-700'
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles}`}>{label}</span>
}

function RoleOption({ active, title, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active ? 'border-brand-500 bg-brand-50 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'
      }`}
    >
      <span className="block font-bold text-slate-950">{title}</span>
      <span className="mt-1 block text-sm text-slate-500">{text}</span>
    </button>
  )
}
