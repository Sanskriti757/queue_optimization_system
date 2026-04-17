import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Table from '../../components/Table'
import Badge from '../../components/Badge'
import { useAuth } from '../../context/AuthContext'
import { getDoctorQueue } from '../../services/doctorService'
import { getErrorMessage, isHighPriority } from '../../utils/helpers'
import { useToast } from '../../context/ToastContext'

function QueueListPage() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [queue, setQueue] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchQueue = async () => {
    setIsLoading(true)
    try {
      const data = await getDoctorQueue(user.user_id)
      setQueue(data)
    } catch (error) {
      addToast({ title: 'Queue fetch failed', description: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue()
  }, [user.user_id])

  const columns = [
    { key: 'token_number', title: 'Token #' },
    { key: 'name', title: 'Patient' },
    {
      key: 'priority_score',
      title: 'Priority',
      render: (row) => <Badge variant={isHighPriority(row.priority_score) ? 'danger' : 'warning'}>{row.priority_score}</Badge>,
    },
    {
      key: 'status',
      title: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'IN_TREATMENT' ? 'info' : 'warning'}>
          {row.status === 'IN_TREATMENT' ? 'IN TREATMENT' : 'WAITING'}
        </Badge>
      ),
    },
    { key: 'symptoms', title: 'Symptoms' },
  ]

  return (
    <Card title="Queue List" description="Assigned queue for your consultation">
      <div className="mb-4 flex justify-end">
        <Button variant="secondary" onClick={fetchQueue} isLoading={isLoading}>
          <RefreshCw className="size-4" />
          Refresh
        </Button>
      </div>
      <Table columns={columns} data={queue} emptyText="No waiting patients assigned right now." />
    </Card>
  )
}

export default QueueListPage
