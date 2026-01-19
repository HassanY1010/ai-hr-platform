// Shared mock users database for all apps
// This will be replaced with real API calls when backend is ready

export interface MockUser {
    id: number
    email: string
    password: string
    name: string
    role: 'owner' | 'company_manager' | 'project_manager' | 'employee'
    company_id?: number
    company_name?: string
}

export const MOCK_USERS: MockUser[] = [
    {
        id: 1,
        email: 'owner@system.com',
        password: 'owner123',
        name: 'System Owner',
        role: 'owner'
    },
    {
        id: 2,
        email: 'manager@company.com',
        password: 'manager123',
        name: 'Company Manager',
        role: 'company_manager',
        company_id: 1,
        company_name: 'شركة التقنية المتقدمة'
    },
    {
        id: 3,
        email: 'pm@company.com',
        password: 'pm123',
        name: 'Project Manager',
        role: 'project_manager',
        company_id: 1,
        company_name: 'شركة التقنية المتقدمة'
    },
    {
        id: 4,
        email: 'employee@company.com',
        password: 'employee123',
        name: 'Employee User',
        role: 'employee',
        company_id: 1,
        company_name: 'شركة التقنية المتقدمة'
    }
]

export const mockLogin = (email: string, password: string): MockUser | null => {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password)
    return user || null
}

export const mockRegister = (companyName: string, managerName: string, email: string, password: string): MockUser => {
    // Generate new IDs
    const newCompanyId = Math.max(...MOCK_USERS.filter(u => u.company_id).map(u => u.company_id!), 0) + 1
    const newUserId = Math.max(...MOCK_USERS.map(u => u.id)) + 1

    const newUser: MockUser = {
        id: newUserId,
        email,
        password,
        name: managerName,
        role: 'company_manager',
        company_id: newCompanyId,
        company_name: companyName
    }

    MOCK_USERS.push(newUser)
    return newUser
}

export const getRoleRedirectPath = (role: string): string => {
    switch (role) {
        case 'owner':
            return '/owner'
        case 'company_manager':
            return '/manager'
        case 'project_manager':
            return '/projects'
        case 'employee':
            return '/employee'
        default:
            return '/login'
    }
}
