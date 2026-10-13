import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Exposes to local network (0.0.0.0) so iOS devices on Wi-Fi can connect
    port: 5175, // Different from admin side (5174)
  }
})
