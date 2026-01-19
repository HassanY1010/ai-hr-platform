import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
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
                                <Shield className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h1 className="text-4xl font-black text-slate-900">سياسة الخصوصية</h1>
                        </div>

                        <div className="prose prose-indigo max-w-none space-y-8 font-semibold text-slate-600 text-lg leading-relaxed text-right">
                            <p>نحن في HR Minds نلتزم بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيف نقوم بجمع واستخدام وحماية معلوماتك عند استخدام منصتنا.</p>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                    <Eye className="w-6 h-6 text-indigo-500" />
                                    المعلومات التي نجمعها
                                </h2>
                                <p>نجمع المعلومات التي تزودنا بها مباشرة، مثل اسمك، وبريدك الإلكتروني، وتفاصيل شركتك عند التسجيل، بالإضافة إلى بيانات الاستخدام لتحسين تجربتك.</p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                    <Lock className="w-6 h-6 text-indigo-500" />
                                    حماية البيانات
                                </h2>
                                <p>نستخدم تقنيات تشفير متطورة وبروتوكولات أمان صارمة لضمان حماية بياناتك من الوصول غير المصرح به.</p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                    <FileText className="w-6 h-6 text-indigo-500" />
                                    كيف نستخدم معلوماتك
                                </h2>
                                <p>نستخدم البيانات لتحسين خدماتنا، وتفعيل ميزات الذكاء الاصطناعي، وتقديم تقارير تحليلية دقيقة لشركتك.</p>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
