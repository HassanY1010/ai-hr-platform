// packages/types/src/company.ts
export interface Company {
  id: string
  name: string
  domain: string
  industry: string
  size: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+'
  logo?: string
  subscription: Subscription
  settings: CompanySettings
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface Subscription {
  id: string
  companyId: string
  plan: 'starter' | 'professional' | 'enterprise' | 'custom'
  status: 'active' | 'past_due' | 'canceled' | 'expired'
  seats: number
  usedSeats: number
  features: string[]
  limits: {
    monthlyAIRequests: number
    storageGB: number
    maxEmployees: number
    supportLevel: 'basic' | 'priority' | 'dedicated'
  }
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  metadata: Record<string, any>
}

export interface CompanySettings {
  timezone: string
  locale: string
  workingDays: number[]
  workingHours: {
    start: string
    end: string
  }
  holidays: Array<{
    date: string
    name: string
  }>
  notifications: {
    managerAlerts: boolean
    dailyDigest: boolean
    weeklyReport: boolean
  }
  aiSettings: {
    enabled: boolean
    riskDetection: boolean
    recruitment: boolean
    training: boolean
    privacyLevel: 'basic' | 'enhanced' | 'strict'
  }
}