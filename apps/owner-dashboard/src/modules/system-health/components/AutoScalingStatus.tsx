import React from 'react'
import { Card, CardContent, CardHeader, Badge } from '@hr/ui'
import { Server, Zap } from 'lucide-react'

export const AutoScalingStatus: React.FC = () => {
    const config = {
        groupName: 'asg-main-app-cluster',
        min: 2,
        max: 10,
        current: 4,
        desired: 4,
        policy: 'CPU Target (65%)'
    }

    const nodes = [
        { id: 'i-0a2b3c', type: 't3.large', status: 'running', launchTime: '2h ago' },
        { id: 'i-4d5e6f', type: 't3.large', status: 'running', launchTime: '2h ago' },
        { id: 'i-7g8h9i', type: 't3.large', status: 'running', launchTime: '45m ago' },
        { id: 'i-0j1k2l', type: 't3.large', status: 'running', launchTime: '12m ago' },
    ]

    return (
        <Card className="bg-white dark:bg-slate-800 shadow-xl border-none">
            <CardHeader title={(
                <div className="flex items-center gap-2 text-right">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    حالة التوسيع التلقائي (Auto Scaling)
                </div>
            )} />
            <CardContent>
                <div className="space-y-6 text-right">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                        <div>
                            <div className="text-xs text-slate-500 mb-1">عدد النسخ الحالية</div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white flex items-baseline gap-2">
                                {config.current}
                                <span className="text-sm font-normal text-slate-400">/ {config.max}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <Badge variant="info">سياسة: {config.policy}</Badge>
                            <div className="text-[10px] text-slate-400 mt-2">آخر تحديث قبل دقيقة</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                            <div className="text-[10px] text-slate-400 mb-1">الحد الأدنى</div>
                            <div className="text-lg font-bold">{config.min}</div>
                        </div>
                        <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                            <div className="text-[10px] text-slate-400 mb-1">الحد الأقصى</div>
                            <div className="text-lg font-bold">{config.max}</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            الخوادم النشطة (Nodes)
                        </h5>
                        <div className="grid grid-cols-1 gap-2">
                            {nodes.map((node) => (
                                <div key={node.id} className="flex items-center justify-between p-2 text-xs bg-slate-50/50 dark:bg-slate-900/30 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Server className="w-3 h-3 text-slate-400" />
                                        <span className="font-mono text-slate-600 dark:text-slate-400">{node.id}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-400">{node.type}</span>
                                        <span className="text-slate-400">{node.launchTime}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
