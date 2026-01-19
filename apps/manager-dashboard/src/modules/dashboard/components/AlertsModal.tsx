import React from 'react';
import { X, Bell, AlertTriangle, Info, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@hr/ui';

interface AlertsModalProps {
    alerts: any[];
    onClose: () => void;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({ alerts, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col max-h-[85vh]"
            >
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-xl">
                            <Bell className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold dark:text-white">تنبيهات المخاطر والذكاء الاصطناعي</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-thin">
                    {alerts && alerts.length > 0 ? (
                        alerts.map((alert, i) => (
                            <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 flex gap-5 hover:border-indigo-200 transition-colors">
                                <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${alert.severity === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                                    }`}>
                                    {alert.severity === 'critical' ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold dark:text-white">{alert.title}</h4>
                                        <Badge variant={alert.severity === 'critical' ? 'danger' : 'warning'} className="text-[8px]">
                                            {alert.severity === 'critical' ? 'حرج' : 'متوسط'}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed">{alert.description}</p>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-2">
                                        <Clock className="w-3 h-3" />
                                        <span>منذ 3 ساعات</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed">
                            لا توجد تنبيهات نشطة حالياً.
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-gray-50 dark:border-gray-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                    >
                        فهمت
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
