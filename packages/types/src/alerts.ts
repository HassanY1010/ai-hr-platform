// packages/types/src/alerts.ts
export interface RiskAlert {
    id: string
    type: 'high_turnover' | 'low_engagement' | 'performance_drop' | 'burnout_risk'
    level: 'low' | 'medium' | 'high' | 'critical'
    employeeId?: string
    department?: string
    message: string
    metadata?: Record<string, any>
    createdAt: Date
    resolvedAt?: Date
}
