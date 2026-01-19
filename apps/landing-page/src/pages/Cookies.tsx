import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Cookie, Settings, Info } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Cookies = () => {
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
                                <Cookie className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h1 className="text-4xl font-black text-slate-900">سياسة ملفات الارتباط</h1>
                        </div>

                        <div className="prose prose-indigo max-w-none space-y-8 font-semibold text-slate-600 text-lg leading-relaxed text-right">
                            <p>نستخدم ملفات الارتباط (Cookies) لتحسين تجربتك على منصتنا وفهم كيفية تفاعل المستخدمين مع خدماتنا.</p>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                    <Layout className="w-6 h-6 text-indigo-500" />
                                    ما هي ملفات الارتباط؟
                                </h2>
                                <p>هي ملفات نصية صغيرة يتم تخزينها على جهازك عند زيارة الموقع لتذكر تفضيلاتك وجعل تصفحك أكثر سلاسة.</p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                    <Settings className="w-6 h-6 text-indigo-500" />
                                    كيف نستخدمها؟
                                </h2>
                                <p>نستخدم ملفات الارتباط الضرورية لتشغيل الموقع، وملفات تحليلية لمتابعة حركة الزوار وتحسين الأداء.</p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                    <Info className="w-6 h-6 text-indigo-500" />
                                    إدارة التفضيلات
                                </h2>
                                <p>يمكنك دائمًا تعطيل ملفات الارتباط من إعدادات متصفحك، ولكن قد يؤثر ذلك على عمل بعض ميزات المنصة.</p>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Cookies;
