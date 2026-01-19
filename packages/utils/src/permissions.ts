// packages/utils/src/permissions.ts
import { type UserRole, type Permission, ROLES_CONFIG } from '@hr/types'

export const hasPermission = (
  role: UserRole,
  permission: Permission
): boolean => {
  return ROLES_CONFIG[role].permissions.includes(permission)
}

export const getRoleFeatures = (role: UserRole): string[] => {
  return ROLES_CONFIG[role].features
}

export const checkAccess = (
  requiredPermissions: Permission[],
  userRole: UserRole
): boolean => {
  return requiredPermissions.every(permission =>
    hasPermission(userRole, permission)
  )
}

export const filterByRole = <T>(
  items: T[],
  userRole: UserRole,
  roleField: keyof T
): T[] => {
  if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
    return items
  }

  return items.filter(item => {
    const itemRole = item[roleField] as UserRole
    const roleHierarchy: UserRole[] = ['EMPLOYEE', 'MANAGER', 'ADMIN', 'SUPER_ADMIN']
    return roleHierarchy.indexOf(itemRole) <= roleHierarchy.indexOf(userRole)
  })
}