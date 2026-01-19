// Dashboard Stats (Manager/Owner)
export interface DashboardStats {
    hr: {
        totalEmployees: number;
        satisfaction: number;
        stressHigh: number;
        attritionRisk: number;
    };
    recruitment: {
        activeJobs: number;
        applicants: number;
        accepted: number;
        rejected: number;
        interviews: number;
    };
    training: {
        needsTraining: number;
        inProgress: number;
        completionRate: number;
        impact: number;
    };
}

// System Stats (Admin/Owner)
export interface SystemStats {
    activeCompanies: number;
    totalCompanies?: number;
    totalUsers: number;
    totalJobs?: number;
    estimatedRevenue?: number;
    totalLogs?: number;
    aiUsage: number;
    systemHealth?: number;
}

// System Health Types
export interface SystemHealthMetric {
    id: string;
    name: string;
    value: number;
    unit: string;
    status: 'healthy' | 'warning' | 'critical';
    trend: 'up' | 'down' | 'stable';
    responseTime?: number;
}

export interface ServiceStatus {
    id: string;
    name: string;
    status: 'healthy' | 'warning' | 'critical' | 'maintenance';
    latency: number;
    uptime: string;
    lastChecked: string | Date;
    category?: 'core' | 'database' | 'storage' | 'network' | 'security' | 'monitoring' | 'other';
    version?: string;
}

export interface SystemAlert {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string | Date;
    acknowledged: boolean;
    serviceId?: string;
}

export interface SystemIncident {
    id: string;
    title: string;
    status: 'active' | 'resolved' | 'monitoring';
    severity: 'major' | 'minor';
    startTime: string | Date;
    endTime?: string | Date;
    updates: {
        timestamp: string | Date;
        message: string;
    }[];
}

export interface SystemHealth {
    services: ServiceStatus[];
    metrics: Record<string, SystemHealthMetric>; // Keyed by metric name or id
    alerts: SystemAlert[];
    incidents: SystemIncident[];
    status: 'healthy' | 'degraded' | 'down';
    lastUpdated: string | Date;
}

// Audit Logs
export interface AuditLog {
    id: string;
    user: string;
    action: string;
    actionType: 'create' | 'update' | 'delete' | 'login' | 'security' | 'system' | string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    target: string;
    type: 'security' | 'data' | 'system' | 'other';
    status: 'success' | 'warning' | 'error';
    ip: string;
    timestamp: string | Date;
    details: string;
    companyName?: string;
}


export interface AuditLogSummary {
    totalActions: number;
    warningLogs: number;
    securityEvents: number;
    activeUsers: number;
}

// Recruitment Funnel
export interface RecruitmentFunnelStage {
    status: string;
    _count: number;
}

export type RecruitmentFunnel = RecruitmentFunnelStage[];

// Employee Performance
export interface EmployeePerformanceAnalytics {
    performance: number;
    risk: number;
}
