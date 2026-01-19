// packages/ui/src/AIExplanation/AIExplanation.tsx
import React from 'react'
import { Card, CardContent, CardHeader } from '../Card'
import { Badge } from '../Badge/Badge'
import { motion } from 'framer-motion'
import { Brain, AlertTriangle, Lightbulb, Users } from 'lucide-react'

export interface AIExplanationProps {
  score: number
  confidence: number
  decision: string
  reasons: string[]
  insights?: string[]
  type?: 'recruitment' | 'employee' | 'risk' | 'opportunity'
  showDetails?: boolean
  onExplain?: () => void
}

const AIExplanation: React.FC<AIExplanationProps> = ({
  score,
  confidence,
  decision,
  reasons,
  insights = [],
  type = 'recruitment',
  showDetails = true,
  onExplain
}) => {
  const getIcon = () => {
    switch (type) {
      case 'risk': return <AlertTriangle className="h-5 w-5 text-danger-500" />
      case 'opportunity': return <Lightbulb className="h-5 w-5 text-warning-500" />
      case 'employee': return <Users className="h-5 w-5 text-primary-500" />
      default: return <Brain className="h-5 w-5 text-secondary-500" />
    }
  }

  const getColor = (score: number) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'danger'
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.9) return 'عالية جداً'
    if (confidence >= 0.7) return 'عالية'
    if (confidence >= 0.5) return 'متوسطة'
    return 'منخفضة'
  }

  return (
    <Card className="border-l-4 border-l-secondary-500">
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            {getIcon()}
            <span>تحليل الذكاء الاصطناعي</span>
          </div>
        }
        description={
          <div className="flex items-center gap-4 mt-2">
            <Badge variant={getColor(score)}>
              {score}%
            </Badge>
            <span className="text-sm text-neutral-600">
              ثقة التحليل: {getConfidenceText(confidence)}
            </span>
            <Badge variant="ai" className="ml-auto">
              <Brain className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
        }
      />

      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-neutral-50 rounded-lg">
            <h4 className="font-medium text-neutral-900 mb-2">القرار المقترح:</h4>
            <p className="text-lg font-semibold text-secondary-700">{decision}</p>
          </div>

          {showDetails && (
            <>
              <div>
                <h4 className="font-medium text-neutral-900 mb-2">الأسباب الرئيسية:</h4>
                <ul className="space-y-2">
                  {reasons.map((reason, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 text-neutral-700"
                    >
                      <div className="h-2 w-2 rounded-full bg-secondary-500 mt-2 flex-shrink-0" />
                      <span>{reason}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {insights.length > 0 && (
                <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
                  <h4 className="font-medium text-primary-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    رؤى إضافية:
                  </h4>
                  <ul className="space-y-1">
                    {insights.map((insight, index) => (
                      <li key={index} className="text-sm text-primary-700">
                        • {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {onExplain && (
                <button
                  onClick={onExplain}
                  className="text-sm text-secondary-600 hover:text-secondary-800 flex items-center gap-1"
                >
                  <Brain className="h-3 w-3" />
                  كيف توصل الذكاء الاصطناعي لهذا القرار؟
                </button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { AIExplanation }