// packages/constants/src/routes.ts
export const ROUTES = {
  // Employee Routes
  EMPLOYEE: {
    HOME: '/employee',
    DAILY_QUESTION: '/employee/daily-question',
    TASKS: '/employee/tasks',
    TRAINING: '/employee/training',
    NOTIFICATIONS: '/employee/notifications',
    PROFILE: '/employee/profile'
  },
  
  // Manager Routes
  MANAGER: {
    DASHBOARD: '/manager',
    RECRUITMENT: {
      JOBS: '/manager/recruitment/jobs',
      CANDIDATES: '/manager/recruitment/candidates',
      INTERVIEWS: '/manager/recruitment/interviews'
    },
    EMPLOYEES: '/manager/employees',
    TASKS_PROJECTS: '/manager/tasks-projects',
    TRAINING: '/manager/training',
    ALERTS: '/manager/alerts',
    SETTINGS: '/manager/settings'
  },
  
  // Admin Routes
  ADMIN: {
    DASHBOARD: '/admin',
    COMPANIES: '/admin/companies',
    SUBSCRIPTIONS: '/admin/subscriptions',
    AI_USAGE: '/admin/ai-usage',
    AUDIT_LOGS: '/admin/audit-logs',
    SYSTEM_HEALTH: '/admin/system-health',
    SETTINGS: '/admin/settings'
  },
  
  // Owner Routes
  OWNER: {
    DASHBOARD: '/owner',
    OVERVIEW: '/owner/overview',
    PRODUCT_METRICS: '/owner/product-metrics',
    AI_QUALITY: '/owner/ai-quality',
    ROADMAP: '/owner/roadmap',
    FINANCE: '/owner/finance'
  },
  
  // Auth Routes
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password'
  }
} as const