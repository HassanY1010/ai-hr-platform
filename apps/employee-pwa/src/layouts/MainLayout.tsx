import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { Home, GraduationCap, Bell, User, Layout, LogOut, Target } from 'lucide-react'
import { useAuth } from '../providers/AuthProvider'
import { InstallPWA } from '../components/InstallPWA'

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth()

  const navItems = [
    { path: '/', icon: Home, label: 'الرئيسية' },
    { path: '/tasks', icon: Target, label: 'المهام' },
    { path: '/training', icon: GraduationCap, label: 'التدريب' },
    { path: '/notifications', icon: Bell, label: 'الإشعارات' },
    { path: '/profile', icon: User, label: 'الملف' }
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-l border-slate-100 h-screen sticky top-0 px-6 py-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-2xl premium-gradient flex items-center justify-center p-0.5">
            <div className="w-full h-full bg-white rounded-[0.9rem] flex items-center justify-center">
              <Layout className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <span className="font-extrabold text-slate-800 tracking-tight text-lg">بوابة الموظف</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold
                ${isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <InstallPWA variant="sidebar" />

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
              <span className="text-sm font-bold text-indigo-600">
                {user?.name?.charAt(0) || 'ح'}
              </span>
            </div>
            <div className="tracking-tight">
              <p className="text-sm font-bold text-slate-900">{user?.name?.split(' ')[0]}</p>
              <p className="text-xs text-slate-500">موظف</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                logout();
              }
            }}
            className="w-full flex items-center gap-2 text-slate-400 hover:text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Header - Mobile Only */}
      <header className="md:hidden bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl premium-gradient flex items-center justify-center p-0.5">
              <div className="w-full h-full bg-white rounded-[0.9rem] flex items-center justify-center">
                <Layout className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <span className="font-extrabold text-slate-800 tracking-tight">بوابة الموظف</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                  logout();
                }
              }}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
              <span className="text-xs font-bold text-indigo-600">
                {user?.name?.charAt(0) || 'ح'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-xl md:max-w-7xl mx-auto px-0 md:px-8 md:py-8 pb-32 md:pb-8">
        <Outlet />
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
        <div className="max-w-md mx-auto h-20 glass-card rounded-[2rem] flex items-center justify-around px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all duration-300
                ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}
              `}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-bold">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <InstallPWA variant="banner" />
      <InstallPWA />
    </div>
  )
}

export default MainLayout