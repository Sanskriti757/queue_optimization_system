import api from './api'

export const createUser = async (payload) => {
  const { data } = await api.post('/user/create', payload)
  return data
}

export const listUsers = async () => {
  const [doctors, triageNurses] = await Promise.all([getDoctors(), getTriageNurses()])
  return [...doctors, ...triageNurses]
}

export const getDepartments = async () => {
  const { data } = await api.get('/department/all')
  return data
}

export const getAdminStats = async () => {
  const [users, queue] = await Promise.all([listUsers(), getPatientQueue()])

  return {
    totalUsers: users?.length || 0,
    totalPatients: queue?.length || 0,
    activeQueue: queue?.length || 0,
  }
}

export const getDoctors = async () => {
  try {
    const { data } = await api.get('/user/doctors')
    return Array.isArray(data) ? data : []
  } catch (error) {
    if ([403, 404].includes(error?.response?.status)) return []
    throw error
  }
}

export const getTriageNurses = async () => {
  try {
    const { data } = await api.get('/user/triage-nurses')
    return Array.isArray(data) ? data : []
  } catch (error) {
    if ([403, 404].includes(error?.response?.status)) return []
    throw error
  }
}

export const getPatientQueue = async () => {
  try {
    const { data } = await api.get('/patients/queue')
    return Array.isArray(data) ? data : []
  } catch (error) {
    if ([403, 404].includes(error?.response?.status)) return []
    throw error
  }
}

export const getAdminDashboardData = async () => {
  const [doctors, triageNurses, analytics, allPatients] = await Promise.all([
    getDoctors(),
    getTriageNurses(),
    getAdminAnalytics(),
    getAllPatients(),
  ])
  return {
    doctors,
    triageNurses,
    queue: [],
    analytics,
    allPatients,
    users: [...doctors, ...triageNurses],
  }
}

export const getAdminAnalytics = async () => {
  try {
    const { data } = await api.get('/user/admin-analytics')
    return data || {}
  } catch (error) {
    if ([403, 404].includes(error?.response?.status)) return {}
    throw error
  }
}

export const getAllPatients = async () => {
  try {
    const { data } = await api.get('/patients/all')
    return Array.isArray(data) ? data : []
  } catch (error) {
    if ([403, 404].includes(error?.response?.status)) return []
    throw error
  }
}
