import { create } from 'zustand';
import { DashboardStats } from './types';

interface DashboardState {
    stats: DashboardStats | null;
    isLoading: boolean;
    setStats: (stats: DashboardStats) => void;
    setLoading: (loading: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    stats: null,
    isLoading: false,
    setStats: (stats) => set({ stats }),
    setLoading: (loading) => set({ isLoading: loading }),
}));
