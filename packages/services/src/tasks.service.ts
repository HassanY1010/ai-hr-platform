import { apiClient } from './api-client';

export interface TaskType {
    id: string;
    title: string;
    description: string;
    projectId?: string;
    project?: { name: string };
    employeeId?: string;
    employee?: { id: string, user: { name: string, avatar: string } };
    status: 'pending' | 'in_progress' | 'review' | 'completed';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    dueDate?: string;
    estimatedTime?: number;
    actualTime?: number;
    progress?: number;
    aiScore?: number;
    aiRecommendation?: string;
    attachments?: any[];
    tags?: string[];
}

export const tasksService = {
    getAll: async (params?: { projectId?: string, employeeId?: string, status?: string, search?: string }) => {
        const response = await apiClient.get<{ status: string, data: { tasks: TaskType[] } }>('/tasks', { params });
        return response.data.tasks;
    },

    create: async (data: Partial<TaskType>) => {
        const response = await apiClient.post<{ status: string, data: { task: TaskType } }>('/tasks', data);
        return response.data;
    },

    update: async (id: string, data: Partial<TaskType>) => {
        const response = await apiClient.patch<{ status: string, data: { task: TaskType } }>(`/tasks/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/tasks/${id}`);
    },

    generateSuggestions: async (data: { projectId?: string, description: string }) => {
        const response = await apiClient.post<{ status: string, data: { suggestions: any[] } }>('/tasks/generate', data);
        return response.data.suggestions;
    }
};
