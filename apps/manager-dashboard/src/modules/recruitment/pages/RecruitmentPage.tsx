// apps/manager-dashboard/src/modules/recruitment/pages/RecruitmentPage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus,
    CheckCircle2,
    Briefcase,
    Sparkles,
    Users,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { recruitmentService } from '@hr/services';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const RecruitmentPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'create'>('overview');
    const [isGenerating, setIsGenerating] = useState(false);
    const [dailyAnalysis, setDailyAnalysis] = useState<{
        cvAnalyzedToday: number
        highMatchCandidates: number
        activeJobs: number
        accuracy: number
    } | null>(null);

    const [newJob, setNewJob] = useState({
        title: '',
        department: 'البرمجيات',
        type: 'full-time',
        description: '',
        aiDescription: ''
    });

    React.useEffect(() => {
        const fetchDailyAnalysis = async () => {
            try {
                const data = await recruitmentService.getDailyRecruitmentAnalysis();
                setDailyAnalysis(data);
            } catch (error) {
                console.error('Failed to fetch daily analysis', error);
            }
        };
        fetchDailyAnalysis();
    }, []);


    const handleGenerateAiDescription = async () => {
        if (!newJob.title) return toast.error('يرجى إدخال مسمى الوظيفة أولاً');
        setIsGenerating(true);
        try {
            const description = await recruitmentService.generateAiJobDescription(newJob.title);
            setNewJob({ ...newJob, aiDescription: description });
            toast.success('تم توليد الوصف الذكي للوظيفة');
        } catch (error) {
            toast.error('فشل توليد الوصف الذكي');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCreateJob = async () => {
        try {
            await recruitmentService.createJob({
                ...newJob,
                status: 'OPEN'
            } as any);
            toast.success('تم إنشاء الوظيفة بنجاح');
            navigate('/recruitment/jobs');
        } catch (error) {
            toast.error('فشل إنشاء الوظيفة');
        }
    };

    const modules = [
        {
            title: 'إدارة الوظائف',
            description: 'نشر وتعديل ومتابعة الوظائف الشاغرة',
            icon: Briefcase,
            path: '/recruitment/jobs',
            color: 'bg-blue-500',
            stats: '15 وظيفة نشطة'
        },
        {
            title: 'قاعدة المرشحين',
            description: 'البحث وتصنيف المتقدمين وتحليل الـ AI',
            icon: Users,
            path: '/recruitment/candidates',
            color: 'bg-purple-500',
            stats: '142 متقدم'
        },
        {
            title: 'المقابلات الذكية',
            description: 'جدولة المقابلات وتقييم أداء المرشحين',
            icon: Calendar,
            path: '/recruitment/interviews',
            color: 'bg-emerald-500',
            stats: '12 مقابلة اليوم'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12" dir="rtl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">التوظيف الذكي</h1>
                    <p className="text-gray-500 mt-1">مركز التحكم في عملية التوظيف والذكاء الاصطناعي</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600' : 'text-gray-500'}`}
                    >
                        نظرة عامة
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'create' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600' : 'text-gray-500'}`}
                    >
                        وظيفة جديدة
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                    >
                        {/* Module Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {modules.map((m, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    onClick={() => navigate(m.path)}
                                    className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer group hover:border-indigo-500 transition-all"
                                >
                                    <div className={`${m.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-100 dark:shadow-none`}>
                                        <m.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold dark:text-white mb-2">{m.title}</h3>
                                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">{m.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{m.stats}</span>
                                        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Activity Mini-Board (Optional) */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="space-y-4 text-right md:text-right">
                                    <h2 className="text-3xl font-black">تحليل الذكاء الاصطناعي اليوم</h2>
                                    <p className="text-indigo-100 max-w-md">
                                        {dailyAnalysis ? (
                                            <>تم تحليل {dailyAnalysis.cvAnalyzedToday} سيرة ذاتية اليوم. هناك {dailyAnalysis.highMatchCandidates} مرشحين بنسبة تطابق تزيد عن 90%.</>
                                        ) : (
                                            <>جاري تحميل البيانات...</>
                                        )}
                                    </p>
                                    <button
                                        onClick={() => navigate('/recruitment/candidates')}
                                        className="px-8 py-3 bg-white text-indigo-600 rounded-2xl font-bold hover:shadow-lg transition-all"
                                    >
                                        راجع التوصيات
                                    </button>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl text-center border border-white/20">
                                        <div className="text-3xl font-black mb-1">{dailyAnalysis?.accuracy || '--'}%</div>
                                        <div className="text-xs font-bold uppercase opacity-60">دقة التحليل</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl text-center border border-white/20">
                                        <div className="text-3xl font-black mb-1">+{dailyAnalysis?.activeJobs || '--'}</div>
                                        <div className="text-xs font-bold uppercase opacity-60">وظائف منشورة</div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Background Element */}
                            <Sparkles className="absolute top-0 right-0 w-64 h-64 text-white/5 -translate-y-12 translate-x-12" />
                        </div>
                    </motion.div>
                )}

                {activeTab === 'create' && (
                    <motion.div
                        key="create"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl space-y-6">
                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-200 mb-4">
                                    <UserPlus className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold dark:text-white">إنشاء وظيفة جديدة</h2>
                                <p className="text-gray-500">أدخل التفاصيل الأساسية وسيقوم الـ AI بالباقي</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mr-2">مسمى الوظيفة</label>
                                    <input
                                        type="text"
                                        placeholder="مثلاً: مطور نظام أول"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all dark:text-white"
                                        value={newJob.title}
                                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mr-2">القسم</label>
                                        <select
                                            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent outline-none dark:text-white"
                                            value={newJob.department}
                                            onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                                        >
                                            <option>البرمجيات</option>
                                            <option>الموارد البشرية</option>
                                            <option>المبيعات</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mr-2">نوع التوظيف</label>
                                        <select
                                            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent outline-none dark:text-white"
                                            value={newJob.type}
                                            onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                                        >
                                            <option value="full-time">دوام كامل</option>
                                            <option value="remote">عن بعد</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between mr-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">وصف الوظيفة (AI)</label>
                                        <button
                                            onClick={handleGenerateAiDescription}
                                            disabled={isGenerating}
                                            className="text-xs font-black text-indigo-600 flex items-center gap-1 hover:text-indigo-700 disabled:opacity-50"
                                        >
                                            {isGenerating ? 'جاري التوليد...' : <><Sparkles className="w-3 h-3" /> توليد بالذكاء الاصطناعي</>}
                                        </button>
                                    </div>
                                    <textarea
                                        rows={6}
                                        placeholder="وصف الوظيفة المُقترح من الـ AI سيظهر هنا..."
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all resize-none dark:text-white font-medium"
                                        value={newJob.aiDescription || newJob.description}
                                        onChange={(e) => setNewJob({ ...newJob, aiDescription: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCreateJob}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                <span>اعتماد ونشر الوظيفة</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RecruitmentPage;
