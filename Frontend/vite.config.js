import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // ✅ CRITICAL: ensures JS loads correctly on all routes
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
    host: true,
  },
})
