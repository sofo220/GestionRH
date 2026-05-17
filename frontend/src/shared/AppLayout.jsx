import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, BriefcaseBusiness, Building2, CalendarDays, ChartNoAxesCombined, CheckCircle2, ChevronDown, CreditCard, LayoutDashboard, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Search, Settings, UserRound, UsersRound, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { getUser, logout } from '../auth/auth.js'
import api from '../api/api.js'

const links = [
  ['Dashboard', '/dashboard', LayoutDashboard],
  ['Employes', '/employees', UsersRound],
  ['Departements', '/departments', Building2],
  ['Conges', '/leaves', CalendarDays],
  ['Paie', '/payrolls', CreditCard],
  ['Reporting', '/reports', ChartNoAxesCombined],
  ['Utilisateurs', '/users', BriefcaseBusiness],
  ['Parametres', '/reports', Settings]
]

export default function AppLayout() {
  const navigate = useNavigate()
  const user = getUser()
  const canManage = ['ADMIN', 'RH'].includes(user?.role)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchData, setSearchData] = useState({ employees: [], departments: [], leaves: [] })

  function signOut() {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setSearchData({ employees: [], departments: [], leaves: [] })
        return
      }
      try {
        const [employeesRes, departmentsRes, leavesRes] = await Promise.all([
          api.get('/employees', { params: { search: query } }),
          api.get('/departments'),
          api.get('/leaves')
        ])
        if (!cancelled) {
          const q = query.toLowerCase()
          setSearchData({
            employees: employeesRes.data.slice(0, 5),
            departments: departmentsRes.data.filter((item) => `${item.name} ${item.description ?? ''}`.toLowerCase().includes(q)).slice(0, 4),
            leaves: leavesRes.data.filter((item) => JSON.stringify(item).toLowerCase().includes(q)).slice(0, 4)
          })
        }
      } catch {
        if (!cancelled) setSearchData({ employees: [], departments: [], leaves: [] })
      }
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  const searchResults = useMemo(() => [
    ...searchData.employees.map((employee) => ({
      id: `employee-${employee.id}`,
      title: `${employee.firstName} ${employee.lastName}`,
      subtitle: `${employee.position} · ${employee.department?.name ?? 'Sans departement'}`,
      icon: UsersRound,
      to: `/employees/${employee.id}`
    })),
    ...searchData.departments.map((department) => ({
      id: `department-${department.id}`,
      title: department.name,
      subtitle: department.description || 'Departement',
      icon: Building2,
      to: '/departments'
    })),
    ...searchData.leaves.map((leave) => ({
      id: `leave-${leave.id}`,
      title: `Conge ${leave.type}`,
      subtitle: `${leave.employee?.firstName ?? ''} ${leave.employee?.lastName ?? ''} · ${leave.status}`,
      icon: CalendarDays,
      to: '/leaves'
    }))
  ], [searchData])

  function goToResult(to) {
    setQuery('')
    setSearchOpen(false)
    navigate(to)
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <Sidebar signOut={signOut} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} sidebarOpen={sidebarOpen} canManage={canManage} user={user} />
      <div className={`transition-[padding] duration-300 ease-out ${sidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}>
        <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 px-4 py-3 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              className={`grid h-11 w-11 place-items-center rounded-2xl border shadow-sm transition ${
                sidebarOpen
                  ? 'border-slate-200 bg-white text-slate-600 hover:border-brand-100 hover:bg-brand-50 hover:text-brand-600'
                  : 'border-brand-500 bg-brand-500 text-white shadow-glow hover:bg-brand-600'
              }`}
              onClick={() => {
                if (window.innerWidth < 1024) setMobileOpen(true)
                else setSidebarOpen((value) => !value)
              }}
              aria-label={sidebarOpen ? 'Masquer la sidebar' : 'Afficher la sidebar'}
            >
              <span className="hidden lg:block">
                {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
              </span>
              <span className="lg:hidden"><Menu size={20} /></span>
            </motion.button>
            <div className="relative hidden flex-1 md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className="input max-w-xl !pl-12"
                placeholder="Rechercher un employe, departement, conge..."
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setSearchOpen(true)
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && searchResults[0]) goToResult(searchResults[0].to)
                  if (event.key === 'Escape') setSearchOpen(false)
                }}
              />
              <AnimatePresence>
                {searchOpen && query.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute left-0 top-14 z-50 w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft"
                  >
                    <div className="border-b border-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Resultats de recherche
                    </div>
                    {searchResults.length ? (
                      <div className="max-h-80 overflow-y-auto p-2">
                        {searchResults.map((result) => {
                          const Icon = result.icon
                          return (
                            <button
                              key={result.id}
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-brand-50"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => goToResult(result.to)}
                            >
                              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                                <Icon size={18} />
                              </span>
                              <span>
                                <span className="block text-sm font-semibold text-slate-950">{result.title}</span>
                                <span className="block text-xs text-slate-500">{result.subtitle}</span>
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-sm text-slate-500">Aucun resultat trouve.</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              className="relative ml-auto rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm hover:bg-brand-50"
              onClick={() => {
                setNotificationsOpen((value) => !value)
                setProfileOpen(false)
              }}
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400" />
            </button>
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-28 top-16 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft"
                >
                  <div className="mb-2 flex items-center justify-between px-2">
                    <p className="font-bold text-slate-950">Notifications</p>
                    <span className="rounded-full bg-cyan-50 px-2 py-1 text-xs font-bold text-cyan-600">3 nouvelles</span>
                  </div>
                  <NotificationItem title="Demande de conge" text="Une demande attend validation RH." />
                  <NotificationItem title="Paie mensuelle" text="Generation des fiches disponible." />
                  <NotificationItem title="Profil employe" text="Informations employees synchronisees." />
                </motion.div>
              )}
            </AnimatePresence>
            <button
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm hover:bg-brand-50"
              onClick={() => {
                setProfileOpen((value) => !value)
                setNotificationsOpen(false)
              }}
            >
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 text-sm font-bold text-white">
                {user?.name?.charAt(0) ?? 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-4">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
              <ChevronDown className={`text-slate-400 transition ${profileOpen ? 'rotate-180' : ''}`} size={16} />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-4 top-16 z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft lg:right-8"
                >
                  <div className="bg-gradient-to-br from-brand-500 to-violet-500 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/20 text-sm font-bold">{user?.name?.charAt(0) ?? 'A'}</div>
                      <div>
                        <p className="font-bold">{user?.name}</p>
                        <p className="text-sm text-blue-100">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <DropdownButton icon={UserRound} label="Mon profil" onClick={() => setProfileOpen(false)} />
                    <DropdownButton icon={Settings} label="Parametres" onClick={() => { setProfileOpen(false); navigate('/reports') }} />
                    <DropdownButton icon={LogOut} label="Deconnexion" danger onClick={signOut} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function NotificationItem({ title, text }) {
  return (
    <div className="flex gap-3 rounded-xl px-2 py-3 hover:bg-slate-50">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-50 text-cyan-600">
        <CheckCircle2 size={17} />
      </span>
      <span>
        <span className="block text-sm font-semibold text-slate-950">{title}</span>
        <span className="block text-xs text-slate-500">{text}</span>
      </span>
    </div>
  )
}

function DropdownButton({ icon: Icon, label, onClick, danger = false }) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${
        danger ? 'text-rose-600 hover:bg-rose-50' : 'text-slate-700 hover:bg-brand-50 hover:text-brand-600'
      }`}
      onClick={onClick}
    >
      <Icon size={17} />
      {label}
    </button>
  )
}

function Sidebar({ signOut, mobileOpen, setMobileOpen, sidebarOpen, canManage, user }) {
  const visibleLinks = links.filter(([label]) => {
    if (user?.role === 'ADMIN') return true
    if (canManage) return label !== 'Utilisateurs'
    return label !== 'Utilisateurs'
  })

  const content = (
    <aside className="flex h-full flex-col bg-slate-950 px-4 py-5 text-white">
      <div className="mb-8 flex items-start justify-between">
        <div className="w-full min-w-0 pr-2">
          <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-br from-white via-brand-50 to-cyan-50 p-[1px] shadow-[0_18px_45px_rgba(37,99,235,0.18)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(255,255,255,0.95),transparent_42%),radial-gradient(circle_at_90%_10%,rgba(6,182,212,0.16),transparent_36%)]" />
            <div className="relative rounded-2xl bg-white/88 p-2 backdrop-blur-sm">
              <img
                src="/gestion-rh-dashboard-logo.png"
                alt="Gestion RH"
                className="h-20 w-full rounded-xl object-cover object-center"
              />
            </div>
          </div>
          <p className="mt-3 text-center text-xs font-medium leading-4 text-slate-400">Human Resources Management System</p>
        </div>
        <button className="lg:hidden" onClick={() => setMobileOpen(false)}><X size={22} /></button>
      </div>
      <nav className="space-y-1">
        {visibleLinks.map(([label, to, Icon]) => (
          <NavLink
            key={`${label}-${to}`}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                isActive ? 'bg-white text-brand-600 shadow-lg' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button className="btn mt-auto bg-white/10 text-white hover:bg-white/15" onClick={signOut}>
        <LogOut size={18} />
        Deconnexion
      </button>
    </aside>
  )

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block"
            initial={{ x: -288, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -288, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-slate-950/50" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }} className="absolute inset-y-0 left-0 w-72">
              {content}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
