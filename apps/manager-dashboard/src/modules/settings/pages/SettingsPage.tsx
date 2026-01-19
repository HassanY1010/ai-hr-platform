import React, { useState, useCallback, useMemo, Suspense, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@hr/ui'
import { settingsService, fileService } from '@hr/services'
import { toast } from 'sonner'
import {
  User,
  Bell,
  Save,
  Globe,
  Moon,
  Sun,
  Palette,
  RefreshCw,
  CheckCircle,
  Camera,
  Edit3,
  Check
} from 'lucide-react'

// ==================== أنواع TypeScript محسنة ====================

interface CardProps {
  children: React.ReactNode
  className?: string
}

interface CardHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ai' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: React.ReactNode
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  dir?: 'rtl' | 'ltr'
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode
}

interface SwitchProps {
  checked: boolean
  onChange: () => void
  className?: string
}

// ==================== المكونات الأساسية ====================

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

const CardHeader: React.FC<CardHeaderProps> = ({ title, description, action }) => {
  return (
    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  )
}

const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  leftIcon,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 dark:bg-gray-500 dark:hover:bg-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600',
    ai: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:opacity-90 focus:ring-purple-500',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-300',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-300'
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2'
  }

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span>{leftIcon}</span>}
      {children}
    </button>
  )
}





const Input: React.FC<InputProps> = ({
  value,
  onChange,
  type = 'text',
  placeholder = '',
  className = '',
  disabled = false,
  dir = 'rtl',
  ...props
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      dir={dir}
      className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 outline-none transition-all text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${className}`}
      {...props}
    />
  )
}

const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder = '',
  className = '',
  disabled = false,
  rows = 3,
  ...props
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 outline-none transition-all text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${className}`}
      {...props}
    />
  )
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  className = '',
  disabled = false,
  children,
  ...props
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 outline-none transition-all text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, className = '' }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
        } ${className}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
          }`}
      />
    </button>
  )
}

// ==================== المكونات الفرعية (خارج المكون الرئيسي) ====================

const ProfileSettings: React.FC<{
  data: any
  onUpdate: (data: any) => void
}> = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(data)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEditedData(data)
  }, [data])

  const handleSaveProfile = useCallback(() => {
    onUpdate(editedData)
    setIsEditing(false)
  }, [editedData, onUpdate])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const response = await fileService.upload(file, 'avatars')
      if (response.data && response.data.url) {
        setEditedData({ ...editedData, avatar: response.data.url })
        // If not in editing mode, update immediately via parent
        if (!isEditing) {
          onUpdate({ ...data, avatar: response.data.url })
        }
        toast.success('تم رفع الصورة بنجاح')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('فشل رفع الصورة')
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader
          title="الملف الشخصي"
          description="إدارة معلوماتك الشخصية وصورة الملف"
          action={
            <Button
              variant={isEditing ? "outline" : "primary"}
              onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <Check className="h-4 w-4 ml-1" />
                  حفظ
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4 ml-1" />
                  تعديل
                </>
              )}
            </Button>
          }
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">صورة الملف الشخصي</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden shadow-inner border-4 border-white dark:border-gray-800">
                  {(isEditing ? editedData.avatar : data.avatar) ? (
                    <img src={isEditing ? editedData.avatar : data.avatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    (isEditing ? editedData.name : data.name).charAt(0)
                  )}
                </div>
                <div>
                  <Button variant="outline" leftIcon={<Camera className="h-4 w-4" />} onClick={() => fileInputRef.current?.click()}>
                    تغيير الصورة
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">الصيغ المقبولة: JPG, PNG • الحد الأقصى: 2MB</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">الاسم الكامل</label>
              <Input
                value={isEditing ? editedData.name : data.name}
                onChange={(e) => isEditing && setEditedData({ ...editedData, name: e.target.value })}
                disabled={!isEditing}
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">الاسم (إنجليزي)</label>
              <Input
                value={isEditing ? editedData.nameEn : data.nameEn}
                onChange={(e) => isEditing && setEditedData({ ...editedData, nameEn: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter your name in English"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">البريد الإلكتروني</label>
              <Input
                type="email"
                value={isEditing ? editedData.email : data.email}
                onChange={(e) => isEditing && setEditedData({ ...editedData, email: e.target.value })}
                disabled={!isEditing}
                placeholder="example@company.com"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">رقم الجوال</label>
              <Input
                type="tel"
                value={isEditing ? editedData.phone : data.phone}
                onChange={(e) => isEditing && setEditedData({ ...editedData, phone: e.target.value })}
                disabled={!isEditing}
                placeholder="+966501234567"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">المسمى الوظيفي</label>
              <Input
                value={isEditing ? editedData.position : data.position}
                onChange={(e) => isEditing && setEditedData({ ...editedData, position: e.target.value })}
                disabled={!isEditing}
                placeholder="مثال: مدير عمليات الموارد البشرية"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">القسم</label>
              <Select
                value={isEditing ? editedData.department : data.department}
                onChange={(e) => isEditing && setEditedData({ ...editedData, department: e.target.value })}
                disabled={!isEditing}
              >
                <option value="الإدارة">الإدارة</option>
                <option value="التطوير">التطوير</option>
                <option value="التسويق">التسويق</option>
                <option value="الدعم">الدعم</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">الموقع</label>
              <Input
                value={isEditing ? editedData.location : data.location}
                onChange={(e) => isEditing && setEditedData({ ...editedData, location: e.target.value })}
                disabled={!isEditing}
                placeholder="الرياض، جدة، الدمام"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">نبذة شخصية</label>
              <Textarea
                value={isEditing ? editedData.bio : data.bio}
                onChange={(e) => isEditing && setEditedData({ ...editedData, bio: e.target.value })}
                disabled={!isEditing}
                rows={3}
                placeholder="اكتب نبذة قصيرة عن نفسك"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const CompanySettings: React.FC<{
  data: any
  onUpdate: (data: any) => void
}> = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(data)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEditedData(data)
  }, [data])

  const handleSaveCompany = useCallback(() => {
    onUpdate(editedData)
    setIsEditing(false)
  }, [editedData, onUpdate])

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const response = await fileService.upload(file, 'logos')
      if (response.data && response.data.url) {
        setEditedData({ ...editedData, logo: response.data.url })
        // Update immediately
        if (!isEditing) {
          onUpdate({ ...data, logo: response.data.url })
        }
        toast.success('تم رفع الشعار بنجاح')
      }
    } catch (error) {
      console.error('Logo upload failed:', error)
      toast.error('فشل رفع الشعار')
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader
          title="معلومات الشركة"
          description="إدارة الملف التجاري لشركتك"
          action={
            <Button
              variant={isEditing ? "outline" : "primary"}
              onClick={isEditing ? handleSaveCompany : () => setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <Check className="h-4 w-4 ml-1" />
                  حفظ
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4 ml-1" />
                  تعديل
                </>
              )}
            </Button>
          }
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">شعار الشركة</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleLogoChange}
                  accept="image/*"
                />
                <div className="h-20 w-32 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden shadow-sm">
                  {(isEditing ? editedData.logo : data.logo) ? (
                    <img src={isEditing ? editedData.logo : data.logo} alt="Logo" className="h-16 object-contain" />
                  ) : (
                    <Globe className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <Button variant="outline" size="sm" leftIcon={<Camera className="h-4 w-4" />} onClick={() => fileInputRef.current?.click()}>
                  رفع شعار جديد
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">اسم الشركة</label>
              <Input
                value={isEditing ? editedData.name : data.name}
                onChange={(e) => isEditing && setEditedData({ ...editedData, name: e.target.value })}
                disabled={!isEditing}
                placeholder="أدخل اسم الشركة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">الموقع الإلكتروني</label>
              <Input
                value={isEditing ? editedData.website : data.website}
                onChange={(e) => isEditing && setEditedData({ ...editedData, website: e.target.value })}
                disabled={!isEditing}
                placeholder="www.company.com"
                dir="ltr"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">عنوان المقر الرئيسي</label>
              <Input
                value={isEditing ? editedData.address : data.address}
                onChange={(e) => isEditing && setEditedData({ ...editedData, address: e.target.value })}
                disabled={!isEditing}
                placeholder="أدخل عنوان مقر الشركة"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const NotificationSettings: React.FC<{
  data: any
  onUpdate: (data: any) => void
}> = ({ data, onUpdate }) => {
  const [settings, setSettings] = useState(data)

  useEffect(() => {
    setSettings(data)
  }, [data])

  const handleToggle = useCallback((key: string) => {
    const newSettings = { ...settings, [key]: !settings[key] }
    setSettings(newSettings)
    onUpdate(newSettings)
  }, [settings, onUpdate])

  const notificationLabels = {
    newApplications: 'طلبات التوظيف الجديدة',
    deadlineReminders: 'تذكيرات المواعيد النهائية',
    systemAlerts: 'تنبيهات النظام',
    emailNotifications: 'إشعارات البريد الإلكتروني'
  }

  const notificationDescriptions = {
    newApplications: 'إشعارات عند تقدم مرشحين جدد لوظائفك',
    deadlineReminders: 'تذكيرات بالمواعيد النهائية للمهام والمشاريع',
    systemAlerts: 'تنبيهات مهمة من نظام إدارة الموارد البشرية',
    emailNotifications: 'تلقي جميع الإشعارات عبر البريد الإلكتروني'
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader
          title="الإشعارات"
          description="تخصيص تنبيهات النظام والبريد الإلكتروني"
        />
        <CardContent>
          <div className="space-y-4">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {notificationLabels[key as keyof typeof notificationLabels]}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {notificationDescriptions[key as keyof typeof notificationDescriptions]}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={value as boolean}
                  onChange={() => handleToggle(key)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


    </div>
  )
}

const AppearanceSettings: React.FC<{
  data: any
  onUpdate: (data: any) => void
}> = ({ data, onUpdate }) => {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    onUpdate({ ...data, theme: newTheme })
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader
          title="المظهر"
          description="تخصيص مظهر التطبيق والسمات"
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                }`}
            >
              <div className="bg-white h-20 w-full rounded-lg mb-3 shadow-inner flex items-center justify-center">
                <Sun className="h-8 w-8 text-orange-500" />
              </div>
              <span className="font-medium text-gray-900 dark:text-white">وضع النهار</span>
            </button>

            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                }`}
            >
              <div className="bg-gray-900 h-20 w-full rounded-lg mb-3 shadow-inner flex items-center justify-center">
                <Moon className="h-8 w-8 text-blue-400" />
              </div>
              <span className="font-medium text-gray-900 dark:text-white">وضع الليل</span>
            </button>

            <button
              onClick={() => handleThemeChange('system')}
              className={`p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                }`}
            >
              <div className="bg-gradient-to-r from-white to-gray-900 h-20 w-full rounded-lg mb-3 shadow-inner flex items-center justify-center">
                <Globe className="h-8 w-8 text-gray-400" />
              </div>
              <span className="font-medium text-gray-900 dark:text-white">حسب النظام</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// SecuritySettings component removed

// ==================== المكون الرئيسي ====================

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  // بيانات الإعدادات
  const [profileData, setProfileData] = useState({
    id: '',
    name: '',
    nameEn: '',
    email: '',
    phone: '',
    position: '',
    department: 'الإدارة',
    location: 'الرياض',
    bio: '',
    avatar: null as string | null,
    settings: {} as any
  })

  const [companyData, setCompanyData] = useState({
    name: '',
    logo: '',
    address: '',
    website: '',
    settings: {} as any
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [user, companyRes] = await Promise.all([
          settingsService.getCurrentUser(),
          settingsService.getCompany()
        ]);

        setProfileData({
          id: user.id || '',
          name: user.name || '',
          nameEn: user.nameEn || '',
          email: user.email || '',
          phone: user.phone || '',
          position: user.employee?.position || 'مدير',
          department: user.employee?.department || 'الإدارة',
          location: user.location || 'الرياض',
          bio: user.bio || '',
          avatar: user.avatar || null,
          settings: user.settings || {}
        });

        if (companyRes?.company) {
          const c = companyRes.company;
          setCompanyData({
            name: c.name || '',
            logo: c.logo || '',
            address: c.address || '',
            website: c.website || '',
            settings: c.settings || {}
          });
        } else if (companyRes) {
          setCompanyData({
            name: companyRes.name || '',
            logo: companyRes.logo || '',
            address: companyRes.address || '',
            website: companyRes.website || '',
            settings: companyRes.settings || {}
          });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast.error('فشل تحميل الإعدادات');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleProfileUpdate = async (newData: any) => {
    setIsSaving(true);
    try {
      await settingsService.updateProfile(newData);
      setProfileData(newData);
      toast.success('تم تحديث الملف الشخصي بنجاح');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      toast.error('فشل تحديث الملف الشخصي');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompanyUpdate = async (newData: any) => {
    setIsSaving(true);
    try {
      await settingsService.updateCompany(newData);
      setCompanyData(newData);
      toast.success('تم تحديث معلومات الشركة بنجاح');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      toast.error('فشل تحديث معلومات الشركة');
    } finally {
      setIsSaving(false);
    }
  };

  const [notificationSettings, setNotificationSettings] = useState({
    newApplications: false,
    deadlineReminders: true,
    systemAlerts: true,
    emailNotifications: true
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'ar',
    timezone: 'Asia/Riyadh',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h',
    currency: 'SAR',
    notificationsSound: true,
    animations: true
  })

  // تعريف أقسام الإعدادات للملاحة
  const sections = useMemo(() => [
    {
      id: 'profile',
      title: 'الملف الشخصي',
      icon: User,
      description: 'إدارة معلوماتك الشخصية وصورة الملف'
    },
    {
      id: 'company',
      title: 'الشركة',
      icon: Globe,
      description: 'إدارة بيانات ومنشأة الشركة'
    },
    {
      id: 'notifications',
      title: 'الإشعارات',
      icon: Bell,
      description: 'تخصيص تنبيهات النظام والبريد الإلكتروني'
    },
    {
      id: 'appearance',
      title: 'المظهر',
      icon: Palette,
      description: 'تخصيص مظهر التطبيق والسمات'
    }
  ], [])

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings data={profileData} onUpdate={handleProfileUpdate} />
      case 'company':
        return <CompanySettings data={companyData} onUpdate={handleCompanyUpdate} />
      case 'notifications':
        return <NotificationSettings data={notificationSettings} onUpdate={setNotificationSettings} />
      case 'appearance':
        return <AppearanceSettings data={appearanceSettings} onUpdate={setAppearanceSettings} />
      default:
        return <div>القسم غير موجود</div>
    }
  }

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      // 1. Update Profile (including role information like position and department)
      await settingsService.updateProfile({
        name: profileData.name,
        nameEn: profileData.nameEn,
        email: profileData.email,
        phone: profileData.phone,
        bio: profileData.bio,
        avatar: profileData.avatar || undefined,
        location: profileData.location,
        position: profileData.position,
        department: profileData.department,
        settings: {
          notifications: notificationSettings,
          appearance: appearanceSettings
        }
      })

      // 2. Update Company
      await settingsService.updateCompany({
        name: companyData.name,
        address: companyData.address,
        website: companyData.website,
        logo: companyData.logo,
        settings: companyData.settings
      })

      toast.success('تم حفظ جميع الإعدادات بنجاح')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('حدث خطأ أثناء حفظ الإعدادات')
    } finally {
      setIsSaving(false)
    }
  }, [profileData, companyData, notificationSettings, appearanceSettings])

  const handleSectionChange = useCallback((sectionId: string) => {
    setActiveSection(sectionId)
  }, [])

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              الإعدادات والتفضيلات
            </motion.h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">
              تخصيص تجربة لوحة المدير حسب تفضيلاتك
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3"
          >
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">تم الحفظ</span>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="primary"
              leftIcon={<Save className="h-4 w-4" />}
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 sm:px-6 text-sm"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 ml-1 animate-spin" />
                  <span className="text-xs sm:text-sm">جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-1" />
                  <span className="text-xs sm:text-sm">حفظ التغييرات</span>
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <RefreshCw className="h-10 w-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-300">جاري تحميل الإعدادات...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="border-0 shadow-lg sticky top-6">
              <CardContent className="p-4">
                <div className="space-y-2">
                  {sections.map((section, index) => {
                    const Icon = section.icon
                    return (
                      <motion.button
                        key={section.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        onClick={() => handleSectionChange(section.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all text-right group ${activeSection === section.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-700'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        aria-current={activeSection === section.id ? 'page' : undefined}
                      >
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors ${activeSection === section.id
                          ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-300'
                          }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm sm:text-base ${activeSection === section.id
                            ? 'text-blue-900 dark:text-blue-200'
                            : 'text-gray-900 dark:text-white'
                            }`}>
                            {section.title}
                          </p>
                          <p className={`text-xs ${activeSection === section.id
                            ? 'text-blue-600 dark:text-blue-300'
                            : 'text-gray-500 dark:text-gray-400'
                            }`}>
                            {section.description}
                          </p>
                        </div>
                        {activeSection === section.id && (
                          <Check className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={
                  <div className="flex items-center justify-center h-64">
                    <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                  </div>
                }>
                  {renderActiveSection()}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default SettingsPage