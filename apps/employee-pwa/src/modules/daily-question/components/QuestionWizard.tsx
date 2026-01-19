import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDailyQuestionStore } from '../store';
import { Star, Check, X, Send, Timer, AlertCircle } from 'lucide-react';

const QUESTION_TIMEOUT = 30; // seconds

export const QuestionWizard: React.FC = () => {
  const {
    currentSession,
    currentQuestionIndex,
    submitAnswer,
    nextQuestion,
    hasCompletedToday,
  } = useDailyQuestionStore();

  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIMEOUT);
  const [answer, setAnswer] = useState<string | number>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const currentQuestion =
    currentSession?.questions[currentQuestionIndex];

  const handleSubmit = useCallback(async () => {
    if (!currentQuestion || isSubmitting) return;

    setIsSubmitting(true);
    submitAnswer(answer);

    const isLast =
      currentQuestionIndex ===
      (currentSession?.questions.length ?? 0) - 1;

    if (!isLast) {
      setTimeout(() => {
        nextQuestion();
        setAnswer('');
        setTimeLeft(QUESTION_TIMEOUT);
        setIsSubmitting(false);
      }, 400);
    }
  }, [
    currentQuestion,
    answer,
    currentQuestionIndex,
    currentSession,
    submitAnswer,
    nextQuestion,
    isSubmitting,
  ]);

  useEffect(() => {
    if (hasCompletedToday) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, handleSubmit, hasCompletedToday]);

  // Show completion screen when all questions are answered
  if (hasCompletedToday || !currentQuestion) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center py-12"
      >
        <div className="glass-card p-8 rounded-[2.5rem]">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            شكراً لمشاركتك! 🎉
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            تم حفظ إجاباتك بنجاح. مساهمتك تساعدنا في تحسين بيئة العمل للجميع.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium">
            <Check className="w-4 h-4" />
            <span>تم الإكمال لهذا اليوم</span>
          </div>
        </div>
      </motion.div>
    );
  }

  const renderInput = () => {
    switch (currentQuestion.type) {
      case 'yes-no':
        return (
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAnswer('yes')}
              className={`flex-1 max-w-[140px] py-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${answer === 'yes'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white border border-slate-200 text-slate-600'
                }`}
            >
              <Check className="w-8 h-8" />
              <span className="font-bold">نعم</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAnswer('no')}
              className={`flex-1 max-w-[140px] py-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${answer === 'no'
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-white border border-slate-200 text-slate-600'
                }`}
            >
              <X className="w-8 h-8" />
              <span className="font-bold">لا</span>
            </motion.button>
          </div>
        );

      case 'rating-5':
        return (
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAnswer(star)}
                className={`p-2 transition-colors ${(answer as number) >= star
                    ? 'text-yellow-400'
                    : 'text-slate-200'
                  }`}
              >
                <Star className="w-10 h-10 fill-current" />
              </motion.button>
            ))}
          </div>
        );

      case 'short-text':
        return (
          <div className="space-y-2">
            <textarea
              value={answer as string}
              onChange={(e) =>
                setAnswer(e.target.value.slice(0, 120))
              }
              placeholder="اكتب هنا باختصار..."
              className="w-full h-32 p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none text-right"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>
                {(answer as string).length} / 120
              </span>
              <span>الخصوصية محفوظة: إجابتك مُجهلة</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto relative pt-8">
      {/* Session Progress */}
      <div className="flex gap-2 mb-8 justify-center">
        {currentSession?.questions.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentQuestionIndex
                ? 'w-8 bg-indigo-600'
                : idx < currentQuestionIndex
                  ? 'w-4 bg-indigo-300'
                  : 'w-4 bg-slate-200'
              }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="glass-card p-6 rounded-[2.5rem] relative overflow-hidden"
        >
          {/* Timer */}
          <div className="absolute top-0 right-0 p-4">
            <div className="relative flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90 transform">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  className="text-slate-100"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={126}
                  strokeDashoffset={
                    126 -
                    (126 * timeLeft) / QUESTION_TIMEOUT
                  }
                  className={`transition-all duration-1000 ${timeLeft < 10
                      ? 'text-pink-500'
                      : 'text-indigo-500'
                    }`}
                />
              </svg>
              <span
                className={`absolute text-xs font-bold ${timeLeft < 10
                    ? 'text-pink-500'
                    : 'text-indigo-700'
                  }`}
              >
                {timeLeft}
              </span>
            </div>
          </div>

          <div className="mt-8 mb-10 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-4">
              {currentQuestion.category}
            </span>
            <h2 className="text-xl font-bold text-slate-800 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {renderInput()}

          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>لا يمكن التراجع</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={
                currentQuestion.type !== 'short-text' && !answer
              }
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 disabled:opacity-50 transition-all"
            >
              <span>إرسال</span>
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 text-center px-6">
        <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
          <Timer className="w-4 h-4" />
          <span>30 ثانية لكل سؤال لراحتك</span>
        </p>
      </div>
    </div>
  );
};
