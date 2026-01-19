import { create } from 'zustand';
import { Employee } from './types';

interface EmployeesState {
    employees: Employee[];
    setEmployees: (employees: Employee[]) => void;
}

export const useEmployeesStore = create<EmployeesState>((set) => ({
    employees: [],
    setEmployees: (employees) => set({ employees }),
}));
