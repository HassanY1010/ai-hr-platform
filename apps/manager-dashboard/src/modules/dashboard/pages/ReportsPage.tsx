// apps/manager-dashboard/src/modules/dashboard/pages/ReportsPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Brain,
    Download,
    RefreshCw,
    Users,
    Briefcase,
    GraduationCap,
    Calendar
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { analyticsService } from '@hr/services';
import { Button, Card, CardContent, Badge } from '@hr/ui';
import { toast } from 'sonner';
import { StrategicPlanModal } from '../components/StrategicPlanModal';
import { AlertsModal } from '../components/AlertsModal';
import { AnimatePresence } from 'framer-motion';

const ReportsPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [funnelData, setFunnelData] = useState<any>(null);
    const [trends, setTrends] = useState<any>(null);
    const [training, setTraining] = useState<any>(null);
    const [aiInsights, setAiInsights] = useState<any>(null);
    const [showStrategicModal, setShowStrategicModal] = useState(false);
    const [showAlertsModal, setShowAlertsModal] = useState(false);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setIsLoading(true);
        try {
            const [statsRes, funnelRes, trendsRes, trainingRes, insightsRes] = await Promise.all([
                analyticsService.getDashboardStats(),
                analyticsService.getRecruitmentFunnel(),
                analyticsService.getEmployeeTrends(),
                analyticsService.getTrainingAnalytics(),
                analyticsService.get30x3Insights()
            ]);

            setStats(statsRes);
            setFunnelData(funnelRes);
            setTrends(trendsRes);
            setTraining(trainingRes);
            setAiInsights(insightsRes);
        } catch (error) {
            console.error('Failed to load reports data:', error);
            toast.error('حدث خطأ أثناء تحميل بيانات التقارير');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        try {
            // Simulate AI generation delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            const newInsights = await analyticsService.get30x3Insights();
            setAiInsights(newInsights);
            toast.success('تم توليد تقرير ذكي جديد بنجاح');
        } catch (error) {
            toast.error('فشل توليد التقرير');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExportPDF = () => {
        window.print();
    };

    const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316'];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">جاري تحليل البيانات وتجهيز التقارير...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 p-4 sm:p-6">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div>
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">التقارير التحليلية الذكية</h1>
                    <p className="text-gray-500 mt-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleExportPDF}
                        leftIcon={<Download className="w-4 h-4" />}
                        className="rounded-2xl border-gray-200 dark:border-gray-700"
                    >
                        تصدير PDF
                    </Button>
                    <Button
                        onClick={handleGenerateReport}
                        disabled={isGenerating}
                        variant="primary"
                        className="rounded-2xl px-8 shadow-lg shadow-indigo-200 dark:shadow-none bg-indigo-600 hover:bg-indigo-700"
                    >
                        {isGenerating ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <Brain className="w-5 h-5 ml-2" />
                        )}
                        <span>{isGenerating ? 'جاري التحليل...' : 'توليد تقرير AI'}</span>
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'إجمالي الموظفين', value: stats?.hr?.totalEmployees || 0, icon: Users, color: 'indigo', trend: '+4%' },
                    { title: 'وظائف شاغرة', value: stats?.recruitment?.activeJobs || 0, icon: Briefcase, color: 'purple', trend: 'ثابت' },
                    { title: 'إنجاز التدريب', value: `${training?.completionRate?.toFixed(0) || 0}%`, icon: GraduationCap, color: 'emerald', trend: '+12%' },
                    { title: 'معدل الرضا', value: `${stats?.hr?.satisfaction || 0}%`, icon: TrendingUp, color: 'rose', trend: '-2%' }
                ].map((kpi, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${kpi.color}-50 dark:bg-${kpi.color}-900/10 rounded-bl-[4rem] group-hover:scale-110 transition-transform`} />
                        <div className="relative z-10 space-y-4">
                            <div className={`w-12 h-12 bg-${kpi.color}-500/10 rounded-2xl flex items-center justify-center text-${kpi.color}-600`}>
                                <kpi.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{kpi.title}</h3>
                                <div className="flex items-end gap-3 mt-1">
                                    <span className="text-3xl font-black dark:text-white">{kpi.value}</span>
                                    <Badge variant={kpi.trend.startsWith('+') ? 'success' : kpi.trend === 'ثابت' ? 'outline' : 'danger'} className="text-[10px] mb-1.5 px-2">
                                        {kpi.trend}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main productivity/engagement trend */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="rounded-[3rem] border-0 shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white">اتجاهات التفاعل والولاء</h2>
                                    <p className="text-gray-500 text-sm">مؤشر الرضا الوظيفي خلال الـ 6 أشهر الماضية</p>
                                </div>
                                <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-xl">
                                    <button className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-gray-700 shadow-sm rounded-lg text-indigo-600 dark:text-indigo-400">شهري</button>
                                    <button className="px-4 py-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">أسبوعي</button>
                                </div>
                            </div>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trends?.engagement || []}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Recruitment Funnel */}
                        <Card className="rounded-[3rem] border-0 shadow-sm bg-white dark:bg-gray-900">
                            <CardContent className="p-8">
                                <h2 className="text-lg font-bold mb-6 dark:text-white">قمع التوظيف (بالمرحلة)</h2>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={funnelData?.byStatus || []}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                            <Bar dataKey="count" fill="#a855f7" radius={[8, 8, 0, 0]} barSize={35} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Training Distribution */}
                        <Card className="rounded-[3rem] border-0 shadow-sm bg-white dark:bg-gray-900">
                            <CardContent className="p-8">
                                <h2 className="text-lg font-bold mb-6 dark:text-white">توزيع أنواع التدريب</h2>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={training?.distribution || [
                                                    { name: 'تقني', value: 40 },
                                                    { name: 'مهارات ناعمة', value: 25 },
                                                    { name: 'قيادة', value: 20 },
                                                    { name: 'امتثال', value: 15 }
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {COLORS.map((color, index) => (
                                                    <Cell key={`cell-${index}`} fill={color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex flex-wrap justify-center gap-4 mt-2">
                                    {['تقني', 'مهارات ناعمة', 'قيادة', 'امتثال'].map((label, i) => (
                                        <div key={i} className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                            <span className="text-[10px] text-gray-500 font-bold">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* AI Insights Sidebar */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <Brain className="w-64 h-64 -translate-x-20 -translate-y-10 rotate-12" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                    <Brain className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">توصيات الـ AI</h3>
                            </div>

                            <div className="space-y-4">
                                {aiInsights?.insights?.map((insight: any, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + (i * 0.1) }}
                                        className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/10"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-bold text-sm text-indigo-100">{insight.title}</p>
                                            <Badge className="bg-white/20 text-[8px] border-0">{insight.confidence}% ثقة</Badge>
                                        </div>
                                        <p className="text-xs text-white/80 leading-relaxed">{insight.description}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={() => setShowStrategicModal(true)}
                                    className="w-full py-3 bg-white text-indigo-600 rounded-2xl font-bold text-sm shadow-lg hover:bg-gray-50 transition-colors"
                                >
                                    عرض الخطة الاستراتيجية
                                </button>
                            </div>
                        </div>
                    </div>

                    <Card className="rounded-[3rem] border-0 shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
                        <CardContent className="p-8">
                            <h3 className="font-bold mb-6 dark:text-white">تنبيهات المخاطر</h3>
                            <div className="space-y-4">
                                {aiInsights?.alerts?.map((alert: any, i: number) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-3xl bg-gray-50 dark:bg-gray-800 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900 transition-colors">
                                        <div className={`w-2 shrink-0 rounded-full ${alert.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold dark:text-gray-200">{alert.title}</h4>
                                            <p className="text-xs text-gray-500 leading-relaxed">{alert.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button
                                onClick={() => setShowAlertsModal(true)}
                                variant="outline"
                                className="w-full mt-6 rounded-2xl text-xs"
                            >
                                إدارة كافة التنبيهات
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AnimatePresence>
                {showStrategicModal && (
                    <StrategicPlanModal onClose={() => setShowStrategicModal(false)} />
                )}
                {showAlertsModal && (
                    <AlertsModal
                        alerts={aiInsights?.alerts || []}
                        onClose={() => setShowAlertsModal(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReportsPage;
