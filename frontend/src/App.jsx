import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import RoleRoute from './routes/RoleRoute.jsx'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import CreateUserPage from './pages/admin/CreateUserPage.jsx'
import ManageUsersPage from './pages/admin/ManageUsersPage.jsx'
import AdminAllPatientsPage from './pages/admin/AdminAllPatientsPage.jsx'
import DepartmentsPage from './pages/admin/DepartmentsPage.jsx'
import TriageDashboardPage from './pages/triage/TriageDashboardPage.jsx'
import RegisterPatientPage from './pages/triage/RegisterPatientPage.jsx'
import QueueViewPage from './pages/triage/QueueViewPage.jsx'
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage.jsx'
import CurrentPatientPage from './pages/doctor/CurrentPatientPage.jsx'
import QueueListPage from './pages/doctor/QueueListPage.jsx'
import { useAuth } from './context/AuthContext.jsx'
import ToastContainer from './components/ToastContainer.jsx'

function RoleHomeRedirect() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />
  if (user.role === 'TRIAGE') return <Navigate to="/triage" replace />
  return <Navigate to="/doctor" replace />
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<RoleHomeRedirect />} />

          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="create-user" element={<CreateUserPage />} />
              <Route path="departments" element={<DepartmentsPage />} />
              <Route path="manage-users" element={<ManageUsersPage />} />
              <Route path="all-patients" element={<AdminAllPatientsPage />} />
            </Route>
          </Route>

          <Route element={<RoleRoute allowedRoles={['TRIAGE']} />}>
            <Route path="/triage" element={<DashboardLayout />}>
              <Route index element={<TriageDashboardPage />} />
              <Route path="register-patient" element={<RegisterPatientPage />} />
              <Route path="queue" element={<QueueViewPage />} />
            </Route>
          </Route>

          <Route element={<RoleRoute allowedRoles={['DOCTOR']} />}>
            <Route path="/doctor" element={<DashboardLayout />}>
              <Route index element={<DoctorDashboardPage />} />
              <Route path="current-patient" element={<CurrentPatientPage />} />
              <Route path="queue" element={<QueueListPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
