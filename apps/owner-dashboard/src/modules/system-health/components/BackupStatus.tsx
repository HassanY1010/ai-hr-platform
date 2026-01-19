import React from 'react'
import { Card, CardContent, CardHeader, Badge } from '@hr/ui'
import { Database, ShieldCheck, Clock, CheckCircle2, RotateCcw, Cloud } from 'lucide-react'
import { useSystemHealthStore } from '../store'

export const BackupStatus: React.FC = () => {
    // @ts-ignore
    const { backups } = useSystemHealthStore()

    return (
        <Card className="bg-white dark:bg-slate-800 shadow-xl border-none">
            <CardHeader title={(
                <div className="flex items-center gap-2 text-right">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    حالة النسخ الاحتياطي والأرشفة
                </div>
            )} />
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
                    {backups && (
                        <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                                    <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <Badge variant={backups.status === 'healthy' ? 'success' : 'warning'}>
                                    {backups.status === 'healthy' ? 'ناجح' : 'فشل'}
                                </Badge>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">قاعدة البيانات والنظام</h4>
                                <div className="text-[10px] text-slate-400">Full Backup • {backups.size}</div>
                            </div>

                            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px]">
                                <div className="flex items-center gap-1 text-slate-500">
                                    <Clock className="w-3 h-3" />
                                    {backups.lastBackup ? new Date(backups.lastBackup).toLocaleTimeString('ar-SA') : 'N/A'}
                                </div>
                                <button className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                                    <RotateCcw className="w-3 h-3" />
                                    استعادة
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Cloud className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-blue-900 dark:text-blue-400">التخزين السحابي البعيد (S3 Off-site)</div>
                            <div className="text-xs text-blue-600 dark:text-blue-500">ميزة الحماية من الكوارث مفعلة ونشطة</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
