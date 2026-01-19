// packages/services/src/employee.service.ts
import { apiClient } from './api-client'
import type {
  DailyQuestion,
  EmployeeTask,
  EmployeeTraining,
  EmployeePerformance,
  RiskAlert,
  Employee
} from '@hr/types'
import { logger } from '@hr/utils'

class EmployeeService {
  async getMe(): Promise<{ employee: Employee }> {
    const response = await apiClient.get<{ status: string, data: { employee: Employee } }>('/employees/me')
    return response.data
  }

  async getAllEmployees(): Promise<Employee[]> {
    const response = await apiClient.get<{ status: string, data: Employee[] }>('/employees')
    return response.data || []
  }

  async createEmployee(data: Partial<Employee> & { email?: string, name?: string }): Promise<Employee> {
    logger.info('Create employee', { email: data.email })
    const response = await apiClient.post<{ status: string, data: { employee: Employee } }>('/employees', data)
    return response.data.employee
  }

  async bulkCreateEmployees(employees: any[]): Promise<{ createdCount: number, errorCount: number, errors?: any[] }> {
    logger.info('Bulk create employees', { count: employees.length })
    const response = await apiClient.post<{ status: string, data: any }>('/employees/bulk', { employees })
    return response.data
  }

  async updateEmployee(id: string, data: any): Promise<Employee> {
    logger.info('Update employee', { id })
    const response = await apiClient.patch<{ status: string, data: Employee }>(`/employees/${id}`, data)
    return response.data
  }

  async deleteEmployee(id: string): Promise<void> {
    logger.info('Delete employee', { id })
    await apiClient.delete(`/employees/${id}`)
  }



  async getDailyQuestion(userId: string): Promise<DailyQuestion[]> {
    const response = await apiClient.get<{ status: string, data: DailyQuestion[] }>(`/employees/${userId}/daily-question`)
    return response.data || []
  }

  async answerDailyQuestion(
    userId: string,
    questionId: string,
    answer: string | number
  ): Promise<DailyQuestion> {
    logger.info('Answer daily question', { userId, questionId })

    const response = await apiClient.post<{ status: string, data: DailyQuestion }>(
      `/employees/${userId}/daily-question/${questionId}/answer`,
      { answer }
    )
    return response.data
  }

  async getTasks(userId: string, params?: {
    status?: string
    priority?: string
  }): Promise<EmployeeTask[]> {
    const response = await apiClient.get<any>(`/employees/${userId}/tasks`, { params })

    // Logic to handle both { data: tasks[] } and { data: { tasks: tasks[] } }
    if (response && response.data) {
      if (Array.isArray(response.data)) {
        return response.data
      }
      if (response.data.tasks && Array.isArray(response.data.tasks)) {
        return response.data.tasks
      }
    }

    return []
  }

  async createTask(userId: string, data: Partial<EmployeeTask>): Promise<EmployeeTask> {
    logger.info('Create task', { userId, title: data.title })
    const response = await apiClient.post<{ status: string, data: { task: EmployeeTask } }>(`/employees/${userId}/tasks`, data)
    return response.data.task
  }

  async updateTask(
    userId: string,
    taskId: string,
    data: Partial<EmployeeTask>
  ): Promise<EmployeeTask> {
    logger.info('Update task', { userId, taskId })
    const response = await apiClient.put<{ status: string, data: { task: EmployeeTask } }>(`/employees/${userId}/tasks/${taskId}`, data)
    return response.data.task
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    logger.info('Delete task', { userId, taskId })
    await apiClient.delete(`/employees/${userId}/tasks/${taskId}`)
  }

  async completeTask(userId: string, taskId: string): Promise<EmployeeTask> {
    logger.info('Complete task', { userId, taskId })
    const response = await apiClient.post<{ status: string, data: { task: EmployeeTask } }>(`/employees/${userId}/tasks/${taskId}/complete`)
    return response.data.task
  }

  async getTrainings(userId: string): Promise<EmployeeTraining[]> {
    const response = await apiClient.get<{ status: string, data: { trainings: EmployeeTraining[] } }>(`/employees/${userId}/trainings`)
    return response.data?.trainings || []
  }

  async startTraining(userId: string, trainingId: string): Promise<EmployeeTraining> {
    logger.info('Start training', { userId, trainingId })
    const response = await apiClient.post<{ status: string, data: { training: EmployeeTraining } }>(
      `/employees/${userId}/trainings/${trainingId}/start`
    )
    return response.data.training
  }

  async completeTraining(
    userId: string,
    trainingId: string,
    score: number
  ): Promise<EmployeeTraining> {
    logger.info('Complete training', { userId, trainingId, score })

    const response = await apiClient.post<{ status: string, data: { training: EmployeeTraining } }>(
      `/employees/${userId}/trainings/${trainingId}/complete`,
      { score }
    )
    return response.data.training
  }

  async getPerformance(userId: string): Promise<EmployeePerformance> {
    const response = await apiClient.get<{ status: string, data: { performance: EmployeePerformance } }>(`/employees/${userId}/performance`)
    return response.data.performance
  }

  async getAlerts(companyId: string, params?: {
    level?: string
    status?: string
  }): Promise<RiskAlert[]> {
    return apiClient.get<RiskAlert[]>('/alerts', {
      params: { companyId, ...params }
    })
  }

  async acknowledgeAlert(alertId: string): Promise<RiskAlert> {
    logger.info('Acknowledge alert', { alertId })
    const response = await apiClient.post<{ status: string, data: RiskAlert }>(`/alerts/${alertId}/acknowledge`)
    return response.data
  }

  async resolveAlert(alertId: string, notes?: string): Promise<RiskAlert> {
    logger.info('Resolve alert', { alertId })
    const response = await apiClient.post<{ status: string, data: RiskAlert }>(`/alerts/${alertId}/resolve`, { notes })
    return response.data
  }

  async getNotifications(employeeId: string): Promise<any[]> {
    const response = await apiClient.get<any>(`/employees/${employeeId}/notifications`)

    // Support multiple formats: response.data.notifications, response.data, or response directly
    if (response) {
      if (Array.isArray(response)) return response
      if (response.notifications && Array.isArray(response.notifications)) return response.notifications
      if (response.data) {
        if (Array.isArray(response.data)) return response.data
        if (response.data.notifications && Array.isArray(response.data.notifications)) return response.data.notifications
      }
    }

    return []
  }

  async updateMe(data: { name?: string, phone?: string, bio?: string }): Promise<any> {
    logger.info('Update current user profile')
    const response = await apiClient.patch<{ status: string, data: any }>('/employees/me', data)
    return response.data
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    logger.info('Change user password')
    const response = await apiClient.post<{ status: string, data: any }>('/employees/change-password', { oldPassword, newPassword })
    return response.data
  }
}

export const employeeService = new EmployeeService()