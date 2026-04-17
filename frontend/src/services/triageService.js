import api from './api'

export const registerPatient = async (payload) => {
  const { data } = await api.post('/patients/register', payload)
  return data
}

export const getQueue = async () => {
  const { data } = await api.get('/patients/queue')
  return data
}

export const getDepartments = async () => {
  const { data } = await api.get('/department/all')
  return data
}
