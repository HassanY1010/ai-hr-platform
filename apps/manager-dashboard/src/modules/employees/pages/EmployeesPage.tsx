
// apps/manager-dashboard/src/modules/employees/pages/EmployeesPage.tsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { employeeService } from '@hr/services'
import type { Employee as SharedEmployee } from '@hr/types'
import {
  Search,
  Filter,
  Users,
  AlertTriangle,
  Plus,
  FileSpreadsheet
} from 'lucide-react'
import { EmployeeImport } from '../components/EmployeeImport'
import { AddEmployeeModal } from '../components/AddEmployeeModal'
import { EmployeeDetailsModal } from '../components/EmployeeDetailsModal'

// UI Components (Simplified inline for brevity, in real app should be imported)
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg - white dark: bg - gray - 900 rounded - 2xl shadow - lg border border - gray - 100 dark: border - gray - 800 overflow - hidden ${className} `}>{children}</div>
)
const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p - 6 ${className} `}>{children}</div>
)
const Badge: React.FC<{ children: React.ReactNode; variant?: string; className?: string }> = ({ children, variant = 'neutral', className = '' }) => {
  const variantClasses: any = {
    primary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800',
    neutral: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700',
    ai: 'bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    outline: 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
  }
  return <span className={`inline - flex items - center px - 2.5 py - 0.5 rounded - full text - xs font - medium border ${variantClasses[variant] || variantClasses.neutral} ${className} `}>{children}</span>
}

const Button: React.FC<any> = ({ children, variant = 'primary', size = 'md', className = '', onClick, leftIcon }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200'
  const variantClasses: any = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
  }
  const sizeClasses: any = { sm: 'px-3 py-1.5 text-sm gap-1', md: 'px-4 py-2 text-sm gap-2' }
  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size]} ${className} `}>
      {leftIcon && <span>{leftIcon}</span>}
      {children}
    </button>
  )
}

// Extended Employee type for UI
interface UIEmployee extends SharedEmployee {
  name: string
  email: string
  status: 'active' | 'inactive' | 'suspended'
  performance: number
  trend: 'up' | 'down' | 'stable'
  riskLevel: 'high' | 'medium' | 'low'
  location: string
  salary: number
  aiScore: number
}

const EmployeesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [employees, setEmployees] = useState<UIEmployee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEmployee, setSelectedEmployee] = useState<UIEmployee | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    department: 'all',
    status: 'all',
    risk: 'all'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true)
      const data = await employeeService.getAllEmployees() as any[]
      const mappedEmployees: UIEmployee[] = data.map(emp => ({
        ...emp,
        name: emp.user?.name || 'مستخدم',
        email: emp.user?.email || '',
        status: emp.status || 'active',
        performance: emp.performanceScore || 85,
        trend: 'stable',
        riskLevel: (emp.riskLevel || 0) > 7 ? 'high' : (emp.riskLevel || 0) > 4 ? 'medium' : 'low',
        location: (emp as any).location || 'الرياض',
        salary: (emp as any).salary || 15000,
        aiScore: emp.performanceScore ? emp.performanceScore - 5 : 80

      }))
      setEmployees(mappedEmployees)

      // Update selectedEmployee if it exists to reflect changes immediately
      if (selectedEmployee) {
        const updatedSelected = mappedEmployees.find(e => e.id === selectedEmployee.id)
        if (updatedSelected) {
          setSelectedEmployee(updatedSelected)
        }
      }
    } catch (error) {
      console.error('Failed to fetch employees', error)
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.department || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDept = activeFilters.department === 'all' || employee.department === activeFilters.department
    const matchesStatus = activeFilters.status === 'all' || employee.status === activeFilters.status
    const matchesRisk = activeFilters.risk === 'all' || employee.riskLevel === activeFilters.risk

    return matchesSearch && matchesDept && matchesStatus && matchesRisk
  })

  // Get unique departments for filter
  const departments = Array.from(new Set(employees.map(e => e.department || 'General'))).filter(Boolean) as string[]

  const getRiskColor = (risk: string) => risk === 'high' ? 'danger' : risk === 'medium' ? 'warning' : 'success'
  const getPerformanceColor = (score: number) => score >= 80 ? 'success' : score >= 60 ? 'warning' : 'danger'

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">جاري تحميل بيانات الموظفين...</div>

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen p-4 sm:p-6 transition-colors duration-300">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">إدارة الموظفين</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">إدارة وتقييم أداء الموظفين بكفاءة واحترافية</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap relative">
            <div className="relative">
              <Button
                variant="outline"
                leftIcon={<Filter />}
                className={`px-3 ${showFilters ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                تصفية
              </Button>
              {showFilters && (
                <div className="absolute top-12 left-0 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 min-w-[240px] space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">القسم</label>
                    <select
                      value={activeFilters.department}
                      onChange={(e) => setActiveFilters({ ...activeFilters, department: e.target.value })}
                      className="w-full p-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
                    >
                      <option value="all">الكل</option>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">الحالة</label>
                    <select
                      value={activeFilters.status}
                      onChange={(e) => setActiveFilters({ ...activeFilters, status: e.target.value })}
                      className="w-full p-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
                    >
                      <option value="all">الكل</option>
                      <option value="active">نشط</option>
                      <option value="inactive">غير نشط</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">مستوى الخطورة</label>
                    <select
                      value={activeFilters.risk}
                      onChange={(e) => setActiveFilters({ ...activeFilters, risk: e.target.value })}
                      className="w-full p-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
                    >
                      <option value="all">الكل</option>
                      <option value="low">منخفض</option>
                      <option value="medium">متوسط</option>
                      <option value="high">عالي</option>
                    </select>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveFilters({ department: 'all', status: 'all', risk: 'all' })}>إعادة ضبط</Button>
                </div>
              )}
            </div>
            <Button variant="outline" leftIcon={<FileSpreadsheet />} onClick={() => setShowImport(true)} className="px-3">استيراد (Excel)</Button>
            <Button variant="primary" leftIcon={<Plus />} onClick={() => setShowAddModal(true)} className="px-4">إضافة موظف</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 sm:p-4 border border-transparent dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{employees.length}</p>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">إجمالي الموظفين</p>
              </div>
              <Users className="h-5 w-5 sm:h-8 sm:w-8 text-blue-600 opacity-80" />
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3 sm:p-4 border border-transparent dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">{employees.filter(e => e.riskLevel === 'high').length}</p>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">تحت الخطر</p>
              </div>
              <AlertTriangle className="h-5 w-5 sm:h-8 sm:w-8 text-yellow-600 opacity-80" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter & List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold dark:text-white">سجل الموظفين المسجلين</h2>
            <p className="text-sm text-gray-500">قائمة كاملة بالموظفين الذين تم إضافتهم من قبلك</p>
          </div>
          <div className="flex items-center gap-4 flex-1 max-w-md justify-end">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في الموظفين..."
                className="w-full pl-4 pr-10 py-2 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm sm:text-base"
              />
            </div>
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}><div className="h-4 w-4 grid grid-cols-2 gap-0.5"><div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div></div></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}><div className="h-4 w-4 space-y-0.5"><div className="bg-current rounded-sm h-0.5"></div><div className="bg-current rounded-sm h-0.5"></div><div className="bg-current rounded-sm h-0.5"></div></div></button>
            </div>
          </div>
        </div>


        <AnimatePresence mode="wait">
          {viewMode === 'grid' && (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredEmployees.map((employee, index) => (
                <motion.div key={employee.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}>
                  <Card className="h-full hover:shadow-lg transition-all border-0">
                    <CardContent className="p-4 sm:p-6">
                      <div className="relative flex justify-center mb-4">
                        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          {employee.name.charAt(0)}
                        </div>
                      </div>
                      <div className="text-center mb-4">
                        <h4 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">{employee.name}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{employee.position}</p>
                        <Badge variant="outline" className="mt-1 text-xs">{employee.department}</Badge>
                      </div>
                      <div className="space-y-2 sm:space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">الأداء:</span>
                          <Badge variant={getPerformanceColor(employee.performance)}>{employee.performance}%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">الخطورة:</span>
                          <Badge variant={getRiskColor(employee.riskLevel)}>{employee.riskLevel === 'high' ? 'عالي' : 'منخفض'}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedEmployee(employee)}>التفاصيل</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {viewMode === 'list' && (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-500 text-sm">
                    <th className="pb-4 font-medium p-4">الموظف</th>
                    <th className="pb-4 font-medium p-4">القسم</th>
                    <th className="pb-4 font-medium p-4">المسمى الوظيفي</th>
                    <th className="pb-4 font-medium p-4">تاريخ الانضمام</th>
                    <th className="pb-4 font-medium p-4">الأداء</th>
                    <th className="pb-4 font-medium p-4">الحالة</th>
                    <th className="pb-4 font-medium p-4">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {filteredEmployees.map((employee, index) => (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                            {employee.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{employee.name}</p>
                            <p className="text-xs text-gray-500">{employee.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{employee.department}</Badge>
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                        {employee.position}
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(employee.startDate || '').toLocaleDateString('ar-SA')}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${employee.performance >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${employee.performance}%` }} />
                          </div>
                          <span className="text-xs font-medium">{employee.performance}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={employee.status === 'active' ? 'success' : 'neutral'}>
                          {employee.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(employee)}>التفاصيل</Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showImport && (
          <EmployeeImport
            onClose={() => setShowImport(false)}
            onSuccess={() => {
              loadData(false);
            }}
          />
        )}
        {showAddModal && (
          <AddEmployeeModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              loadData(false);
            }}
          />
        )}
        {selectedEmployee && (
          <EmployeeDetailsModal
            key={selectedEmployee.id}
            employee={selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
            onSuccess={() => {
              loadData(false);
            }}
          />
        )}
      </AnimatePresence>

    </div>

  )
}

export default EmployeesPage