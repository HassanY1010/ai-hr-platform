import { apiClient } from './api-client';

export interface ProjectType {
    id: string;
    name: string;
    description: string;
    managerId?: string;
    manager?: { id: string, user: { name: string, avatar: string } };
    startDate?: string;
    deadline?: string;
    status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    budget?: number;
    spent?: number;
    progress?: number;
    tasksCount?: number;
    completedTasks?: number;
    aiRecommendation?: string;
}

export const projectsService = {
    getAll: async (params?: { status?: string, search?: string }): Promise<{ projects: ProjectType[], stats?: any }> => {
        const response = await apiClient.get<{ status: string, data: { projects: ProjectType[], stats?: any } }>('/projects', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get<{ status: string, data: { project: ProjectType } }>(`/projects/${id}`);
        return response.data.project;
    },

    create: async (data: Partial<ProjectType>) => {
        const response = await apiClient.post<{ status: string, data: { project: ProjectType } }>('/projects', data);
        return response.data;
    },

    update: async (id: string, data: Partial<ProjectType>) => {
        const response = await apiClient.patch<{ status: string, data: { project: ProjectType } }>(`/projects/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/projects/${id}`);
    },

    generateRiskAnalysis: async (id: string) => {
        const response = await apiClient.post<{ status: string, data: any }>(`/projects/${id}/generate-risk-analysis`);
        return response.data;
    }
};
