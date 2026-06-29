import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// base ต้องตรงกับ path ของ GitHub Pages: https://<user>.github.io/ToDo-list-/
export default defineConfig({
  base: '/ToDo-list-/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'ToDo List — รายการสิ่งที่ต้องทำ',
        short_name: 'ToDo List',
        description: 'แอปจัดการรายการสิ่งที่ต้องทำ ใช้งานได้แบบออฟไลน์',
        lang: 'th',
        theme_color: '#4f46e5',
        background_color: '#f4f6fb',
        display: 'standalone',
        orientation: 'portrait',
        // start_url/scope จะถูกเติม base ('/ToDo-list-/') ให้อัตโนมัติ
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // precache ไฟล์ static ทั้งหมด เพื่อให้เปิดแบบออฟไลน์ได้
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
})
