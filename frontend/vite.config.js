import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Proxy API calls to the Express backend during local development
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
