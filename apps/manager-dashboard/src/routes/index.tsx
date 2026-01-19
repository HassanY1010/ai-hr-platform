// apps/manager-dashboard/src/routes/index.tsx
import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import { LoadingCard } from '@hr/ui'
import MainLayout from '../layouts/MainLayout'

// Lazy load pages
const DashboardPage = React.lazy(() => import('../modules/dashboard/pages/DashboardPage'))
const EmployeesPage = React.lazy(() => import('../modules/employees/pages/EmployeesPage'))
const RecruitmentPage = React.lazy(() => import('../modules/recruitment/pages/RecruitmentPage'))
const JobsPage = React.lazy(() => import('../modules/recruitment/jobs/pages/JobsPage'))
const CandidatesPage = React.lazy(() => import('../modules/recruitment/candidates/pages/CandidatesPage'))
const InterviewsPage = React.lazy(() => import('../modules/recruitment/interviews/pages/InterviewsPage'))
const ProjectsPage = React.lazy(() => import('../modules/tasks-projects/pages/ProjectsPage'))
const ProjectDetailsPage = React.lazy(() => import('../modules/tasks-projects/pages/ProjectDetailsPage'))
const TrainingPage = React.lazy(() => import('../modules/training/pages/TrainingPage'))
const IntelligencePage = React.lazy(() => import('../modules/dashboard/pages/IntelligencePage'))
const ReportsPage = React.lazy(() => import('../modules/dashboard/pages/ReportsPage'))
const SettingsPage = React.lazy(() => import('../modules/settings/pages/SettingsPage'))

// Login page component
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

    if (!user || user.role !== 'MANAGER') {
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

                {/* Protected Manager Routes */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<DashboardPage />} />
                    <Route path="employees" element={<EmployeesPage />} />
                    <Route path="recruitment">
                        <Route index element={<RecruitmentPage />} />
                        <Route path="jobs" element={<JobsPage />} />
                        <Route path="candidates" element={<CandidatesPage />} />
                        <Route path="interviews" element={<InterviewsPage />} />
                    </Route>
                    <Route path="projects">
                        <Route index element={<ProjectsPage />} />
                        <Route path=":id" element={<ProjectDetailsPage />} />
                    </Route>
                    <Route path="training" element={<TrainingPage />} />
                    <Route path="intelligence" element={<IntelligencePage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    )
}

export default AppRoutes
