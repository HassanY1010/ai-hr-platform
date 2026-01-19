import { apiClient } from './api-client';

class AlertService {
    async getAll() {
        return apiClient.get('/alerts');
    }

    async getStats() {
        return apiClient.get('/alerts/stats');
    }

    async resolve(id: string) {
        return apiClient.post(`/alerts/${id}/resolve`);
    }
}

export const alertService = new AlertService();
