import React, { useState, useEffect } from 'react';
import { X, Sparkles, Target, Zap, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { trainingService } from '@hr/services';
import { toast } from 'sonner';

interface ProposalModalProps {
    onClose: () => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({ onClose }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [proposal, setProposal] = useState<any>(null);

    useEffect(() => {
        const fetchProposal = async () => {
            try {
                console.log('Fetching comprehensive proposal...');
                const response = await trainingService.getComprehensiveProposal() as any;
                console.log('API Response received:', response);

                if (response && response.status === 'success') {
                    console.log('Setting proposal data:', response.data);
                    setProposal(response.data);
                } else {
                    console.error('API returned error or unexpected format:', response);
                    toast.error(response?.message || 'فشل في تحميل المقترح');
                }
            } catch (error: any) {
                console.error('Failed to fetch proposal:', error);
                toast.error(error.response?.data?.message || 'خطأ في الاتصال بالخادم');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProposal();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh]"
            >
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-indigo-600 text-white">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6" />
                        <h3 className="text-xl font-bold">المقترح الاستراتيجي المدعوم بالذكاء الاصطناعي</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                            <p className="text-gray-500 font-bold">جاري تحليل البيانات وتوليد المقترح...</p>
                        </div>
                    ) : proposal ? (
                        <div className="space-y-8 text-right" dir="rtl">
                            <section className="space-y-3">
                                <h4 className="text-lg font-black text-indigo-600 flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    نظرة عامة
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                    {proposal.overview}
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h4 className="text-lg font-black text-indigo-600 flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    توصيات رئيسية
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {proposal.key_recommendations.map((rec: any, i: number) => (
                                        <div key={i} className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-2">
                                            <h5 className="font-bold text-gray-900 dark:text-white text-sm">{rec.topic}</h5>
                                            <p className="text-xs text-indigo-600 font-bold">{rec.action}</p>
                                            <p className="text-[10px] text-gray-500">{rec.impact}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800">
                                <h4 className="text-sm font-black text-indigo-700 dark:text-indigo-400 mb-3 uppercase tracking-widest">محاور التركيز الاستراتيجي</h4>
                                <div className="flex flex-wrap gap-2">
                                    {proposal.training_focus.map((focus: string, i: number) => (
                                        <span key={i} className="px-4 py-1.5 bg-white dark:bg-gray-800 rounded-full text-xs font-bold text-indigo-600 shadow-sm border border-indigo-50 dark:border-indigo-900/50">
                                            {focus}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-3">
                                <h4 className="text-lg font-black text-indigo-600 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    التوافق الاستراتيجي
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                    {proposal.strategic_alignment}
                                </p>
                            </section>
                        </div>
                    ) : (
                        <div className="text-center py-20 text-red-500">فشل في تحميل المقترح. يرجى المحاولة لاحقاً.</div>
                    )}
                </div>

                <div className="p-8 border-t border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-all"
                    >
                        إغلاق
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
