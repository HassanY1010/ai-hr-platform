export interface KPI {
    id: string;
    label: string;
    value: number;
    trend: number;
    unit?: string;
}

export interface RiskAlert {
    id: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
    timestamp: string;
}

export interface DashboardStats {
    kpis: KPI[];
    alerts: RiskAlert[];
}
