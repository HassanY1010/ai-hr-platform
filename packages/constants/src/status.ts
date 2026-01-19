// packages/constants/src/status.ts
export const JOB_STATUS = {
  DRAFT: { value: 'draft', label: 'مسودة', color: 'neutral' },
  PUBLISHED: { value: 'published', label: 'نشط', color: 'success' },
  CLOSED: { value: 'closed', label: 'مغلق', color: 'warning' },
  ARCHIVED: { value: 'archived', label: 'مؤرشف', color: 'danger' }
} as const

export const CANDIDATE_STATUS = {
  NEW: { value: 'new', label: 'جديد', color: 'neutral' },
  REVIEWED: { value: 'reviewed', label: 'تم المراجعة', color: 'info' },
  INTERVIEW: { value: 'interview', label: 'مقابلة', color: 'warning' },
  OFFERED: { value: 'offered', label: 'عرض عمل', color: 'success' },
  REJECTED: { value: 'rejected', label: 'مرفوض', color: 'danger' },
  HIRED: { value: 'hired', label: 'تم التعيين', color: 'success' }
} as const

export const TASK_STATUS = {
  TODO: { value: 'todo', label: 'قيد الانتظار', color: 'neutral' },
  IN_PROGRESS: { value: 'in_progress', label: 'قيد التنفيذ', color: 'warning' },
  REVIEW: { value: 'review', label: 'قيد المراجعة', color: 'info' },
  DONE: { value: 'done', label: 'مكتمل', color: 'success' }
} as const

export const TRAINING_STATUS = {
  NOT_STARTED: { value: 'not_started', label: 'لم يبدأ', color: 'neutral' },
  IN_PROGRESS: { value: 'in_progress', label: 'قيد التنفيذ', color: 'warning' },
  COMPLETED: { value: 'completed', label: 'مكتمل', color: 'success' }
} as const

export const ALERT_LEVEL = {
  LOW: { value: 'low', label: 'منخفض', color: 'success' },
  MEDIUM: { value: 'medium', label: 'متوسط', color: 'warning' },
  HIGH: { value: 'high', label: 'مرتفع', color: 'danger' },
  CRITICAL: { value: 'critical', label: 'حرج', color: 'danger' }
} as const

export const SUBSCRIPTION_STATUS = {
  ACTIVE: { value: 'active', label: 'نشط', color: 'success' },
  PAST_DUE: { value: 'past_due', label: 'متأخر', color: 'warning' },
  CANCELED: { value: 'canceled', label: 'ملغي', color: 'danger' },
  EXPIRED: { value: 'expired', label: 'منتهي', color: 'danger' }
} as const