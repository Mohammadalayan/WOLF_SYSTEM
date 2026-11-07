import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // أو أي رقم بدك يا
    watch: {
      usePolling: true, // هيدي بتخليه يعمل تحديث لحاله بدون ما تضطر تسكر السيرفر
    },
  },
})