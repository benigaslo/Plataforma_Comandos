import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Rutas relativas para funcionar en cualquier repositorio (gasensios, benigaslo o local):
  base: './',
});
