import { create } from 'zustand';
import { EmployeeProfile, ProfileStats } from './types';

interface ProfileState {
    profile: EmployeeProfile | null;
    stats: ProfileStats | null;
    isLoading: boolean;
    error: string | null;

    setProfile: (profile: EmployeeProfile) => void;
    setStats: (stats: ProfileStats) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    updateAvatar: (url: string) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
    profile: null,
    stats: null,
    isLoading: false,
    error: null,

    setProfile: (profile) => set({ profile }),
    setStats: (stats) => set({ stats }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    updateAvatar: (url) => set((state) => ({
        profile: state.profile ? { ...state.profile, avatarUrl: url } : null
    })),
}));
