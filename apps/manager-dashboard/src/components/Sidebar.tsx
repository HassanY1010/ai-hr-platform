// apps/manager-dashboard/src/components/Sidebar.tsx
import React from 'react'
import { NavLink } from 'react-router-dom'

import { LogOut, ChevronRight, Sun, Moon } from 'lucide-react'
import { useTheme } from '@hr/ui'
import type { User } from '@hr/types'

interface NavItem {
  path: string
  icon: React.ComponentType<any>
  label: string
}

interface SidebarProps {
  items: NavItem[]
  user: User | null
  onLogout: () => void
  isOpen: boolean
  onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ items, user, onLogout, isOpen, onClose }) => {
  const { setTheme, actualTheme } = useTheme()



  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:sticky top-0 inset-y-0 right-0 z-50
          w-72 bg-white dark:bg-gray-900 border-l border-neutral-200 dark:border-gray-800
          flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          h-screen overflow-y-auto
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-neutral-200 dark:border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 dark:text-white">HR Platform</h2>
              <p className="text-xs text-neutral-500 dark:text-gray-400">Decision Intelligence</p>
            </div>
          </div>

          {/* Close Button (Mobile Only) */}
          <button
            onClick={onClose}
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => {
                    // Close sidebar on mobile when link clicked
                    if (window.innerWidth < 768) onClose()
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                      ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 border-r-4 border-primary-500'
                      : 'text-neutral-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-gray-800 hover:text-neutral-900 dark:hover:text-white'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className="h-4 w-4" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info & Settings & Logout */}
        <div className="p-4 border-t border-neutral-200 dark:border-gray-800 space-y-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(actualTheme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-3 w-full px-4 py-3 text-neutral-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {actualTheme === 'dark' ? (
              <>
                <Sun className="h-5 w-5 text-yellow-500" />
                <span>الوضع النهاري</span>
              </>
            ) : (
              <>
                <Moon className="h-5 w-5 text-blue-500" />
                <span>الوضع الليلي</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-3 mb-4 p-3 bg-neutral-50 dark:bg-gray-800/50 rounded-lg">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-neutral-500 dark:text-gray-400 truncate">{user?.position}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-neutral-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar