export interface EmployeeProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
    department: string;
    avatarUrl?: string;
    joinedDate: string;
}

export interface ProfileStats {
    attendanceRate: number;
    performanceScore: number;
    completedTasks: number;
    unlockedBadges: number;
}
