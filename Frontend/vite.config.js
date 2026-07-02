import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  base: '/illysocialV2/',
  plugins: [react()],
})
