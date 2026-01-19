import React from 'react'
import { Card, CardContent, CardHeader, Badge } from '@hr/ui'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import type { FeatureAdoption } from '../types'

interface FeatureAdoptionTableProps {
    features: FeatureAdoption[]
}

export const FeatureAdoptionTable: React.FC<FeatureAdoptionTableProps> = ({ features }) => {
    return (
        <Card className="bg-white dark:bg-slate-800 shadow-xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">معدلات تبني الميزات</div>
                    <Badge variant="info">{features.length} ميزة</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">الميزة</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">معدل التبني</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">المستخدمون النشطون</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">الاتجاه</th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature: FeatureAdoption, index: number) => (
                                <motion.tr
                                    key={feature.featureName}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    <td className="py-4 px-4">
                                        <div className="font-medium text-slate-900 dark:text-white">{feature.featureName}</div>
                                        <div className="text-xs text-slate-500">آخر تحديث: {feature.lastUpdated}</div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <motion.div
                                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${feature.adoptionRate}%` }}
                                                    transition={{ duration: 1, delay: index * 0.2 }}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white min-w-[3rem]">
                                                {feature.adoptionRate}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="text-sm text-slate-900 dark:text-white font-medium">
                                            {feature.activeUsers.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            من {feature.totalUsers.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${feature.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                                feature.trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                                                    'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                            }`}>
                                            {feature.trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
                                                feature.trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
                                                    <Minus className="w-3 h-3" />}
                                            {feature.trend === 'up' ? 'متزايد' : feature.trend === 'down' ? 'متناقص' : 'ثابت'}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
