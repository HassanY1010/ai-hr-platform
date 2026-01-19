// apps/owner-dashboard/src/modules/overview/pages/OverviewPage.tsx
import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, Badge } from '@hr/ui'
import {
  TrendingUp, BarChart3, TrendingDown, Activity
} from 'lucide-react'
import { useOverviewStore } from '../store'
import { useTheme } from '../../../shared/hooks/useTheme'
import { ExportMenu } from '../../../shared/components/ExportMenu'
import { RefreshButton } from '../../../shared/components/RefreshButton'
import {
  GrowthAnalytics
} from '../components'

const OverviewPage: React.FC = () => {
  const { kpis, growthMetrics, userEngagement, growthHistory, refreshData } = useOverviewStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'growth'>('overview')
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { theme } = useTheme()
  const [hasFetched, setHasFetched] = useState(false)

  // Fetch initial data
  useEffect(() => {
    refreshData(selectedPeriod)
    setHasFetched(true)
  }, [refreshData, hasFetched, selectedPeriod])



  // Real-time data refresh
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [refreshData])


  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleExport = (format: string) => {
    const formatLower = format.toLowerCase();

    if (formatLower === 'csv') {
      const headers = ['Metric', 'Value', 'Change', 'Target'];
      const rows = kpis.map((kpi: any) => [kpi.label, kpi.value, kpi.change, kpi.target]);
      const growthRows = growthMetrics.map((g: any) => [g.metric, g.value, g.change, '-']);

      const csvContent = "data:text/csv;charset=utf-8,"
        + headers.join(",") + "\n"
        + rows.map((e: any) => e.join(",")).join("\n") + "\n"
        + growthRows.map((e: any) => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `overview_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    else if (formatLower === 'excel') {
      const headers = ['Metric', 'Value', 'Change', 'Target'];
      const rows = kpis.map((kpi: any) => [kpi.label, kpi.value, kpi.change, kpi.target]);
      const growthRows = growthMetrics.map((g: any) => [g.metric, g.value, g.change || '', '-']);

      let tableHTML = '<table border="1"><thead><tr>';
      headers.forEach(h => tableHTML += `<th>${h}</th>`);
      tableHTML += '</tr></thead><tbody>';

      [...rows, ...growthRows].forEach(row => {
        tableHTML += '<tr>';
        row.forEach((cell: any) => tableHTML += `<td>${cell}</td>`);
        tableHTML += '</tr>';
      });
      tableHTML += '</tbody></table>';

      const excelContent = `data:application/vnd.ms-excel;charset=utf-8,${encodeURIComponent(tableHTML)}`;
      const link = document.createElement("a");
      link.setAttribute("href", excelContent);
      link.setAttribute("download", `overview_report_${new Date().toISOString().split('T')[0]}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    else if (formatLower === 'pdf') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const headers = ['Metric', 'Value', 'Change', 'Target'];
        const rows = kpis.map((kpi: any) => [kpi.label, kpi.value, kpi.change, kpi.target]);
        const growthRows = growthMetrics.map((g: any) => [g.metric, g.value, g.change || '', '-']);

        let tableHTML = `<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>تقرير نظرة عامة</title><style>body{font-family:Arial,sans-serif;padding:20px;direction:rtl}h1{color:#4F46E5;text-align:center}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:12px;text-align:right}th{background-color:#4F46E5;color:white}tr:nth-child(even){background-color:#f9f9f9}.date{text-align:center;color:#666;margin-top:10px}</style></head><body><h1>تقرير نظرة عامة</h1><p class="date">${new Date().toLocaleDateString('ar-SA')}</p><table><thead><tr>`;

        headers.forEach(h => tableHTML += `<th>${h}</th>`);
        tableHTML += '</tr></thead><tbody>';

        [...rows, ...growthRows].forEach(row => {
          tableHTML += '<tr>';
          row.forEach((cell: any) => tableHTML += `<td>${cell}</td>`);
          tableHTML += '</tr>';
        });

        tableHTML += '</tbody></table></body></html>';

        printWindow.document.write(tableHTML);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 250);
      }
    }
  }

  // Enhanced KPI calculations
  const enhancedKPIs = useMemo(() => {
    return kpis.map((kpi: any) => ({
      ...kpi,
      progressColor: kpi.progress >= 90 ? 'text-green-600' :
        kpi.progress >= 70 ? 'text-yellow-600' :
          'text-red-600',
      status: kpi.progress >= 90 ? 'excellent' :
        kpi.progress >= 70 ? 'good' :
          kpi.progress >= 50 ? 'warning' : 'critical',
      trendIcon: kpi.change.startsWith('+') ? <TrendingUp className="w-4 h-4" /> :
        kpi.change.startsWith('-') ? <TrendingDown className="w-4 h-4" /> :
          <Activity className="w-4 h-4" />
    }))
  }, [kpis])



  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
    { id: 'growth', label: 'نمو', icon: TrendingUp }
  ]

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            {/* Title Section */}
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                نظرة عامة استراتيجية
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
                مؤشرات الأداء الرئيسية والأهداف الاستراتيجية
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <RefreshButton onClick={handleRefresh} isLoading={isRefreshing} />
              <ExportMenu onExport={handleExport} />

              {/* Time Period Selector */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="month">هذا الشهر</option>
                <option value="quarter">هذا الربع</option>
                <option value="year">هذه السنة</option>
              </select>


            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-1 mt-6 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg w-fit">
            {tabs.map((tab) => {
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
        </motion.div>

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
              {/* Enhanced KPIs Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {enhancedKPIs.map((kpi: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${kpi.status === 'excellent' ? 'from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900' :
                            kpi.status === 'good' ? 'from-yellow-100 to-amber-100 dark:from-yellow-900 dark:to-amber-900' :
                              kpi.status === 'warning' ? 'from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900' :
                                'from-red-100 to-rose-100 dark:from-red-900 dark:to-rose-900'
                            } flex items-center justify-center`}>
                            <kpi.icon className={`h-6 w-6 ${kpi.status === 'excellent' ? 'text-green-600' :
                              kpi.status === 'good' ? 'text-yellow-600' :
                                kpi.status === 'warning' ? 'text-orange-600' :
                                  'text-red-600'
                              }`} />
                          </div>
                          <Badge variant={kpi.status === 'excellent' ? 'success' :
                            kpi.status === 'good' ? 'warning' : 'danger'}>
                            {kpi.progress}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{kpi.value}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{kpi.label}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500 dark:text-slate-500">الهدف: {kpi.target}</span>
                            <div className={`flex items-center gap-1 text-sm font-medium ${kpi.change.startsWith('+') ? 'text-green-600' :
                              kpi.change.startsWith('-') ? 'text-red-600' : 'text-slate-600'
                              }`}>
                              {kpi.trendIcon}
                              {kpi.change}
                            </div>
                          </div>

                          {/* Enhanced Progress Bar */}
                          <div className="mt-3">
                            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full bg-gradient-to-r ${kpi.status === 'excellent' ? 'from-green-500 to-emerald-500' :
                                  kpi.status === 'good' ? 'from-yellow-500 to-amber-500' :
                                    kpi.status === 'warning' ? 'from-orange-500 to-red-500' :
                                      'from-red-500 to-rose-500'
                                  }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${kpi.progress}%` }}
                                transition={{ duration: 1, delay: index * 0.3 }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500 mt-1">
                              <span>0%</span>
                              <span>تقدم: {kpi.progress}%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Growth Metrics */}
              <Card className="bg-white dark:bg-slate-800 shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                    مؤشرات النمو والأداء
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {growthMetrics.map((metric: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                      >
                        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                          {metric.value}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          {metric.metric}
                        </div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${metric.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                          'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          }`}>
                          {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {metric.trend === 'up' ? 'إيجابي' : 'سلبي'}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>





            </motion.div>
          )}

          {/* Additional tabs content would go here */}


          {activeTab === 'growth' && (
            <motion.div
              key="growth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 mt-6"
            >
              <GrowthAnalytics data={userEngagement} metrics={growthMetrics} history={growthHistory} />
            </motion.div>
          )}


        </AnimatePresence>

        {/* Real-time Updates Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-4 right-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-3 border border-slate-200 dark:border-slate-700"
        >

        </motion.div>
      </div>
    </div >
  )
}

export default OverviewPage
