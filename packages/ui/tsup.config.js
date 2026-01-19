// packages/ui/tsup.config.js
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'framer-motion'],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";'
    }
  }
})