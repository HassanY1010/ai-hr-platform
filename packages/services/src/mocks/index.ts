export * from './users.mock'
export * from './ai.mock'
export * from './recruitment.mock'
export * from './employee.mock'
export * from './company.mock'
export * from './training.mock'

export type MockHandler = (data?: any) => any;

export const findHandler = (_url: string, _method: string): MockHandler | null => {
    return null;
}