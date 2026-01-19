// apps/owner-dashboard/src/modules/system-management/pages/FeatureFlagsPage.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Badge } from '@hr/ui'

import { ToggleLeft, ToggleRight, RotateCcw, AlertTriangle } from 'lucide-react'
import { adminService } from '@hr/services'
import { toast } from 'sonner'

const FeatureFlagsPage: React.FC = () => {
    const [flags, setFlags] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedFlag, setSelectedFlag] = useState<any>(null)
    const [assessment, setAssessment] = useState<any>(null)
    const [assessing, setAssessing] = useState(false)

    const fetchFlags = async () => {
        try {
            const response = await adminService.getFeatureFlags()
            setFlags(response.data)
        } catch (error) {
            toast.error('فشل في تحميل ميزات النظام')
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchFlags()
    }, [])

    const handleToggle = async (id: string) => {
        const flag = flags.find(f => f.id === id)
        if (!flag) return

        try {
            await adminService.toggleFeature(id, !flag.enabled)
            setFlags(flags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
            toast.success(`تم ${!flag.enabled ? 'تفعيل' : 'تعطيل'} الميزة بنجاح`)
        } catch (error) {
            toast.error('فشل في تحديث حالة الميزة')
        }
    }

    const handleAssess = async (flag: any) => {
        setSelectedFlag(flag)
        setAssessing(true)
        setAssessment(null)
        try {
            const response = await adminService.assessFeatureImpact(flag.id)
            setAssessment(response.data)
        } catch (error) {
            toast.error('فشل في تقييم أثر الميزة')
        } finally {
            setAssessing(false)
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-neutral-500">جاري التحميل...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900">التحكم في الميزات (Feature Flags)</h2>
                    <p className="text-neutral-600">إدارة توفر الميزات والتحكم في النشر التدريجي</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {flags.map((flag, index) => (
                        <motion.div
                            key={flag.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className={`border-r-4 transition-all cursor-pointer ${selectedFlag?.id === flag.id ? 'ring-2 ring-primary-500' : ''} ${flag.enabled ? 'border-r-emerald-500 shadow-emerald-50' : 'border-r-slate-300 shadow-sm'}`} onClick={() => handleAssess(flag)}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-bold text-neutral-900">{flag.name}</h3>
                                                <Badge variant={flag.risk === 'HIGH' ? 'danger' : flag.risk === 'MEDIUM' ? 'warning' : 'primary'}>
                                                    مخاطرة: {flag.risk === 'HIGH' ? 'عالية' : flag.risk === 'MEDIUM' ? 'متوسطة' : 'منخفضة'}
                                                </Badge>
                                            </div>
                                            <p className="text-neutral-600 text-sm max-w-2xl">{flag.description}</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-left ml-4">
                                                <p className="text-xs text-neutral-400 mb-1 font-mono uppercase">{flag.id}</p>
                                                <Badge variant={flag.enabled ? 'success' : 'outline'}>
                                                    {flag.enabled ? 'نشط' : 'معطل'}
                                                </Badge>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleToggle(flag.id); }}
                                                className={`p-2 rounded-xl transition-all ${flag.enabled ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                            >
                                                {flag.enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-6">
                    <Card className="bg-neutral-900 text-white min-h-[300px]">
                        <CardContent className="p-6">
                            <h4 className="font-bold mb-6 flex items-center gap-2">
                                <RotateCcw className={`w-5 h-5 text-secondary-400 ${assessing ? 'animate-spin' : ''}`} />
                                تقييم الأثر (AI Impact Assessment)
                            </h4>

                            {!selectedFlag ? (
                                <div className="text-center py-12 text-neutral-500">
                                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>اختر ميزة لعرض تحليل الأثر المعتمد على الذكاء الاصطناعي</p>
                                </div>
                            ) : assessing ? (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                                    <div className="h-4 bg-white/10 rounded w-1/2"></div>
                                    <div className="h-32 bg-white/5 rounded"></div>
                                </div>
                            ) : assessment && (
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-sm text-neutral-400 mb-2">الملخص:</p>
                                        <p className="text-sm leading-relaxed text-neutral-100 bg-white/5 p-3 rounded-lg border border-white/10 italic">
                                            "{assessment.summary}"
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">مشاكل محتملة:</p>
                                        <div className="space-y-1">
                                            {assessment.potentialIssues.map((issue: string, i: number) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                                                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                                                    {issue}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">توصيات:</p>
                                        <div className="space-y-1">
                                            {assessment.recommendations.map((rec: string, i: number) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                                                    <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                                                    {rec}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-amber-50 border border-amber-200">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-amber-900 text-sm">تنبيه الحوكمة</h4>
                                    <p className="text-amber-800 text-xs leading-relaxed">
                                        أي تغيير يؤثر فوراً على جميع الشركات. يتم تسجيل العمليات في سجلات التدقيق بدقة.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default FeatureFlagsPage

