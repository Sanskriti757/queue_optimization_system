import { useCallback, useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Table from '../../components/Table'
import { getAllPatients } from '../../services/adminService'
import { getErrorMessage } from '../../utils/helpers'
import { useToast } from '../../context/ToastContext'

function AdminAllPatientsPage() {
  const { addToast } = useToast()
  const [patients, setPatients] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchPatients = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getAllPatients()
      setPatients(Array.isArray(data) ? data : [])
    } catch (error) {
      addToast({ title: 'Unable to load patients', description: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  const columns = useMemo(
    () => [
      {
        key: 'token_number',
        title: 'Token',
        render: (row) => `#${row.token_number || '—'}`,
      },
      { key: 'name', title: 'Patient' },
      {
        key: 'age_gender',
        title: 'Age / Gender',
        render: (row) => `${row.age || '—'} · ${row.gender || '—'}`,
      },
      {
        key: 'status',
        title: 'Status',
      },
      {
        key: 'assigned_doctor_name',
        title: 'Assigned Doctor',
        render: (row) => row.assigned_doctor_name || 'Not assigned',
      },
      {
        key: 'created_at',
        title: 'Created',
        render: (row) => (row.created_at ? new Date(row.created_at).toLocaleString() : '—'),
      },
    ],
    [],
  )

  return (
    <Card title="All Patients" description="Complete patient list with assigned doctor names">
      <div className="mb-4 flex justify-end">
        <Button variant="secondary" onClick={fetchPatients} isLoading={isLoading}>
          <RefreshCw className="size-4" />
          Refresh
        </Button>
      </div>
      <Table columns={columns} data={patients} emptyText="No patients found in database." />
    </Card>
  )
}

export default AdminAllPatientsPage
