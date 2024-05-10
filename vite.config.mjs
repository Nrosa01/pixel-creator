import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const base = process.env.VITE_BASE ?? '/'

// https://vitejs.dev/config/
export default defineConfig({
  base: base,
  plugins: [vue()],
  defineConfig: {
    optimizeDeps: {
      exclude: ['vue-demi']
    }
  }
})
