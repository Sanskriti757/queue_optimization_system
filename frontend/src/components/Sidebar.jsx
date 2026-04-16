import { Activity, ClipboardPlus, LayoutDashboard, ListOrdered, Stethoscope, UserPlus, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/helpers'

const menuByRole = {
  ADMIN: [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Create User', to: '/admin/create-user', icon: UserPlus },
    { label: 'Manage Users', to: '/admin/manage-users', icon: Users },
    { label: 'All Patients', to: '/admin/all-patients', icon: ListOrdered },
  ],
  TRIAGE: [
    { label: 'Dashboard', to: '/triage', icon: LayoutDashboard, end: true },
    { label: 'Register Patient', to: '/triage/register-patient', icon: ClipboardPlus },
    { label: 'View Queue', to: '/triage/queue', icon: ListOrdered },
  ],
  DOCTOR: [
    { label: 'Dashboard', to: '/doctor', icon: LayoutDashboard, end: true },
    { label: 'Current Patient', to: '/doctor/current-patient', icon: Stethoscope },
    { label: 'Queue List', to: '/doctor/queue', icon: Activity },
  ],
}

function Sidebar() {
  const { user } = useAuth()
  const menu = menuByRole[user?.role] || []

  return (
    <aside className="w-72 border-r border-zinc-300/80 bg-white/90 p-4 backdrop-blur">
      <div className="mb-6 rounded-2xl bg-zinc-900 p-4 text-white shadow-sm">
        <span className="mt-1 text-xl font-semibold">MEDI</span>
        <span className="mt-1 text-4xl font-semibold">Q</span>

      </div>

      <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Navigation</p>
      <nav className="space-y-1.5">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-800',
                isActive && 'bg-zinc-200 text-zinc-900',
              )
            }
          >
            <item.icon className="size-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
