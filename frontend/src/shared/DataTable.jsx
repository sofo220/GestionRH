import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

export default function DataTable({ columns, rows, searchPlaceholder = 'Rechercher...', filters, actions }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 6

  const filtered = useMemo(() => {
    if (!query.trim()) return rows
    const q = query.toLowerCase()
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(q))
  }, [rows, query])

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)

  function changeQuery(value) {
    setQuery(value)
    setPage(1)
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input className="input !pl-12" placeholder={searchPlaceholder} value={query} onChange={(e) => changeQuery(e.target.value)} />
        </div>
        {filters}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((column) => <th key={column.key} className="px-4 py-3 font-semibold">{column.label}</th>)}
              {actions && <th className="px-4 py-3 font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, index) => (
              <tr key={row.id ?? index} className="border-t border-slate-100 odd:bg-white even:bg-slate-50/40 hover:bg-brand-50/60">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-slate-700">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {actions && <td className="px-4 py-3">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 p-4 text-sm text-slate-500">
        <span>{filtered.length} resultat(s)</span>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary px-3" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></button>
          <span>Page {page} / {pages}</span>
          <button className="btn btn-secondary px-3" disabled={page === pages} onClick={() => setPage(page + 1)}><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  )
}
