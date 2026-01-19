// apps/admin-dashboard/src/modules/system-health/components/HardwareMetrics.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Badge } from '@hr/ui'
import { Cpu, HardDrive, Activity, MemoryStick, Network, Zap, Clock } from 'lucide-react'


interface HardwareMetricsProps {
    metrics: any
    detailed?: boolean
}

export const HardwareMetrics: React.FC<HardwareMetricsProps> = ({ metrics, detailed }) => {
    // Convert object metrics to array if needed
    const metricsArray = Array.isArray(metrics) ? metrics : [
        metrics.cpu,
        metrics.memory,
        metrics.storage,
        metrics.network
    ].filter(Boolean)

    const getIcon = (name: string) => {
        const n = name.toLowerCase()
        if (n.includes('cpu')) return <Cpu className="w-6 h-6 text-indigo-600" />
        if (n.includes('ram') || n.includes('memory')) return <MemoryStick className="w-6 h-6 text-purple-600" />
        if (n.includes('disk') || n.includes('storage')) return <HardDrive className="w-6 h-6 text-blue-600" />
        if (n.includes('network')) return <Network className="w-6 h-6 text-orange-600" />
        return <Activity className="w-6 h-6 text-slate-600" />
    }

    const getColor = (value: number) => {
        if (value > 85) return 'bg-red-500'
        if (value > 65) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricsArray.map((metric, index) => (
                <motion.div
                    key={metric.id || index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className="bg-white dark:bg-slate-800 shadow-xl border-none overflow-hidden group hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 group-hover:scale-110 transition-transform duration-300">
                                    {getIcon(metric.name)}
                                </div>
                                <Badge variant={metric.status === 'healthy' ? 'success' : 'warning'}>
                                    {metric.status === 'healthy' ? 'مستقر' : 'تنبيه'}
                                </Badge>
                            </div>

                            <div className="space-y-1 text-right">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.name}</p>
                                <div className="flex items-baseline justify-end gap-2">
                                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{metric.value}{metric.unit}</h3>
                                    <span className={`text-xs font-bold ${metric.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                                        {metric.trend === 'up' ? '↑' : '↓'}
                                    </span>
                                </div>
                            </div>

                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-6 overflow-hidden">
                                <motion.div
                                    className={`h-full ${getColor(metric.value)}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${metric.value}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>

                            {detailed && (
                                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400">
                                    <span className="flex items-center gap-1 font-bold">
                                        <Clock className="w-3 h-3" />
                                        قبل 2 ثانية
                                    </span>
                                    <span className="flex items-center gap-1 font-bold uppercase">
                                        <Zap className="w-3 h-3 text-yellow-500" />
                                        Real-time
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}
