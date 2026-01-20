// packages/services/src/api-client.ts
import axios, { type AxiosRequestConfig } from 'axios'
import { logger } from '@hr/utils'

const getApiBaseUrl = () => {
  const env = (import.meta as any).env
  if (env?.VITE_API_BASE_URL) {
    return env.VITE_API_BASE_URL
  }
  if (typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL) {
    return process.env.VITE_API_BASE_URL
  }
  return 'http://localhost:4000/api'
}

const getLandingPageUrl = () => {
  const env = (import.meta as any).env
  if (env?.VITE_LANDING_PAGE_URL) {
    return env.VITE_LANDING_PAGE_URL
  }
  if (typeof process !== 'undefined' && process.env?.VITE_LANDING_PAGE_URL) {
    return process.env.VITE_LANDING_PAGE_URL
  }
  return 'http://localhost:3005'
}

const getMockMode = () => {
  const env = (import.meta as any).env
  if (env?.VITE_MOCK_MODE) {
    return env.VITE_MOCK_MODE === 'true'
  }
  if (typeof process !== 'undefined' && process.env?.VITE_MOCK_MODE) {
    return process.env.VITE_MOCK_MODE === 'true'
  }
  return false
}

const API_BASE_URL = getApiBaseUrl()
const MOCK_MODE = getMockMode()
const LANDING_PAGE_URL = getLandingPageUrl()

export class ApiClient {
  private client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000
    // Removed static Content-Type header to allow dynamic handling
  })

  constructor() {
    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Dynamic Content-Type handling
        if (config.data instanceof FormData) {
          // For FormData, explicitly ensure no Content-Type is set
          // so the browser can set it with the correct boundary.
          if (config.headers) {
            delete config.headers['Content-Type'];
            delete config.headers['content-type'];
            if (typeof config.headers.set === 'function') {
              (config.headers as any).delete('Content-Type');
              (config.headers as any).delete('content-type');
            }
          }
          console.log('[DEBUG-CLIENT] FormData detected, cleared Content-Type');
        } else if (!config.headers['Content-Type'] && !config.headers['content-type']) {
          // Default to JSON for other requests
          config.headers['Content-Type'] = 'application/json';
        }

        logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          method: config.method,
          url: config.url,
          payload: config.data instanceof FormData ? '[FormData]' : JSON.stringify(config.data, null, 2)
        })

        return config
      },
      (error) => {
        logger.error('API Request Error', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.info(`API Response: ${response.status} ${response.config.url}`, {
          status: response.status,
          url: response.config.url,
          data: response.data
        })
        return response
      },
      (error) => {
        const errorData = {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
          response: error.response?.data
        }

        logger.error('API Response Error', errorData)

        if (error.response?.status === 401) {
          const isAuthRequest = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/signup-company')

          if (!isAuthRequest) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('user')
            window.location.href = `${LANDING_PAGE_URL}?mode=login`
          }
        }

        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    if (MOCK_MODE || localStorage.getItem('demo_mode') === 'true') {
      return this.mockResponse<T>(url, 'GET', config?.params)
    }

    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    if (MOCK_MODE || localStorage.getItem('demo_mode') === 'true') {
      return this.mockResponse<T>(url, 'POST', data)
    }

    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    if (MOCK_MODE || localStorage.getItem('demo_mode') === 'true') {
      return this.mockResponse<T>(url, 'PUT', data)
    }

    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    if (MOCK_MODE || localStorage.getItem('demo_mode') === 'true') {
      return this.mockResponse<T>(url, 'PATCH', data)
    }

    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    if (MOCK_MODE || localStorage.getItem('demo_mode') === 'true') {
      return this.mockResponse<T>(url, 'DELETE')
    }

    const response = await this.client.delete<T>(url, config)
    return response.data
  }

  private async mockResponse<T>(url: string, method: string, data?: any): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500))

    // Import mock data
    const mockData = await import('./mocks/index.js')

    // Find matching mock handler
    const handler = mockData.findHandler(url, method)
    if (handler) {
      return handler(data) as T
    }

    // Default mock response
    return {
      success: true,
      message: 'Mock response',
      data: {}
    } as T
  }
}

export const apiClient = new ApiClient()