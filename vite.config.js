import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use VITE_BASE_PATH env var to override:
//   - GitHub Pages (default): /UK-Civil-Service-Pay/
//   - Netlify / custom domain: set VITE_BASE_PATH=/ in environment variables
const base = process.env.VITE_BASE_PATH ?? '/UK-Civil-Service-Pay/'

export default defineConfig({
  plugins: [react()],
  base,
})
