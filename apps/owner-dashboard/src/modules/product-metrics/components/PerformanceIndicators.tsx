import React from 'react'
import { Card, CardContent, CardHeader, Badge } from '@hr/ui'
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import type { PerformanceMetric } from '../types'

interface PerformanceIndicatorsProps {
    metrics: PerformanceMetric[]
}

export const PerformanceIndicators: React.FC<PerformanceIndicatorsProps> = ({ metrics }) => {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'good':
                return <CheckCircle className="w-5 h-5 text-green-600" />
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-600" />
            case 'critical':
                return <XCircle className="w-5 h-5 text-red-600" />
            default:
                return null
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'good':
                return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            case 'warning':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
            case 'critical':
                return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            default:
                return 'bg-slate-100 text-slate-700'
        }
    }

    return (
        <Card className="bg-white dark:bg-slate-800 shadow-xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">مؤشرات الأداء</div>
                    <Badge variant="success">جميع الأنظمة تعمل</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {metrics.map((metric: PerformanceMetric, index: number) => (
                        <motion.div
                            key={metric.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(metric.status)}
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white">{metric.name}</h4>
                                        <p className="text-sm text-slate-500">الهدف: {metric.target} {metric.unit}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(metric.status)}`}>
                                    {metric.status === 'good' ? 'ممتاز' : metric.status === 'warning' ? 'تحذير' : 'حرج'}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-slate-600 dark:text-slate-400">القيمة الحالية</span>
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            {metric.value} {metric.unit}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${metric.status === 'good' ? 'bg-green-500' :
                                                    metric.status === 'warning' ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                }`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(metric.value / metric.target) * 100}%` }}
                                            transition={{ duration: 1, delay: index * 0.2 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
