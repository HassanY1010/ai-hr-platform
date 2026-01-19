import React from 'react'
import { Card, CardContent, CardHeader, Badge } from '@hr/ui'
import { MapPin, Globe, Wifi } from 'lucide-react'
import { useSystemHealthStore } from '../store'

export const RegionStatus: React.FC = () => {
    // @ts-ignore
    const { regions } = useSystemHealthStore()

    if (!regions || regions.length === 0) return null;

    return (
        <Card className="bg-white dark:bg-slate-800 shadow-xl border-none">
            <CardHeader title={(
                <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" />
                    تغطية المناطق وزمن الاستجابة
                </div>
            )} />
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {regions.map((region: any) => (
                        <div
                            key={region.id}
                            className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <Badge variant={region.status === 'healthy' ? 'success' : 'warning'}>
                                    {region.status === 'healthy' ? 'نشط' : 'بطيء'}
                                </Badge>
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 h-10 line-clamp-2">
                                {region.name}
                            </h4>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 flex items-center gap-1">
                                        <Wifi className="w-3 h-3" />
                                        زمن الاستجابة
                                    </span>
                                    <span className={`font-mono font-bold ${region.latency < 50 ? 'text-green-600' :
                                        region.latency < 100 ? 'text-blue-600' :
                                            'text-yellow-600'
                                        }`}>
                                        {region.latency}ms
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                                        <span>تحمل السيرفر</span>
                                        <span>{region.load}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500"
                                            style={{ width: `${region.load}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
