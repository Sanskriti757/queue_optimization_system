import { useCallback, useEffect, useMemo, useState } from 'react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import { useAuth } from '../../context/AuthContext'
import { getDoctorQueue, markPatientDone, requeueCurrentPatient } from '../../services/doctorService'
import { getErrorMessage, isHighPriority } from '../../utils/helpers'
import { useToast } from '../../context/ToastContext'

function CurrentPatientPage() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [queue, setQueue] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isMarking, setIsMarking] = useState(false)
  const [isRequeueing, setIsRequeueing] = useState(false)
  const [consultation, setConsultation] = useState({
    diagnosis: '',
    prescribed_medicines: '',
    referral_notes: '',
  })

  const fetchQueue = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getDoctorQueue(user.user_id)
      setQueue(data)
    } catch (error) {
      addToast({ title: 'Queue load failed', description: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }, [addToast, user.user_id])

  useEffect(() => {
    fetchQueue()
  }, [fetchQueue])

  const currentPatient = useMemo(() => queue.find((item) => item.status === 'IN_TREATMENT') || null, [queue])

  const hasActiveTreatment = currentPatient?.status === 'IN_TREATMENT'

  useEffect(() => {
    if (!currentPatient) {
      setConsultation({ diagnosis: '', prescribed_medicines: '', referral_notes: '' })
      return
    }
    setConsultation({
      diagnosis: currentPatient.diagnosis || '',
      prescribed_medicines: currentPatient.prescribed_medicines || '',
      referral_notes: currentPatient.referral_notes || '',
    })
  }, [currentPatient])

  const patientInfo = useMemo(() => {
    if (!currentPatient) return []
    return [
      { label: 'Name', value: currentPatient.name },
      { label: 'Age', value: currentPatient.age },
      { label: 'Gender', value: currentPatient.gender },
      { label: 'Physical Disability', value: currentPatient.physical_disability === true ? 'Yes' : currentPatient.physical_disability === false ? 'No' : null },
    ].map((item) => ({ ...item, value: item.value ?? 'N/A' }))
  }, [currentPatient])

  const vitalsInfo = useMemo(() => {
    if (!currentPatient) return []
    return [
      { label: 'Body Temperature', value: currentPatient.body_temperature },
      { label: 'Blood Pressure', value: currentPatient.blood_pressure },
      { label: 'Heart Rate', value: currentPatient.heart_rate ? `${currentPatient.heart_rate} bpm` : null },
      { label: 'Oxygen Level', value: currentPatient.oxygen_lvl ? `${currentPatient.oxygen_lvl}%` : null },
    ].map((item) => ({ ...item, value: item.value ?? 'N/A' }))
  }, [currentPatient])

  const handleMarkDone = async () => {
    if (!currentPatient || !hasActiveTreatment) return
    setIsMarking(true)
    try {
      await markPatientDone(currentPatient.patient_id, consultation)
      addToast({ title: 'Treatment completed', description: `${currentPatient.name} marked as done.` })
      await fetchQueue()
    } catch (error) {
      addToast({ title: 'Unable to complete', description: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsMarking(false)
    }
  }

  const handleRequeue = async () => {
    if (!currentPatient || !hasActiveTreatment) return
    setIsRequeueing(true)
    try {
      await requeueCurrentPatient(currentPatient.patient_id)
      addToast({
        title: 'Patient moved back to waiting',
        description: `${currentPatient.name} was requeued. You can call another patient now.`,
      })
      await fetchQueue()
    } catch (error) {
      addToast({ title: 'Unable to requeue patient', description: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsRequeueing(false)
    }
  }

  return (
    <>
      <Card title="Consultation Sheet">
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading current patient...</p>
        ) : !currentPatient ? (
          <div className="border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No patient in treatment right now. Call in a patient from Doctor Dashboard.
          </div>
        ) : (
          <div className="space-y-5">
            <div className="border border-slate-300 bg-white">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">MediQueue</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">Patient Consultation Record</h3>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p>Token: #{currentPatient.token_number || 'N/A'}</p>
                  <p>{new Date().toLocaleString()}</p>
                </div>
              </div>

              <div className="grid gap-0 md:grid-cols-2">
                <div className="border-b border-slate-200 p-5 md:border-b-0 md:border-r">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Patient</span>
                    <Badge variant={hasActiveTreatment ? 'info' : 'warning'}>{currentPatient.status}</Badge>
                    <Badge variant={isHighPriority(currentPatient.priority_score) ? 'danger' : 'neutral'}>
                      Priority {currentPatient.priority_score ?? 'N/A'}
                    </Badge>
                  </div>
                  <ol className="space-y-1.5 text-sm">
                    {patientInfo.map((detail, index) => (
                      <li key={detail.label} className="grid grid-cols-[26px_160px_1fr] border-b border-slate-100 py-1.5 last:border-0">
                        <span className="font-semibold text-slate-400">{index + 1}.</span>
                        <span className="font-semibold text-slate-700">{detail.label}</span>
                        <span className="text-slate-900">{detail.value}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="p-5">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Symptoms / Notes</span>
                  <p className="mt-2 min-h-[120px] border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-800">
                    {currentPatient.symptoms || 'No symptoms documented.'}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 px-5 py-4">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Vitals</span>
                <ol className="mt-2 space-y-1.5 text-sm">
                  {vitalsInfo.map((detail, index) => (
                    <li key={detail.label} className="grid grid-cols-[26px_160px_1fr] border-b border-slate-100 py-1.5 last:border-0">
                      <span className="font-semibold text-slate-400">{index + 1}.</span>
                      <span className="font-semibold text-slate-700">{detail.label}</span>
                      <span className="text-slate-900">{detail.value}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border-t border-slate-200 px-5 py-4">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Consultation Notes</span>
                <div className="mt-3 grid gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Diagnosis</label>
                    <textarea
                      value={consultation.diagnosis}
                      onChange={(event) => setConsultation((prev) => ({ ...prev, diagnosis: event.target.value }))}
                      placeholder="Enter diagnosis..."
                      className="min-h-[70px] w-full border border-slate-200 bg-white p-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Prescribed Medicines</label>
                    <textarea
                      value={consultation.prescribed_medicines}
                      onChange={(event) => setConsultation((prev) => ({ ...prev, prescribed_medicines: event.target.value }))}
                      placeholder="Medicine name, dosage, frequency, duration..."
                      className="min-h-[90px] w-full border border-slate-200 bg-white p-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Referral Notes</label>
                    <textarea
                      value={consultation.referral_notes}
                      onChange={(event) => setConsultation((prev) => ({ ...prev, referral_notes: event.target.value }))}
                      placeholder="If referring, mention department/doctor and reason..."
                      className="min-h-[70px] w-full border border-slate-200 bg-white p-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="secondary" onClick={handleRequeue} isLoading={isRequeueing} disabled={!currentPatient || !hasActiveTreatment || isMarking}>
                Patient Not Available
              </Button>
              <Button variant="danger" onClick={handleMarkDone} isLoading={isMarking} disabled={!currentPatient || !hasActiveTreatment}>
                Complete Treatment & Save Notes
              </Button>
            </div>
          </div>
        )}
      </Card>
    </>
  )
}

export default CurrentPatientPage
