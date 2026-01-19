import { apiClient } from './api-client';

class TrainingService {
    async getCourses() {
        return apiClient.get('/training/courses');
    }

    async getEnrolledCourses() {
        return apiClient.get('/training/my-courses');
    }

    async enroll(courseId: string) {
        return apiClient.post(`/training/enroll/${courseId}`);
    }

    async getCourseDetails(id: string) {
        return apiClient.get(`/training/courses/${id}`);
    }

    async getTrainingNeeds() {
        return apiClient.get<{ status: string, data: any[] }>('/training/needs');
    }

    async approveRequest(id: string, status: 'APPROVED' | 'REJECTED') {
        return apiClient.patch(`/training/requests/${id}`, { status });
    }

    async getAnalytics() {
        return apiClient.get<{ status: string, data: any[] }>('/training/analytics');
    }

    async assignTraining(data: { employeeId: string; trainingId?: string; title?: string; description?: string; category?: string; duration?: number; attachments?: string[] }) {
        return apiClient.post('/training/assign', data);
    }

    async getAssignments() {
        return apiClient.get<{ status: string, data: any[] }>('/training/assignments');
    }

    async respondToAssignment(id: string, data: { status: 'ACCEPTED' | 'REJECTED', notes?: string }) {
        return apiClient.post(`/training/assignments/${id}/respond`, data);
    }

    async createTraining(data: any) {
        return apiClient.post('/training', data);
    }

    async updateTraining(id: string, data: any) {
        return apiClient.patch(`/training/${id}`, data);
    }

    async deleteTraining(id: string) {
        return apiClient.delete(`/training/${id}`);
    }

    async deleteAssignment(id: string) {
        return apiClient.delete(`/training/assignments/${id}`);
    }

    async updateProgress(enrollmentId: string, progress: number, score?: number) {
        return apiClient.patch(`/training/enrollments/${enrollmentId}/progress`, { progress, score });
    }

    async getComprehensiveProposal() {
        return apiClient.get<{ status: string, data: any }>('/training/comprehensive-proposal');
    }
}

export const trainingService = new TrainingService();
