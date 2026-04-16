import { cn } from '../utils/helpers'

const variants = {
  success: 'bg-zinc-200 text-zinc-800',
  warning: 'bg-zinc-200 text-zinc-800',
  danger: 'bg-zinc-300 text-zinc-900',
  info: 'bg-zinc-100 text-zinc-700',
  neutral: 'bg-zinc-100 text-zinc-700',
}

function Badge({ children, variant = 'neutral', className }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  )
}

export default Badge
