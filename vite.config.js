import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base ต้องตรงกับ path ของ GitHub Pages: https://<user>.github.io/ToDo-list-/
export default defineConfig({
  base: '/ToDo-list-/',
  plugins: [react()],
})
