import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Briefcase,
    Users,
    TrendingUp,
    Star,
    Plus,
    Search,
    Eye,
    Edit,
    Trash2,
    MapPin,
    DollarSign,
    Clock as ClockIcon,
    XCircle
} from 'lucide-react'

import { useJobsStore } from '../store'
import type { Job } from '@hr/types'
import JobActionsMenu from '../components/JobActionsMenu'

// Status config mapping
const STATUS_CONFIG = {
    DRAFT: { value: 'draft', label: 'مسودة', color: 'bg-gray-100 text-gray-700 border-gray-300' },
    PUBLISHED: { value: 'published', label: 'منشورة', color: 'bg-green-100 text-green-700 border-green-300' },
    CLOSED: { value: 'closed', label: 'مغلقة', color: 'bg-red-100 text-red-700 border-red-300' },
    ARCHIVED: { value: 'archived', label: 'مؤرشفة', color: 'bg-gray-100 text-gray-500 border-gray-200' },
    ON_HOLD: { value: 'on-hold', label: 'معلقة', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' }
} as const

// Helper function to format date
const formatDate = (dateString: string | Date, format: string = 'dd/MM/yyyy'): string => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return format === 'dd/MM/yyyy' ? `${day}/${month}/${year}` : dateString.toString()
}

// Custom Card component
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
    return (
        <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden ${className}`}>
            {children}
        </div>
    )
}

const CardHeader: React.FC<{ title: string; description?: React.ReactNode; Action?: React.ReactNode }> = ({ title, description, Action }) => {
    return (
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
}

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
    return <div className={`p-6 ${className}`}>{children}</div>
}

// Custom Button component
const Button: React.FC<{
    children: React.ReactNode
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ai' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    onClick?: () => void
    disabled?: boolean
    leftIcon?: React.ReactNode
    type?: 'button' | 'submit' | 'reset'
}> = ({ children, variant = 'primary', size = 'md', className = '', onClick, disabled = false, leftIcon, type = 'button' }) => {
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

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm gap-1',
        md: 'px-4 py-2 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-2'
    }

    return (
        <button
            type={type}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {leftIcon && <span>{leftIcon}</span>}
            {children}
        </button>
    )
}

// Custom Badge component
const Badge: React.FC<{
    children: React.ReactNode
    variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'neutral' | 'outline' | 'ai'
    className?: string
}> = ({ children, variant = 'neutral', className = '' }) => {
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

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    )
}

// Custom Modal component
const Modal: React.FC<{
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
}> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
                <div className={`inline-block align-bottom bg-white dark:bg-gray-900 rounded-2xl text-right shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} w-full border border-gray-100 dark:border-gray-800`}>
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
                            <span className="sr-only">إغلاق</span>
                            <XCircle className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="p-6">{children}</div>
                </div>
            </div>
        </div>
    )
}

const JobsPage: React.FC = () => {
    const { jobs, isLoading, fetchJobs, createJob, updateJob, deleteJob } = useJobsStore()
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedJob, setSelectedJob] = useState<Job | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterDepartment, setFilterDepartment] = useState('all')
    const [sortBy] = useState('createdAt')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    React.useEffect(() => {
        fetchJobs()
    }, [fetchJobs])

    const departments = ['الكل', 'التطوير', 'التصميم', 'الإدارة', 'المبيعات', 'الدعم', 'التسويق', 'الموارد البشرية', 'العمليات', 'المالية']
    const jobTypes = [
        { value: 'full-time', label: 'دوام كامل' },
        { value: 'part-time', label: 'دوام جزئي' },
        { value: 'contract', label: 'عقد' },
        { value: 'remote', label: 'عن بعد' }
    ]

    const getStatusConfig = (status: string) => {
        const statusMap: Record<string, any> = {
            'draft': STATUS_CONFIG.DRAFT,
            'published': STATUS_CONFIG.PUBLISHED,
            'closed': STATUS_CONFIG.CLOSED,
            'archived': STATUS_CONFIG.ARCHIVED,
            'on-hold': STATUS_CONFIG.ON_HOLD
        }
        return statusMap[status] || STATUS_CONFIG.DRAFT
    }

    const getStatusColor = (status: string) => {
        return getStatusConfig(status).color
    }

    const filteredJobs = React.useMemo(() => {
        const normalizedSearch = searchTerm.toLowerCase().trim()
        if (!normalizedSearch && filterStatus === 'all' && filterDepartment === 'all') return jobs || []

        return (jobs || []).filter(job => {
            const matchesSearch = !normalizedSearch ||
                (job.title || '').toLowerCase().includes(normalizedSearch) ||
                (job.department || '').toLowerCase().includes(normalizedSearch) ||
                (job.location || '').toLowerCase().includes(normalizedSearch)

            const matchesStatus = filterStatus === 'all' || job.status === filterStatus
            const matchesDepartment = filterDepartment === 'all' || job.department === filterDepartment

            return matchesSearch && matchesStatus && matchesDepartment
        })
    }, [jobs, searchTerm, filterStatus, filterDepartment])

    const sortedJobs = React.useMemo(() => {
        return [...filteredJobs].sort((a, b) => {
            // Prioritize title match at start if searching
            const normalizedSearch = searchTerm.toLowerCase().trim()
            if (normalizedSearch) {
                const aStarts = (a.title || '').toLowerCase().startsWith(normalizedSearch)
                const bStarts = (b.title || '').toLowerCase().startsWith(normalizedSearch)
                if (aStarts && !bStarts) return -1
                if (!aStarts && bStarts) return 1
            }

            switch (sortBy) {
                case 'createdAt': return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                case 'applicants': return (b.applicantsCount || 0) - (a.applicantsCount || 0)
                case 'title': return (a.title || '').localeCompare(b.title || '')
                default: return 0
            }
        })
    }, [filteredJobs, sortBy, searchTerm])

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)

        const newJobData: Partial<Job> = {
            title: formData.get('title') as string,
            department: formData.get('department') as string,
            location: formData.get('location') as string,
            type: formData.get('type') as any,
            salaryRange: {
                min: Number(formData.get('salaryMin')),
                max: Number(formData.get('salaryMax')),
                currency: 'SAR'
            },
            description: formData.get('description') as string,
            requirements: (formData.get('requirements') as string)?.split('\n').filter(Boolean) || []
        }

        // Only set these fields when creating a new job, not when updating
        if (!selectedJob) {
            newJobData.status = 'draft'
            newJobData.responsibilities = []
            newJobData.skills = []
            newJobData.experience = 'Not specified'
            newJobData.education = 'Not specified'
            newJobData.createdBy = 'current-user-id'
        }

        console.log('Saving job:', selectedJob ? 'UPDATE' : 'CREATE', newJobData)

        try {
            if (selectedJob) {
                await updateJob(selectedJob.id, newJobData)
                console.log('Job updated successfully')
            } else {
                await createJob(newJobData)
                console.log('Job created successfully')
            }
            // Refresh jobs list to show updated data
            await fetchJobs()
            setShowCreateModal(false)
            setShowEditModal(false)
            setSelectedJob(null)
        } catch (error) {
            console.error('Failed to save job', error)
            alert('فشل في حفظ الوظيفة. يرجى المحاولة مرة أخرى.')
        }
    }

    const handleEditJob = (job: Job) => {
        setSelectedJob(job)
        setShowEditModal(true)
    }

    const handleDeleteJob = async (jobId: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الوظيفة؟')) {
            await deleteJob(jobId)
        }
    }

    const handleDuplicateJob = async (job: Job) => {
        const { id, createdAt, updatedAt, ...jobData } = job
        await createJob({
            ...jobData,
            title: `${job.title} (نسخة)`,
            status: 'draft',
            applicantsCount: 0
        })
    }

    const handleArchiveJob = async (jobId: string) => {
        await updateJob(jobId, { status: 'archived' })
    }

    return (
        <div className="space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen p-4 sm:p-6 transition-colors duration-300">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-800"
            >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                        >
                            إدارة الوظائف الشاغرة
                        </motion.h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">إدارة الوظائف وطلبات التوظيف بكفاءة واحترافية</p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <Button
                            variant="primary"
                            leftIcon={<Plus />}
                            onClick={() => { setSelectedJob(null); setShowCreateModal(true); }}
                            className="px-4 sm:px-6 text-sm"
                        >
                            وظيفة جديدة
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {[
                        { value: (jobs || []).filter(j => j.status === 'published' || j.status === 'OPEN').length.toString(), label: 'وظيفة نشطة', icon: Briefcase, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                        { value: (jobs || []).reduce((acc, job) => acc + (job.applicantsCount || 0), 0).toString(), label: 'متقدم جديد', icon: Users, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
                        { value: '85%', label: 'معدل التوظيف', icon: TrendingUp, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
                        { value: '92', label: 'درجة الجودة', icon: Star, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' }
                    ].map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <div key={index} className={`${stat.bg} rounded-xl p-3 sm:p-4 border border-transparent dark:border-gray-800 transition-all shadow-sm`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{stat.label}</p>
                                    </div>
                                    <Icon className={`h-5 w-5 sm:h-8 sm:w-8 ${stat.color} opacity-80`} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </motion.div>

            {/* Filters and Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-800"
            >
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ابحث في الوظائف..."
                            className="w-full pl-4 pr-10 py-2 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm sm:text-base"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            <option value="all">كل الحالات</option>
                            <option value="published">منشورة</option>
                            <option value="draft">مسودة</option>
                            <option value="closed">مغلقة</option>
                        </select>

                        <select
                            value={filterDepartment}
                            onChange={(e) => setFilterDepartment(e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept === 'الكل' ? 'all' : dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>

                        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                                title="عرض شبكي"
                            >
                                <div className="h-3 w-3 sm:h-4 sm:w-4 grid grid-cols-2 gap-0.5">
                                    <div className="bg-current rounded-sm"></div>
                                    <div className="bg-current rounded-sm"></div>
                                    <div className="bg-current rounded-sm"></div>
                                    <div className="bg-current rounded-sm"></div>
                                </div>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                                title="عرض قائمة"
                            >
                                <div className="h-3 w-3 sm:h-4 sm:w-4 space-y-0.5">
                                    <div className="bg-current rounded-sm h-0.5"></div>
                                    <div className="bg-current rounded-sm h-0.5"></div>
                                    <div className="bg-current rounded-sm h-0.5"></div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Jobs List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                {sortedJobs.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 sm:p-12 text-center border border-gray-100 dark:border-gray-800">
                        <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                            <Briefcase className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">لا توجد وظائف</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                            {searchTerm ? 'لا توجد وظائف تطابق بحثك' : 'ابدأ بإنشاء أول وظيفة لك'}
                        </p>
                        <Button variant="primary" leftIcon={<Plus />} onClick={() => { setSelectedJob(null); setShowCreateModal(true); }}>
                            إنشاء وظيفة
                        </Button>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6' : 'space-y-4'}>
                        {sortedJobs.map((job, index) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                            >
                                <Card className={`h-full shadow-md hover:shadow-lg transition-all duration-200 border-0 ${viewMode === 'list' ? 'flex items-center p-3 sm:p-4' : ''}`}>
                                    {viewMode === 'list' ? (
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full">
                                            <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg ${getStatusColor(job.status).split(' ')[0]} flex items-center justify-center flex-shrink-0`}>
                                                <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{job.title}</h3>
                                                    <Badge variant="outline" className="text-xs">{job.department}</Badge>
                                                    <span className={`px-2 py-1 rounded text-xs ${getStatusConfig(job.status).label}`}>
                                                        {getStatusConfig(job.status).label}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                                                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{job.applicantsCount || 0} متقدم</span>
                                                    <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{(job.salaryRange as any)?.min?.toLocaleString() || '0'} - {(job.salaryRange as any)?.max?.toLocaleString() || '—'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-auto">
                                                <Button variant="ghost" size="sm" onClick={() => window.open(`/jobs/${job.id}`, '_blank')}><Eye className="h-3 w-3 sm:h-4 sm:w-4" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleEditJob(job)}><Edit className="h-3 w-3 sm:h-4 sm:w-4" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteJob(job.id)}><Trash2 className="h-3 w-3 sm:h-4 sm:w-4" /></Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <CardHeader
                                                title={job.title}
                                                description={
                                                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                                                        <Badge variant="outline" className="text-xs">{job.department}</Badge>
                                                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(job.status)}`}>
                                                            {getStatusConfig(job.status).label}
                                                        </span>
                                                        {job.aiOptimizedDescription && (
                                                            <Badge variant="ai" className="text-xs">
                                                                <Star className="h-3 w-3 mr-1" />
                                                                AI
                                                            </Badge>
                                                        )}
                                                    </div>
                                                }
                                                Action={
                                                    <JobActionsMenu
                                                        job={job}
                                                        onEdit={handleEditJob}
                                                        onDuplicate={handleDuplicateJob}
                                                        onArchive={handleArchiveJob}
                                                        onDelete={handleDeleteJob}
                                                    />
                                                }
                                            />
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1"><MapPin className="h-4 w-4" />المكان:</span>
                                                            <span className="font-medium text-sm text-gray-900 dark:text-gray-200">{job.location}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1"><ClockIcon className="h-4 w-4" />نوع الوظيفة:</span>
                                                            <span className="font-medium text-sm text-gray-900 dark:text-gray-200">
                                                                {job.type === 'full-time' ? 'دوام كامل' : job.type === 'part-time' ? 'دوام جزئي' : job.type === 'contract' ? 'عقد' : 'عن بعد'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1"><DollarSign className="h-4 w-4" />الراتب:</span>
                                                            <span className="font-medium text-sm text-gray-900 dark:text-gray-200">
                                                                {(job.salaryRange as any)?.min?.toLocaleString() || '0'} - {(job.salaryRange as any)?.max?.toLocaleString() || '—'} {(job.salaryRange as any)?.currency || 'SAR'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1"><Users className="h-4 w-4" />المتقدمين:</span>
                                                            <Badge variant="primary" className="text-xs">{job.applicantsCount} متقدم</Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                                                        <Button variant="primary" size="sm" className="flex-1" onClick={() => window.location.href = `/recruitment/candidates?jobId=${job.id}`}>
                                                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                                                            <span className="text-xs sm:text-sm">عرض المتقدمين</span>
                                                        </Button>
                                                        <Button variant="outline" size="sm" onClick={() => handleEditJob(job)}><Edit className="h-3 w-3 sm:h-4 sm:w-4" /></Button>
                                                        <Button variant="outline" size="sm" onClick={() => handleDeleteJob(job.id)}><Trash2 className="h-3 w-3 sm:h-4 sm:w-4" /></Button>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-1">
                                                        <span>{formatDate(job.createdAt, 'dd/MM/yyyy')}</span>
                                                        {job.aiOptimizedDescription && <span className="text-blue-600 dark:text-blue-400 text-xs font-medium">AI محسن</span>}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </>
                                    )}
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {(showCreateModal || showEditModal) && (
                    <Modal
                        isOpen={showCreateModal || showEditModal}
                        onClose={() => { setShowCreateModal(false); setShowEditModal(false); setSelectedJob(null); }}
                        title={showCreateModal ? 'إنشاء وظيفة جديدة' : 'تعديل الوظيفة'}
                        size="lg"
                    >
                        <form onSubmit={handleCreateJob} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">عنوان الوظيفة</label>
                                    <input
                                        name="title"
                                        type="text"
                                        defaultValue={selectedJob?.title}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                        placeholder="مثال: مطور Frontend"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">القسم</label>
                                    <select
                                        name="department"
                                        defaultValue={selectedJob?.department}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                    >
                                        <option value="التطوير">التطوير</option>
                                        <option value="التصميم">التصميم</option>
                                        <option value="الإدارة">الإدارة</option>
                                        <option value="المبيعات">المبيعات</option>
                                        <option value="الدعم">الدعم</option>
                                        <option value="التسويق">التسويق</option>
                                        <option value="الموارد البشرية">الموارد البشرية</option>
                                        <option value="العمليات">العمليات</option>
                                        <option value="المالية">المالية</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">الموقع</label>
                                    <input
                                        name="location"
                                        type="text"
                                        defaultValue={selectedJob?.location}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                        placeholder="الرياض، جدة، عن بعد"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">نوع الوظيفة</label>
                                    <select
                                        name="type"
                                        defaultValue={selectedJob?.type}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                    >
                                        {jobTypes.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">الحد الأدنى للراتب</label>
                                    <input
                                        name="salaryMin"
                                        type="number"
                                        defaultValue={selectedJob?.salaryRange?.min}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                        placeholder="15000"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">الحد الأقصى للراتب</label>
                                    <input
                                        name="salaryMax"
                                        type="number"
                                        defaultValue={selectedJob?.salaryRange?.max}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                        placeholder="25000"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">الوصف الوظيفي</label>
                                    <textarea
                                        name="description"
                                        defaultValue={selectedJob?.description}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                        placeholder="وصف الوظيفة..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">المتطلبات (كل سطر متطلب جديد)</label>
                                    <textarea
                                        name="requirements"
                                        defaultValue={Array.isArray(selectedJob?.requirements) ? selectedJob?.requirements.join('\n') : ''}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                        placeholder="المتطلبات..."
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => { setShowCreateModal(false); setShowEditModal(false); setSelectedJob(null); }}
                                    className="w-full sm:w-auto"
                                >
                                    إلغاء
                                </Button>
                                <Button variant="primary" type="submit" disabled={isLoading} className="w-full sm:w-auto">
                                    {isLoading ? 'جاري الحفظ...' : (showCreateModal ? 'إنشاء الوظيفة' : 'حفظ التغييرات')}
                                </Button>
                            </div>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    )
}

export default JobsPage
