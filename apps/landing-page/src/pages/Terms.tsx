import React from 'react';
import { motion } from 'framer-motion';
import { ScrollText, CheckCircle2, AlertCircle, Scale } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Terms = () => {
    return (
        <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
            <Header />

            <main className="pt-32 pb-20">
                <section className="container mx-auto px-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-12 rounded-[2.5rem] border-2 border-indigo-50 shadow-2xl shadow-indigo-500/5 mb-12"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-indigo-100 rounded-2xl">
                                <Scale className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h1 className="text-4xl font-black text-slate-900">الشروط والأحكام</h1>
                        </div>

                        <div className="prose prose-indigo max-w-none space-y-8 font-semibold text-slate-600 text-lg leading-relaxed text-right">
                            <p>باستخدامك لمنصة HR Minds، فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية.</p>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                    <CheckCircle2 className="w-6 h-6 text-indigo-500" />
                                    شروط الاستخدام
                                </h2>
                                <p>يجب استخدام المنصة للأغراض المهنية والقانونية فقط. يمنع أي استخدام يهدف إلى الإضرار بالنظام أو سرقة البيانات.</p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                    <ScrollText className="w-6 h-6 text-indigo-500" />
                                    حسابات المستخدمين
                                </h2>
                                <p>أنت مسؤول عن الحفاظ على سرية بيانات اعتماد حسابك وعن جميع الأنشطة التي تحدث تحت حسابك.</p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                    <AlertCircle className="w-6 h-6 text-indigo-500" />
                                    تحديد المسؤولية
                                </h2>
                                <p>نسعى جاهدين لتقديم أفضل خدمة، ولكننا غير مسؤولين عن أي أضرار ناتجة عن استخدام المنصة بشكل غير صحيح أو خارج نطاق اتفاقية الخدمة.</p>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Terms;
