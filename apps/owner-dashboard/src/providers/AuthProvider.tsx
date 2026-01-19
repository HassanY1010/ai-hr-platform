// apps/owner-dashboard/src/providers/AuthProvider.tsx
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
                // Check for token from Landing Page redirect
                const searchParams = new URLSearchParams(window.location.search);
                const accessToken = searchParams.get('access_token');
                const userParam = searchParams.get('user');

                if (accessToken && userParam) {
                    localStorage.setItem('token', accessToken);
                    localStorage.setItem('user', userParam);
                    // Also clear face verification status on new login
                    localStorage.removeItem('faceVerified');

                    // Clean URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                }

                const currentUser = authService.getCurrentUser()
                const isAuth = authService.isAuthenticated()

                if (currentUser && isAuth) {
                    if (currentUser.role === 'SUPER_ADMIN') {
                        setUser(currentUser)

                        // Check Face Verification
                        const isVerified = localStorage.getItem('faceVerified') === 'true'

                        if (!isVerified) {
                            if (window.location.pathname !== '/face-verify') {
                                navigate('/face-verify', { replace: true })
                            }
                        } else {
                            // If verified and at login, go to overview
                            if (window.location.pathname === '/login') {
                                navigate('/', { replace: true })
                            }
                        }
                    } else {
                        // Wrong role
                        logout() // Use logout to clear state and redirect
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

            if (response.user.role !== 'SUPER_ADMIN') {
                throw new Error('Unauthorized: Admin access only')
            }

            setUser(response.user)
            const isVerified = localStorage.getItem('faceVerified') === 'true'
            navigate(isVerified ? '/' : '/face-verify')
        } catch (error) {
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        await authService.logout()
        setUser(null)
        localStorage.removeItem('faceVerified')
        // Redirect to Landing Page (port 3005 in dev)
        window.location.href = 'http://localhost:3005'
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
