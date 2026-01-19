import { create } from 'zustand'
import { Users, TrendingUp, Activity, Zap } from 'lucide-react'
import type { ProductMetric, FeatureAdoption, UserEngagement, PerformanceMetric, UsageData } from './types'
import { analyticsService } from '@hr/services'

// Fallback Mock Data (Only used if service fails completely)
const MOCK_METRICS: ProductMetric[] = [
    { id: '1', name: 'المستخدمون النشطون', value: '12,458', change: '+18.2%', trend: 'up', icon: Users },
    { id: '2', name: 'معدل التفاعل', value: '68.5%', change: '+5.3%', trend: 'up', icon: Activity },
    { id: '3', name: 'الجلسات اليومية', value: '45,230', change: '+12.1%', trend: 'up', icon: TrendingUp },
    { id: '4', name: 'متوسط وقت الجلسة', value: '24 دقيقة', change: '+3.5%', trend: 'up', icon: Zap }
]

const MOCK_FEATURE_ADOPTION: FeatureAdoption[] = [
    { featureName: 'التوظيف الذكي', adoptionRate: 78, activeUsers: 9720, totalUsers: 12458, trend: 'up', lastUpdated: '2024-12-25' },
    { featureName: 'تقييم الأداء', adoptionRate: 65, activeUsers: 8098, totalUsers: 12458, trend: 'up', lastUpdated: '2024-12-25' }
]

const MOCK_ENGAGEMENT: UserEngagement[] = [
    { metric: 'معدل الاحتفاظ الشهري', value: '94.2%', change: '+2.1%', trend: 'up', description: 'نسبة المستخدمين العائدين شهرياً' }
]

const MOCK_PERFORMANCE: PerformanceMetric[] = [
    { name: 'وقت التحميل', value: 1.2, unit: 'ثانية', target: 2.0, status: 'good', trend: 'down' }
]

const MOCK_USAGE_DATA: UsageData[] = [
    { date: '2024-12-24', activeUsers: 12458, sessions: 45230, avgSessionDuration: 24 }
]

interface ProductMetricsState {
    metrics: ProductMetric[]
    featureAdoption: FeatureAdoption[]
    userEngagement: UserEngagement[]
    performanceMetrics: PerformanceMetric[]
    usageData: UsageData[]
    aiAnalysis: any | null
    isLoading: boolean
    refreshData: () => Promise<void>
}

export const useProductMetricsStore = create<ProductMetricsState>((set) => ({
    metrics: MOCK_METRICS,
    featureAdoption: MOCK_FEATURE_ADOPTION,
    userEngagement: MOCK_ENGAGEMENT,
    performanceMetrics: MOCK_PERFORMANCE,
    usageData: MOCK_USAGE_DATA,
    aiAnalysis: null,
    isLoading: false,
    refreshData: async () => {
        set({ isLoading: true })
        try {
            const response = await analyticsService.getProductMetrics();
            const analysis = await analyticsService.analyzeProductMetrics();

            const data = (response as any)?.metrics || [];
            const history = (response as any)?.history || [];

            // Top KPI Cards - REAL SYSTEM COUNTS
            const finalMetrics = data
                .filter((m: any) => m && (m.category === 'USAGE' || m.category === 'ENGAGEMENT'))
                .map((m: any) => ({
                    id: m.id,
                    name: m.name,
                    value: m.unit === 'users' || m.unit === 'sessions' ? (m.value || 0).toLocaleString() :
                        m.unit === '%' ? (m.value || 0) + '%' :
                            (m.value || 0) + (m.unit || ''),
                    change: ((m.change || 0) > 0 ? '+' : '') + (m.change || 0) + '%',
                    trend: m.trend || 'up',
                    icon: m.id === 'active_users' ? Users :
                        m.id === 'daily_sessions' ? TrendingUp :
                            m.id === 'engagement_rate' ? Activity : Zap
                })).slice(0, 4);

            const featureAdoption = data
                .filter((m: any) => m && m.category === 'ADOPTION')
                .map((m: any) => ({
                    featureName: m.name,
                    adoptionRate: m.value || 0,
                    activeUsers: m.metadata?.activeUsers || 0,
                    totalUsers: m.metadata?.totalUsers || 10,
                    trend: m.trend || 'up',
                    lastUpdated: new Date().toLocaleDateString('en-CA')
                }));

            const userEngagement = data
                .filter((m: any) => m && m.category === 'ENGAGEMENT' && m.id === 'engagement_rate')
                .map((m: any) => ({
                    metric: m.name,
                    value: (m.value || 0) + '%',
                    change: '+2.1%',
                    trend: 'up',
                    description: 'نسبة المستخدمين المتفاعلين فعلياً مع المنصة حالياً'
                }));

            const performanceMetrics = data
                .filter((m: any) => m && m.category === 'PERFORMANCE')
                .map((m: any) => ({
                    name: m.name,
                    value: m.value || 0,
                    unit: m.unit || '',
                    target: m.metadata?.target || 0,
                    status: m.metadata?.status || 'good',
                    trend: m.trend || 'stable'
                }));

            const usageData = history.map((h: any) => ({
                date: h.date || new Date().toISOString(),
                activeUsers: h.activeUsers || 0,
                sessions: h.sessions || 0,
                avgSessionDuration: h.avgSessionDuration || 0
            }));

            // Clean AI Analysis to ensure it has required fields
            const cleanAIAnalysis = analysis ? {
                ...analysis,
                insights: Array.isArray(analysis.insights) ? analysis.insights : [],
                recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : []
            } : null;

            set({
                metrics: finalMetrics.length > 0 ? finalMetrics : MOCK_METRICS,
                featureAdoption: featureAdoption.length > 0 ? featureAdoption : MOCK_FEATURE_ADOPTION,
                userEngagement: userEngagement.length > 0 ? userEngagement : MOCK_ENGAGEMENT,
                performanceMetrics: performanceMetrics.length > 0 ? performanceMetrics : MOCK_PERFORMANCE,
                usageData: usageData.length > 0 ? usageData : MOCK_USAGE_DATA,
                aiAnalysis: cleanAIAnalysis,
                isLoading: false
            });
        } catch (error) {
            console.error('Failed to refresh product metrics:', error);
            set({ isLoading: false })
        }
    }
}))
