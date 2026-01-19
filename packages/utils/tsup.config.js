// packages/utils/tsup.config.js
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    '@hr/types'  // اعتبار @hr/types كحزمة خارجية وعدم bundling لها
  ]
})
