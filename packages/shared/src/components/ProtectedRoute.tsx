// Shared ProtectedRoute component for role-based access control
import React from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
    children: React.ReactNode
    allowedRoles: string[]
    userRole?: string | null
    redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    userRole,
    redirectTo = '/login'
}) => {
    // If no user role, redirect to login
    if (!userRole) {
        return <Navigate to={redirectTo} replace />
    }

    // If user role is not in allowed roles, redirect
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to={redirectTo} replace />
    }

    // User has access
    return <>{children}</>
}
