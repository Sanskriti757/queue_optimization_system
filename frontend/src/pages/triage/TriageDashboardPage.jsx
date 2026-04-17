import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardPlus, ListOrdered, RefreshCw } from 'lucide-react'
import { getQueue } from '../../services/triageService'
import { useToast } from '../../context/ToastContext'
import { getErrorMessage } from '../../utils/helpers'
import { StatCard } from '../../components/StatCard'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'

function TriageDashboardPage() {
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [queue, setQueue] = useState([])

  const fetchQueue = async () => {
    setIsLoading(true)
    try {
      const data = await getQueue()
      setQueue(data)
    } catch (error) {
      addToast({ title: 'Queue load failed', description: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue()
  }, [])

  const averageWait = useMemo(() => {
    if (!queue.length) return 0
    const total = queue.reduce((sum, item) => sum + Number(item.estimated_wait_time || 0), 0)
    return Math.round(total / queue.length)
  }, [queue])
  const nextToken = queue[0]?.token ?? '—'
  const queueByDepartment = useMemo(() => {
    const grouped = queue.reduce((acc, patient) => {
      const department = patient.department_name || 'Unassigned'
      const doctor = patient.assigned_doctor_name ? `Dr. ${patient.assigned_doctor_name}` : 'Doctor not assigned'
      if (!acc[department]) acc[department] = {}
      if (!acc[department][doctor]) acc[department][doctor] = []
      acc[department][doctor].push(patient)
      return acc
    }, {})

    return Object.entries(grouped)
      .map(([department, doctorGroups]) => {
        const doctors = Object.entries(doctorGroups)
          .map(([doctor, patients]) => {
            const doctorTotalWait = patients.reduce((sum, item) => sum + Number(item.estimated_wait_time || 0), 0)
            return {
              doctor,
              patients,
              count: patients.length,
              averageWait: patients.length ? Math.round(doctorTotalWait / patients.length) : 0,
            }
          })
          .sort((a, b) => b.count - a.count)

        const allPatients = doctors.flatMap((item) => item.patients)
        const totalWait = allPatients.reduce((sum, item) => sum + Number(item.estimated_wait_time || 0), 0)
        return {
          department,
          doctors,
          count: allPatients.length,
          averageWait: allPatients.length ? Math.round(totalWait / allPatients.length) : 0,
        }
      })
      .sort((a, b) => b.count - a.count)
  }, [queue])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border border-zinc-200 bg-white p-5">
        <div>
          <h1 className="text-[18px] font-semibold text-zinc-900">Triage Dashboard</h1>
          <p className="mt-0.5 text-[13px] text-zinc-400">Queue monitoring and patient intake controls</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/triage/register-patient" className="inline-flex items-center gap-1.5 bg-zinc-900 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-zinc-800">
            <ClipboardPlus className="size-4 text-white" />
            Register Patient
          </Link>
          <Link to="/triage/queue" className="inline-flex items-center gap-1.5 border border-zinc-200 bg-white px-3.5 py-2 text-[13px] font-medium text-zinc-700 transition-colors hover:bg-zinc-50">
            <ListOrdered className="size-4 text-zinc-500" />
            Full Queue
          </Link>
          <Button variant="secondary" onClick={fetchQueue} isLoading={isLoading}>
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Patients Waiting" value={queue.length} tone="cyan" />
        <StatCard label="Next Token" value={nextToken} tone="emerald" />
        <StatCard label="Avg Wait (min)" value={averageWait} tone="emerald" />
      </div>

      <Card title="Queue Preview" description={`Department-wise waiting queue · Overall avg wait ${averageWait} min`}>
        <div className="space-y-4">
          {queueByDepartment.length === 0 ? (
            <p className="text-sm text-zinc-500">No waiting patients.</p>
          ) : (
            queueByDepartment.map((section) => (
              <div key={section.department} className="border border-zinc-200 bg-white">
                <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{section.department}</p>
                    <p className="text-xs text-zinc-500">Department queue summary</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="info">{section.count} waiting</Badge>
                    <Badge variant="neutral">Avg wait {section.averageWait} min</Badge>
                  </div>
                </div>
                <div className="space-y-3 p-3">
                  {section.doctors.map((doctorSection) => (
                    <div key={`${section.department}-${doctorSection.doctor}`} className="border-l-4 border-zinc-900 border-y border-r border-zinc-200 bg-zinc-50">
                      <div className="flex items-center justify-between border-b border-zinc-100 px-3 py-2">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Doctor Queue</p>
                          <p className="text-sm font-semibold text-zinc-900">{doctorSection.doctor}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="info">{doctorSection.count} waiting</Badge>
                          <Badge variant="neutral">Avg wait {doctorSection.averageWait} min</Badge>
                        </div>
                      </div>
                      <div className="divide-y divide-zinc-100">
                        {doctorSection.patients.map((patient) => (
                          <div key={patient.patient_id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm bg-white">
                            <p className="font-medium text-zinc-900">#{patient.token} · {patient.name}</p>
                            <span className="text-xs font-medium text-zinc-600">{patient.estimated_wait_time} min</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

export default TriageDashboardPage
