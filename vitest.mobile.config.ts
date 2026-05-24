import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vitest.config.ts'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    include: ['**/*.touch.test.ts', '**/*.touch.test.tsx'],
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  }
}))
