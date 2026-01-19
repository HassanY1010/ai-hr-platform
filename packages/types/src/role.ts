// packages/types/src/role.ts
import { UserRole } from './user'
export type Permission =
  | 'read:dashboard'
  | 'write:dashboard'
  | 'read:employees'
  | 'write:employees'
  | 'read:recruitment'
  | 'write:recruitment'
  | 'read:training'
  | 'write:training'
  | 'read:analytics'
  | 'write:analytics'
  | 'manage:users'
  | 'manage:subscriptions'
  | 'manage:system'

export interface RoleConfig {
  name: UserRole
  permissions: Permission[]
  description: string
  features: string[]
}

export const ROLES_CONFIG: Record<UserRole, RoleConfig> = {
  EMPLOYEE: {
    name: 'EMPLOYEE',
    permissions: ['read:dashboard'],
    description: 'موظف عادي - واجهة PWA مبسطة',
    features: ['daily-question', 'tasks', 'training', 'notifications']
  },
  MANAGER: {
    name: 'MANAGER',
    permissions: [
      'read:dashboard',
      'write:dashboard',
      'read:employees',
      'write:employees',
      'read:recruitment',
      'write:recruitment',
      'read:training',
      'write:training'
    ],
    description: 'مدير فريق - لوحة تحكم متقدمة',
    features: ['dashboard', 'recruitment', 'employees', 'tasks', 'training', 'alerts']
  },
  ADMIN: {
    name: 'ADMIN',
    permissions: [
      'read:dashboard',
      'write:dashboard',
      'read:employees',
      'write:employees',
      'read:recruitment',
      'write:recruitment',
      'read:training',
      'write:training',
      'read:analytics',
      'write:analytics',
      'manage:users',
      'manage:subscriptions'
    ],
    description: 'مدير المنصة - تحكم كامل',
    features: ['companies', 'subscriptions', 'ai-usage', 'audit-logs', 'system-health']
  },
  SUPER_ADMIN: {
    name: 'SUPER_ADMIN',
    permissions: [
      'read:dashboard',
      'write:dashboard',
      'read:employees',
      'write:employees',
      'read:recruitment',
      'write:recruitment',
      'read:training',
      'write:training',
      'read:analytics',
      'write:analytics',
      'manage:users',
      'manage:subscriptions',
      'manage:system'
    ],
    description: 'صاحب المشروع - رؤية استراتيجية',
    features: ['overview', 'product-metrics', 'ai-quality', 'roadmap']
  }
}