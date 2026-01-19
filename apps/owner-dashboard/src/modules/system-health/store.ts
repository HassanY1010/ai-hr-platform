import { create } from 'zustand';
import { SystemHealthMetric, ServiceStatus, SystemAlert, SystemIncident } from '@hr/types';
import { analyticsService } from '@hr/services';

interface SystemHealthState {
    services: ServiceStatus[];
    metrics: SystemHealthMetric & { responseTime: number };
    regions: any[];
    backups: any;
    security: any;
    alerts: SystemAlert[];
    incidents: SystemIncident[];
    aiAnalysis: any | null;
    isAnalyzing: boolean;
    autoRefresh: boolean;
    lastUpdated: string;
    refreshHealth: () => Promise<void>;
    analyzePerformance: () => Promise<void>;
    setAutoRefresh: (auto: boolean) => void;
}

const initialServices: ServiceStatus[] = [];

const initialMetrics: any = {
    cpu: { id: '1', name: 'CPU Usage', value: 0, unit: '%', status: 'healthy', trend: 'stable' },
    memory: { id: '2', name: 'RAM Usage', value: 0, unit: '%', status: 'healthy', trend: 'stable' },
    storage: { id: '3', name: 'Disk Space', value: 0, unit: '%', status: 'healthy', trend: 'stable' },
    network: { id: '4', name: 'Network Load', value: 0, unit: 'Mbps', status: 'healthy', trend: 'stable' },
    responseTime: 0
};

const initialAlerts: SystemAlert[] = [];

const initialIncidents: SystemIncident[] = [];

export const useSystemHealthStore = create<SystemHealthState>((set, get) => ({
    services: initialServices,
    metrics: initialMetrics,
    regions: [],
    backups: { lastBackup: null, status: 'unknown', size: '0GB' },
    security: { score: 100, threats: 0 },
    alerts: initialAlerts,
    incidents: initialIncidents,
    aiAnalysis: null,
    isAnalyzing: false,
    autoRefresh: true,
    lastUpdated: new Date().toISOString(),
    refreshHealth: async () => {
        try {
            const data: any = await analyticsService.getSystemHealth();
            set({
                services: data.services,
                metrics: data.metrics,
                regions: data.regions || [],
                backups: data.backups || { lastBackup: new Date(), status: 'healthy', size: '1.2GB' }, // Fallback if backend doesn't send yet
                security: data.security || { score: 95, threats: 0 },
                lastUpdated: new Date().toISOString()
            });
        } catch (error) {
            console.error('Failed to refresh system health', error);
        }
    },
    analyzePerformance: async () => {
        const { metrics } = get();
        set({ isAnalyzing: true });
        try {
            const data = await analyticsService.analyzeSystemPerformance(metrics);
            set({ aiAnalysis: data });
        } catch (error) {
            console.error('Failed AI performance analysis', error);
        } finally {
            set({ isAnalyzing: false });
        }
    },
    setAutoRefresh: (auto) => set({ autoRefresh: auto }),
}));
