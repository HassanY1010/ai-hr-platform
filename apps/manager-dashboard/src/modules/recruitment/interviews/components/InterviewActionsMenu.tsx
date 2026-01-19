import React, { useState, useRef, useEffect } from 'react';
import {
    MoreVertical,
    Calendar,
    MessageSquare,
    Trash2,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InterviewActionsMenuProps {
    interview: any;
    onDelete: (id: string) => void;
    onUpdateStatus: (id: string, status: string) => void;
    onReschedule: (interview: any) => void;
    onAddNote: (id: string) => void;
}

export const InterviewActionsMenu: React.FC<InterviewActionsMenuProps> = ({ interview, onDelete, onUpdateStatus, onReschedule, onAddNote }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
            >
                <MoreVertical className="w-5 h-5" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-[100]"
                    >
                        <button
                            onClick={(e) => handleAction(e, () => onUpdateStatus(interview.id, 'completed'))}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-right font-medium"
                        >
                            <CheckCircle className="w-4 h-4" />
                            <span>مكتملة</span>
                        </button>
                        <button
                            onClick={(e) => handleAction(e, () => onUpdateStatus(interview.id, 'cancelled'))}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-right font-medium"
                        >
                            <XCircle className="w-4 h-4" />
                            <span>إلغاء</span>
                        </button>
                        <button
                            onClick={(e) => handleAction(e, () => onReschedule(interview))}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-right font-medium"
                        >
                            <Calendar className="w-4 h-4" />
                            <span>تعديل الموعد</span>
                        </button>
                        <button
                            onClick={(e) => handleAction(e, () => onAddNote(interview.id))}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors text-right font-medium"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>إضافة ملاحظة</span>
                        </button>
                        <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
                        <button
                            onClick={(e) => handleAction(e, () => onDelete(interview.id))}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-right font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>حذف</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
