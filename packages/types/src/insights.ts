export interface MoodTrendPoint {
    date: string;
    value: number;
}

export interface AIInsight {
    id: string;
    type: 'talent' | 'engagement' | 'performance' | 'other';
    title: string;
    description: string;
    confidence: number;
}

export interface AIAlert {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    department?: string;
    timestamp: string;
}

export interface ThirtyXThreeInsights {
    satisfaction: number;
    stress: number;
    moodGrowth: number;
    moodTrend: MoodTrendPoint[];
    totalParticipation: number;
    insights: AIInsight[];
    alerts: AIAlert[];
}
