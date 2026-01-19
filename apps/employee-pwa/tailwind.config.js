// apps/employee-pwa/tailwind.config.ts
import type { Config } from 'tailwindcss'
import baseConfig from '@hr/tailwind-config'

export default {
    ...baseConfig,
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        ...baseConfig.theme,
        extend: {
            ...(baseConfig.theme?.extend || {}),
            colors: {
                ...(baseConfig.theme?.extend?.colors || {}),
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554'
                }
            }
        }
    }
} satisfies Config
