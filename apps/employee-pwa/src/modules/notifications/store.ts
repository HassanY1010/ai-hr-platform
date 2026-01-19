import { create } from 'zustand';
import { Notification } from './types';

interface NotificationsState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;

    setNotifications: (notifications: Notification[]) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,

    setNotifications: (notifications) => set({
        notifications,
        unreadCount: notifications.filter(n => !n.isRead).length
    }),
    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1)
    })),
    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0
    })),
}));
