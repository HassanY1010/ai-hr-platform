import { apiClient } from './api-client';
import type { Company } from '@hr/types';

class CompanyService {
    async getAll() {
        return apiClient.get<Company[]>('/companies');
    }

    async getById(id: string) {
        return apiClient.get<Company>(`/companies/${id}`);
    }

    async create(data: Partial<Company>) {
        return apiClient.post<Company>('/companies', data);
    }

    async update(id: string, data: Partial<Company>) {
        return apiClient.put<Company>(`/companies/${id}`, data);
    }

    async updateStatus(id: string, status: string) {
        return apiClient.patch<Company>(`/admin/companies/${id}/status`, { status });
    }

    async delete(id: string) {
        return apiClient.delete(`/companies/${id}`);
    }

    async getPortfolioAnalytics() {
        return apiClient.get<any>('/admin/companies/portfolio-analytics');
    }

    async analyzeCompany(id: string) {
        return apiClient.post<any>(`/admin/companies/${id}/analyze`);
    }
}

export const companyService = new CompanyService();
