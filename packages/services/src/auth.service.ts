// packages/services/src/auth.service.ts
import { apiClient } from './api-client'
import type { User, LoginCredentials } from '@hr/types'
import { logger } from '@hr/utils'

export interface LoginResponse {
  user: User
  token: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  companyName?: string
  companyId?: string
  role: string
}

class AuthService {
  constructor() {
    this.syncSessionFromUrl()
  }

  /**
   * Syncs auth data from URL parameters if present.
   * Useful for cross-origin redirection from landing page.
   */
  private syncSessionFromUrl(): void {
    if (typeof window === 'undefined') return

    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('access_token')
    const userJson = urlParams.get('user')

    if (token && userJson) {
      try {
        localStorage.setItem('access_token', token)
        localStorage.setItem('user', userJson)

        // Clean up URL to keep it pretty and secure
        const newUrl = window.location.pathname + window.location.hash
        window.history.replaceState({}, '', newUrl)

        logger.info('Session synchronized from URL successfully')
      } catch (error) {
        logger.error('Failed to sync session from URL', error)
      }
    }
  }
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    logger.info('Login attempt', { email: credentials.email })

    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials)

      localStorage.setItem('access_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      logger.info('Login successful', { userId: response.user.id })
      return response
    } catch (error) {
      logger.error('Login failed', error)
      throw error
    }
  }

  async register(data: RegisterData): Promise<LoginResponse> {
    logger.info('Registration attempt', { email: data.email })

    try {
      const response = await apiClient.post<LoginResponse>('/auth/register', data)

      localStorage.setItem('access_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      logger.info('Registration successful', { userId: response.user.id })
      return response
    } catch (error) {
      logger.error('Registration failed', error)
      throw error
    }
  }

  async logout(): Promise<void> {
    const user = this.getCurrentUser()

    try {
      await apiClient.post('/auth/logout')
      logger.info('Logout successful', { userId: user?.id })
    } catch (error) {
      logger.warn('Logout API failed, clearing local storage', error)
    } finally {
      this.clearAuth()
    }
  }

  async forgotPassword(email: string): Promise<{ role: string; contactEmail: string | null; contactRole: string | null }> {
    logger.info('Forgot password request', { email })
    const response = await apiClient.post<any>('/auth/forgot-password', { email })
    return response.data
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    logger.info('Reset password attempt')
    await apiClient.post('/auth/reset-password', { token, newPassword })
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiClient.post<{ token: string }>('/auth/refresh')
    localStorage.setItem('access_token', response.token)
    return response
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null

    try {
      return JSON.parse(userStr) as User
    } catch {
      return null
    }
  }

  getToken(): string | null {
    return localStorage.getItem('access_token')
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser()
  }

  clearAuth(): void {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }
  async registerCompany(data: { companyName: string; email: string; password: string; fullName: string; employeeCount: number; language: string; subscriptionCode: string }): Promise<LoginResponse> {
    logger.info('Company registration attempt', { email: data.email, companyName: data.companyName })

    try {
      const payload = {
        name: data.fullName,
        email: data.email,
        password: data.password,
        companyName: data.companyName,
        employeeCount: data.employeeCount,
        language: data.language,
        role: 'MANAGER',
        subscriptionCode: data.subscriptionCode
      }
      logger.info('API Request Payload', payload)
      const response = await apiClient.post<LoginResponse>('/auth/signup-company', payload)

      localStorage.setItem('access_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      logger.info('Company registration successful', { userId: response.user.id })
      return response
    } catch (error) {
      logger.error('Company registration failed', error)
      throw error
    }
  }
}

export const authService = new AuthService()