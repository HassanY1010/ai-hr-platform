export type ID = string;

export interface BaseEntity {
    id: ID;
    createdAt: string;
    updatedAt: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}
