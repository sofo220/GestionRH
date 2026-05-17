import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

export default function StatCard({ title, value, description, icon: Icon, tone = 'blue', trend = '+8%' }) {
  const tones = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/20',
    violet: 'from-violet-500 to-fuchsia-500 shadow-violet-500/20',
    cyan: 'from-cyan-500 to-sky-500 shadow-cyan-500/20',
    emerald: 'from-emerald-500 to-teal-500 shadow-emerald-500/20',
    amber: 'from-amber-400 to-orange-500 shadow-amber-500/20'
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card relative overflow-hidden"
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-slate-50" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <div className={`rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg ${tones[tone]}`}>
          <Icon size={22} />
        </div>
      </div>
      <div className="relative mt-5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <TrendingUp size={13} />
        {trend}
      </div>
    </motion.div>
  )
}
