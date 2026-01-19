import { create } from 'zustand';

interface ManagerState {
    manager: any | null;
    isAuthenticated: boolean;
    setManager: (manager: any) => void;
    logout: () => void;
}

export const useManagerStore = create<ManagerState>((set) => ({
    manager: null,
    isAuthenticated: false,
    setManager: (manager) => set({ manager, isAuthenticated: true }),
    logout: () => set({ manager: null, isAuthenticated: false }),
}));
