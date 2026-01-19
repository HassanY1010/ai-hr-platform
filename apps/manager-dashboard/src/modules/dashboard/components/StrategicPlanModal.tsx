import React, { useState, useEffect } from 'react';
import { X, Sparkles, Target, Shield, Loader2, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { analyticsService } from '@hr/services';

interface StrategicPlanModalProps {
    onClose: () => void;
}

export const StrategicPlanModal: React.FC<StrategicPlanModalProps> = ({ onClose }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [plan, setPlan] = useState<any>(null);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const response = await analyticsService.generateStrategicReport();
                setPlan(response.data);
            } catch (error) {
                console.error('Failed to fetch strategic plan:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlan();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md text-right" dir="rtl">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gradient-to-l from-indigo-600 to-purple-600 text-white">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black">الخطة الاستراتيجية الذكية</h3>
                            <p className="text-sm text-white/70">تحليل وتقارير مدعومة بالذكاء الاصطناعي</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-8 h-8" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-thin">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-6">
                            <div className="relative">
                                <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
                                <Sparkles className="w-6 h-6 text-purple-600 absolute top-0 right-0 animate-pulse" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">جاري تحليل البيانات المؤسسية...</p>
                                <p className="text-sm text-gray-500">نحن نبني رؤية مستقبلية لشركتك</p>
                            </div>
                        </div>
                    ) : plan ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Summary Section */}
                            <section className="bg-indigo-50 dark:bg-indigo-900/10 p-8 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800 relative overflow-hidden">
                                <div className="absolute top-0 left-0 p-8 opacity-5">
                                    <Target className="w-32 h-32" />
                                </div>
                                <h4 className="text-indigo-600 dark:text-indigo-400 font-black mb-4 flex items-center gap-2">
                                    <Target className="w-6 h-6" />
                                    الملخص التنفيذي
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-medium">
                                    {plan.summary}
                                </p>
                            </section>

                            {/* Strategic Pillars */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {plan.pillars?.map((pillar: any, i: number) => (
                                    <div key={i} className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 space-y-4 hover:border-indigo-200 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-indigo-600 font-bold">
                                                {i + 1}
                                            </div>
                                            <h5 className="text-lg font-black dark:text-white group-hover:text-indigo-600 transition-colors">{pillar.title}</h5>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                <span className="font-bold text-gray-900 dark:text-gray-200 block mb-1">التحليل:</span>
                                                {pillar.analysis}
                                            </div>
                                            <div className="text-sm text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-2xl">
                                                <span className="block mb-1 text-[10px] uppercase tracking-wider text-indigo-400">الإجراء المقترح:</span>
                                                {pillar.action}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* KPI Targets */}
                            <section className="space-y-6">
                                <h4 className="text-xl font-black dark:text-white flex items-center gap-2">
                                    <BarChart className="w-6 h-6 text-purple-600" />
                                    مستهدفات الأداء (KPIs)
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {plan.kpi_targets?.map((target: any, i: number) => (
                                        <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm text-center space-y-2">
                                            <div className="text-xs text-gray-400 font-bold uppercase">{target.metric}</div>
                                            <div className="text-2xl font-black text-indigo-600">{target.target}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Risk Mitigation */}
                            <section className="bg-rose-50 dark:bg-rose-900/10 p-8 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30">
                                <h4 className="text-rose-600 dark:text-rose-400 font-black mb-4 flex items-center gap-2">
                                    <Shield className="w-6 h-6" />
                                    إدارة وتخفيف المخاطر
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                                    {plan.risk_mitigation}
                                </p>
                            </section>
                        </div>
                    ) : (
                        <div className="text-center py-24 text-rose-500 font-bold">فشل في توليد الخطة الاستراتيجية حالياً.</div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center gap-4">
                    <p className="text-[10px] text-gray-400 max-w-sm">ملاحظة: هذه الخطة تم توليدها بواسطة الذكاء الاصطناعي بناءً على البيانات المتوفرة، يرجى مراجعتها من قبل مختص بشري قبل التنفيذ النهائي.</p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-bold shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-all"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
