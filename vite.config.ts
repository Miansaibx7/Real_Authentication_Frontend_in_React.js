import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['recharts', 'date-fns'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})