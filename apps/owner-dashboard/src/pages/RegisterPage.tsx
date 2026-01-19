// apps/owner-dashboard/src/pages/RegisterPage.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Card, CardHeader, CardContent, Badge } from '@hr/ui'
import { Building, User, Mail, Lock, Loader2, CheckCircle, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { mockRegister, getRoleRedirectPath } from '../shared/utils/mock-auth'
import { useNavigate } from 'react-router-dom'

const RegisterPage: React.FC = () => {
    const [companyName, setCompanyName] = useState('')
    const [managerName, setManagerName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Validation
            if (password.length < 8) {
                toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
                setIsLoading(false)
                return
            }

            if (password !== confirmPassword) {
                toast.error('كلمات المرور غير متطابقة')
                setIsLoading(false)
                return
            }

            if (!email.includes('@') || !email.includes('.')) {
                toast.error('يرجى إدخال بريد إلكتروني صحيح')
                setIsLoading(false)
                return
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Register new company and manager
            const newUser = mockRegister(companyName, managerName, email, password)

            // Store user in localStorage
            localStorage.setItem('auth_user', JSON.stringify(newUser))

            toast.success('تم إنشاء الحساب بنجاح!', {
                description: `مرحباً بك في ${companyName}`,
                duration: 3000,
            })

            // Auto-redirect to manager dashboard
            const redirectPath = getRoleRedirectPath(newUser.role)
            setTimeout(() => navigate(redirectPath), 500)
        } catch (error: any) {
            toast.error('فشل إنشاء الحساب', {
                description: error.message || 'حدث خطأ غير متوقع',
                duration: 4000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">

            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full blur-3xl animate-pulse" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 shadow-2xl">

                    {/* Header */}
                    <CardHeader className="text-center pb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mx-auto mb-4"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <Building className="w-10 h-10 text-white" />
                            </div>
                        </motion.div>

                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            إنشاء حساب جديد
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                            سجل شركتك وابدأ رحلتك الرقمية
                        </p>

                        <div className="flex justify-center gap-2 mt-4">
                            <Badge variant="secondary" className="text-xs">
                                <CheckCircle className="w-3 h-3 ml-1" />
                                تجربة مجانية 14 يوم
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleRegister} className="space-y-4">
                            {/* Company Name */}
                            <div>
                                <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    اسم الشركة
                                </label>
                                <div className="relative">
                                    <Building className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        id="companyName"
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        required
                                        className="w-full pr-12 pl-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="شركة التقنية المتقدمة"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Manager Name */}
                            <div>
                                <label htmlFor="managerName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    اسم مدير الشركة
                                </label>
                                <div className="relative">
                                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        id="managerName"
                                        type="text"
                                        value={managerName}
                                        onChange={(e) => setManagerName(e.target.value)}
                                        required
                                        className="w-full pr-12 pl-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="أحمد محمد"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    البريد الإلكتروني
                                </label>
                                <div className="relative">
                                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pr-12 pl-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="manager@company.com"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    كلمة المرور
                                </label>
                                <div className="relative">
                                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pr-12 pl-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">يجب أن تكون 8 أحرف على الأقل</p>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    تأكيد كلمة المرور
                                </label>
                                <div className="relative">
                                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full pr-12 pl-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                        جاري إنشاء الحساب...
                                    </>
                                ) : (
                                    <>
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                        إنشاء الحساب
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                لديك حساب بالفعل؟{' '}
                                <a href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                    تسجيل الدخول
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400"
                >
                    <p>© 2025 نظام القرارات الذكية للموارد البشرية</p>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default RegisterPage
