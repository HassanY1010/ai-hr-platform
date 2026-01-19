// packages/services/src/admin.service.ts
import { apiClient } from './api-client'
import { logger } from '@hr/utils'

export interface AIUsageLog {
    id: string
    companyName: string
    model: string
    tokens: number
    cost: number
    timestamp: string | Date
}

class AdminService {
    async getAIUsage(): Promise<AIUsageLog[]> {
        logger.info('Fetching AI usage logs')
        const response = await apiClient.get<AIUsageLog[]>('/admin/ai-usage')
        return response
    }

    async getAuditLogs(): Promise<any> {
        logger.info('Fetching system-wide audit logs')
        return apiClient.get('/admin/audit-logs')
    }

    async toggleFeature(featureName: string, enabled: boolean): Promise<any> {
        logger.info('Toggling feature flag', { featureName, enabled })
        return apiClient.post('/admin/feature-toggle', { featureName, enabled })
    }

    async triggerKillSwitch(active: boolean): Promise<any> {
        logger.warn('TRIGGERING EMERGENCY KILL SWITCH', { active })
        return apiClient.post('/admin/kill-switch', { active })
    }

    async getSecurityStats(): Promise<any> {
        logger.info('Fetching security statistics')
        return apiClient.get('/admin/security-stats')
    }

    async analyzeSecurityRisk(logs: any[]): Promise<any> {
        logger.info('Analyzing security risk with AI')
        // In a real scenario, this would call a dedicated AI endpoint
        // For now, it's handled by our ai-service integrated into the admin controllers or via a proxy
        return apiClient.post('/admin/security-stats/analyze', { logs })
    }

    async clearCache(): Promise<any> {
        logger.warn('Clearing system cache')
        return apiClient.post('/admin/clear-cache')
    }

    async getFeatureFlags(): Promise<any> {
        logger.info('Fetching global feature flags')
        return apiClient.get('/admin/feature-flags')
    }

    async assessFeatureImpact(id: string): Promise<any> {
        logger.info('Assessing feature impact with AI', { id })
        return apiClient.get(`/admin/feature-flags/${id}/assess`)
    }

    async analyzeLogs(logs: any[]): Promise<any> {
        logger.info('Performing AI anomaly detection on logs')
        return apiClient.post('/admin/audit-logs/analyze', { logs })
    }
}




export const adminService = new AdminService()
