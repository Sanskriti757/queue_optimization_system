import axios from 'axios'

const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1'
const defaultBaseURL = `http://${hostname}:8000`

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultBaseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
