// apps/employee-pwa/src/modules/tasks/pages/TasksPage.tsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useEmployeeStore } from '../../../store/employee.store'
import { employeeService } from '@hr/services'
import { useAuth } from '../../../providers/AuthProvider'

import {
  Calendar,
  Clock,
  CheckCircle,
  Target,
  AlertTriangle,
  TrendingUp,
  Filter,
  Search,
  BarChart3,
  FileText,
  Download,
  Package
} from 'lucide-react'

const Button: React.FC<{
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ai' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  leftIcon?: React.ReactNode
  fullWidth?: boolean
}> = ({ children, variant = 'primary', size = 'md', className = '', onClick, leftIcon, fullWidth }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    ai: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:opacity-90 focus:ring-purple-500',
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
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      onClick={onClick}
    >
      {leftIcon && <span className="ml-2">{leftIcon}</span>}
      {children}
    </button>
  )
}

const Badge: React.FC<{
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'neutral' | 'success' | 'danger' | 'warning'
  className?: string
}> = ({ children, variant = 'neutral', className = '' }) => {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-700 border-blue-300',
    secondary: 'bg-gray-100 text-gray-700 border-gray-300',
    neutral: 'bg-gray-100 text-gray-700 border-gray-300',
    success: 'bg-green-100 text-green-700 border-green-300',
    danger: 'bg-red-100 text-red-700 border-red-300',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-300'
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}

// Map Backend Status to UI Status
const getStatusConfig = (status: string = '') => {
  const normStatus = status.toLowerCase()
  switch (normStatus) {
    case 'completed':
    case 'done':
      return { value: 'completed', label: 'مكتمل', color: 'bg-green-100 text-green-700 border-green-300' }
    case 'in_progress':
      return { value: 'in-progress', label: 'قيد التنفيذ', color: 'bg-blue-100 text-blue-700 border-blue-300' }
    case 'pending':
    default:
      return { value: 'todo', label: 'قيد الانتظار', color: 'bg-gray-100 text-gray-700 border-gray-300' }
  }
}

const formatDate = (dateString: string | Date, format: string = 'dd/MM/yyyy'): string => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '—'

  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  return format === 'dd/MM/yyyy'
    ? `${day}/${month}/${year}`
    : format === 'dd/MM'
      ? `${day}/${month}`
      : dateString.toString()
}

const TasksPage: React.FC = () => {
  const { user } = useAuth()
  const { tasks, setTasks, completeTask, deleteTask } = useEmployeeStore()
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [isLoading, setIsLoading] = useState(false)

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      if (user?.id) {
        setIsLoading(true)
        try {
          const response: any = await employeeService.getTasks(user.id)

          let taskList: any[] = []

          // Identify tasks array across different possible JSend/Direct formats
          if (Array.isArray(response)) {
            taskList = response
          } else if (response?.status === 'success' && Array.isArray(response.data)) {
            taskList = response.data
          } else if (response?.data && Array.isArray(response.data.tasks)) {
            taskList = response.data.tasks
          } else if (response && Array.isArray(response.tasks)) {
            taskList = response.tasks
          }

          if (taskList.length >= 0 && (Array.isArray(response) || response?.status === 'success' || taskList.length > 0)) {
            // Defensively parse attachments and other potential string fields
            const sanitizedTasks = taskList.map(t => ({
              ...t,
              attachments: typeof t.attachments === 'string' ? JSON.parse(t.attachments || '[]') : (t.attachments || [])
            }))
            setTasks(sanitizedTasks)
          } else {
            console.error('[TasksPage] Unrecognized task data format:', response)
            setTasks([])
          }
        } catch (error) {
          console.error('[TasksPage] Failed to fetch tasks', error)
          setTasks([])
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchTasks()
  }, [user?.id, setTasks])


  const filteredTasks = Array.isArray(tasks) ? tasks.filter(task => {
    const s = task.status?.toLowerCase() || ''
    const isCompleted = s === 'completed' || s === 'done'
    const matchesFilter = filter === 'all' ||
      (filter === 'pending' && !isCompleted) ||
      (filter === 'completed' && isCompleted)

    // Safety check for title/description
    const title = task.title || ''
    const description = task.description || ''

    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  }) : []

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getProgressStats = () => {
    if (!Array.isArray(tasks)) {
      return { total: 0, completed: 0, inProgress: 0, pending: 0, completionRate: 0 }
    }
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'completed' || t.status === 'done').length
    const inProgress = tasks.filter(t => t.status === 'in_progress').length
    const pending = tasks.filter(t => t.status === 'pending').length

    return {
      total,
      completed,
      inProgress,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  const stats = getProgressStats()

  const handleStartTask = async (taskId: string) => {
    if (user?.id) {
      try {
        await employeeService.updateTask(user.id, taskId, { status: 'in_progress', progress: 10 })
        // Update local state
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'in_progress', progress: 10 } : t))
      } catch (error) {
        console.error('Failed to start task', error)
      }
    }
  }

  const handleProgress = async (taskId: string, currentProgress: number) => {
    if (user?.id) {
      const nextProgress = Math.min((currentProgress || 0) + 10, 100)
      try {
        await employeeService.updateTask(user.id, taskId, { progress: nextProgress })
        // Update local state
        setTasks(tasks.map(t => t.id === taskId ? { ...t, progress: nextProgress } : t))
        if (nextProgress === 100) {
          handleComplete(taskId)
        }
      } catch (error) {
        console.error('Failed to update progress', error)
      }
    }
  }

  const handleComplete = async (taskId: string) => {
    if (user?.id) {
      try {
        await employeeService.completeTask(user.id, taskId)
        completeTask(taskId)
      } catch (error) {
        console.error('Failed to complete task', error)
      }
    }
  }

  const handleDelete = async (taskId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المهمة؟')) return
    if (user?.id) {
      try {
        await employeeService.deleteTask(user.id, taskId)
        deleteTask(taskId)
      } catch (error) {
        console.error('Failed to delete task', error)
      }
    }
  }

  const kanbanColumns = [
    {
      id: 'pending',
      title: 'قائمة الانتظار',
      color: 'bg-gray-50',
      tasks: filteredTasks.filter(t => {
        const s = t.status?.toLowerCase() || ''
        return s === 'pending' || s === 'todo'
      })
    },
    {
      id: 'in_progress',
      title: 'قيد التنفيذ',
      color: 'bg-blue-50',
      tasks: filteredTasks.filter(t => t.status?.toLowerCase() === 'in_progress')
    },
    {
      id: 'completed',
      title: 'مكتملة',
      color: 'bg-green-50',
      tasks: filteredTasks.filter(t => {
        const s = t.status?.toLowerCase() || ''
        return s === 'completed' || s === 'done'
      })
    }
  ]

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-4 sm:p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">مركز المهام</h1>
            <p className="text-gray-600">إدارة مهامك اليومية بكفاءة واحترافية</p>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[
            {
              value: stats.total,
              label: 'إجمالي المهام',
              icon: Target,
              color: 'text-blue-600',
              bgFrom: 'from-blue-50',
              bgTo: 'to-blue-100'
            },
            {
              value: stats.completed,
              label: 'مكتملة',
              icon: CheckCircle,
              color: 'text-green-600',
              bgFrom: 'from-green-50',
              bgTo: 'to-green-100'
            },
            {
              value: stats.inProgress,
              label: 'قيد التنفيذ',
              icon: Clock,
              color: 'text-yellow-600',
              bgFrom: 'from-yellow-50',
              bgTo: 'to-yellow-100'
            },
            {
              value: `${stats.completionRate}%`,
              label: 'معدل الإكمال',
              icon: TrendingUp,
              color: 'text-purple-600',
              bgFrom: 'from-purple-50',
              bgTo: 'to-purple-100'
            }
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.bgFrom} ${stat.bgTo} rounded-xl p-3 sm:p-4`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs sm:text-sm text-gray-700">{stat.label}</p>
                </div>
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 opacity-80" />
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن مهمة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          <div className="flex gap-2">
            {[
              { value: 'all', label: 'الكل', count: tasks.length },
              { value: 'pending', label: 'قيد التنفيذ', count: stats.pending + stats.inProgress },
              { value: 'completed', label: 'مكتملة', count: stats.completed }
            ].map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value as any)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${filter === filterOption.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <span>{filterOption.label}</span>
                <Badge variant="neutral" className="text-xs">
                  {filterOption.count}
                </Badge>
              </button>
            ))}
          </div>

          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tasks Display */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10">تحميل المهام...</div>
          ) : filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center"
            >
              <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                لا توجد مهام
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? 'لا توجد مهام تطابق بحثك'
                  : filter === 'completed'
                    ? 'لم تكمل أي مهام بعد'
                    : 'جميع مهامك مكتملة! سيظهر أي تكليف جديد هنا.'
                }
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task, index) => {
              const status = task.status?.toLowerCase() || ''
              const statusConfig = getStatusConfig(status)
              const isCompleted = status === 'completed' || status === 'done'
              const isPending = status === 'pending' || status === 'todo'
              const isInProgress = status === 'in_progress'

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`shadow-md hover:shadow-lg transition-all duration-200 rounded-xl bg-white ${isCompleted ? 'opacity-90' : ''
                    }`}>
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge
                              variant={statusConfig.color.includes('blue') ? 'primary' :
                                statusConfig.color.includes('green') ? 'success' : 'neutral'}
                              className="px-3 py-1"
                            >
                              {statusConfig.label}
                            </Badge>

                            {task.priority && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                {task.priority === 'high' ? 'عالي' : task.priority === 'medium' ? 'متوسط' : 'منخفض'}
                              </span>
                            )}
                          </div>

                          {task.project && (
                            <span className="text-xs font-bold text-primary-600 mb-1 block">
                              مشروع: {task.project.name}
                            </span>
                          )}

                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                            {task.title}
                          </h3>

                          <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">
                            {task.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>استحقاق: {formatDate(task.dueDate, 'dd/MM/yyyy')}</span>
                            </div>

                            {task.estimatedTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span>الوقت المقدر: {task.estimatedTime} {
                                  (task as any).estimatedTimeUnit === 'DAYS' ? 'أيام' :
                                    (task as any).estimatedTimeUnit === 'WEEKS' ? 'أسابيع' :
                                      (task as any).estimatedTimeUnit === 'MONTHS' ? 'أشهر' : 'ساعة'
                                }</span>
                              </div>
                            )}
                          </div>

                          {isInProgress && (
                            <div className="mt-4">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-blue-600">التقدم</span>
                                <span className="text-xs font-medium text-blue-600">{task.progress || 10}%</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${task.progress || 10}%` }}
                                  className="bg-blue-600 h-full rounded-full"
                                />
                              </div>
                            </div>
                          )}

                          {/* Attachments Section */}
                          {task.attachments && task.attachments.length > 0 && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                              <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-2">
                                <Package className="h-3 w-3" />
                                المرفقات ({task.attachments.length})
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {task.attachments.map((file: any, i: number) => {
                                  const isString = typeof file === 'string';
                                  const url = isString ? file : file.url;
                                  let name = isString ? `مرفق ${i + 1}` : file.name || `مرفق ${i + 1}`;

                                  // Fix UTF-8 encoding for Arabic filenames (for old attachments)
                                  if (!isString && file.name) {
                                    try {
                                      // Check if the name contains mojibake characters
                                      if (/[þÃ]/.test(file.name)) {
                                        // Decode from Latin1 to UTF-8
                                        const bytes = new Uint8Array(file.name.split('').map((c: string) => c.charCodeAt(0)));
                                        name = new TextDecoder('utf-8').decode(bytes);
                                      }
                                    } catch (e) {
                                      console.warn('Failed to decode filename:', e);
                                    }
                                  }

                                  return (
                                    <a
                                      key={i}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-300 transition-all group"
                                    >
                                      <FileText className="h-3.5 w-3.5 text-blue-500" />
                                      <span>{name}</span>
                                      <Download className="h-3 w-3 text-gray-400 group-hover:text-blue-500" />
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 self-end sm:self-auto min-w-[100px]">
                          {isPending && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleStartTask(task.id)}
                              leftIcon={<Clock className="h-4 w-4" />}
                              className="w-full"
                            >
                              بدء المهمة
                            </Button>
                          )}
                          {isInProgress && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleProgress(task.id, task.progress || 0)}
                              leftIcon={<TrendingUp className="h-4 w-4" />}
                              className="w-full bg-blue-500"
                            >
                              تقدم
                            </Button>
                          )}
                          {!isCompleted && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleComplete(task.id)}
                              leftIcon={<CheckCircle className="h-4 w-4" />}
                              className="w-full"
                            >
                              إكمال
                            </Button>
                          )}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(task.id)}
                            leftIcon={<AlertTriangle className="h-4 w-4" />}
                            className="w-full bg-red-100 text-red-700 hover:bg-red-200"
                          >
                            حذف
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {kanbanColumns.map((column) => (
            <div key={column.id} className={`${column.color} rounded-2xl p-3 sm:p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{column.title}</h3>
                <Badge variant="neutral">{column.tasks.length}</Badge>
              </div>

              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <div key={task.id} className="shadow-sm hover:shadow-md transition-shadow bg-white rounded-lg">
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2">{task.title}</h4>
                        {task.priority === 'high' && (
                          <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(task.dueDate, 'dd/MM')}</span>
                        </div>

                        {!(task.status?.toLowerCase() === 'completed' || task.status?.toLowerCase() === 'done') && (
                          <button
                            onClick={() => handleComplete(task.id)}
                            className="text-green-600 hover:text-green-800 p-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TasksPage