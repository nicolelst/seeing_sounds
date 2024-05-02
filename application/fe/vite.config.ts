import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import portConfig from '../port_config.json'; 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "localhost",
    port: portConfig.fe,
    strictPort: true,
    open: true,
  },
})
