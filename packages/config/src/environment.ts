export type Environment = 'development' | 'staging' | 'production' | 'test';

export const getEnv = (): Environment => {
    return (process.env.NODE_ENV as Environment) || 'development';
};

export const isDev = getEnv() === 'development';
export const isProd = getEnv() === 'production';
export const isTest = getEnv() === 'test';
