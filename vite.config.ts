import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // Escucha en 0.0.0.0 (toda la red)
    allowedHosts: ['cibertrivia.flotalamacarena.com'], // Permite cualquier hostname/dominio de red
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
