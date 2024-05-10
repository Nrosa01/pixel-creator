import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const base = process.env.VITE_BASE ?? '/'

// https://vitejs.dev/config/
export default defineConfig({
  base: base,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  defineConfig: {
    optimizeDeps: {
      exclude: ['vue-demi']
    }
  }
})
