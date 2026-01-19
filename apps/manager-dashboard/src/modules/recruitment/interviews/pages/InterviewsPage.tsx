// apps/manager-dashboard/src/modules/recruitment/interviews/pages/InterviewsPage.tsx
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Clock,
    Video,
    MapPin,
    CheckCircle,
    Plus,
    Search,
    Sparkles,
    Calendar as CalendarIcon,
    Calendar,
    MessageSquare,
    ChevronRight,
    ChevronLeft
} from 'lucide-react'
import { InterviewActionsMenu } from '../components/InterviewActionsMenu'
import { useCandidatesStore } from '../../candidates/store'
import { useInterviewsStore } from '../store';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ar } from 'date-fns/locale';

// المكونات المساعدة
const Card: React.FC<{ children: React.ReactNode, className?: string, onClick?: () => void }> = ({ children, className = '', onClick }) => (
    <div onClick={onClick} className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden ${className} ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} transition-all duration-200`}>{children}</div>
)

const Button: React.FC<{ children: React.ReactNode, variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ai' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg', className?: string, onClick?: () => void, leftIcon?: React.ReactNode, type?: 'button' | 'submit' | 'reset', disabled?: boolean }> = ({ children, variant = 'primary', size = 'md', className = '', onClick, leftIcon, type = 'button', disabled = false }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]'
    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
        secondary: 'bg-gray-600 dark:bg-gray-700 text-white hover:bg-gray-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        success: 'bg-green-600 text-white hover:bg-green-700',
        ai: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:opacity-90 shadow-md',
        outline: 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
        ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
    }
    const sizeClasses = { sm: 'px-3 py-1.5 text-sm gap-1', md: 'px-4 py-2 text-sm gap-2', lg: 'px-6 py-3 text-base gap-2' }
    return <button type={type} disabled={disabled} className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} onClick={(e) => { e.stopPropagation(); onClick?.(); }}>{leftIcon && <span>{leftIcon}</span>}{children}</button>
}

const Badge: React.FC<{ children: React.ReactNode, variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'neutral' | 'ai', className?: string }> = ({ children, variant = 'neutral', className = '' }) => {
    const variantClasses = {
        primary: 'bg-blue-100 text-blue-700 border-blue-300',
        secondary: 'bg-gray-100 text-gray-700 border-gray-300',
        danger: 'bg-red-100 text-red-700 border-red-300',
        warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        success: 'bg-green-100 text-green-700 border-green-300',
        neutral: 'bg-gray-100 text-gray-700 border-gray-300',
        ai: 'bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 text-purple-700 border-purple-200'
    }
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]} ${className}`}>{children}</span>
}

const Modal: React.FC<{ isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const sizeClasses = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto" onClick={onClose}>
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`inline-block align-bottom bg-white dark:bg-gray-900 rounded-2xl text-right shadow-2xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} w-full border border-gray-100 dark:border-gray-800 relative z-10`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 font-bold">
                        <h3 className="text-xl text-gray-900 dark:text-white">{title}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">✕</button>
                    </div>
                    <div className="p-6">{children}</div>
                </motion.div>
            </div>
        </div>
    )
}

const InterviewsPage: React.FC = () => {
    const { interviews, smartNotes, fetchInterviews, fetchSmartNotes, createInterview, deleteInterview, updateInterview, isLoading } = useInterviewsStore();
    const { candidates, fetchCandidates } = useCandidatesStore();

    // States
    const [showScheduleModal, setShowScheduleModal] = React.useState(false);
    const [showNoteModal, setShowNoteModal] = React.useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = React.useState(false);
    const [selectedInterview, setSelectedInterview] = React.useState<any>(null);
    const [selectedVideoUrl, setSelectedVideoUrl] = React.useState<string | null>(null);
    const [viewMode, setViewMode] = React.useState<'list' | 'calendar'>('list');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    React.useEffect(() => {
        fetchInterviews();
        fetchCandidates();
        fetchSmartNotes();
    }, [fetchInterviews, fetchCandidates, fetchSmartNotes]);

    // Handlers
    const handleSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        try {
            await createInterview({
                candidateId: formData.get('candidateId') as string,
                scheduledAt: new Date(formData.get('scheduledAt') as string).toISOString(),
                type: formData.get('type') as any,
                notes: formData.get('notes') as string,
                interviewerName: formData.get('interviewerName') as string,
            });
            toast.success('تم جدولة المقابلة بنجاح');
            setShowScheduleModal(false);
            fetchInterviews();
        } catch (error) {
            toast.error('حدث خطأ أثناء جدولة المقابلة');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await updateInterview(id, { status: status as any });
            toast.success('تم تحديث حالة المقابلة');
            fetchInterviews();
        } catch (error) {
            toast.error('فشل تحديث الحالة');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('هل أنت متأكد من حذف هذه المقابلة؟')) return;
        try {
            await deleteInterview(id);
            toast.success('تم حذف المقابلة بنجاح');
        } catch (error) {
            toast.error('فشل حذف المقابلة');
        }
    };

    const handleAddNote = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedInterview) return;
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const note = formData.get('note') as string;
        try {
            const updatedNotes = selectedInterview.notes ? `${selectedInterview.notes}\n---\n${note}` : note;
            await updateInterview(selectedInterview.id, { notes: updatedNotes });
            toast.success('تم إضافة الملاحظة بنجاح');
            setShowNoteModal(false);
            fetchInterviews();
        } catch (error) {
            toast.error('فشل إضافة الملاحظة');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReschedule = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedInterview) return;
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        try {
            await updateInterview(selectedInterview.id, {
                scheduledAt: new Date(formData.get('scheduledAt') as string).toISOString()
            });
            toast.success('تم تعديل موعد المقابلة بنجاح');
            setShowRescheduleModal(false);
            fetchInterviews();
        } catch (error) {
            toast.error('فشل تعديل الموعد');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter Logic
    const filteredInterviews = (interviews || []).filter(i => {
        const query = searchQuery.toLowerCase();
        const candidateName = i.candidate?.name?.toLowerCase() || '';
        const position = i.candidate?.job?.title?.toLowerCase() || '';
        const interviewer = i.interviewerName?.toLowerCase() || '';
        return candidateName.includes(query) || position.includes(query) || interviewer.includes(query);
    });

    const interviewsToday = (interviews || []).filter(i => {
        const today = new Date().toISOString().split('T')[0];
        return i.scheduledAt && i.scheduledAt.split('T')[0] === today;
    });

    // Calendar Helper Components
    const renderCalendarHeader = () => {
        return (
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-800 bg-white dark:bg-gray-950">
                <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronRight className="h-5 w-5" /></Button>
                <h3 className="font-bold text-lg dark:text-white capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: ar })}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronLeft className="h-5 w-5" /></Button>
            </div>
        );
    };

    const renderCalendarDays = () => {
        const days = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
        return (
            <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-900/50">
                {days.map(day => (
                    <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">{day}</div>
                ))}
            </div>
        );
    };

    const renderCalendarCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const formattedDate = format(day, 'd');
                const cloneDay = day;
                const dayInterviews = (interviews || []).filter(inv => inv.scheduledAt && isSameDay(new Date(inv.scheduledAt), cloneDay));

                days.push(
                    <div
                        key={day.toString()}
                        className={`min-h-[110px] p-2 border-r border-b dark:border-gray-800 transition-colors ${!isSameMonth(day, monthStart) ? 'bg-gray-50/50 dark:bg-gray-800/10 text-gray-300' : 'bg-white dark:bg-gray-900'} ${isSameDay(day, new Date()) ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isSameDay(day, new Date()) ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}>{formattedDate}</span>
                        </div>
                        <div className="space-y-1">
                            {dayInterviews.slice(0, 3).map(inv => (
                                <div key={inv.id} className="text-[10px] p-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800 truncate leading-tight" title={`${inv.candidate?.name} - ${inv.candidate?.job?.title}`}>
                                    {inv.candidate?.name}
                                </div>
                            ))}
                            {dayInterviews.length > 3 && <div className="text-[9px] text-gray-500 text-center font-medium">+{dayInterviews.length - 3} إضافي</div>}
                        </div>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(<div key={day.toString()} className="grid grid-cols-7">{days}</div>);
            days = [];
        }
        return <div className="border-l dark:border-gray-800">{rows}</div>;
    };

    return (
        <div className="space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen p-4 sm:p-6 transition-colors duration-300">
            {/* Header Section */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">إدارة المقابلات</h1>
                    <p className="text-gray-500 mt-1 font-medium">تنسيق ذكي وإحصائيات مباشرة لمسار التوظيف</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white dark:bg-gray-900 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            قائمة
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'calendar' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            تقويم
                        </button>
                    </div>
                    <Button variant="primary" size="lg" leftIcon={<Plus className="w-5 h-5" />} onClick={() => setShowScheduleModal(true)}>جدولة مقابلة</Button>
                </div>
            </motion.div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-l-4 border-l-blue-500">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 shadow-inner group-hover:scale-110 transition-transform"><CalendarIcon className="h-7 w-7" /></div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">مقابلات اليوم</p>
                            <h3 className="text-3xl font-black dark:text-white mt-1">{interviewsToday.length}</h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-l-4 border-l-green-500">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-2xl text-green-600 shadow-inner"><CheckCircle className="h-7 w-7" /></div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">مكتملة</p>
                            <h3 className="text-3xl font-black dark:text-white mt-1">{(interviews || []).filter(i => i.status === 'completed').length}</h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-l-4 border-l-purple-500">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl text-purple-600 shadow-inner"><Clock className="h-7 w-7" /></div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">بانتظار الموعد</p>
                            <h3 className="text-3xl font-black dark:text-white mt-1">{(interviews || []).filter(i => i.status !== 'completed' && i.status !== 'cancelled').length}</h3>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Operations Center */}
            <Card>
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <h2 className="font-extrabold text-xl dark:text-white">مركز العمليات</h2>
                        <Badge variant="ai" className="px-3 py-1 animate-pulse">تم التحديث للتو</Badge>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ابحث باسم المرشح، الوظيفة، أو المحاور..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pr-11 pl-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl outline-none focus:ring-2 ring-blue-500/50 transition-all text-sm"
                        />
                    </div>
                </div>

                {viewMode === 'calendar' ? (
                    <div className="overflow-hidden">
                        {renderCalendarHeader()}
                        {renderCalendarDays()}
                        {renderCalendarCells()}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 text-xs font-black uppercase tracking-widest border-b dark:border-gray-800">
                                    <th className="p-5">المرشح / الوظيفة</th>
                                    <th className="p-5">المسؤول عن المقابلة</th>
                                    <th className="p-5">توقيت المقابلة</th>
                                    <th className="p-5">القناة</th>
                                    <th className="p-5">الحالة الراهنة</th>
                                    <th className="p-5">تحليل AI</th>
                                    <th className="p-5 text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-800">
                                <AnimatePresence mode="popLayout">
                                    {filteredInterviews.length > 0 ? filteredInterviews.map((interview) => {
                                        const candidateName = interview.candidate?.name || 'Unknown';
                                        const position = interview.candidate?.job?.title || 'N/A';
                                        const interviewerName = interview.interviewerName || 'لم يحدد';
                                        const scheduledDate = interview.scheduledAt ? new Date(interview.scheduledAt).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' }) : '—';
                                        const scheduledTime = interview.scheduledAt ? new Date(interview.scheduledAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '—';
                                        const statusColor = interview.status === 'completed' ? 'success' : interview.status === 'cancelled' ? 'danger' : 'primary';
                                        const statusLabel = interview.status === 'completed' ? 'تمت بنجاح' : interview.status === 'cancelled' ? 'تم الإلغاء' : 'في الانتظار';

                                        return (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                key={interview.id}
                                                className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors group"
                                            >
                                                <td className="p-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:rotate-6 transition-transform">{candidateName[0]}</div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 dark:text-white text-base">{candidateName}</p>
                                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-0.5">{position}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-sm font-semibold text-gray-700 dark:text-gray-300">{interviewerName}</td>
                                                <td className="p-5 text-sm">
                                                    <div className="flex items-center gap-2 font-black dark:text-white text-blue-900 leading-none mb-1"><CalendarIcon className="h-4 w-4 text-blue-500" /> {scheduledDate}</div>
                                                    <div className="flex items-center gap-2 text-gray-500 font-bold"><Clock className="h-4 w-4" /> {scheduledTime}</div>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                                        {interview.type === 'online' || interview.type === 'VIDEO' ? <Video className="h-5 w-5 text-blue-500" /> : <MapPin className="h-5 w-5 text-orange-500" />}
                                                        {interview.type === 'online' || interview.type === 'VIDEO' ? 'لقاء مرئي' : 'لقاء مكتبي'}
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <Badge variant={statusColor} className="px-4 py-1.5 shadow-sm">{statusLabel}</Badge>
                                                </td>
                                                <td className="p-5 max-w-[200px]">
                                                    <div className="flex items-start gap-2 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-100 dark:border-purple-800 group/ai cursor-help relative">
                                                        <p className="text-[11px] text-purple-700 dark:text-purple-300 font-bold line-clamp-2 leading-relaxed">
                                                            {interview.aiAnalysis?.summary || interview.aiAnalysis?.reasoning || 'يتم فحص بيانات المرشح تلقائياً...'}
                                                        </p>
                                                        <Sparkles className="w-3 h-3 text-purple-600 mt-0.5 shrink-0" />
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex items-center justify-center gap-3">
                                                        {interview.videoUrl && (
                                                            <Button variant="outline" size="sm" className="rounded-xl border-2" onClick={() => setSelectedVideoUrl(interview.videoUrl || null)}>
                                                                <Video className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <InterviewActionsMenu
                                                            interview={interview}
                                                            onDelete={handleDelete}
                                                            onUpdateStatus={handleUpdateStatus}
                                                            onReschedule={(inv) => {
                                                                setSelectedInterview(inv);
                                                                setShowRescheduleModal(true);
                                                            }}
                                                            onAddNote={(id) => {
                                                                setSelectedInterview(filteredInterviews.find(i => i.id === id));
                                                                setShowNoteModal(true);
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        )
                                    }) : (
                                        <tr>
                                            <td colSpan={7} className="p-20 text-center">
                                                {isLoading ? (
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                        <p className="font-bold text-gray-500">جاري إحضار البيانات...</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-4 opacity-50">
                                                        <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center"><Search className="h-10 w-10 text-gray-400" /></div>
                                                        <p className="text-xl font-bold text-gray-500">لا توجد نتائج بحث مطابقة</p>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Bottom Grid: AI Notes & Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                <Card className="p-8 bg-gradient-to-br from-indigo-700 via-blue-800 to-indigo-900 text-white border-0 shadow-2xl overflow-hidden relative group">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 0.1 }} className="absolute -top-10 -right-10 p-8 group-hover:rotate-12 transition-transform duration-700"><Sparkles className="w-48 h-48" /></motion.div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xl border border-white/20"><Sparkles className="h-6 w-6 text-yellow-300" /></div>
                            <h3 className="font-black text-2xl tracking-tight">الرؤى والتحليلات الذكية</h3>
                        </div>
                        <ul className="space-y-4">
                            {smartNotes && smartNotes.length > 0 ? smartNotes.map((note, idx) => (
                                <motion.li
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.15, type: 'spring' }}
                                    key={idx}
                                    className="flex items-start gap-4 text-base bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all cursor-default"
                                >
                                    <div className="mt-1 h-6 w-6 shrink-0 bg-blue-400 rounded-full flex items-center justify-center text-[10px] font-black text-blue-900 border-2 border-white/30">{idx + 1}</div>
                                    <span className="flex-1 leading-relaxed font-medium">{note}</span>
                                </motion.li>
                            )) : (
                                <div className="text-center py-10 bg-black/10 rounded-3xl border border-dashed border-white/20">
                                    <Clock className="w-12 h-12 text-white/30 mx-auto mb-3 animate-pulse" />
                                    <p className="text-lg font-bold text-white/60">جاري معالجة بيانات المرشحين القادمين...</p>
                                </div>
                            )}
                        </ul>
                    </div>
                </Card>

                <div
                    className="p-8 bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center text-center group cursor-pointer hover:border-blue-600 hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-all shadow-xl hover:shadow-2xl translate-y-0 hover:-translate-y-2 active:scale-95 duration-300"
                    onClick={() => setShowScheduleModal(true)}
                >
                    <div className="h-24 w-24 rounded-3xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                        <Plus className="h-12 w-12 text-blue-600" />
                    </div>
                    <h4 className="font-black text-2xl text-gray-900 dark:text-white mb-2">تعظيم جدول أعمالك</h4>
                    <p className="text-gray-500 font-bold max-w-xs leading-relaxed">أضف موعداً جديداً، تذكيراً مهماً، أو ملاحظة سريعة لفريق التوظيف الخاص بك</p>
                </div>
            </div>

            {/* Modals Implementation */}
            <Modal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} title="إعداد تفاصيل المقابلة" size="lg">
                <form className="space-y-6" onSubmit={handleSchedule}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-black text-gray-700 dark:text-gray-300">المرشح المستهدف</label>
                            <select name="candidateId" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl outline-none focus:border-blue-500 transition-all font-bold" required>
                                <option value="">اختر من القائمة...</option>
                                {candidates.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} — {c.job?.title || 'عام'}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-black text-gray-700 dark:text-gray-300">المسؤول عن التقييم</label>
                            <input name="interviewerName" type="text" placeholder="الاسم الكامل" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl outline-none focus:border-blue-500 transition-all font-bold" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-black text-gray-700 dark:text-gray-300">الموعد المحدد</label>
                            <input name="scheduledAt" type="datetime-local" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl outline-none focus:border-blue-500 transition-all font-bold" required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-black text-gray-700 dark:text-gray-300">بيئة اللقاء</label>
                            <select name="type" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl outline-none focus:border-blue-500 transition-all font-bold" required>
                                <option value="online">عن بعد (Online Meeting)</option>
                                <option value="in_person">في المقر (Office Visit)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-black text-gray-700 dark:text-gray-300">الأجندة والملاحظات</label>
                        <textarea name="notes" placeholder="ما هي الأهداف الرئيسية من هذه المقابلة؟" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl outline-none focus:border-blue-500 transition-all font-medium h-32 resize-none" />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" className="px-8" onClick={() => setShowScheduleModal(false)}>إلغاء</Button>
                        <Button variant="primary" type="submit" className="px-10" disabled={isSubmitting}>
                            {isSubmitting ? 'جاري الحفظ...' : 'تأكيد وحفظ'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={showNoteModal} onClose={() => setShowNoteModal(false)} title="تثبيت ملاحظة إضافية">
                <form className="space-y-5" onSubmit={handleAddNote}>
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800 flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-orange-600" />
                        <p className="text-sm font-bold text-orange-900 dark:text-orange-200">إضافة ملاحظة لملف المرشح: {selectedInterview?.candidate?.name}</p>
                    </div>
                    <textarea
                        name="note"
                        placeholder="اكتب أفكارك أو ملاحظاتك هنا لتكون مرجعاً للجميع..."
                        className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 transition-all font-medium h-48 resize-none"
                        required
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" onClick={() => setShowNoteModal(false)}>تراجع</Button>
                        <Button variant="primary" type="submit" className="px-8" disabled={isSubmitting}>حفظ وتعليق</Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={showRescheduleModal} onClose={() => setShowRescheduleModal(false)} title="تغيير توقيت المقابلة">
                <form className="space-y-5" onSubmit={handleReschedule}>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <p className="text-sm font-bold text-blue-900 dark:text-blue-200">تعديل جدول المرشح: {selectedInterview?.candidate?.name}</p>
                    </div>
                    <div className="space-y-1.5 px-1">
                        <label className="block text-sm font-black text-gray-700 dark:text-gray-300">الموعد الجديد المقترح</label>
                        <input name="scheduledAt" type="datetime-local" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl outline-none focus:border-blue-500 transition-all font-bold shadow-sm" required />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setShowRescheduleModal(false)}>إلغاء</Button>
                        <Button variant="primary" type="submit" className="px-8" disabled={isSubmitting}>تحديث الأجندة</Button>
                    </div>
                </form>
            </Modal>

            {/* Video Player Modal */}
            <Modal isOpen={!!selectedVideoUrl} onClose={() => setSelectedVideoUrl(null)} title="استعراض تسجيل المقابلة" size="lg">
                {selectedVideoUrl && (
                    <div className="space-y-6">
                        <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group">
                            <video controls className="w-full h-full shadow-inner" autoPlay>
                                <source src={selectedVideoUrl} type="video/mp4" />
                                متصفحك الحالي لا يدعم تقنيات تشغيل هذا الفيديو.
                            </video>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                            <p className="text-sm font-bold text-gray-500">جودة العرض: عالية (1080p)</p>
                            <Button variant="outline" size="sm" className="rounded-xl px-6" onClick={() => setSelectedVideoUrl(null)}>إغلاق المشغل</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default InterviewsPage
