// apps/owner-dashboard/src/modules/ai-usage/pages/AIUsagePage.tsx
import React, { useState, useEffect } from 'react'
import { Card, CardContent, Badge, Button } from '@hr/ui'
import { Brain, Cpu, DollarSign, Filter } from 'lucide-react'
import { adminService, type AIUsageLog } from '@hr/services'
import { formatCurrency, formatDate } from '@hr/utils'
import { ExportMenu } from '../../../shared/components/ExportMenu'
import { exportUtils } from '../../../shared/utils/exportUtils';

const AIUsagePage: React.FC = () => {
    const [usage, setUsage] = useState<AIUsageLog[]>([])
    const [summary, setSummary] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // ... inside AIUsagePage

    const handleExport = (format: string) => {
        if (!usage || usage.length === 0) return

        const dataToExport = usage.map(log => ({
            'الشركة': log.companyName,
            'النموذج': log.model,
            'الرموز (Tokens)': log.tokens,
            'التكلفة': log.cost.toFixed(4) + '$',
            'التاريخ': new Date(log.timestamp).toLocaleDateString('ar-SA') + ' ' + new Date(log.timestamp).toLocaleTimeString('ar-SA')
        }))

        const fileName = `ai-usage-report-${new Date().toISOString().split('T')[0]}`

        if (format.toLowerCase() === 'csv') {
            exportUtils.exportCSV(dataToExport, fileName)
        } else if (format.toLowerCase() === 'excel') {
            exportUtils.exportExcel(dataToExport, fileName)
        } else if (format.toLowerCase() === 'pdf') {
            const columns = Object.keys(dataToExport[0])
            exportUtils.exportPDF(dataToExport, columns, fileName, 'تقرير استهلاك الذكاء الاصطناعي')
        }
    }

    useEffect(() => {
        const fetchUsage = async () => {
            try {
                const response: any = await adminService.getAIUsage()
                const data = response.data || response
                setUsage(Array.isArray(data) ? data : [])
                if (response.summary) {
                    setSummary(response.summary)
                }
            } catch (error) {
                console.error('Failed to fetch AI usage', error)
                setUsage([])
            } finally {
                setLoading(false)
            }
        }
        fetchUsage()
    }, [])

    const totalTokens = summary?.totalTokens || (usage || []).reduce((acc, curr) => acc + (curr?.tokens || 0), 0)
    const totalCost = summary?.totalCost || (usage || []).reduce((acc, curr) => acc + (curr?.cost || 0), 0)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900">مراقبة استهلاك الذكاء الاصطناعي</h2>
                    <p className="text-neutral-600">التكاليف، الرموز، والأداء التشغيلي عبر جميع الشركات</p>
                </div>
                <div className="flex gap-2">
                    <ExportMenu onExport={handleExport} />
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-primary-600 to-indigo-700 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Brain className="w-8 h-8 opacity-80" />
                            {summary?.tokenTrend !== undefined && (
                                <Badge variant={summary.tokenTrend >= 0 ? "success" : "danger"}>
                                    {summary.tokenTrend >= 0 ? "+" : ""}{summary.tokenTrend.toFixed(1)}%
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm opacity-80 mb-1">إجمالي الرموز (Tokens)</p>
                        <h3 className="text-3xl font-bold">{totalTokens.toLocaleString()}</h3>
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            {summary?.costTrend !== undefined && (
                                <Badge variant={summary.costTrend >= 0 ? "danger" : "success"}>
                                    {summary.costTrend >= 0 ? "+" : ""}{summary.costTrend.toFixed(1)}%
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-neutral-500 mb-1">إجمالي التكاليف للشهر</p>
                        <h3 className="text-3xl font-bold text-neutral-900">{formatCurrency(totalCost)}</h3>
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Cpu className="w-6 h-6" />
                            </div>
                            <span className="text-sm text-neutral-500">متوسط الأداء</span>
                        </div>
                        <p className="text-sm text-neutral-500 mb-1">زمن الاستجابة (Latency)</p>
                        <h3 className="text-3xl font-bold text-neutral-900">{summary?.avgLatency || 145}ms</h3>
                    </CardContent>
                </Card>
            </div>

            {/* Usage Table */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg">تفاصيل الاستهلاك حسب الشركة</h3>
                        <Button variant="ghost" size="sm">
                            <Filter className="w-4 h-4 ml-2" />
                            تصفية
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead>
                                <tr className="border-b border-neutral-100 text-neutral-500 text-sm">
                                    <th className="pb-4 font-medium">الشركة</th>
                                    <th className="pb-4 font-medium">النموذج</th>
                                    <th className="pb-4 font-medium text-center">الرموز</th>
                                    <th className="pb-4 font-medium text-center">التكلفة</th>
                                    <th className="pb-4 font-medium">التوقيت</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-neutral-400">جاري التحميل...</td>
                                    </tr>
                                ) : usage.map((log) => (
                                    <tr key={log.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="py-4 font-bold text-neutral-900">{log.companyName}</td>
                                        <td className="py-4">
                                            <Badge variant="outline">{log.model}</Badge>
                                        </td>
                                        <td className="py-4 text-center font-mono">{log.tokens.toLocaleString()}</td>
                                        <td className="py-4 text-center font-bold text-emerald-600">{formatCurrency(log.cost)}</td>
                                        <td className="py-4 text-neutral-500 text-sm">{formatDate(log.timestamp)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AIUsagePage
