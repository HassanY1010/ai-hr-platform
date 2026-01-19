import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    Briefcase,
    MapPin,
    Clock,
    CheckCircle2,
    Upload,
    Send,
    Loader2,
    Sparkles
} from 'lucide-react';
import { recruitmentService } from '@hr/services';
import { toast } from 'sonner';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { Job, Candidate } from '@hr/types';

const JobDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [interviewCode, setInterviewCode] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        coverLetter: ''
    });

    useEffect(() => {
        if (id) fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        if (!id) return;
        try {
            const data = await recruitmentService.getPublicJob(id);
            setJob(data);
        } catch (error) {
            console.error('Error fetching job:', error);
            toast.error('لم يتم العثور على الوظيفة');
            navigate('/jobs');
        } finally {
            setLoading(false);
        }
    };

    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setIsApplying(true);
        try {
            // 1. Create candidate
            const response = await recruitmentService.createCandidate({
                ...formData,
                jobId: id,
            });

            // 2. Upload Resume if selected
            if (resumeFile && response.id) {
                try {
                    await recruitmentService.uploadResume(resumeFile, response.id);
                } catch (uploadError) {
                    console.error('Failed to upload resume', uploadError);
                    toast.warning('تم تقديم الطلب ولكن فشل رفع السيرة الذاتية');
                }
            }

            if (response.interviewCode) {
                setInterviewCode(response.interviewCode);
                setShowSuccess(true);
                toast.success('تم تقديم طلبك بنجاح');
            }
        } catch (error) {
            console.error(error);
            toast.error('حدث خطأ أثناء التقديم، يرجى المحاولة لاحقاً');
        } finally {
            setIsApplying(false);
        }
    };

    if (loading) return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-200 border-t-indigo-600"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-100 rounded-full"></div>
            </div>
            <p className="mt-6 text-slate-500 font-bold text-lg">جاري التحميل...</p>
        </div>
    );

    if (!job) return null;

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Header */}
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-12 overflow-hidden hero-gradient">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full animate-float"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full animate-float [animation-delay:2s]"></div>
                </div>

                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-right"
                        >
                            <button
                                onClick={() => navigate('/jobs')}
                                className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-bold mb-8 transition-colors group"
                            >
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                <span>العودة للوظائف</span>
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 rounded-full text-sm font-black uppercase tracking-wider border border-indigo-100">
                                    {job.department || 'التقنية'}
                                </span>
                                <span className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 rounded-full text-sm font-black uppercase tracking-wider border border-emerald-100">
                                    {job.type || 'دوام كامل'}
                                </span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">
                                {job.title}
                            </h1>

                            <div className="flex flex-wrap gap-6 text-slate-600 font-bold text-lg">
                                <span className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-indigo-500" />
                                    {job.location || 'الرياض'}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-indigo-500" />
                                    نُشر حديثاً
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-12">
                        {/* Job Details */}
                        <div className="lg:col-span-2 space-y-12 text-right">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="glass-card p-10 rounded-[2rem]"
                            >
                                <h3 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                    <Sparkles className="w-8 h-8 text-indigo-600" />
                                    عن الوظيفة
                                </h3>
                                <p className="text-lg text-slate-700 leading-relaxed font-medium">
                                    {job.description}
                                </p>
                            </motion.div>

                            {job.requirements && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="glass-card p-10 rounded-[2rem]"
                                >
                                    <h3 className="text-3xl font-black text-slate-900 mb-8">المتطلبات</h3>
                                    <ul className="space-y-4">
                                        {(() => {
                                            let reqs: string[] = [];
                                            try {
                                                if (Array.isArray(job.requirements)) {
                                                    reqs = job.requirements;
                                                } else if (typeof job.requirements === 'string') {
                                                    if (job.requirements.startsWith('[') || job.requirements.startsWith('{')) {
                                                        reqs = JSON.parse(job.requirements);
                                                    } else {
                                                        reqs = job.requirements.split('\n').filter(Boolean);
                                                    }
                                                }
                                            } catch (e) {
                                                console.error("Failed to parse requirements", e);
                                                reqs = [String(job.requirements)];
                                            }

                                            if (!Array.isArray(reqs)) reqs = [String(reqs)];

                                            return reqs.map((req: string, idx: number) => (
                                                <li key={idx} className="flex gap-4 items-start">
                                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
                                                    <span className="text-lg text-slate-700 font-medium">{req}</span>
                                                </li>
                                            ));
                                        })()}
                                    </ul>
                                </motion.div>
                            )}
                        </div>

                        {/* Application Form */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="glass-card p-8 rounded-[2rem] sticky top-32"
                            >
                                <h3 className="text-2xl font-black text-slate-900 mb-8 text-right">
                                    قدّم الآن
                                </h3>

                                <form onSubmit={handleApply} className="space-y-6 text-right">
                                    <div className="space-y-4">
                                        <label className="text-sm font-black text-slate-700 mr-2">السيرة الذاتية (C.V)</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setResumeFile(file);
                                                        // Auto-parsing trigger
                                                        try {
                                                            toast.info('جاري تحليل السيرة الذاتية...');
                                                            const extracted = await recruitmentService.parseCV(file);

                                                            setFormData(prev => ({
                                                                ...prev,
                                                                name: extracted.name || prev.name,
                                                                email: extracted.email || prev.email,
                                                                phone: extracted.phone || prev.phone,
                                                                location: extracted.location || (prev as any).location || ''
                                                            }));

                                                            toast.success('تمت تعبئة البيانات تلقائياً، يرجى المراجعة');
                                                        } catch (err) {
                                                            console.error(err);
                                                            toast.error('فشل التحليل التلقائي، يرجى التعبئة يدوياً');
                                                        }
                                                    }
                                                }}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="w-full px-5 py-6 bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:border-indigo-400 group-hover:bg-indigo-50 transition-all">
                                                <Upload className="w-6 h-6 text-indigo-500" />
                                                <span className="text-sm font-bold text-indigo-600">
                                                    {resumeFile ? resumeFile.name : 'اضغط لرفع السيرة الذاتية (تحليل ذكي)'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-slate-700 mr-2">الاسم الكامل</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="محمد علي"
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all font-semibold"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-slate-700 mr-2">البريد الإلكتروني</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="mohammed@example.com"
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all font-semibold"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-slate-700 mr-2">رقم الجوال</label>
                                        <input
                                            required
                                            type="tel"
                                            placeholder="05xxxxxxxx"
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all font-semibold"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-slate-700 mr-2">الموقع / المدينة</label>
                                        <input
                                            required
                                            list="cities"
                                            type="text"
                                            placeholder="الرياض، جدة..."
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all font-semibold"
                                            value={(formData as any).location || ''}
                                            onChange={e => setFormData({ ...formData, location: e.target.value } as any)}
                                        />
                                        <datalist id="cities">
                                            <option value="السعودية" />
                                            <option value="المنطقة الشمالية" />
                                            <option value="المنطقة الجنوببة" />
                                            <option value="المنطقة الشرقيبة" />
                                            <option value="المنطقة الغرببة" />
                                            <option value="المنطقة الوسطى" />
                                            <option value="الإمارات العربية المتحدة" />
                                            <option value="مصر" />
                                            <option value="الأردن" />
                                            <option value="الكويت" />
                                            <option value="عمان" />
                                            <option value="البحرين" />
                                            <option value="قطر" />
                                            <option value="العراق" />
                                            <option value="لبنان" />
                                            <option value="سوريا" />
                                            <option value="فلسطين" />
                                            <option value="اليمن" />
                                            <option value="ليبيا" />
                                            <option value="تونس" />
                                            <option value="الجزائر" />
                                            <option value="المغرب" />
                                            <option value="موريتانيا" />
                                            <option value="السودان" />
                                            <option value="الصومال" />
                                            <option value="جيبوتي" />
                                            <option value="جزر القمر" />
                                        </datalist>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isApplying}
                                        className="w-full btn-premium py-4 text-lg font-bold shadow-lg shadow-indigo-200 mt-8"
                                    >
                                        {isApplying ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                جاري التقديم...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                إرسال الطلب
                                                <Send className="w-5 h-5 -rotate-90" />
                                            </span>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="glass-card w-full max-w-xl rounded-[3rem] p-12 text-center relative z-10 shadow-2xl"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-slate-900 leading-tight">
                                    شكراً م/ {formData.name}! <br /> تم استلام طلبك بنجاح
                                </h3>
                                <p className="text-lg text-slate-500 font-medium">الخطوة التالية هي المقابلة الذكية مع الـ AI</p>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl space-y-4 border-2 border-indigo-100 my-8">
                                <p className="text-indigo-900 font-black">رقم تأكيد المقابلة الخاص بك</p>
                                <div className="text-5xl font-black text-indigo-600 tracking-widest bg-white py-6 rounded-2xl shadow-inner border-2 border-indigo-100">
                                    {interviewCode}
                                </div>
                                <p className="text-indigo-700 text-sm font-bold">يرجى حفظ هذا الرقم للدخول للمقابلة</p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => navigate(`/interview/${interviewCode}`)}
                                    className="btn-premium py-5 text-lg"
                                >
                                    ابدأ المقابلة الآن
                                </button>
                                <button
                                    onClick={() => navigate('/jobs')}
                                    className="py-5 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                                >
                                    العودة للوظائف المتاحة
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default JobDetailsPage;
