import React from 'react'
import { Card, CardContent, CardHeader, Badge } from '@hr/ui'
import { DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react'
import { motion } from 'framer-motion'

interface FinancialAnalyticsProps {
    data: any
    period: string
}

export const FinancialAnalytics: React.FC<FinancialAnalyticsProps> = ({ period }) => {
    // Data will be used when connected to real API
    console.log('FinancialAnalytics loaded for period:', period)
    // Mock financial data
    const revenueData = [
        { month: 'يناير', revenue: 185000, expenses: 105000 },
        { month: 'فبراير', revenue: 192000, expenses: 108000 },
        { month: 'مارس', revenue: 198000, expenses: 110000 },
        { month: 'أبريل', revenue: 205000, expenses: 112000 },
        { month: 'مايو', revenue: 215000, expenses: 115000 },
        { month: 'يونيو', revenue: 228000, expenses: 117000 }
    ]

    const expenses = [
        { category: 'الرواتب', amount: 95000, percentage: 45, color: 'from-blue-500 to-indigo-500' },
        { category: 'البنية التحتية', amount: 35000, percentage: 17, color: 'from-green-500 to-emerald-500' },
        { category: 'التسويق', amount: 28000, percentage: 13, color: 'from-purple-500 to-pink-500' },
        { category: 'التطوير', amount: 32000, percentage: 15, color: 'from-orange-500 to-red-500' },
        { category: 'أخرى', amount: 21000, percentage: 10, color: 'from-yellow-500 to-amber-500' }
    ]

    const totalRevenue = 1223000
    const totalExpenses = 667000
    const netProfit = totalRevenue - totalExpenses
    const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1)

    return (
        <Card className="bg-white dark:bg-slate-800 shadow-xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <DollarSign className="w-6 h-6 text-green-600" />
                        التحليلات المالية - {period === 'month' ? 'هذا الشهر' : period === 'quarter' ? 'هذا الربع' : 'هذه السنة'}
                    </div>
                    <Badge variant="success">+23.5% نمو</Badge>
                </div>
            </CardHeader>
            <CardContent>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">إجمالي الإيرادات</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">SAR {totalRevenue.toLocaleString()}</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="w-5 h-5 text-red-600" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">إجمالي المصروفات</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">SAR {totalExpenses.toLocaleString()}</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-blue-600" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">صافي الربح</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">SAR {netProfit.toLocaleString()}</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2 mb-2">
                            <PieChart className="w-5 h-5 text-purple-600" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">هامش الربح</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{profitMargin}%</p>
                    </div>
                </div>

                {/* Revenue vs Expenses Chart */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">الإيرادات مقابل المصروفات</h3>
                    <div className="h-64 flex items-end justify-around gap-2">
                        {revenueData.map((item, index) => {
                            const maxValue = 250000
                            const revenueHeight = (item.revenue / maxValue) * 100
                            const expenseHeight = (item.expenses / maxValue) * 100

                            return (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex gap-1 items-end h-48">
                                        <motion.div
                                            className="flex-1 bg-gradient-to-t from-green-500 to-emerald-500 rounded-t-lg relative group"
                                            initial={{ height: 0 }}
                                            animate={{ height: `${revenueHeight}%` }}
                                            transition={{ delay: index * 0.1, duration: 0.5 }}
                                        >
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                SAR {item.revenue.toLocaleString()}
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            className="flex-1 bg-gradient-to-t from-red-500 to-rose-500 rounded-t-lg relative group"
                                            initial={{ height: 0 }}
                                            animate={{ height: `${expenseHeight}%` }}
                                            transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                                        >
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                SAR {item.expenses.toLocaleString()}
                                            </div>
                                        </motion.div>
                                    </div>
                                    <span className="text-xs text-slate-500">{item.month}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded"></div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">الإيرادات</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-rose-500 rounded"></div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">المصروفات</span>
                        </div>
                    </div>
                </div>

                {/* Expense Breakdown */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">تفصيل المصروفات</h3>
                    <div className="space-y-3">
                        {expenses.map((expense, index) => (
                            <motion.div
                                key={expense.category}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{expense.category}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">SAR {expense.amount.toLocaleString()}</span>
                                        <span className="text-xs text-slate-500">({expense.percentage}%)</span>
                                    </div>
                                </div>
                                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full bg-gradient-to-r ${expense.color}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${expense.percentage}%` }}
                                        transition={{ duration: 1, delay: index * 0.2 }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
