// apps/owner-dashboard/src/pages/LoginPage.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Card, CardHeader, CardContent, Badge } from '@hr/ui'
import { Eye, EyeOff, Shield, Crown, Diamond, Award, Star, Globe, Lock, Mail } from 'lucide-react'

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [selectedRole, setSelectedRole] = useState<'owner' | 'investor' | 'partner'>('owner')
    const [isLoading] = useState(false)

    const handleEmailLogin = (e: React.FormEvent) => {
        e.preventDefault()
        window.location.href = 'http://localhost:3005?mode=login'
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">

            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400/30 to-amber-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-300/20 to-amber-300/20 rounded-full blur-3xl animate-pulse" />
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
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mx-auto mb-4"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg relative">
                                <Crown className="w-12 h-12 text-white" />
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-full flex items-center justify-center">
                                    <Star className="w-3 h-3 text-white" />
                                </div>
                            </div>
                        </motion.div>

                        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                            لوحة تحكم المالك
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                            نظام القرارات الذكية للموارد البشرية
                        </p>

                        {/* Features Badges */}
                        <div className="flex justify-center gap-2 mt-4 flex-wrap">
                            <Badge variant="secondary" className="text-xs">
                                <Diamond className="w-3 h-3 ml-1" />
                                إدارة عليا
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                                <Shield className="w-3 h-3 ml-1" />
                                آمن ومشفر
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {/* Role Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                نوع الحساب
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'owner', label: 'مالك', icon: Crown },
                                    { id: 'investor', label: 'مستثمر', icon: Diamond },
                                    { id: 'partner', label: 'شريك', icon: Award }
                                ].map((role) => {
                                    const Icon = role.icon
                                    return (
                                        <Button
                                            key={role.id}
                                            variant={selectedRole === role.id ? 'primary' : 'outline'}
                                            size="sm"
                                            onClick={() => setSelectedRole(role.id as any)}
                                            className="flex flex-col items-center gap-1 h-16"
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="text-xs">{role.label}</span>
                                        </Button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleEmailLogin} className="space-y-4">
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
                                        className="w-full pr-12 pl-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder={`${selectedRole}@example.com`}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    كلمة المرور
                                </label>
                                <div className="relative">
                                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pr-12 pl-12 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="rounded border-slate-300 dark:border-slate-600"
                                    />
                                    تذكرني
                                </label>
                                <a href="#" className="text-sm text-amber-600 hover:text-amber-500">
                                    نسيت كلمة المرور؟
                                </a>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                            >
                                <span className="mr-2">الانتقال لتسجيل الدخول</span>
                            </Button>
                        </form>

                        {/* Security Info */}
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    <span>مؤمن بـ SSL</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    <span>العربية (SA)</span>
                                </div>
                            </div>
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
                    <p>© 2025 نظام القرارات الذكية للموارد البشرية - لوحة تحكم المالك</p>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default LoginPage