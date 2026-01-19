export interface Employee {
    id: string;
    name: string;
    role: string;
    department: string;
    status: 'active' | 'on-leave' | 'terminated';
}
