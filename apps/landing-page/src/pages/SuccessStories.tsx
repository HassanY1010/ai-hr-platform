import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Award, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SuccessStories = () => {
    return (
        <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
            <Header />

            <main className="pt-32 pb-20 text-right">
                <section className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-4xl mx-auto mb-20"
                    >
                        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 leading-tight">
                            شركاء <br />
                            <span className="premium-gradient-text">النجاح</span>
                        </h1>
                        <p className="text-xl text-slate-600 font-bold leading-relaxed">
                            قصص ملهمة لشركات حولت بيئة عملها وحققت قفزات نوعية في الإنتاجية باستخدام HR Minds.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {[
                            {
                                company: "شركة التقنية المتقدمة",
                                quote: "بفضل التوظيف الآلي، قللنا وقت التوظيف بنسبة 70% وحصلنا على كفاءات استثنائية.",
                                author: "م. فهد السديري",
                                role: "مدير الموارد البشرية"
                            },
                            {
                                company: "مجموعة الحلول اللوجستية",
                                quote: "تحليلات البيانات قدمت لنا رؤية لم نحلم بها من قبل حول أداء الموظفين ورضاهم.",
                                author: "سارة العلي",
                                role: "الرئيس التنفيذي للعمليات"
                            }
                        ].map((story, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="glass-card p-12 rounded-[3rem] border-2 border-slate-50 shadow-xl shadow-indigo-500/5 relative overflow-hidden"
                            >
                                <Quote className="w-16 h-16 text-indigo-100 absolute top-8 left-8 -scale-x-100" />
                                <div className="relative z-10">
                                    <div className="flex gap-1 mb-6">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                                    </div>
                                    <p className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
                                        "{story.quote}"
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center font-black text-slate-400 text-2xl">
                                            {story.author[0]}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-slate-900">{story.author}</h4>
                                            <p className="text-indigo-600 font-bold">{story.role} - {story.company}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mt-20 text-center glass-card p-12 rounded-[3rem] max-w-4xl mx-auto"
                    >
                        <Award className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
                        <h3 className="text-3xl font-black text-slate-900 mb-4">كن قصة النجاح القادمة</h3>
                        <p className="text-slate-600 font-bold mb-8">انضم إلى مجتمع HR Minds وابدأ في تغيير قواعد اللعبة في شركتك.</p>
                        <button
                            onClick={() => window.location.href = '/#auth-section'}
                            className="btn-premium px-12 py-5 text-xl"
                        >
                            انضم إلينا الآن
                        </button>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default SuccessStories;
