import { create } from 'zustand';
import type { Interview } from '@hr/types';
import { recruitmentService } from '@hr/services';

interface InterviewsState {
    interviews: Interview[];
    smartNotes: string[];
    isLoading: boolean;
    error: string | null;
    fetchInterviews: () => Promise<void>;
    fetchSmartNotes: () => Promise<void>;
    createInterview: (data: Partial<Interview>) => Promise<void>;
    updateInterview: (id: string, data: Partial<Interview>) => Promise<void>;
    deleteInterview: (id: string) => Promise<void>;
}

export const useInterviewsStore = create<InterviewsState>((set) => ({
    interviews: [],
    smartNotes: [],
    isLoading: false,
    error: null,
    fetchInterviews: async () => {
        set({ isLoading: true, error: null });
        try {
            const interviews = await recruitmentService.getInterviews();
            set({ interviews, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch interviews', isLoading: false });
        }
    },
    fetchSmartNotes: async () => {
        try {
            const smartNotes = await recruitmentService.getSmartInterviewNotes();
            set({ smartNotes });
        } catch (error) {
            console.error('Failed to fetch smart notes', error);
        }
    },
    createInterview: async (data: Partial<Interview>) => {
        set({ isLoading: true, error: null });
        try {
            const newInterview = await recruitmentService.scheduleInterview(data);
            set((state) => ({ interviews: [newInterview, ...state.interviews], isLoading: false }));
        } catch (error) {
            set({ error: 'Failed to schedule interview', isLoading: false });
        }
    },
    updateInterview: async (id: string, data: Partial<Interview>) => {
        set({ isLoading: true, error: null });
        try {
            const updatedInterview = await recruitmentService.updateInterview(id, data);
            set((state) => ({
                interviews: state.interviews.map((i) => (i.id === id ? { ...i, ...updatedInterview } : i)),
                isLoading: false
            }));
        } catch (error) {
            set({ error: 'Failed to update interview', isLoading: false });
        }
    },
    deleteInterview: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await recruitmentService.deleteInterview(id);
            set((state) => ({
                interviews: state.interviews.filter((i) => i.id !== id),
                isLoading: false
            }));
        } catch (error) {
            set({ error: 'Failed to delete interview', isLoading: false });
        }
    },
}));
