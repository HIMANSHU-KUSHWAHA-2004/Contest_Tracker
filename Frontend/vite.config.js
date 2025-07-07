import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  // This is crucial for SPA routing
  preview: {
    port: 3000,
    strictPort: true,
    host: true
  }
})

// Alternative: If you need more control over the build process
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     outDir: 'dist',
//     rollupOptions: {
//       input: {
//         main: './index.html'
//       }
//     }
//   },
//   server: {
//     historyApiFallback: true
//   }
// })