export interface Training {
    id: string;
    title: string;
    description: string;
    provider?: string;
    category?: string;
    cost?: number;
    url?: string;
    duration: number;
    skills?: any; // JSON
    aiTags?: any; // JSON
    attachments?: any[];
    createdAt: string;
    updatedAt: string;
}

export interface EmployeeTraining {
    id: string;
    employeeId: string;
    courseId: string;
    course: Training;
    status: 'ASSIGNED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
    progress: number;
    trainingPlan?: string;
    quiz?: string;
    quizAnswers?: string;
    completedAt?: string;
    certificateUrl?: string;
    employeeNotes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface TrainingStats {
    enrolled: number;
    completed: number;
    hoursSpent: number;
    totalCertificates: number;
}
