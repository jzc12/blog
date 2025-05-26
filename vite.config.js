

// vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'vite-plugin-vue-markdown'

export default defineConfig({
  base: '/blog/',
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    Markdown(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  assetsDir: 'static',
  server: {
    historyApiFallback: true,
  },
})
