import { create } from 'zustand';
import { Task, TaskStats } from './types';

interface TasksState {
    tasks: Task[];
    stats: TaskStats;
    isLoading: boolean;
    error: string | null;

    setTasks: (tasks: Task[]) => void;
    setStats: (stats: TaskStats) => void;
    updateTaskStatus: (id: string, status: Task['status']) => void;
    deleteTask: (id: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
    tasks: [],
    stats: { total: 0, completed: 0, pending: 0, overdue: 0 },
    isLoading: false,
    error: null,

    setTasks: (tasks) => set({ tasks }),
    setStats: (stats) => set({ stats }),
    updateTaskStatus: (id, status) =>
        set((state) => ({
            tasks: state.tasks.map(t => t.id === id ? { ...t, status } : t)
        })),
    deleteTask: (id) =>
        set((state) => ({
            tasks: state.tasks.filter(t => t.id !== id)
        })),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
}));
