import React from 'react'
import { Card, CardContent } from '@hr/ui'
import { Activity, AlertCircle, Shield, Users } from 'lucide-react'
import { AuditLogSummary } from '@hr/types'

interface ActivitySummaryProps {
    summary: AuditLogSummary
}

export const ActivitySummary: React.FC<ActivitySummaryProps> = ({ summary }) => {
    const cards = [
        {
            label: 'إجمالي العمليات',
            value: summary.totalActions,
            icon: Activity,
            color: 'indigo',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
            text: 'text-indigo-600 dark:text-indigo-400'
        },
        {
            label: 'سجلات التحذير',
            value: summary.warningLogs,
            icon: AlertCircle,
            color: 'amber',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            text: 'text-amber-600 dark:text-amber-400'
        },
        {
            label: 'أحداث أمنية',
            value: summary.securityEvents,
            icon: Shield,
            color: 'red',
            bg: 'bg-red-50 dark:bg-red-900/20',
            text: 'text-red-600 dark:text-red-400'
        },
        {
            label: 'المستخدمين النشطين',
            value: summary.activeUsers || 0,
            icon: Users,
            color: 'green',
            bg: 'bg-green-50 dark:bg-green-900/20',
            text: 'text-green-600 dark:text-green-400'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => {
                const Icon = card.icon
                return (
                    <Card key={index} className="bg-white dark:bg-slate-800 shadow-xl border-none">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                        {card.value.toLocaleString()}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-xl ${card.bg}`}>
                                    <Icon className={`w-6 h-6 ${card.text}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
