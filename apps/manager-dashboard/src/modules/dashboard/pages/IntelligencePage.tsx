// apps/manager-dashboard/src/modules/dashboard/pages/IntelligencePage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@hr/services';
import type { AIInsight, AIAlert } from '@hr/types';
import {
    Zap,
    TrendingUp,
    AlertCircle,
    Users,
    ArrowLeft,
    Brain,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const IntelligencePage: React.FC = () => {
    const [timeframe, setTimeframe] = React.useState<'weekly' | 'monthly'>('monthly');
    const [showAnalysisModal, setShowAnalysisModal] = React.useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['30x3-insights', timeframe],
        queryFn: () => analyticsService.get30x3Insights(timeframe)
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">فشل تحميل البيانات. يرجى المحاولة لاحقاً.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                        <Zap className="w-8 h-8 text-indigo-600 fill-current" />
                        ذكاء 30×3
                    </h1>
                    <p className="text-gray-500 mt-1">تحليل البيانات التراكمية للحالة النفسية والرضا في الشركة</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-2xl text-xs font-black uppercase tracking-widest border border-green-100 dark:border-green-900/30">
                    <ShieldCheck className="w-4 h-4" />
                    بيانات مجهولة الهوية بالكامل
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Satisfaction Trend */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-xl font-bold dark:text-white">تغير المزاج العام (عبر الزمن)</h3>
                            <p className="text-gray-500 text-sm">بيانات تراكمية من أسئلة 30×3 اليومية</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTimeframe('weekly')}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${timeframe === 'weekly' ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'bg-gray-50 dark:bg-gray-800 text-gray-500'}`}
                            >
                                أسبوعي
                            </button>
                            <button
                                onClick={() => setTimeframe('monthly')}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${timeframe === 'monthly' ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'bg-gray-50 dark:bg-gray-800 text-gray-500'}`}
                            >
                                شهري
                            </button>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.moodTrend || []}>
                                <defs>
                                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#4f46e5" fillOpacity={1} fill="url(#colorMood)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-black text-green-600">{data.satisfaction || 0}%</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase">الرضا العام</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-orange-600">{data.stress || 0}%</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase">مستوى الضغط</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-indigo-600">{(data.moodGrowth || 0) > 0 ? '+' : ''}{data.moodGrowth || 0}%</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase">النمو المعنوي</div>
                        </div>
                    </div>
                </div>

                {/* AI Behavioral Insights */}
                <div className="bg-indigo-900 rounded-[3rem] p-8 text-white relative flex flex-col justify-between shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Brain className="w-32 h-32" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <Brain className="w-6 h-6 text-indigo-300" />
                            <h3 className="text-xl font-bold italic">التحليل السلوكي</h3>
                        </div>

                        <div className="space-y-6">
                            {(data.insights || []).slice(0, 2).map((insight: AIInsight) => (
                                <div key={insight.id} className="flex items-start gap-4">
                                    <div className={`p-2 rounded-xl text-white ${insight.type === 'talent' ? 'bg-indigo-800 text-green-400' :
                                        insight.type === 'engagement' ? 'bg-indigo-800 text-orange-400' : 'bg-indigo-800'
                                        }`}>
                                        {insight.type === 'talent' ? <TrendingUp className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">{insight.title}</h4>
                                        <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                                            {insight.description}
                                        </p>
                                        <div className="mt-1 text-[10px] text-indigo-400">الثقة: {insight.confidence}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-indigo-800">
                        <button
                            onClick={() => setShowAnalysisModal(true)}
                            className="w-full py-4 bg-white/10 hover:bg-white/15 rounded-2xl flex items-center justify-center gap-3 transition-colors border border-white/10"
                        >
                            <span className="font-bold text-sm">عرض التحليل الكامل</span>
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Analysis Modal */}
            {showAnalysisModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowAnalysisModal(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-gray-900 rounded-[2rem] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl"
                    >
                        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
                            <div>
                                <h2 className="text-2xl font-black text-indigo-900 dark:text-white flex items-center gap-2">
                                    <Brain className="w-6 h-6 text-indigo-600" />
                                    تحليل الذكاء السلوكي الشامل
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">تفاصيل الأنماط والتوجهات المكتشفة بواسطة AI</p>
                            </div>
                            <button onClick={() => setShowAnalysisModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                <ArrowLeft className="w-6 h-6 text-gray-400 rotate-180" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto max-h-[60vh] space-y-8">
                            {/* General Summary */}
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800">
                                <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2">الملخص التنفيذي</h3>
                                <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
                                    بناءً على تحليل {data.totalParticipation || 0} نقطة بيانات، فإن الاستقرار النفسي العام للمؤسسة في مستوى {data.satisfaction > 75 ? 'متميز' : 'متوسط'}.
                                    النظام يوصي بالتركيز على تعزيز {data.stress > 30 ? 'برامج تقليل الضغط' : 'فرص التطوير المهني'} للفترة القادمة.
                                </p>
                            </div>

                            {/* Detailed Insights List */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-900 dark:text-white">التفاصيل والأنماط المكتشفة</h3>
                                {(data.insights || []).map((insight: AIInsight) => (
                                    <div key={insight.id} className="flex gap-4 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-indigo-100 transition-colors">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${insight.type === 'talent' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {insight.type === 'talent' ? <TrendingUp className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-gray-900 dark:text-white">{insight.title}</h4>
                                                <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full">ثقة {insight.confidence}%</span>
                                            </div>
                                            <p className="text-sm text-gray-500 leading-relaxed">{insight.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
                            <button
                                onClick={() => setShowAnalysisModal(false)}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                            >
                                إغلاق التقرير
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* AI Smart Alerts */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <h2 className="text-xl font-bold dark:text-white">تنبيهات ذكية (AI Alerts)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(data.alerts || []).map((alert: AIAlert) => (
                        <motion.div
                            key={alert.id}
                            whileHover={{ y: -4 }}
                            className={`bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-start gap-6 border-r-8 ${alert.severity === 'critical' ? 'border-r-red-500' : 'border-r-orange-500'
                                }`}
                        >
                            <div className={`p-4 rounded-3xl ${alert.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/20 text-red-600' : 'bg-orange-50 dark:bg-orange-950/20 text-orange-600'
                                }`}>
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold dark:text-white mb-2">{alert.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                    {alert.description}
                                </p>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-500 rounded-full">الخصوصية مفعلة</span>
                                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${alert.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'
                                        }`}>
                                        {alert.severity === 'critical' ? 'حرج' : 'تحذير'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Philosophy Banner */}
            <div className="bg-slate-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-dashed border-slate-200 dark:border-gray-700 text-center">
                <p className="text-slate-500 text-sm italic">
                    "تذكر: نحن لا نظهر إجابات الموظفين الفردية. تركيزنا على الأقسام والتوجهات التراكمية لتحسين وحماية بيئة العمل."
                </p>
            </div>
        </div>
    );
};

export default IntelligencePage;
