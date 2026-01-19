export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    assignedBy: string;
}

export interface TaskStats {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
}
