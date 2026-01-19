import { create } from 'zustand'
import { Users, Cpu, Target } from 'lucide-react'
import { analyticsService } from '@hr/services'

interface OverviewState {
    kpis: any[]
    growthMetrics: any[]
    userEngagement: any
    isLoading: boolean
    growthHistory: any[]
    refreshData: (period?: string) => Promise<void>
}

export const useOverviewStore = create<OverviewState>((set) => ({
    kpis: [],
    growthMetrics: [],
    userEngagement: [],
    growthHistory: [],
    isLoading: false,

    refreshData: async (period = 'month') => {
        set({ isLoading: true })
        console.log('Fetching data for period:', period)
        try {
            const [
                growthStats,
                growthHistory
            ] = await Promise.all([
                analyticsService.getGrowthStats(),
                analyticsService.getUserGrowthHistory()
            ]);

            const systemStats = await analyticsService.getSystemStats(); // For total companies, ai usage

            const realtimeKPIs = [
                {
                    icon: Users,
                    label: 'الشركات النشطة',
                    value: systemStats.activeCompanies?.toString() || '0',
                    change: '+1', // Need history for this, keep mock or calc
                    target: '50',
                    progress: Math.min(((systemStats.activeCompanies || 0) / 50) * 100, 100)
                },
                {
                    icon: Cpu,
                    label: 'استخدام الذكاء الاصطناعي',
                    value: systemStats.aiUsage?.toLocaleString() || '0',
                    change: '+12%',
                    target: '50K',
                    progress: Math.min(((systemStats.aiUsage || 0) / 50000) * 100, 100)
                },
                {
                    icon: Target,
                    label: 'رضا العملاء',
                    value: '4.8/5', // Still potentially mock if not in DB
                    change: '+0.2',
                    target: '5.0',
                    progress: 96
                }
            ];

            // Map Growth Stats
            const mappedGrowthMetrics = [
                {
                    metric: 'المستخدمين النشطين',
                    value: growthStats.users.total.toString(),
                    trend: 'up',
                    change: `+${growthStats.users.monthlyGrowth} هذا الشهر`
                },
                {
                    metric: 'نمو الإيرادات',
                    value: `${((growthStats.revenue.monthlyGrowth / (growthStats.revenue.total || 1)) * 100).toFixed(1)}%`,
                    trend: 'up'
                },
                {
                    metric: 'إكمال المهام',
                    value: growthStats.efficiency.tasksCompleted.toString(),
                    trend: 'up'
                },
                {
                    metric: 'الاحتفاظ',
                    value: '95%', // Placeholder
                    trend: 'up'
                }
            ];

            set({
                kpis: realtimeKPIs,
                growthMetrics: mappedGrowthMetrics,
                userEngagement: [],
                growthHistory,
                isLoading: false
            })
        } catch (error) {
            console.error(error);
            set({ isLoading: false })
        }
    }
}))
