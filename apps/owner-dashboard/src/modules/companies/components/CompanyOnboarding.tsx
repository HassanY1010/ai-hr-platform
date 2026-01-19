import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@hr/ui'
import { INDUSTRIES, COMPANY_SIZES } from '../constants'

interface CompanyOnboardingProps {
    onComplete: (data?: any) => void // Updated to accept data
}

export const CompanyOnboarding: React.FC<CompanyOnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: '',
        domain: '',
        industry: '',
        size: '',
        email: '',
        phone: '',
        location: ''
    })

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleComplete = () => {
        // Pass the form data effectively to the parent
        // We can cast it or structured it as needed by the parent
        // but the prop definition is onComplete: () => void. 
        // We should update the prop signature or assume the parent will pull data?
        // Actually, best to update the prop signature.
        // But for now, let's check how CompaniesPage uses onComplete.
        // CompaniesPage: <CompanyOnboarding onComplete={() => setShowAddModal(false)} />
        // It doesn't expect arguments!
        // So I must change the prop type here first.

        // Wait, I can't change the interface in the replacement block easily if I don't see the interface.
        // I will change the whole file content implementation to be safe, assuming the interface is at the top.
        // Actually, the previous view showed the interface at lines 6-8.

        onComplete(formData as any)
    }

    return (
        <div className="py-2">
            <div className="flex justify-between items-center mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-700 -z-10" />
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-50 dark:ring-indigo-900/30'
                            : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                            }`}
                    >
                        {s}
                    </div>
                ))}
            </div>

            <div className="min-h-[300px]">
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white text-right">المعلومات الأساسية</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">اسم الشركة</label>
                                <input
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="أدخل اسم الشركة..."
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">النطاق (Domain)</label>
                                <input
                                    value={formData.domain}
                                    onChange={(e) => handleChange('domain', e.target.value)}
                                    placeholder="company.com"
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">الصناعة</label>
                                <select
                                    value={formData.industry}
                                    onChange={(e) => handleChange('industry', e.target.value)}
                                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">اختر الصناعة...</option>
                                    {INDUSTRIES.map(ind => (
                                        <option key={ind.value} value={ind.value}>{ind.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">حجم الشركة</label>
                                <select
                                    value={formData.size}
                                    onChange={(e) => handleChange('size', e.target.value)}
                                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">اختر الحجم...</option>
                                    {COMPANY_SIZES.map(size => (
                                        <option key={size.value} value={size.value}>{size.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white text-right">معلومات الاتصال</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">البريد الإلكتروني الإداري</label>
                                <input
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    placeholder="admin@company.com"
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">رقم الهاتف</label>
                                <input
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    placeholder="+966..."
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="col-span-full space-y-2">
                                <label className="text-sm font-medium">المقر الرئيسي</label>
                                <input
                                    value={formData.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    placeholder="المدينة، الدولة"
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center text-center py-12"
                    >
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">جاهز للإضافة!</h3>
                        <p className="text-slate-500 mt-2">سيتم إرسال دعوة تلقائية للمدير الإداري فور التأكيد</p>
                    </motion.div>
                )}
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                <Button
                    variant="outline"
                    onClick={() => step > 1 ? setStep(step - 1) : onComplete(undefined)}
                    className="flex items-center gap-2"
                >
                    <ArrowRight className="w-4 h-4" />
                    {step === 1 ? 'إلغاء' : 'السابق'}
                </Button>
                <Button
                    variant="primary"
                    onClick={() => step < 3 ? setStep(step + 1) : handleComplete()}
                    className="flex items-center gap-2 bg-indigo-600"
                >
                    {step === 3 ? 'تأكيد الإضافة' : 'التالي'}
                    {step < 3 && <ArrowLeft className="w-4 h-4" />}
                </Button>
            </div>
        </div>
    )
}
