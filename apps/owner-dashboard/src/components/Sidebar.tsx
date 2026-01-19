// apps/owner-dashboard/src/components/Sidebar.tsx
import React from 'react'
import { NavLink } from 'react-router-dom'

import { LogOut, ChevronRight } from 'lucide-react'
import type { User } from '@hr/types'

interface NavItem {
    path: string
    icon: React.ComponentType<any>
    label: string
    section?: string
}

interface SidebarProps {
    items: NavItem[]
    user: User | null
    onLogout: () => void
    isOpen: boolean
    onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ items, user, onLogout, isOpen, onClose }) => {
    // Group items by section
    const businessItems = items.filter(item => item.section === 'business')
    const systemItems = items.filter(item => item.section === 'system')

    const renderNavItems = (navItems: NavItem[]) => (
        navItems.map((item) => (
            <li key={item.path}>
                <NavLink
                    to={item.path}
                    onClick={() => {
                        if (window.innerWidth < 768) onClose()
                    }}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                            ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-500'
                            : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                        }`
                    }
                >
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight className="h-4 w-4" />
                </NavLink>
            </li>
        ))
    )

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed md:sticky top-0 inset-y-0 right-0 z-50
                    w-72 bg-white border-l border-neutral-200
                    flex flex-col transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                    h-screen overflow-y-auto
                `}
            >
                {/* Logo */}
                <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">AI</span>
                        </div>
                        <div>
                            <h2 className="font-bold text-neutral-900">HR Platform</h2>
                            <p className="text-xs text-neutral-500">Owner Dashboard</p>
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
                <nav className="flex-1 p-4 overflow-y-auto">
                    {/* Business Intelligence Section */}
                    {businessItems.length > 0 && (
                        <div className="mb-6">
                            <h3 className="px-4 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                                الذكاء التجاري
                            </h3>
                            <ul className="space-y-1">
                                {renderNavItems(businessItems)}
                            </ul>
                        </div>
                    )}

                    {/* System Management Section */}
                    {systemItems.length > 0 && (
                        <div>
                            <h3 className="px-4 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                                إدارة النظام
                            </h3>
                            <ul className="space-y-1">
                                {renderNavItems(systemItems)}
                            </ul>
                        </div>
                    )}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-neutral-200">
                    <div className="flex items-center gap-3 mb-4 p-3 bg-neutral-50 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 truncate">{user?.name}</p>
                            <p className="text-xs text-neutral-500 truncate">صاحب المشروع</p>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 rounded-lg transition-colors"
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
