import React from 'react'
import { motion } from 'framer-motion'
import { AuditLog } from '@hr/types'
import { formatDate } from '@hr/utils'

interface LogTimelineProps {
    logs: AuditLog[]
    getActionIcon: (action: string) => React.ReactNode
    getSeverityColor: (severity: string) => string
}

export const LogTimeline: React.FC<LogTimelineProps> = ({ logs, getActionIcon, getSeverityColor }) => {
    return (
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent dark:before:via-slate-700">
            {logs.map((log, index) => (
                <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                >
                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors group-hover:bg-indigo-500 group-hover:text-white">
                        {getActionIcon(log.action.toLowerCase())}
                    </div>

                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-all group-hover:shadow-md">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                            <div className="font-bold text-slate-900 dark:text-white">{log.user}</div>
                            <time className="font-mono text-xs text-indigo-500">{formatDate(log.timestamp)}</time>
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 text-sm mb-2">{log.action}</div>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getSeverityColor(log.severity || 'low')}`}>
                                {log.severity || 'low'}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">{log.ip}</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
