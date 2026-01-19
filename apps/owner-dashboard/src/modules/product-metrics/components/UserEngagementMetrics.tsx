import React from 'react'
import { Card, CardContent, CardHeader } from '@hr/ui'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import type { UserEngagement } from '../types'

interface UserEngagementMetricsProps {
    metrics: UserEngagement[]
}

export const UserEngagementMetrics: React.FC<UserEngagementMetricsProps> = ({ metrics }) => {
    return (
        <Card className="bg-white dark:bg-slate-800 shadow-xl">
            <CardHeader>
                <div className="text-lg font-semibold">مقاييس تفاعل المستخدمين</div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {metrics.map((metric: UserEngagement, index: number) => (
                        <motion.div
                            key={metric.metric}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-600"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        {metric.metric}
                                    </h4>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {metric.value}
                                    </p>
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    {metric.change}
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {metric.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
