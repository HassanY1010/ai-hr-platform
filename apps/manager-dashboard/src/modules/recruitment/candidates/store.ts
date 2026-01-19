import { create } from 'zustand';
import type { Candidate } from '@hr/types';
import { recruitmentService } from '@hr/services';

interface CandidatesState {
    candidates: Candidate[];
    isLoading: boolean;
    error: string | null;
    fetchCandidates: () => Promise<void>;
    createCandidate: (data: Partial<Candidate>, resumeFile?: File) => Promise<void>;
    updateCandidate: (id: string, data: Partial<Candidate>) => Promise<void>;
    deleteCandidate: (id: string) => Promise<void>;
}

export const useCandidatesStore = create<CandidatesState>((set) => ({
    candidates: [],
    isLoading: false,
    error: null,
    fetchCandidates: async () => {
        set({ isLoading: true, error: null });
        try {
            const candidates = await recruitmentService.getCandidates();
            set({ candidates, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch candidates', isLoading: false });
        }
    },
    createCandidate: async (data: Partial<Candidate>, resumeFile?: File) => {
        set({ isLoading: true, error: null });
        try {
            const newCandidate = await recruitmentService.createCandidate(data);

            // If resume file is provided, upload it
            if (resumeFile) {
                try {
                    await recruitmentService.uploadResume(resumeFile, newCandidate.id);
                } catch (uploadError) {
                    console.error('Failed to upload resume', uploadError);
                }
            }

            // Always fetch the full list or the specific new candidate to ensure all fields (like position/job) are populated
            const updatedCandidates = await recruitmentService.getCandidates();
            set({ candidates: updatedCandidates, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to create candidate', isLoading: false });
            throw error;
        }
    },
    updateCandidate: async (id: string, data: Partial<Candidate>) => {
        set({ isLoading: true, error: null });
        try {
            const updatedCandidate = await recruitmentService.updateCandidate(id, data);
            set((state) => ({
                candidates: state.candidates.map((c) => (c.id === id ? { ...c, ...updatedCandidate } : c)),
                isLoading: false
            }));
        } catch (error) {
            set({ error: 'Failed to update candidate', isLoading: false });
        }
    },
    deleteCandidate: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await recruitmentService.deleteCandidate(id);
            set((state) => ({
                candidates: state.candidates.filter((c) => c.id !== id),
                isLoading: false
            }));
        } catch (error) {
            set({ error: 'Failed to delete candidate', isLoading: false });
        }
    },
}));