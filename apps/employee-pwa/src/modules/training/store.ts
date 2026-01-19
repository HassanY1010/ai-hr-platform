import { create } from 'zustand';
import { EmployeeTraining, Training, TrainingStats } from './types';

interface TrainingState {
    assignedTrainings: EmployeeTraining[];
    availableCourses: Training[];
    stats: TrainingStats;
    isLoading: boolean;
    error: string | null;

    setAssignedTrainings: (trainings: EmployeeTraining[]) => void;
    setAvailableCourses: (courses: Training[]) => void;
    setStats: (stats: TrainingStats) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useTrainingStore = create<TrainingState>((set) => ({
    assignedTrainings: [],
    availableCourses: [],
    stats: { enrolled: 0, completed: 0, hoursSpent: 0, totalCertificates: 0 },
    isLoading: false,
    error: null,

    setAssignedTrainings: (assignedTrainings) => set({ assignedTrainings }),
    setAvailableCourses: (availableCourses) => set({ availableCourses }),
    setStats: (stats) => set({ stats }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
}));
