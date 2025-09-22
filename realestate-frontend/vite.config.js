import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Realestate-Management-System/', // ← Add this for GitHub Pages
  plugins: [react()],
  server: {
    open: '/',
    host: 'localhost',
    port: 3000,
  },
})