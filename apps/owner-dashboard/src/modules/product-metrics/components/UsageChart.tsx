import React from 'react'
import { Card, CardContent, CardHeader } from '@hr/ui'
import { TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface UsageChartProps {
    data: any[]
}

export const UsageChart: React.FC<UsageChartProps> = ({ data }) => {
    const chartData = data.slice(-7)
    // Dynamic max based on data, with a sane minimum floor of 10 for visibility
    const maxDataVal = Math.max(...chartData.map(d => d.activeUsers || 0))
    const maxVal = Math.max(maxDataVal * 1.2, 10)


    return (
        <Card className="bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                    استخدام المنتج - آخر 7 أيام
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="h-64 flex flex-col justify-end bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-end justify-around h-full gap-2 mb-4">
                        {chartData.map((item: any, index: number) => {
                            const percentage = ((item.activeUsers || 0) / maxVal) * 100
                            return (
                                <div key={index} className="flex-1 flex flex-col items-center group h-full justify-end">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${percentage}%` }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 100,
                                            damping: 15,
                                            delay: index * 0.1
                                        }}
                                        className="w-full max-w-[40px] bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-md relative cursor-pointer hover:brightness-110 shadow-lg"
                                        style={{ minHeight: '4px' }}
                                    >
                                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-10 shadow-xl border border-slate-700">
                                            {(item.activeUsers || 0).toLocaleString()} مستخدم
                                        </div>
                                    </motion.div>
                                    <span className="mt-2 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                        {new Date(item.date).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

