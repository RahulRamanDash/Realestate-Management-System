import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.VITE_BASE_PATH
  || (process.env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}/` : '/')

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    open: '/',
    host: 'localhost',
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (id.includes('react') || id.includes('scheduler')) {
            return 'react-vendor';
          }

          if (id.includes('react-router')) {
            return 'router-vendor';
          }

          if (id.includes('axios')) {
            return 'network-vendor';
          }

          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) {
            return 'motion-vendor';
          }

          if (id.includes('lucide-react') || id.includes('react-icons')) {
            return 'icons-vendor';
          }
        },
      },
    },
  },
})
