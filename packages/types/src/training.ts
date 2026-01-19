export type TrainingStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';

export interface Training {
    id: string;
    title: string;
    description: string;
    duration: number; // in minutes
    attachments?: any[];
    createdAt: string | Date;
}

export interface EmployeeTraining {
    id: string;
    employeeId: string;
    trainingId: string;
    training?: Training;
    status: TrainingStatus;
    progress: number;
    updatedAt: string | Date;
}
