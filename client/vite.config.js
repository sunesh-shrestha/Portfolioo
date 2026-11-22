import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Week 9 slides: proxy /api and /auth calls to the Express server on port 3000
const { PORT = 3000 } = process.env;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      },
      '/auth': {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      },
    },
  },
})
