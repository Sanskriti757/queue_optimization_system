import { useCallback, useEffect, useMemo, useState } from 'react'
import { useToast } from '../../context/ToastContext'
import { getDepartments, registerPatient } from '../../services/triageService'
import { getErrorMessage, getSeverityVitals } from '../../utils/helpers'

const STEPS = [
  { id: 1, label: 'Basic Info', sub: 'Identity & contact' },
  { id: 2, label: 'Symptoms', sub: 'Chief complaints' },
  { id: 3, label: 'Vitals', sub: 'Measurements' },
]

const SYMPTOM_TAGS = [
  'Chest pain',
  'Fever',
  'Headache',
  'Shortness of breath',
  'Nausea',
  'Dizziness',
  'Back pain',
  'Fatigue',
  'Vomiting',
  'Blurred vision',
  'Joint pain',
  'Weakness',
]

const defaultValues = {
  name: '',
  age: '',
  gender: '',
  contact_number: '',
  symptoms: '',
  department_id: '',
  physical_disability: false,
  body_temperature: '',
  blood_pressure: '',
  heart_rate: '',
  oxygen_lvl: '',
}

const getInputClass = (error) =>
  `w-full border bg-zinc-50 px-4 py-2.5 text-[13px] text-zinc-900 placeholder-zinc-300 outline-none transition-all duration-150 ${
    error ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10'
  }`

const normalizeContactNumber = (contactNumber) => contactNumber.replace(/\D/g, '')

const Field = ({ label, required, error, hint, children }) => (
  <div>
    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
      {label}
      {required ? <span className="ml-0.5 text-red-400">*</span> : null}
    </label>
    {children}
    {error ? <p className="mt-1 text-[11px] text-red-500">{error}</p> : null}
    {!error && hint ? <p className="mt-1 text-[11px] text-zinc-400">{hint}</p> : null}
  </div>
)

function RegisterPatientPage() {
  const { addToast } = useToast()
  const [step, setStep] = useState(1)
  const [values, setValues] = useState(defaultValues)
  const [departments, setDepartments] = useState([])
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const fetchDepartments = useCallback(async () => {
    try {
      const data = await getDepartments()
      setDepartments(Array.isArray(data) ? data : [])
    } catch (error) {
      addToast({ title: 'Department load failed', description: getErrorMessage(error), variant: 'error' })
    }
  }, [addToast])

  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])

  const setValue = (field, val) => {
    setValues((prev) => ({ ...prev, [field]: val }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const onChange = (event) => {
    const { name, value, type, checked } = event.target
    setValue(name, type === 'checkbox' ? checked : value)
  }

  const validateStep = (currentStep) => {
    const next = {}
    if (currentStep === 1) {
      const contactNumber = normalizeContactNumber(values.contact_number)
      if (!values.name.trim()) next.name = 'Full name is required'
      if (!values.age || Number(values.age) < 1 || Number(values.age) > 120) next.age = 'Enter a valid age (1-120)'
      if (!values.gender) next.gender = 'Select a gender'
      if (!contactNumber) next.contact_number = 'Contact number is required'
      else if (!/^\d{10,15}$/.test(contactNumber)) next.contact_number = 'Enter a valid contact number (10-15 digits)'
      if (!values.department_id) next.department_id = 'Select a department'
    }
    if (currentStep === 2 && !values.symptoms.trim()) next.symptoms = 'Describe the symptoms'
    if (currentStep === 3) {
      if (values.body_temperature && (Number(values.body_temperature) < 90 || Number(values.body_temperature) > 115))
        next.body_temperature = 'Must be 90-115 F'
      if (values.oxygen_lvl && (Number(values.oxygen_lvl) < 50 || Number(values.oxygen_lvl) > 100))
        next.oxygen_lvl = 'Must be 50-100 %'
      if (values.heart_rate && (Number(values.heart_rate) < 20 || Number(values.heart_rate) > 300))
        next.heart_rate = 'Enter a valid heart rate'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const toggleTag = (tag) => {
    setValues((prev) => {
      const parts = prev.symptoms ? prev.symptoms.split(',').map((item) => item.trim()).filter(Boolean) : []
      const has = parts.includes(tag)
      return { ...prev, symptoms: has ? parts.filter((item) => item !== tag).join(', ') : [...parts, tag].join(', ') }
    })
    setErrors((prev) => ({ ...prev, symptoms: '' }))
  }

  const activeTags = useMemo(
    () => (values.symptoms ? values.symptoms.split(',').map((item) => item.trim()).filter(Boolean) : []),
    [values.symptoms],
  )

  const dept = departments.find((item) => Number(item.department_id) === Number(values.department_id))
  const initials = values.name
    ? values.name
        .split(' ')
        .map((token) => token[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : ''
  const tempFlag = values.body_temperature && Number(values.body_temperature) > 100.4
  const spo2Flag = values.oxygen_lvl && Number(values.oxygen_lvl) < 95

  const submit = async () => {
    if (!validateStep(step)) return

    setIsLoading(true)
    try {
      const severityVitals = getSeverityVitals('MEDIUM')
      const manualVitals = {
        ...(values.body_temperature ? { body_temperature: Number(values.body_temperature) } : {}),
        ...(values.blood_pressure.trim() ? { blood_pressure: values.blood_pressure.trim() } : {}),
        ...(values.heart_rate ? { heart_rate: Number(values.heart_rate) } : {}),
        ...(values.oxygen_lvl ? { oxygen_lvl: Number(values.oxygen_lvl) } : {}),
      }

      const response = await registerPatient({
        name: values.name.trim(),
        age: Number(values.age),
        gender: values.gender,
        contact_number: normalizeContactNumber(values.contact_number),
        symptoms: values.symptoms.trim(),
        department_id: Number(values.department_id),
        physical_disability: values.physical_disability,
        ...severityVitals,
        ...manualVitals,
      })

      addToast({
        title: 'Patient registered',
        description: `Token #${response.token_number} created successfully.`,
      })
      setValues(defaultValues)
      setErrors({})
      setStep(1)
    } catch (error) {
      addToast({ title: 'Registration failed', description: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border border-zinc-200 bg-white">
      <div className="flex min-h-[640px]">
        <div className="flex w-64 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50">
          <div className="border-b border-zinc-200 px-6 pb-5 pt-7">
            <div className="mb-0.5 flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center bg-zinc-900">
                <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-[14px] font-semibold text-zinc-900">New Patient</span>
            </div>
            <p className="pl-9 text-[11px] text-zinc-400">Queue registration</p>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-3 py-5">
            {STEPS.map((item) => {
              const done = step > item.id
              const active = step === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (done) setStep(item.id)
                  }}
                  className={`flex w-full items-center gap-3 px-3 py-3 text-left transition-all duration-150 ${
                    active ? 'bg-zinc-900/10' : done ? 'cursor-pointer hover:bg-zinc-100' : 'cursor-default'
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center text-[11px] font-bold transition-all ${
                      done
                        ? 'bg-zinc-900 text-white'
                        : active
                        ? 'bg-zinc-900 text-white ring-4 ring-zinc-900/10'
                        : 'bg-zinc-200 text-zinc-400'
                    }`}
                  >
                    {done ? (
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      item.id
                    )}
                  </div>
                  <div>
                    <p className={`mb-0.5 text-[13px] font-medium leading-none ${active || done ? 'text-zinc-900' : 'text-zinc-400'}`}>
                      {item.label}
                    </p>
                    <p className={`text-[11px] leading-none ${active ? 'text-zinc-500' : done ? 'text-zinc-500' : 'text-zinc-300'}`}>
                      {item.sub}
                    </p>
                  </div>
                </button>
              )
            })}
          </nav>

          {values.name ? (
            <div className="mx-3 mb-4 border border-zinc-200 bg-white p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Patient</p>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-zinc-900 text-[11px] font-bold text-white">{initials}</div>
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-semibold text-zinc-900">{values.name}</p>
                  <p className="text-[11px] text-zinc-400">{[values.age && `${values.age} yrs`, values.gender].filter(Boolean).join(' · ')}</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="px-5 pb-6">
            <div className="mb-1.5 flex justify-between text-[10px] text-zinc-400">
              <span>Progress</span>
              <span>{Math.round(((step - 1) / 3) * 100)}%</span>
            </div>
            <div className="h-1 overflow-hidden bg-zinc-200">
              <div className="h-full bg-zinc-900 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-zinc-100 px-9 pb-5 pt-7">
            <h2 className="text-[18px] font-bold text-zinc-900">
              {step === 1 && 'Basic information'}
              {step === 2 && 'Symptoms'}
              {step === 3 && 'Vitals'}
            </h2>
            <p className="mt-0.5 text-[13px] text-zinc-400">
              {step === 1 && 'Patient identity, contact, and department'}
              {step === 2 && "Describe the patient's current complaints"}
              {step === 3 && 'Record measurements — all fields are optional'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-9 py-7">
            {step === 1 ? (
              <div className="flex flex-col gap-5">
                <Field label="Full Name" required error={errors.name}>
                  <input
                    name="name"
                    value={values.name}
                    onChange={onChange}
                    placeholder="e.g. Ravi Kumar"
                    className={getInputClass(errors.name)}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Age" required error={errors.age}>
                    <input
                      name="age"
                      type="number"
                      value={values.age}
                      onChange={onChange}
                      placeholder="34"
                      min={1}
                      max={120}
                      className={getInputClass(errors.age)}
                    />
                  </Field>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                      Gender<span className="ml-0.5 text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' },
                        { label: 'Other', value: 'other' },
                      ].map((gender) => (
                        <button
                          key={gender.value}
                          type="button"
                          onClick={() => setValue('gender', gender.value)}
                          className={`border py-2.5 text-[12px] font-semibold transition-all duration-150 ${
                            values.gender === gender.value
                              ? 'border-zinc-900 bg-zinc-900 text-white'
                              : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:border-zinc-400'
                          }`}
                        >
                          {gender.label}
                        </button>
                      ))}
                    </div>
                    {errors.gender ? <p className="mt-1 text-[11px] text-red-500">{errors.gender}</p> : null}
                  </div>
                </div>

                <Field label="Contact Number" required error={errors.contact_number}>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 select-none text-[13px] font-medium text-zinc-400">
                      +91
                    </span>
                    <input
                      name="contact_number"
                      value={values.contact_number}
                      onChange={onChange}
                      placeholder="98765 43210"
                      className={`${getInputClass(errors.contact_number)} pl-12`}
                    />
                  </div>
                </Field>

                <Field label="Department" required error={errors.department_id}>
                  <select name="department_id" value={values.department_id} onChange={onChange} className={getInputClass(errors.department_id)}>
                    <option value="">Select department</option>
                    {departments.map((department) => (
                      <option key={department.department_id} value={department.department_id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <button
                  type="button"
                  onClick={() => setValue('physical_disability', !values.physical_disability)}
                  className={`flex w-full items-center justify-between border p-4 text-left transition-all duration-150 ${
                    values.physical_disability ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center transition-colors ${
                        values.physical_disability ? 'bg-zinc-900' : 'bg-zinc-100'
                      }`}
                    >
                      <svg
                        className={`h-4 w-4 ${values.physical_disability ? 'text-white' : 'text-zinc-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-zinc-900">Physical Disability</p>
                      <p className="text-[11px] text-zinc-400">Mark if the patient has a physical disability</p>
                    </div>
                  </div>
                  <div
                    className={`flex h-[22px] w-10 shrink-0 items-center px-0.5 transition-colors duration-200 ${
                      values.physical_disability ? 'bg-zinc-900' : 'bg-zinc-200'
                    }`}
                  >
                    <div
                      className={`h-[18px] w-[18px] bg-white shadow transition-transform duration-200 ${
                        values.physical_disability ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </button>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="flex flex-col gap-5">
                <Field label="Chief Complaints" required error={errors.symptoms} hint={`${values.symptoms.length} characters`}>
                  <textarea
                    name="symptoms"
                    value={values.symptoms}
                    onChange={onChange}
                    placeholder="e.g. Severe chest pain since 2 hours, shortness of breath, dizziness..."
                    rows={4}
                    className={`${getInputClass(errors.symptoms)} resize-none leading-relaxed`}
                  />
                </Field>

                <div>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Quick Add</p>
                  <div className="flex flex-wrap gap-2">
                    {SYMPTOM_TAGS.map((tag) => {
                      const active = activeTags.includes(tag)
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`border px-3 py-1.5 text-[12px] font-medium transition-all duration-150 ${
                            active ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-500'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}
                          {tag}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {values.name ? (
                  <div className="flex items-center gap-3 border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-zinc-900 text-[12px] font-bold text-white">{initials}</div>
                    <div>
                      <p className="text-[13px] font-semibold text-zinc-900">{values.name}</p>
                      <p className="text-[11px] text-zinc-400">
                        {[values.age && `${values.age} yrs`, values.gender, dept?.name].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {step === 3 ? (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Body Temperature"
                    error={errors.body_temperature}
                    hint={
                      values.body_temperature && !errors.body_temperature
                        ? tempFlag
                          ? 'Fever detected'
                          : 'Normal range'
                        : 'In F - normal 97-99 F'
                    }
                  >
                    <div className="relative">
                      <input
                        name="body_temperature"
                        type="number"
                        step="0.1"
                        value={values.body_temperature}
                        onChange={onChange}
                        placeholder="98.6"
                        className={`${getInputClass(errors.body_temperature)} pr-10`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-zinc-400">F</span>
                    </div>
                  </Field>

                  <Field label="Heart Rate" error={errors.heart_rate}>
                    <div className="relative">
                      <input
                        name="heart_rate"
                        type="number"
                        value={values.heart_rate}
                        onChange={onChange}
                        placeholder="72"
                        className={`${getInputClass(errors.heart_rate)} pr-12`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-zinc-400">bpm</span>
                    </div>
                  </Field>

                  <Field label="Blood Pressure" hint="Format: systolic / diastolic">
                    <div className="relative">
                      <input
                        name="blood_pressure"
                        value={values.blood_pressure}
                        onChange={onChange}
                        placeholder="120/80"
                        className={`${getInputClass(false)} pr-16`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-zinc-400">mmHg</span>
                    </div>
                  </Field>

                  <Field
                    label="Oxygen Level (SpO2)"
                    error={errors.oxygen_lvl}
                    hint={
                      values.oxygen_lvl && !errors.oxygen_lvl
                        ? spo2Flag
                          ? 'Below normal (<95%)'
                          : 'Normal range'
                        : 'Normal: 95-100 %'
                    }
                  >
                    <div className="relative">
                      <input
                        name="oxygen_lvl"
                        type="number"
                        value={values.oxygen_lvl}
                        onChange={onChange}
                        placeholder="98"
                        min={50}
                        max={100}
                        className={`${getInputClass(errors.oxygen_lvl)} pr-8`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-zinc-400">%</span>
                    </div>
                  </Field>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Temp', value: values.body_temperature ? `${values.body_temperature}F` : '—', warn: tempFlag },
                    { label: 'HR', value: values.heart_rate ? `${values.heart_rate} bpm` : '—', warn: false },
                    { label: 'BP', value: values.blood_pressure || '—', warn: false },
                    { label: 'SpO2', value: values.oxygen_lvl ? `${values.oxygen_lvl}%` : '—', warn: spo2Flag },
                  ].map((item) => (
                    <div key={item.label} className={`border p-3 text-center ${item.warn ? 'border-red-200 bg-red-50' : 'border-zinc-100 bg-zinc-50'}`}>
                      <p className={`text-[15px] font-bold ${item.warn ? 'text-red-600' : 'text-zinc-900'}`}>{item.value}</p>
                      <p className={`mt-0.5 text-[10px] font-semibold uppercase tracking-widest ${item.warn ? 'text-red-400' : 'text-zinc-400'}`}>
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between bg-zinc-900 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-white text-[12px] font-bold text-zinc-900">{initials || '?'}</div>
                    <div>
                      <p className="text-[13px] font-semibold text-white">{values.name || '—'}</p>
                      <p className="text-[11px] text-zinc-400">{[values.age && `${values.age} yrs`, values.gender, dept?.name].filter(Boolean).join(' · ')}</p>
                    </div>
                  </div>
                  <span className="text-[11px] uppercase tracking-widest text-zinc-500">Ready to submit</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-zinc-100 bg-zinc-50/60 px-9 py-5">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center gap-2 border border-zinc-200 bg-white px-5 py-2.5 text-[13px] font-semibold text-zinc-500 transition-all disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <div className="flex items-center gap-1.5">
              {STEPS.map((item) => (
                <div
                  key={item.id}
                  className={`transition-all duration-300 ${item.id <= step ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                  style={{ width: item.id === step ? 20 : 8, height: 8 }}
                />
              ))}
            </div>

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 bg-zinc-900 px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-zinc-700"
              >
                Continue
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={isLoading}
                className="flex items-center gap-2 bg-zinc-900 px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-zinc-700 disabled:opacity-60"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {isLoading ? 'Please wait...' : 'Register Patient'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPatientPage
