import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Get git commit hash from environment variable (set by GitHub Actions)
// Falls back to 'test' for test environment
const commitHash = process.env.VITE_COMMIT_HASH || 'test'

export default defineConfig({
  plugins: [react()],
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash)
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['**/tests/e2e/**', '**/node_modules/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/*.test.tsx']
    }
  }
})
