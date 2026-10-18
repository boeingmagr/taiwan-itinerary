import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

// GitHub Pages project sites are served from /<repo-name>/. Local dev serves
// from the root, so `base` is only applied for production builds.
const GITHUB_PAGES_BASE = '/taiwan-itinerary/'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? GITHUB_PAGES_BASE : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.ts'],
    setupFiles: ['./src/__tests__/setup.ts'],
    restoreMocks: true,
  },
}))
