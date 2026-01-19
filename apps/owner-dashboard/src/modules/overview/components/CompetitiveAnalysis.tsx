import React from 'react'
import { Card, CardContent, CardHeader, Badge } from '@hr/ui'
import { Trophy, Target, Award, TrendingUp, Users, Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface CompetitiveAnalysisProps {
    data: any
    marketPosition: any
}

export const CompetitiveAnalysis: React.FC<CompetitiveAnalysisProps> = () => {
    // Data and marketPosition will be used when connected to real API
    console.log('CompetitiveAnalysis loaded')
    const competitors = [
        { name: 'منافس A', marketShare: 28, growth: 15, rating: 4.2, color: 'from-red-500 to-rose-500' },
        { name: 'منصتنا', marketShare: 18, growth: 23, rating: 4.6, color: 'from-indigo-500 to-purple-500' },
        { name: 'منافس B', marketShare: 22, growth: 12, rating: 4.0, color: 'from-blue-500 to-cyan-500' },
        { name: 'منافس C', marketShare: 15, growth: 8, rating: 3.8, color: 'from-green-500 to-emerald-500' },
        { name: 'آخرون', marketShare: 17, growth: 5, rating: 3.5, color: 'from-slate-500 to-gray-500' }
    ]

    const strengths = [
        { title: 'الذكاء الاصطناعي المتقدم', score: 95, description: 'تقنية AI رائدة في السوق' },
        { title: 'تجربة المستخدم', score: 92, description: 'واجهة سهلة وبديهية' },
        { title: 'الدعم الفني', score: 88, description: 'استجابة سريعة وفعالة' },
        { title: 'التكامل', score: 85, description: 'تكامل مع أنظمة متعددة' }
    ]

    const opportunities = [
        { title: 'قطاع الشركات الصغيرة', potential: 'عالي', icon: Target },
        { title: 'التوسع الإقليمي', potential: 'متوسط', icon: TrendingUp },
        { title: 'ميزات جديدة', potential: 'عالي', icon: Star }
    ]

    return (
        <Card className="bg-white dark:bg-slate-800 shadow-xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <Trophy className="w-6 h-6 text-purple-600" />
                        التحليل التنافسي
                    </div>
                    <Badge variant="success">المركز #2</Badge>
                </div>
            </CardHeader>
            <CardContent>
                {/* Market Share Comparison */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">حصة السوق</h3>
                    <div className="space-y-4">
                        {competitors.map((competitor, index) => (
                            <motion.div
                                key={competitor.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {competitor.name === 'منصتنا' && <Trophy className="w-4 h-4 text-purple-600" />}
                                        <span className={`font-medium ${competitor.name === 'منصتنا' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {competitor.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">{competitor.marketShare}%</span>
                                        <div className="flex items-center gap-1 text-xs text-green-600">
                                            <TrendingUp className="w-3 h-3" />
                                            +{competitor.growth}%
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            <span className="text-xs text-slate-600">{competitor.rating}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full bg-gradient-to-r ${competitor.color}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${competitor.marketShare}%` }}
                                        transition={{ duration: 1, delay: index * 0.2 }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Competitive Strengths */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">نقاط القوة التنافسية</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {strengths.map((strength, index) => (
                            <motion.div
                                key={strength.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-slate-900 dark:text-white">{strength.title}</span>
                                    <Badge variant={strength.score >= 90 ? 'success' : 'primary'}>{strength.score}%</Badge>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{strength.description}</p>
                                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${strength.score}%` }}
                                        transition={{ duration: 1, delay: index * 0.2 }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Growth Opportunities */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">فرص النمو</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {opportunities.map((opportunity, index) => {
                            const Icon = opportunity.icon
                            return (
                                <motion.div
                                    key={opportunity.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon className="w-5 h-5 text-green-600" />
                                        <span className="font-medium text-slate-900 dark:text-white">{opportunity.title}</span>
                                    </div>
                                    <Badge variant={opportunity.potential === 'عالي' ? 'success' : 'warning'}>
                                        إمكانية {opportunity.potential}
                                    </Badge>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* Market Position Summary */}
                <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-start gap-4">
                        <Award className="w-8 h-8 text-indigo-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">الموقع الاستراتيجي</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                نحتل المركز الثاني في السوق بحصة 18% ونمو سنوي 23%. تقنية الذكاء الاصطناعي المتقدمة وتجربة المستخدم المتميزة تمنحنا ميزة تنافسية قوية.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-indigo-600" />
                                    <span className="text-xs text-slate-600 dark:text-slate-400">12,458 مستخدم نشط</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs text-slate-600 dark:text-slate-400">تقييم 4.6/5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
