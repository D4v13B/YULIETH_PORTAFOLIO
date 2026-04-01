import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub Pages (proyecto): el sitio vive en /REPO/, no en la raíz del dominio.
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/YULIETH_PORTAFOLIO/',
  plugins: [react()],
}))
