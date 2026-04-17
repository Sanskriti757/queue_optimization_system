import { useCallback, useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import Card from '../../components/Card'
import Table from '../../components/Table'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import { getDoctors, getTriageNurses } from '../../services/adminService'
import { getErrorMessage } from '../../utils/helpers'
import { useToast } from '../../context/ToastContext'

function ManageUsersPage() {
  const { addToast } = useToast()
  const [doctors, setDoctors] = useState([])
  const [triageNurses, setTriageNurses] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const [doctorData, triageData] = await Promise.all([getDoctors(), getTriageNurses()])
      setDoctors(Array.isArray(doctorData) ? doctorData : [])
      setTriageNurses(Array.isArray(triageData) ? triageData : [])
    } catch (error) {
      addToast({ title: 'Failed to fetch users', description: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const doctorColumns = useMemo(
    () => [
      { key: 'user_id', title: 'ID' },
      { key: 'name', title: 'Doctor Name' },
      { key: 'email', title: 'Email' },
      {
        key: 'department_id',
        title: 'Department',
        render: (row) => row.department_name || (row.department_id ? `Department ${row.department_id}` : 'N/A'),
      },
      {
        key: 'role',
        title: 'Role',
        render: () => <Badge variant="success">DOCTOR</Badge>,
      },
    ],
    [],
  )

  const triageColumns = useMemo(
    () => [
      { key: 'user_id', title: 'ID' },
      { key: 'name', title: 'Nurse Name' },
      { key: 'email', title: 'Email' },
      {
        key: 'role',
        title: 'Role',
        render: (row) => <Badge variant="warning">{row.role || 'TRIAGE'}</Badge>,
      },
    ],
    [],
  )

  return (
    <div className="space-y-4">
      <Card title="Manage Users" description="Doctors and triage nurses from backend routes">
        <div className="mb-4 flex justify-end">
          <Button variant="secondary" onClick={fetchUsers} isLoading={isLoading}>
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-zinc-900">Doctors</h3>
            <Table columns={doctorColumns} data={doctors} emptyText="No doctors found from /user/doctors." />
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-zinc-900">Triage Nurses</h3>
            <Table columns={triageColumns} data={triageNurses} emptyText="No triage nurses found from /user/triage-nurses." />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ManageUsersPage
