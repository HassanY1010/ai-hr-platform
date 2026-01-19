import React from 'react'
import { Card, CardContent, CardHeader, Badge } from '@hr/ui'
import { History, CheckCircle2, AlertCircle, Clock, ChevronRight } from 'lucide-react'
import { SystemIncident } from '@hr/types'
import { formatDate } from '@hr/utils'

interface IncidentTimelineProps {
    incidents: SystemIncident[]
    onIncidentClick: (id: string) => void
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ incidents, onIncidentClick }) => {
    return (
        <Card className="bg-white dark:bg-slate-800 shadow-xl border-none">
            <CardHeader title={(
                <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-purple-600" />
                    سجل الحوادث والخدمة
                </div>
            )} />
            <CardContent>
                <div className="relative space-y-8 before:absolute before:right-[15px] before:top-4 before:h-[calc(100%-16px)] before:w-0.5 before:bg-slate-100 dark:before:bg-slate-700">
                    {incidents.length === 0 ? (
                        <p className="text-center text-slate-500 font-medium py-4 pr-10">لا توجد حوادث مسجلة مؤخراً</p>
                    ) : (
                        incidents.map((incident) => (
                            <div
                                key={incident.id}
                                className="relative pr-10 group cursor-pointer"
                                onClick={() => onIncidentClick(incident.id)}
                            >
                                <div className={`absolute right-0 top-1 w-8 h-8 rounded-full flex items-center justify-center z-10 ${incident.status === 'resolved' ? 'bg-green-100 text-green-600' :
                                    incident.status === 'monitoring' ? 'bg-blue-100 text-blue-600' :
                                        'bg-red-100 text-red-600'
                                    }`}>
                                    {incident.status === 'resolved' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                </div>

                                <div className="bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 transition-all hover:border-purple-300 dark:hover:border-purple-900">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                                            {incident.title}
                                        </h4>
                                        <Badge variant={incident.status === 'resolved' ? 'success' : 'warning'}>
                                            {incident.status === 'resolved' ? 'تم الحل' : 'قيد المتابعة'}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            البدء: {formatDate(incident.startTime)}
                                        </span>
                                        {incident.endTime && (
                                            <span className="flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" />
                                                الحل: {formatDate(incident.endTime)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        {incident.updates.slice(0, 2).map((update, i) => (
                                            <div key={i} className="flex gap-2 text-sm">
                                                <span className="text-slate-400 whitespace-nowrap">{formatDate(update.timestamp, 'HH:mm')}</span>
                                                <span className="text-slate-600 dark:text-slate-400 leading-relaxed">• {update.message}</span>
                                            </div>
                                        ))}
                                        {incident.updates.length > 2 && (
                                            <div className="text-xs text-purple-600 font-bold flex items-center gap-1 mt-2">
                                                عرض {incident.updates.length - 2} تحديثات أخرى
                                                <ChevronRight className="w-3 h-3 rotate-180" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
