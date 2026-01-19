// apps/owner-dashboard/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@hr/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@hr/services': path.resolve(__dirname, '../../packages/services/src'),
      '@hr/types': path.resolve(__dirname, '../../packages/types/src'),
      '@hr/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@hr/constants': path.resolve(__dirname, '../../packages/constants/src')
    }
  },
  server: {
    port: 3004,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', '@hr/ui'],
          charts: ['recharts']
        }
      }
    }
  }
})