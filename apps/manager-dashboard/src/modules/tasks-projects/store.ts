import { create } from 'zustand';
import { TaskProject } from './types';

interface TasksProjectsState {
    items: TaskProject[];
    setItems: (items: TaskProject[]) => void;
}

export const useTasksProjectsStore = create<TasksProjectsState>((set) => ({
    items: [],
    setItems: (items) => set({ items }),
}));
