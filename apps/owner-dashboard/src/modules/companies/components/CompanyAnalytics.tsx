import React from 'react'
import { Card, CardContent } from '@hr/ui'
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Company } from '../types'
import { TrendingUp } from 'lucide-react'

interface CompanyAnalyticsProps {
    companies: Company[]
}

export const CompanyAnalytics: React.FC<CompanyAnalyticsProps> = ({ companies }) => {
    const industryData = companies.reduce((acc: any[], company) => {
        const existing = acc.find(item => item.name === company.industry)
        if (existing) {
            existing.value += 1
        } else {
            acc.push({ name: company.industry, value: 1 })
        }
        return acc
    }, [])

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

    const revenueData = [
        { name: 'يناير', total: 45000 },
        { name: 'فبراير', total: 52000 },
        { name: 'مارس', total: 48000 },
        { name: 'أبريل', total: 61000 },
        { name: 'مايو', total: 55000 },
        { name: 'يونيو', total: 67000 },
    ]

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white dark:bg-slate-800 shadow-xl border-none">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">توزيع الشركات حسب الصناعة</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={industryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {industryData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800 shadow-xl border-none">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">نمو الإيرادات الشهري</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="total" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-white dark:bg-slate-800 shadow-xl border-none">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">أعلى الشركات نمواً</h3>
                        <div className="space-y-4">
                            {companies.slice(0, 4).map((company, i) => (
                                <div key={company.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center font-bold">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{company.name}</p>
                                            <p className="text-xs text-slate-500">{company.industry}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-500">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="font-bold">+{15 + i * 5}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-indigo-600 shadow-xl border-none text-white">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-6">ملخص الأداء</h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-indigo-100 text-sm">متوسط قيمة العقد</p>
                                <p className="text-3xl font-bold mt-1">4,250 SR</p>
                            </div>
                            <div className="h-px bg-indigo-500/50" />
                            <div>
                                <p className="text-indigo-100 text-sm">معدل البقاء (Churn)</p>
                                <p className="text-3xl font-bold mt-1">2.4%</p>
                            </div>
                            <div className="h-px bg-indigo-500/50" />
                            <div>
                                <p className="text-indigo-100 text-sm">نسبة النمو السنوي</p>
                                <p className="text-3xl font-bold mt-1">32%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
