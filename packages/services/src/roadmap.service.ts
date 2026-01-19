import { apiClient } from './api-client';

export interface RoadmapData {
    roadmapItems: any[];
    milestones: any[];
    features: any[];
}

class RoadmapService {
    async getRoadmap() {
        return apiClient.get<RoadmapData>('/roadmap');
    }

    async createItem(data: any) {
        return apiClient.post('/roadmap/items', data);
    }

    async updateItem(id: string, data: any) {
        return apiClient.patch(`/roadmap/items/${id}`, data);
    }

    async analyze() {
        return apiClient.post('/roadmap/analyze');
    }
}

export const roadmapService = new RoadmapService();
