// apps/owner-dashboard/src/routes/index.tsx
import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import { LoadingCard } from '@hr/ui'
import MainLayout from '../layouts/MainLayout'

// Lazy load pages - Original modules
const OverviewPage = React.lazy(() => import('@/modules/overview/pages/OverviewPage'))
const AIQualityPage = React.lazy(() => import('@/modules/ai-quality/pages/AIQualityPage'))
const AIUsagePage = React.lazy(() => import('@/modules/ai-usage/pages/AIUsagePage'))
const CompaniesPage = React.lazy(() => import('@/modules/companies/pages/CompaniesPage'))

const ProductMetricsPage = React.lazy(() => import('@/modules/product-metrics/pages/ProductMetricsPage'))
const RoadmapPage = React.lazy(() => import('@/modules/roadmap/pages/RoadmapPage'))

// Lazy load pages - New admin modules
const SystemHealthPage = React.lazy(() => import('@/modules/system-health/pages/SystemHealthPage'))
const AuditLogsPage = React.lazy(() => import('@/modules/audit-logs/pages/AuditLogsPage'))
const FeatureFlagsPage = React.lazy(() => import('@/modules/system-management/pages/FeatureFlagsPage'))
const SecurityPage = React.lazy(() => import('@/modules/system-management/pages/SecurityManagementPage'))
const SubscriptionCodesPage = React.lazy(() => import('@/modules/system-management/pages/SubscriptionCodesPage'))
const CoursesPage = React.lazy(() => import('@/modules/training/pages/CoursesPage'))

// Login page component
const LoginPage = React.lazy(() => import('../pages/LoginPage'))
const FaceVerification = React.lazy(() => import('../pages/FaceVerification'))

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

    if (!user || user.role !== 'SUPER_ADMIN') {
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
                <Route path="/face-verify" element={<FaceVerification />} />

                {/* Protected Owner Routes */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<OverviewPage />} />

                    {/* Business Intelligence */}
                    <Route path="overview" element={<OverviewPage />} />

                    <Route path="product-metrics" element={<ProductMetricsPage />} />
                    <Route path="ai-quality" element={<AIQualityPage />} />
                    <Route path="ai-usage" element={<AIUsagePage />} />
                    <Route path="roadmap" element={<RoadmapPage />} />
                    <Route path="companies" element={<CompaniesPage />} />

                    {/* System Management */}
                    <Route path="system-health" element={<SystemHealthPage />} />
                    <Route path="audit-logs" element={<AuditLogsPage />} />
                    <Route path="feature-flags" element={<FeatureFlagsPage />} />
                    <Route path="security" element={<SecurityPage />} />
                    <Route path="subscription-codes" element={<SubscriptionCodesPage />} />
                    <Route path="courses" element={<CoursesPage />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    )
}

export default AppRoutes
