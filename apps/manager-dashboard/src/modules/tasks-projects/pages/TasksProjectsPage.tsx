// TasksProjectsPage.tsx
import React, { useState, useMemo, useEffect } from 'react'
import { projectsService, tasksService, employeeService } from '@hr/services'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, Badge, Button, Modal, Input, Textarea } from '@hr/ui'
import CreateTaskModal from '../components/CreateTaskModal'
import EditTaskModal from '../components/EditTaskModal'
import EditProjectModal from '../components/EditProjectModal'
import { toast } from 'sonner'
import {
  Plus,
  Filter,
  Calendar,
  Users,
  Target,
  Clock,
  BarChart2,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Briefcase,
  MessageSquare,
  Paperclip,
  Star,
  Download,
  Search
} from 'lucide-react'
import { formatDate, formatDuration } from '@hr/utils'

interface Task {
  id: string
  title: string
  description: string
  project: string
  projectId?: string
  assignee: string
  employeeId?: string
  assigneeAvatar?: string
  priority: string // 'HIGH' | 'MEDIUM' | 'LOW' or lowercase
  status: string // 'pending' | 'in_progress' | 'review' | 'completed'
  dueDate: string
  estimatedTime: number
  estimatedTimeUnit?: string
  actualTime: number
  progress: number
  tags: string[]
  attachments: number
  comments: number
  createdAt: string
  updatedAt: string
  aiScore: number
  complexity: string // 'simple' | 'moderate' | 'complex'
  dependencies: string[]
  aiRecommendation?: string
}

interface Project {
  id: string
  name: string
  description: string
  status: string // 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD'
  progress: number
  teamSize: number
  deadline: string
  startDate: string
  budget: number
  spent: number
  priority: string // 'HIGH' | 'MEDIUM' | 'LOW'
  manager: string
  managerId?: string
  category: string
  tags: string[]
  tasksCount: number
  completedTasks: number
  riskLevel: string // 'low' | 'medium' | 'high'
  aiRecommendation: string
}

// Types for filters
type SortBy = 'createdAt' | 'dueDate' | 'priority' | 'progress'
type PriorityFilter = 'all' | 'high' | 'medium' | 'low'
type TaskStatusFilter = 'all' | Task['status']

type AssigneeFilter = 'all' | string

const TasksProjectsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'projects'>('tasks')
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'calendar'>('list')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<TaskStatusFilter>('all')
  const [filterPriority, setFilterPriority] = useState<PriorityFilter>('all')
  const [filterAssignee, setFilterAssignee] = useState<AssigneeFilter>('all')
  const [sortBy, setSortBy] = useState<SortBy>('createdAt')
  const [isLoading, setIsLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  const [showEditTaskModal, setShowEditTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [showEditProjectModal, setShowEditProjectModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [tasksData, projectsData] = await Promise.all([
        tasksService.getAll(),
        projectsService.getAll()
      ])

      // Transform tasks data to match UI interface if necessary
      // Assuming the service returns data compatible with the UI or mapping is needed
      // Here we assume direct compatibility for simplicity, or we map it
      setTasks(tasksData.map((t: any) => ({
        ...t,
        project: t.project?.name || '',
        assignee: t.employee?.user?.name || 'Unassigned',
        assigneeAvatar: t.employee?.user?.avatar,
        estimatedTimeUnit: t.estimatedTimeUnit || 'HOURS',
        attachments: t.attachments?.length || 0,
        comments: 0 // Placeholder
      })))

      setProjects(projectsData.projects.map((p: any) => ({
        ...p,
        manager: p.manager?.user?.name || 'Unassigned',
        teamSize: 0, // Placeholder
        tasksCount: p.totalTasks || 0,
        completedTasks: p.completedTasks || 0,
        category: 'General' // Placeholder
      })))
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const [employees, setEmployees] = useState<any[]>([])

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await employeeService.getAllEmployees()
        setEmployees(data)
      } catch (error) {
        console.error('Failed to load employees:', error)
      }
    }
    loadEmployees()
  }, [])
  // const categories = ['الكل', 'تطوير', 'تصميم', 'ذكاء اصطناعي', 'إدارة']



  const getPriorityVariant = (priority: string): "danger" | "warning" | "success" | "neutral" => {
    const p = priority?.toLowerCase()
    switch (p) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'neutral'
    }
  }

  const getProjectStatusVariant = (status: string): "primary" | "success" | "warning" | "neutral" => {
    const s = status?.toLowerCase()
    switch (s) {
      case 'active': return 'primary'
      case 'completed': return 'success'
      case 'planning': return 'warning'
      case 'on_hold': return 'neutral'
      default: return 'neutral'
    }
  }

  const getProjectStatusLabel = (status: string) => {
    const s = status?.toLowerCase()
    switch (s) {
      case 'active': return 'نشط'
      case 'completed': return 'مكتمل'
      case 'planning': return 'قيد التخطيط'
      case 'on_hold': return 'موقوف مؤقتاً'
      default: return status
    }
  }

  const getTaskStatusLabel = (status: string) => {
    const s = status?.toLowerCase()
    switch (s) {
      case 'pending':
      case 'todo': return 'قائمة الانتظار'
      case 'in_progress': return 'قيد التنفيذ'
      case 'review': return 'قيد المراجعة'
      case 'completed': return 'مكتمل'
      default: return status
    }
  }

  const getRiskLevelVariant = (riskLevel: string): "danger" | "warning" | "success" | "neutral" => {
    const r = riskLevel?.toLowerCase()
    switch (r) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'neutral'
    }
  }

  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === 'all' || task.status === filterStatus
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
      const matchesAssignee = filterAssignee === 'all' || task.assignee === filterAssignee

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
    })

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'priority':
          const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority?.toLowerCase()] - priorityOrder[a.priority?.toLowerCase()]
        case 'progress':
          return b.progress - a.progress
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return filtered
  }, [tasks, searchTerm, filterStatus, filterPriority, filterAssignee, sortBy])

  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.manager.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === 'all' || project.status === filterStatus
      const matchesPriority = filterPriority === 'all' || project.priority === filterPriority

      return matchesSearch && matchesStatus && matchesPriority
    })

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        case 'priority':
          const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority?.toLowerCase()] - priorityOrder[a.priority?.toLowerCase()]
        case 'progress':
          return b.progress - a.progress
        case 'createdAt':
        default:
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      }
    })

    return filtered
  }, [projects, searchTerm, filterStatus, filterPriority, sortBy])

  const handleCreateProject = async (projectData: any) => {
    try {
      setIsLoading(true)
      await projectsService.create(projectData)
      toast.success('تم إنشاء المشروع بنجاح')
      setShowCreateModal(false)
      fetchData() // Refresh data
    } catch (error) {
      console.error('Failed to create project:', error)
      toast.error('فشل في إنشاء المشروع')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المهمة؟')) return

    try {
      setIsLoading(true)
      await tasksService.delete(id)
      toast.success('تم حذف المهمة بنجاح')
      fetchData()
    } catch (error) {
      console.error('Failed to delete task:', error)
      toast.error('فشل في حذف المهمة')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المشروع؟ سيتم حذف جميع المهام المرتبطة به أيضاً.')) return

    try {
      setIsLoading(true)
      await projectsService.delete(id)
      toast.success('تم حذف المشروع بنجاح')
      fetchData()
    } catch (error) {
      console.error('Failed to delete project:', error)
      toast.error('فشل في حذف المشروع')
    } finally {
      setIsLoading(false)
    }
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
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              المهام والمشاريع
            </motion.h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">إدارة مهام الفريق والمشاريع بكفاءة واحترافية</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" leftIcon={<Filter />} className="px-4">
              تصفية
            </Button>
            <Button variant="ai" leftIcon={<BarChart2 />} className="px-4">
              تحليلات الذكاء الاصطناعي
            </Button>
            <Button
              variant="primary"
              leftIcon={<Plus />}
              onClick={() => setShowCreateModal(true)}
              className="px-6"
            >
              {activeTab === 'tasks' ? 'مهمة جديدة' : 'مشروع جديد'}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border-transparent dark:border-blue-800/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{tasks.length}</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">إجمالي المهام</p>
                </div>
                <Target className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 border-transparent dark:border-green-800/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{projects.length}</p>
                  <p className="text-sm text-green-700 dark:text-green-300">إجمالي المشاريع</p>
                </div>
                <Briefcase className="h-8 w-8 text-green-500 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10 border-transparent dark:border-yellow-800/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {tasks.length > 0
                      ? Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length)
                      : 0}%
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">متوسط تقدم المهام</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 border-transparent dark:border-purple-800/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {projects.length > 0
                      ? Math.round(projects.reduce((sum, proj) => sum + proj.progress, 0) / projects.length)
                      : 0}%
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">متوسط تقدم المشاريع</p>
                </div>
                <BarChart2 className="h-8 w-8 text-purple-500 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'tasks'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              <Target className="h-5 w-5" />
              <span>المهام</span>
              <Badge variant="neutral" className="text-xs">{tasks.length}</Badge>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'projects'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              <Briefcase className="h-5 w-5" />
              <span>المشاريع</span>
              <Badge variant="neutral" className="text-xs">{projects.length}</Badge>
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <div className="h-4 w-4 flex flex-col gap-0.5">
                <div className="h-1 w-full bg-current rounded-sm"></div>
                <div className="h-1 w-full bg-current rounded-sm"></div>
                <div className="h-1 w-full bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <div className="h-4 w-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Calendar className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={activeTab === 'tasks' ? 'ابحث في المهام...' : 'ابحث في المشاريع...'}
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TaskStatusFilter)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">كل الحالات</option>
              {activeTab === 'tasks' ? (
                <>
                  <option value="todo">قائمة الانتظار</option>
                  <option value="in_progress">قيد التنفيذ</option>
                  <option value="review">قيد المراجعة</option>
                  <option value="completed">مكتمل</option>
                </>
              ) : (
                <>
                  <option value="planning">قيد التخطيط</option>
                  <option value="active">نشط</option>
                  <option value="completed">مكتمل</option>
                  <option value="on_hold">موقوف مؤقتاً</option>
                </>
              )}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as PriorityFilter)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">كل الأولويات</option>
              <option value="high">عالية</option>
              <option value="medium">متوسطة</option>
              <option value="low">منخفضة</option>
            </select>

            {activeTab === 'tasks' && (
              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">كل المسندين</option>
                {employees.map(emp => (
                  <option key={emp.user?.name} value={emp.user?.name}>{emp.user?.name}</option>
                ))}
              </select>
            )}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt">تاريخ الإنشاء</option>
              <option value="dueDate">تاريخ الاستحقاق</option>
              <option value="priority">الأولوية</option>
              <option value="progress">التقدم</option>
            </select>

            <Button variant="outline" leftIcon={<Filter />} className="px-4">
              تصفية
            </Button>
            <Button variant="outline" leftIcon={<Download />} className="px-4">
              تصدير
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'tasks' && (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="shadow-md hover:shadow-lg transition-all duration-200 border-0 dark:bg-gray-900 dark:border dark:border-gray-800">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-6">
                          {/* Task Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge
                                variant={task.status === 'completed' ? 'success' : 'primary'}
                                className="px-2 py-1 text-xs"
                              >
                                {getTaskStatusLabel(task.status)}
                              </Badge>

                              <Badge
                                variant={getPriorityVariant(task.priority)}
                                pulse={task.priority === 'high'}
                                className="px-3 py-1"
                              >
                                {task.priority === 'high' ? 'عالي' :
                                  task.priority === 'medium' ? 'متوسط' : 'منخفض'}
                              </Badge>

                              {task.aiScore > 80 && (
                                <Badge variant="ai" className="text-xs">
                                  <Star className="h-3 w-3 ml-1" />
                                  {task.aiScore}%
                                </Badge>
                              )}

                              <span className="text-sm text-gray-500">{task.project}</span>
                            </div>

                            <h3 className="font-bold text-gray-900 text-lg mb-2">
                              {task.title}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                              {task.description}
                            </p>

                            {/* Tags */}
                            {task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-4">
                                {task.tags.map((tag) => (
                                  <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs border border-blue-200 dark:border-blue-800">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Task Details */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-gray-800">
                                  {task.assignee.charAt(0)}
                                </div>
                                <span className="text-gray-900 dark:text-gray-200 font-medium">{task.assignee}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(new Date(task.dueDate), 'dd/MM/yyyy')}</span>
                              </div>

                              {task.estimatedTime && (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {task.estimatedTime} {
                                      task.estimatedTimeUnit === 'DAYS' ? 'أيام' :
                                        task.estimatedTimeUnit === 'WEEKS' ? 'أسابيع' :
                                          task.estimatedTimeUnit === 'MONTHS' ? 'أشهر' : 'ساعات'
                                    }
                                  </span>
                                </div>
                              )}

                              {task.attachments > 0 && (
                                <div className="flex items-center gap-2">
                                  <Paperclip className="h-4 w-4" />
                                  <span>{task.attachments}</span>
                                </div>
                              )}

                              {task.comments > 0 && (
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4" />
                                  <span>{task.comments}</span>
                                </div>
                              )}
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-600 dark:text-gray-400">التقدم</span>
                                <span className="font-medium text-gray-900 dark:text-white">{task.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <motion.div
                                  className={`h-full rounded-full transition-all duration-500 ${task.priority === 'high' ? 'bg-red-500' :
                                    task.priority === 'medium' ? 'bg-yellow-500' :
                                      'bg-green-500'
                                    }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${task.progress}%` }}
                                  transition={{ duration: 1, delay: index * 0.2 }}
                                />
                              </div>
                            </div>

                            {/* AI Recommendation */}
                            {task.aiRecommendation && (
                              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  <span className="font-medium">توصية الذكاء الاصطناعي:</span> {task.aiRecommendation}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                setSelectedTask(task)
                                setShowEditTaskModal(true)
                              }}
                            >
                              <Edit className="h-4 w-4 ml-1" />
                              تعديل
                            </Button>
                            <Button variant="outline" size="sm" className="w-full">
                              <Eye className="h-4 w-4 ml-1" />
                              تفاصيل
                            </Button>
                            <div className="relative group">
                              <Button variant="ghost" size="sm" className="w-full">
                                <div className="h-4 w-4 flex flex-col gap-0.5">
                                  <div className="h-0.5 w-full bg-current rounded-full"></div>
                                  <div className="h-0.5 w-full bg-current rounded-full"></div>
                                  <div className="h-0.5 w-full bg-current rounded-full"></div>
                                </div>
                              </Button>
                              <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-100 dark:border-gray-700 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[120px]">
                                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-right">
                                  مشاركة
                                </button>
                                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-right">
                                  أرشفة
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors text-right"
                                >
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
                ))}
              </div>
            )}

            {viewMode === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {['todo', 'in_progress', 'review', 'completed'].map(status => (
                  <div key={status} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-transparent dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {getTaskStatusLabel(status)}
                      </h3>
                      <Badge variant="neutral">
                        {filteredTasks.filter(task => task.status === status).length}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {filteredTasks.filter(task => task.status === status).map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-transparent dark:border-gray-700"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success'}
                              className="text-xs"
                            >
                              {task.priority === 'high' ? 'عالي' :
                                task.priority === 'medium' ? 'متوسط' : 'منخفض'}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{task.project}</span>
                          </div>

                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">{task.title}</h4>

                          <div className="flex items-center gap-2 mb-3">
                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold ring-1 ring-white dark:ring-gray-700">
                              {task.assignee.charAt(0)}
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{task.assignee}</span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-2">
                            <span>{formatDate(new Date(task.dueDate), 'dd/MM')}</span>
                            <span>{formatDuration(task.estimatedTime)}</span>
                          </div>

                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full bg-blue-500"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'projects' && (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="shadow-md hover:shadow-lg transition-all duration-200 border-0 dark:bg-gray-900 dark:border dark:border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      {/* Project Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge
                            variant={getProjectStatusVariant(project.status)}
                            className="px-3 py-1"
                          >
                            {getProjectStatusLabel(project.status)}
                          </Badge>

                          <Badge
                            variant={getPriorityVariant(project.priority)}
                            className="px-3 py-1"
                          >
                            {project.priority === 'high' ? 'عالية' :
                              project.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                          </Badge>

                          <Badge
                            variant={getRiskLevelVariant(project.riskLevel)}
                            className="px-3 py-1"
                          >
                            {project.riskLevel === 'high' ? 'عالي' :
                              project.riskLevel === 'medium' ? 'متوسط' : 'منخفض'}
                          </Badge>

                          <span className="text-sm text-gray-500">{project.category}</span>
                        </div>

                        <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-3">
                          {project.name}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Project Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="font-semibold text-lg text-gray-900 dark:text-gray-200">{project.teamSize}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">أعضاء الفريق</p>
                          </div>

                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Target className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="font-semibold text-lg text-gray-900 dark:text-gray-200">{project.tasksCount}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">إجمالي المهام</p>
                          </div>

                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <CheckCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="font-semibold text-lg text-gray-900 dark:text-gray-200">{project.completedTasks}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">مكتملة</p>
                          </div>

                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="font-semibold text-lg text-gray-900 dark:text-gray-200">{formatDate(new Date(project.deadline), 'MMM')}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">الموعد النهائي</p>
                          </div>
                        </div>

                        {/* Manager Info */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-white dark:ring-gray-800">
                            {project.manager.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">المسؤول: <span className="text-gray-900 dark:text-gray-200 font-medium">{project.manager}</span></span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-400">التقدم العام</span>
                            <span className="font-medium text-gray-900 dark:text-white">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <motion.div
                              className={`h-3 rounded-full transition-all duration-500 ${project.progress >= 80 ? 'bg-green-500' :
                                project.progress >= 50 ? 'bg-yellow-500' :
                                  'bg-blue-500'
                                }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                            />
                          </div>
                        </div>

                        {/* Budget Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-400">الميزانية</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {(project.spent / 1000).toFixed(0)}K / {(project.budget / 1000).toFixed(0)}K
                              {project.spent > project.budget ? ' (تجاوز)' : ''}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${(project.spent / project.budget) > 0.9 ? 'bg-red-500' :
                                (project.spent / project.budget) > 0.7 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                              style={{ width: `${Math.min((project.spent / project.budget) * 100, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* AI Recommendation */}
                        {project.aiRecommendation && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              <span className="font-medium">توصية الذكاء الاصطناعي:</span> {project.aiRecommendation}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button variant="primary" size="sm" className="w-full">
                          <Eye className="h-4 w-4 ml-1" />
                          التفاصيل
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setSelectedProject(project)
                            setShowEditProjectModal(true)
                          }}
                        >
                          <Edit className="h-4 w-4 ml-1" />
                          تعديل
                        </Button>
                        <div className="relative group">
                          <Button variant="ghost" size="sm" className="w-full">
                            <div className="h-4 w-4 flex flex-col gap-0.5">
                              <div className="h-0.5 w-full bg-current rounded-full"></div>
                              <div className="h-0.5 w-full bg-current rounded-full"></div>
                              <div className="h-0.5 w-full bg-current rounded-full"></div>
                            </div>
                          </Button>
                          <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-100 dark:border-gray-700 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[120px]">
                            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-right">
                              مشاركة
                            </button>
                            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-right">
                              أرشفة
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors text-right"
                            >
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
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modals */}
      <AnimatePresence>
        {showCreateModal && (
          activeTab === 'tasks' ? (
            <CreateTaskModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              onSuccess={fetchData}
            />
          ) : (
            <Modal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              title="إنشاء مشروع جديد"
              size="lg"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  handleCreateProject({
                    name: formData.get('name'),
                    description: formData.get('description'),
                    managerId: formData.get('managerId'),
                    deadline: formData.get('deadline'),
                    budget: Number(formData.get('budget')),
                    priority: formData.get('priority'),
                    status: 'planning'
                  })
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    اسم المشروع
                  </label>
                  <Input name="name" required placeholder="أدخل اسم المشروع" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الوصف
                  </label>
                  <Textarea name="description" required placeholder="أدخل وصف المشروع" rows={3} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      مدير المشروع
                    </label>
                    <select
                      name="managerId"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-2 bg-white dark:bg-gray-800"
                    >
                      {employees.map(e => (
                        <option key={e.id} value={e.id}>{e.user?.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      الموعد النهائي
                    </label>
                    <Input name="deadline" type="date" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      الميزانية
                    </label>
                    <Input name="budget" type="number" min="0" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      الأولوية
                    </label>
                    <select
                      name="priority"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-2 bg-white dark:bg-gray-800"
                    >
                      <option value="low">منخفضة</option>
                      <option value="medium">متوسطة</option>
                      <option value="high">عالية</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'جاري الإنشاء...' : 'إنشاء المشروع'}
                  </Button>
                </div>
              </form>
            </Modal>
          )
        )}
      </AnimatePresence>

      <EditTaskModal
        isOpen={showEditTaskModal}
        onClose={() => {
          setShowEditTaskModal(false)
          setSelectedTask(null)
        }}
        task={selectedTask}
        onSuccess={fetchData}
      />

      <EditProjectModal
        isOpen={showEditProjectModal}
        onClose={() => {
          setShowEditProjectModal(false)
          setSelectedProject(null)
        }}
        project={selectedProject}
        onSuccess={fetchData}
      />
    </div>
  )
}

export default TasksProjectsPage