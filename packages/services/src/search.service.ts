import { apiClient } from './api-client';

export interface SearchResult {
    id: string;
    documentId: string;
    documentType: string;
    content: string;
    metadata: any;
    similarity: number;
    createdAt: string;
}

class SearchService {
    async smartSearch(query: string, limit: number = 5): Promise<SearchResult[]> {
        const response = await apiClient.post<any>('/search', { query, limit });
        return response.data.data;
    }

    async reindex(): Promise<void> {
        await apiClient.post('/search/reindex');
    }
}

export const searchService = new SearchService();
