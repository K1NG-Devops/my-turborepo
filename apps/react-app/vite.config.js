import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/home',
  plugins: [
    // proxy: {
    //  '/home': {
    //  "target": "https://react-app-iota-nine.vercel.app/",
    //  "changeOrigin": true,}}
    react(),
    tailwindcss(),
  ],
})
