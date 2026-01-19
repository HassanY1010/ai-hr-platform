import { apiClient } from './api-client';

export interface UserSettings {
    name?: string;
    nameEn?: string;
    email?: string;
    phone?: string;
    bio?: string;
    avatar?: string;
    location?: string;
    position?: string;
    department?: string;
    settings?: any;
    password?: string;
}

export interface CompanySettings {
    name?: string;
    logo?: string;
    address?: string;
    website?: string;
    employeeLimit?: number;
    settings?: any;
}

export const settingsService = {
    async getCurrentUser() {
        const response = await apiClient.get<any>('/users/me');
        return response.data;
    },

    async getCompany() {
        const response = await apiClient.get<any>('/companies/my-company');
        return response.data;
    },

    async updateProfile(data: UserSettings) {
        const response = await apiClient.patch<any>('/users/me', data);
        return response.data;
    },

    async updateCompany(data: CompanySettings) {
        const response = await apiClient.patch<any>('/companies/my-company', data);
        return response.data;
    }
};
