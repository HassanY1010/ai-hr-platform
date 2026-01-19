export interface DailyQuestion {
    id: string;
    companyId: string;
    question: string;
    type: string;
    category?: string;
    createdAt: string | Date;
    answer?: string | number;
    answeredAt?: string | Date;
}

export interface Answer {
    id: string;
    employeeId: string;
    questionId: string;
    content: string;
    aiSentiment?: number | null;
    createdAt: string | Date;
}
