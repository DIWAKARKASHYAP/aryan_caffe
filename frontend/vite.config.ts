import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { normalizeBaseApi } from './global.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = normalizeBaseApi(env.VITE_BASE_API)

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
