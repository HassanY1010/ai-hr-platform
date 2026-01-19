// apps/employee-pwa/src/modules/daily-question/components/DailyQuestionCard.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@hr/ui'
import type { DailyQuestion } from '@hr/types'
import { ThumbsUp, ThumbsDown, Smile, Frown, Meh } from 'lucide-react'

interface DailyQuestionCardProps {
  question: DailyQuestion
  onAnswer: (answer: string | number) => void
}

const DailyQuestionCard: React.FC<DailyQuestionCardProps> = ({
  question,
  onAnswer
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleAnswer = async (answer: string | number) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    setSelectedAnswer(answer)
    
    try {
      await onAnswer(answer)
      
      // Success animation
      setTimeout(() => {
        setIsSubmitting(false)
      }, 1500)
    } catch (error) {
      setIsSubmitting(false)
      setSelectedAnswer(null)
    }
  }
  
  const renderAnswerButtons = () => {
    switch (question.type) {
      case 'yes_no':
        return (
          <div className="flex gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleAnswer('yes')}
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl transition-all ${
                selectedAnswer === 'yes'
                  ? 'bg-success-100 border-2 border-success-500 text-success-700'
                  : 'bg-white border-2 border-neutral-200 text-neutral-700 hover:border-success-300 hover:bg-success-50'
              }`}
            >
              <ThumbsUp className="h-5 w-5" />
              <span className="font-semibold">نعم</span>
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleAnswer('no')}
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl transition-all ${
                selectedAnswer === 'no'
                  ? 'bg-danger-100 border-2 border-danger-500 text-danger-700'
                  : 'bg-white border-2 border-neutral-200 text-neutral-700 hover:border-danger-300 hover:bg-danger-50'
              }`}
            >
              <ThumbsDown className="h-5 w-5" />
              <span className="font-semibold">لا</span>
            </motion.button>
          </div>
        )
      
      case 'scale_1_5':
        const scaleOptions = [
          { value: 1, icon: Frown, label: 'سيء' },
          { value: 2, icon: Meh, label: 'متوسط' },
          { value: 3, icon: Smile, label: 'جيد' },
          { value: 4, icon: Smile, label: 'جيد جداً' },
          { value: 5, icon: Smile, label: 'ممتاز' }
        ]
        
        return (
          <div className="grid grid-cols-5 gap-2">
            {scaleOptions.map((option) => (
              <motion.button
                key={option.value}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleAnswer(option.value)}
                disabled={isSubmitting}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
                  selectedAnswer === option.value
                    ? option.value >= 4
                      ? 'bg-success-100 border-2 border-success-500 text-success-700'
                      : option.value >= 3
                      ? 'bg-warning-100 border-2 border-warning-500 text-warning-700'
                      : 'bg-danger-100 border-2 border-danger-500 text-danger-700'
                    : 'bg-white border-2 border-neutral-200 text-neutral-700 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                <option.icon className={`h-6 w-6 ${
                  selectedAnswer === option.value
                    ? option.value >= 4 ? 'text-success-600'
                    : option.value >= 3 ? 'text-warning-600'
                    : 'text-danger-600'
                    : 'text-neutral-500'
                }`} />
                <span className="text-xs mt-1 font-medium">
                  {option.value}
                </span>
              </motion.button>
            ))}
          </div>
        )
      
      default:
        return null
    }
  }
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-l-4 border-l-primary-500 shadow-lg">
        <CardHeader
          title="سؤال اليوم"
          description="إجابة واحدة تساعد في تحسين بيئة العمل"
        />
        
        <CardContent>
          <div className="space-y-6">
            {/* Question */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                {question.question}
              </h3>
              <p className="text-sm text-neutral-500">
                إجابتك سرية ولا تشارك مع أي شخص
              </p>
            </motion.div>
            
            {/* Answer Options */}
            {renderAnswerButtons()}
            
            {/* Submission Feedback */}
            {isSubmitting && selectedAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-4"
              >
                <div className="inline-flex items-center gap-2 text-success-600">
                  <div className="h-2 w-2 rounded-full bg-success-500 animate-pulse"></div>
                  <span>شكراً لمشاركتك! 💙</span>
                </div>
                <p className="text-sm text-neutral-500 mt-1">
                  يومك مهم بالنسبة لنا
                </p>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default DailyQuestionCard