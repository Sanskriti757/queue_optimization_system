import { useCallback, useEffect, useMemo, useState } from 'react'
import { Shield, Stethoscope, UserCog, UserRoundPlus } from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { createUser, getDepartments } from '../../services/adminService'
import { getErrorMessage } from '../../utils/helpers'
import { useToast } from '../../context/ToastContext'

const defaultValues = {
  name: '',
  email: '',
  password: '',
  role: 'TRIAGE',
  department_id: '',
}

const inputClass =
  'w-full border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-700 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200'

function CreateUserPage() {
  const { addToast } = useToast()
  const [values, setValues] = useState(defaultValues)
  const [errors, setErrors] = useState({})
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchDepartments = useCallback(async () => {
    try {
      const data = await getDepartments()
      setDepartments(Array.isArray(data) ? data : [])
    } catch (error) {
      addToast({ title: 'Department fetch failed', description: getErrorMessage(error), variant: 'error' })
    }
  }, [addToast])

  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])

  const validate = () => {
    const next = {}
    if (!values.name.trim()) next.name = 'Name is required'
    if (!values.email.trim()) next.email = 'Email is required'
    if (!values.password.trim()) next.password = 'Password is required'
    if (values.role === 'DOCTOR' && !values.department_id) next.department_id = 'Department is required for doctor'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      await createUser({
        ...values,
        department_id: values.role === 'DOCTOR' ? Number(values.department_id) : null,
      })
      addToast({ title: 'User created', description: `${values.name} has been added.` })
      setValues(defaultValues)
      setErrors({})
    } catch (error) {
      addToast({ title: 'Create user failed', description: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const roleMeta = useMemo(
    () => ({
      ADMIN: {
        label: 'Administrator',
        description: 'Full platform access and control over accounts and system operations.',
        icon: <Shield className="size-4" />,
      },
      TRIAGE: {
        label: 'Triage Nurse',
        description: 'Registers patients, records vitals, and manages incoming queue flow.',
        icon: <UserCog className="size-4" />,
      },
      DOCTOR: {
        label: 'Doctor',
        description: 'Handles consultations, starts treatment, and completes patient sessions.',
        icon: <Stethoscope className="size-4" />,
      },
    }),
    [],
  )

  return (
    <Card className="max-w-6xl" title="Create Staff Account" description="Provision secure role-based access for doctors, triage nurses, and admins">
      <div className="grid gap-4 lg:grid-cols-3">
        <aside className="border border-zinc-200 bg-zinc-50 p-5">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center bg-zinc-900 text-white">
            <UserRoundPlus className="size-5" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Selected Role</p>
          <div className="mt-2 border border-zinc-200 bg-white p-3">
            <p className="text-sm font-semibold text-zinc-900">{roleMeta[values.role].label}</p>
            <p className="mt-1 text-xs text-zinc-500">{roleMeta[values.role].description}</p>
          </div>

          <div className="mt-4 space-y-2 text-xs text-zinc-500">
            <p className="font-semibold uppercase tracking-widest text-zinc-400">Checklist</p>
            <p>1. Verify role selection</p>
            <p>2. Ensure valid hospital email</p>
            <p>3. Assign department for doctors</p>
          </div>
        </aside>

        <form className="space-y-4 lg:col-span-2" onSubmit={handleSubmit}>
          <div className="border border-zinc-200 bg-white p-5">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Identity & Credentials</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input name="name" value={values.name} onChange={handleChange} placeholder="Dr. Anna Smith" className={inputClass} />
                {errors.name ? <p className="text-xs text-red-600">{errors.name}</p> : null}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input name="email" type="email" value={values.email} onChange={handleChange} placeholder="anna@mediqueue.com" className={inputClass} />
                {errors.email ? <p className="text-xs text-red-600">{errors.email}</p> : null}
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <input name="password" type="password" value={values.password} onChange={handleChange} placeholder="Strong password" className={inputClass} />
                {errors.password ? <p className="text-xs text-red-600">{errors.password}</p> : null}
              </div>
            </div>
          </div>

          <div className="border border-zinc-200 bg-zinc-50 p-5">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Role & Assignment</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {Object.entries(roleMeta).map(([roleKey, meta]) => (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => {
                    setValues((prev) => ({ ...prev, role: roleKey, department_id: roleKey === 'DOCTOR' ? prev.department_id : '' }))
                    setErrors((prev) => ({ ...prev, role: '', department_id: '' }))
                  }}
                  className={`border px-3 py-2 text-left transition-colors ${
                    values.role === roleKey ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold">
                    {meta.icon}
                    {meta.label}
                  </div>
                </button>
              ))}
            </div>

            {values.role === 'DOCTOR' ? (
              <div className="mt-4 space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Department</label>
                <select name="department_id" value={values.department_id} onChange={handleChange} className={inputClass}>
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option key={department.department_id} value={department.department_id}>
                      {department.name}
                    </option>
                  ))}
                </select>
                {errors.department_id ? <p className="text-xs text-red-600">{errors.department_id}</p> : null}
              </div>
            ) : null}
          </div>

          <div className="flex justify-end border-t border-zinc-200 pt-4">
            <Button type="submit" isLoading={isLoading}>
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}

export default CreateUserPage
