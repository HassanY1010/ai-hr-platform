// packages/types/src/employee.ts
import { User } from './user'

export interface Employee {
    id: string
    userId: string
    companyId: string
    department: string
    position: string
    startDate: Date | string
    endDate?: Date | string
    status: 'active' | 'inactive' | 'on_leave' | 'suspended'
    managerId?: string
    user?: User
}

export interface EmployeeEngagement {
    employeeId: string
    date: Date
    mood: 1 | 2 | 3 | 4 | 5
    stress: 1 | 2 | 3 | 4 | 5
    satisfaction: 1 | 2 | 3 | 4 | 5
    notes?: string
}

export interface EmployeeTask {
    id: string
    employeeId: string
    title: string
    description: string
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'done'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    progress?: number
    dueDate: Date | string
    completedDate?: Date | string
    completedAt?: string
    estimatedTime?: number
    actualTime?: number
    assignedBy?: string
    attachments?: any[]
    createdAt: Date | string
    updatedAt: Date | string
    project?: {
        id: string
        name: string
    }
}





export interface EmployeePerformance {
    employeeId: string
    period: string
    score: number
    metrics: {
        productivity: number
        quality: number
        attendance: number
        growth: number
    }
    feedback?: string
    lastUpdated: Date
}
