import React from 'react'
import { Card, CardContent } from '@hr/ui'
import { Company } from '../types'
import { Check, X, Shield, Star, Users, DollarSign } from 'lucide-react'

interface CompanyComparisonProps {
    companies: Company[]
}

export const CompanyComparison: React.FC<CompanyComparisonProps> = ({ companies }) => {
    return (
        <Card className="bg-white dark:bg-slate-800 shadow-xl border-none overflow-hidden">
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="px-6 py-6 font-bold text-slate-900 dark:text-white">الميزة</th>
                                {companies.slice(0, 3).map(company => (
                                    <th key={company.id} className="px-6 py-6 font-bold text-slate-900 dark:text-white text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                                                {company.name.charAt(0)}
                                            </div>
                                            <span>{company.name}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            <tr>
                                <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-500" /> الباقة
                                </td>
                                {companies.slice(0, 3).map(c => (
                                    <td key={c.id} className="px-6 py-4 text-center text-slate-900 dark:text-white font-bold uppercase">
                                        {c.subscription.plan}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-500" /> عدد المقاعد
                                </td>
                                {companies.slice(0, 3).map(c => (
                                    <td key={c.id} className="px-6 py-4 text-center text-slate-900 dark:text-white font-bold">
                                        {c.subscription.usedSeats} / {c.subscription.seats}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-green-500" /> الحماية المتقدمة
                                </td>
                                {companies.slice(0, 3).map(c => (
                                    <td key={c.id} className="px-6 py-4 text-center">
                                        {c.subscription.plan === 'enterprise' ? (
                                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                                        ) : (
                                            <X className="w-5 h-5 text-red-400 mx-auto" />
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-indigo-500" /> العائد الشهري
                                </td>
                                {companies.slice(0, 3).map(c => (
                                    <td key={c.id} className="px-6 py-4 text-center text-slate-900 dark:text-white font-bold">
                                        {c.subscription.monthlyRevenue} SR
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
