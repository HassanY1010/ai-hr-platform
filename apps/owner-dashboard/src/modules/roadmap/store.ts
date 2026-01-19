import { create } from 'zustand'
import type { RoadmapItem, Milestone, Feature } from './types'
import { roadmapService } from '@hr/services'

interface RoadmapState {
    roadmapItems: RoadmapItem[]
    milestones: Milestone[]
    features: Feature[]
    aiAnalysis: any | null
    isLoading: boolean
    isAnalyzing: boolean
    refreshData: () => Promise<void>
    analyzeRoadmap: () => Promise<void>
}

export const useRoadmapStore = create<RoadmapState>((set) => ({
    roadmapItems: [],
    milestones: [],
    features: [],
    aiAnalysis: null,
    isLoading: false,
    isAnalyzing: false,
    refreshData: async () => {
        set({ isLoading: true })
        try {
            const response: any = await roadmapService.getRoadmap()
            const { roadmapItems, milestones, features } = response.data || response

            set({
                roadmapItems: roadmapItems || [],
                milestones: milestones || [],
                features: features || [],
                isLoading: false
            })
        } catch (error) {
            console.error('Failed to fetch roadmap data:', error)
            set({ isLoading: false })
        }
    },
    analyzeRoadmap: async () => {
        set({ isAnalyzing: true })
        try {
            const response: any = await roadmapService.analyze()
            set({ aiAnalysis: response.data || response, isAnalyzing: false })
        } catch (error) {
            console.error('Failed to analyze roadmap:', error)
            set({ isAnalyzing: false })
        }
    }
}))
