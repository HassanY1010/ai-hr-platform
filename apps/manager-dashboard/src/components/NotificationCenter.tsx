import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Target } from 'lucide-react';
import { notificationService } from '@hr/services';
import { Notification } from '@hr/types';
import { formatTimeAgo } from '@hr/utils';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationCenter: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds for new notifications
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getAll();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await notificationService.delete(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (!notifications.find(n => n.id === id)?.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
                <Bell className="h-5 w-5 text-neutral-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                        {unreadCount > 9 ? '+9' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        ></div>
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute left-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-neutral-100 dark:border-gray-800 z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-neutral-100 dark:border-gray-800 flex items-center justify-between bg-neutral-50/50 dark:bg-gray-800/50">
                                <h3 className="font-bold text-neutral-900 dark:text-white">الإشعارات</h3>
                                <span className="text-xs text-neutral-500 dark:text-gray-400">
                                    {unreadCount} غير مقروءة
                                </span>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Bell className="h-8 w-8 text-neutral-300 dark:text-gray-700 mx-auto mb-2" />
                                        <p className="text-sm text-neutral-500 dark:text-gray-500 italic">
                                            لا توجد إشعارات جديدة
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-neutral-50 dark:divide-gray-800">
                                        {notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={`p-4 transition-colors hover:bg-neutral-50 dark:hover:bg-gray-800/50 flex gap-3 ${!notif.isRead ? 'bg-primary-50/20 dark:bg-primary-900/10' : ''}`}
                                            >
                                                <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${notif.type === 'task' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                                                    'bg-neutral-100 dark:bg-gray-800 text-neutral-500'
                                                    }`}>
                                                    {notif.type === 'task' ? <Target className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={`text-sm font-semibold ${!notif.isRead ? 'text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-gray-400'}`}>
                                                            {notif.title}
                                                        </p>
                                                        <p className="text-[10px] text-neutral-400 shrink-0 mt-0.5">
                                                            {formatTimeAgo(notif.createdAt)}
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-neutral-600 dark:text-gray-400 mt-1 line-clamp-2">
                                                        {notif.message}
                                                    </p>

                                                    <div className="flex items-center gap-2 mt-2">
                                                        {!notif.isRead && (
                                                            <button
                                                                onClick={() => handleMarkAsRead(notif.id)}
                                                                className="text-[10px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                                                            >
                                                                <Check className="h-3 w-3" />
                                                                تحديد كمقروء
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(notif.id)}
                                                            className="text-[10px] font-bold text-neutral-400 hover:text-red-500 flex items-center gap-1 ml-auto"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                            حذف
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationCenter;
