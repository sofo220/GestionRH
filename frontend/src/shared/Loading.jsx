export function Spinner() {
  return <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" />
}

export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-4 w-28 rounded bg-slate-100" />
      <div className="mt-4 h-8 w-20 rounded bg-slate-100" />
      <div className="mt-3 h-3 w-36 rounded bg-slate-100" />
    </div>
  )
}
