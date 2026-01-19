import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, Badge, Button } from '@hr/ui'
import { Calendar, TrendingUp, Brain, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react'
import { useRoadmapStore } from '../store'
import { useTheme } from '../../../shared/hooks/useTheme'
import { RefreshButton } from '../../../shared/components/RefreshButton'
import { ExportMenu } from '../../../shared/components/ExportMenu'
import { exportUtils } from '../../../shared/utils/exportUtils';
import type { RoadmapItem, Milestone } from '../types'

const RoadmapPage: React.FC = () => {
    const {
        roadmapItems,
        milestones,
        aiAnalysis,
        isAnalyzing,
        refreshData,
        analyzeRoadmap
    } = useRoadmapStore()
    const { theme } = useTheme()
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [filter, setFilter] = useState<'all' | 'planned' | 'in-progress' | 'completed'>('all')

    useEffect(() => {
        refreshData()
    }, [refreshData])

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await refreshData()
        setIsRefreshing(false)
    }

    // ... inside RoadmapPage

    const handleExport = (format: string) => {
        if (!roadmapItems || roadmapItems.length === 0) return

        const dataToExport = roadmapItems.map(item => ({
            'العنوان': item.title,
            'الحالة': item.status,
            'الأولوية': item.priority,
            'التقدم': item.progress + '%',
            'تاريخ البدء': new Date(item.startDate).toLocaleDateString('ar-SA'),
            'تاريخ الانتهاء': new Date(item.endDate).toLocaleDateString('ar-SA'),
            'الفئة': item.category,
            'المسؤول': item.assignedTo || '-'
        }))

        const fileName = `roadmap-report-${new Date().toISOString().split('T')[0]}`

        if (format.toLowerCase() === 'csv') {
            exportUtils.exportCSV(dataToExport, fileName)
        } else if (format.toLowerCase() === 'excel') {
            exportUtils.exportExcel(dataToExport, fileName)
        } else if (format.toLowerCase() === 'pdf') {
            const columns = Object.keys(dataToExport[0])
            exportUtils.exportPDF(dataToExport, columns, fileName, 'تقرير خارطة الطريق')
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'success'
            case 'in-progress': return 'primary'
            case 'planned': return 'info'
            case 'on-hold': return 'warning'
            default: return 'default'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
            case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
            case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            default: return 'bg-slate-100 text-slate-700'
        }
    }

    const filteredItems = filter === 'all' ? roadmapItems : roadmapItems.filter(item => item.status === filter)

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                خارطة الطريق
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
                                خطة تطوير المنتج والميزات القادمة
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <RefreshButton onClick={handleRefresh} isLoading={isRefreshing} />
                            <ExportMenu onExport={handleExport} />
                            <div className="flex gap-2">
                                {['all', 'planned', 'in-progress', 'completed'].map((status) => (
                                    <Button
                                        key={status}
                                        variant={filter === status ? 'primary' : 'outline'}
                                        onClick={() => setFilter(status as any)}
                                        className="text-sm"
                                    >
                                        {status === 'all' ? 'الكل' : status === 'planned' ? 'مخطط' : status === 'in-progress' ? 'قيد التنفيذ' : 'مكتمل'}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                onClick={analyzeRoadmap}
                                disabled={isAnalyzing || roadmapItems.length === 0}
                                variant="outline"
                                className="flex items-center gap-2 border-indigo-200 hover:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20"
                            >
                                <Brain className={`w-4 h-4 text-indigo-600 ${isAnalyzing ? 'animate-pulse' : ''}`} />
                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold">
                                    {isAnalyzing ? 'جاري التحليل...' : 'تحليل الذكاء الاصطناعي'}
                                </span>
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* AI Insights Panel */}
                {aiAnalysis && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8"
                    >
                        <Card className="border-indigo-200 dark:border-indigo-800 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/20 backdrop-blur-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <Brain className="w-32 h-32" />
                            </div>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                                        <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">رؤى استراتيجية ذكية</h2>
                                        <p className="text-sm text-slate-500">تحليل خارطة الطريق والجدول الزمني</p>
                                    </div>
                                    <Badge variant="outline" className="mr-auto border-indigo-200 text-indigo-600">
                                        Feasibility: {aiAnalysis.feasibilityScore}%
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Insights */}
                                    <div className="space-y-3">
                                        <h3 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                                            <Lightbulb className="w-4 h-4 text-amber-500" />
                                            الرؤى الرئيسية
                                        </h3>
                                        <div className="space-y-2">
                                            {aiAnalysis.insights.map((insight: string, i: number) => (
                                                <div key={i} className="text-sm p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-indigo-100/50 dark:border-indigo-900/50">
                                                    {insight}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Risks */}
                                    <div className="space-y-3">
                                        <h3 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                                            <AlertTriangle className="w-4 h-4 text-red-500" />
                                            المخاطر المحتملة
                                        </h3>
                                        <div className="space-y-2">
                                            {aiAnalysis.risks.map((risk: string, i: number) => (
                                                <div key={i} className="text-sm p-3 bg-red-50/50 dark:bg-red-900/10 rounded-lg border border-red-100/50 dark:border-red-900/30 text-red-700 dark:text-red-400">
                                                    {risk}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recommendations */}
                                    <div className="space-y-3">
                                        <h3 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            التوصيات
                                        </h3>
                                        <div className="space-y-2">
                                            {aiAnalysis.recommendations.map((rec: string, i: number) => (
                                                <div key={i} className="text-sm p-3 bg-green-50/50 dark:bg-green-900/10 rounded-lg border border-green-100/50 dark:border-green-900/30 text-green-700 dark:text-green-400">
                                                    {rec}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Milestones */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">المعالم الرئيسية</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {milestones.map((milestone: Milestone, index: number) => (
                            <motion.div
                                key={milestone.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="bg-white dark:bg-slate-800 shadow-xl">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-slate-900 dark:text-white">{milestone.name}</h3>
                                            <Badge variant={milestone.status === 'completed' ? 'success' : milestone.status === 'current' ? 'primary' : 'info'}>
                                                {milestone.status === 'completed' ? 'مكتمل' : milestone.status === 'current' ? 'حالي' : 'قادم'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{milestone.description}</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500">التقدم</span>
                                                <span className="font-semibold text-slate-900 dark:text-white">{milestone.progress}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${milestone.progress}%` }}
                                                    transition={{ duration: 1, delay: index * 0.2 }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(milestone.targetDate).toLocaleDateString('ar-SA')}
                                                </div>
                                                <div>{milestone.features} ميزة</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Roadmap Items */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">المشاريع والمبادرات</h2>
                    <div className="space-y-4">
                        {filteredItems.length === 0 ? (
                            <div className="text-center py-20 bg-white/50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-slate-500">لا توجد مبادرات حالياً في هذا التصنيف</p>
                                <Button onClick={handleRefresh} variant="outline" className="mt-4">
                                    تحديث البيانات
                                </Button>
                            </div>
                        ) : filteredItems.map((item: RoadmapItem, index: number) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                                                    <Badge variant={getStatusColor(item.status) as any}>
                                                        {item.status === 'completed' ? 'مكتمل' : item.status === 'in-progress' ? 'قيد التنفيذ' : item.status === 'planned' ? 'مخطط' : 'متوقف'}
                                                    </Badge>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                                        {item.priority === 'critical' ? 'حرج' : item.priority === 'high' ? 'عالي' : item.priority === 'medium' ? 'متوسط' : 'منخفض'}
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-400 mb-3">{item.description}</p>
                                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(item.startDate).toLocaleDateString('ar-SA')} - {new Date(item.endDate).toLocaleDateString('ar-SA')}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <TrendingUp className="w-4 h-4" />
                                                        {item.category}
                                                    </div>
                                                    {item.assignedTo && (
                                                        <div>المسؤول: {item.assignedTo}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="text-slate-500">التقدم</span>
                                                <span className="font-semibold text-slate-900 dark:text-white">{item.progress}%</span>
                                            </div>
                                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full ${item.status === 'completed' ? 'bg-green-500' :
                                                        item.status === 'in-progress' ? 'bg-indigo-500' :
                                                            'bg-slate-400'
                                                        }`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.progress}%` }}
                                                    transition={{ duration: 1, delay: index * 0.2 }}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    )
}

export default RoadmapPage
