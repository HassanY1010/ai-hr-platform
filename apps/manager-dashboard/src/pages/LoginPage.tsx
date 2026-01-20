// LoginPage.tsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardContent, Button } from '@hr/ui'
import {
  Brain,
  Shield,
  Sun,
  Moon,
  CheckCircle,
  TrendingUp,
  Users
} from 'lucide-react'
import { useTheme } from '@hr/ui'

const LoginPage: React.FC = () => {
  const { theme, setTheme, actualTheme } = useTheme()
  const isDarkMode = actualTheme === 'dark'
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: 'نظام قرارات ذكية',
      description: 'اتخذ قراراتك بناءً على تحليلات ذكية مدعومة بالذكاء الاصطناعي',
      icon: Brain,
      color: 'from-blue-600 to-purple-600'
    },
    {
      title: 'إدارة فعالة للموارد البشرية',
      description: 'تتبع الأداء، إدارة المهام، وتطوير المهارات بكفاءة',
      icon: Users,
      color: 'from-green-600 to-teal-600'
    },
    {
      title: 'تحليلات متقدمة',
      description: 'احصل على رؤى عميقة لأداء فريقك واتجاهات الموارد البشرية',
      icon: TrendingUp,
      color: 'from-orange-600 to-red-600'
    },
    {
      title: 'أمان متقدم',
      description: 'حماية بياناتك مع أحدث تقنيات الأمان والمصادقة',
      icon: Shield,
      color: 'from-indigo-600 to-blue-600'
    }
  ]

  useEffect(() => {
    const landingPageUrl = (import.meta as any).env.VITE_LANDING_PAGE_URL || 'http://localhost:3005'
    window.location.href = `${landingPageUrl}?mode=login`
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [slides.length])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const landingPageUrl = (import.meta as any).env.VITE_LANDING_PAGE_URL || 'http://localhost:3005'
    window.location.href = `${landingPageUrl}?mode=login`
  }

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${isDarkMode
      ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
      : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
      } relative overflow-hidden`}>
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 max-w-lg"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${slides[currentSlide].color} flex items-center justify-center shadow-lg`}>
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI HR Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  نظام القرارات الذكية للموارد البشرية
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br ${slides[currentSlide].color} mb-4 shadow-lg`}>
                  {(() => {
                    const Icon = slides[currentSlide].icon
                    return <Icon className="h-10 w-10 text-white" />
                  })()}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {slides[currentSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>تحليلات ذكية بالذكاء الاصطناعي</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>إدارة فعالة للموارد البشرية</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>أمان متقدم للبيانات</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>تجربة مستخدم متميزة</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 max-w-md"
        >
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white/20 dark:bg-white/10 backdrop-blur-sm hover:bg-white/30 transition-all"
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-blue-400" />}
            </button>
          </div>

          <Card className="w-full shadow-2xl backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border border-white/20 dark:border-gray-600">
            <CardHeader>
              <div className="text-center">
                <div className="inline-flex items-center justify-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      تسجيل الدخول الموحد
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      يرجى تسجيل الدخول عبر البوابة الرئيسية
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Button
                  type="submit"
                  className="w-full py-4 text-lg font-bold shadow-lg"
                  variant="primary"
                >
                  الانتقال لتسجيل الدخول
                </Button>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  سيتم توجيهك إلى صفحة الهبوط لتسجيل الدخول بشكل آمن
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage