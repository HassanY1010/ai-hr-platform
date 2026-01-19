// apps/employee-pwa/src/modules/profile/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button, Badge } from '@hr/ui'
import { useAuth } from '../../../providers/AuthProvider'
import { employeeService, fileService } from '@hr/services'
import type { User } from '@hr/types'
import { toast } from 'sonner'
import {
  LogOut,
  Globe,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Award,
  TrendingUp,
  Users,
  Briefcase,
  Edit3,
  Camera,
  Star,
  CheckCircle,
  FileText,
  ShieldAlert,
  Save,
  Zap
} from 'lucide-react'

// دالة مساعدة لتنسيق التاريخ
const formatDate = (dateString: string | Date | undefined, format: string = 'MMMM yyyy'): string => {
  if (!dateString) return '—'
  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    return '—'
  }

  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ]

  const month = months[date.getMonth()]
  const year = date.getFullYear()

  return format === 'MMMM yyyy'
    ? `${month} ${year}`
    : dateString.toString()
}

interface AuthContextType {
  user: User | null
  logout: () => void
}

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth() as AuthContextType
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [employee, setEmployee] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    bio: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [user?.id])

  const fetchProfile = async () => {
    if (user?.id) {
      if (!employee) setIsLoading(true)
      try {
        const response = await employeeService.getMe()
        if (response && response.employee) {
          setEmployee(response.employee)
          setEditForm({
            name: response.employee.user?.name || '',
            phone: (response.employee.user as any)?.phone || '',
            bio: (response.employee.user as any)?.bio || ''
          })
        }
      } catch (error) {
        console.error('Failed to fetch profile', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleUpdateProfile = async () => {
    setIsSaving(true)
    try {
      await employeeService.updateMe(editForm)
      toast.success('تم تحديث الملف الشخصي بنجاح')
      setIsEditing(false)
      await fetchProfile()
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('فشل تحديث الملف الشخصي')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار ملف صورة صحيح (JPG, PNG, etc)')
      return
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت')
      return
    }

    setIsSaving(true)
    try {
      const response = await fileService.upload(file, 'avatars')
      // Assuming response.data.url or response.url depending on API structure
      // file.service.ts returns apiClient.post result.
      // Usually apiClient returns the data directly or axios response. 
      // Let's assume standard response format.
      const url = response.data?.url || response.url || response.data;

      if (url) {
        await employeeService.updateMe({ ...editForm, avatar: url } as any)
        toast.success('تم تحديث الصورة بنجاح')
        await fetchProfile()
      } else {
        console.error('Upload failed: Unexpected response format', response);
        throw new Error('Upload failed - No URL returned from server')
      }
    } catch (error: any) {
      console.error('Avatar upload failed:', error)
      const errorMessage = error.response?.data?.message || error.message || 'فشل رفع الصورة';
      toast.error(`فشل رفع الصورة: ${errorMessage}`);
    } finally {
      setIsSaving(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // حماية الصفحة في حال عدم وجود مستخدم
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد بيانات مستخدم</h3>
          <p className="text-gray-600">يرجى تسجيل الدخول للوصول إلى الملف الشخصي</p>
        </div>
      </motion.div>
    )
  }

  const achievements = [
    {
      icon: Award,
      title: 'مساهم نشط',
      description: (employee?.stats?.streak >= 7) ? 'أكملت 7 أيام متتالية!' : 'أكمل 7 أيام لفتح هذا الوسام',
      color: (employee?.stats?.streak >= 7) ? 'text-yellow-500' : 'text-slate-300'
    },
    {
      icon: Star,
      title: 'متميز في الأداء',
      description: (employee?.performanceScore >= 90) ? 'أداء استثنائي!' : 'حافظ على أداءك فوق 90%',
      color: (employee?.performanceScore >= 90) ? 'text-blue-500' : 'text-slate-300'
    },
    {
      icon: TrendingUp,
      title: 'متعلم سريع',
      description: (employee?.stats?.trainingsCompleted >= 3) ? 'أنجزت 3 دورات!' : 'أكمل 3 دورات لفتح هذا الوسام',
      color: (employee?.stats?.trainingsCompleted >= 3) ? 'text-green-500' : 'text-slate-300'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: UserIcon },
    { id: 'performance', label: 'الأداء', icon: TrendingUp },
    { id: 'documents', label: 'المستندات', icon: FileText }
  ]

  // Display Name logic: User name from Auth or Employee.user.name
  const displayName = employee?.user?.name || user.name || '—'
  const displayEmail = employee?.user?.email || user.email || '—'
  const displayPosition = employee?.position || 'موظف'
  const displayDepartment = employee?.department || 'القسم'
  const displayJoinDate = employee?.startDate || (user as any).createdAt

  if (isLoading && !employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-4 sm:p-6 pb-24 md:pb-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-50"></div>

        <div className="relative p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Profile Picture */}
            <div className="relative group">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*"
              />
              <button
                onClick={handleAvatarClick}
                className="h-32 w-32 rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-transform duration-300 overflow-hidden"
              >
                {employee?.user?.avatar ? (
                  <img src={employee.user.avatar} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold text-white uppercase">
                    {displayName.charAt(0)}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </button>
              <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-emerald-500 border-4 border-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="h-2.5 w-2.5 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* User Info / Edit Form */}
            <div className="flex-1 text-center sm:text-right">
              {isEditing ? (
                <div className="space-y-4 max-w-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-blue-400 uppercase tracking-wider">الاسم الكامل</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        placeholder="أدخل اسمك"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-blue-400 uppercase tracking-wider">رقم الجوال</label>
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        placeholder="05xxxxxxx"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-blue-400 uppercase tracking-wider">النبذة الشخصية</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none min-h-[100px]"
                      placeholder="أخبرنا عن نفسك..."
                    />
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl shadow-lg shadow-blue-900/20"
                    >
                      {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                      <Save className="h-4 w-4 mr-2" />
                    </Button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2.5 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                      {displayName}
                    </h1>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-slate-400">
                      <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full text-sm border border-slate-700">
                        <Briefcase className="h-3.5 w-3.5 text-blue-400" />
                        {displayPosition}
                      </div>
                      <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full text-sm border border-slate-700">
                        <Users className="h-3.5 w-3.5 text-purple-400" />
                        {displayDepartment}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap justify-center sm:justify-start gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-sm shadow-xl hover:bg-blue-50 transition-all flex items-center gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      تعديل الملف
                    </button>
                    <div className="flex items-center gap-2 text-slate-500 text-sm px-4">
                      <Calendar className="h-4 w-4" />
                      انضم في {formatDate(displayJoinDate, 'MMMM yyyy')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-100">
          {Array.isArray(tabs) && tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-all flex-1 sm:flex-none min-w-[120px] justify-center ${activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <tab.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 pb-12">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <CheckCircle className="h-24 w-24 text-emerald-600" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-4xl font-black text-emerald-700 mb-1">
                      {employee?.stats?.answersCompleted || 0}
                    </p>
                    <p className="text-sm font-bold text-emerald-600/70 uppercase tracking-widest">سؤال مكتمل</p>
                    <div className="mt-4 h-1.5 w-full bg-emerald-200/50 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Briefcase className="h-24 w-24 text-blue-600" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-4xl font-black text-blue-700 mb-1">
                      {employee?.stats?.tasksCompleted || 0}
                    </p>
                    <p className="text-sm font-bold text-blue-600/70 uppercase tracking-widest">مهمة مكتملة</p>
                    <div className="mt-4 h-1.5 w-full bg-blue-200/50 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-3xl p-6 border border-purple-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Star className="h-24 w-24 text-purple-600" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-4xl font-black text-purple-700 mb-1">
                      {employee?.stats?.streak || 0}
                    </p>
                    <p className="text-sm font-bold text-purple-600/70 uppercase tracking-widest">أيام متتالية</p>
                    <div className="mt-4 h-1.5 w-full bg-purple-200/50 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements Section */}
              <div className="bg-slate-50 rounded-[2rem] p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="h-10 w-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-200">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    أوسمة الإنجاز
                  </h3>
                  <button className="text-blue-600 text-sm font-bold hover:underline">عرض الكل</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[1.5rem] p-6 text-center border border-slate-100 group"
                    >
                      <div className={`h-16 w-16 mx-auto mb-4 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <achievement.icon className={`h-8 w-8 ${achievement.color}`} />
                      </div>
                      <h4 className="font-bold text-slate-800 mb-1">{achievement.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </div>


              {/* Personal Bio / Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-blue-500" />
                    النبذة التعريفية
                  </h3>
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 text-slate-600 leading-relaxed min-h-[120px] shadow-sm">
                    {employee?.user?.bio || 'لا توجد نبذة تعريفية مضافة حالياً. يمكنك إضافة نبذة من خلال تعديل الملف الشخصي.'}
                  </div>

                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-indigo-500" />
                    معلومات الاتصال
                  </h3>
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center gap-4 group">
                      <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-all group-hover:shadow-md">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-black uppercase tracking-widest text-right">البريد الإلكتروني</p>
                        <p className="text-slate-700 font-bold">{displayEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                      <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-100 transition-all group-hover:shadow-md">
                        <Phone className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-black uppercase tracking-widest text-right">رقم الجوال</p>
                        <p className="text-slate-700 font-bold">{(employee?.user as any)?.phone || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="text-center md:text-right">
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-4 px-4 py-1.5 rounded-full backdrop-blur-md">
                      تحليل الأداء الذكي
                    </Badge>
                    <h3 className="text-4xl font-black mb-4 tracking-tight">نظرة شاملة على تميزك</h3>
                    <p className="text-slate-400 text-lg leading-relaxed">
                      بناءً على نشاطك الأخير وتفاعلك مع المنصة، أداؤك الحالي يعتبر <span className="text-emerald-400 font-bold">رائعاً جداً</span>. أنت من ضمن أفضل 10% في قسم {displayDepartment}.
                    </p>
                    <div className="mt-8 flex gap-4 justify-center md:justify-start">
                      <div className="bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-sm">
                        <TrendingUp className="h-8 w-8 text-blue-400 mb-2" />
                        <p className="text-sm font-bold opacity-60">التطور</p>
                        <p className="text-xl font-black">+12%</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-sm">
                        <Star className="h-8 w-8 text-yellow-400 mb-2" />
                        <p className="text-sm font-bold opacity-60">التقييم</p>
                        <p className="text-xl font-black">4.9/5</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="relative h-64 w-64 flex items-center justify-center">
                      <motion.svg
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: -90, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-64 w-64 transform"
                      >
                        <circle
                          cx="128"
                          cy="128"
                          r="110"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="transparent"
                          className="text-slate-700"
                        />
                        <motion.circle
                          cx="128"
                          cy="128"
                          r="110"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 110}
                          initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 110 * (1 - (employee?.performanceScore || 85) / 100) }}
                          transition={{ duration: 2, ease: "circOut", delay: 0.5 }}
                          className="text-blue-500"
                        />
                      </motion.svg>
                      <div className="absolute text-center">
                        <motion.p
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 100, delay: 1 }}
                          className="text-6xl font-black tracking-tighter"
                        >
                          {employee?.performanceScore || 85}%
                        </motion.p>
                        <p className="text-sm font-bold text-blue-400 uppercase tracking-widest mt-1">نتيجة التميز</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'الإنتاجية', value: Math.round((employee?.performanceScore || 85) * 1.1) % 100, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                  { label: 'الجودة', value: Math.round((employee?.performanceScore || 85) * 0.95), icon: Star, color: 'text-blue-500', bg: 'bg-blue-50' },
                  { label: 'الالتزام', value: Math.round((employee?.performanceScore || 85) * 1.05) % 100, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' }
                ].map((stat, i) => (
                  <div key={i} className={`${stat.bg} rounded-3xl p-6 border border-white/10 shadow-sm text-slate-800`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`h-10 w-10 ${stat.color} bg-white rounded-xl flex items-center justify-center shadow-sm`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <span className="text-2xl font-black">{stat.value}%</span>
                    </div>
                    <p className="text-sm font-bold opacity-60 m-0">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border border-slate-100 rounded-[2rem] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <ShieldAlert className="h-6 w-6 text-emerald-500" />
                    <h4 className="text-lg font-bold text-slate-800">مؤشر المخاطر والاستباقية</h4>
                  </div>
                  <p className="text-sm text-slate-500 mb-6 font-medium">هذا المؤشر يقيس مدى استمرارية أدائك واستقرارك المهني بناءً على بيانات الذكاء الاصطناعي.</p>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-slate-600">مستوى الأمان الوظيفي</span>
                        <span className="text-emerald-600">منخفض المخاطر</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${100 - (employee?.riskLevel || 15)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold mb-2">توصيات الذكاء الاصطناعي</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">لرفع مستوى أدائك إلى {Math.min((employee?.performanceScore || 85) + 5, 100)}% الشهر القادم، ننصحك بالتركيز على الدورات التدريبية المتقدمة.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden group">
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-2">خزانة المستندات</h3>
                  <p className="opacity-80 max-w-md">جميع مستنداتك القانونية، وعقودك، وشهاداتك مخزنة هنا بشكل آمن ومشفر.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2 text-center p-8 bg-white rounded-2xl border border-dashed border-gray-300">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900">لا توجد مستندات</h3>
                  <p className="text-gray-500">لم يتم رفع أي مستندات في ملفك الشخصي بعد.</p>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* Logout Footer */}
      <div className="pt-8 text-center">
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 font-bold px-6 py-3 rounded-2xl hover:bg-red-50 transition-all"
        >
          <LogOut className="h-5 w-5" />
          تسجيل الخروج من الحساب
        </button>
        <p className="text-slate-400 text-xs mt-4">
          نظام إدارة الموارد البشرية المدعوم بالذكاء الاصطناعي • النسخة 1.0.0
        </p>
      </div>
    </div>
  )
}

export default ProfilePage