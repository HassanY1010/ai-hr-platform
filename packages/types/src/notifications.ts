// packages/types/src/notifications.ts

export type NotificationType = 'task' | 'training' | 'achievement' | 'reminder' | 'announcement';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
    id: string;
    employeeId: string;
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
    isRead: boolean;
    metadata?: any;
    createdAt: Date | string;
    updatedAt: Date | string;
}
