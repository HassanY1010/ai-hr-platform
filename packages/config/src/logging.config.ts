export const loggingConfig = {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    enableRemoteLogging: process.env.NODE_ENV === 'production',
    sensitiveFields: ['password', 'token', 'creditCard'],
};
