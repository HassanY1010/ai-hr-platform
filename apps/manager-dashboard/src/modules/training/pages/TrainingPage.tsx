// apps/manager-dashboard/src/modules/training/pages/TrainingPage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Zap,
    TrendingUp,
    BookOpen,
    Plus,
    User,
    Clock,
    Trash,
    Edit3
} from 'lucide-react';
import { EditTrainingModal } from '../components/EditTrainingModal';
import { trainingService } from '@hr/services';
import { LoadingCard } from '@hr/ui';
import { toast } from 'sonner';
import { AssignTrainingModal } from '../components/AssignTrainingModal';
import { ProposalModal } from '../components/ProposalModal';

const TrainingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'needs' | 'results' | 'assignments'>('needs');
    const [isLoading, setIsLoading] = useState(true);
    const [needs, setNeeds] = useState<any[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'needs') {
                const response = await trainingService.getTrainingNeeds();
                setNeeds(response.data);
            } else if (activeTab === 'results') {
                const response = await trainingService.getAnalytics();
                setResults(response.data);
            } else {
                const response = await trainingService.getAssignments();
                setAssignments(response.data);
            }
        } catch (error) {
            console.error('Failed to load training data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await trainingService.approveRequest(id, 'APPROVED');
            toast.success('تمت الموافقة على الطلب بنجاح');
            loadData();
        } catch (error) {
            toast.error('فشل في الموافقة على الطلب');
        }
    };

    const handleReject = async (id: string) => {
        try {
            await trainingService.approveRequest(id, 'REJECTED');
            toast.success('تم رفض الطلب');
            loadData();
        } catch (error) {
            toast.error('فشل في رفض الطلب');
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">إدارة التدريب الذكي</h1>
                    <p className="text-gray-500 mt-1">الموافقة على الاحتياجات التدريبية المقترحة من الـ AI</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowAssignModal(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        إضافة تدريب
                    </button>
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
                        <button
                            onClick={() => setActiveTab('needs')}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'needs' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600' : 'text-gray-500'}`}
                        >
                            احتياجات التدريب
                        </button>
                        <button
                            onClick={() => setActiveTab('assignments')}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'assignments' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600' : 'text-gray-500'}`}
                        >
                            الدورات الحالية
                        </button>
                        <button
                            onClick={() => setActiveTab('results')}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'results' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600' : 'text-gray-500'}`}
                        >
                            متابعة النتائج
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'needs' && (
                    <motion.div
                        key="needs"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {isLoading ? <LoadingCard title="جاري تحميل الطلبات..." /> : needs.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-dashed border-gray-300 dark:border-gray-700">
                                <p className="text-gray-500">لا توجد احتياجات تدريبية معلقة حالياً</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {needs.map((item) => (
                                    <div key={item.id} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center font-black text-indigo-600">
                                                {item.aiScore ? Math.round(item.aiScore) : 85}%
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.employee.department || 'عام'}</span>
                                            <h3 className="text-xl font-bold dark:text-white">{item.employee.user.name}</h3>
                                            <p className="text-indigo-600 font-bold text-sm">التدريب المقترح: {item.training?.title || item.topic}</p>
                                        </div>

                                        <div className="bg-slate-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-slate-100 dark:border-gray-700">
                                            <div className="flex items-center gap-1.5 mb-2 text-gray-700 dark:text-gray-300">
                                                <Brain className="w-4 h-4 text-purple-500" />
                                                <span className="text-xs font-bold">لماذا يحتاج التدريب؟ (AI)</span>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                {item.reason}
                                            </p>
                                        </div>

                                        <div className="pt-2 flex gap-3">
                                            <button
                                                onClick={() => handleApprove(item.id)}
                                                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 transition-transform active:scale-95 hover:bg-indigo-700"
                                            >
                                                موافقة
                                            </button>
                                            <button
                                                onClick={() => handleReject(item.id)}
                                                className="px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                                            >
                                                رفض
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'assignments' && (
                    <motion.div
                        key="assignments"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {isLoading ? <LoadingCard title="جاري تحميل التعيينات..." /> : assignments.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-dashed border-gray-300 dark:border-gray-700">
                                <p className="text-gray-500">لا توجد دورات تدريبية معينة حالياً</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {assignments.map((item) => (
                                    <div key={item.id} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 relative overflow-hidden group hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-colors">
                                        <div className="absolute top-0 right-0 p-4">
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                item.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-indigo-100 text-indigo-700'
                                                }`}>
                                                {item.status === 'ASSIGNED' ? 'معينة' : item.status === 'IN_PROGRESS' ? 'قيد التنفيذ' : 'مكتملة'}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                                {item.employee.user.avatar ? (
                                                    <img src={item.employee.user.avatar} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{item.employee.user.name}</h4>
                                                <p className="text-xs text-gray-500">{item.employee.position || 'موظف'}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-indigo-600">
                                                <BookOpen className="w-4 h-4" />
                                                <span className="text-sm font-black">{item.course.title}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                {item.course.description || 'لا يوجد وصف متاح لهذا التدريب.'}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-xs font-bold">{item.course.duration || 60} دقيقة</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedTraining(item.course);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="تعديل الدورة"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('هل أنت متأكد من حذف هذا التعيين للموظف؟')) {
                                                            try {
                                                                await trainingService.deleteAssignment(item.id);
                                                                loadData();
                                                            } catch (err) {
                                                                console.error(err);
                                                            }
                                                        }
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'results' && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                <h3 className="font-bold text-lg dark:text-white">نتائج التدريب الأخيرة</h3>
                                <TrendingUp className="w-5 h-5 text-green-500" />
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                {isLoading ? <div className="p-8"><LoadingCard /></div> : results.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">لا توجد بيانات متاحة</div>
                                ) : results.map((r) => (
                                    <div key={r.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-green-50 rounded-2xl text-green-600">
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white">{r.title}</h4>
                                                <p className="text-xs text-gray-500">{r.employeeName}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-12 flex-1 justify-end">
                                            <div className="flex-1 max-w-sm">
                                                <div className="text-gray-400 text-[10px] font-bold uppercase mb-1">تحليل الأثر (AI)</div>
                                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2" title={r.impactAnalysis}>
                                                    {r.impactAnalysis || 'جاري التحليل...'}
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-gray-400 text-[10px] font-bold uppercase mb-1">الأثر</div>
                                                <div className="text-2xl font-black text-indigo-600">{r.impactScore || 0}%</div>
                                            </div>
                                            <div className={`hidden lg:block px-4 py-2 rounded-xl text-xs font-bold border ${(r.impactScore || 0) > 70 ? 'bg-green-50 text-green-700 border-green-100' :
                                                'bg-amber-50 text-amber-700 border-amber-100'
                                                }`}>
                                                {(r.impactScore || 0) > 70 ? 'تأثير عالي' : 'تأثير متوسط'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAssignModal && (
                    <AssignTrainingModal
                        onClose={() => setShowAssignModal(false)}
                        onSuccess={loadData}
                    />
                )}

                {showEditModal && selectedTraining && (
                    <EditTrainingModal
                        training={selectedTraining}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedTraining(null);
                        }}
                        onSuccess={loadData}
                    />
                )}

                {showProposalModal && (
                    <ProposalModal
                        onClose={() => setShowProposalModal(false)}
                    />
                )}
            </AnimatePresence>

            {/* AI Intervention Banner (Decision Readiness) */}
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Zap className="w-32 h-32" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold">قرارات التدريب جاهزة</h3>
                        <p className="text-indigo-100 text-sm max-w-xl">
                            بناءً على تتبع أداء المشاريع وتحليل 30×3، هناك توصيات لتدريب الموظفين لتحسين الأداء وتقليل المخاطر.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowProposalModal(true)}
                        className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black shadow-xl hover:bg-indigo-50 transition-colors"
                    >
                        مراجعة المقترح الشامل
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrainingPage;