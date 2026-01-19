import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, Users, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutUs = () => {
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
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 mb-8 leading-tight">
                            نحن نصنع مستقبل <br />
                            <span className="premium-gradient-text">إدارة الكفاءات</span>
                        </h1>
                        <p className="text-xl text-slate-600 font-bold leading-relaxed">
                            HR Minds هي منصة متكاملة مدعومة بالذكاء الاصطناعي تهدف إلى تمكين الشركات من إدارة مواردها البشرية بفعالية وسهولة، مع التركيز على الابتكار والبيانات.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="glass-card p-10 rounded-[2.5rem] border-2 border-indigo-50 shadow-xl shadow-indigo-500/5"
                        >
                            <div className="w-16 h-16 bg-indigo-100 rounded-3xl flex items-center justify-center mb-8">
                                <Rocket className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">رؤيتنا</h3>
                            <p className="text-slate-600 font-semibold leading-relaxed">أن نكون الشريك التقني الأول للشركات في التحول الرقمي لإدارة الموارد البشرية عالمياً.</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="glass-card p-10 rounded-[2.5rem] border-2 border-purple-50 shadow-xl shadow-purple-500/5"
                        >
                            <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center mb-8">
                                <Target className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">مهمتنا</h3>
                            <p className="text-slate-600 font-semibold leading-relaxed">تبسيط العمليات المعقدة وتوفير رؤى ذكية تساعد القادة على اتخاذ قرارات مبنية على الحقائق.</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="glass-card p-10 rounded-[2.5rem] border-2 border-emerald-50 shadow-xl shadow-emerald-500/5"
                        >
                            <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center mb-8">
                                <Users className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">قيمنا</h3>
                            <p className="text-slate-600 font-semibold leading-relaxed">الابتكار المستمر، والشفافية التامة، والتركيز المطلق على نجاح عملائنا وموظفيهم.</p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="max-w-6xl mx-auto bg-indigo-600 rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200"
                    >
                        <div className="relative z-10">
                            <Sparkles className="w-12 h-12 mb-8 mx-auto text-indigo-200" />
                            <h2 className="text-4xl lg:text-6xl font-black mb-8">انضم إلى آلاف الشركات الناجحة</h2>
                            <p className="text-xl lg:text-2xl font-bold opacity-90 mb-12 max-w-2xl mx-auto">دعنا نساعدك في بناء فريق أحلامك بأدوات ذكية وعصرية.</p>
                            <button
                                onClick={() => window.location.href = '/#auth-section'}
                                className="bg-white text-indigo-600 px-12 py-5 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all transform hover:scale-105 active:scale-95"
                            >
                                ابدأ رحلتك معنا
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-white/10 blur-[100px] rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-500/20 blur-[100px] rounded-full"></div>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutUs;
