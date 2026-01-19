// packages/utils/src/guards.ts
import { type User, type UserRole } from '@hr/types'

export const isEmployee = (user: User): boolean => {
  return user.role === 'EMPLOYEE'
}

export const isManager = (user: User): boolean => {
  return user.role === 'MANAGER'
}

export const isAdmin = (user: User): boolean => {
  return user.role === 'ADMIN'
}

export const isOwner = (user: User): boolean => {
  return user.role === 'SUPER_ADMIN'
}

export const requireRole = (user: User, requiredRole: UserRole): boolean => {
  const roleHierarchy: UserRole[] = ['EMPLOYEE', 'MANAGER', 'ADMIN', 'SUPER_ADMIN']
  const userIndex = roleHierarchy.indexOf(user.role)
  const requiredIndex = roleHierarchy.indexOf(requiredRole)

  return userIndex >= requiredIndex
}

export const requireAnyRole = (user: User, roles: UserRole[]): boolean => {
  return roles.includes(user.role)
}