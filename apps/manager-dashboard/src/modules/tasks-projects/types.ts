export interface TaskProject {
    id: string;
    title: string;
    type: 'task' | 'project';
    status: 'planning' | 'active' | 'completed' | 'on-hold';
    budget?: number;
}
