import React from 'react'
import { Card, CardContent, CardHeader } from '@hr/ui'
import { Eye, CheckCircle2 } from 'lucide-react'
import { useSystemHealthStore } from '../store'
import { formatTime } from '@hr/utils'

export const SecurityMetrics: React.FC = () => {
    // @ts-ignore
    const { security } = useSystemHealthStore()

    if (!security) return null;

    const securityStats = [
        { label: 'التهديدات المحظورة', status: security.threats === 0 ? 'Safe' : 'Warning', value: `${security.threats} تهديد`, color: security.threats === 0 ? 'text-emerald-500' : 'text-red-500' },
        { label: 'مؤشر الأمان', status: security.score > 90 ? 'Excellent' : 'Good', value: `${security.score}%`, color: security.score > 90 ? 'text-emerald-500' : 'text-yellow-500' },
        { label: 'تشفير البيانات', status: 'Enabled', value: 'AES-256', color: 'text-blue-500' },
        { label: 'آخر فحص', status: 'Completed', value: formatTime(security.lastScan), color: 'text-emerald-500' },
    ]

    return (
        <div className="space-y-6 text-right">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-right">
                {securityStats.map((stat, i) => (
                    <Card key={i} className="bg-white dark:bg-slate-800 shadow-xl border-none">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2 text-right">
                                <span className="text-xs text-slate-500">{stat.label}</span>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">{stat.status}</div>
                            <div className={`text-xs font-medium ${stat.color}`}>{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-white dark:bg-slate-800 shadow-xl border-none lg:col-span-3">
                    <CardHeader title={(
                        <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-blue-500" />
                            سجل الوصول للنظام (آخر النشاطات)
                        </div>
                    )} />
                    <CardContent>
                        <div className="space-y-4">
                            {security.recentLogs && security.recentLogs.length > 0 ? (
                                security.recentLogs.map((log: any, i: number) => (
                                    <div key={i} className="space-y-1 pb-3 border-b border-slate-50 dark:border-slate-700 last:border-0">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold text-slate-700 dark:text-slate-200">{log.user}</span>
                                            <span className="text-slate-400">{formatTime(log.time)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[10px]">
                                            <span className={log.action.includes('FAIL') ? 'text-red-500 font-bold' : 'text-emerald-600'}>
                                                {log.action}
                                            </span>
                                            <span className="text-slate-400 font-mono">{log.ip}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-slate-400 py-4">لا توجد سجلات حديثة</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
