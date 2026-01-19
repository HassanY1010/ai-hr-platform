// apps/admin-dashboard/src/modules/companies/pages/CompaniesPage.tsx
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building, Plus, Trash2, ExternalLink, TrendingUp,
  Briefcase, Star, Save, Users, Zap,
  CheckCheck, Activity
} from 'lucide-react'
import { Button, Modal, Card, CardContent } from '@hr/ui'
import { toast } from 'sonner'
import { Company } from '../types'
import { useCompaniesStore } from '../store'
import { companyService } from '@hr/services'
import {
  CompanyCard,
  CompanyTable,
  CompanyAnalytics,
  CompanyFilters,
  CompanyOnboarding,
  BulkActions
} from '../components'
import { ExportMenu, RefreshButton } from '../../../shared/components'
import { useTheme } from '@/shared/hooks/useTheme'
import { exportUtils } from '../../../shared/utils/exportUtils';

import { INDUSTRIES, COMPANY_SIZES } from '../constants'

const CompaniesPage: React.FC = () => {
  const {
    companies, loading, refreshCompanies,
    portfolioStats, fetchPortfolioAnalytics,
    aiAnalysis, isAnalyzing, analyzeCompany
  } = useCompaniesStore()
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'analytics'>('grid')
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [editForm, setEditForm] = useState<Partial<Company>>({})
  const [filters, setFilters] = useState({
    industry: 'all',
    size: 'all',
    status: 'all',
    subscription: 'all',
    dateRange: 'all'
  })
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'subscription' | 'users'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const { theme } = useTheme()

  // Enhanced filtering and sorting logic
  const filteredAndSortedCompanies = useMemo(() => {
    let filtered = companies.filter(company => {
      const matchesSearch = !searchTerm ||
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesIndustry = filters.industry === 'all' || company.industry === filters.industry
      const matchesSize = filters.size === 'all' || company.size === filters.size
      const matchesStatus = filters.status === 'all' || company.status === filters.status
      const matchesSubscription = filters.subscription === 'all' || company.subscription.plan === filters.subscription

      return matchesSearch && matchesIndustry && matchesSize && matchesStatus && matchesSubscription
    })

    // Sort companies
    return filtered.sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case 'subscription':
          aValue = a.subscription.plan
          bValue = b.subscription.plan
          break
        case 'users':
          aValue = a.userCount
          bValue = b.userCount
          break
        default:
          return 0
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [companies, searchTerm, filters, sortBy, sortOrder])

  const handleRefresh = async () => {
    await Promise.all([refreshCompanies(), fetchPortfolioAnalytics()])
  }

  React.useEffect(() => {
    handleRefresh()
  }, [])

  const handleAddCompany = () => {
    setShowAddModal(true)
  }

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company)
    setEditForm({ ...company })
    setShowEditModal(true)
  }

  const handleSaveCompany = async () => {
    if (!selectedCompany) return

    try {
      const { updateCompany } = useCompaniesStore.getState()
      await updateCompany(selectedCompany.id, editForm)
      toast.success('تم تحديث بيانات الشركة بنجاح')
      setShowEditModal(false)
    } catch (error) {
      toast.error('فشل في تحديث بيانات الشركة')
    }
  }

  const handleViewPlatform = (company: Company) => {
    if (!company.domain) {
      toast.error('لا يوجد رابط منصة لهذه الشركة')
      return
    }
    const url = company.domain.startsWith('http') ? company.domain : `https://${company.domain}`
    window.open(url, '_blank')
  }

  const handleBulkMessage = () => {
    const selected = companies.filter(c => selectedCompanies.includes(c.id))
    const emails = selected.map(c => c.contact?.email).filter(Boolean).join(',')
    if (!emails) {
      toast.error('لا توجد عناوين بريد إلكتروني للشركات المحددة')
      return
    }
    window.location.href = `mailto:?bcc=${emails}`
  }

  const handleDeleteCompany = async (companyId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الشركة؟')) return

    try {
      const { deleteCompany } = useCompaniesStore.getState()
      await deleteCompany(companyId)
      toast.success('تم حذف الشركة بنجاح')
    } catch (error) {
      toast.error('فشل في حذف الشركة')
    }
  }

  const handleToggleStatus = async (company: Company) => {
    const newStatus = company.status === 'active' ? 'inactive' : 'active'
    try {
      await companyService.updateStatus(company.id, newStatus)
      await refreshCompanies()
      toast.success(`تم ${newStatus === 'active' ? 'تفعيل' : 'تعطيل'} الشركة بنجاح`)
    } catch (error) {
      toast.error('فشل في تحديث حالة الشركة')
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedCompanies((prev: string[]) =>
      prev.includes(id) ? prev.filter((c: string) => c !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedCompanies(checked ? filteredAndSortedCompanies.map((c: Company) => c.id) : [])
  }

  const handleExport = (format: string) => {
    // Prepare data for export
    // Filter out complex objects or map them to strings
    const dataToExport = companies.map(c => ({
      'اسم الشركة': c.name,
      'النطاق': c.domain,
      'الصناعة': c.industry,
      'الحجم': c.size,
      'الحالة': c.status === 'active' ? 'نشط' : 'غير نشط',
      'الباقة': c.subscription.plan,
      'الدخل': c.subscription.monthlyRevenue,
      'المستخدمين': c.userCount,
      'تاريخ الإنشاء': new Date(c.createdAt).toLocaleDateString('ar-SA')
    }))

    const fileName = `companies-report-${new Date().toISOString().split('T')[0]}`

    if (format.toLowerCase() === 'csv') {
      exportUtils.exportCSV(dataToExport, fileName)
    } else if (format.toLowerCase() === 'excel') {
      exportUtils.exportExcel(dataToExport, fileName)
    } else if (format.toLowerCase() === 'pdf') {
      // Get headers from first row
      const columns = Object.keys(dataToExport[0])
      exportUtils.exportPDF(dataToExport, columns, fileName, 'تقرير الشركات')
    }
  }

  const industries = [...new Set(companies.map(c => c.industry))]
  const sizes = [...new Set(companies.map(c => c.size))]
  const subscriptionPlans = [...new Set(companies.map(c => c.subscription.plan))]

  // Calculate statistics from portfolioStats if available, otherwise fallback to local calculation
  const stats = useMemo(() => {
    if (portfolioStats) {
      return {
        total: portfolioStats.totalCompanies,
        active: companies.filter(c => c.status === 'active').length,
        trial: portfolioStats.planDistribution['trial'] || 0,
        enterprise: portfolioStats.planDistribution['enterprise'] || 0,
        totalRevenue: portfolioStats.totalRevenue
      }
    }

    const total = companies.length
    const active = companies.filter(c => c.status === 'active').length
    const trial = companies.filter(c => c.subscription.plan === 'trial').length
    const enterprise = companies.filter(c => c.subscription.plan === 'enterprise').length
    const totalRevenue = companies.reduce((sum, c) => sum + (c.subscription.monthlyRevenue || 0), 0)

    return { total, active, trial, enterprise, totalRevenue }
  }, [companies, portfolioStats])

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800/50 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              {/* Title Section */}
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  إدارة الشركات
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  عرض وإدارة جميع الشركات المشتركة في المنصة مع تحليلات شاملة
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 flex-wrap">
                <RefreshButton onClick={handleRefresh} isLoading={loading} />
                <ExportMenu onExport={handleExport} />

                <Button
                  variant="primary"
                  onClick={() => analyzeCompany(companies[0]?.id)} // Example: analyze first company for now, or implement portfolio analysis
                  disabled={isAnalyzing || companies.length === 0}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
                >
                  {isAnalyzing ? (
                    <Activity className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 text-yellow-300" />
                  )}
                  تحليل المحفظة بالذكاء الاصطناعي
                </Button>

                <Button
                  variant="primary"
                  onClick={handleAddCompany}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  إضافة شركة جديدة
                </Button>
              </div>
            </div>

            {/* View Mode and Controls */}
            <div className="flex items-center justify-between mt-6">
              {/* View Mode Tabs */}
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                {[
                  { id: 'grid', label: 'شبكة', icon: Building },
                  { id: 'table', label: 'جدول', icon: Briefcase },
                  { id: 'analytics', label: 'تحليلات', icon: TrendingUp }
                ].map((mode) => {
                  const Icon = mode.icon
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id as any)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === mode.id
                        ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {mode.label}
                    </button>
                  )
                })}
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <select
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  value={sortBy}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as any)}
                >
                  <option value="createdAt">تاريخ الإنشاء</option>
                  <option value="name">الاسم</option>
                  <option value="subscription">الباقة</option>
                  <option value="users">عدد المستخدمين</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6"
          >
            {[
              { label: 'إجمالي الشركات', value: stats.total, icon: Building, color: 'blue' },
              { label: 'الشركات النشطة', value: stats.active, icon: Users, color: 'green' },
              { label: 'في الفترة التجريبية', value: stats.trial, icon: Star, color: 'yellow' },
              { label: 'مؤسسات', value: stats.enterprise, icon: Briefcase, color: 'purple' }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="bg-white dark:bg-slate-800 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <CompanyFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filters={filters}
              onFiltersChange={setFilters}
              industries={industries}
              sizes={sizes}
              subscriptionPlans={subscriptionPlans}
            />
          </motion.div>

          {/* Bulk Actions */}
          {selectedCompanies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <BulkActions
                selectedCount={selectedCompanies.length}
                onClearSelection={() => setSelectedCompanies([])}
                onExport={() => handleExport('csv')}
                onMessage={handleBulkMessage}
              />
            </motion.div>
          )}

          {/* AI Insights Panel */}
          <AnimatePresence>
            {aiAnalysis && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Zap className="w-32 h-32" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                          <Zap className="w-5 h-5 text-yellow-300" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">تحليل الذكاء الاصطناعي للأداء</h3>
                          <p className="text-white/80 text-sm">بناءً على نشاط الشركة واستخدام الموارد</p>
                        </div>
                      </div>
                      <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/20">
                        <span className="text-xs font-bold uppercase block opacity-70">نقاط الصحة</span>
                        <span className="text-2xl font-black">{aiAnalysis.score}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white/60">الرؤى والتحليلات</h4>
                        <ul className="space-y-2">
                          {aiAnalysis.insights?.map((insight: string, i: number) => (
                            <motion.li
                              key={i}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-2 text-sm bg-white/10 p-2 rounded-lg border border-white/5"
                            >
                              <CheckCheck className="w-4 h-4 text-green-300 mt-0.5 shrink-0" />
                              {insight}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white/60">الإجراءات المقترحة</h4>
                        <ul className="space-y-2">
                          {aiAnalysis.recommendations?.map((rec: string, i: number) => (
                            <motion.li
                              key={i}
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-2 text-sm bg-black/10 p-2 rounded-lg border border-black/5"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2 shrink-0" />
                              {rec}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Based on View Mode */}
          <AnimatePresence mode="wait">
            {viewMode === 'grid' && (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAndSortedCompanies.map((company) => (
                    <CompanyCard
                      key={company.id}
                      company={company}
                      onEdit={handleEditCompany}
                      onDelete={handleDeleteCompany}
                      onToggleStatus={handleToggleStatus}
                      isSelected={selectedCompanies.includes(company.id)}
                      onSelect={handleSelectItem}
                      onViewPlatform={handleViewPlatform}
                    />
                  ))}
                </div>

                {filteredAndSortedCompanies.length === 0 && (
                  <div className="text-center py-12">
                    <Building className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400">لم يتم العثور على شركات</h3>
                    <p className="text-slate-500 dark:text-slate-500 mt-2">حاول تعديل معايير البحث أو إضافة شركة جديدة</p>
                  </div>
                )}
              </motion.div>
            )}

            {viewMode === 'table' && (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-white dark:bg-slate-800 shadow-xl">
                  <CardContent className="p-0">
                    <CompanyTable
                      companies={filteredAndSortedCompanies}
                      onEdit={handleEditCompany}
                      onDelete={handleDeleteCompany}
                      onToggleStatus={handleToggleStatus}
                      selectedIds={selectedCompanies}
                      onSelectAll={handleSelectAll}
                      onSelectItem={handleSelectItem}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {viewMode === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CompanyAnalytics companies={companies} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modals */}
          <AnimatePresence>
            {showAddModal && (
              <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="إضافة شركة جديدة"
                size="lg"
              >
                <CompanyOnboarding onComplete={async (data) => {
                  if (data) {
                    try {
                      const { createCompany } = useCompaniesStore.getState()
                      // Transform flat form data to API payload
                      const payload = {
                        name: data.name,
                        address: data.location,
                        website: data.domain,
                        settings: {
                          industry: data.industry,
                          size: data.size,
                          contactPhone: data.phone,
                          contactEmail: data.email
                        }
                      }
                      await createCompany(payload)
                      toast.success('تم إنشاء الشركة بنجاح')
                    } catch (error) {
                      toast.error('فشل في إنشاء الشركة')
                      return // Keep modal open on error
                    }
                  }
                  setShowAddModal(false)
                }} />
              </Modal>
            )}

            {showEditModal && selectedCompany && (
              <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="تعديل بيانات الشركة"
                size="lg"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-600 shadow-sm flex items-center justify-center">
                      <Building className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedCompany.name}</h2>
                      <p className="text-slate-500 dark:text-slate-400">{selectedCompany.domain}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">الاسم</label>
                      <input
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">الموقع الإلكتروني</label>
                      <input
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editForm.domain || ''}
                        onChange={(e) => setEditForm({ ...editForm, domain: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">الصناعة</label>
                      <select
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editForm.industry || ''}
                        onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                      >
                        <option value="">اختر الصناعة...</option>
                        {INDUSTRIES.map(ind => (
                          <option key={ind.value} value={ind.value}>{ind.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">حجم الشركة</label>
                      <select
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editForm.size || ''}
                        onChange={(e) => setEditForm({ ...editForm, size: e.target.value as any })}
                      >
                        <option value="">اختر الحجم...</option>
                        {COMPANY_SIZES.map(size => (
                          <option key={size.value} value={size.value}>{size.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="primary" className="flex-1" onClick={handleSaveCompany}>
                      <Save className="w-4 h-4 ml-2" />
                      حفظ التغييرات
                    </Button>
                    <Button variant="outline" onClick={() => handleViewPlatform(selectedCompany)}>
                      <ExternalLink className="w-4 h-4 ml-2" />
                      عرض المنصة
                    </Button>
                    <Button variant="danger" size="icon" onClick={() => handleDeleteCompany(selectedCompany.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Modal>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default CompaniesPage