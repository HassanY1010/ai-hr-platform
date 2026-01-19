// packages/services/src/recruitment.service.ts
import { apiClient } from './api-client'
import type { Job, Candidate, Interview } from '@hr/types'
import { logger } from '@hr/utils'

class RecruitmentService {
  async getJobs(params?: {
    status?: string
    department?: string
    search?: string
  }): Promise<Job[]> {
    const response = await apiClient.get<{ status: string, data: { jobs: any[] } }>('/recruitment/jobs', { params })
    return response.data.jobs.map((job: any) => ({
      ...job,
      applicantsCount: job._count?.candidates || 0
    }))
  }

  async getPublicJobs(): Promise<Job[]> {
    const response = await apiClient.get<{ status: string, data: { jobs: any[] } }>('/recruitment/jobs/public')
    return response.data.jobs
  }

  async getPublicJob(id: string): Promise<Job> {
    const response = await apiClient.get<{ status: string, data: { job: Job } }>(`/recruitment/jobs/public/${id}`)
    return response.data.job
  }

  async getJob(id: string): Promise<Job> {
    const response = await apiClient.get<{ status: string, data: { job: Job } }>(`/recruitment/jobs/${id}`)
    return response.data.job
  }

  async createJob(data: Partial<Job>): Promise<Job> {
    logger.info('Create job', { title: data.title })
    const response = await apiClient.post<{ status: string, data: { job: Job } }>('/recruitment/jobs', data)
    return response.data.job
  }

  async updateJob(id: string, data: Partial<Job>): Promise<Job> {
    logger.info('Update job', { id, title: data.title })
    const response = await apiClient.put<{ status: string, data: { job: Job } }>(`/recruitment/jobs/${id}`, data)
    return response.data.job
  }

  async deleteJob(id: string): Promise<void> {
    logger.info('Delete job', { id })
    await apiClient.delete(`/recruitment/jobs/${id}`)
  }

  async publishJob(id: string): Promise<Job> {
    logger.info('Publish job', { id })
    const response = await apiClient.post<{ status: string, data: { job: Job } }>(`/recruitment/jobs/${id}/publish`)
    return response.data.job
  }

  async generateAiJobDescription(title: string, skills?: string[]): Promise<string> {
    logger.info('Generate AI Job Description', { title })
    const response = await apiClient.post<{ status: string, data: { aiDescription: string } }>('/recruitment/ai/generate-description', { title, skills })
    return response.data.aiDescription
  }

  async getDailyRecruitmentAnalysis(): Promise<{
    cvAnalyzedToday: number
    highMatchCandidates: number
    activeJobs: number
    accuracy: number
  }> {
    logger.info('Get Daily Recruitment Analysis')
    const response = await apiClient.get<{ status: string, data: any }>('/recruitment/ai/daily-analysis')
    return response.data
  }

  async getCandidates(jobId?: string, params?: {
    status?: string
    search?: string
  }): Promise<Candidate[]> {
    const response = await apiClient.get<{ status: string, data: { candidates: any[] } }>('/recruitment/candidates', {
      params: { jobId, ...params }
    })
    return response.data.candidates.map((c: any) => ({
      ...c,
      position: c.recruitmentjob?.title || 'غير محدد',
      location: c.location || c.recruitmentjob?.location || 'غير محدد'
    }))
  }

  async getCandidate(id: string): Promise<Candidate> {
    const response = await apiClient.get<{ status: string, data: { candidate: Candidate } }>(`/recruitment/candidates/${id}`)
    return response.data.candidate
  }

  async getCandidateByCode(code: string): Promise<Candidate> {
    const response = await apiClient.get<{ status: string, data: { candidate: Candidate } }>(`/recruitment/interviews/code/${code}`)
    return response.data.candidate
  }

  async getInterviewQuestions(code: string): Promise<string[]> {
    logger.info('Get interview questions', { code })
    const response = await apiClient.get<{ status: string, data: { questions: string[] } }>(`/recruitment/interviews/${code}/questions`)
    return response.data.questions
  }

  async createCandidate(data: Partial<Candidate>): Promise<Candidate & { interviewCode: string }> {
    logger.info('Create candidate', { name: data.name })
    const response = await apiClient.post<{ status: string, data: { candidateId: string, interviewCode: string } }>(`/recruitment/jobs/${data.jobId}/apply`, data)
    return { ...data, id: response.data.candidateId, interviewCode: response.data.interviewCode } as any
  }

  async updateCandidate(id: string, data: Partial<Candidate>): Promise<Candidate> {
    logger.info('Update candidate', { id, name: data.name })
    const response = await apiClient.put<{ status: string, data: { candidate: Candidate } }>(`/recruitment/candidates/${id}`, data)
    return response.data.candidate
  }

  async deleteCandidate(id: string): Promise<void> {
    logger.info('Delete candidate', { id })
    await apiClient.delete(`/recruitment/candidates/${id}`)
  }

  async uploadResume(file: File, candidateId: string): Promise<{
    url: string
    aiAnalysis: any
  }> {
    logger.info('Upload resume', { candidateId, fileName: file.name })

    const formData = new FormData()
    formData.append('resume', file)

    const response = await apiClient.post<{
      status: string
      data: {
        candidate: Candidate
        aiAnalysis: any
      }
    }>(`/recruitment/candidates/${candidateId}/upload-resume`, formData)

    return {
      url: response.data.candidate.resumeUrl || '',
      aiAnalysis: response.data.aiAnalysis
    }
  }

  async getSmartInterviewNotes(): Promise<string[]> {
    logger.info('Get smart interview notes')
    const response = await apiClient.get<{ status: string, data: { notes: string[] } }>('/recruitment/interviews/ai/smart-notes')
    return response.data.notes
  }

  async parseCV(file: File): Promise<{
    name: string
    email: string
    phone: string
    title: string
    experience: number
    location: string
  }> {
    logger.info('Parse CV', { fileName: file.name })
    const formData = new FormData()
    formData.append('resume', file)

    const response = await apiClient.post<{
      status: string
      data: {
        extracted: {
          name: string
          email: string
          phone: string
          title: string
          experience: number
          location: string
        }
      }
    }>('/recruitment/parse-cv', formData)

    return response.data.extracted
  }

  async acceptTerms(candidateId: string): Promise<void> {
    logger.info('Accept terms', { candidateId })
    await apiClient.post('/recruitment/candidates/terms', { candidateId })
  }

  async submitInterviewFeedback(interviewId: string, rating: number, feedback: string): Promise<void> {
    logger.info('Submit feedback', { interviewId, rating })
    await apiClient.post(`/recruitment/interviews/${interviewId}/feedback`, { rating, feedback })
  }

  async uploadInterviewVideo(file: Blob, candidateId: string): Promise<{ url: string }> {
    logger.info('Upload interview video', { candidateId })
    const formData = new FormData()
    formData.append('video', file, 'interview.webm')

    const response = await apiClient.post<{ status: string, data: { url: string } }>('/recruitment/interviews/upload-video-file', formData)
    return response.data
  }

  async scheduleInterview(data: Partial<Interview>): Promise<Interview> {
    logger.info('Schedule interview', { candidateId: data.candidateId })
    const response = await apiClient.post<{ status: string, data: { interview: Interview } }>('/recruitment/interviews', data)
    return response.data.interview
  }

  async submitInterview(data: { candidateId: string, videoUrl?: string, notes?: string }): Promise<Interview> {
    logger.info('Submit interview', { candidateId: data.candidateId })
    const response = await apiClient.post<{ status: string, data: { interview: Interview } }>('/recruitment/interviews/submit', data)
    return response.data.interview
  }

  async getInterviews(params?: {
    status?: string
    from?: string
    to?: string
  }): Promise<Interview[]> {
    const response = await apiClient.get<{ status: string, data: { interviews: any[] } }>('/recruitment/interviews', { params })
    return response.data.interviews.map((interview: any) => ({
      ...interview,
      candidateName: interview.candidate?.name || 'Unknown',
      jobId: interview.candidate?.jobId,
    }))
  }

  async evaluateInterview(candidateId: string, notes: string): Promise<Interview> {
    logger.info('Evaluate interview', { candidateId })
    // Re-mapped to submit for now if using public flow
    const response = await apiClient.post<{ status: string, data: { interview: Interview } }>('/recruitment/interviews/submit', { candidateId, notes })
    return response.data.interview
  }

  async updateInterview(id: string, data: Partial<Interview>): Promise<Interview> {
    logger.info('Update interview', { id })
    const response = await apiClient.put<{ status: string, data: { interview: Interview } }>(`/recruitment/interviews/${id}`, data)
    return response.data.interview
  }

  async deleteInterview(id: string): Promise<void> {
    logger.info('Delete interview', { id })
    // Currently no direct delete route in backend for interview alone, but we can add one or use a workaround.
    // However, the user asked for "Delete Action" on Interviews page.
    // I need to add DELETE /interviews/:id route in backend too?
    // Wait, I missed adding DELETE /interviews/:id in backend plan?
    // Yes, I did. I added deleteCandidate but not deleteInterview.
    // I should add it now to backend first or just assume it exists?
    // The user said "Delete functionality for each job", "Delete candidate fully".
    // For interviews: "Actions... fully functional". This implies Delete.
    // I will add the route to backend as well.
    await apiClient.delete(`/recruitment/interviews/${id}`)
  }
}

export const recruitmentService = new RecruitmentService()