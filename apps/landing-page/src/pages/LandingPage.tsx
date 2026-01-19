import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Video } from 'lucide-react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AISection from '../components/AISection';
import RecruitmentSection from '../components/RecruitmentSection';
import AnalyticsSection from '../components/AnalyticsSection';
import PricingSection from '../components/PricingSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import AuthTabs from '../components/AuthTabs';

const LandingPage = () => {
    const [activeAuth, setActiveAuth] = useState<'login' | 'signup' | null>(null);

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Header with Nav */}
            <Header onAuthClick={(mode: 'login' | 'signup') => setActiveAuth(mode)} />

            <main>
                {/* Hero Section */}
                <Hero onGetStarted={() => setActiveAuth('signup')} />

                {/* AI Features */}
                <AISection />

                {/* Recruitment Pipeline */}
                <RecruitmentSection />

                {/* Analytics & BI */}
                <AnalyticsSection />

                {/* Pricing Table */}
                <PricingSection />

                {/* Contact Interface */}
                <ContactSection />

                {/* Premium Auth Experience (Scroll section or Overlay) */}
                <section id="auth-section" className="py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-black mb-4">انضم إلى قائمة <span className="text-indigo-600">النخبة</span></h2>
                                <p className="text-slate-500 font-bold">ابدأ تجربتكم المجانية اليوم واكتشف قوة الذكاء الاصطناعي</p>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="glass-card bg-white border-slate-100 p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-indigo-500/10"
                            >
                                <AuthTabs
                                    initialMode={activeAuth === 'signup' ? 'register' : 'login'}
                                    onToggleMode={(mode: 'login' | 'register') => setActiveAuth(mode === 'login' ? 'login' : 'signup')}
                                />
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
