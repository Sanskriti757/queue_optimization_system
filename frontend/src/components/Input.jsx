import { cn } from '../utils/helpers'

function Input({ label, error, className, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <input
        className={cn(
          'w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-700 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200',
          error && 'border-zinc-500 focus:border-zinc-600 focus:ring-zinc-300',
          className,
        )}
        {...props}
      />
      {error ? <p className="text-xs text-zinc-700">{error}</p> : null}
    </div>
  )
}

export default Input
