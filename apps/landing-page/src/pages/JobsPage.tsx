import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, Search, Filter, ArrowLeft, Sparkles, TrendingUp } from 'lucide-react';
import { recruitmentService } from '@hr/services';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { Job } from '@hr/types';

const JobsPage = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [filterDept, setFilterDept] = useState('ALL');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            console.log('Fetching public jobs...');
            const data = await recruitmentService.getPublicJobs();
            console.log('Received jobs data:', data);
            setJobs(data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'نُشر الآن';
        if (diffInSeconds < 3600) return `نُشر قبل ${Math.floor(diffInSeconds / 60)} دقيقة`;
        if (diffInSeconds < 86400) return `نُشر قبل ${Math.floor(diffInSeconds / 3600)} ساعة`;
        if (diffInSeconds < 172800) return 'نُشر بالأمس';
        if (diffInSeconds < 2592000) return `نُشر قبل ${Math.floor(diffInSeconds / 86400)} يوم`;
        if (diffInSeconds < 31536000) return `نُشر قبل ${Math.floor(diffInSeconds / 2592000)} شهر`;
        return `نُشر قبل ${Math.floor(diffInSeconds / 31536000)} سنة`;
    };

    const departments = Array.from(new Set(jobs.map(j => j.department).filter(Boolean)));

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'ALL' || job.type === filterType;
        const matchesDept = filterDept === 'ALL' || job.department === filterDept;

        return matchesSearch && matchesType && matchesDept;
    });

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Header */}
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden hero-gradient">
                {/* Background Orbs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full animate-float"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full animate-float [animation-delay:2s]"></div>
                </div>

                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm mb-6 border border-indigo-100 uppercase tracking-widest shadow-sm">
                                <Sparkles className="w-4 h-4 inline-block ml-2" />
                                فرص وظيفية مميزة
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl leading-[1.1] mb-8">
                                اكتشف فرصتك <br />
                                <span className="premium-gradient-text">المهنية القادمة</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
                                انضم إلى فريقنا المتميز وكن جزءاً من مستقبل الموارد البشرية المدعوم بالذكاء الاصطناعي
                            </p>

                            {/* Stats */}
                            <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
                                <div className="glass-card px-6 py-4 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                            <Briefcase className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-slate-900">{jobs.length}</div>
                                            <div className="text-sm text-slate-500 font-semibold">وظيفة متاحة</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="glass-card px-6 py-4 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-100 rounded-lg">
                                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-slate-900">100%</div>
                                            <div className="text-sm text-slate-500 font-semibold">نمو مستمر</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Jobs Listing */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-12"
                        >
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="ابحث عن وظيفة، قسم، أو مهارة..."
                                        className="w-full pr-12 pl-4 py-5 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all text-lg font-semibold"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <select
                                        value={filterDept}
                                        onChange={(e) => setFilterDept(e.target.value)}
                                        className="px-6 py-5 glass-card rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100 transition-all cursor-pointer"
                                    >
                                        <option value="ALL">كل الأقسام</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept!}>{dept}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="px-6 py-5 glass-card rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100 transition-all cursor-pointer"
                                    >
                                        <option value="ALL">كل أنواع العمل</option>
                                        <option value="full-time">دوام كامل</option>
                                        <option value="part-time">دوام جزئي</option>
                                        <option value="remote">عن بعد</option>
                                        <option value="contract">عقد</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>

                        {/* Jobs Grid */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="relative">
                                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-indigo-600"></div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-100 rounded-full"></div>
                                </div>
                                <p className="mt-6 text-slate-500 font-semibold">جاري تحميل الوظائف...</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {filteredJobs.length > 0 ? (
                                    filteredJobs.map((job, index) => (
                                        <motion.div
                                            key={job.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="glass-card p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group border-2 border-transparent hover:border-indigo-100"
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                                <div className="flex-1 space-y-4 text-right">
                                                    {/* Tags */}
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <span className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-wider border border-indigo-100">
                                                            {job.department || 'عام'}
                                                        </span>
                                                        <span className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-100">
                                                            {job.type === 'full-time' ? 'دوام كامل' :
                                                                job.type === 'part-time' ? 'دوام جزئي' :
                                                                    job.type === 'remote' ? 'عن بعد' :
                                                                        job.type === 'contract' ? 'عقد' : (job.type || 'دوام كامل')}
                                                        </span>
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                        {job.title}
                                                    </h3>

                                                    {/* Meta Info */}
                                                    <div className="flex items-center gap-6 text-slate-500 font-semibold">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-indigo-500" />
                                                            <span>{job.location || 'الرياض، المملكة العربية السعودية'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-indigo-500" />
                                                            <span>{formatRelativeTime(job.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* CTA Button */}
                                                <Link
                                                    to={`/jobs/${job.id}`}
                                                    className="btn-premium px-10 py-5 text-lg flex items-center justify-center gap-3 whitespace-nowrap"
                                                >
                                                    <span>عرض التفاصيل</span>
                                                    <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-20 glass-card rounded-[2rem]"
                                    >
                                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Briefcase className="w-10 h-10 text-slate-400" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-2">لا توجد وظائف متاحة حالياً</h3>
                                        <p className="text-slate-500 font-semibold">جرب تعديل معايير البحث أو تحقق لاحقاً</p>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default JobsPage;
