// apps/employee-pwa/src/pages/LoginPage.tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  HelpCircle,
  Shield,
  Zap,
  Globe,
  Award,
  TrendingUp
} from 'lucide-react'

import { useAuth } from '../providers/AuthProvider';
import { toast } from 'sonner';

// زر مخصص
const Button: React.FC<{
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ai' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  fullWidth?: boolean
  loading?: boolean
}> = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  fullWidth = false,
  loading = false
}) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      ai: 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white hover:opacity-90 focus:ring-purple-500',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300'
    }

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    }

    const widthClass = fullWidth ? 'w-full' : ''

    return (
      <button
        type={type}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
        onClick={onClick}
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            جاري التحميل...
          </div>
        ) : children}
      </button>
    )
  }

// بطاقة مخصصة
const Card: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

const CardContent: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showDemoCredentials, setShowDemoCredentials] = useState(false)

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password);
      // login method usually handles navigation or state update
    } catch (error) {
      toast.error('فشل تسجيل الدخول');
    }
  }

  const demoCredentials = [
    { email: 'admin@company.com', password: 'admin123', role: 'مدير النظام' },
    { email: 'hr@company.com', password: 'hr123456', role: 'موارد بشرية' },
    { email: 'employee@company.com', password: 'emp12345', role: 'موظف' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 animate-pulse">
        <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
      </div>
      <div className="absolute top-40 right-32 animate-pulse delay-1000">
        <div className="h-6 w-6 bg-purple-500 rounded-full"></div>
      </div>
      <div className="absolute bottom-32 left-40 animate-pulse delay-500">
        <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          {/* Company Logo */}
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg"
            >
              <Brain className="h-8 w-8 text-white" />
            </motion.div>
            <div className="text-right">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                AI HR Platform
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-gray-600 font-medium"
              >
                منصة الموارد البشرية الذكية
              </motion.p>
            </div>
          </div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">مرحباً بك في المنصة الذكية</h2>
            <p className="text-gray-600 text-sm">سجل دخولك للوصول إلى أدوات التطوير المهني المدعومة بالذكاء الاصطناعي</p>
          </motion.div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
        >
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6" />
                  <span className="font-medium">تسجيل الدخول الآمن</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Zap className="h-4 w-4" />
                  <span>مدعوم بالذكاء الاصطناعي</span>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pr-10 pl-12 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="example@company.com"
                      dir="ltr"
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pr-10 pl-12 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="••••••••"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={showPassword ? 'eye-off' : 'eye'}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </button>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <Button
                    type="submit"
                    variant="ai"
                    fullWidth
                    size="lg"
                    className="mt-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <span>الانتقال لتسجيل الدخول</span>
                      <ArrowLeft className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </motion.div>

                {/* Help Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="text-center space-y-2"
                >
                  <button
                    type="button"
                    onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 mx-auto"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>عرض بيانات الدخول التجريبية</span>
                  </button>

                  <AnimatePresence>
                    {showDemoCredentials && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-blue-50 rounded-lg p-4 border border-blue-200 overflow-hidden"
                      >
                        <p className="text-xs text-blue-800 mb-2 font-medium">بيانات الدخول التجريبية:</p>
                        <div className="space-y-1 text-xs">
                          {demoCredentials.map((cred, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-blue-700">{cred.role}:</span>
                              <div className="text-left">
                                <div className="text-blue-900 font-mono">{cred.email}</div>
                                <div className="text-blue-600 font-mono">{cred.password}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-center space-y-2"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>النسخة 1.0.0</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              <span>نظام تجريبي</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>مدعوم بالذكاء الاصطناعي</span>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            منصة ذكية لإدارة الموارد البشرية وتطوير المهارات
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginPage