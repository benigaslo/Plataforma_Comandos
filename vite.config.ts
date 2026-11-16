import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages base URL for repository Plataforma_Comandos:
  base: process.env.NODE_ENV === 'production' ? '/Plataforma_Comandos/' : '/',
});
