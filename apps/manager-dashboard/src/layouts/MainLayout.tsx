// apps/manager-dashboard/src/layouts/MainLayout.tsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  Users,
  Briefcase,
  Target,
  BarChart,
  Settings,
  Zap
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import NotificationCenter from '../components/NotificationCenter'
import { SmartSearch } from '../components/SmartSearch'
import { useAuth } from '../providers/AuthProvider'

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  const navItems = [
    { path: '/', icon: Home, label: 'النظرة العامة' },
    { path: '/recruitment', icon: Briefcase, label: 'التوظيف الذكي' },
    { path: '/intelligence', icon: Zap, label: 'ذكاء 30×3' },
    { path: '/training', icon: BarChart, label: 'إدارة التدريب' },
    { path: '/projects', icon: Target, label: 'إشراف المشاريع' },
    { path: '/employees', icon: Users, label: 'إدارة الموظفين' },
    { path: '/reports', icon: BarChart, label: 'التقارير الذكية' },
    { path: '/settings', icon: Settings, label: 'الإعدادات' }
  ]

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-950 flex transition-colors duration-300" dir="rtl">
      {/* Sidebar */}
      <Sidebar
        items={navItems}
        user={user}
        onLogout={logout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-gray-900 border-b border-neutral-200 dark:border-gray-800 sticky top-0 z-40"
        >
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Hamburger Button */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <div>
                  <h1 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-white truncate">
                    AI HR Platform - المدير
                  </h1>
                </div>
              </div>

              <SmartSearch />

              <div className="flex items-center gap-2 md:gap-4">
                <NotificationCenter />

                <div className="flex items-center gap-3 hidden sm:flex">
                  <div className="text-right">
                    <p className="font-medium text-neutral-900 dark:text-white max-w-[150px] truncate">{user?.name}</p>
                    <p className="text-xs text-neutral-500 dark:text-gray-400">{user?.position}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold shrink-0">
                    {user?.name.charAt(0)}
                  </div>
                </div>
                {/* Mobile User Avatar */}
                <div className="h-8 w-8 sm:hidden rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                  {user?.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout