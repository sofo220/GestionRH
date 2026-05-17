export default function Message({ type = 'success', children }) {
  if (!children) return null
  const styles = type === 'error'
    ? 'border-red-200 bg-red-50 text-red-700'
    : 'border-emerald-200 bg-emerald-50 text-emerald-700'
  return <div className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm ${styles}`}>{children}</div>
}
