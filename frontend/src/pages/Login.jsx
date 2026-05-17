import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BriefcaseBusiness, Eye, Lock, Mail, ShieldCheck, UsersRound } from 'lucide-react'
import api from '../api/api.js'
import { saveSession } from '../auth/auth.js'
import Message from '../shared/Message.jsx'
import Button from '../shared/Button.jsx'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@gestionrh.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      saveSession(data)
      navigate('/dashboard')
    } catch (err) {
      if (!err.response) {
        setError('Serveur indisponible. Lancez le backend puis reessayez.')
        return
      }
      setError('Email ou mot de passe incorrect.')
    }
  }

  return (
    <div className="soft-grid min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-slate-950">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="hidden text-white lg:block"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <ShieldCheck size={17} />
            Plateforme RH securisee
          </div>
          <h1 className="mt-8 max-w-xl text-5xl font-bold leading-tight tracking-tight">
            Human Resources Management System
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-blue-100">
            Pilotez vos employes, conges, paies et rapports avec une interface claire, rapide et elegante.
          </p>
          <div className="mt-10 grid max-w-lg grid-cols-2 gap-4">
            <Feature icon={UsersRound} title="Equipe" text="Suivi centralise" />
            <Feature icon={BriefcaseBusiness} title="Operations" text="RH et paie" />
          </div>
        </motion.section>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="glass mx-auto w-full max-w-md rounded-3xl p-7"
        >
          <div className="mx-auto flex justify-center">
            <img
              src="/gestion-rh-logo.png"
              alt="Gestion RH"
              className="h-24 w-full max-w-xs rounded-2xl object-cover object-center shadow-glow"
            />
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">Connectez-vous pour acceder au dashboard RH.</p>
          </div>

          <div className="mt-6">
            <Message type="error">{error}</Message>
            <label className="mb-1.5 block text-sm font-semibold">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input className="input !pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-semibold">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input className="input !px-10" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500" />
              Remember me
            </label>
            <a href="#" className="font-semibold text-brand-600 hover:text-brand-700">Forgot password?</a>
          </div>
          <Button className="mt-6 w-full" type="submit">Login</Button>
        </motion.form>
      </div>
    </div>
  )
}

function Feature({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <Icon className="text-cyan-200" size={24} />
      <p className="mt-4 font-semibold">{title}</p>
      <p className="text-sm text-blue-100">{text}</p>
    </div>
  )
}
