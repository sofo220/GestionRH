import { useEffect, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Building2, CalendarClock, CreditCard, UserCheck, UsersRound } from 'lucide-react'
import api from '../api/api.js'
import PageHeader from '../shared/PageHeader.jsx'
import MotionPage from '../shared/MotionPage.jsx'
import StatCard from '../shared/StatCard.jsx'
import { SkeletonCard } from '../shared/Loading.jsx'

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/reports/dashboard').then((res) => setData(res.data))
  }, [])

  const leaveData = Object.entries(data?.leavesByStatus ?? {}).map(([name, value]) => ({ name, value }))
  const payrollData = data?.payrollEvolution?.length ? data.payrollEvolution : [
    { date: 'Jan', amount: 21000 },
    { date: 'Fev', amount: 24000 },
    { date: 'Mar', amount: 27000 },
    { date: 'Avr', amount: 31000 },
    { date: 'Mai', amount: 33000 }
  ]
  const growthData = [
    { month: 'Jan', employees: 10 },
    { month: 'Fev', employees: 13 },
    { month: 'Mar', employees: 16 },
    { month: 'Avr', employees: 20 },
    { month: 'Mai', employees: data?.totalEmployees ?? 22 }
  ]

  return (
    <MotionPage>
      <PageHeader title="Dashboard" subtitle="Vue globale des ressources humaines" />
      {!data ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard icon={UsersRound} title="Total employes" value={data.totalEmployees} description="Effectif global" tone="blue" trend="+12%" />
          <StatCard icon={CalendarClock} title="Conges en attente" value={data.pendingLeaves} description="A valider" tone="violet" trend="+4%" />
          <StatCard icon={CreditCard} title="Masse salariale" value={`${data.totalPayroll} MAD`} description="Total mensuel" tone="cyan" trend="+9%" />
          <StatCard icon={Building2} title="Departements" value={data.employeesByDepartment?.length ?? 0} description="Unites actives" tone="emerald" trend="+2%" />
          <StatCard icon={UserCheck} title="Employes actifs" value={data.totalEmployees} description="Contrats actifs" tone="amber" trend="+7%" />
        </div>
      )}
      <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Employes par departement">
          <BarChart data={data?.employeesByDepartment ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#2563EB" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Repartition des conges">
          <PieChart>
            <Pie data={leaveData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={4}>
              {leaveData.map((_, index) => <Cell key={index} fill={['#2563EB', '#7c3aed', '#06b6d4'][index % 3]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <ChartCard title="Evolution de la paie mensuelle">
          <LineChart data={payrollData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ChartCard>
        <ChartCard title="Croissance des employes">
          <AreaChart data={growthData}>
            <defs>
              <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="employees" stroke="#06b6d4" fill="url(#growth)" strokeWidth={3} />
          </AreaChart>
        </ChartCard>
      </div>
    </MotionPage>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-slate-950">{title}</h3>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">Live</span>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
