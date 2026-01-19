import React from 'react'
import { Card, CardContent } from '@hr/ui'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { AuditLog, AuditLogSummary } from '@hr/types'

interface LogAnalyticsProps {
    logs: AuditLog[]
    summary: AuditLogSummary
}

export const LogAnalytics: React.FC<LogAnalyticsProps> = ({ logs, summary }) => {
    const chartData = [
        { name: 'نجاح', value: (summary.totalActions || 0) - (summary.warningLogs || 0) },
        { name: 'تحذير', value: summary.warningLogs || 0 },
        { name: 'أمني', value: summary.securityEvents || 0 }
    ]

    const COLORS = ['#10b981', '#f59e0b', '#ef4444']

    // Calculate daily activity for last 7 days
    const dailyActivity = React.useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (6 - i))
            return {
                dayName: days[date.getDay()],
                dateStr: date.toISOString().split('T')[0],
                count: 0
            }
        })

        logs.forEach(log => {
            const logDate = new Date(log.timestamp).toISOString().split('T')[0]
            const day = last7Days.find(d => d.dateStr === logDate)
            if (day) day.count++
        })

        return last7Days
    }, [logs])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-slate-800 shadow-xl">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-6">توزيع أنواع الإجراءات</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 shadow-xl">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-6">النشاط اليومي (آخر 7 أيام)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyActivity}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="dayName" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

