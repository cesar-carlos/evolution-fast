import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  base: '/qrcode/',
  build: {
    outDir: '../../dist_extensions',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve('./src'),
      '~': resolve('./src'),
    },
  },
  server: {
    proxy: {
      '/qrcode': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
