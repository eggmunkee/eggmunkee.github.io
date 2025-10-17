import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  build: {
    outDir: '../docs'
  },
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          audio: ["src"], // allow audio source alias resolution
          img: ["src"],
          Song: ["url"]
        }
      }
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  publicDir: command == 'serve' ? '../docs' : 'public'
}))
