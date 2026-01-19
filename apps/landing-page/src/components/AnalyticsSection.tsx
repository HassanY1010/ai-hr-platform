import React from 'react';
import { motion } from 'framer-motion';

const AnalyticsSection = () => {
    return (
        <section id="analytics" className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Content Side */}
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 leading-tight">
                                لوحات معلومات <br />
                                <span className="premium-gradient-text">تحكي القصة كاملة</span>
                            </h2>
                            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
                                لا مزيد من التخمين. احصل على تقارير دقيقة وتحليلات تخصصية لكل جوانب العمل، من أداء الموظفين إلى التوقعات المالية، كل ذلك في واجهة واحدة بسيطة.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { label: 'دقة التقارير', value: '99.9%' },
                                    { label: 'تحسين الكفاءة', value: '75%+' },
                                    { label: 'وفر في الوقت', value: '20h/week' },
                                    { label: 'سرعة التحليل', value: '< 1s' }
                                ].map((stat, idx) => (
                                    <div key={idx} className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                        <div className="text-3xl font-black text-indigo-600 mb-1">{stat.value}</div>
                                        <div className="text-slate-500 font-bold">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Image Side */}
                    <div className="flex-1 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            whileInView={{ opacity: 1, scale: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="relative z-10">
                                <img
                                    src="/hr_analytics_pro.png"
                                    alt="HR Analytics"
                                    className="rounded-[2.5rem] shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-500"
                                />
                                {/* Interactive Highlights */}
                                <div className="absolute top-1/4 -right-12 space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ x: [0, 10, 0] }}
                                            transition={{ duration: 3, delay: i, repeat: Infinity }}
                                            className="w-24 h-2 bg-indigo-500/20 rounded-full blur-sm"
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AnalyticsSection;
