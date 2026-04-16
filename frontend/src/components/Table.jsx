import { cn } from '../utils/helpers'

function Table({ columns, data, emptyText = 'No data available' }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={cn('px-4 py-3 font-semibold', column.className)}>
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id || item.patient_id || item.user_id || index} className="border-t border-slate-100 hover:bg-slate-50/70">
                  {columns.map((column) => (
                    <td key={column.key} className={cn('px-4 py-3 text-slate-700', column.cellClassName)}>
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table
