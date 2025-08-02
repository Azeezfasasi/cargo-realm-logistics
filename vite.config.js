import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { BACKEND_URL } from './src/config/Api'
import path from 'path'
import { fileURLToPath } from 'url'

// Fix __dirname for ESM environments
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
