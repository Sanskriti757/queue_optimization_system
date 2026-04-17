import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, RefreshCw, UserPlus } from 'lucide-react'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { getAdminDashboardData } from '../../services/adminService'
import { getErrorMessage } from '../../utils/helpers'
import { useToast } from '../../context/ToastContext'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

function AdminDashboardPage() {
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalTriageNurses: 0,
    totalPatients: 0,
    patientsToday: 0,
    activeQueue: 0,
    doctorsTotal: 0,
    doctorsOnDuty: 0,
    treatedToday: 0,
    occupancyPercent: 0,
    avgWaitMinutes: 0,
  })
  const [analytics, setAnalytics] = useState({})
  const [allPatients, setAllPatients] = useState([])

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const dashboardData = await getAdminDashboardData()
      const usersResponse = Array.isArray(dashboardData.users) ? dashboardData.users : []
      const patientsResponse = Array.isArray(dashboardData.allPatients) ? dashboardData.allPatients : []
      setAnalytics(dashboardData.analytics || {})
      setAllPatients(patientsResponse)
      const summary = dashboardData.analytics?.summary || {}
      setStats({
        totalUsers: summary.total_users ?? usersResponse.length,
        totalDoctors: summary.doctors_total ?? usersResponse.filter((user) => user.role === 'DOCTOR').length,
        totalTriageNurses:
          summary.triage_total ?? usersResponse.filter((user) => user.role === 'TRIAGE' || user.role === 'TRIAGE_NURSE').length,
        totalPatients: summary.total_patients ?? patientsResponse.length,
        patientsToday:
          summary.patients_registered_today ??
          patientsResponse.filter((patient) => {
            if (!patient.created_at) return false
            const created = new Date(patient.created_at)
            const now = new Date()
            return created.toDateString() === now.toDateString()
          }).length,
        activeQueue: summary.active_queue ?? 0,
        doctorsTotal: summary.doctors_total ?? 0,
        doctorsOnDuty: summary.doctors_on_duty ?? 0,
        treatedToday: summary.patients_treated_today ?? 0,
        occupancyPercent: summary.occupancy_percent ?? 0,
        avgWaitMinutes: summary.avg_wait_minutes ?? 0,
      })
    } catch (error) {
      addToast({ title: 'Failed to load dashboard', description: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const flowData = useMemo(() => {
    const series = analytics?.patient_flow?.week || { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], data: [] }
    return {
      labels: series.labels || [],
      datasets: [{ label: 'Patient Flow', data: series.data || [], backgroundColor: '#111827', borderColor: '#111827', borderWidth: 1, barThickness: 18 }],
    }
  }, [analytics])

  const queueDeptChart = useMemo(() => {
    const labels = analytics?.department_queue?.labels || []
    const values = analytics?.department_queue?.data || []
    const hasRealData =
      Array.isArray(values) &&
      values.some((value) => Number(value) > 0) &&
      !(labels.length === 1 && labels[0] === 'No Queue')

    if (!hasRealData) {
      return {
        isPlaceholder: true,
        data: {
          labels: ['No active queue'],
          datasets: [
            {
              data: [1],
              backgroundColor: ['#e5e7eb'],
              borderColor: '#ffffff',
              borderWidth: 1,
            },
          ],
        },
      }
    }

    return {
      isPlaceholder: false,
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: ['#dc2626', '#f59e0b', '#facc15', '#22c55e', '#3b82f6', '#a855f7'],
            borderColor: '#ffffff',
            borderWidth: 1,
          },
        ],
      },
    }
  }, [analytics])
  const allPatientsToday = useMemo(() => {
    const now = new Date()
    return allPatients.filter((patient) => {
      if (!patient.created_at) return false
      const createdAt = new Date(patient.created_at)
      return createdAt.toDateString() === now.toDateString()
    })
  }, [allPatients])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border border-zinc-200 bg-white p-5">
        <div>
          <h1 className="text-[18px] font-semibold text-zinc-900">Admin Control Center</h1>
          <p className="mt-0.5 text-[13px] text-zinc-400">Hospital-wide overview and staff management</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/create-user" className="inline-flex items-center gap-1.5 border border-zinc-200 bg-white px-3.5 py-2 text-[13px] font-medium text-zinc-700 transition-colors hover:bg-zinc-50">
            <UserPlus className="size-4 text-zinc-500" />
            Add Triage Nurse
          </Link>
          <Link to="/admin/create-user" className="inline-flex items-center gap-1.5 bg-zinc-900 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-zinc-800">
            <UserPlus className="size-4 text-white" />
            Add Doctor
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="border border-zinc-200 bg-white p-5">
          <p className="text-[11px] text-zinc-400">Staff</p>
          <p className="mt-2 text-[32px] font-bold leading-none text-zinc-900">{stats.totalDoctors}</p>
          <p className="mt-2 text-[13px] font-medium text-zinc-600">Total Doctors</p>
          <p className="text-[12px] text-zinc-400">Registered doctor accounts</p>
        </div>
        <div className="border border-zinc-900 bg-zinc-900 p-5">
          <p className="text-[11px] text-zinc-400">Patients</p>
          <p className="mt-2 text-[32px] font-bold leading-none text-white">{stats.totalPatients}</p>
          <p className="mt-2 text-[13px] font-medium text-zinc-300">Total Patients</p>
          <p className="text-[12px] text-zinc-500">All patient records</p>
        </div>
        <div className="border border-zinc-200 bg-white p-5">
          <p className="text-[11px] text-zinc-400">Staff</p>
          <p className="mt-2 text-[32px] font-bold leading-none text-zinc-900">{stats.totalTriageNurses}</p>
          <p className="mt-2 text-[13px] font-medium text-zinc-600">Total Triage Nurses</p>
          <p className="text-[12px] text-zinc-400">Registered triage accounts</p>
        </div>
        <div className="border border-zinc-200 bg-white p-5">
          <p className="text-[11px] text-zinc-400">Today</p>
          <p className="mt-2 text-[32px] font-bold leading-none text-zinc-900">{stats.patientsToday}</p>
          <p className="mt-2 text-[13px] font-medium text-zinc-600">All Patients Today</p>
          <p className="text-[12px] text-zinc-400">New registrations today</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 border border-zinc-200 bg-white p-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-zinc-900">Patient Flow Analytics</h2>
              <p className="text-[12px] text-zinc-400">Weekly patient registrations</p>
            </div>
          </div>
          <div className="h-[230px]">
            <Bar
              data={flowData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { color: '#f3f4f6' }, ticks: { color: '#9ca3af', font: { size: 11 } } },
                  y: { grid: { color: '#f3f4f6' }, ticks: { color: '#9ca3af', font: { size: 11 } }, beginAtZero: true },
                },
              }}
            />
          </div>
        </div>

        <div className="border border-zinc-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-zinc-900">Queue</h2>
            <Activity className="size-4 text-zinc-400" />
          </div>
          <div className="h-[220px]">
            <Doughnut
              data={queueDeptChart.data}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  tooltip: { enabled: !queueDeptChart.isPlaceholder },
                  legend: { position: 'bottom', labels: { boxWidth: 12, color: '#6b7280', font: { size: 11 } } },
                },
                cutout: '62%',
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 border border-zinc-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-zinc-900">All Patients Today</h2>
              <p className="text-[12px] text-zinc-400">Patients registered today with assigned doctor names</p>
            </div>
            <button
              type="button"
              onClick={fetchData}
              disabled={isLoading}
              className="flex h-9 w-9 items-center justify-center border border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-50 disabled:opacity-60"
            >
              <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {allPatientsToday.length === 0 ? (
            <p className="text-sm text-zinc-500">No patients registered today.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-100">
                    {['Token', 'Patient', 'Status', 'Assigned Doctor', 'Created'].map((header) => (
                      <th key={header} className="pb-3 pr-4 text-left text-[11px] font-semibold tracking-wider text-zinc-400">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {allPatientsToday.slice(0, 8).map((patient) => (
                    <tr key={patient.patient_id} className="text-sm text-zinc-700">
                      <td className="py-3 pr-4 font-semibold text-zinc-900">#{patient.token_number || '—'}</td>
                      <td className="py-3 pr-4">{patient.name || '—'}</td>
                      <td className="py-3 pr-4">{patient.status || '—'}</td>
                      <td className="py-3 pr-4">{patient.assigned_doctor_name || 'Not assigned'}</td>
                      <td className="py-3 pr-4">{patient.created_at ? new Date(patient.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="border border-zinc-200 bg-white p-5">
          <h2 className="text-[15px] font-semibold text-zinc-900">Operational Signals</h2>
          <p className="mb-4 text-[12px] text-zinc-400">Key indicators for quick decisions</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between border border-zinc-100 bg-zinc-50 px-3 py-2">
              <span className="text-sm text-zinc-600">Total Staff</span>
              <span className="text-sm font-semibold text-zinc-900">{stats.totalUsers}</span>
            </div>
            <div className="flex items-center justify-between border border-zinc-100 bg-zinc-50 px-3 py-2">
              <span className="text-sm text-zinc-600">Active Queue</span>
              <span className="text-sm font-semibold text-zinc-900">{stats.activeQueue}</span>
            </div>
            <div className="flex items-center justify-between border border-zinc-100 bg-zinc-50 px-3 py-2">
              <span className="text-sm text-zinc-600">Avg Wait</span>
              <span className="text-sm font-semibold text-zinc-900">{stats.avgWaitMinutes} min</span>
            </div>
            <div className="flex items-center justify-between border border-zinc-100 bg-zinc-50 px-3 py-2">
              <span className="text-sm text-zinc-600">Treated Today</span>
              <span className="text-sm font-semibold text-zinc-900">{stats.treatedToday}</span>
            </div>
            <div className="flex items-center justify-between border border-zinc-100 bg-zinc-50 px-3 py-2">
              <span className="text-sm text-zinc-600">Doctors On Duty</span>
              <span className="text-sm font-semibold text-zinc-900">
                {stats.doctorsOnDuty}/{Math.max(stats.doctorsTotal, 1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
