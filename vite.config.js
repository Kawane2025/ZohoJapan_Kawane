import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const GAS = process.env.GAS_URL || 'https://script.google.com/macros/s/AKfycbwvl6bQrAe4JUNanJJamkfS9TfXvUlIv9PkUKWoocz-sQQOPa4OleZuafOj3vWaV17K/exec'
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api/events': { target: GAS, changeOrigin: true, rewrite: ()=>'{GAS}?action=events'.replace('{GAS}', GAS)}, '/api/register': { target: GAS, changeOrigin: true, rewrite: ()=>'{GAS}?action=register'.replace('{GAS}', GAS)} } },
  build: { outDir: 'dist' }
})