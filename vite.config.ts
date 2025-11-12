import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

// Get git commit hash at build time
const getGitHash = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch (error) {
    return 'dev'
  }
}

export default defineConfig({
  plugins: [react()],
  base: '/kids-drawing-app/',
  define: {
    __COMMIT_HASH__: JSON.stringify(getGitHash())
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