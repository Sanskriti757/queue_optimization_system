import api from './api'

export const login = async (payload) => {
  const { data } = await api.post('/user/login', payload)
  return data
}

export const getMe = async () => {
  const { data } = await api.get('/user/me')
  return data
}

export const logout = async () => {
  const { data } = await api.post('/user/logout')
  return data
}
