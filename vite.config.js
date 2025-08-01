import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { BACKEND_URL } from './src/config/Api'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: BACKEND_URL, // ✅ your backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
