import React from 'react'
import { motion } from 'framer-motion'
import { Users, Briefcase, ShieldCheck, Zap, BarChart3, Cloud } from 'lucide-react'

const features = [
    {
        title: 'لوحة تحكم الموظف',
        description: 'واجهة عصرية للموظفين لمتابعة المهام، التدريب، وطلب الإجازات بمساعدة ذكية.',
        icon: Users,
        color: 'indigo'
    },
    {
        title: 'إدارة المدير الشاملة',
        description: 'أدوات قوية للمدراء لمتابعة الأداء، التقارير الذكية، وإدارة الفرق بكفاءة.',
        icon: Briefcase,
        color: 'purple'
    },
    {
        title: 'حوكمة وحماية المالك',
        description: 'السيطرة الكاملة للمدير التنفيذي: مفتاح الإيقاف الطارئ، ميزانية الذكاء الاصطناعي، والحوكمة.',
        icon: ShieldCheck,
        color: 'red'
    },
    {
        title: 'ذكاء اصطناعي متكامل',
        description: 'تحليل السير الذاتية، التنبؤ بالترك الوظيفي، وأتمتة المهام الروتينية 30x أسرع.',
        icon: Zap,
        color: 'amber'
    },
    {
        title: 'تقارير وتحليلات متقدمة',
        description: 'حول بيانات فريقك إلى قرارات استراتيجية من خلال لوحات بيانات تفاعلية ولحظية.',
        icon: BarChart3,
        color: 'blue'
    },
    {
        title: 'سحابة آمنة وموثوقة',
        description: 'بياناتك محمية بأعلى معايير التشفير والنسخ الاحتياطي التلقائي لضمان استمرارية العمل.',
        icon: Cloud,
        color: 'emerald'
    }
]

const Features: React.FC = () => {
    return (
        <section id="features" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl font-black text-slate-900 mb-4">نظام واحد، ثلاثة عوالم متكاملة</h2>
                    <p className="text-lg text-slate-600">
                        صممنا AIHR ليلبي احتياجات كل فرد في المؤسسة، من الموظف الطموح إلى المدير المشغول والمالك الحريص.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-white hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:rotate-3 
                                    ${feature.color === 'indigo' ? 'bg-indigo-100 text-indigo-600 shadow-indigo-100 shadow-lg' :
                                        feature.color === 'purple' ? 'bg-purple-100 text-purple-600 shadow-purple-100 shadow-lg' :
                                            feature.color === 'red' ? 'bg-red-100 text-red-600 shadow-red-100 shadow-lg' :
                                                feature.color === 'amber' ? 'bg-amber-100 text-amber-600 shadow-amber-100 shadow-lg' :
                                                    feature.color === 'blue' ? 'bg-blue-100 text-blue-600 shadow-blue-100 shadow-lg' :
                                                        'bg-emerald-100 text-emerald-600 shadow-emerald-100 shadow-lg'
                                    }`}
                                >
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors uppercase">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Features
