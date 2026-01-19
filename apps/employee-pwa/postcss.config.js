// apps/employee-pwa/postcss.config.js
import tailwindConfig from '@hr/tailwind-config'

export default {
  plugins: {
    tailwindcss: tailwindConfig,
    autoprefixer: {}
  }
}