// apps/employee-pwa/src/App.tsx
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@hr/ui'
import { AuthProvider } from './providers/AuthProvider'
import AppRoutes from './routes'
import { Toaster } from 'sonner'
import { CheckInModal } from './components/CheckInModal'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
})

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes />
            <CheckInModal />
            <Toaster
              position="top-center"
              richColors
              closeButton
              expand={false}
              toastOptions={{
                className: 'rtl:text-right'
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App