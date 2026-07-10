import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  // Default base is root for the standalone Firebase Hosting site (isocial-e5297).
  // The illyrobotic-ai.com apex CI overrides this with `--base=/isocial/`.
  base: '/',
  plugins: [react()],
})
