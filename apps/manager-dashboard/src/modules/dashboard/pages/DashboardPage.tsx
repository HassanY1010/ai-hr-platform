// apps/manager-dashboard/src/modules/dashboard/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { analyticsService } from '@hr/services';
import type { DashboardStats } from '@hr/types';
import {
  Users,
  TrendingUp,
  AlertCircle,
  UserPlus,
  CheckCircle2,
  XCircle,
  Clock,
  GraduationCap,
  PlayCircle,
  Brain,
  Zap,
  ChevronLeft
} from 'lucide-react';

const KPICard = ({ icon: Icon, label, value, subValue, trend, variant = 'default' }: any) => {
  const variants: any = {
    default: 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800',
    warning: 'bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30',
    danger: 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-600',
    success: 'bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`p-5 rounded-3xl border shadow-sm transition-all ${variants[variant]}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${variant === 'default' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : ''}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold dark:text-white">{value}</h3>
          {subValue && <span className="text-xs text-gray-400">{subValue}</span>}
        </div>
      </div>
    </motion.div>
  );
};

const SectionHeader = ({ title, icon: Icon }: any) => (
  <div className="flex items-center gap-2 mb-4 px-2">
    <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
      <Icon className="w-4 h-4" />
    </div>
    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">{title}</h2>
  </div>
);

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, insightsData] = await Promise.all([
          analyticsService.getDashboardStats(),
          analyticsService.get30x3Insights('monthly')
        ]);
        setStats(statsData);
        setAiInsights(insightsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">جاري تحميل البيانات...</div>;
  }

  // Fallback if stats fail to load
  const hr = stats?.hr || { totalEmployees: 0, satisfaction: 0, stressHigh: 0, attritionRisk: 0 };
  const recruitment = stats?.recruitment || { activeJobs: 0, applicants: 0, accepted: 0, rejected: 0, interviews: 0 };
  const training = stats?.training || { needsTraining: 0, inProgress: 0, completionRate: 0, impact: 0 };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            نظرة تنفيذية استراتيجية
          </h1>
          <p className="text-gray-500 mt-1">نظرة واحدة = فهم كامل لمسار الشركة</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-sm font-medium dark:text-gray-300">
            {new Date().toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
          </div>
          <button className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
            <Zap className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>

      {/* Section 1: Human Resources */}
      <section>
        <SectionHeader title="الموارد البشرية" icon={Users} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard icon={Users} label="إجمالي الموظفين" value={hr.totalEmployees} trend="+3" />
          <KPICard icon={TrendingUp} label="مستوى الرضا العام" value={`${hr.satisfaction}%`} trend="+5%" variant="success" />
          <KPICard icon={AlertCircle} label="مؤشرات ضغط مرتفعة" value={hr.stressHigh} subValue="موظف" variant="warning" />
          <KPICard icon={Zap} label="مخاطر تسرب محتملة" value={hr.attritionRisk} subValue="حالات" variant="danger" />
        </div>
      </section>

      {/* Section 2: AI Recruitment */}
      <section>
        <SectionHeader title="التوظيف الذكي" icon={UserPlus} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard icon={UserPlus} label="المتقدمين هذا الشهر" value={recruitment.applicants} />
          <KPICard icon={CheckCircle2} label="المقبولين" value={recruitment.accepted} variant="success" />
          <KPICard icon={XCircle} label="المستبعدين" value={recruitment.rejected} />
          <KPICard icon={Clock} label="مقابلات جارية" value={recruitment.interviews} variant="warning" />
        </div>
      </section>

      {/* Section 3: Training Intelligence */}
      <section>
        <SectionHeader title="إدارة التدريب" icon={GraduationCap} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard icon={AlertCircle} label="بحاجة لتدريب" value={training.needsTraining} subValue="عنصر" variant="warning" />
          <KPICard icon={PlayCircle} label="قيد التدريب" value={training.inProgress} />
          <KPICard icon={CheckCircle2} label="معدل الإكمال" value={`${training.completionRate}%`} variant="success" />
          <KPICard icon={TrendingUp} label="أثر التدريب" value={`+${training.impact}%`} subValue="تطور أداء" variant="success" />
        </div>
      </section>


      {/* AI Intervention Alerts */}
      <section className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full -ml-32 -mb-32 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <Brain className="w-10 h-10 text-indigo-200" />
            <div>
              <h2 className="text-2xl font-bold italic">توصيات الذكاء الاصطناعي</h2>
              <p className="text-indigo-200 text-sm">متى وكيف تتدخل؟ (بناءً على تحليل 30x3)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiInsights?.alerts && aiInsights.alerts.length > 0 ? (
              aiInsights.alerts.slice(0, 2).map((alert: { type: string, message: string }, index: number) => (
                <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl group cursor-pointer hover:bg-white/15 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${alert.type === 'risk' ? 'bg-red-500' : 'bg-green-500'}`}>
                      {alert.type === 'risk' ? 'حرج' : 'فرصة'}
                    </span>
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{(alert.message || '').split('.')[0]}..</h3>
                  <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                    {alert.message}
                  </p>
                  <button className="text-white text-sm font-semibold underline underline-offset-4">عرض التفاصيل</button>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-indigo-200 py-8">
                لا توجد تنبيهات عاجلة حالياً. الأداء مستقر.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;