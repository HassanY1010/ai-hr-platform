import React from 'react'
import { Card, CardContent, CardHeader } from '@hr/ui'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Activity, Clock, Zap } from 'lucide-react'

interface PerformanceChartsProps {
    metrics: any
    services: any[]
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = () => {
    const performanceData = [
        { time: '10:00', response: 120, load: 45, error: 0 },
        { time: '10:05', response: 145, load: 52, error: 0.1 },
        { time: '10:10', response: 132, load: 48, error: 0 },
        { time: '10:15', response: 190, load: 65, error: 0.5 },
        { time: '10:20', response: 156, load: 55, error: 0.2 },
        { time: '10:25', response: 140, load: 50, error: 0 },
    ]

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white dark:bg-slate-800 shadow-xl border-none">
                    <CardHeader title={(
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-600" />
                            وقت الاستجابة (Response Time)
                        </div>
                    )} />
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} unit="ms" />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="response"
                                        stroke="#6366f1"
                                        fillOpacity={1}
                                        fill="url(#colorResponse)"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800 shadow-xl border-none">
                    <CardHeader title={(
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-600" />
                            حمل النظام (System Load)
                        </div>
                    )} />
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} unit="%" />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="load"
                                        stroke="#f59e0b"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#f59e0b' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white dark:bg-slate-800 shadow-xl border-none">
                <CardHeader title={(
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-600" />
                        معدل الأخطاء (Error Rate)
                    </div>
                )} />
                <CardContent>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData}>
                                <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} unit="%" />
                                <Tooltip />
                                <Bar dataKey="error" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
