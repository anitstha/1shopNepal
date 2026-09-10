/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi, uploadApi } from '../services/api'
import { saveToken, getToken, removeToken } from '../utils/auth'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => !!getToken())

  useEffect(() => {
    if (!getToken()) return

    let active = true

    authApi
      .getMe()
      .then((data) => {
        if (active) setUser(data)
      })
      .catch(() => {
        if (active) {
          removeToken()
          setUser(null)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials)
    saveToken(data.token)
    setUser(data)
    return data
  }, [])

  const register = useCallback(async (userData) => {
    const data = await authApi.register(userData)
    saveToken(data.token)
    setUser(data)
    return data
  }, [])

  const logout = useCallback(() => {
    removeToken()
    setUser(null)
  }, [])

  const updateUser = useCallback(async (data) => {
    const updated = await authApi.updateProfile(data)
    setUser((prev) => (prev ? { ...prev, ...updated } : updated))
    return updated
  }, [])

  const updateProfileImage = useCallback(async (file) => {
    const updated = await uploadApi.uploadProfileImage(file)
    setUser((prev) => (prev ? { ...prev, ...updated } : updated))
    return updated
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        updateProfileImage,
        isAuthenticated: !!user,
        isAdmin: !!user && user.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
