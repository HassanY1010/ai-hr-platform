// packages/types/src/recruitment.ts
import { AIDecision } from './ai'
export type JobStatus = 'OPEN' | 'CLOSED' | 'ON_HOLD' | 'draft' | 'published' | 'archived'
export type CandidateStatus = 'NEW' | 'PRE_ACCEPTED' | 'SCREENING' | 'INTERVIEWING' | 'OFFERED' | 'REJECTED' | 'HIRED' | 'ACCEPTED' | 'new' | 'reviewed' | 'interview' | 'hired' | 'rejected' | 'screening' | 'interviewing' | 'offered' | 'accepted' | 'pre_accepted'
export type InterviewType = 'VIDEO' | 'TEXT' | 'technical' | 'behavioral' | 'hr' | 'final' | 'online' | 'in_person' | 'cultural'

export interface Job {
  id: string
  title: string
  department: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'remote'
  description: string
  aiDescription?: string // AI suggested description
  requirements: string[] | any
  responsibilities: string[] | any
  salaryRange: {
    min: number
    max: number
    currency: string
  } | any
  status: JobStatus
  aiOptimizedDescription?: string
  skills: string[]
  experience: string
  education: string
  createdBy: string
  createdAt: string
  updatedAt: string
  applicantsCount: number
  publishedAt?: string
}

export interface Candidate {
  id: string
  jobId: string
  name: string
  email: string
  phone?: string
  resumeUrl: string
  resumePath?: string // Local path to uploaded resume file
  coverLetter?: string
  status: CandidateStatus
  interviewCode?: string // Unique code for accessing interview
  score: number
  aiScore?: number
  aiSummary?: string
  aiStatus?: string // AI-driven status (e.g. recommended)
  aiRecommendation?: string
  aiAnalysis?: AIDecision
  aiAnalysisDetails?: any // Detailed AI analysis results from resume parsing
  skills: string[]
  experience: number
  education: string[]
  interviewScheduled?: string
  interviewType?: InterviewType
  interviewNotes?: string
  offeredSalary?: number
  joinedDate?: string
  createdAt: string
  updatedAt: string
  metadata: {
    source: string
    parsedResume: Record<string, any>
    matchPercentage: number
  }
  // Mapped properties from job relation (added by service layer)
  position?: string
  location?: string
  job?: Job
}

export interface Interview {
  id: string
  candidateId: string
  candidateName?: string
  jobId: string
  type: InterviewType
  scheduledAt: string
  date?: string
  time?: string
  duration: number
  interviewerId: string
  interviewerName?: string
  platform?: string
  meetingLink?: string
  videoUrl?: string // For recorded video interviews
  status: 'scheduled' | 'completed' | 'cancelled'
  completed?: boolean // Legacy field for compatibility
  notes?: string
  aiAnalysis?: any // AI evaluation results
  aiFeedback?: {
    communication: number
    technical: number
    cultural: number
    overall: number
    feedback: string
  }
  aiInsights?: string
  createdAt: string
  // Mapped properties from candidate relation (added by service layer)
  position?: string
  candidate?: Candidate // Full candidate object from relation
}
