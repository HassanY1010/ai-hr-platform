// apps/owner-dashboard/src/layouts/MainLayout.tsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  Brain,
  TrendingUp,
  Building2,
  Activity,
  FileText,
  ShieldAlert,
  ToggleLeft,
  Cpu,
  BookOpen
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../providers/AuthProvider'

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  const navItems = [
    // Business Intelligence
    { path: '/', icon: Home, label: 'نظرة عامة', section: 'business' },

    { path: '/product-metrics', icon: Activity, label: 'تحليلات المنصة', section: 'business' },
    { path: '/ai-quality', icon: Brain, label: 'جودة الذكاء الاصطناعي', section: 'business' },
    { path: '/ai-usage', icon: Cpu, label: 'استهلاك الذكاء الاصطناعي', section: 'business' },
    { path: '/roadmap', icon: TrendingUp, label: 'خارطة الطريق', section: 'business' },

    // System Management
    { path: '/companies', icon: Building2, label: 'الشركات', section: 'system' },
    { path: '/system-health', icon: Activity, label: 'صحة النظام', section: 'system' },
    { path: '/audit-logs', icon: FileText, label: 'سجلات التدقيق', section: 'system' },
    { path: '/feature-flags', icon: ToggleLeft, label: 'التحكم في الميزات', section: 'system' },
    { path: '/security', icon: ShieldAlert, label: 'الأمان والطوارئ', section: 'system' },
    { path: '/subscription-codes', icon: ShieldAlert, label: 'رموز الاشتراك', section: 'system' },
    { path: '/courses', icon: BookOpen, label: 'الدورات التدريبية', section: 'system' }
  ]

  return (
    <div className="min-h-screen bg-neutral-50 flex" dir="rtl">
      <Sidebar
        items={navItems}
        user={user}
        onLogout={logout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border-b border-neutral-200 sticky top-0 z-40"
        >
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Hamburger Button */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <div>
                  <h1 className="text-lg md:text-xl font-semibold text-neutral-900 truncate">
                    AI HR Platform - المالك
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                <div className="text-right hidden sm:block">
                  <p className="font-medium text-neutral-900">{user?.name}</p>
                  <p className="text-xs text-neutral-500">صاحب المشروع</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold shrink-0">
                  {user?.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout