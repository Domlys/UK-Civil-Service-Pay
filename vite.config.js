import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In development, serve from root '/' for a smooth local experience.
// In production builds:
//   - GitHub Pages (default): /UK-Civil-Service-Pay/
//   - Netlify / custom domain: set VITE_BASE_PATH=/ in environment variables
const base = process.env.NODE_ENV === 'development'
  ? '/'
  : (process.env.VITE_BASE_PATH ?? '/UK-Civil-Service-Pay/')

export default defineConfig({
  plugins: [react()],
  base,
})
