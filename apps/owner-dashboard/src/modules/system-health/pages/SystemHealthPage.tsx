import { ServiceStatus } from '@hr/types';
import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, Button } from '@hr/ui'
import {
    Activity, Server, Database, Shield, AlertTriangle,
    Clock, BarChart3, PieChart, Eye, Zap, HardDrive,
    Network, AlertCircle, CheckCheck
} from 'lucide-react'
import { useSystemHealthStore } from '../store'
import { HardwareMetrics } from '@/modules/system-health/components/HardwareMetrics'
import { ServiceStatusCards } from '@/modules/system-health/components/ServiceStatusCards'
import { PerformanceCharts } from '@/modules/system-health/components/PerformanceCharts'
import { AlertPanel } from '@/modules/system-health/components/AlertPanel'
import { IncidentTimeline } from '@/modules/system-health/components/IncidentTimeline'
import { RegionStatus } from '@/modules/system-health/components/RegionStatus'
import { ResourceUtilization } from '@/modules/system-health/components/ResourceUtilization'
import { AutoScalingStatus } from '@/modules/system-health/components/AutoScalingStatus'
import { BackupStatus } from '@/modules/system-health/components/BackupStatus'
import { SecurityMetrics } from '@/modules/system-health/components/SecurityMetrics'
import { ExportButton } from '../../../shared/components/ExportButton'
import { RefreshButton } from '../../../shared/components/RefreshButton'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatTime } from '@hr/utils'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const SystemHealthPage: React.FC = () => {
    const {
        services, metrics, alerts, incidents, refreshHealth,
        autoRefresh, setAutoRefresh, aiAnalysis, isAnalyzing, analyzePerformance
    } = useSystemHealthStore()
    const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'alerts' | 'resources' | 'security'>('overview')
    const [isMonitoringMode, setIsMonitoringMode] = useState(false)
    const [showIncidentDetails, setShowIncidentDetails] = useState<string | null>(null)
    const [lastRefresh, setLastRefresh] = useState(new Date())
    const { theme } = useTheme()

    // Auto-refresh functionality
    // Initial load
    useEffect(() => {
        refreshHealth();
    }, [refreshHealth]);

    // Auto-refresh functionality
    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(() => {
                refreshHealth()
                setLastRefresh(new Date())
            }, 30000) // Refresh every 30 seconds
            return () => clearInterval(interval)
        }
    }, [autoRefresh, refreshHealth])

    // Download current health data
    const handleExport = (format: 'csv' | 'pdf' | 'excel' | 'json') => {
        if (format === 'pdf') {
            const doc = new jsPDF()

            // Header
            doc.setFontSize(20)
            doc.text('System Health Report', 14, 22)
            doc.setFontSize(10)
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30)

            // Metrics Summary
            doc.setFontSize(14)
            doc.text('Key Metrics', 14, 45)

            const metricsData = [
                ['CPU Usage', `${(metrics as any).cpu?.value || 0}%`],
                ['Memory Usage', `${(metrics as any).memory?.value || 0}%`],
                ['Response Time', `${metrics.responseTime}ms`],
                ['Active Services', `${services.filter(s => s.status === 'healthy').length}/${services.length}`]
            ]

            autoTable(doc, {
                startY: 50,
                head: [['Metric', 'Value']],
                body: metricsData,
                theme: 'striped',
                headStyles: { fillColor: [79, 70, 229] }
            })

            // Services Detail
            doc.setFontSize(14)
            // @ts-ignore
            doc.text('Detailed Service Status', 14, doc.lastAutoTable.finalY + 15)

            const tableData = services.map(s => [
                s.name,
                s.status.toUpperCase(),
                s.category || 'N/A',
                `${s.latency}ms`,
                `${Math.floor(Number(s.uptime || 0) / 3600)}h`
            ])

            autoTable(doc, {
                // @ts-ignore
                startY: doc.lastAutoTable.finalY + 20,
                head: [['Service Name', 'Status', 'Category', 'Latency', 'Uptime']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [79, 70, 229] },
                styles: { fontSize: 8 },
                didParseCell: (data) => {
                    if (data.section === 'body' && data.column.index === 1) {
                        const status = data.cell.raw as string
                        if (status === 'HEALTHY') data.cell.styles.textColor = [34, 197, 94]
                        if (status === 'DEGRADED') data.cell.styles.textColor = [234, 179, 8]
                        if (status === 'DOWN') data.cell.styles.textColor = [239, 68, 68]
                    }
                }
            })

            doc.save(`system-health-report-${new Date().toISOString().split('T')[0]}.pdf`)
        }
    }

    const toggleMonitoringMode = () => {
        if (!isMonitoringMode) {
            document.documentElement.requestFullscreen().catch((e) => console.log('Fullscreen blocked:', e))
            setIsMonitoringMode(true)
        } else {
            document.exitFullscreen().catch((e) => console.log('Exit fullscreen error:', e))
            setIsMonitoringMode(false)
        }
    }

    const handleRefresh = async () => {
        await refreshHealth()
        setLastRefresh(new Date())
    }

    // Calculate system-wide health score
    const systemHealthScore = useMemo(() => {
        if (services.length === 0) return 100
        const healthyServices = services.filter(s => s.status === 'healthy').length
        return Math.round((healthyServices / services.length) * 100)
    }, [services])

    // Group services by category
    const servicesByCategory = useMemo(() => {
        const categories: Record<string, ServiceStatus[]> = {
            'core': [],
            'database': [],
            'storage': [],
            'network': [],
            'security': [],
            'monitoring': [],
            'other': []
        }

        services.forEach(service => {
            const category = service.category || 'other'
            if (category in categories) {
                categories[category].push(service)
            } else {
                categories['other'].push(service)
            }
        })

        return categories
    }, [services])

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen transition-all duration-300">

                {/* Header Section - Hidden in Monitoring Mode */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: isMonitoringMode ? 0 : 1, y: isMonitoringMode ? -100 : 0, height: isMonitoringMode ? 0 : 'auto' }}
                    className="bg-white dark:bg-slate-800/50 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 overflow-hidden"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                            {/* Title Section */}
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    حالة النظام
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400 mt-1">
                                    مراقبة أداء الخوادم والخدمات السحابية في الوقت الفعلي
                                </p>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-3 flex-wrap">
                                {/* Auto-refresh Toggle */}
                                <Button
                                    variant={autoRefresh ? "primary" : "outline"}
                                    size="sm"
                                    onClick={() => setAutoRefresh(!autoRefresh)}
                                    className="flex items-center gap-2"
                                >
                                    {autoRefresh ? (
                                        <>
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                            تحديث تلقائي
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                                            تحديث يدوي
                                        </>
                                    )}
                                </Button>

                                <RefreshButton onClick={handleRefresh} />
                                <ExportButton onExport={handleExport} />

                                {/* System Health Score */}
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg">
                                    <div className={`w-3 h-3 rounded-full ${systemHealthScore >= 90 ? 'bg-green-500' : systemHealthScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`} />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {systemHealthScore}% صحة النظام
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Last Refresh Info */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    آخر تحديث: {formatTime(lastRefresh)}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    {services.filter(s => s.status === 'healthy').length} من {services.length} خدمة نشطة
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex gap-2">
                                <Button
                                    variant={isMonitoringMode ? "primary" : "outline"}
                                    size="sm"
                                    onClick={toggleMonitoringMode}
                                >
                                    <Eye className="w-4 h-4 ml-2" />
                                    {isMonitoringMode ? 'خروج من وضع المراقبة' : 'وضع المراقبة'}
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={analyzePerformance}
                                    disabled={isAnalyzing}
                                    className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
                                >
                                    {isAnalyzing ? (
                                        <Activity className="w-4 h-4 ml-2 animate-spin" />
                                    ) : (
                                        <Zap className="w-4 h-4 ml-2" />
                                    )}
                                    تحسين النظام بالذكاء الاصطناعي
                                </Button>
                            </div>
                        </div>

                        {/* Service Categories Tabs */}
                        <div className="flex gap-1 mt-6 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg w-fit">
                            {[
                                { id: 'overview', label: 'نظرة عامة', icon: PieChart },
                                { id: 'performance', label: 'الأداء', icon: BarChart3 },
                                { id: 'alerts', label: 'التنبيهات', icon: AlertTriangle },
                                { id: 'resources', label: 'المصادر', icon: Server },
                                { id: 'security', label: 'الأمان', icon: Shield }
                            ].map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.id
                                            ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </motion.div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Real-time System Status Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6"
                    >
                        <div className={`bg-gradient-to-r ${systemHealthScore >= 90
                            ? 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
                            : systemHealthScore >= 70
                                ? 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20'
                                : 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20'
                            } rounded-2xl p-6 border ${systemHealthScore >= 90
                                ? 'border-green-200 dark:border-green-800'
                                : systemHealthScore >= 70
                                    ? 'border-yellow-200 dark:border-yellow-800'
                                    : 'border-red-200 dark:border-red-800'
                            }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${systemHealthScore >= 90
                                        ? 'bg-green-100 dark:bg-green-900'
                                        : systemHealthScore >= 70
                                            ? 'bg-yellow-100 dark:bg-yellow-900'
                                            : 'bg-red-100 dark:bg-red-900'
                                        }`}>
                                        {systemHealthScore >= 90 ? (
                                            <CheckCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        ) : systemHealthScore >= 70 ? (
                                            <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                        ) : (
                                            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            {systemHealthScore >= 90 ? 'جميع الأنظمة تعمل بشكل طبيعي' :
                                                systemHealthScore >= 70 ? 'توجد بعض المشكلات البسيطة' :
                                                    'توجد مشكلات حرجة في النظام'}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            {services.filter(s => s.status === 'healthy').length} من {services.length} خدمة نشطة •
                                            متوسط وقت الاستجابة: {metrics.responseTime}ms
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{systemHealthScore}%</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">صحة النظام</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* AI Insights Panel */}
                    <AnimatePresence>
                        {aiAnalysis && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 overflow-hidden"
                            >
                                <Card className="bg-indigo-600 text-white border-none shadow-xl overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <Zap className="w-32 h-32" />
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                                                <Zap className="w-5 h-5 text-yellow-300" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">توصيات الذكاء الاصطناعي لتحسين الأداء</h3>
                                                <p className="text-indigo-100 text-sm">تم التحليل بناءً على مقاييس الوقت الفعلي</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200">الرؤى والتحليلات</h4>
                                                <ul className="space-y-2">
                                                    {aiAnalysis.insights?.map((insight: string, i: number) => (
                                                        <motion.li
                                                            key={i}
                                                            initial={{ x: -20, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            className="flex items-start gap-2 text-sm bg-white/10 p-2 rounded-lg border border-white/5"
                                                        >
                                                            <CheckCheck className="w-4 h-4 text-green-300 mt-0.5 shrink-0" />
                                                            {insight}
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200">خطوات التحسين المقترحة</h4>
                                                <ul className="space-y-2">
                                                    {aiAnalysis.recommendations?.map((rec: string, i: number) => (
                                                        <motion.li
                                                            key={i}
                                                            initial={{ x: 20, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            className="flex items-start gap-2 text-sm bg-indigo-700/50 p-2 rounded-lg border border-indigo-400/20"
                                                        >
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-2 shrink-0" />
                                                            {rec}
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Content Based on Active Tab */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                {/* Enhanced Metrics Grid */}
                                <HardwareMetrics metrics={metrics} detailed />

                                {/* Services by Category */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                                        (categoryServices as any[]).length > 0 && (
                                            <Card key={category} className="bg-white dark:bg-slate-800 shadow-xl">
                                                <CardHeader title={(
                                                    <div className="flex items-center gap-2">
                                                        {category === 'core' && <Server className="w-5 h-5 text-blue-600" />}
                                                        {category === 'database' && <Database className="w-5 h-5 text-green-600" />}
                                                        {category === 'storage' && <HardDrive className="w-5 h-5 text-purple-600" />}
                                                        {category === 'network' && <Network className="w-5 h-5 text-orange-600" />}
                                                        {category === 'security' && <Shield className="w-5 h-5 text-red-600" />}
                                                        {category === 'monitoring' && <Activity className="w-5 h-5 text-yellow-600" />}
                                                        {category === 'other' && <Zap className="w-5 h-5 text-gray-600" />}
                                                        خدمات {category === 'core' ? 'النواة' :
                                                            category === 'database' ? 'قواعد البيانات' :
                                                                category === 'storage' ? 'التخزين' :
                                                                    category === 'network' ? 'الشبكة' :
                                                                        category === 'security' ? 'الأمان' :
                                                                            category === 'monitoring' ? 'المراقبة' : 'أخرى'}
                                                    </div>
                                                )} />
                                                <CardContent>
                                                    <ServiceStatusCards services={categoryServices as any[]} />
                                                </CardContent>
                                            </Card>
                                        )
                                    ))}
                                </div>

                                {/* Region Status */}
                                <RegionStatus />

                                {/* Incident Timeline */}
                                <IncidentTimeline
                                    incidents={incidents}
                                    onIncidentClick={setShowIncidentDetails}
                                />
                            </motion.div>
                        )}

                        {activeTab === 'performance' && (
                            <motion.div
                                key="performance"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <PerformanceCharts metrics={metrics} services={services} />
                            </motion.div>
                        )}

                        {activeTab === 'alerts' && (
                            <motion.div
                                key="alerts"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <AlertPanel
                                    alerts={alerts}
                                    onAlertAcknowledge={(id) => console.log('Acknowledged:', id)}
                                />
                            </motion.div>
                        )}

                        {activeTab === 'resources' && (
                            <motion.div
                                key="resources"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <ResourceUtilization metrics={metrics} />
                                    <AutoScalingStatus />
                                </div>
                                <BackupStatus />
                            </motion.div>
                        )}

                        {activeTab === 'security' && (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <SecurityMetrics />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Incident Details Modal */}
                    <AnimatePresence>
                        {showIncidentDetails && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                                onClick={() => setShowIncidentDetails(null)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">تفاصيل الحادث</h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowIncidentDetails(null)}
                                        >
                                            ✕
                                        </Button>
                                    </div>

                                    {/* Incident details would go here */}
                                    <div className="space-y-4">
                                        <p className="text-slate-600 dark:text-slate-400">
                                            تفاصيل الحادث: {showIncidentDetails}
                                        </p>
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

export default SystemHealthPage