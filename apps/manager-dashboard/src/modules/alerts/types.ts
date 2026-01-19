export interface Alert {
    id: string;
    type: 'info' | 'warning' | 'critical';
    message: string;
    createdAt: string;
}
