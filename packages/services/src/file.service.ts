import { apiClient } from './api-client';

class FileService {
    async upload(file: File, type: string = 'attachments'): Promise<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        return apiClient.post('/files/upload', formData);
    }

    async getUrl(key: string) {
        return apiClient.get(`/files/url/${key}`);
    }

    async delete(key: string) {
        return apiClient.delete(`/files/${key}`);
    }
}

export const fileService = new FileService();
