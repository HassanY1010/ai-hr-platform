import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
    onGetStarted?: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden hero-gradient">
            {/* Background Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full animate-float"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full animate-float [animation-delay:2s]"></div>
            </div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-right">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm mb-6 border border-indigo-100 uppercase tracking-widest shadow-sm">
                                مستقبل الموارد البشرية مع ذكاء اصطناعي فائق
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl leading-[1.1] mb-8">
                                ارفع مستوى <br />
                                <span className="premium-gradient-text">إدارة الموظفين</span> <br />
                                إلى آفاق جديدة
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                المنصة المتكاملة التي تجمع بين قوة الذكاء الاصطناعي وبساطة التصميم لتحقيق أقصى درجات الكفاءة في إدارة فريقك، التوظيف، والتحليلات البيانية.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                                <button
                                    onClick={() => {
                                        if (onGetStarted) onGetStarted();
                                        document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="btn-premium w-full sm:w-auto text-lg px-10 py-5"
                                >
                                    ابدأ الاشتراك الآن
                                </button>
                                <button className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white border border-slate-200 font-bold hover:bg-slate-50 transition-all shadow-sm">
                                    مشاهدة العرض التجريبي
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Hero Image / Modal Dashboard */}
                    <div className="flex-1 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative z-10"
                        >
                            {/* Dashboard Showcase */}
                            <div className="glass-card rounded-[2rem] overflow-hidden p-2 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] ring-1 ring-white/20">
                                <img
                                    src="/hero_ai_hr_dashboard.png"
                                    alt="HR Minds AI Dashboard"
                                    className="rounded-[1.5rem] w-full shadow-2xl"
                                />

                                {/* Floating Badges */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute -top-6 -right-6 glass-card px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3"
                                >
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <span className="font-bold text-slate-800">تحليلات ذكية لحظية</span>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                                    className="absolute -bottom-8 -left-8 glass-card px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3"
                                >
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-slate-800">توظيف آلي مدعوم بـ AI</span>
                                </motion.div>
                            </div>

                            {/* Glow behind image */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-[100px] -z-10 rounded-full"></div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
