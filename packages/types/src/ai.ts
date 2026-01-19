// packages/types/src/ai.ts
export interface AIDecision {
  id: string
  score: number
  confidence: number
  decision: string
  reasons: string[]
  insights: string[]
  type: 'recruitment' | 'employee' | 'risk' | 'opportunity'
  metadata: {
    model: string
    version: string
    tokens: number
    processingTime: number
    cost: number
  }
  createdAt: string
}

export interface AIAnalysis {
  id: string
  userId?: string
  candidateId?: string
  type: 'daily-question' | 'performance' | 'recruitment' | 'risk'
  input: Record<string, any>
  output: AIDecision
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error?: string
}

export interface AIModel {
  id: string
  name: string
  version: string
  description: string
  capabilities: string[]
  costPerToken: number
  maxTokens: number
  isActive: boolean
  accuracy: number
  latency: number
}

export interface AIUsage {
  date: string
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  totalTokens: number
  totalCost: number
  averageLatency: number
  topModels: Array<{
    modelId: string
    requests: number
    cost: number
  }>
}