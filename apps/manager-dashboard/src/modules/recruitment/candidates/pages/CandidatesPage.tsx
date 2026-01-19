// apps/manager-dashboard/src/modules/recruitment/candidates/pages/CandidatesPage.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Plus,
    Search,
    Trash2,
    Eye,
    User,
    Mail,
    Phone,
    Briefcase,
    TrendingUp,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    MapPin
} from 'lucide-react'
import CandidateActionsMenu from '../components/CandidateActionsMenu'

// تعريف الثوابت
const CANDIDATE_STATUS = {
    NEW: { value: 'NEW', label: 'جديد', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    SCREENING: { value: 'SCREENING', label: 'مراجعة', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    INTERVIEWING: { value: 'INTERVIEWING', label: 'مقابلات', color: 'bg-purple-100 text-purple-700 border-purple-300' },
    HIRED: { value: 'HIRED', label: 'مقبول', color: 'bg-green-100 text-green-700 border-green-300' },
    REJECTED: { value: 'REJECTED', label: 'مرفوض', color: 'bg-red-100 text-red-700 border-red-300' }
} as const

// المكونات المساعدة (نفس تصميم JobsPage)
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden ${className}`}>{children}</div>
)

const CardHeader: React.FC<{ title: string, description?: React.ReactNode, Action?: React.ReactNode }> = ({ title, description, Action }) => (
    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
                {description && <div className="mt-1">{description}</div>}
            </div>
            {Action && <div>{Action}</div>}
        </div>
    </div>
)

const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>{children}</div>
)

const Button: React.FC<{ children: React.ReactNode, variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ai' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg', className?: string, onClick?: () => void, disabled?: boolean, leftIcon?: React.ReactNode, type?: 'button' | 'submit' }> = ({ children, variant = 'primary', size = 'md', className = '', onClick, disabled = false, leftIcon, type = 'button' }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-600 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        ai: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:opacity-90 focus:ring-purple-500 shadow-md',
        outline: 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-gray-300',
        ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-300'
    }
    const sizeClasses = { sm: 'px-3 py-1.5 text-sm gap-1', md: 'px-4 py-2 text-sm gap-2', lg: 'px-6 py-3 text-base gap-2' }
    return <button type={type} className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} onClick={onClick} disabled={disabled}>{leftIcon && <span>{leftIcon}</span>}{children}</button>
}

const Badge: React.FC<{ children: React.ReactNode, variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'neutral' | 'outline' | 'ai', className?: string }> = ({ children, variant = 'neutral', className = '' }) => {
    const variantClasses = {
        primary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800',
        secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700',
        danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800',
        warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800',
        success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800',
        neutral: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700',
        outline: 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300',
        ai: 'bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
    }
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]} ${className}`}>{children}</span>
}

const Modal: React.FC<{ isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const sizeClasses = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
                <div className={`inline-block align-bottom bg-white dark:bg-gray-900 rounded-2xl text-right shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} w-full border border-gray-100 dark:border-gray-800`}>
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"><XCircle className="h-5 w-5" /></button>
                    </div>
                    <div className="p-6">{children}</div>
                </div>
            </div>
        </div>
    )
}

import { useCandidatesStore } from '../store';
import { useJobsStore } from '../../jobs/store';
import { toast } from 'sonner';

const CandidatesPage: React.FC = () => {
    const { candidates, fetchCandidates, createCandidate, deleteCandidate, updateCandidate, isLoading: isCandidatesLoading } = useCandidatesStore();
    const { jobs, fetchJobs } = useJobsStore();
    const [showAddModal, setShowAddModal] = useState(false)
    const [showProfileModal, setShowProfileModal] = useState(false)
    const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Get jobId from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const jobIdFilter = urlParams.get('jobId');

    React.useEffect(() => {
        fetchCandidates();
        fetchJobs();
    }, [fetchCandidates, fetchJobs]);

    const getStatusConfig = (status: string) => {
        const normalized = (status || 'NEW').toUpperCase()
        const statusMap: Record<string, any> = {
            'NEW': CANDIDATE_STATUS.NEW,
            'SCREENING': CANDIDATE_STATUS.SCREENING,
            'INTERVIEWING': CANDIDATE_STATUS.INTERVIEWING,
            'HIRED': CANDIDATE_STATUS.HIRED,
            'REJECTED': CANDIDATE_STATUS.REJECTED
        }
        return statusMap[normalized] || CANDIDATE_STATUS.NEW
    }

    const filteredCandidates = (candidates || []).filter(c => {
        const nameMatch = (c.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        const positionMatch = (c.position || '').toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSearch = nameMatch || positionMatch
        const matchesStatus = filterStatus === 'all' || (c.status as string).toLowerCase() === filterStatus.toLowerCase()
        const matchesJob = !jobIdFilter || c.jobId === jobIdFilter
        return matchesSearch && matchesStatus && matchesJob
    })

    const handleViewProfile = (candidate: any) => {
        setSelectedCandidate(candidate)
        setShowProfileModal(true)
    }

    const handleSendEmail = (candidate: any) => {
        window.location.href = `mailto:${candidate.email}?subject=بخصوص طلب التوظيف`
    }

    const handleDeleteCandidate = async (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المتقدم؟')) {
            try {
                await deleteCandidate(id)
                toast.success('تم حذف المتقدم بنجاح')
            } catch (error) {
                toast.error('فشل حذف المتقدم')
            }
        }
    }

    const handleUpdateStatus = async (candidateId: string, newStatus: string) => {
        try {
            await updateCandidate(candidateId, { status: newStatus as any })
            toast.success('تم تحديث حالة المتقدم')
            await fetchCandidates()
        } catch (error) {
            toast.error('فشل تحديث الحالة')
        }
    }

    const handleAddCandidate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const resumeFile = formData.get('resume') as File;

        try {
            await createCandidate({
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                jobId: formData.get('jobId') as string,
                location: formData.get('location') as string || 'الرياض',
                status: 'new'
            }, resumeFile.size > 0 ? resumeFile : undefined);

            toast.success('تم إضافة المتقدم بنجاح');
            setShowAddModal(false);
            await fetchCandidates();
        } catch (error) {
            toast.error('فشل إضافة المتقدم');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen p-4 sm:p-6 transition-colors duration-300">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">إدارة المتقدمين</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">تتبع وتحليل طلبات التوظيف بالذكاء الاصطناعي</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="primary" leftIcon={<Plus />} onClick={() => setShowAddModal(true)}>إضافة متقدم</Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'إجمالي المتقدمين', value: (candidates || []).length.toString(), icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'قيد المراجعة', value: (candidates || []).filter(c => (c.status as string).toLowerCase() === 'screening').length.toString(), icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                        { label: 'المقابلات', value: (candidates || []).filter(c => (c.status as string).toLowerCase() === 'interviewing').length.toString(), icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
                        { label: 'تم التوظيف', value: (candidates || []).filter(c => (c.status as string).toLowerCase() === 'hired').length.toString(), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' }
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.bg} dark:bg-gray-800/50 p-4 rounded-xl border border-transparent dark:border-gray-800 transition-all hover:shadow-md`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                                    <p className={`text-2xl font-bold ${stat.color} dark:text-white`}>{stat.value}</p>
                                </div>
                                <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Filters */}
            <Card>
                <CardContent className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ابحث عن اسم أو وظيفة..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">جميع الحالات</option>
                            {Object.values(CANDIDATE_STATUS).map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}><TrendingUp className="h-4 w-4" /></button>
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}><FileText className="h-4 w-4" /></button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Candidates List */}
            {isCandidatesLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Clock className="h-10 w-10 text-blue-600 animate-spin" />
                </div>
            ) : filteredCandidates.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
                    <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">لا يوجد متقدمين</h3>
                    <p className="text-gray-500 mt-2">لم نجد أي متقدمين يطابقون معايير البحث</p>
                </div>
            ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                    {filteredCandidates.map((candidate, i) => (
                        <motion.div key={candidate.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                            <Card className="hover:shadow-xl transition-all duration-300 border-0 group">
                                <CardHeader
                                    title={candidate.name}
                                    description={
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-[10px] py-0">{candidate.position || 'Unknown'}</Badge>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusConfig(candidate.status).color}`}>{getStatusConfig(candidate.status).label}</span>
                                        </div>
                                    }
                                    Action={
                                        <CandidateActionsMenu
                                            candidate={candidate}
                                            onUpdateStatus={handleUpdateStatus}
                                        />
                                    }
                                />
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Mail className="h-4 w-4 text-blue-500" /> <span>{candidate.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Phone className="h-4 w-4 text-green-500" /> <span>{candidate.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <MapPin className="h-4 w-4 text-red-500" /> <span>{candidate.location || 'غير محدد'}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t dark:border-gray-800">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">تقييم الذكاء الاصطناعي</span>
                                                <Badge variant="ai" className="font-bold">{candidate.aiScore || 0}%</Badge>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 italic leading-relaxed">
                                                "{candidate.aiSummary || 'لا يوجد ملخص متاح حالياً للمرشح.'}"
                                            </p>

                                            {candidate.aiAnalysisDetails && (() => {
                                                try {
                                                    const analysis = typeof candidate.aiAnalysisDetails === 'string'
                                                        ? JSON.parse(candidate.aiAnalysisDetails)
                                                        : candidate.aiAnalysisDetails;
                                                    return (
                                                        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-dashed dark:border-gray-800 pt-2">
                                                            <div className="text-[11px]">
                                                                <span className="font-bold text-gray-700 dark:text-gray-300 block mb-1">المهارات الرئيسية:</span>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {analysis.skills?.slice(0, 3).map((s: string, idx: number) => (
                                                                        <span key={idx} className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-1 rounded">{s}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="text-[11px]">
                                                                <span className="font-bold text-gray-700 dark:text-gray-300 block mb-1">توصية النظام:</span>
                                                                <span className={`font-bold ${analysis.recommendation === 'hire' ? 'text-green-600' : analysis.recommendation === 'reject' ? 'text-red-500' : 'text-amber-500'}`}>
                                                                    {analysis.recommendation === 'hire' ? 'توظيف فوري' : analysis.recommendation === 'reject' ? 'غير ملائم' : 'مقابلة معمقة'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                } catch (e) {
                                                    return null;
                                                }
                                            })()}
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button variant="outline" size="sm" className="flex-1 shadow-sm" leftIcon={<Eye className="h-3 w-3" />} onClick={() => handleViewProfile(candidate)}>عرض الملف</Button>
                                            {candidate.resumeUrl && (
                                                <Button variant="secondary" size="sm" className="shadow-sm" onClick={() => window.open(candidate.resumeUrl, '_blank')}>
                                                    <FileText className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="sm" className="hover:text-blue-600" onClick={() => handleSendEmail(candidate)}><Mail className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCandidate(candidate.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="إضافة متقدم جديد" size="md">
                <form className="space-y-4" onSubmit={handleAddCandidate}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">الاسم الكامل</label>
                            <input name="name" type="text" className="w-full px-4 py-2.5 border rounded-xl dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" placeholder="محمد أحمد" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
                            <input name="email" type="email" className="w-full px-4 py-2.5 border rounded-xl dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" placeholder="example@email.com" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">رقم الهاتف</label>
                            <input name="phone" type="tel" className="w-full px-4 py-2.5 border rounded-xl dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" placeholder="+966 5..." required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">الموقع</label>
                            <input name="location" type="text" className="w-full px-4 py-2.5 border rounded-xl dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" placeholder="الرياض" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">الوظيفة المتقدم لها</label>
                        <select name="jobId" className="w-full px-4 py-2.5 border rounded-xl dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" required>
                            <option value="">اختر الوظيفة...</option>
                            {jobs.map(job => (
                                <option key={job.id} value={job.id}>{job.title} - {job.department}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">السيرة الذاتية (PDF)</label>
                        <div className="relative group">
                            <input name="resume" type="file" accept=".pdf,.doc,.docx" className="w-full px-4 py-2.5 border rounded-xl dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t dark:border-gray-800">
                        <Button variant="outline" onClick={() => setShowAddModal(false)} disabled={isSubmitting}>إلغاء</Button>
                        <Button variant="primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <><Clock className="h-4 w-4 animate-spin ml-2" /> جاري الإضافة...</> : 'إضافة المتقدم'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Profile Modal */}
            <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} title="ملف المتقدم" size="lg">
                {selectedCandidate && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 pb-4 border-b dark:border-gray-800">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedCandidate.name}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{selectedCandidate.recruitmentjob?.title || 'غير محدد'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">البريد الإلكتروني</label>
                                <p className="text-gray-900 dark:text-white font-medium">{selectedCandidate.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">رقم الهاتف</label>
                                <p className="text-gray-900 dark:text-white font-medium">{selectedCandidate.phone}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">الموقع</label>
                                <p className="text-gray-900 dark:text-white font-medium">{selectedCandidate.location || selectedCandidate.recruitmentjob?.location || 'غير محدد'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">الحالة</label>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusConfig(selectedCandidate.status).color}`}>
                                    {getStatusConfig(selectedCandidate.status).label}
                                </span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-gray-900 dark:text-white">تقييم الذكاء الاصطناعي</h4>
                                <Badge variant="ai" className="text-lg px-4 py-1">{selectedCandidate.aiScore || 0}%</Badge>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{selectedCandidate.aiSummary || 'لا يوجد ملخص متاح'}</p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button variant="primary" className="flex-1" onClick={() => handleSendEmail(selectedCandidate)}>
                                <Mail className="h-4 w-4 ml-2" />
                                إرسال بريد إلكتروني
                            </Button>
                            {selectedCandidate.resumeUrl && (
                                <Button variant="outline" onClick={() => window.open(selectedCandidate.resumeUrl, '_blank')}>
                                    <FileText className="h-4 w-4 ml-2" />
                                    عرض السيرة الذاتية
                                </Button>
                            )}
                            <Button variant="outline" onClick={() => setShowProfileModal(false)}>إغلاق</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default CandidatesPage
