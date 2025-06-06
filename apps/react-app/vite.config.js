import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa';


export default defineConfig({

  base: '/',

  plugins: [

    react(),

    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Young Eagles',
        short_name: 'YoungEagles',
        description: 'A homework management app for parents and teachers.',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),

  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})