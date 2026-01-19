export enum ErrorCode {
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class AppError extends Error {
    constructor(
        public code: ErrorCode,
        public message: string,
        public statusCode: number = 500
    ) {
        super(message);
        this.name = 'AppError';
    }
}
