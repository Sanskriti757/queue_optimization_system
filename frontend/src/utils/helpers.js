export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const isHighPriority = (priority) => Number(priority) >= 8

export const formatRole = (role = '') =>
  role.charAt(0) + role.slice(1).toLowerCase()

export const getErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.response?.data?.detail || error?.message || fallback

export const getSeverityVitals = (severity) => {
  const map = {
    LOW: {},
    MEDIUM: { heart_rate: 105 },
    HIGH: { oxygen_lvl: 88, heart_rate: 120, body_temperature: 101.5 },
    CRITICAL: { oxygen_lvl: 82, heart_rate: 130, body_temperature: 103.2 },
  }
  return map[severity] || {}
}
