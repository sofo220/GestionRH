import { useEffect, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import api from '../api/api.js'
import PageHeader from '../shared/PageHeader.jsx'
import MotionPage from '../shared/MotionPage.jsx'

export default function Reports() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/reports/dashboard').then((res) => setData(res.data))
  }, [])

  return (
    <MotionPage>
      <PageHeader title="Reporting" subtitle="Indicateurs RH et evolution de la paie" />
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="card xl:col-span-2">
          <h3 className="mb-4 font-bold">Evolution de la paie</h3>
          <Chart>
            <LineChart data={data?.payrollEvolution?.length ? data.payrollEvolution : samplePayroll}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={3} />
            </LineChart>
          </Chart>
        </div>
        <div className="card">
          <h3 className="mb-4 font-bold">Analytics RH</h3>
          <div className="space-y-3">
            <LineItem label="Total employes" value={data?.totalEmployees ?? 0} />
            <LineItem label="Conges en attente" value={data?.pendingLeaves ?? 0} />
            <LineItem label="Masse salariale" value={`${data?.totalPayroll ?? 0} MAD`} />
            <LineItem label="Taux activite" value="96%" />
          </div>
        </div>
        <div className="card">
          <h3 className="mb-4 font-bold">Departements</h3>
          <Chart>
            <BarChart data={data?.employeesByDepartment ?? []}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#7c3aed" radius={[10, 10, 0, 0]} />
            </BarChart>
          </Chart>
        </div>
        <div className="card xl:col-span-2">
          <h3 className="mb-4 font-bold">Croissance des effectifs</h3>
          <Chart>
            <AreaChart data={sampleGrowth}>
              <defs>
                <linearGradient id="reportGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="employees" stroke="#06b6d4" fill="url(#reportGrowth)" strokeWidth={3} />
            </AreaChart>
          </Chart>
        </div>
      </div>
    </MotionPage>
  )
}

function LineItem({ label, value }) {
  return <div className="flex justify-between rounded-2xl bg-slate-50 p-4"><span className="text-slate-500">{label}</span><strong>{value}</strong></div>
}

function Chart({ children }) {
  return <div className="h-72"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>
}

const samplePayroll = [
  { date: 'Jan', amount: 21000 },
  { date: 'Fev', amount: 24000 },
  { date: 'Mar', amount: 27000 },
  { date: 'Avr', amount: 31000 }
]

const sampleGrowth = [
  { month: 'Jan', employees: 10 },
  { month: 'Fev', employees: 14 },
  { month: 'Mar', employees: 18 },
  { month: 'Avr', employees: 23 }
]
