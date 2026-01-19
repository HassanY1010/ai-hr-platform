import React from 'react'
import { Card, CardContent, CardHeader } from '@hr/ui'
import { Database, HardDrive, Cpu, TrendingUp } from 'lucide-react'

interface ResourceUtilizationProps {
    metrics: any
}

export const ResourceUtilization: React.FC<ResourceUtilizationProps> = ({ metrics }) => {
    const diskMetrics = [
        { name: 'S3 Storage (Media)', used: 1.2, total: 5, unit: 'TB' },
        { name: 'Database SSD', used: 156, total: 512, unit: 'GB' },
        { name: 'Log Storage', used: 85, total: 200, unit: 'GB' },
    ]

    return (
        <Card className="bg-white dark:bg-slate-800 shadow-xl border-none">
            <CardHeader title={(
                <div className="flex items-center gap-2 text-right">
                    <HardDrive className="w-5 h-5 text-blue-600" />
                    تحليل استهلاك الموارد
                </div>
            )} />
            <CardContent>
                <div className="space-y-6 text-right">
                    {diskMetrics.map((disk, i) => {
                        const percentage = (disk.used / disk.total) * 100
                        return (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{disk.name}</span>
                                    </div>
                                    <span className="text-xs text-slate-500">
                                        {disk.used} / {disk.total} {disk.unit} ({Math.round(percentage)}%)
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${percentage > 85 ? 'bg-red-500' : percentage > 60 ? 'bg-yellow-500' : 'bg-blue-500'
                                            }`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        )
                    })}

                    <div className="grid grid-cols-2 gap-4 mt-4 text-right">
                        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                            <div className="flex items-center gap-2 mb-2">
                                <Database className="w-4 h-4 text-indigo-600" />
                                <span className="text-xs font-medium text-indigo-900 dark:text-indigo-400">اتصالات القاعدة</span>
                            </div>
                            <div className="text-xl font-bold text-indigo-900 dark:text-white">45 / 150</div>
                            <div className="text-[10px] text-indigo-600 mt-1 flex items-center gap-1 font-bold">
                                <TrendingUp className="w-3 h-3" />
                                زيادة 12% عن الساعة الماضية
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                            <div className="flex items-center gap-2 mb-2 text-right">
                                <Cpu className="w-4 h-4 text-emerald-600" />
                                <span className="text-xs font-medium text-emerald-900 dark:text-emerald-400">استهلاك المعالجة</span>
                            </div>
                            <div className="text-xl font-bold text-emerald-900 dark:text-white">{metrics?.cpu?.value || 0}%</div>
                            <div className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1 font-bold">
                                حالة مستقرة
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
