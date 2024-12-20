import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue2 from '@vitejs/plugin-vue2'
import vue2Jsx from '@vitejs/plugin-vue2-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue2(),
    vue2Jsx(),
    // legacy({
    //   targets: ['chrome >= 64', 'edge >= 79', 'firefox >= 67', 'safari >= 11.1'],
    //   modernPolyfills: true
    // })
  ],
  build: {
    target: 'es2018',
    minify: 'terser',
    outDir: 'dist' 
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    exclude: ['vue-demi']
  },
  define: {
    'process.env': process.env
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_URL || 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
