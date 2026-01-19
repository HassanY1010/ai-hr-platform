// apps/employee-pwa/src/modules/daily-question/components/QuickStats.tsx
import React from 'react'
import { Card, CardContent } from '@hr/ui'
import { useEmployeeStore } from '../../../store/employee.store'
import { CheckCircle, Clock, TrendingUp, Award } from 'lucide-react'

const QuickStats: React.FC = () => {
  const { tasks } = useEmployeeStore()

  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length
  const streakDays = 7 // Mock data
  const totalPoints = 245 // Mock data

  const stats = [
    {
      icon: CheckCircle,
      label: 'مهام مكتملة',
      value: completedTasks,
      color: 'text-success-600',
      bg: 'bg-success-50'
    },
    {
      icon: Clock,
      label: 'مهام قيد الانتظار',
      value: pendingTasks,
      color: 'text-warning-600',
      bg: 'bg-warning-50'
    },
    {
      icon: TrendingUp,
      label: 'أيام متتالية',
      value: streakDays,
      color: 'text-primary-600',
      bg: 'bg-primary-50'
    },
    {
      icon: Award,
      label: 'نقاط',
      value: totalPoints,
      color: 'text-secondary-600',
      bg: 'bg-secondary-50'
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">
                  {stat.value}
                </p>
                <p className="text-xs text-neutral-500">
                  {stat.label}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default QuickStats