import { useCallback, useEffect, useMemo, useState } from 'react'
import { Building2, RefreshCw, UserRound } from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { createDepartment, getDepartments, getDoctors } from '../../services/adminService'
import { getErrorMessage } from '../../utils/helpers'
import { useToast } from '../../context/ToastContext'

const inputClass =
  'w-full border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-700 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200'

const defaultValues = {
  name: '',
  code: '',
}

function DepartmentsPage() {
  const { addToast } = useToast()
  const [values, setValues] = useState(defaultValues)
  const [errors, setErrors] = useState({})
  const [departments, setDepartments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [departmentData, doctorData] = await Promise.all([getDepartments(), getDoctors()])
      setDepartments(Array.isArray(departmentData) ? departmentData : [])
      setDoctors(Array.isArray(doctorData) ? doctorData : [])
    } catch (error) {
      addToast({ title: 'Failed to fetch departments', description: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const validate = () => {
    const next = {}
    if (!values.name.trim()) next.name = 'Department name is required'
    if (!values.code.trim()) next.code = 'Department code is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      await createDepartment({ name: values.name.trim(), code: values.code.trim() })
      addToast({ title: 'Department created', description: `${values.name.trim()} has been added.` })
      setValues(defaultValues)
      setErrors({})
      await fetchData()
    } catch (error) {
      addToast({ title: 'Create department failed', description: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const departmentRows = useMemo(() => {
    return departments.map((department) => {
      const members = doctors.filter((doctor) => Number(doctor.department_id) === Number(department.department_id))
      return {
        ...department,
        members,
        memberCount: members.length,
      }
    })
  }, [departments, doctors])

  return (
    <div className="space-y-4">
      <Card title="Department Management" description="Create departments and view department-wise doctor allocation">
        <form onSubmit={onSubmit} className="grid gap-3 border border-zinc-200 bg-zinc-50 p-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Department Name</label>
            <input name="name" value={values.name} onChange={onChange} placeholder="Cardiology" className={inputClass} />
            {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Department Code</label>
            <input name="code" value={values.code} onChange={onChange} placeholder="CARD" className={inputClass} />
            {errors.code ? <p className="mt-1 text-xs text-red-600">{errors.code}</p> : null}
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" isLoading={isSubmitting}>
              Create Department
            </Button>
            <Button type="button" variant="secondary" onClick={fetchData} isLoading={isLoading}>
              <RefreshCw className="size-4" />
              Refresh
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Existing Departments" description="Count and names of doctors assigned in each department">
        {departmentRows.length === 0 ? (
          <p className="text-sm text-zinc-500">No departments found.</p>
        ) : (
          <div className="space-y-3">
            {departmentRows.map((department) => (
              <section key={department.department_id} className="border border-zinc-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-zinc-500" />
                    <p className="text-sm font-semibold text-zinc-900">{department.name}</p>
                  </div>
                  <p className="text-xs font-medium text-zinc-600">Total doctors: {department.memberCount}</p>
                </div>

                {department.members.length === 0 ? (
                  <p className="pt-3 text-sm text-zinc-500">No doctor assigned yet.</p>
                ) : (
                  <div className="space-y-2 pt-3">
                    {department.members.map((member) => (
                      <div key={member.user_id} className="flex items-center justify-between bg-zinc-50 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <UserRound className="size-4 text-zinc-500" />
                          <p className="text-sm font-medium text-zinc-800">{member.name}</p>
                        </div>
                        <p className="text-xs text-zinc-500">{member.email}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default DepartmentsPage
