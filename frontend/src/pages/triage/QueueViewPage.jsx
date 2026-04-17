import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Table from '../../components/Table'
import Badge from '../../components/Badge'
import { getQueue } from '../../services/triageService'
import { getErrorMessage } from '../../utils/helpers'
import { useToast } from '../../context/ToastContext'

function QueueViewPage() {
  const { addToast } = useToast()
  const [queue, setQueue] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchQueue = async () => {
    setIsLoading(true)
    try {
      const data = await getQueue()
      setQueue(data)
    } catch (error) {
      addToast({ title: 'Queue fetch failed', description: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue()
  }, [])

  const columns = [
    { key: 'token', title: 'Token #' },
    { key: 'name', title: 'Patient Name' },
    { key: 'department_name', title: 'Department' },
    {
      key: 'assigned_doctor_name',
      title: 'Assigned To',
      render: (row) => row.assigned_doctor_name ? `Dr. ${row.assigned_doctor_name}` : 'Not assigned',
    },
    {
      key: 'status',
      title: 'Status',
      render: (row) => <Badge variant="info">{row.status || 'WAITING'}</Badge>,
    },
    {
      key: 'doctor_queue_avg_wait_time',
      title: 'Doctor Avg Wait',
      render: (row) => `${row.doctor_queue_avg_wait_time ?? 0} min`,
    },
    {
      key: 'estimated_wait_time',
      title: 'Est. Wait',
      render: (row) => `${row.estimated_wait_time} min`,
    },
  ]

  return (
    <Card title="Queue View" description="Live waiting queue with doctor assignment and wait times">
      <div className="mb-4 flex justify-end">
        <Button variant="secondary" onClick={fetchQueue} isLoading={isLoading}>
          <RefreshCw className="size-4" />
          Refresh Queue
        </Button>
      </div>
      <Table columns={columns} data={queue} emptyText="Queue is empty. New patients will appear here." />
    </Card>
  )
}

export default QueueViewPage
