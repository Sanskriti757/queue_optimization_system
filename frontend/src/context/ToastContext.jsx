import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(
    ({ title, description = '', variant = 'success' }) => {
      const id = crypto.randomUUID()
      setToasts((prev) => [...prev, { id, title, description, variant }])
      setTimeout(() => removeToast(id), 3200)
    },
    [removeToast],
  )

  const value = useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
