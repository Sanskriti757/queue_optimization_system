import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Pages
import Home from './pages/Home'
import Login from './pages/users/Login'
import AdminDashboard from './pages/admin/Dashboard'
import CreateUser from './pages/admin/CreateUser'
import TriageDashboard from './pages/triage/Dashboard'
import DoctorDashboard from './pages/doctor/Dashboard'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth()
  
  if (!user) return <Navigate to="/login" replace />
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />
  }
  return children
}

const App = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-gray-500">
        Checking session...
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes - No Navbar/Login buttons */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Auth Routes - Login/Signup only */}
      <Route element={<AuthLayout />}>
        <Route 
          path="/login" 
          element={
            !user ? <Login /> : <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />
          } 
        />
      </Route>

      {/* Admin Routes */}
      <Route element={<DashboardLayout />}>
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/create-user" 
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <CreateUser />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Triage Routes */}
      <Route element={<DashboardLayout />}>
        <Route 
          path="/triage/dashboard" 
          element={
            <ProtectedRoute allowedRole="TRIAGE">
              <TriageDashboard />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Doctor Routes */}
      <Route element={<DashboardLayout />}>
        <Route 
          path="/doctor/dashboard" 
          element={
            <ProtectedRoute allowedRole="DOCTOR">
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App