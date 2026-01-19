import React from 'react';
import { Download, X, Sparkles, Smartphone, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallPWAProps {
    variant?: 'sidebar' | 'banner' | 'auto';
}

export const InstallPWA: React.FC<InstallPWAProps> = ({ variant = 'auto' }) => {
    const { isInstallable, handleInstallClick } = usePWAInstall();
    const [showOverlay, setShowOverlay] = React.useState(false);
    const [dismissed, setDismissed] = React.useState(false);

    React.useEffect(() => {
        // Show overlay only if installable and no choice made in this session
        const hasMadeChoice = sessionStorage.getItem('pwa_choice_made');
        if (isInstallable && !hasMadeChoice) {
            setShowOverlay(true);
        }
    }, [isInstallable]);

    const handleContinueInBrowser = () => {
        sessionStorage.setItem('pwa_choice_made', 'true');
        setShowOverlay(false);
    };

    const handleInstallApp = async () => {
        await handleInstallClick();
        sessionStorage.setItem('pwa_choice_made', 'true');
        setShowOverlay(false);
    };

    if (!isInstallable) return null;

    // The Choice Overlay (Entry Screen)
    if (showOverlay) {
        return (
            <AnimatePresence>
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xl"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="glass-card w-full max-w-lg rounded-[3rem] p-8 md:p-12 text-center relative z-10 shadow-2xl overflow-hidden"
                    >
                        {/* Background elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16" />

                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-100 ring-8 ring-indigo-50">
                            <Download className="w-10 h-10 text-white" />
                        </div>

                        <div className="space-y-4 mb-10">
                            <h2 className="text-3xl font-black text-slate-900 leading-tight">كيف تود الدخول؟</h2>
                            <p className="text-slate-500 font-bold">للحصول على أفضل تجربة وتلقي الإشعارات والمهام فوراً، ننصح بتثبيت التطبيق على جهازك.</p>
                        </div>

                        <div className="grid gap-4">
                            <button
                                onClick={handleInstallApp}
                                className="group relative w-full p-6 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-4 text-right overflow-hidden"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                                    <Smartphone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-black text-lg">تثبيت التطبيق</p>
                                    <p className="text-xs text-indigo-100 font-bold">موصى به - واجهة أسرع وإشعارات</p>
                                </div>
                                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-transform" />
                            </button>

                            <button
                                onClick={handleContinueInBrowser}
                                className="w-full p-6 rounded-3xl bg-white border-2 border-slate-100 text-slate-700 hover:border-indigo-100 hover:bg-slate-50 transition-all flex items-center gap-4 text-right"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-black text-lg">المتابعة عبر المتصفح</p>
                                    <p className="text-xs text-slate-400 font-bold">استخدام الواجهة التقليدية</p>
                                </div>
                            </button>
                        </div>

                        <p className="mt-8 text-xs text-slate-400 font-bold">
                            يمكنك التثبيت لاحقاً من القائمة الجانبية فى أي وقت
                        </p>
                    </motion.div>
                </div>
            </AnimatePresence>
        );
    }

    // Sidebar version (visible even if browser was chosen)
    if (variant === 'sidebar' && !dismissed) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white relative overflow-hidden group shadow-lg shadow-indigo-100"
            >
                <div className="absolute top-0 right-0 p-2">
                    <button onClick={() => setDismissed(true)} className="text-white/50 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-indigo-200" />
                        <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">تطبيق الموظف</span>
                    </div>
                    <p className="text-sm font-bold mb-3 leading-relaxed">ثبّت التطبيق للوصول السريع والإشعارات</p>
                    <button
                        onClick={handleInstallClick}
                        className="w-full bg-white text-indigo-600 py-2.5 rounded-xl text-xs font-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                        <Download className="w-3.5 h-3.5" />
                        تثبيت الآن
                    </button>
                </div>

                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </motion.div>
        );
    }

    // Floating banner for mobile (if choice was already made but not installed)
    if (variant === 'banner' && !dismissed) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-28 left-6 right-6 z-[60] md:hidden"
                >
                    <div className="glass-card p-4 rounded-[2rem] border border-white/40 shadow-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white shrink-0">
                                <Download className="w-6 h-6" />
                            </div>
                            <div className="tracking-tight">
                                <p className="text-sm font-black text-slate-900 leading-none mb-1">تثبيت التطبيق</p>
                                <p className="text-[10px] text-slate-500 font-bold">للوصول السريع وتلقي المهام</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleInstallClick}
                                className="bg-indigo-600 text-white px-5 py-3 rounded-2xl text-xs font-black shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                            >
                                تثبيت
                            </button>
                            <button
                                onClick={() => setDismissed(true)}
                                className="p-3 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    return null;
};
