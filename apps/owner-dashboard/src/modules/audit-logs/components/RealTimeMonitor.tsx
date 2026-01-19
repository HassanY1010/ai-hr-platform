import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Shield } from 'lucide-react'
import { useAuditLogsStore } from '../store'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'

export const RealTimeMonitor: React.FC = () => {
    const { logs } = useAuditLogsStore()
    const [recentLogs, setRecentLogs] = useState<any[]>([])

    useEffect(() => {
        // Update recent logs whenever logs change
        setRecentLogs(logs.slice(0, 5))
    }, [logs])

    const operationsPerSecond = React.useMemo(() => {
        if (logs.length < 2) return 0;
        // Calculate abstract "ops/sec" based on timestamps of last few logs if possible, 
        // or just return a static calculation based on last minute count.
        // For now, let's just count logs in the last minute.
        const now = Date.now();
        const lastMinuteLogs = logs.filter(l => now - new Date(l.timestamp).getTime() < 60000);
        return (lastMinuteLogs.length / 60).toFixed(1);
    }, [logs]);


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-900/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-indigo-100">العمليات/دقيقة</p>
                        <p className="text-xl font-bold">{operationsPerSecond}</p>
                    </div>
                </div>
            </div>

            <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between overflow-hidden">
                <div className="flex items-center gap-3 shrink-0">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">مراقبة حية:</p>
                </div>

                <div className="flex-1 px-4 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {recentLogs.length > 0 ? (
                            <motion.div
                                key={recentLogs[0].id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="text-sm text-slate-600 dark:text-slate-400 truncate"
                            >
                                <span className="font-bold ml-1">{recentLogs[0].user}:</span>
                                {recentLogs[0].action} ({formatDistanceToNow(new Date(recentLogs[0].timestamp), { addSuffix: true, locale: ar })})
                            </motion.div>
                        ) : (
                            <div className="text-sm text-slate-400">لا توجد سجلات حديثة</div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex gap-2">
                    <div className="flex -space-x-reverse space-x-1 items-center px-2 py-1 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">Live</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
