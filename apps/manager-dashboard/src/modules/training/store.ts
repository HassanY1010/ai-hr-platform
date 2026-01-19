import { create } from 'zustand';
import { TrainingSession } from './types';

interface TrainingState {
    sessions: TrainingSession[];
    setSessions: (sessions: TrainingSession[]) => void;
}

export const useTrainingStore = create<TrainingState>((set) => ({
    sessions: [],
    setSessions: (sessions) => set({ sessions }),
}));
