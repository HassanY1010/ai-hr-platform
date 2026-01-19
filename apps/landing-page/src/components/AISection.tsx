import React from 'react';
import { motion } from 'framer-motion';

const AISection = () => {
    const aiFeatures = [
        {
            title: 'تحليل التوقعات المهنية',
            description: 'استخدام خوارزميات التنبؤ لتحديد مسارات النمو الوظيفي وتقليل معدل الدوران.',
            icon: (
                <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            color: 'indigo'
        },
        {
            title: 'محرك تحليل المشاعر',
            description: 'قياس الرضا الوظيفي والروح المعنوية للفريق من خلال تحليل ردود الفعل الرقمية.',
            icon: (
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'emerald'
        },
        {
            title: 'مدرب الذكاء الآلي',
            description: 'توجيه الموظفين باقتراحات تدريبية مخصصة بناءً على فجوات المهارات المكتشفة.',
            icon: (
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" />
                </svg>
            ),
            color: 'purple'
        }
    ];

    return (
        <section id="ai" className="py-24 bg-slate-900 overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full"></div>
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-indigo-400 font-bold tracking-widest uppercase text-sm mb-4 block">
                            قوة المستقبل بين يديك
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
                            نظام الموارد البشرية <span className="text-indigo-400">فائق الذكاء</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            نحن لا نقوم بأتمتة المهام فحسب، بل نزودك برؤى عميقة تساعدك في اتخاذ قرارات استراتيجية مبنية على البيانات والذكاء الاصطناعي.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Visual Side */}
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="glass-card bg-white/5 border-white/10 rounded-[2.5rem] p-4 shadow-2xl relative z-10 overflow-hidden">
                                <img
                                    src="/hr_analytics_pro.png"
                                    alt="Predictive AI"
                                    className="rounded-[2rem] w-full"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                            </div>

                            {/* Decorative Grid */}
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl -z-10 animate-float"></div>
                        </motion.div>
                    </div>

                    {/* Features Side */}
                    <div className="grid grid-cols-1 gap-8">
                        {aiFeatures.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:bg-white/10"
                            >
                                <div className="flex items-start gap-6">
                                    <div className={`p-4 rounded-2xl bg-${feature.color}-500/10 text-${feature.color}-500 transform group-hover:scale-110 transition-transform duration-300`}>
                                        {feature.icon}
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AISection;
