// Roadmap Types
export interface RoadmapItem {
    id: string
    title: string
    description: string
    status: 'planned' | 'in-progress' | 'completed' | 'on-hold'
    priority: 'low' | 'medium' | 'high' | 'critical'
    startDate: string
    endDate: string
    progress: number
    category: string
    assignedTo?: string
}

export interface Milestone {
    id: string
    name: string
    description: string
    targetDate: string
    status: 'upcoming' | 'current' | 'completed' | 'delayed'
    progress: number
    features: number
}

export interface Feature {
    id: string
    name: string
    description: string
    status: 'planned' | 'in-development' | 'testing' | 'released'
    releaseDate: string
    votes: number
}
