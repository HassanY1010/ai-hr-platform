export type QuestionType = 'yes-no' | 'rating-5' | 'short-text';

export interface DailyQuestion {
  id: string;
  question: string;
  type: QuestionType;
  category?: string;
  maxLength?: number;
}

export interface QuestionSession {
  id: string;
  questions: DailyQuestion[];
  isCompleted: boolean;
  completedAt?: string;
}

export interface QuestionAnswer {
  questionId: string;
  answer: string | number;
  timestamp: string;
}

// Stats are for background analysis, user doesn't see them directly in new UI
export interface QuestionStats {
  totalAnswered: number;
  lastSessionDate: string;
}
