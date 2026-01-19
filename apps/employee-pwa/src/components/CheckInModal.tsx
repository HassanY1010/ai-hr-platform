import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@hr/services';
import { motion, AnimatePresence } from 'framer-motion';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { X, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface CheckInState {
    state: 'IDLE' | 'ACTIVE_QUESTION' | 'LOCKED';
    assessmentId?: string;
    entryId?: string;
    question?: {
        order: number;
        type: string;
        text: string;
    };
    unlockTime?: string;
    expiresAt?: string;
    nextQuestionOrder?: number;
}

export const CheckInModal: React.FC = () => {
    const [status, setStatus] = useState<CheckInState | null>(null);
    const [answerText, setAnswerText] = useState('');
    const [answerValue, setAnswerValue] = useState<number | null>(null);
    const [timer, setTimer] = useState(30);
    const [isOpen, setIsOpen] = useState(false);
    const isSubmitting = useRef(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkStatus = async () => {
        try {
            const res = await apiClient.get('/check-in/status') as any;
            const data: CheckInState = res.data;
            console.log('🔍 Check-in Status:', data);
            setStatus(data);
            setError(null);

            if (data.state === 'ACTIVE_QUESTION') {
                console.log('✅ Opening modal for active question');
                setIsOpen(true);
                setAnswerText('');
                setAnswerValue(null);
            } else if (data.state === 'LOCKED' && data.unlockTime) {
                // Only open if remaining time is <= 60 seconds
                const now = new Date();
                const unlocks = new Date(data.unlockTime);
                const remainingByCheck = Math.ceil((unlocks.getTime() - now.getTime()) / 1000);

                if (remainingByCheck <= 60 && remainingByCheck > 0) {
                    console.log('✅ Opening modal for short break (<= 60s)');
                    setIsOpen(true);
                } else {
                    console.log('⏳ Keeping modal closed, break > 60s');
                    setIsOpen(false);
                }
            } else {
                console.log('❌ Closing modal, state is:', data.state);
                setIsOpen(false);
            }
        } catch (err) {
            console.error('Failed to check status', err);
            setError('فشل في جلب الحالة');
        }
    };

    // Poll status every 1 minute & Listen for manual triggers
    useEffect(() => {
        checkStatus();
        const interval = setInterval(checkStatus, 60000);

        const handleUpdate = () => checkStatus();
        window.addEventListener('check-in-update', handleUpdate);

        return () => {
            clearInterval(interval);
            window.removeEventListener('check-in-update', handleUpdate);
        };
    }, []);

    // Strict countdown timer using server expiry
    useEffect(() => {
        if (!isOpen || !status) return;

        // If Active Question -> Timer for answering
        if (status.state === 'ACTIVE_QUESTION' && status.expiresAt) {
            const interval = setInterval(() => {
                const now = new Date();
                const expires = new Date(status.expiresAt!);
                const remaining = Math.max(0, Math.ceil((expires.getTime() - now.getTime()) / 1000));
                setTimer(remaining);
                if (remaining <= 0) {
                    clearInterval(interval);
                    if (!loading && !isSubmitting.current) submitAnswer(true);
                }
            }, 1000);
            return () => clearInterval(interval);
        }

        // If Locked -> Countdown to unlock
        if (status.state === 'LOCKED' && status.unlockTime) {
            const interval = setInterval(() => {
                const now = new Date();
                const unlocks = new Date(status.unlockTime!);
                const remaining = Math.max(0, Math.ceil((unlocks.getTime() - now.getTime()) / 1000));

                // Auto-open if we hit the 60s mark and it's not open yet
                if (remaining <= 60 && remaining > 0 && !isOpen) {
                    setIsOpen(true);
                }

                // If unlocked, check status to transition to ACTIVE
                if (remaining <= 0) {
                    clearInterval(interval);
                    checkStatus();
                }
            }, 1000);
            return () => clearInterval(interval);
        }

    }, [isOpen, status]);

    // Disable body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            disableBodyScroll(document.body);
        } else {
            enableBodyScroll(document.body);
        }
        return () => {
            enableBodyScroll(document.body); // Ensure scroll is re-enabled on unmount
        };
    }, [isOpen]);

    const submitAnswer = async (forced = false, explicitText?: string | null, explicitValue?: number | null) => {
        if (!status?.entryId || loading || isSubmitting.current) return; // Prevent double submit

        isSubmitting.current = true;
        setLoading(true);

        try {
            // Use explicit values if provided, otherwise fall back to state
            const textToSend = explicitText !== undefined ? explicitText : answerText;
            const valueToSend = explicitValue !== undefined ? explicitValue : answerValue;

            await apiClient.post(`/check-in/entry/${status.entryId}/answer`, {
                answerText: textToSend || (forced ? 'انتهى الوقت' : ''),
                answerValue: valueToSend,
                timeToAnswer: 30 - timer
            });
            // Immediately check status again to see if next one is locked or available
            await checkStatus();
        } catch (err: any) {
            console.error('Error submitting answer', err);
            // If already answered, treat as success or refresh status
            if (err.response?.status === 400) {
                await checkStatus();
            } else {
                setError('فشل إرسال الإجابة');
            }
        } finally {
            setLoading(false);
            isSubmitting.current = false;
        }
    };

    if (!isOpen || !status) return null;

    // RENDER: LOCKED STATE
    if (status.state === 'LOCKED') {
        const unlockDate = new Date(status.unlockTime || '');
        const timeStr = unlockDate.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

        return (
            <AnimatePresence>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 text-center shadow-2xl"
                        dir="rtl"
                    >
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock className="w-10 h-10 text-indigo-600 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">استراحة قصيرة</h3>
                        <p className="text-slate-500 mb-6 font-medium">
                            السؤال التالي سيكون متاحاً في الساعة <span className="text-indigo-600 font-bold dir-ltr">{timeStr}</span>
                        </p>
                        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                            نظام 30×3 يصمم فترات راحة بين الأسئلة لضمان دقة مشاعرك.
                        </p>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                        >
                            حسناً، فهمت
                        </button>
                    </motion.div>
                </div>
            </AnimatePresence>
        );
    }

    // RENDER: ACTIVE QUESTION
    if (status.state === 'ACTIVE_QUESTION' && status.question) {
        return (
            <AnimatePresence>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
                        dir="rtl"
                    >
                        {/* Header with Timer */}
                        <div className="relative bg-gradient-to-br from-indigo-600 to-violet-600 p-8 text-white overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                            <div className="relative flex justify-between items-start mb-6">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2 border border-white/10">
                                        <Clock className="w-3 h-3" />
                                        <span>نظام 30×3 الذكي</span>
                                    </div>
                                    <h2 className="text-2xl font-black">سؤال {status.question.order} من 3</h2>
                                </div>

                                {/* Circular Timer or Badge */}
                                <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/10 transition-colors ${timer < 10 ? 'bg-red-500/20 border-red-200/30' : ''}`}>
                                    <span className={`text-2xl font-black ${timer < 10 ? 'text-red-200' : 'text-white'}`}>{timer}</span>
                                    <span className="text-[10px] text-indigo-100">ثانية</span>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-3 bg-red-500/20 border border-red-200/30 rounded-xl flex items-center gap-2 text-red-100 text-xs font-bold"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <p className="relative text-lg font-medium leading-relaxed text-indigo-50">
                                {status.question.text}
                            </p>
                        </div>

                        {/* Body */}
                        <div className="p-8 bg-slate-50">
                            {status.question.type === 'FACT' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => { setAnswerText('Yes'); submitAnswer(false, 'Yes'); }}
                                        disabled={loading}
                                        className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3
                                            ${answerText === 'Yes'
                                                ? 'bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-100'
                                                : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${answerText === 'Yes' ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white'}`}>
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <span className="font-bold text-slate-700">نعم، تم</span>
                                    </button>

                                    <button
                                        onClick={() => { setAnswerText('No'); submitAnswer(false, 'No'); }}
                                        disabled={loading}
                                        className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3
                                            ${answerText === 'No'
                                                ? 'bg-red-50 border-red-500 shadow-lg shadow-red-100'
                                                : 'bg-white border-slate-200 hover:border-red-300 hover:shadow-md'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${answerText === 'No' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600 group-hover:bg-red-500 group-hover:text-white'}`}>
                                            <X className="w-6 h-6" />
                                        </div>
                                        <span className="font-bold text-slate-700">لا، لم يتم</span>
                                    </button>
                                </div>
                            )}

                            {status.question.type === 'FEELING' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center px-4">
                                        {[1, 2, 3, 4, 5].map(val => (
                                            <button
                                                key={val}
                                                onClick={() => { setAnswerValue(val); submitAnswer(false, undefined, val); }}
                                                disabled={loading}
                                                className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-all duration-300
                                                    ${answerValue === val
                                                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 -translate-y-2'
                                                        : 'bg-white text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200'}`}
                                            >
                                                {val}
                                                {answerValue === val && (
                                                    <motion.div
                                                        layoutId="active-indicator"
                                                        className="absolute -bottom-2 w-1.5 h-1.5 bg-indigo-600 rounded-full"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-xs font-bold text-slate-400 px-2">
                                        <span>ضغط منخفض / راحة</span>
                                        <span>ضغط عالي / إجهاد</span>
                                    </div>
                                </div>
                            )}

                            {status.question.type === 'BARRIER' && (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <textarea
                                            className="w-full p-4 pr-12 bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none text-slate-700 min-h-[120px]"
                                            placeholder="اكتب إجابتك هنا بوضوح..."
                                            value={answerText}
                                            disabled={loading}
                                            onChange={(e) => setAnswerText(e.target.value)}
                                        />
                                        <div className="absolute top-4 right-4 text-slate-400">
                                            <AlertCircle className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 mr-2">إجابتك تساعدنا في تحسين بيئة العمل وإزالة العقبات.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-white border-t border-slate-100">
                            <button
                                onClick={() => submitAnswer()}
                                disabled={loading || timer === 0 || (!answerText && !answerValue)}
                                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>جاري الحفظ...</span>
                                    </>
                                ) : (
                                    <span>تأكيد الإجابة</span>
                                )}
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-100">
                            <motion.div
                                className={`h-full ${timer < 10 ? 'bg-red-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`}
                                initial={{ width: '100%' }}
                                animate={{ width: `${(timer / 30) * 100}%` }}
                                transition={{ ease: 'linear', duration: 1 }}
                            />
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>
        );
    }

    return null;
};
