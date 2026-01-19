import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Input } from '@hr/ui'
import { Mail, Lock, Building, User, ArrowRight, Sparkles } from 'lucide-react'
import { authService } from '@hr/services'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface AuthTabsProps {
    initialMode?: 'login' | 'register'
    onToggleMode?: (mode: 'login' | 'register') => void
}

const AuthTabs: React.FC<AuthTabsProps> = ({ initialMode = 'login', onToggleMode }) => {
    const [mode, setMode] = useState<'login' | 'register'>(initialMode)
    const [view, setView] = useState<'auth' | 'forgot'>('auth')
    const [isLoading, setIsLoading] = useState(false)

    React.useEffect(() => {
        setMode(initialMode)
    }, [initialMode])
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        companyName: '',
        fullName: '',
        employeeCount: '',
        language: 'ar',
        subscriptionCode: ''
    })
    const [forgotPasswordResult, setForgotPasswordResult] = useState<{
        role: string;
        contactEmail: string | null;
        contactRole: string | null;
    } | null>(null)

    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

    const navigate = useNavigate()

    const handleModeChange = (newMode: 'login' | 'register') => {
        setMode(newMode)
        setView('auth')
        setErrors({})
        setForgotPasswordResult(null)
        onToggleMode?.(newMode)
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({})
        try {
            const result = await authService.forgotPassword(formData.email.trim())
            setForgotPasswordResult(result)
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || error.message || 'حدث خطأ ما'
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (view === 'forgot') {
            return handleForgotPassword(e)
        }
        setIsLoading(true)

        try {
            setErrors({})
            if (mode === 'login') {
                const result = await authService.login({
                    email: formData.email.trim(),
                    password: formData.password.trim(),
                    rememberMe: false
                })
                if (result.user.dashboardUrl) {
                    const dashboardUrl = new URL(result.user.dashboardUrl);
                    dashboardUrl.searchParams.set('access_token', result.token);
                    dashboardUrl.searchParams.set('user', JSON.stringify(result.user));
                    window.location.href = dashboardUrl.toString();
                }
            } else {
                console.log('--- FORM DATA SUBMISSION ---');
                console.log(JSON.stringify(formData, null, 2));
                const result = await authService.registerCompany({
                    companyName: formData.companyName.trim(),
                    email: formData.email.trim(),
                    password: formData.password.trim(),
                    fullName: formData.fullName.trim(),
                    employeeCount: parseInt(formData.employeeCount),
                    language: formData.language,
                    subscriptionCode: formData.subscriptionCode.trim()
                })
                toast.success('تم إنشاء الحساب بنجاح!')
                if (result.user.dashboardUrl) {
                    const dashboardUrl = new URL(result.user.dashboardUrl);
                    dashboardUrl.searchParams.set('access_token', result.token);
                    dashboardUrl.searchParams.set('user', JSON.stringify(result.user));
                    window.location.href = dashboardUrl.toString();
                }
            }
        } catch (error: any) {
            console.error('Auth Error Details:', error)
            const errorData = error.response?.data?.error
            const errorMessage = errorData?.message || error.message || 'حدث خطأ ما'

            // Always show toast for high visibility
            toast.error(errorMessage)

            if (errorData?.field) {
                setErrors({ [errorData.field]: errorMessage })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full">
            <div className="flex bg-indigo-50 p-1.5 rounded-2xl mb-8 border border-indigo-100/50">
                <button
                    onClick={() => handleModeChange('login')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex flex-col items-center duration-300 ${mode === 'login' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-indigo-400 hover:text-indigo-600 hover:bg-white/50'}`}
                >
                    <span>تسجيل الدخول</span>
                    <span className={`text-[10px] font-normal transition-colors ${mode === 'login' ? 'text-indigo-100' : 'text-indigo-300'}`}>موظف / مدير / مسؤول</span>
                </button>
                <button
                    onClick={() => handleModeChange('register')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex flex-col items-center duration-300 ${mode === 'register' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-indigo-400 hover:text-indigo-600 hover:bg-white/50'}`}
                >
                    <span>ابدأ الاشتراك الآن</span>
                    <span className={`text-[10px] font-normal transition-colors ${mode === 'register' ? 'text-indigo-100' : 'text-indigo-300'}`}>إنشاء حساب شركة</span>
                </button>
            </div>

            <div className="mb-8 text-center">
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                    {view === 'forgot' ? 'استعادة كلمة المرور' : (mode === 'login' ? 'تسجيل الدخول للنظام' : 'انضم إلى النخبة اليوم')}
                </h3>
                <p className="text-slate-500 text-sm font-medium">
                    {view === 'forgot' ? 'أدخل بريدك الإلكتروني لمعرفة كيفية الاستعادة' : (mode === 'login' ? 'ادخل بياناتك للوصول إلى لوحة التحكم' : 'أنشئ حساب شركتك الآن وادخل عالم الإدارة الذكية')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={view === 'forgot' ? 'forgot' : mode}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                    >
                        {view === 'forgot' ? (
                            <div className="space-y-5">
                                {forgotPasswordResult ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-4"
                                    >
                                        <div className="flex items-center gap-3 text-indigo-600">
                                            <Mail className="w-6 h-6" />
                                            <span className="font-bold">تعليمات الاستعادة</span>
                                        </div>
                                        <div className="text-slate-700 leading-relaxed">
                                            {forgotPasswordResult.role === 'EMPLOYEE' ? (
                                                <>
                                                    <p className="font-medium mb-3">عزيزي الموظف، لاستعادة كلمة المرور يرجى التواصل مع مدير شركتك مباشرة عبر بريده الإلكتروني:</p>
                                                    <div className="bg-white p-3 rounded-xl border border-indigo-200 text-center font-bold text-indigo-700 select-all">
                                                        {forgotPasswordResult.contactEmail || 'غير متوفر حالياً'}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="font-medium mb-3">عزيزي المدير، لاستعادة كلمة المرور يرجى التواصل مع صاحب النظام شخصياً عبر بريده الإلكتروني:</p>
                                                    <div className="bg-white p-3 rounded-xl border border-indigo-200 text-center font-bold text-indigo-700 select-all">
                                                        {forgotPasswordResult.contactEmail || 'admin@platform.com'}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setView('auth')
                                                setForgotPasswordResult(null)
                                            }}
                                            className="w-full h-12 rounded-xl border-indigo-200 text-indigo-600 font-bold"
                                        >
                                            العودة لتسجيل الدخول
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 block pr-1">البريد الإلكتروني</label>
                                            <div className="relative group">
                                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                <Input
                                                    required
                                                    type="email"
                                                    placeholder="name@company.com"
                                                    className="pr-12 h-13 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all rounded-xl font-semibold"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full h-13 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
                                        >
                                            {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div> : 'استعلام عن طريقة الاستعادة'}
                                        </Button>
                                        <button
                                            type="button"
                                            onClick={() => setView('auth')}
                                            className="w-full text-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                                        >
                                            العودة لتسجيل الدخول
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                {mode === 'register' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 block pr-1">اسم الشركة</label>
                                            <div className="relative group">
                                                <Building className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                <Input
                                                    required
                                                    placeholder="شركة الحلول الذكية"
                                                    className="pr-12 h-13 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all rounded-xl font-semibold"
                                                    value={formData.companyName}
                                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 block pr-1">اسم المدير المسؤول</label>
                                            <div className="relative group">
                                                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                <Input
                                                    required
                                                    placeholder="أحمد علي"
                                                    className="pr-12 h-13 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all rounded-xl font-semibold"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 block pr-1">عدد الموظفين</label>
                                                <Input
                                                    required
                                                    type="number"
                                                    placeholder="مثلاً: 50"
                                                    className="h-13 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all rounded-xl font-semibold"
                                                    value={formData.employeeCount}
                                                    onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 block pr-1">لغة النظام</label>
                                                <select
                                                    className="w-full h-13 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-4 focus:ring-indigo-500/10 transition-all rounded-xl font-semibold px-4 outline-none"
                                                    value={formData.language}
                                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                                >
                                                    <option value="ar">العربية (AR)</option>
                                                    <option value="en">English (EN)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 block pr-1">رمز الاشتراك</label>
                                            <div className="relative group">
                                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                <Input
                                                    required
                                                    placeholder="أدخل رمز الاشتراك الخاص بك"
                                                    className="pr-12 h-13 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all rounded-xl font-semibold"
                                                    value={formData.subscriptionCode}
                                                    onChange={(e) => setFormData({ ...formData, subscriptionCode: e.target.value })}
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 block pr-1">البريد الإلكتروني</label>
                                    <div className="relative group">
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <Input
                                            required
                                            type="email"
                                            placeholder="name@company.com"
                                            className={`pr-12 h-13 bg-slate-50 focus:bg-white transition-all rounded-xl font-semibold ${errors.email
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-500/10'
                                                }`}
                                            value={formData.email}
                                            onChange={(e) => {
                                                setFormData({ ...formData, email: e.target.value })
                                                if (errors.email) setErrors({ ...errors, email: undefined })
                                            }}
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1 mr-1 font-bold">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 block pr-1">كلمة المرور</label>
                                    <div className="relative group">
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <Input
                                            required
                                            type="password"
                                            placeholder="••••••••"
                                            className={`pr-12 h-13 bg-slate-50 focus:bg-white transition-all rounded-xl font-semibold ${errors.password
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-500/10'
                                                }`}
                                            value={formData.password}
                                            onChange={(e) => {
                                                setFormData({ ...formData, password: e.target.value })
                                                if (errors.password) setErrors({ ...errors, password: undefined })
                                            }}
                                        />
                                        {errors.password && (
                                            <p className="text-red-500 text-xs mt-1 mr-1 font-bold">{errors.password}</p>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isLoading}
                                    className="w-full h-14 rounded-2xl font-black text-lg mt-8 shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all transform active:scale-[0.98] group relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 border-none"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                        {isLoading ? (
                                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span>{mode === 'login' ? 'دخول آمن للنظام' : 'إنشاء حسابي الآن'}</span>
                                                {mode === 'register' ? <Sparkles className="w-6 h-6" /> : <ArrowRight className="w-5 h-5" />}
                                            </>
                                        )}
                                    </div>
                                </Button>

                                {mode === 'login' && (
                                    <div className="text-center mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setView('forgot')}
                                            className="text-sm font-black text-indigo-600 hover:text-indigo-800 transition-colors border-b-2 border-indigo-100 hover:border-indigo-600 leading-loose"
                                        >
                                            نسيت كلمة المرور؟
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </form>
        </div>
    )
}

export default AuthTabs
