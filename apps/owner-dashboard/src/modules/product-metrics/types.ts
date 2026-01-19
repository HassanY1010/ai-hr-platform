// Product Metrics Types
export interface ProductMetric {
    id: string
    name: string
    value: number | string
    change: string
    trend: 'up' | 'down' | 'stable'
    icon?: any
}

export interface FeatureAdoption {
    featureName: string
    adoptionRate: number
    activeUsers: number
    totalUsers: number
    trend: 'up' | 'down' | 'stable'
    lastUpdated: string
}

export interface UserEngagement {
    metric: string
    value: string
    change: string
    trend: 'up' | 'down' | 'stable'
    description: string
}

export interface PerformanceMetric {
    name: string
    value: number
    unit: string
    target: number
    status: 'good' | 'warning' | 'critical'
    trend: 'up' | 'down' | 'stable'
}

export interface UsageData {
    date: string
    activeUsers: number
    sessions: number
    avgSessionDuration: number
}
