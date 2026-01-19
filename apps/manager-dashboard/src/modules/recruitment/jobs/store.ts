import { create } from 'zustand';
import type { Job } from '@hr/types';
import { recruitmentService } from '@hr/services';

interface JobsState {
    jobs: Job[];
    isLoading: boolean;
    error: string | null;
    fetchJobs: () => Promise<void>;
    createJob: (data: Partial<Job>) => Promise<void>;
    updateJob: (id: string, data: Partial<Job>) => Promise<void>;
    deleteJob: (id: string) => Promise<void>;
}

export const useJobsStore = create<JobsState>((set) => ({
    jobs: [],
    isLoading: false,
    error: null,
    fetchJobs: async () => {
        set({ isLoading: true, error: null });
        try {
            const jobs = await recruitmentService.getJobs();
            set({ jobs, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch jobs', isLoading: false });
        }
    },
    createJob: async (data: Partial<Job>) => {
        set({ isLoading: true, error: null });
        try {
            const newJob = await recruitmentService.createJob(data);
            set((state) => ({ jobs: [newJob, ...state.jobs], isLoading: false }));
        } catch (error) {
            console.error('Create job error:', error);
            set({ error: 'Failed to create job', isLoading: false });
            throw error;
        }
    },
    updateJob: async (id: string, data: Partial<Job>) => {
        set({ isLoading: true, error: null });
        try {
            const updatedJob = await recruitmentService.updateJob(id, data);
            set((state) => ({
                jobs: state.jobs.map((job) => (job.id === id ? { ...job, ...updatedJob } : job)),
                isLoading: false
            }));
        } catch (error) {
            console.error('Update job error:', error);
            set({ error: 'Failed to update job', isLoading: false });
            throw error;
        }
    },
    deleteJob: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await recruitmentService.deleteJob(id);
            set((state) => ({
                jobs: state.jobs.filter((job) => job.id !== id),
                isLoading: false
            }));
        } catch (error) {
            console.error('Delete job error:', error);
            set({ error: 'Failed to delete job', isLoading: false });
            throw error;
        }
    },
}));
