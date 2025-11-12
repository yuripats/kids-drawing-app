import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get git commit hash from environment variable (set by GitHub Actions)
// Falls back to 'dev' for local development
const commitHash = process.env.VITE_COMMIT_HASH || 'dev'

export default defineConfig({
  plugins: [react()],
  base: '/kids-drawing-app/',
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash)
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})