import { apiClient } from './api-client';
import type {
    DashboardStats,
    SystemStats,
    SystemHealth,
    AuditLog,
    RecruitmentFunnel,
    EmployeePerformanceAnalytics,
    ThirtyXThreeInsights
} from '@hr/types';

class AnalyticsService {
    async getDashboardStats(): Promise<DashboardStats> {
        const response = await apiClient.get<{ status: string, data: DashboardStats }>('/manager/overview');
        return response.data;
    }

    async getSystemStats(): Promise<SystemStats> {
        const response = await apiClient.get<{ status: string, data: SystemStats }>('/analytics/system-stats');
        return response.data;
    }

    async getSystemHealth(): Promise<SystemHealth> {
        const response = await apiClient.get<{ status: string, data: SystemHealth }>('/analytics/system-health');
        return response.data;
    }

    async analyzeSystemPerformance(metrics: any): Promise<any> {
        const response = await apiClient.post<{ status: string, data: any }>('/analytics/system-health/analyze', { metrics });
        return response.data;
    }

    async getAuditLogs(): Promise<AuditLog[]> {
        const response = await apiClient.get<{ status: string, data: AuditLog[] }>('/analytics/audit-logs');
        return response.data;
    }

    async getEmployeePerformance(id: string): Promise<EmployeePerformanceAnalytics> {
        const response = await apiClient.get<{ status: string, data: EmployeePerformanceAnalytics }>(`/analytics/employee/${id}`);
        return response.data;
    }

    async getRecruitmentFunnel(): Promise<RecruitmentFunnel> {
        const response = await apiClient.get<{ status: string, data: RecruitmentFunnel }>('/analytics/recruitment');
        return response.data;
    }

    async get30x3Insights(timeframe: 'weekly' | 'monthly' = 'monthly'): Promise<ThirtyXThreeInsights> {
        const response = await apiClient.get<{ status: string, data: ThirtyXThreeInsights }>(`/manager/insights/30x3?timeframe=${timeframe}`);
        return response.data;
    }

    async getEmployeeTrends(): Promise<any> {
        const response = await apiClient.get<{ status: string, data: any }>('/analytics/trends');
        return response.data;
    }

    async getTrainingAnalytics(): Promise<any> {
        const response = await apiClient.get<{ status: string, data: any }>('/analytics/training');
        return response.data;
    }

    async getProductMetrics(): Promise<any[]> {
        const response = await apiClient.get<any>('/analytics/product');
        return response.data || response;
    }

    async analyzeProductMetrics(): Promise<any> {
        const response = await apiClient.post<any>('/analytics/product/analyze', {});
        return response.data || response;
    }

    async getFinanceStats(): Promise<any> {
        const response = await apiClient.get<any>('/analytics/finance');
        return response.data || response;
    }

    async analyzeFinance(): Promise<any> {
        const response = await apiClient.post<any>('/analytics/finance/analyze', {});
        return response.data || response;
    }

    async generateStrategicReport(): Promise<any> {
        const response = await apiClient.get<any>('/analytics/strategic-report');
        return response.data || response;
    }
    async getCompetitionStats(): Promise<any> {
        const response = await apiClient.get<any>('/analytics/competition');
        return response.data || response;
    }

    async getGrowthStats(): Promise<any> {
        const response = await apiClient.get<any>('/analytics/growth');
        return response.data || response;
    }

    async getUserGrowthHistory(): Promise<any> {
        const response = await apiClient.get<any>('/analytics/user-growth-history');
        return response.data || response;
    }
}

export const analyticsService = new AnalyticsService();
