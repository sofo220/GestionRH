import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-brand-500 text-white shadow-glow hover:bg-brand-600',
  success: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600',
  danger: 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600',
  warning: 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 hover:bg-amber-500',
  outline: 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-brand-200 hover:bg-brand-50',
  ghost: 'text-slate-600 hover:bg-slate-100'
}

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`btn ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
