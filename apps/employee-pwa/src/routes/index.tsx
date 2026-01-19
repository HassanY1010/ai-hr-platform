// apps/employee-pwa/src/routes/index.tsx
import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import { LoadingCard } from '@hr/ui'
import MainLayout from '../layouts/MainLayout'

// Lazy load pages
const HomePage = React.lazy(() => import('../modules/daily-question/pages/HomePage'))
const TasksPage = React.lazy(() => import('../modules/tasks/pages/TasksPage'))
const TrainingPage = React.lazy(() => import('../modules/training/pages/TrainingPage'))
const NotificationsPage = React.lazy(() => import('../modules/notifications/pages/NotificationsPage'))
const ProfilePage = React.lazy(() => import('../modules/profile/pages/ProfilePage'))
const LoginPage = React.lazy(() => import('../pages/LoginPage'))

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingCard title="جاري التحميل..." />
  </div>
)

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingFallback />
  }

  if (!user || user.role !== 'EMPLOYEE') {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Employee Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<HomePage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="training" element={<TrainingPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes