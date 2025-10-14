import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vitest.config.ts'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    include: ['src/components/Games/**/*.test.tsx'],
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      include: ['src/components/Games/**/*.{ts,tsx}']
    }
  }
}))
