import { create } from 'zustand';
import { AuditLog, AuditLogSummary } from '@hr/types';
import { adminService } from '@hr/services';

interface AuditLogsState {
    logs: AuditLog[];
    summary: AuditLogSummary;
    loading: boolean;
    setLogs: (logs: AuditLog[]) => void;
    addLog: (log: AuditLog) => void;
    refreshLogs: () => Promise<void>;
}

const initialSummary: AuditLogSummary = {
    totalActions: 0,
    warningLogs: 0,
    securityEvents: 0,
    activeUsers: 0
};

export const useAuditLogsStore = create<AuditLogsState>((set) => ({
    logs: [],
    summary: initialSummary,
    loading: false,
    setLogs: (logs) => set({ logs }),
    addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
    refreshLogs: async () => {
        set({ loading: true });
        try {
            const response = await adminService.getAuditLogs();
            // The service might return the raw response or the data. 
            // Based on our admin controller, it returns { data, summary }
            set({
                logs: response.data || [],
                summary: response.summary || initialSummary
            });
        } catch (error) {
            console.error('Failed to fetch audit logs', error);
        } finally {
            set({ loading: false });
        }
    }
}));

