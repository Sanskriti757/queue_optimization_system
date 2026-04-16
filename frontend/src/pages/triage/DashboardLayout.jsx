import { CalendarDays, LogOut } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { formatRole } from '../utils/helpers'
import { useToast } from '../context/ToastContext'

function DashboardLayout() {
  const { user, logoutUser } = useAuth()
  const { addToast } = useToast()

  const handleLogout = async () => {
    try {
      await logoutUser()
    } finally {
      addToast({ title: 'Logged out', description: 'See you soon.', variant: 'info' })
    }
  }

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-b from-zinc-50/70 to-zinc-100 p-5 md:p-7">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white/95 px-5 py-4 shadow-[0_10px_35px_-20px_rgba(0,0,0,0.35)] backdrop-blur">
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <h2 className="text-xl font-semibold text-zinc-900">
              {user?.name} <span className="text-sm font-medium text-zinc-600">({formatRole(user?.role)})</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 md:flex">
              <CalendarDays className="size-4" />
              {new Date().toLocaleDateString()}
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout