import React from 'react'
import { Card, CardContent, CardHeader, Button, Badge } from '@hr/ui'
import { AlertTriangle, Shield, Clock, CheckCircle2 } from 'lucide-react'
import { SystemAlert } from '@hr/types'
import { formatDate } from '@hr/utils'

interface AlertPanelProps {
    alerts: SystemAlert[]
    onAlertAcknowledge: (id: string) => void
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onAlertAcknowledge }) => {
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500'
            case 'high': return 'bg-orange-500'
            case 'medium': return 'bg-yellow-500'
            default: return 'bg-blue-500'
        }
    }

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'critical': return <Badge variant="danger">حرجة</Badge>
            case 'high': return <Badge variant="warning">مرتفعة</Badge>
            case 'medium': return <Badge variant="warning">متوسطة</Badge>
            default: return <Badge variant="info">منخفضة</Badge>
        }
    }

    return (
        <Card className="bg-white dark:bg-slate-800 shadow-xl border-none">
            <CardHeader title={(
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        التنبيهات الحالية
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">{alerts.length} تنبيهات</Badge>
                        <Button variant="outline" size="sm">تجاه ل الكل</Button>
                    </div>
                </div>
            )} />
            <CardContent>
                <div className="space-y-4">
                    {alerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                            <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
                            <p>لا توجد تنبيهات نشطة حالياً</p>
                        </div>
                    ) : (
                        alerts.map((alert) => (
                            <div
                                key={alert.id}
                                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 gap-4"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-2 self-stretch rounded-full ${getSeverityColor(alert.severity)}`} />
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-900 dark:text-white">{alert.title}</h4>
                                            {getSeverityBadge(alert.severity)}
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{alert.description}</p>
                                        <div className="flex items-center gap-3 text-xs text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDate(alert.timestamp)}
                                            </span>
                                            {alert.serviceId && (
                                                <span className="flex items-center gap-1">
                                                    <Shield className="w-3 h-3" />
                                                    معرف الخدمة: {alert.serviceId}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {!alert.acknowledged && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onAlertAcknowledge(alert.id)}
                                    >
                                        تأكيد الاستلام
                                    </Button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
