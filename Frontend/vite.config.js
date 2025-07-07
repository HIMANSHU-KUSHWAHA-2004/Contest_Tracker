import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // ✅ Very important
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html', // ✅ No need for input.main, just use string
    },
  },
})
