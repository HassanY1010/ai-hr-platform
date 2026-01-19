// apps/employee-pwa/src/modules/notifications/pages/NotificationsPage.tsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Badge, Button } from '@hr/ui'
import { Bell, CheckCircle, Gift, Target, Users, Calendar, Filter, Check, Trash2, Settings, BellRing } from 'lucide-react'
import { formatTimeAgo } from '@hr/utils'
import { employeeService, notificationService, trainingService } from '@hr/services'
import { useAuth } from '../../../providers/AuthProvider'
import { toast } from 'sonner'

const NotificationsPage: React.FC = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const prevCountRef = React.useRef(0) // Track previous count for sound
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  // Simple "Ding" sound (Base64)

  useEffect(() => {
    // Initialize audio once
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Fallback URL or use Base64 if preferred
    // Using a reliable CDN for a "ding" sound as Base64 might be too long/complex to guess accurately.
    // Switching to a short, reliable Base64 WAV for a "pop" sound to be safe offline.
    // User requested "sound", so I will use a standard hosted URL for reliability, 
    // or if the user wants purely offline, I'd need the file. 
    // Since I can't guarantee internet, I will use a silent check + log, 
    // BUT for the PWA "experience" requested, a URL is often acceptable. 
    // HOWEVER, to be robust (offline PWA), embedded Base64 is best.

    // Using a simple embedded beep for demonstration if 404 is a concern.
    // Let's use a real public URL for a pleasant "notification" sound.
    audioRef.current = new Audio('https://cdn.freesound.org/previews/316/316847_4939433-lq.mp3'); // Simple ding
    audioRef.current.volume = 0.5;
  }, [])
  const [filter, setFilter] = useState('all')
  const [showRead, setShowRead] = useState(true)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackNotes, setFeedbackNotes] = useState('')
  const [selectedNotifId, setSelectedNotifId] = useState<string | null>(null)
  const [pendingStatus, setPendingStatus] = useState<'ACCEPTED' | 'REJECTED' | null>(null)

  const handleResponse = async (notifId: string, enrollmentId: string, status: 'ACCEPTED' | 'REJECTED', notes?: string) => {
    try {
      await trainingService.respondToAssignment(enrollmentId, { status, notes })

      // Persist decisionStatus in notification metadata to survive refresh
      if (!notifId.startsWith('task-') && !notifId.startsWith('training-')) {
        await notificationService.updateMetadata(notifId, { decisionStatus: status, responseNotes: notes })
      }

      toast.success(status === 'ACCEPTED' ? 'تم قبول التدريب بنجاح' : 'تم رفض التدريب')

      // Update local state to hide buttons or show status
      setNotifications(prev => prev.map(n =>
        n.id === notifId ? { ...n, decisionStatus: status, read: true } : n
      ))

      handleMarkAsRead(notifId)
      setShowFeedbackModal(false)
      setFeedbackNotes('')
      setSelectedNotifId(null)
      setPendingStatus(null)
    } catch (error) {
      toast.error('فشل في إرسال الرد')
    }
  }

  // Helper to get icon based on type
  const getIconForType = (type: string) => {
    switch (type) {
      case 'achievement': return Gift
      case 'task': return Target
      case 'training': return Users
      case 'reminder': return Calendar
      case 'announcement': return BellRing
      default: return Bell
    }
  }

  useEffect(() => {
    const fetchNotifications = async (isPolling = false) => {
      if (user?.id) {
        if (!isPolling) setIsLoading(true)
        try {
          const rawData = await employeeService.getNotifications(user.id)
          console.log('[DEBUG_PWA] Notifications raw data:', rawData)

          // Robust array extraction to handle cases where the service returns an object
          let finalNotifications: any[] = []
          if (Array.isArray(rawData)) {
            finalNotifications = rawData
          } else if (rawData && typeof rawData === 'object') {
            const dataObj = rawData as any
            if (Array.isArray(dataObj.notifications)) {
              finalNotifications = dataObj.notifications
            } else if (Array.isArray(dataObj.data)) {
              finalNotifications = dataObj.data
            } else if (dataObj.data && Array.isArray(dataObj.data.notifications)) {
              finalNotifications = dataObj.data.notifications
            }
          }

          console.log('[DEBUG_PWA] Final notifications array:', finalNotifications)

          // Add icon property based on type
          const notificationsWithIcons = finalNotifications.map((notif: any) => ({
            ...notif,
            icon: getIconForType(notif.type)
          }))
          setNotifications(notificationsWithIcons)
        } catch (error) {
          console.error('Failed to fetch notifications', error)
          setNotifications([])
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchNotifications()

    // Poll every 30 seconds to check for new notifications (triggers sound)
    const intervalId = setInterval(() => fetchNotifications(true), 30000);

    return () => clearInterval(intervalId);
  }, [user?.id])

  // Effect to play sound when unread count increases
  useEffect(() => {
    if (isLoading) return; // Don't play on initial load

    const currentUnread = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;

    // Only play if count INCREASED (new notification arrived)
    // We skip the very first render (prev=0, current=X) to avoid noise on page load, usually.
    // But if user wants to know they have notifications, maybe valid.
    // Typically, "when a notification arrives" implies a CHANGE.
    if (currentUnread > prevCountRef.current && prevCountRef.current !== 0) {
      // Play sound
      audioRef.current?.play().catch(e => console.log('Audio play failed (interaction needed):', e));
    } else if (prevCountRef.current === 0 && currentUnread > 0) {
      // Optional: Verify if user wants sound on load. Usually annoying. 
      // I will stick to "new arrival" logic, so I won't play on first load.
      // BUT, to test it, the user might expect it.
      // Let's stick to "change" logic.
    }

    prevCountRef.current = currentUnread;
  }, [notifications, isLoading])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-500' }
      case 'task': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-500' }
      case 'training': return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-500' }
      case 'reminder': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-500' }
      case 'announcement': return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-500' }
      default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-500' }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      // If it's a persistent notification (hex/uuid format, not starting with task-/training-)
      if (!id.startsWith('task-') && !id.startsWith('training-')) {
        await notificationService.markAsRead(id)
      }

      setNotifications(prev =>
        Array.isArray(prev) ? prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        ) : []
      )
    } catch (error) {
      toast.error('فشل في تحديث حالة الإشعار')
    }
  }



  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev =>
        Array.isArray(prev) ? prev.map(notif => ({ ...notif, read: true })) : []
      )
      toast.success('تم تحديد جميع الإشعارات كمقروءة')
    } catch (error) {
      toast.error('فشل في تحديث حالة الإشعارات')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      if (!id.startsWith('task-') && !id.startsWith('training-')) {
        await notificationService.delete(id)
      }
      setNotifications(prev => Array.isArray(prev) ? prev.filter(notif => notif.id !== id) : [])
      toast.success('تم حذف الإشعار')
    } catch (error) {
      toast.error('فشل في حذف الإشعار')
    }
  }

  const filteredNotifications = Array.isArray(notifications) ? notifications.filter(notif => {
    if (filter !== 'all' && notif.type !== filter) return false
    if (!showRead && notif.read) return false
    return true
  }) : []

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">مركز الإشعارات</h1>
              <p className="text-gray-600">
                {unreadCount > 0 ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    {unreadCount} إشعار غير مقروء
                  </span>
                ) : (
                  'جميع الإشعارات مقروءة'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">تعليم الكل كمقروء</span>
            </button>
            <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">تصفية حسب:</span>
          </div>

          <div className="flex gap-2">
            {[
              { key: 'all', label: 'الكل', count: Array.isArray(notifications) ? notifications.length : 0 },
              { key: 'task', label: 'مهام', count: Array.isArray(notifications) ? notifications.filter(n => n.type === 'task').length : 0 },
              { key: 'training', label: 'تدريب', count: Array.isArray(notifications) ? notifications.filter(n => n.type === 'training').length : 0 }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${filter === key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 ml-auto">
            <input
              type="checkbox"
              checked={showRead}
              onChange={(e) => setShowRead(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">إظهار المقروء</span>
          </label>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل الإشعارات...</p>
          </div>
        ) : filteredNotifications.map((notification: any, index) => {
          const colors = getTypeColor(notification.type)
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative shadow-md hover:shadow-lg transition-shadow rounded-xl border-r-4 ${colors.border}`}>
                {!notification.read && (
                  <div className="absolute top-4 right-4">
                    <div className={`w-3 h-3 ${colors.text} rounded-full animate-pulse`}></div>
                  </div>
                )}

                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon with priority indicator */}
                    <div className="relative">
                      <div className={`h-12 w-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                        <notification.icon className={`h-6 w-6 ${colors.text}`} />
                      </div>
                      <div className={`absolute -top-1 -right-1 w-4 h-4 ${getPriorityColor(notification.priority)} rounded-full border-2 border-white`}></div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {notification.title}
                            </h4>
                            {notification.type === 'achievement' && (
                              <Badge variant="success" className="text-xs">
                                🏆 إنجاز
                              </Badge>
                            )}
                            {notification.priority === 'high' && !notification.read && (
                              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                                عاجل
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mt-1 leading-relaxed">
                            {notification.message}
                          </p>

                          {/* Task Specific Actions & Progress removed to keep it simple */}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4">
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatTimeAgo(notification.time)}
                          </p>

                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${notification.priority === 'high' ? 'bg-red-100 text-red-700' :
                            notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                            {notification.priority === 'high' ? 'عالي' :
                              notification.priority === 'medium' ? 'متوسط' : 'منخفض'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                              تعليم كمقروء
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                            title="حذف الإشعار"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Training Interactive Actions */}
                      {notification.type === 'training' && notification.metadata?.enrollmentId && !notification.decisionStatus && !notification.metadata?.decisionStatus && (
                        <div className="mt-4 flex gap-3">
                          <Button
                            size="sm"
                            variant="success"
                            className="flex-1 text-xs"
                            onClick={() => handleResponse(notification.id, notification.metadata?.enrollmentId, 'ACCEPTED')}
                          >
                            موافق
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            className="flex-1 text-xs"
                            onClick={() => {
                              setSelectedNotifId(notification.id)
                              setPendingStatus('REJECTED')
                              setShowFeedbackModal(true)
                            }}
                          >
                            غير موافق
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => {
                              setSelectedNotifId(notification.id)
                              setPendingStatus('ACCEPTED')
                              setShowFeedbackModal(true)
                            }}
                          >
                            تعليق / ملاحظة
                          </Button>
                        </div>
                      )}
                      {notification.decisionStatus && (
                        <div className="hidden"></div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4">ترك ملاحظة</h3>
            <textarea
              className="w-full h-32 p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="اكتب ملاحظاتك هنا..."
              value={feedbackNotes}
              onChange={(e) => setFeedbackNotes(e.target.value)}
            />
            <div className="flex gap-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  const notif = notifications.find(n => n.id === selectedNotifId)
                  if (notif && pendingStatus && notif.metadata?.enrollmentId) {
                    handleResponse(selectedNotifId!, notif.metadata.enrollmentId, pendingStatus, feedbackNotes)
                  }
                }}
              >
                إرسال
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowFeedbackModal(false)
                  setFeedbackNotes('')
                  setSelectedNotifId(null)
                  setPendingStatus(null)
                }}
              >
                إلغاء
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg p-12 text-center"
        >
          <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            لا توجد إشعارات
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {filter === 'all'
              ? 'ستظهر الإشعارات المهمة هنا عند توفرها'
              : 'لا توجد إشعارات من هذا النوع حالياً'
            }
          </p>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              عرض الكل
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default NotificationsPage
