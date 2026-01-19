// packages/services/src/ai.service.ts
import { apiClient } from './api-client'
import type { AIDecision, AIAnalysis, AIModel, AIUsage } from '@hr/types'
import { logger } from '@hr/utils'

class AIService {
  async analyzeRecruitment(candidateId: string): Promise<AIDecision> {
    logger.aiAction('analyze_recruitment', { candidateId })
    
    return apiClient.post<AIDecision>(`/ai/recruitment/analyze`, {
      candidateId
    })
  }

  async analyzeEmployee(userId: string): Promise<AIDecision> {
    logger.aiAction('analyze_employee', { userId })
    
    return apiClient.post<AIDecision>(`/ai/employee/analyze`, {
      userId
    })
  }

  async detectRisks(companyId: string): Promise<AIDecision[]> {
    logger.aiAction('detect_risks', { companyId })
    
    return apiClient.post<AIDecision[]>(`/ai/risks/detect`, {
      companyId
    })
  }

  async optimizeJobDescription(jobDescription: string): Promise<{
    optimized: string
    improvements: string[]
    keywords: string[]
  }> {
    logger.aiAction('optimize_job_description', { length: jobDescription.length })
    
    return apiClient.post(`/ai/jobs/optimize`, {
      description: jobDescription
    })
  }

  async analyzeDailyQuestions(companyId: string): Promise<{
    overallSentiment: number
    riskAreas: string[]
    recommendations: string[]
  }> {
    logger.aiAction('analyze_daily_questions', { companyId })
    
    return apiClient.get(`/ai/questions/analyze`, {
      params: { companyId }
    })
  }

  async getModels(): Promise<AIModel[]> {
    return apiClient.get<AIModel[]>('/ai/models')
  }

  async getUsage(period: 'day' | 'week' | 'month'): Promise<AIUsage[]> {
    return apiClient.get<AIUsage[]>('/ai/usage', {
      params: { period }
    })
  }

  async getAnalysis(id: string): Promise<AIAnalysis> {
    return apiClient.get<AIAnalysis>(`/ai/analysis/${id}`)
  }

  async explainDecision(decisionId: string): Promise<{
    explanation: string
    factors: Array<{
      name: string
      weight: number
      impact: 'positive' | 'negative' | 'neutral'
    }>
    confidence: number
  }> {
    logger.aiAction('explain_decision', { decisionId })
    
    return apiClient.get(`/ai/decisions/${decisionId}/explain`)
  }
}

export const aiService = new AIService()