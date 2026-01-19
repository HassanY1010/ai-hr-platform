// packages/utils/src/date.ts
import { format, formatDistance, parseISO, isToday, isYesterday } from 'date-fns'
import { arSA } from 'date-fns/locale'

export const formatDate = (date: string | Date, pattern: string = 'PPpp'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, pattern, { locale: arSA })
}

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistance(dateObj, new Date(), { addSuffix: true, locale: arSA })
}

export const formatTimeAgo = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date

  if (isToday(dateObj)) {
    return `اليوم ${format(dateObj, 'h:mm a', { locale: arSA })}`
  }

  if (isYesterday(dateObj)) {
    return `أمس ${format(dateObj, 'h:mm a', { locale: arSA })}`
  }

  return formatRelativeTime(dateObj)
}

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} دقيقة`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours} ساعة`
  }

  return `${hours} ساعة و ${remainingMinutes} دقيقة`
}

export const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'HH:mm:ss', { locale: arSA })
}

export const getGreeting = (): string => {
  const hour = new Date().getHours()

  if (hour < 12) {
    return 'صباح الخير'
  } else if (hour < 18) {
    return 'مساء الخير'
  } else {
    return 'مساء الخير'
  }
}