import { create } from 'zustand';
import { DailyQuestion, QuestionAnswer, QuestionSession } from './types';
import { employeeService } from '@hr/services';
import { offlineService } from '../../services/offline.service';
import { toast } from 'sonner';

interface DailyQuestionState {
  currentSession: QuestionSession | null;
  currentQuestionIndex: number;
  answers: QuestionAnswer[];
  isLoading: boolean;
  error: string | null;
  hasCompletedToday: boolean;

  // Actions
  startSession: () => Promise<void>;
  submitAnswer: (answer: string | number) => void;
  nextQuestion: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasCompletedToday: (completed: boolean) => void;
  reset: () => void;
}

export const useDailyQuestionStore = create<DailyQuestionState>((set) => ({
  currentSession: null,
  currentQuestionIndex: 0,
  answers: [],
  isLoading: false,
  error: null,
  hasCompletedToday: false,

  startSession: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;
      if (!user?.id) throw new Error('User not found');

      const data = await employeeService.getDailyQuestion(user.id);
      const questions = (Array.isArray(data) ? data : [data]).filter(Boolean);

      if (questions.length === 0) {
        set({ isLoading: false, hasCompletedToday: true });
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      // Find the first question that hasn't been answered today
      const firstUnansweredIndex = questions.findIndex(q => {
        const answeredAt = (q as any).answeredAt;
        return !(answeredAt && new Date(answeredAt).toISOString().startsWith(today));
      });

      const hasCompleted = firstUnansweredIndex === -1;

      set({
        currentSession: {
          id: new Date().toISOString(),
          questions: questions as unknown as DailyQuestion[],
          isCompleted: hasCompleted
        },
        currentQuestionIndex: hasCompleted ? 0 : firstUnansweredIndex,
        answers: [],
        hasCompletedToday: hasCompleted,
        isLoading: false
      });

    } catch (error) {
      console.error('Failed to fetch daily question:', error);
      set({ error: 'Failed to load question', isLoading: false });
    }
  },

  submitAnswer: async (answer) => {
    set({ isLoading: true });
    const state = useDailyQuestionStore.getState();
    if (!state.currentSession) return;

    const currentQuestion = state.currentSession.questions[state.currentQuestionIndex];
    const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;

    const newAnswer: QuestionAnswer = {
      questionId: currentQuestion.id,
      answer,
      timestamp: new Date().toISOString()
    };

    try {
      if (user?.id) {
        await employeeService.answerDailyQuestion(user.id, currentQuestion.id, answer);
        toast.success('تم حفظ إجابتك');
      } else {
        throw new Error('No user');
      }
    } catch (error) {
      console.warn('Online submission failed, saving offline', error);
      await offlineService.saveAnswer(newAnswer);
      toast.info('تم حفظ الإجابة محلياً (لا يوجد اتصال)');
    }

    set((state) => {
      const newAnswers = [...state.answers, newAnswer];
      const totalQuestions = state.currentSession?.questions.length || 0;
      const isLastQuestion = state.currentQuestionIndex >= totalQuestions - 1;

      return {
        answers: newAnswers,
        hasCompletedToday: isLastQuestion, // Only mark as completed if this is the last question
        currentSession: state.currentSession ? {
          ...state.currentSession,
          isCompleted: isLastQuestion,
          completedAt: isLastQuestion ? new Date().toISOString() : undefined
        } : null,
        isLoading: false
      };
    });
  },

  nextQuestion: () => set((state) => ({
    currentQuestionIndex: state.currentQuestionIndex + 1
  })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setHasCompletedToday: (completed) => set({ hasCompletedToday: completed }),

  reset: () => set({
    currentSession: null,
    currentQuestionIndex: 0,
    answers: [],
    isLoading: false,
    error: null
  }),
}));
