import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Badge, AIExplanation, LoadingCard } from '@hr/ui'
import { useProductMetricsStore } from '../store'
import { useTheme } from '../../../shared/hooks/useTheme'
import { RefreshButton } from '../../../shared/components/RefreshButton'
import { ExportMenu } from '../../../shared/components/ExportMenu'
import {
    UsageChart,
    FeatureAdoptionTable,
    UserEngagementMetrics,
    PerformanceIndicators
} from '../components'

const ProductMetricsPage: React.FC = () => {
    const { metrics, featureAdoption, userEngagement, performanceMetrics, usageData, aiAnalysis, isLoading, refreshData } = useProductMetricsStore()
    const { theme } = useTheme()
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        refreshData()
    }, [])

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await refreshData()
        setIsRefreshing(false)
    }

    const handleExport = (format: string) => {
        const formatLower = format.toLowerCase();
        const dateStr = new Date().toISOString().split('T')[0];

        if (formatLower === 'csv') {
            let csvContent = "data:text/csv;charset=utf-8,";

            // KPIs Section
            csvContent += "المؤشر,القيمة,التغيير\n";
            metrics.forEach((m: any) => {
                csvContent += `${m.name},${m.value},${m.change}\n`;
            });

            csvContent += "\n";

            // Feature Adoption Section
            csvContent += "الميزة,معدل الاعتماد,المستخدمون النشطون,إجمالي المستخدمين\n";
            featureAdoption.forEach((f: any) => {
                csvContent += `${f.featureName},${f.adoptionRate}%,${f.activeUsers},${f.totalUsers}\n`;
            });

            // User Engagement Section
            csvContent += "\n";
            csvContent += "المقياس,القيمة,التغيير,الوصف\n";
            userEngagement.forEach((e: any) => {
                csvContent += `${e.metric},${e.value},${e.change},${e.description}\n`;
            });
            csvContent += "\n";

            // Performance Metrics Section
            csvContent += "المؤشر الفني,القيمة,الوحدة,المستهدف,الحالة\n";
            performanceMetrics.forEach((p: any) => {
                csvContent += `${p.name},${p.value},${p.unit},${p.target},${p.status}\n`;
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `product_metrics_${dateStr}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        else if (formatLower === 'excel') {
            let tableHTML = '<table border="1"><thead><tr><th colspan="3" style="background-color: #4F46E5; color: white;">مؤشرات الأداء الرئيسية</th></tr><tr><th>المؤشر</th><th>القيمة</th><th>التغيير</th></tr></thead><tbody>';

            metrics.forEach((m: any) => {
                tableHTML += `<tr><td>${m.name}</td><td>${m.value}</td><td>${m.change}</td></tr>`;
            });

            tableHTML += '</tbody></table><br/><table border="1"><thead><tr><th colspan="4" style="background-color: #4F46E5; color: white;">اعتماد الميزات</th></tr><tr><th>الميزة</th><th>معدل الاعتماد</th><th>المستخدمون النشطون</th><th>إجمالي المستخدمين</th></tr></thead><tbody>';

            featureAdoption.forEach((f: any) => {
                tableHTML += `<tr><td>${f.featureName}</td><td>${f.adoptionRate}%</td><td>${f.activeUsers}</td><td>${f.totalUsers}</td></tr>`;
            });
            tableHTML += '</tbody></table><br/><table border="1"><thead><tr><th colspan="4" style="background-color: #4F46E5; color: white;">تفاعل المستخدمين</th></tr><tr><th>المقياس</th><th>القيمة</th><th>التغيير</th><th>الوصف</th></tr></thead><tbody>';

            userEngagement.forEach((e: any) => {
                tableHTML += `<tr><td>${e.metric}</td><td>${e.value}</td><td>${e.change}</td><td>${e.description}</td></tr>`;
            });
            tableHTML += '</tbody></table><br/><table border="1"><thead><tr><th colspan="5" style="background-color: #4F46E5; color: white;">مؤشرات الأداء الفني</th></tr><tr><th>المؤشر الفني</th><th>القيمة</th><th>الوحدة</th><th>المستهدف</th><th>الحالة</th></tr></thead><tbody>';

            performanceMetrics.forEach((p: any) => {
                tableHTML += `<tr><td>${p.name}</td><td>${p.value}</td><td>${p.unit}</td><td>${p.target}</td><td>${p.status}</td></tr>`;
            });
            tableHTML += '</tbody></table>';

            const excelContent = `data:application/vnd.ms-excel;charset=utf-8,${encodeURIComponent(tableHTML)}`;
            const link = document.createElement("a");
            link.setAttribute("href", excelContent);
            link.setAttribute("download", `product_metrics_${dateStr}.xls`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        else if (formatLower === 'pdf') {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                let reportHTML = `
                    <!DOCTYPE html>
                    <html dir="rtl">
                    <head>
                        <meta charset="UTF-8">
                        <title>تقرير مؤشرات المنتج</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 40px; direction: rtl; color: #334155; }
                            h1 { color: #4F46E5; text-align: center; margin-bottom: 30px; }
                            .header-info { text-align: center; margin-bottom: 40px; color: #64748b; }
                            section { margin-bottom: 40px; }
                            h2 { color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: right; }
                            th { background-color: #f8fafc; color: #475569; font-weight: 600; }
                            .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
                            .kpi-card { border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; text-align: center; }
                            .kpi-value { font-size: 24px; font-weight: bold; color: #4F46E5; }
                            .kpi-label { font-size: 14px; color: #64748b; }
                        </style>
                    </head>
                    <body>
                        <h1>تقرير أداء ومؤشرات المنتج</h1>
                        <div class="header-info">
                            <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</p>
                        </div>

                        <section>
                            <h2>المؤشرات الرئيسية</h2>
                            <div class="kpi-grid">
                                ${metrics.map((m: any) => `
                                    <div class="kpi-card">
                                        <div class="kpi-value">${m.value}</div>
                                        <div class="kpi-label">${m.name}</div>
                                        <div style="color: ${m.trend === 'up' ? '#10b981' : '#ef4444'}; font-size: 12px;">${m.change}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </section>

                        <section>
                            <h2>تفاعل المستخدمين</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>المقياس</th>
                                        <th>القيمة</th>
                                        <th>التغيير</th>
                                        <th>الوصف</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${userEngagement.map((e: any) => `
                                        <tr>
                                            <td>${e.metric}</td>
                                            <td>${e.value}</td>
                                            <td>${e.change}</td>
                                            <td>${e.description}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </section>

                        <section>
                            <h2>اعتماد الميزات</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>الميزة</th>
                                        <th>معدل الاعتماد</th>
                                        <th>المستخدمون النشطون</th>
                                        <th>إجمالي المستخدمين</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${featureAdoption.map((f: any) => `
                                        <tr>
                                            <td>${f.featureName}</td>
                                            <td>${f.adoptionRate}%</td>
                                            <td>${f.activeUsers}</td>
                                            <td>${f.totalUsers}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </section>

                        <section>
                            <h2>مؤشرات الأداء الفني</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>المؤشر الفني</th>
                                        <th>القيمة</th>
                                        <th>المستهدف</th>
                                        <th>الحالة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${performanceMetrics.map((p: any) => `
                                        <tr>
                                            <td>${p.name}</td>
                                            <td>${p.value} ${p.unit}</td>
                                            <td>${p.target} ${p.unit}</td>
                                            <td>${p.status}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </section>

                        <script>
                            window.onload = () => {
                                window.print();
                                // window.close();
                            };
                        </script>
                    </body>
                    </html>
                `;
                printWindow.document.write(reportHTML);
                printWindow.document.close();
            }
        }
    }

    if (isLoading) {
        return <LoadingCard title="جاري تحميل تقارير المنتج..." />
    }

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
                                مؤشرات المنتج
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
                                تحليل شامل لأداء المنتج واستخدامه
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <RefreshButton onClick={handleRefresh} isLoading={isRefreshing} />
                            <ExportMenu onExport={handleExport} />
                        </div>
                    </div>
                </motion.div>

                {/* KPI Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {metrics.map((metric: any, index: number) => {
                        const Icon = metric.icon
                        return (
                            <motion.div
                                key={metric.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center">
                                                <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <Badge variant={metric.trend === 'up' ? 'success' : 'danger'}>
                                                {metric.change}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                                                {metric.value}
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {metric.name}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* Usage Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <UsageChart data={usageData} />
                </motion.div>

                {/* User Engagement */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <UserEngagementMetrics metrics={userEngagement} />
                </motion.div>

                {/* Feature Adoption Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                >
                    <FeatureAdoptionTable features={featureAdoption} />
                </motion.div>

                {/* AI Insights */}
                {aiAnalysis && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="mb-8"
                    >
                        <AIExplanation
                            score={88}
                            confidence={0.94}
                            decision="توصيات تحسين أداء المنتج"
                            reasons={aiAnalysis.insights || []}
                            insights={aiAnalysis.recommendations || []}
                            type="opportunity"
                            showDetails={true}
                        />
                    </motion.div>
                )}

                {/* Performance Indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <PerformanceIndicators metrics={performanceMetrics} />
                </motion.div>

            </div>
        </div>
    )
}

export default ProductMetricsPage
