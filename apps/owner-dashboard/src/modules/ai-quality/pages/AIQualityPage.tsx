import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Badge, AIExplanation, Button } from '@hr/ui'
import { Brain, Target, TrendingUp, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { aiQualityService, type AIModelQuality, type AIQualityAnalysis } from '@hr/services'

const AIQualityPage: React.FC = () => {
  const [qualityMetrics, setQualityMetrics] = useState<AIModelQuality[]>([])
  const [analysis, setAnalysis] = useState<AIQualityAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [metricsData, analysisData] = await Promise.all([
        aiQualityService.getMetrics(),
        aiQualityService.analyzeQuality()
      ])
      setQualityMetrics(metricsData)
      setAnalysis(analysisData)
    } catch (error) {
      console.error('Failed to fetch AI quality data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const testResults = [
    {
      scenario: 'تحليل مرشح ممتاز',
      expected: 'تعيين فوري',
      actual: 'تعيين فوري',
      confidence: 0.95,
      passed: true
    },

    {
      scenario: 'توصية تدريب',
      expected: 'تدريب تقني',
      actual: 'تدريب تقني',
      confidence: 0.91,
      passed: true
    },
    {
      scenario: 'تحليل مشاعر سلبية',
      expected: 'تدخل فوري',
      actual: 'تدخل فوري',
      confidence: 0.88,
      passed: true
    }
  ]

  const improvements = [
    {
      area: 'دقة تحليل المخاطر',
      current: 78,
      target: 90,
      impact: 'عالية',
      priority: 'عالي'
    },
    {
      area: 'تقليل وقت الاستجابة',
      current: 156,
      target: 120,
      impact: 'متوسطة',
      priority: 'متوسط'
    },
    {
      area: 'تكلفة المعالجة',
      current: 0.85,
      target: 0.65,
      impact: 'عالية',
      priority: 'عالي'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">جودة الذكاء الاصطناعي</h2>
          <p className="text-neutral-600">مراقبة وتحسين أداء النماذج</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Badge variant="success">
            <CheckCircle className="h-3 w-3 mr-1" />
            جودة مستقرة
          </Badge>
          <span className="text-sm text-neutral-500">دقة إجمالية: {analysis?.overallScore || 0}%</span>
        </div>
      </div>

      {/* Quality Score */}
      <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-neutral-900">{analysis?.overallScore || 0}%</p>
              <p className="text-lg text-neutral-600">متوسط دقة النماذج</p>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="h-4 w-4 text-success-600" />
                <span className="text-sm text-success-600">رؤى الذكاء الاصطناعي: {analysis?.insights[0]}</span>
              </div>
            </div>
            <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center border-8 border-success-500">
              <Brain className="h-12 w-12 text-primary-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Models Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {qualityMetrics.map((model, index) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-neutral-900">{model.modelName}</h4>
                  <Badge variant={model.status === 'production' ? 'success' : 'warning'}>
                    {model.status === 'production' ? 'إنتاج' : 'تجريبي'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">الدقة:</span>
                    <Badge variant={model.accuracy >= 90 ? 'success' : 'warning'}>
                      {model.accuracy}%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">الدقة التفصيلية:</span>
                    <span className="text-sm font-medium">{model.precision}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">التغطية:</span>
                    <span className="text-sm font-medium">{model.recall}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">وقت الاستجابة:</span>
                    <span className="text-sm font-medium">{model.latency}ms</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">إجمالي الطلبات:</span>
                    <span className="text-sm font-medium">{(model as any).requestCount || 0}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">التكلفة الإجمالية:</span>
                    <span className="text-sm font-semibold text-primary-600">
                      ${((model as any).totalCost || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Model Score */}
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">درجة الجودة:</span>
                    <span className="text-lg font-bold">
                      {Math.round((model.accuracy + model.precision + model.recall) / 3)}%
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${model.accuracy >= 90 ? 'bg-success-500' :
                        model.accuracy >= 80 ? 'bg-warning-500' :
                          'bg-danger-500'
                        }`}
                      style={{ width: `${model.accuracy}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Test Results */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            نتائج الاختبارات
          </h3>

          <div className="space-y-4">
            {testResults.map((test, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 hover:bg-neutral-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${test.passed ? 'bg-success-50' : 'bg-danger-50'
                    } flex items-center justify-center`}>
                    {test.passed ? (
                      <CheckCircle className="h-5 w-5 text-success-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-danger-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{test.scenario}</p>
                    <p className="text-sm text-neutral-600">
                      متوقع: {test.expected} • فعلي: {test.actual}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <Badge variant={test.confidence >= 0.9 ? 'success' :
                    test.confidence >= 0.8 ? 'warning' : 'danger'}>
                    ثقة {Math.round(test.confidence * 100)}%
                  </Badge>
                  <p className="text-xs text-neutral-500 mt-1">
                    {test.passed ? 'نجح' : 'فشل'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-medium text-neutral-900">
                  نسبة النجاح الإجمالية: {Math.round((testResults.filter(t => t.passed).length / testResults.length) * 100)}%
                </p>
                <p className="text-sm text-neutral-600">
                  {testResults.filter(t => t.passed).length} نجاحات من {testResults.length} اختبارات
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Improvement Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">
              مجالات التحسين
            </h3>

            <div className="space-y-6">
              {improvements.map((improvement, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-neutral-900">
                      {improvement.area}
                    </span>
                    <Badge variant={improvement.priority === 'عالي' ? 'danger' : 'warning'}>
                      أولوية {improvement.priority}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-neutral-500">
                        {typeof improvement.current === 'number'
                          ? improvement.current.toFixed(improvement.current < 10 ? 2 : 0)
                          : improvement.current}
                        {' '}
                        {improvement.area.includes('تكلفة') ? '$' :
                          improvement.area.includes('وقت') ? 'ms' : '%'}
                      </span>
                      <span className="text-neutral-500">
                        الهدف: {improvement.target}
                        {improvement.area.includes('تكلفة') ? '$' :
                          improvement.area.includes('وقت') ? 'ms' : '%'}
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${(improvement.current / improvement.target) >= 0.9 ? 'bg-success-500' :
                          (improvement.current / improvement.target) >= 0.7 ? 'bg-warning-500' :
                            'bg-primary-500'
                          }`}
                        style={{
                          width: `${(improvement.current / improvement.target) * 100}%`,
                          maxWidth: '100%'
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">التأثير: {improvement.impact}</span>
                    <span className="font-medium">
                      {Math.round((improvement.current / improvement.target) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Decision Example */}
        <AIExplanation
          score={analysis?.overallScore || 0}
          confidence={0.92}
          decision="توصيات تحسين أداء النماذج"
          reasons={analysis?.insights || []}
          insights={analysis?.recommendations || []}
          type="opportunity"
          showDetails={true}
        />
      </div>
    </div>
  )
}

export default AIQualityPage