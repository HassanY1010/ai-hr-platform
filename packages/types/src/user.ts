// packages/types/src/user.ts
export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'ADMIN' | 'SUPER_ADMIN'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  dashboardUrl?: string
  avatar?: string
  companyId: string
  department?: string
  position?: string
  joinDate: string
  isActive: boolean
  lastLogin?: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  language: 'ar' | 'en'
  notifications: {
    email: boolean
    push: boolean
    dailyReminder: boolean
  }
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe: boolean
}