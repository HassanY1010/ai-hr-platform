// apps/owner-dashboard/src/modules/system-management/pages/SecurityPage.tsx
import React, { useState } from 'react'
import { Card, CardContent, Button, Badge } from '@hr/ui'
import { ShieldAlert, Zap, Lock, Unlock, AlertOctagon, RefreshCw } from 'lucide-react'
import { adminService } from '@hr/services'
import { toast } from 'sonner'

const SecurityPage: React.FC = () => {
    const [killSwitchActive, setKillSwitchActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [stats, setStats] = useState({
        suspiciousLogins: 0,
        criticalAlerts: 0,
        firewallStatus: 'نشط'
    })
    const [aiRisk, setAiRisk] = useState<any>(null)

    const fetchSecurityData = async () => {
        try {
            const response = await adminService.getSecurityStats()
            if (response.data) {
                setStats({
                    suspiciousLogins: response.data.suspiciousLogins,
                    criticalAlerts: response.data.criticalAlerts,
                    firewallStatus: response.data.firewallStatus === 'active' ? 'نشط' : 'متوقف'
                })
                setKillSwitchActive(response.data.killSwitchActive)
            }

            // Get AI Risk Analysis (simulated based on real counts)
            const logs = await adminService.getAuditLogs()
            const riskAnalysis = await adminService.analyzeSecurityRisk(logs.data.slice(0, 20))
            setAiRisk(riskAnalysis.data)
        } catch (error) {
            console.error('Failed to fetch security data', error)
        }
    }

    React.useEffect(() => {
        fetchSecurityData()
        const interval = setInterval(fetchSecurityData, 30000)
        return () => clearInterval(interval)
    }, [])

    const handleKillSwitch = async () => {
        const confirmed = window.confirm(
            killSwitchActive
                ? 'هل أنت متأكد من رغبتك في إعادة تشغيل المنصة؟'
                : '⚠️ تحذير حرج: أنت على وشك إيقاف المنصة بالكامل عن العمل. لن يتمكن أي مستخدم من تسجيل الدخول أو استخدام الخدمات. هل أنت متأكد؟'
        )

        if (!confirmed) return

        setLoading(true)
        try {
            await adminService.triggerKillSwitch(!killSwitchActive)
            setKillSwitchActive(!killSwitchActive)
            toast.info(killSwitchActive ? 'تم استعادة عمل المنصة' : 'تم تفعيل وضع الطوارئ وإيقاف النظام')
            fetchSecurityData()
        } catch (error) {
            toast.error('فشل في تنفيذ العملية')
        } finally {
            setLoading(false)
        }
    }

    const handleClearCache = async () => {
        try {
            await adminService.clearCache()
            toast.success('تم تصفير الذاكرة المؤقتة بنجاح')
        } catch (error) {
            toast.error('فشل في تصفير الذاكرة المؤقتة')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900">الأمان وحالات الطوارئ</h2>
                    <p className="text-neutral-600">أدوات التحكم القصوى لحماية المنصة</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Kill Switch Section */}
                <Card className={`border-2 transition-all ${killSwitchActive ? 'border-red-600 bg-red-50' : 'border-neutral-200 shadow-sm'}`}>
                    <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`p-4 rounded-2xl ${killSwitchActive ? 'bg-red-600 text-white animate-pulse' : 'bg-red-100 text-red-600'}`}>
                                <ShieldAlert className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-neutral-900">مفتاح الإيقاف الطارئ (Kill Switch)</h3>
                                <p className="text-neutral-500">إيقاف فوري لجميع عمليات المنصة</p>
                            </div>
                        </div>

                        <div className="p-4 bg-white/50 rounded-xl mb-8 border border-red-100">
                            <p className="text-red-800 text-sm leading-relaxed">
                                عند تفعيل هذا المفتاح، سيتم حظر جميع طلبات الـ API الواردة للنظام باستثناء لوحة تحكم المالك. يستخدم هذا الخيار فقط في حالات الاختراق الأمني الخطيرة.
                            </p>
                        </div>

                        <Button
                            variant={killSwitchActive ? "primary" : "danger"}
                            size="lg"
                            className="w-full h-16 text-lg font-bold shadow-xl hover:scale-[1.02] transition-transform"
                            onClick={handleKillSwitch}
                            disabled={loading}
                        >
                            {loading ? <RefreshCw className="w-6 h-6 animate-spin mr-2" /> : (killSwitchActive ? <Unlock className="w-6 h-6 mr-2" /> : <Lock className="w-6 h-6 mr-2" />)}
                            {killSwitchActive ? 'إلغاء وضع الطوارئ (Restore Access)' : 'تفعيل الإيقاف الشامل (Kill Switch)'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Additional Security Utils */}
                <div className="space-y-6">
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <h4 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary-600" />
                                صيانة سريعة
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-neutral-900">تصفير الذاكرة المؤقتة (Clear Cache)</span>
                                        <span className="text-xs text-neutral-500">مسح البيانات الموقتة لـ Redis</span>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleClearCache}>تنفيذ</Button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100 opacity-60">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-neutral-900">إعادة تهيئة جلسات المستخدمين</span>
                                        <span className="text-xs text-neutral-500">تسجيل خروج إجباري للجميع</span>
                                    </div>
                                    <Button variant="outline" size="sm" disabled>قريباً</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-neutral-900 text-white overflow-hidden relative">
                        {aiRisk?.riskLevel === 'CRITICAL' && (
                            <div className="absolute top-0 right-0 p-2 bg-red-600 text-xs font-bold animate-bounce">
                                خطر مرتفع!
                            </div>
                        )}
                        <CardContent className="p-6 relative z-10">
                            <h4 className="font-bold mb-4 flex items-center gap-2">
                                <AlertOctagon className={`w-5 h-5 ${aiRisk?.riskScore > 20 ? 'text-red-400' : 'text-secondary-400'}`} />
                                مراقبة الأمان الحالية (AI Audit)
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm py-1 border-b border-white/10">
                                    <span className="text-neutral-400">محاولات تسجيل دخول فشلت:</span>
                                    <span className={`font-bold ${stats.suspiciousLogins > 5 ? 'text-red-400' : 'text-white'}`}>{stats.suspiciousLogins}</span>
                                </div>
                                <div className="flex justify-between text-sm py-1 border-b border-white/10">
                                    <span className="text-neutral-400">تنبيهات حرجة:</span>
                                    <span className={`font-bold ${stats.criticalAlerts > 0 ? 'text-red-400' : 'text-white'}`}>{stats.criticalAlerts}</span>
                                </div>
                                <div className="flex justify-between text-sm py-1 border-b border-white/10">
                                    <span className="text-neutral-400">حالة جدار الحماية:</span>
                                    <Badge variant="success" className="bg-emerald-500/20 text-emerald-400 border-0">{stats.firewallStatus}</Badge>
                                </div>

                                {aiRisk && (
                                    <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                                        <p className="text-xs text-neutral-300 italic">
                                            " {aiRisk.analysis} "
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}


export default SecurityPage
