import { ArrowUpRight } from 'lucide-react'
import Card from './Card'

export function StatCard({ label, value, tone = 'indigo' }) {
  const toneClasses = {
    indigo: 'from-zinc-300/60 to-zinc-100 text-zinc-800',
    emerald: 'from-zinc-300/60 to-zinc-100 text-zinc-800',
    cyan: 'from-zinc-300/60 to-zinc-100 text-zinc-800',
  }

  return (
    <Card className={`bg-gradient-to-br ${toneClasses[tone] || toneClasses.indigo} border-white/70`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-3xl font-bold tracking-tight text-slate-800">{value}</p>
        <ArrowUpRight className="size-5 text-slate-400" />
      </div>
    </Card>
  )
}

export default StatCard
