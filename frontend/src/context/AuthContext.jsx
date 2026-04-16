import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getMe, login, logout } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    const me = await getMe()
    setUser(me)
    return me
  }

  const loginUser = async (payload) => {
    await login(payload)
    return refreshUser()
  }

  const logoutUser = async () => {
    await logout()
    setUser(null)
  }

  useEffect(() => {
    const init = async () => {
      try {
        await refreshUser()
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      setUser,
      refreshUser,
      loginUser,
      logoutUser,
      isAuthenticated: Boolean(user),
    }),
    [user, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
