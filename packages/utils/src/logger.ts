// packages/utils/src/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  userId?: string
  action?: string
}

class Logger {
  private isDev: boolean

  constructor() {
    this.isDev = process.env.NODE_ENV === 'development' || false
  }

  private log(level: LogLevel, message: string, data?: any, userId?: string, action?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userId,
      action
    }

    if (this.isDev || level === 'error') {
      const consoleMethod = level === 'error' ? 'error' :
        level === 'warn' ? 'warn' :
          level === 'info' ? 'info' : 'log'

      console[consoleMethod](`[HR-Platform] ${message}`, data || '')
    }

    this.sendToServer(entry)
  }

  private async sendToServer(entry: LogEntry) {
    try {
      if (this.isDev) return

      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      })
    } catch (error) {
      // Silent fail for logging errors
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data)
  }

  info(message: string, data?: any, userId?: string, action?: string) {
    this.log('info', message, data, userId, action)
  }

  warn(message: string, data?: any, userId?: string, action?: string) {
    this.log('warn', message, data, userId, action)
  }

  error(message: string, data?: any, userId?: string, action?: string) {
    this.log('error', message, data, userId, action)
  }

  aiAction(action: string, data: any, userId?: string) {
    this.info(`AI Action: ${action}`, data, userId, 'ai-action')
  }
}

export const logger = new Logger()