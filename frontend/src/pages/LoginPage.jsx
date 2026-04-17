import { useState } from 'react'
import { Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/helpers'
import { useToast } from '../context/ToastContext'

function LoginPage() {
  const navigate = useNavigate()
  const { loginUser } = useAuth()
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const next = {}
    if (!values.email.trim()) next.email = 'Email is required'
    if (!values.password.trim()) next.password = 'Password is required'
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
      const me = await loginUser(values)
      addToast({ title: 'Login successful', description: `Welcome, ${me.name}.` })
      if (me.role === 'ADMIN') navigate('/admin', { replace: true })
      else if (me.role === 'TRIAGE') navigate('/triage', { replace: true })
      else navigate('/doctor', { replace: true })
    } catch (error) {
      addToast({ title: 'Login failed', description: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent p-5">
      <Card className="w-full max-w-md rounded-3xl p-6 md:p-7">
        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-zinc-900 text-white">
            <Activity className="size-5" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">mediQ</h1>
          <p className="mt-1 text-sm text-slate-500">Hospital Queue Management</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@hospital.com"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default LoginPage
