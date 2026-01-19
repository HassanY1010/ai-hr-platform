import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, Button, Badge } from '@hr/ui'
import { Search, Filter, Calendar, User, Shield, Activity, Clock, TrendingUp, FileText, Trash2, Settings, RotateCcw } from 'lucide-react'
import { AuditLog } from '@hr/types'
import { useAuditLogsStore } from '../store'
import { adminService } from '@hr/services'
import { toast } from 'sonner'
import {
    ActivitySummary,
    LogTable,
    LogTimeline,
    LogAnalytics,
    RealTimeMonitor,
    AdvancedFilter
} from '../components'
import { ExportMenu, RefreshButton } from '../../../shared/components'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatDate } from '@hr/utils'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const AuditLogsPage: React.FC = () => {
    const { logs, summary, refreshLogs } = useAuditLogsStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState<'table' | 'timeline' | 'analytics'>('table')
    const [showFilters, setShowFilters] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
    const [aiAnalysis, setAiAnalysis] = useState<any>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [filters, setFilters] = useState({
        actionType: 'all',
        severity: 'all',
        dateRange: 'all',
        user: '',
        ip: '',
        status: 'all'
    })
    const { theme } = useTheme()

    const handleResetFilters = () => {
        setSearchTerm('')
        setFilters({
            actionType: 'all',
            severity: 'all',
            dateRange: 'all',
            user: '',
            ip: '',
            status: 'all'
        })
    }

    // Enhanced filtering logic
    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const matchesSearch = !searchTerm ||
                (log.user?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (log.action?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (log.target?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (log.ip || '').includes(searchTerm)

            const matchesActionType = filters.actionType === 'all' || log.actionType === filters.actionType
            const matchesSeverity = filters.severity === 'all' || log.severity === filters.severity
            const matchesStatus = filters.status === 'all' || log.status === filters.status
            const matchesUser = !filters.user || log.user.toLowerCase().includes(filters.user.toLowerCase())
            const matchesIp = !filters.ip || log.ip?.includes(filters.ip)

            // Date Range Filtering
            let matchesDate = true
            if (filters.dateRange !== 'all') {
                const logDate = new Date(log.timestamp)
                const now = new Date()
                if (filters.dateRange === 'today') {
                    matchesDate = logDate.toDateString() === now.toDateString()
                } else if (filters.dateRange === 'week') {
                    const weekAgo = new Date()
                    weekAgo.setDate(now.getDate() - 7)
                    matchesDate = logDate >= weekAgo
                } else if (filters.dateRange === 'month') {
                    const monthAgo = new Date()
                    monthAgo.setMonth(now.getMonth() - 1)
                    matchesDate = logDate >= monthAgo
                } else if (filters.dateRange === 'quarter') {
                    const quarterAgo = new Date()
                    quarterAgo.setMonth(now.getMonth() - 3)
                    matchesDate = logDate >= quarterAgo
                }
            }

            return matchesSearch && matchesActionType && matchesSeverity && matchesStatus && matchesUser && matchesIp && matchesDate
        })
    }, [logs, searchTerm, filters])


    React.useEffect(() => {
        refreshLogs()
    }, [refreshLogs])

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await refreshLogs()
        setTimeout(() => setIsRefreshing(false), 800)
    }

    const handleAIAnalyze = async () => {
        if (logs.length === 0) return
        setIsAnalyzing(true)
        try {
            const response = await adminService.analyzeLogs(logs.slice(0, 50))
            setAiAnalysis(response.data)
            toast.success('تم الانتهاء من تحليل السجلات')
        } catch (error) {
            toast.error('فشل في تحليل السجلات')
        } finally {
            setIsAnalyzing(false)
        }
    }



    // ...

    const handleExport = (format: string) => {
        const fmt = format.toLowerCase();
        if (fmt === 'pdf') {
            // ... existing PDF logic
            const doc = new jsPDF()
            doc.setFontSize(20)
            doc.text('Audit Logs Report', 14, 22)
            doc.setFontSize(11)
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30)

            const tableColumn = ["User", "Action", "Type", "Severity", "Target", "Status", "Date"]
            const tableRows = filteredLogs.map(log => [
                log.user,
                log.action,
                log.actionType,
                log.severity,
                log.target || '-',
                log.status,
                new Date(log.timestamp).toLocaleDateString()
            ])

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                theme: 'striped',
                headStyles: { fillColor: [79, 70, 229] }
            })

            doc.save(`audit-logs-${new Date().toISOString().split('T')[0]}.pdf`)
            toast.success('تم تصدير السجلات بنجاح')
        } else if (fmt === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(filteredLogs.map(log => ({
                'User': log.user,
                'Action': log.action,
                'Type': log.actionType,
                'Severity': log.severity,
                'Target': log.target || '-',
                'Status': log.status,
                'Date': new Date(log.timestamp).toLocaleString(),
                'Details': typeof log.details === 'string' ? log.details : JSON.stringify(log.details)
            })));

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Logs");
            XLSX.writeFile(workbook, `audit-logs-${new Date().toISOString().split('T')[0]}.xlsx`);
            toast.success('تم تصدير ملف Excel بنجاح');
        } else if (fmt === 'csv') {
            // ... existing CSV logic
            const headers = ["User", "Action", "Type", "Severity", "Target", "Status", "Date", "Details"];
            const csvContent = [
                headers.join(","),
                ...filteredLogs.map(log => [
                    `"${log.user}"`,
                    `"${log.action}"`,
                    `"${log.actionType}"`,
                    `"${log.severity}"`,
                    `"${log.target || ''}"`,
                    `"${log.status}"`,
                    `"${new Date(log.timestamp).toISOString()}"`,
                    `"${(log.details || '').replace(/"/g, '""')}"`
                ].join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success('تم تصدير ملف CSV بنجاح');
            }
        } else {
            toast.info(`تصدير ${format} غير مدعوم حالياً`)
        }
    }


    const getActionIcon = (action: string) => {
        const icons: Record<string, any> = {
            'create': <FileText className="w-4 h-4" />,
            'update': <Settings className="w-4 h-4" />,
            'delete': <Trash2 className="w-4 h-4" />,
            'login': <User className="w-4 h-4" />,
            'security': <Shield className="w-4 h-4" />,
            'system': <Activity className="w-4 h-4" />
        }
        return icons[action] || <Activity className="w-4 h-4" />
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
            case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
        }
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800/50 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                            {/* Title Section */}
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    سجلات النشاط
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400 mt-1">
                                    مراقبة وتتبع جميع العمليات في النظام مع تحليلات متقدمة
                                </p>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <RefreshButton onClick={handleRefresh} isLoading={isRefreshing} />
                                <ExportMenu onExport={handleExport} />
                                <Button
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2"
                                >
                                    <Filter className="w-4 h-4" />
                                    تصفية متقدمة
                                </Button>
                            </div>
                        </div>

                        {/* View Mode Tabs */}
                        <div className="flex gap-1 mt-6 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg w-fit">
                            {[
                                { id: 'table', label: 'جدول', icon: FileText },
                                { id: 'timeline', label: 'الجدول الزمني', icon: Clock },
                                { id: 'analytics', label: 'تحليلات', icon: TrendingUp }
                            ].map((mode) => {
                                const Icon = mode.icon
                                return (
                                    <button
                                        key={mode.id}
                                        onClick={() => setViewMode(mode.id as any)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === mode.id
                                            ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {mode.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </motion.div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Real-time Monitor */}
                    <RealTimeMonitor />

                    {/* Activity Summary */}
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <ActivitySummary summary={summary} />
                        </div>
                        <Card className="bg-white dark:bg-slate-800 shadow-xl border-none">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-indigo-500" />
                                        تحليل الذكاء الاصطناعي
                                    </h3>
                                    <Button
                                        size="sm"
                                        onClick={handleAIAnalyze}
                                        disabled={isAnalyzing || logs.length === 0}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        {isAnalyzing ? 'جاري التحليل...' : 'بدء التحليل'}
                                    </Button>
                                </div>
                                {aiAnalysis ? (
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg flex items-center gap-3 ${aiAnalysis.level === 'CRITICAL' ? 'bg-red-50 text-red-700' : aiAnalysis.level === 'WARNING' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                                            }`}>
                                            <div className="text-xl font-bold">{aiAnalysis.score}%</div>
                                            <div className="text-xs font-medium">مستوى المخاطرة: {aiAnalysis.level}</div>
                                        </div>
                                        <div className="space-y-1">
                                            {aiAnalysis.insights.map((insight: string, i: number) => (
                                                <div key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                                    <span className="mt-1 w-1 h-1 bg-slate-400 rounded-full shrink-0" />
                                                    {insight}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-500 italic">
                                        انقر على "بدء التحليل" للكشف عن الأنماط المشبوهة في السجلات.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Advanced Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mt-6"
                            >
                                <AdvancedFilter filters={filters} onFiltersChange={setFilters} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Search and Quick Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6"
                    >
                        <Card className="bg-white dark:bg-slate-800 shadow-xl border-none">
                            <CardContent className="p-4">
                                <div className="flex flex-col lg:flex-row gap-4">

                                    {/* Search Input */}
                                    <div className="relative flex-1">
                                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="ابحث في السجلات (المستخدم، الإجراء، الهدف، عنوان IP)..."
                                            className="w-full pr-12 pl-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    {/* Quick Filters */}
                                    <div className="flex gap-2 flex-wrap">
                                        <select
                                            className="border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                            value={filters.actionType}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters({ ...filters, actionType: e.target.value })}
                                        >
                                            <option value="all">جميع الإجراءات</option>
                                            <option value="create">إنشاء</option>
                                            <option value="update">تحديث</option>
                                            <option value="delete">حذف</option>
                                            <option value="login">دخول</option>
                                            <option value="security">أمني</option>
                                        </select>

                                        <select
                                            className="border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                            value={filters.severity}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters({ ...filters, severity: e.target.value })}
                                        >
                                            <option value="all">جميع المستويات</option>
                                            <option value="low">منخفض</option>
                                            <option value="medium">متوسط</option>
                                            <option value="high">مرتفع</option>
                                            <option value="critical">حرج</option>
                                        </select>

                                        <select
                                            className="border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                            value={filters.dateRange}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters({ ...filters, dateRange: e.target.value })}
                                        >
                                            <option value="all">جميع التواريخ</option>
                                            <option value="today">اليوم</option>
                                            <option value="week">آخر 7 أيام</option>
                                            <option value="month">آخر 30 يوم</option>
                                            <option value="quarter">آخر 3 أشهر</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                        تم العثور على <span className="font-semibold text-indigo-600 dark:text-indigo-400">{filteredLogs.length}</span> سجل
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-600 dark:text-slate-400">
                                            آخر تحديث: {formatDate(new Date(), 'p')}
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleResetFilters}
                                        className="text-slate-500 hover:text-indigo-600 transition-colors"
                                    >
                                        <RotateCcw className="w-4 h-4 ml-2" />
                                        إعادة ضبط الفلاتر
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>


                    <AnimatePresence mode="wait">
                        {viewMode === 'table' && (
                            <motion.div
                                key="table"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mt-6"
                            >
                                <Card className="bg-white dark:bg-slate-800 shadow-xl border-none overflow-hidden">
                                    <CardContent className="p-0">
                                        <LogTable
                                            logs={filteredLogs}
                                            onLogSelect={setSelectedLog}
                                            getActionIcon={getActionIcon}
                                            getSeverityColor={getSeverityColor}
                                        />
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {viewMode === 'timeline' && (
                            <motion.div
                                key="timeline"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mt-6"
                            >
                                <Card className="bg-white dark:bg-slate-800 shadow-xl border-none">
                                    <CardContent className="p-6">
                                        <LogTimeline
                                            logs={filteredLogs}
                                            getActionIcon={getActionIcon}
                                            getSeverityColor={getSeverityColor}
                                        />
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {viewMode === 'analytics' && (
                            <motion.div
                                key="analytics"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mt-6"
                            >
                                <LogAnalytics
                                    logs={filteredLogs}
                                    summary={summary}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {selectedLog && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                                onClick={() => setSelectedLog(null)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">تفاصيل السجل</h3>
                                        <button
                                            onClick={() => setSelectedLog(null)}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">المستخدم</label>
                                                <p className="font-bold text-slate-900 dark:text-white mt-1">{selectedLog.user}</p>
                                            </div>
                                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">الإجراء</label>
                                                <p className="font-bold text-slate-900 dark:text-white mt-1">{selectedLog.action}</p>
                                            </div>
                                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">التاريخ</label>
                                                <p className="font-bold text-slate-900 dark:text-white mt-1">{formatDate(selectedLog.timestamp)}</p>
                                            </div>
                                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">الخطورة</label>
                                                <div className="mt-1">
                                                    <Badge className={getSeverityColor(selectedLog.severity)}>
                                                        {selectedLog.severity}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedLog.details && (
                                            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">البيانات التقنية</label>
                                                <pre className="text-green-400 font-mono text-sm mt-2 overflow-x-auto">
                                                    {JSON.stringify(typeof selectedLog.details === 'string' ? JSON.parse(selectedLog.details) : selectedLog.details, null, 2)}
                                                </pre>
                                            </div>
                                        )}

                                        <div className="flex justify-end pt-4">
                                            <Button onClick={() => setSelectedLog(null)} className="bg-indigo-600 text-white px-8">
                                                إغلاق
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default AuditLogsPage