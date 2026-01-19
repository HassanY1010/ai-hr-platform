// apps/employee-pwa/src/store/employee.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DailyQuestion, EmployeeTask, EmployeeTraining } from '@hr/types'

interface EmployeeState {
  dailyQuestion: DailyQuestion | null
  tasks: EmployeeTask[]
  trainings: EmployeeTraining[]
  hasCompletedDailyQuestion: boolean
  setDailyQuestion: (question: DailyQuestion) => void
  answerDailyQuestion: (answer: string | number) => void
  setTasks: (tasks: EmployeeTask[]) => void
  setTrainings: (trainings: EmployeeTraining[]) => void
  addTask: (task: EmployeeTask) => void
  updateTask: (taskId: string, updates: Partial<EmployeeTask>) => void
  completeTask: (taskId: string) => void
  deleteTask: (taskId: string) => void
}

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set) => ({
      dailyQuestion: null,
      tasks: [],
      trainings: [],
      hasCompletedDailyQuestion: false,

      setDailyQuestion: (question) => {
        const today = new Date().toISOString().split('T')[0]
        const hasCompleted = !!(question.answeredAt &&
          new Date(question.answeredAt).toISOString().startsWith(today))

        set({
          dailyQuestion: question,
          hasCompletedDailyQuestion: hasCompleted
        })
      },

      answerDailyQuestion: (answer) => {
        set((state) => ({
          dailyQuestion: state.dailyQuestion ? {
            ...state.dailyQuestion,
            answer,
            answeredAt: new Date().toISOString()
          } : null,
          hasCompletedDailyQuestion: true
        }))
      },

      setTasks: (tasks) => set({ tasks }),
      setTrainings: (trainings) => set({ trainings }),

      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, task]
      })),

      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      })),

      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== taskId)
      })),

      completeTask: (taskId) => set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === taskId
            ? { ...task, status: 'completed', completedDate: new Date().toISOString() }
            : task
        )
      }))
    }),
    {
      name: 'employee-storage',
      partialize: (state) => ({
        hasCompletedDailyQuestion: state.hasCompletedDailyQuestion,
        tasks: state.tasks
      })
    }
  )
)