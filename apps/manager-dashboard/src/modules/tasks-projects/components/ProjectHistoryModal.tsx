import React, { useState, useEffect } from 'react';
import { X, History, TrendingUp, CheckCircle2, Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { projectsService, ProjectType } from '@hr/services';

interface ProjectHistoryModalProps {
    onClose: () => void;
}

export const ProjectHistoryModal: React.FC<ProjectHistoryModalProps> = ({ onClose }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [history, setHistory] = useState<ProjectType[]>([]);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Fetch all projects to build history
                const response = await projectsService.getAll();
                // Filter for completed projects for "History" or just show all with timeline focus
                setHistory(response.projects.filter(p => p.status === 'COMPLETED' || p.progress === 100));
                setStats(response.stats);
            } catch (error) {
                console.error('Failed to fetch project history:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh]"
            >
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <History className="w-6 h-6 text-indigo-600" />
                        <h3 className="text-xl font-bold dark:text-white">سجل المشاريع التاريخي</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin">
                    {/* Summary KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-3xl border border-green-100 dark:border-green-900/30">
                            <div className="text-green-600 mb-2"><TrendingUp className="w-5 h-5" /></div>
                            <div className="text-2xl font-black text-green-700 dark:text-green-400">{stats?.completed || 0}</div>
                            <div className="text-xs font-bold text-green-600/70 uppercase">مشاريع ناجحة</div>
                        </div>
                        <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
                            <div className="text-indigo-600 mb-2"><CheckCircle2 className="w-5 h-5" /></div>
                            <div className="text-2xl font-black text-indigo-700 dark:text-indigo-400">94%</div>
                            <div className="text-xs font-bold text-indigo-600/70 uppercase">معدل الإنجاز</div>
                        </div>
                        <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-3xl border border-orange-100 dark:border-orange-900/30">
                            <div className="text-orange-600 mb-2"><Clock className="w-5 h-5" /></div>
                            <div className="text-2xl font-black text-orange-700 dark:text-orange-400">{stats?.delayed || 0}</div>
                            <div className="text-xs font-bold text-orange-600/70 uppercase">معالجة تأخيرات</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-lg dark:text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-600" />
                            الأرشيف والنتائج
                        </h4>

                        {isLoading ? (
                            <div className="text-center py-20 text-gray-400">جاري تحميل سجل الأنشطة...</div>
                        ) : history.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200">
                                <p className="text-gray-500">لا توجد مشاريع مؤرشفة حالياً.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {history.map((project) => (
                                    <div key={project.id} className="p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                                                {project.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h5 className="font-bold dark:text-white">{project.name}</h5>
                                                <p className="text-xs text-gray-500">{project.description?.substring(0, 50)}...</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 text-center">
                                            <div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">التاريخ</div>
                                                <div className="text-sm font-bold dark:text-gray-300">{new Date(project.deadline || '').toLocaleDateString('ar-EG')}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">الميزانية</div>
                                                <div className="text-sm font-bold text-green-600">${project.budget?.toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">الحالة النهائية</div>
                                                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black tracking-widest uppercase">ناجح</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 border-t border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                    >
                        فهمت
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
