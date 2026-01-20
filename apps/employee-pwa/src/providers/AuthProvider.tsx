// apps/employee-pwa/src/providers/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '@hr/types'
import { authService } from '@hr/services'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser()
        const isAuth = authService.isAuthenticated()

        if (currentUser && isAuth) {
          if (currentUser.role === 'EMPLOYEE') {
            setUser(currentUser)
            // If we are at login, go to home
            if (window.location.pathname === '/login') {
              navigate('/', { replace: true })
            }
          } else {
            // Wrong role
            navigate('/login', { replace: true })
          }
        } else {
          // Not authenticated
          if (window.location.pathname !== '/login') {
            navigate('/login', { replace: true })
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        navigate('/login', { replace: true })
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [navigate])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authService.login({
        email,
        password,
        rememberMe: true
      })

      if (response.user.role !== 'EMPLOYEE') {
        throw new Error('Unauthorized: Employee access only')
      }

      setUser(response.user)
      navigate('/')
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
    // Redirect to Landing Page
    const landingPageUrl = (import.meta as any).env.VITE_LANDING_PAGE_URL || 'http://localhost:3005'
    window.location.href = landingPageUrl
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}