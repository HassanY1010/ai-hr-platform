import React from 'react';
import { motion } from 'framer-motion';

const RecruitmentSection = () => {
    const steps = [
        { title: 'فلترة ذكية للكفاءات', desc: 'يقوم النظام بتحليل السير الذاتية ومطابقتها مع متطلبات الوظيفة بدقة متناهية.' },
        { title: 'جدولة آلية للمقابلات', desc: 'تنسيق تلقائي للوقت المناسب بين المرشحين وفريق العمل دون عناء.' },
        { title: 'تقييم تقني مدعوم بـ AI', desc: 'اختبارات تقنية وسلوكية شاملة تضمن اختيار أفضل المواهب للفريق.' }
    ];

    return (
        <section id="recruitment" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                    {/* Content Side */}
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-full text-sm mb-4 inline-block">
                                التوظيف الآلي الذكي
                            </span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 leading-tight">
                                ابنِ فريق أحلامك <br />
                                <span className="text-emerald-600">بسرعة الضوء</span>
                            </h2>
                            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
                                تخلص من العمليات اليدوية المملة في التوظيف. محركنا للذكاء الاصطناعي يقوم بالعمل الشاق نيابة عنك، من جذب المواهب وحتى الاختيار النهائي.
                            </p>

                            <div className="space-y-8">
                                {steps.map((step, idx) => (
                                    <div key={idx} className="flex gap-6 items-start">
                                        <div className="w-12 h-12 rounded-full border-2 border-emerald-100 flex items-center justify-center font-bold text-emerald-600 shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div className="text-right">
                                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                            <p className="text-slate-500">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Image Side */}
                    <div className="flex-1 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <div className="relative group">
                                <img
                                    src="/recruitment_ai_workflow.png"
                                    alt="Recruitment Workflow"
                                    className="rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-transform duration-700 group-hover:scale-[1.03]"
                                />
                                {/* Floating Badge */}
                                <div className="absolute -top-6 -left-6 glass-morphism p-6 rounded-2xl shadow-xl flex items-center gap-4">
                                    <div className="bg-emerald-100 p-3 rounded-xl">
                                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-500">تم فحص أكثر من</div>
                                        <div className="text-xl font-black text-slate-900">50,000 ملف</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecruitmentSection;
