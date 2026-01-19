// packages/services/src/notification.service.ts
import { apiClient } from './api-client';
import { Notification } from '@hr/types';
import { logger } from '@hr/utils';

class NotificationService {
    async getAll(): Promise<Notification[]> {
        const response = await apiClient.get<{ status: string, data: Notification[] }>('/notifications');
        return response.data || [];
    }

    async markAsRead(id: string): Promise<void> {
        logger.info('Marking notification as read', { id });
        await apiClient.patch(`/notifications/${id}/read`);
    }

    async markAllAsRead(): Promise<void> {
        logger.info('Marking all notifications as read');
        await apiClient.post('/notifications/read-all');
    }

    async delete(id: string): Promise<void> {
        logger.info('Deleting notification', { id });
        await apiClient.delete(`/notifications/${id}`);
    }

    async updateMetadata(id: string, metadata: any): Promise<void> {
        logger.info('Updating notification metadata', { id });
        await apiClient.patch(`/notifications/${id}/metadata`, { metadata });
    }
}

export const notificationService = new NotificationService();
