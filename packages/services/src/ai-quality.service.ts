import { apiClient } from './api-client';

export interface AIModelQuality {
    id: string;
    modelName: string;
    accuracy: number;
    precision: number;
    recall: number;
    latency: number;
    costPerRequest: number;
    status: string;
    lastUpdated: string;
}

export interface AIQualityAnalysis {
    overallScore: number;
    insights: string[];
    recommendations: string[];
}

class AIQualityService {
    async getMetrics(): Promise<AIModelQuality[]> {
        const response: any = await apiClient.get('/ai-quality');
        return response.data || response;
    }

    async analyzeQuality(): Promise<AIQualityAnalysis> {
        const response: any = await apiClient.get('/ai-quality/analyze');
        return response.data || response;
    }

    async getTestResults(): Promise<any[]> {
        const response: any = await apiClient.get('/ai-quality/tests');
        return response.data || response;
    }

    async getImprovements(): Promise<any[]> {
        const response: any = await apiClient.get('/ai-quality/improvements');
        return response.data || response;
    }
}

export const aiQualityService = new AIQualityService();
