import { useCallback, useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/Button'
import { callNextPatient, getDoctorQueue, requeueCurrentPatient } from '../../services/doctorService'
import { useToast } from '../../context/ToastContext'

const getPriorityConfig = () => ({ dot: 'bg-zinc-400', text: 'text-zinc-700' })

const getStatusConfig = (status) => {
  if (status === 'IN_TREATMENT') return { label: 'In Treatment', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' }
  if (status === 'COMPLETED') return { label: 'Completed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' }
  return { label: 'Waiting', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
}

const formatTime = (iso) => {
  if (!iso) return '—'
  const dt = new Date(iso)
  return Number.isNaN(dt.getTime()) ? '—' : dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const StatCard = ({ label, value, sub }) => (
  <div className="rounded-2xl border border-zinc-100 bg-white px-5 py-4 transition-colors hover:border-zinc-200">
    <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">{label}</span>
    <div className="mt-1 text-3xl font-bold leading-none text-zinc-900">{value}</div>
    {sub ? <span className="mt-1 block text-xs text-zinc-400">{sub}</span> : null}
  </div>
)

function DoctorDashboardPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { user } = useAuth()
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [apiError, setApiError] = useState('')
  const [actionLoading, setActionLoading] = useState({})

  const fetchQueue = useCallback(
    async (silent = false) => {
      if (!user?.user_id) return

      if (silent) setRefreshing(true)
      else setLoading(true)
      setApiError('')

      try {
        const data = await getDoctorQueue(user.user_id)
        setQueue(Array.isArray(data) ? data : [])
      } catch (error) {
        const message = error?.response?.data?.detail || error?.response?.data?.message || 'Unable to fetch queue'
        setApiError(typeof message === 'string' ? message : 'Unable to fetch queue')
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [user?.user_id],
  )

  useEffect(() => {
    fetchQueue()
  }, [fetchQueue])

  const handleCallIn = async (patientId) => {
    setActionLoading((prev) => ({ ...prev, [patientId]: 'start' }))
    setApiError('')

    try {
      await callNextPatient(patientId)
      await fetchQueue(true)
    } catch (error) {
      const message = error?.response?.data?.detail || error?.response?.data?.message || 'Action failed'
      setApiError(typeof message === 'string' ? message : 'Action failed')
    } finally {
      setActionLoading((prev) => ({ ...prev, [patientId]: '' }))
    }
  }

  const handleCompleteFromCurrentPatient = () => {
    addToast({
      title: 'Complete consultation from Current Patient',
      description: 'Please enter diagnosis, medicines, or referral notes in the consultation panel before completing treatment.',
      variant: 'info',
    })
    navigate('/doctor/current-patient')
  }

  const handleRequeueCurrentPatient = async () => {
    if (!nowServing) return
    setActionLoading((prev) => ({ ...prev, [nowServing.patient_id]: 'requeue' }))
    setApiError('')

    try {
      await requeueCurrentPatient(nowServing.patient_id)
      addToast({
        title: 'Patient moved back to waiting',
        description: `${nowServing.name} was requeued. You can call the next patient now.`,
      })
      await fetchQueue(true)
    } catch (error) {
      const message = error?.response?.data?.detail || error?.response?.data?.message || 'Action failed'
      setApiError(typeof message === 'string' ? message : 'Action failed')
    } finally {
      setActionLoading((prev) => ({ ...prev, [nowServing.patient_id]: '' }))
    }
  }

  const waitingQueue = useMemo(() => queue.filter((p) => p.status === 'WAITING'), [queue])

  const filteredQueue = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return waitingQueue

    return waitingQueue.filter(
      (p) =>
        (p.name || '').toLowerCase().includes(term) ||
        String(p.token_number || '').includes(term) ||
        (p.contact_number || '').toLowerCase().includes(term),
    )
  }, [waitingQueue, search])

  const stats = useMemo(() => {
    const waiting = queue.filter((p) => p.status === 'WAITING').length
    const inTreatment = queue.filter((p) => p.status === 'IN_TREATMENT').length
    const highScore = queue.filter((p) => (p.priority_score || 0) >= 6).length
    return { total: queue.length, waiting, inTreatment, highScore }
  }, [queue])

  const nowServing = queue.find((p) => p.status === 'IN_TREATMENT') || null
  const hasActiveTreatment = Boolean(nowServing)
  const nextInQueue = queue.filter((p) => p.status === 'WAITING').slice(0, 4)
  const isRequeueingCurrent = Boolean(nowServing && actionLoading[nowServing.patient_id] === 'requeue')

  return (
    <div className="space-y-5">
      {apiError ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {apiError}
        </div>
      ) : null}

      <div className="flex items-center justify-end">
        <Button variant="secondary" onClick={() => fetchQueue(true)} isLoading={refreshing}>
          <RefreshCw className="size-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Patients" value={stats.total} />
        <StatCard label="Waiting" value={stats.waiting} />
        <StatCard label="In Treatment" value={stats.inTreatment} />
        <StatCard label="High Score" value={stats.highScore} sub="priority ≥ 6" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-2xl border border-zinc-100 bg-white p-5 text-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">Now Serving</span>
              {nowServing ? (
                <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              ) : null}
            </div>

            {nowServing ? (
              <>
                <div className="mb-4">
                  <div className="text-5xl font-black leading-none tracking-tight text-zinc-900">#{nowServing.token_number}</div>
                  <div className="mt-2 text-base font-semibold text-zinc-900">{nowServing.name}</div>
                  <div className="mt-0.5 text-xs text-zinc-500">
                    {nowServing.age || '—'} yrs · {nowServing.gender || '—'} · {formatTime(nowServing.created_at)}
                  </div>
                </div>

                {nowServing.symptoms ? (
                  <div className="mb-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <span className="mb-1 block text-[10px] font-medium uppercase tracking-widest text-zinc-400">Symptoms</span>
                    <span className="text-xs leading-relaxed text-zinc-700">{nowServing.symptoms}</span>
                  </div>
                ) : null}

                <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                  {[
                    { label: 'BP', val: nowServing.blood_pressure },
                    { label: 'Heart Rate', val: nowServing.heart_rate ? `${nowServing.heart_rate} bpm` : null },
                    { label: 'SpO₂', val: nowServing.oxygen_lvl },
                    { label: 'Temp', val: nowServing.body_temperature },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <span className="mb-0.5 block text-[10px] uppercase tracking-widest text-zinc-400">{label}</span>
                      <span className="text-sm font-semibold text-zinc-900">{val || '—'}</span>
                    </div>
                  ))}
                </div>

                {(() => {
                  const p = getPriorityConfig(nowServing.priority_score || 0)
                  return (
                    <span className={`mb-3 flex items-center gap-1.5 text-xs font-medium ${p.text}`}>
                      <span className={`h-2 w-2 rounded-full ${p.dot}`} />
                      Priority Score {nowServing.priority_score || 0}
                    </span>
                  )
                })()}

                <button
                  type="button"
                  onClick={handleCompleteFromCurrentPatient}
                  className="w-full rounded-xl bg-zinc-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
                >
                  Consult
                </button>
                <button
                  type="button"
                  onClick={handleRequeueCurrentPatient}
                  disabled={isRequeueingCurrent}
                  className="mt-2 w-full rounded-xl border border-zinc-300 bg-white py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isRequeueingCurrent ? 'Requeueing…' : 'Patient Not Available'}
                </button>
              </>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#a1a1aa" strokeWidth="1.5">
                    <path strokeLinecap="round" d="M12 4v16M4 12h16" />
                  </svg>
                </div>
                <p className="text-sm text-zinc-500">No active patient</p>
                <p className="mt-1 text-xs text-zinc-600">Call in from the queue</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-white p-5">
            <span className="mb-3 block text-[10px] font-medium uppercase tracking-widest text-zinc-400">Up Next</span>
            {nextInQueue.length === 0 ? (
              <p className="py-2 text-xs text-zinc-400">Queue is empty</p>
            ) : (
              <div className="space-y-1">
                {nextInQueue.map((p, i) => {
                  const pb = getPriorityConfig(p.priority_score || 0)
                  return (
                    <div key={p.patient_id} className="flex items-center gap-3 border-b border-zinc-50 py-2 last:border-0">
                      <span className="w-4 text-xs font-bold tabular-nums text-zinc-300">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-zinc-900">{p.name}</p>
                        <p className="text-[11px] text-zinc-400">
                          #{p.token_number} · {formatTime(p.created_at)}
                        </p>
                      </div>
                      <span className={`flex items-center gap-1 text-[10px] font-semibold ${pb.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${pb.dot}`} />
                        Score {p.priority_score || 0}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-50 px-5 py-4">
            <span className="text-sm font-semibold text-zinc-900">Patient Queue</span>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300"
                width="13"
                height="13"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, token, phone…"
                className="w-56 rounded-xl border border-zinc-100 bg-zinc-50 py-2 pl-8 pr-4 text-xs transition-all placeholder:text-zinc-300 focus:border-zinc-300 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-1 items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-600" />
                <span className="text-xs text-zinc-400">Loading queue…</span>
              </div>
            </div>
          ) : filteredQueue.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-20">
              <p className="text-sm text-zinc-400">No patients found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-50">
                    {['Token', 'Patient', 'Age / Gender', 'Symptoms', 'Vitals', 'Priority', 'Status', ''].map((h) => (
                      <th
                        key={h}
                        className="whitespace-nowrap bg-zinc-50/50 px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredQueue.map((p) => {
                    const pb = getPriorityConfig(p.priority_score || 0)
                    const sb = getStatusConfig(p.status)
                    const isLoading = actionLoading[p.patient_id]

                    return (
                      <tr key={p.patient_id} className="border-b border-zinc-50 transition-colors hover:bg-zinc-50/60 last:border-0">
                        <td className="px-4 py-3">
                          <span className="text-sm font-bold text-zinc-900">#{p.token_number || '—'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="whitespace-nowrap text-sm font-medium text-zinc-900">{p.name}</p>
                          <p className="text-[11px] text-zinc-400">{formatTime(p.created_at)}</p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600">
                          {p.age || '—'} · {p.gender || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="block max-w-[130px] line-clamp-2 text-xs text-zinc-500">{p.symptoms || '—'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-0.5 whitespace-nowrap text-[11px] text-zinc-500">
                            <span>
                              BP: <span className="font-medium text-zinc-700">{p.blood_pressure || '—'}</span>
                            </span>
                            <span>
                              HR: <span className="font-medium text-zinc-700">{p.heart_rate || '—'}</span>
                            </span>
                            <span>
                              SpO₂: <span className="font-medium text-zinc-700">{p.oxygen_lvl || '—'}</span>
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold ${pb.text}`}>
                            <span className={`h-2 w-2 shrink-0 rounded-full ${pb.dot}`} />
                            Score {p.priority_score || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium ${sb.bg} ${sb.text} ${sb.border}`}
                          >
                            {sb.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {p.status === 'WAITING' ? (
                              <button
                                type="button"
                                onClick={() => handleCallIn(p.patient_id)}
                                disabled={Boolean(isLoading) || hasActiveTreatment}
                                className="whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500"
                              >
                              {isLoading === 'start' ? 'Calling…' : 'Call In'}
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboardPage
