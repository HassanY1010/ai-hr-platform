// AlertsPage.tsx
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, Badge, Button, Modal, Input, Textarea } from '@hr/ui'
import {
  AlertTriangle,
  Bell,
  ShieldAlert,
  Zap,
  Info,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  MessageSquare,
  Settings,
  Archive,
  RefreshCw,
  Download,
  Share2,
  Brain,
  Star,
  Minus,
  Building2,
  Briefcase,
  Paperclip
} from 'lucide-react'

interface Alert {
  id: string
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  category: 'retention' | 'skills' | 'performance' | 'milestone' | 'risk' | 'opportunity'
  time: string
  suggestedActions: string[]
  status: 'pending' | 'acknowledged' | 'resolved' | 'archived'
  assignee?: string
  dueDate?: string
  aiScore: number
  aiConfidence: number
  aiRecommendation: string
  relatedData?: {
    employee?: string
    department?: string
    project?: string
    metrics?: Record<string, number>
  }
  tags: string[]
  comments: number
  attachments: number
}

interface AlertStats {
  label: string
  value: string
  icon: React.ComponentType<any>
  color: 'blue' | 'red' | 'green' | 'orange'
  trend?: 'up' | 'down' | 'stable'
  change?: string
}

// Color mapping for Tailwind classes
const statColorMap: Record<string, { bg: string, icon: string }> = {
  blue: { bg: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20', icon: 'text-blue-500 dark:text-blue-400' },
  red: { bg: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20', icon: 'text-red-500 dark:text-red-400' },
  green: { bg: 'from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20', icon: 'text-green-500 dark:text-green-400' },
  orange: { bg: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20', icon: 'text-orange-500 dark:text-orange-400' }
}

const AlertsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('pending')
  const [sortBy, setSortBy] = useState('createdAt')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'خطر الاستقالة - أحمد محمد',
      description: 'انخفاض الإنتاجية بنسبة 30% خلال الأسبوعين الماضيين مع زيادة في الإجازات المفاجئة. تحليل سلوك الموظف يشير إلى وجود توتر في علاقته مع الفريق وعدم الرضا عن الوضع الحالي.',
      priority: 'critical',
      category: 'retention',
      time: 'منذ ساعتين',
      suggestedActions: [
        'جدولة اجتماع دعم نفسي فوري مع الموظف',
        'مراجعة ضغط العمل وتوزيع المهام بشكل أكثر توازناً',
        'تقديم حوافز تطوير مهني وفرص للنمو',
        'مناقشة احتياجاته المهنية والشخصية بشكل مفتوح'
      ],
      status: 'pending',
      assignee: 'مدير الموارد البشرية',
      dueDate: '2024-01-25',
      aiScore: 92,
      aiConfidence: 0.95,
      aiRecommendation: 'يوصي بالتدخل الفوري لمنع فقدان هذا الموظف المتميز',
      relatedData: {
        employee: 'أحمد محمد',
        department: 'التطوير',
        metrics: {
          performanceDrop: 30,
          absenteeismIncrease: 40,
          satisfactionScore: 45
        }
      },
      tags: ['استقالة', 'أداء', 'رضا وظيفي'],
      comments: 3,
      attachments: 2
    },
    {
      id: '2',
      title: 'نقص مهارات حاد في فريق التصميم',
      description: 'المشاريع القادمة تتطلب مهارات تصميم ثلاثي الأبعاد وUX/UI متقدمة غير متوفرة في الفريق الحالي. تحليل المهارات يوضح فجوة كبيرة بين متطلبات المشاريع وقدرات الفريق.',
      priority: 'high',
      category: 'skills',
      time: 'منذ 5 ساعات',
      suggestedActions: [
        'بدء حملة توظيف مصمم 3D وUX/UI متخصص',
        'تسجيل الفريق الحالي في دورة مكثفة لتطوير المهارات',
        'الاستعانة بمستشار خارجي مؤقتاً لسد الفجوة',
        'إعادة هيكلة توزيع المهام حسب المهارات المتوفرة'
      ],
      status: 'pending',
      assignee: 'مدير التصميم',
      dueDate: '2024-02-01',
      aiScore: 85,
      aiConfidence: 0.88,
      aiRecommendation: 'يُوصى بالتصرف السريع لتجنب تأخير المشاريع المستقبلية',
      relatedData: {
        department: 'التصميم',
        metrics: {
          skillsGap: 65,
          projectDelayRisk: 70,
          trainingNeed: 90
        }
      },
      tags: ['مهارات', 'تدريب', 'توظيف'],
      comments: 5,
      attachments: 1
    },
    {
      id: '3',
      title: 'إتمام المرحلة الأولى بنجاح - مشروع التحول الرقمي',
      description: 'مشروع "التحول الرقمي" أتم المرحلة الأولى قبل الموعد بـ 3 أيام مع تجاوز معايير الجودة المحددة. الفريق أظهر أداءً استثنائياً و commitment عالياً.',
      priority: 'low',
      category: 'milestone',
      time: 'منذ يوم واحد',
      suggestedActions: [
        'إرسال بريد شكر وتقدير للفريق بالإنجاز',
        'صرف مكافآت أداء للمتميزين في المشروع',
        'تحديث الجدول الزمني للمرحلة القادمة مع الاستفادة من الوقت الإضافي',
        'توثيق أفضل الممارسات وتطبيقها على المشاريع الأخرى'
      ],
      status: 'acknowledged',
      assignee: 'مدير المشروع',
      aiScore: 78,
      aiConfidence: 0.82,
      aiRecommendation: 'فرصة ممتازة لتعزيز الروح المعنوية وتكرار النجاح',
      relatedData: {
        project: 'التحول الرقمي',
        metrics: {
          completionRate: 100,
          qualityScore: 95,
          timeSaving: 3
        }
      },
      tags: ['إنجاز', 'مشروع', 'جودة'],
      comments: 8,
      attachments: 3
    },
    {
      id: '4',
      title: 'تحذير من انخفاض معدل الاحتفاظ بالعملاء الجدد',
      description: 'معدل الاحتفاظ بالعملاء الجدد انخفض بنسبة 15% خلال الربع الأخير، مع زيادة في شكاوى خدمة العملاء بنسبة 25%. هذا يشير إلى مشكلة في تجربة العميل أو جودة الخدمة.',
      priority: 'high',
      category: 'performance',
      time: 'منذ 3 أيام',
      suggestedActions: [
        'إجراء تحليل شامل لشكاوى العملاء وتصنيفها',
        'تنظيم استبيان رضا العملاء للحصول على تغذية راجعة مفصلة',
        'مراجعة عمليات خدمة العملاء وإعادة تصميمها إن لزم الأمر',
        'تدريب فريق خدمة العملاء على مهارات جديدة'
      ],
      status: 'pending',
      assignee: 'مدير خدمة العملاء',
      dueDate: '2024-01-30',
      aiScore: 88,
      aiConfidence: 0.91,
      aiRecommendation: 'يجب التعامل مع هذا بسرعة لتجنب فقدان المزيد من العملاء',
      relatedData: {
        metrics: {
          retentionDrop: 15,
          complaintsIncrease: 25,
          satisfactionScore: 65
        }
      },
      tags: ['عملاء', 'رضا', 'احتفاظ'],
      comments: 6,
      attachments: 4
    }
  ])

  const alertStats: AlertStats[] = useMemo(() => [
    { label: 'تنبيهات نشطة', value: '4', icon: Bell, color: 'blue', trend: 'down', change: '-2' },
    { label: 'حرجة', value: '1', icon: ShieldAlert, color: 'red', trend: 'stable', change: '0' },
    { label: 'تم التعامل معها', value: '12', icon: CheckCircle, color: 'green', trend: 'up', change: '+5' },
    { label: 'متوسط الاستجابة', value: '2.3h', icon: Clock, color: 'orange', trend: 'up', change: '-0.5h' }
  ], [])

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical': return { variant: 'danger' as const, icon: ShieldAlert, label: 'حرج', color: 'bg-red-100 text-red-700' }
      case 'high': return { variant: 'warning' as const, icon: AlertTriangle, label: 'مرتفع', color: 'bg-yellow-100 text-yellow-700' }
      case 'medium': return { variant: 'primary' as const, icon: Zap, label: 'متوسط', color: 'bg-blue-100 text-blue-700' }
      default: return { variant: 'neutral' as const, icon: Info, label: 'معلومة', color: 'bg-gray-100 text-gray-700' }
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'retention': return 'bg-purple-100 text-purple-700'
      case 'skills': return 'bg-blue-100 text-blue-700'
      case 'milestone': return 'bg-green-100 text-green-700'
      case 'performance': return 'bg-orange-100 text-orange-700'
      case 'risk': return 'bg-red-100 text-red-700'
      case 'opportunity': return 'bg-indigo-100 text-indigo-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityBorderColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-r-red-500'
      case 'high': return 'border-r-orange-500'
      case 'medium': return 'border-r-blue-500'
      default: return 'border-r-gray-500'
    }
  }

  const filteredAlerts = useMemo(() => {
    let filtered = alerts.filter(alert => {
      const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.assignee?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPriority = filterPriority === 'all' || alert.priority === filterPriority
      const matchesCategory = filterCategory === 'all' || alert.category === filterCategory
      const matchesStatus = filterStatus === 'all' || alert.status === filterStatus

      return matchesSearch && matchesPriority && matchesCategory && matchesStatus
    })

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'dueDate':
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'aiScore':
          return b.aiScore - a.aiScore
        default:
          return 0
      }
    })

    return filtered
  }, [alerts, searchTerm, filterPriority, filterCategory, filterStatus, sortBy])

  const handleCreateAlert = () => {
    setIsLoading(true)
    setTimeout(() => {
      setShowCreateModal(false)
      setIsLoading(false)
    }, 2000)
  }

  const handleMarkAsResolved = (alertId: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === alertId ? { ...alert, status: 'resolved' } : alert
    ))
  }

  const handleArchiveAlert = (alertId: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === alertId ? { ...alert, status: 'archived' } : alert
    ))
  }

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen p-6 transition-colors duration-300">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent"
            >
              مركز التنبيهات الذكية
            </motion.h1>
            <p className="text-gray-600 mt-1">إدارة المخاطر والفرص والمراحل الانتقالية بذكاء</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" leftIcon={<Archive className="h-4 w-4" />} className="px-4">
              أرشفة الكل
            </Button>
            <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} className="px-4">
              تصدير التقرير
            </Button>
            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setShowCreateModal(true)}
              className="px-6"
            >
              تنبيه جديد
            </Button>
            <Badge variant="danger" pulse className="px-4 py-2">
              <Bell className="h-4 w-4 ml-1" />
              {alerts.filter(a => a.status === 'pending').length} تنبيهات معلقة
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {alertStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className={`border-0 bg-gradient-to-br ${statColorMap[stat.color].bg} dark:from-gray-800 dark:to-gray-900 border-transparent dark:border-gray-800`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-400">{stat.label}</p>
                      {stat.trend && stat.change && (
                        <div className="flex items-center gap-1 mt-1">
                          {stat.trend === 'up' ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : stat.trend === 'down' ? (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          ) : (
                            <Minus className="h-3 w-3 text-gray-500" />
                          )}
                          <span className={`text-xs ${stat.trend === 'up' ? 'text-green-600' :
                            stat.trend === 'down' ? 'text-red-600' :
                              'text-gray-600'
                            }`}>
                            {stat.change}
                          </span>
                        </div>
                      )}
                    </div>
                    <stat.icon className={`h-8 w-8 ${statColorMap[stat.color].icon}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في التنبيهات..."
                className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">كل الأولويات</option>
              <option value="critical">حرج</option>
              <option value="high">مرتفع</option>
              <option value="medium">متوسط</option>
              <option value="low">منخفض</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">كل الفئات</option>
              <option value="retention">الاحتفاظ</option>
              <option value="skills">المهارات</option>
              <option value="milestone">المعالم</option>
              <option value="performance">الأداء</option>
              <option value="risk">المخاطر</option>
              <option value="opportunity">الفرص</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">كل الحالات</option>
              <option value="pending">معلقة</option>
              <option value="acknowledged">تمت المراجعة</option>
              <option value="resolved">تم الحل</option>
              <option value="archived">مؤرشفة</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt">تاريخ الإنشاء</option>
              <option value="priority">الأولوية</option>
              <option value="dueDate">تاريخ الاستحقاق</option>
              <option value="aiScore">درجة الذكاء الاصطناعي</option>
            </select>

            <Button variant="outline" leftIcon={<Filter />} className="px-4">
              تصفية
            </Button>
          </div>

          {/* Bulk Actions */}
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Download />} className="px-4">
              تصدير
            </Button>
            <Button variant="outline" leftIcon={<RefreshCw />} className="px-4">
              تحديث
            </Button>
            <Button variant="outline" leftIcon={<Settings />} className="px-4">
              الإعدادات
            </Button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{alerts.filter(a => a.priority === 'critical').length}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">حرجة</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{alerts.filter(a => a.priority === 'high').length}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">مرتفعة</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{alerts.filter(a => a.priority === 'medium').length}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">متوسطة</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{alerts.filter(a => a.status === 'resolved').length}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">تم الحل</p>
          </div>
        </div>
      </motion.div>

      {/* Alerts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        {filteredAlerts.map((alert, index) => {
          const config = getPriorityConfig(alert.priority)
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="relative group"
            >
              <Card className={`shadow-md hover:shadow-lg transition-all duration-200 border-0 border-r-4 ${getPriorityBorderColor(alert.priority)} dark:bg-gray-900 dark:border dark:border-gray-800 dark:border-r-4`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    {/* Alert Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant={config.variant} className="px-3 py-1">
                          <config.icon className="h-4 w-4 ml-1" />
                          {config.label}
                        </Badge>

                        <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(alert.category)}`}>
                          {alert.category === 'retention' ? 'الاحتفاظ' :
                            alert.category === 'skills' ? 'المهارات' :
                              alert.category === 'milestone' ? 'المعالم' :
                                alert.category === 'performance' ? 'الأداء' :
                                  alert.category === 'risk' ? 'المخاطر' :
                                    alert.category === 'opportunity' ? 'الفرص' : alert.category}
                        </span>

                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.time}
                        </span>

                        {alert.aiScore > 85 && (
                          <Badge variant="ai" className="text-xs">
                            <Star className="h-3 w-3 ml-1" />
                            {alert.aiScore}%
                          </Badge>
                        )}
                      </div>

                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {alert.title}
                      </h4>

                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        {alert.description}
                      </p>

                      {/* Related Data */}
                      {alert.relatedData && (
                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            {alert.relatedData.employee && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-300">الموظف: {alert.relatedData.employee}</span>
                              </div>
                            )}
                            {alert.relatedData.department && (
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-300">القسم: {alert.relatedData.department}</span>
                              </div>
                            )}
                            {alert.relatedData.project && (
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-300">المشروع: {alert.relatedData.project}</span>
                              </div>
                            )}
                          </div>

                          {alert.relatedData.metrics && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs text-gray-600 mb-2">المقاييس:</p>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(alert.relatedData.metrics).map(([key, value]) => (
                                  <span key={key} className="px-2 py-1 bg-white rounded text-xs text-gray-700">
                                    {key}: {value}%
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* AI Recommendation */}
                      {alert.aiRecommendation && (
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1">
                            <Brain className="h-3 w-3" />
                            <span className="font-medium">توصية الذكاء الاصطناعي:</span> {alert.aiRecommendation}
                          </p>
                        </div>
                      )}

                      {/* Actions and Meta */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">الإجراءات المقترحة بالذكاء الاصطناعي:</p>
                          <div className="flex flex-wrap gap-2">
                            {alert.suggestedActions.map((action, i) => (
                              <div key={i} className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                {action}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          {alert.assignee && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{alert.assignee}</span>
                            </div>
                          )}

                          {alert.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(alert.dueDate).toLocaleDateString('ar-SA')}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{alert.comments} تعليقات</span>
                          </div>

                          {alert.attachments > 0 && (
                            <div className="flex items-center gap-1">
                              <Paperclip className="h-4 w-4" />
                              <span>{alert.attachments} مرفقات</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() => handleMarkAsResolved(alert.id)}
                        disabled={alert.status === 'resolved'}
                      >
                        <CheckCircle className="h-4 w-4 ml-1" />
                        {alert.status === 'resolved' ? 'تم الحل' : 'اتخاذ إجراء'}
                      </Button>

                      <Button variant="outline" size="sm" className="w-full">
                        <MessageSquare className="h-4 w-4 ml-1" />
                        إضافة تعليق
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleArchiveAlert(alert.id)}
                        disabled={alert.status === 'archived'}
                      >
                        <Archive className="h-4 w-4 ml-1" />
                        أرشفة
                      </Button>

                      <div className="relative group">
                        <Button variant="ghost" size="sm" className="w-full">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                        <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 border border-transparent dark:border-gray-700">
                          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-right">
                            <Edit className="h-4 w-4" />
                            تعديل
                          </button>
                          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-right">
                            <Share2 className="h-4 w-4" />
                            مشاركة
                          </button>
                          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors text-right">
                            <Trash2 className="h-4 w-4" />
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Create Alert Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <Modal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            title="إنشاء تنبيه ذكي جديد"
            size="lg"
          >
            <form onSubmit={(e) => {
              e.preventDefault()
              handleCreateAlert()
            }} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">عنوان التنبيه</label>
                  <Input
                    type="text"
                    className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                    placeholder="مثال: خطر الاستقالة - موظف في فريق التطوير"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">الأولوية</label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                    <option value="">اختر الأولوية</option>
                    <option value="critical">حرج</option>
                    <option value="high">مرتفع</option>
                    <option value="medium">متوسط</option>
                    <option value="low">منخفض</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">الفئة</label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                    <option value="">اختر الفئة</option>
                    <option value="retention">الاحتفاظ</option>
                    <option value="skills">المهارات</option>
                    <option value="milestone">المعالم</option>
                    <option value="performance">الأداء</option>
                    <option value="risk">المخاطر</option>
                    <option value="opportunity">الفرص</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">المسؤول</label>
                  <Input
                    type="text"
                    className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                    placeholder="اسم المسؤول عن التنبيه"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">الوصف</label>
                <Textarea
                  rows={4}
                  className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  placeholder="وصف مفصل للتنبيه وأسبابه..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">الإجراءات المقترحة</label>
                <Textarea
                  rows={3}
                  className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  placeholder="قائمة الإجراءات المقترحة، كل إجراء في سطر جديد..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">تاريخ الاستحقاق</label>
                  <Input
                    type="date"
                    className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">درجة الذكاء الاصطناعي</label>
                  <Input
                    type="number"
                    className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                    placeholder="85"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  type="button"
                >
                  إلغاء
                </Button>
                <Button
                  variant="ai"
                  leftIcon={<Brain className="h-4 w-4" />}
                  type="button"
                >
                  تحسين بالذكاء الاصطناعي
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'جاري الإنشاء...' : 'إنشاء التنبيه'}
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AlertsPage