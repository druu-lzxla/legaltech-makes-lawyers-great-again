import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 可选：若你启动了本地 mock 后端（默认 http://localhost:5174），这里会把 /api 转发过去
      '/api': 'http://localhost:5174',
    },
  },
})
